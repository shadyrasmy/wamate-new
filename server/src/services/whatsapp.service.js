const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    downloadContentFromMessage
} = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const pino = require('pino');
const path = require('path');
const fs = require('fs');
const { WhatsAppInstance, Message, Contact } = require('../models');
const { Op } = require('sequelize');
const { io } = require('../index');
const QueueService = require('./queue.service');

// Store active sockets and retry counts
const sessions = new Map();
const retryCounts = new Map();
const MAX_RETRIES = 5;

class WhatsAppService {
    constructor() {
        this.sessionsDir = path.join(__dirname, '../../sessions');
        this.uploadDir = path.join(__dirname, '../../public/uploads');
        if (!fs.existsSync(this.sessionsDir)) {
            fs.mkdirSync(this.sessionsDir);
        }
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir, { recursive: true });
        }
        // Auto-restore sessions on startup
        this.restoreSessions();
    }

    async restoreSessions() {
        try {
            const instances = await WhatsAppInstance.findAll({ where: { status: 'connected' } });
            console.log(`[WA] Restoring ${instances.length} sessions...`);
            for (const instance of instances) {
                this.initializeInstance(instance.instance_id);
            }
        } catch (error) {
            console.error('[WA] Error restoring sessions:', error);
        }
    }

    async initializeInstance(instanceId) {
        try {
            const logger = pino({ level: 'debug' });
            const { state, saveCreds } = await useMultiFileAuthState(path.join(this.sessionsDir, instanceId));
            const { version } = await fetchLatestBaileysVersion();

            console.log(`[WA] Initializing instance ${instanceId}`);

            const sock = makeWASocket({
                version,
                logger,
                printQRInTerminal: false,
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, logger),
                },
                browser: ['Ubuntu', 'Chrome', '20.0.04'],
                generateHighQualityLinkPreview: true,
                markOnlineOnConnect: false, // Don't auto-send presence
                connectTimeoutMs: 60000,
            });

            sock.ev.on('creds.update', saveCreds);

            sock.ev.on('connection.update', async (update) => {
                const { connection, lastDisconnect, qr } = update;

                if (qr) {
                    this.emitToRoom(instanceId, 'qr', { qr });
                    await WhatsAppInstance.update({ status: 'connecting', qr_code: qr }, { where: { instance_id: instanceId } });
                }

                if (connection === 'close') {
                    const statusCode = (lastDisconnect?.error instanceof Boom)?.output?.statusCode;
                    const shouldReconnect = statusCode !== DisconnectReason.loggedOut;

                    console.log(`[WA] Connection closed for ${instanceId}. Reconnecting: ${shouldReconnect}`);

                    await WhatsAppInstance.update({ status: 'disconnected' }, { where: { instance_id: instanceId } });
                    sessions.delete(instanceId);

                    if (shouldReconnect) {
                        const retries = retryCounts.get(instanceId) || 0;
                        if (retries < MAX_RETRIES) {
                            const delay = Math.pow(2, retries) * 1000; // Exponential backoff
                            console.log(`[WA] Retrying in ${delay}ms... (Attempt ${retries + 1}/${MAX_RETRIES})`);
                            retryCounts.set(instanceId, retries + 1);
                            setTimeout(() => this.initializeInstance(instanceId), delay);
                        } else {
                            console.error(`[WA] Max retries reached for ${instanceId}`);
                        }
                    } else {
                        // Logged out
                        retryCounts.delete(instanceId);
                        if (fs.existsSync(path.join(this.sessionsDir, instanceId))) {
                            fs.rmSync(path.join(this.sessionsDir, instanceId), { recursive: true, force: true });
                        }
                    }
                } else if (connection === 'open') {
                    console.log(`[WA] Connection opened for ${instanceId}`);
                    retryCounts.set(instanceId, 0); // Reset retries

                    const connectedName = sock.user.name || sock.user.id.split(':')[0];
                    const currentInstance = await WhatsAppInstance.findOne({ where: { instance_id: instanceId } });

                    // If instance name is generic, update it to connected phone name
                    const updatedName = (currentInstance && (currentInstance.name.startsWith('Instance') || currentInstance.name.startsWith('Whatsapp Node')))
                        ? connectedName
                        : currentInstance.name;

                    await WhatsAppInstance.update({
                        status: 'connected',
                        qr_code: null,
                        phone_number: sock.user.id.split(':')[0],
                        name: updatedName
                    }, { where: { instance_id: instanceId } });

                    this.emitToRoom(instanceId, 'connection_update', { status: 'connected', user: sock.user, name: updatedName });
                }
            });

            // Handle incoming messages
            sock.ev.on('messages.upsert', async ({ messages, type }) => {
                console.log(`[DEBUG] Baileys Upsert: Type=${type}, Count=${messages.length}`);
                for (const msg of messages) {
                    if (!msg.message && !msg.messageStubType) continue;
                    await this.saveMessage(instanceId, msg);
                }
            });

            // Handle contact updates (vital for LID/Phone mapping)
            sock.ev.on('contacts.upsert', async (contacts) => {
                console.log(`[DEBUG] Contacts Upsert: ${contacts.length} contacts`);
                for (const contact of contacts) {
                    await this.handleContactUpdate(instanceId, contact);
                }
            });

            sock.ev.on('contacts.update', async (updates) => {
                console.log(`[DEBUG] Contacts Update: ${updates.length} updates`);
                for (const update of updates) {
                    await this.handleContactUpdate(instanceId, update);
                }
            });

            // Handle LID-Phone mapping updates (THE KEY FIX for JID-LID connection!)
            sock.ev.on('lid-mapping.update', async (mapping) => {
                try {
                    console.log(`[DEBUG] LID Mapping Update:`, JSON.stringify(mapping));

                    // Extract pn (phone number) and lid from the mapping
                    const pn = mapping?.pn || mapping?.pnUser;
                    const lidValue = mapping?.lid || mapping?.lidUser;

                    if (!pn || !lidValue) {
                        console.log(`[DEBUG] LID Mapping missing pn or lid, skipping`);
                        return;
                    }

                    const phoneJid = pn.includes('@') ? pn : `${pn}@s.whatsapp.net`;
                    const lid = lidValue.includes('@') ? lidValue : `${lidValue}@lid`;

                    console.log(`[WA] Processing LID Mapping: ${phoneJid} <-> ${lid}`);

                    const instance = await WhatsAppInstance.findOne({ where: { instance_id: instanceId } });
                    if (!instance) return;

                    // Find existing contacts by phone JID or LID
                    const candidates = await Contact.findAll({
                        where: {
                            user_id: instance.user_id,
                            instance_id: instance.id,
                            [Op.or]: [
                                { jid: phoneJid },
                                { jid: lid },
                                { lid: lid },
                                { lid: phoneJid }
                            ]
                        }
                    });

                    const phoneContact = candidates.find(c => c.jid === phoneJid);
                    const lidContact = candidates.find(c => c.jid === lid && c.id !== phoneContact?.id);

                    if (phoneContact && lidContact) {
                        // MERGE: We have both - merge LID contact into phone contact
                        console.log(`[WA] Merging LID contact ${lidContact.jid} into phone contact ${phoneContact.jid}`);
                        phoneContact.lid = lid;
                        phoneContact.name = phoneContact.name || lidContact.name;
                        phoneContact.push_name = phoneContact.push_name || lidContact.push_name;
                        phoneContact.profile_pic = phoneContact.profile_pic || lidContact.profile_pic;
                        await phoneContact.save();

                        // Move any messages from LID contact to phone contact
                        await Message.update(
                            { jid: phoneJid },
                            { where: { jid: lid, instance_id: instance.id } }
                        );

                        // Delete the duplicate LID contact
                        await lidContact.destroy();
                        console.log(`[WA] Merged and deleted duplicate LID contact`);
                    } else if (phoneContact && !phoneContact.lid) {
                        // UPDATE: Phone contact exists but has no LID - add it
                        console.log(`[WA] Adding LID ${lid} to existing phone contact ${phoneContact.jid}`);
                        phoneContact.lid = lid;
                        await phoneContact.save();
                    } else if (lidContact && !phoneContact) {
                        // UPGRADE: LID contact exists but no phone contact - upgrade it
                        console.log(`[WA] Upgrading LID contact ${lidContact.jid} to phone ${phoneJid}`);
                        lidContact.lid = lidContact.jid;
                        lidContact.jid = phoneJid;
                        await lidContact.save();
                    }
                    // If neither exists, we'll create the contact when a message arrives
                } catch (error) {
                    console.error('[WA] Error handling LID mapping:', error);
                }
            });

            sessions.set(instanceId, sock);
            return sock;
        } catch (error) {
            console.error(`[WA] Error initializing instance ${instanceId}:`, error);
            await WhatsAppInstance.update({ status: 'disconnected' }, { where: { instance_id: instanceId } });
        }
    }

    async requestPairingCode(instanceId, phoneNumber) {
        try {
            const sock = sessions.get(instanceId);
            if (!sock) throw new Error('Instance not initialized');

            // Format phone number: remove any non-digits
            const cleanedNumber = phoneNumber.replace(/\D/g, '');
            const code = await sock.requestPairingCode(cleanedNumber);
            return code;
        } catch (error) {
            console.error(`[WA] Error requesting pairing code for ${instanceId}:`, error);
            throw error;
        }
    }

    async handleContactUpdate(instanceId, update) {
        try {
            const { Contact, WhatsAppInstance } = require('../models');
            const { jidNormalizedUser } = require('@whiskeysockets/baileys');
            const { Op } = require('sequelize');

            let jid = jidNormalizedUser(update.id);
            if (!jid || jid.endsWith('@broadcast')) return;

            // Only care about LID/Phone mappings
            const lid = update.lid || (jid.endsWith('@lid') ? jid : null);
            const phoneJid = update.pn ? `${update.pn}@s.whatsapp.net` : (jid.endsWith('@s.whatsapp.net') ? jid : null);

            // Fetch the instance to get user_id
            const instance = await WhatsAppInstance.findOne({ where: { instance_id: instanceId } });
            if (!instance) return;

            // Find existing contact by JID or LID
            let contact = await Contact.findOne({
                where: {
                    user_id: instance.user_id,
                    instance_id: instance.id,
                    [Op.or]: [
                        { jid: jid },
                        { lid: jid },
                        ...(lid ? [{ lid: lid }] : []),
                        ...(phoneJid ? [{ jid: phoneJid }] : [])
                    ]
                }
            });

            if (contact) {
                let changed = false;
                if (lid && contact.lid !== lid) {
                    contact.lid = lid;
                    changed = true;
                }

                // Upgrade LID record to Phone JID if available
                if (contact.jid.endsWith('@lid') && phoneJid && !phoneJid.endsWith('@lid')) {
                    contact.lid = contact.jid;
                    contact.jid = phoneJid;
                    changed = true;
                }

                if (update.name && contact.name !== update.name && !update.name.match(/^\d+$/)) {
                    contact.name = update.name;
                    changed = true;
                }

                if (changed) {
                    console.log(`[DEBUG] Updated existing contact mapping for ${contact.jid} (LID: ${contact.lid})`);
                    await contact.save();
                }
            } else if (phoneJid && lid) {
                // If they don't exist, but we HAVE a mapping, create it now!
                console.log(`[DEBUG] Creating NEW mapped contact from sync: ${phoneJid} -> ${lid}`);
                await Contact.create({
                    jid: phoneJid,
                    lid: lid,
                    user_id: instance.user_id,
                    instance_id: instance.id,
                    name: update.name || phoneJid.split('@')[0],
                    push_name: update.name,
                    last_active: new Date()
                });
            }
        } catch (error) {
            console.error('[WA] Error handling contact update:', error);
        }
    }

    emitToRoom(instanceId, event, data) {
        if (global.io) global.io.to(instanceId).emit(event, data);
    }

    async saveMessage(instanceId, msg) {
        try {
            const fromMe = msg.key.fromMe;
            const { jidNormalizedUser } = require('@whiskeysockets/baileys');

            let rawJid = msg.key.remoteJid;
            let lid = rawJid.endsWith('@lid') ? rawJid : null;
            let jid = rawJid;

            // Log the raw message metadata to debug "nested" or hidden fields
            console.log(`[DEBUG] Raw Message JID: ${rawJid}, senderPn: ${msg.key.senderPn}, lid: ${lid}`);

            // If we have a senderPn, that is a guaranteed Phone JID from WhatsApp
            if (msg.key.senderPn) {
                jid = `${msg.key.senderPn}@s.whatsapp.net`;
            }

            jid = jidNormalizedUser(jid);
            rawJid = jidNormalizedUser(rawJid);

            const participant = msg.key.participant || msg.participant || null; // Sender JID in a group
            const isGroup = jid.endsWith('@g.us');

            // FIX: If we have a LID but no senderPn, look up the phone JID from the database
            // This prevents conversations from being split between LID and phone JID
            if (lid && !msg.key.senderPn && !isGroup) {
                try {
                    const instance = await WhatsAppInstance.findOne({ where: { instance_id: instanceId } });
                    if (instance) {
                        // Look for existing contact that has this LID mapped to a phone JID
                        const existingContact = await Contact.findOne({
                            where: {
                                user_id: instance.user_id,
                                instance_id: instance.id,
                                lid: lid,
                                jid: { [Op.notLike]: '%@lid' } // Has a phone JID, not another LID
                            }
                        });

                        if (existingContact) {
                            console.log(`[WA] Found LID mapping in DB: ${lid} -> ${existingContact.jid}`);
                            jid = existingContact.jid;
                        } else {
                            // Also check if there's a contact with this LID as their primary JID but with a different lid field
                            const altContact = await Contact.findOne({
                                where: {
                                    user_id: instance.user_id,
                                    instance_id: instance.id,
                                    [Op.or]: [
                                        { jid: lid },
                                        { lid: lid }
                                    ]
                                }
                            });

                            if (altContact && !altContact.jid.endsWith('@lid')) {
                                console.log(`[WA] Found phone contact with matching LID: ${lid} -> ${altContact.jid}`);
                                jid = altContact.jid;
                            } else {
                                console.log(`[WA] No LID mapping found in DB for ${lid}, will create new contact`);
                            }
                        }
                    }
                } catch (lookupErr) {
                    console.error(`[WA] Error looking up LID mapping:`, lookupErr);
                }
            }

            console.log(`[DEBUG] saveMessage START. JID: ${jid}. Participant: ${participant}. FromMe: ${fromMe}`);

            // Normalize JID: Ensure domain exists (legacy check)
            if (!jid.includes('@')) {
                jid = `${jid}@s.whatsapp.net`;
            }

            // EXTRACT CONTENT AND MEDIA
            let textContent = '';
            let mediaUrl = null;
            const m = msg.message;
            if (!m) {
                console.log(`[WA] Skipped message with no content from ${jid}`);
                return;
            }

            // Handle Reactions specifically
            if (m.reactionMessage) {
                textContent = m.reactionMessage.text; // The emoji
            } else if (m.senderKeyDistributionMessage || m.protocolMessage) {
                // System messages usually invalid for display
                console.log(`[WA] Skipping system message type: ${Object.keys(m)[0]}`);
                return;
            } else if (m.conversation) {
                textContent = m.conversation;
            } else if (m.extendedTextMessage) {
                textContent = m.extendedTextMessage.text;
            } else if (m.imageMessage) {
                textContent = m.imageMessage.caption || '📷 Image';
                mediaUrl = await this.downloadMedia(m.imageMessage, 'image');
            } else if (m.videoMessage) {
                textContent = m.videoMessage.caption || '🎥 Video';
                mediaUrl = await this.downloadMedia(m.videoMessage, 'video');
            } else if (m.audioMessage) {
                textContent = '🎤 Audio';
                mediaUrl = await this.downloadMedia(m.audioMessage, 'audio');
            } else if (m.stickerMessage) {
                textContent = '👾 Sticker';
                mediaUrl = await this.downloadMedia(m.stickerMessage, 'sticker');
            } else if (m.albumMessage) {
                // Handle album (usually contains multiple images, we'll try to extract context or generic)
                textContent = m.albumMessage.caption || '📸 Album';
                // Albums are complex, often containing array of messages. For now, basic support.
            } else {
                textContent = Object.keys(m)[0];
            }

            let messageType = Object.keys(m)[0].replace('Message', '');
            if (messageType === 'conversation') messageType = 'text';
            if (messageType === 'extendedText') messageType = 'text';

            // Support for quoted messages
            let quotedMessageId = null;
            if (m.extendedTextMessage?.contextInfo?.stanzaId) {
                quotedMessageId = m.extendedTextMessage.contextInfo.stanzaId;
            } else if (m[Object.keys(m)[0]]?.contextInfo?.stanzaId) {
                quotedMessageId = m[Object.keys(m)[0]].contextInfo.stanzaId;
            }

            const instance = await WhatsAppInstance.findOne({ where: { instance_id: instanceId } });
            if (!instance) return;

            // NEW: Chat ON/OFF Toggle
            // If chat logging is disabled, we skip saving to DB entirely
            if (!instance.chat_enabled) {
                console.log(`[WA] Chat logging is DISABLED for instance ${instanceId}. skipping save.`);

                // Still emit for real-time UI (ephemeral)
                const ephemeralMsg = {
                    id: msg.key.id,
                    content: textContent,
                    isMe: fromMe,
                    type: messageType,
                    mediaUrl: mediaUrl,
                    senderName: fromMe ? 'Me' : (msg.pushName || null),
                    senderJid: participant || (fromMe ? 'me' : jid),
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    status: 'sent'
                };
                this.emitToRoom(instanceId, 'new_message', ephemeralMsg);
                return;
            }

            // UPSERT CONTACT(S)
            try {
                // Helper to fetch profile pic safely
                const getProfilePic = async (targetJid) => {
                    try {
                        return await sessions.get(instanceId)?.profilePictureUrl(targetJid, 'image').catch(() => null);
                    } catch (e) { return null; }
                };

                // Find candidates for merging
                let candidates = await Contact.findAll({
                    where: {
                        user_id: instance.user_id,
                        instance_id: instance.id,
                        [Op.or]: [
                            { jid: jid },
                            { lid: jid },
                            { jid: rawJid },
                            { lid: rawJid },
                            ...(lid ? [{ jid: lid }, { lid: lid }] : [])
                        ]
                    }
                });

                let existingContact = candidates.find(c => c.jid === jid || (lid && c.lid === lid));

                // NEW: If we didn't find it in DB, check if the Socket knows the mapping
                if (!existingContact && lid && sessions.get(instanceId)) {
                    const sock = sessions.get(instanceId);
                    // Baileys sometimes stores these in sock.authState.creds.me or a hidden store
                    // But we can also check if we can fetch the PN for this LID
                    console.log(`[DEBUG] No DB contact for LID ${lid}. checking socket store...`);
                }

                let otherContact = candidates.find(c => c.id !== existingContact?.id);

                // LOGIC: If we found a contact by LID but the current msg JID is Phone,
                // or if we found two separate records, we MUST merge.
                if (existingContact && otherContact && existingContact.id !== otherContact.id) {
                    console.log(`[DEBUG] Record Collision found for ${jid}. Merging contacts.`);
                    // Merge otherContact into existingContact
                    existingContact.lid = lid || existingContact.lid || otherContact.lid || (otherContact.jid.endsWith('@lid') ? otherContact.jid : null);
                    existingContact.profile_pic = existingContact.profile_pic || otherContact.profile_pic;

                    if ((!existingContact.name || existingContact.name.match(/^\d+$/)) && otherContact.name) {
                        existingContact.name = otherContact.name;
                    }

                    await existingContact.save();
                    await otherContact.destroy();
                } else if (!existingContact && otherContact) {
                    // We found one contact by a secondary identifier.
                    // If it's an LID-only contact and we now have a Phone JID, upgrade it!
                    if (otherContact.jid.endsWith('@lid') && !jid.endsWith('@lid')) {
                        console.log(`[DEBUG] Upgrading LID contact ${otherContact.jid} to Phone ${jid}`);
                        otherContact.lid = otherContact.jid;
                        otherContact.jid = jid;
                        await otherContact.save();
                        existingContact = otherContact;
                    } else if (!otherContact.jid.endsWith('@lid') && jid.endsWith('@lid')) {
                        // We have a phone contact, but the current message came via LID.
                        // DO NOT create a new record. Use the phone contact.
                        console.log(`[DEBUG] Using existing Phone contact ${otherContact.jid} for LID message ${jid}`);
                        if (!otherContact.lid) otherContact.lid = jid;
                        await otherContact.save();
                        existingContact = otherContact;
                        jid = otherContact.jid; // Redirect message storage to canonical JID
                    } else {
                        existingContact = otherContact;
                    }
                }

                // Ensure jid is canonical before saving
                if (existingContact && !existingContact.jid.endsWith('@lid') && jid.endsWith('@lid')) {
                    jid = existingContact.jid;
                }

                // Only fetch profile pic if it's new or we don't have it
                let profilePicUrl = existingContact?.profile_pic;
                if (!profilePicUrl) {
                    profilePicUrl = await getProfilePic(jid);
                }

                await Contact.upsert({
                    jid: jid,
                    lid: lid || existingContact?.lid,
                    user_id: instance.user_id,
                    instance_id: instance.id,
                    name: (isGroup ? (existingContact?.name || jid.split('@')[0]) : (msg.pushName || existingContact?.name || jid.split('@')[0])),
                    push_name: isGroup ? null : (msg.pushName || existingContact?.push_name),
                    is_group: isGroup,
                    profile_pic: profilePicUrl,
                    last_active: new Date()
                });

                // 2. Individual Sender Contact (if in group)
                if (isGroup && participant) {
                    const existingParticipant = await Contact.findOne({
                        where: { user_id: instance.user_id, instance_id: instance.id, jid: participant }
                    });
                    let pPic = existingParticipant?.profile_pic;
                    if (!pPic) pPic = await getProfilePic(participant);

                    await Contact.upsert({
                        jid: participant,
                        user_id: instance.user_id,
                        instance_id: instance.id,
                        name: msg.pushName || participant.split('@')[0],
                        push_name: msg.pushName,
                        is_group: false,
                        profile_pic: pPic,
                        last_active: new Date()
                    });
                }
            } catch (err) {
                console.error('[DEBUG] Error upserting contact:', err);
            }

            // Save Message
            const [savedMsg, created] = await Message.upsert({
                instance_id: instance.id,
                user_id: instance.user_id,
                message_id: msg.key.id,
                jid,
                from_me: fromMe,
                type: messageType,
                content: textContent,
                media_url: mediaUrl,
                timestamp: new Date((msg.messageTimestamp || Date.now() / 1000) * 1000),
                sender_jid: participant || (fromMe ? 'me' : jid),
                sender_name: fromMe ? 'Me' : (msg.pushName || null),
                quoted_message_id: quotedMessageId
            });

            // Emit for real-time UI
            const parsedMsg = {
                id: savedMsg.message_id,
                content: savedMsg.content,
                isMe: savedMsg.from_me,
                type: savedMsg.type,
                mediaUrl: savedMsg.media_url,
                senderName: savedMsg.sender_name,
                senderJid: savedMsg.sender_jid,
                chatJid: savedMsg.jid, // CRITICAL: The actual conversation JID (remote)
                quotedMessage: savedMsg.quotedMessage ? {
                    id: savedMsg.quotedMessage.message_id,
                    content: savedMsg.quotedMessage.content
                } : null,
                time: new Date(savedMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                status: savedMsg.status || 'read'
            };
            this.emitToRoom(instanceId, 'new_message', parsedMsg);

            if (!fromMe) {
                const assignmentService = require('./assignment.service');
                await assignmentService.assignChat(instanceId, instance.user_id, jid);
            }
        } catch (e) {
            console.error('Error saving message:', e);
        }
    }

    async downloadMedia(message, type) {
        try {
            const stream = await downloadContentFromMessage(message, type);
            let buffer = Buffer.from([]);
            for await (const chunk of stream) {
                buffer = Buffer.concat([buffer, chunk]);
            }

            const fileName = `${Date.now()}-${Math.floor(Math.random() * 10000)}.${type === 'image' ? 'jpg' : (type === 'video' ? 'mp4' : (type === 'sticker' ? 'webp' : 'ogg'))}`;
            const filePath = path.join(this.uploadDir, fileName);
            fs.writeFileSync(filePath, buffer);

            const publicUrl = `${process.env.PUBLIC_URL || ''}/public/uploads/${fileName}`;
            return publicUrl;
        } catch (error) {
            console.error('[WA] Media download failed:', error);
            return null;
        }
    }

    async getInstance(instanceId) {
        let sock = sessions.get(instanceId);
        if (!sock) {
            // If not in memory but valid session exists, try restore
            if (fs.existsSync(path.join(this.sessionsDir, instanceId))) {
                return await this.initializeInstance(instanceId);
            }
            throw new Error(`WhatsApp session for instance [${instanceId}] is not active in memory. It might be initializing or needs a QR scan.`);
        }
        return sock;
    }

    async sendMessage(instanceId, jid, content, options = {}) {
        const sock = await this.getInstance(instanceId);
        if (!sock) throw new Error(`Communication gateway for [${instanceId}] is unavailable.`);

        // Use Queue Service to throttle sending
        return QueueService.add(instanceId, async () => {
            console.log(`[Queue] Processing message for ${instanceId} -> ${jid}`);
            const result = await sock.sendMessage(jid, content, options);

            // Explicitly save the outgoing message (Result is the Full Message Object)
            if (result) {
                console.log(`[WA] Explicitly saving sent message: ${result.key.id}`);
                await this.saveMessage(instanceId, result);
            }

            return result;
        });
    }

    async deleteInstance(instanceId) {
        const sock = sessions.get(instanceId);
        if (sock) {
            sock.end(undefined);
            sessions.delete(instanceId);
        }
        if (fs.existsSync(path.join(this.sessionsDir, instanceId))) {
            fs.rmSync(path.join(this.sessionsDir, instanceId), { recursive: true, force: true });
        }
    }
}

module.exports = new WhatsAppService();
