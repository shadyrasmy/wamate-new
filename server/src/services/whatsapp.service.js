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
const { User, WhatsAppInstance, SiteConfig, Contact, Message, Lead, Order, LidMapping } = require('../models');
const { Op } = require('sequelize');
const QueueService = require('./queue.service');
const aiService = require('./ai.service');
const {
    MAX_VIDEO_BYTES,
    PROFILE_IMAGE_MAX_BYTES,
    byteLengthToNumber,
    getExtension,
    getPublicUploadUrl,
    isLocalUploadUrl,
    safeFileStem
} = require('../utils/media');

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
                    const errorMessage = lastDisconnect?.error?.message || '';

                    // Detect session corruption (Bad MAC = session keys mismatch)
                    const isSessionCorrupted = errorMessage.includes('Bad MAC') ||
                        errorMessage.includes('prekey bundle') ||
                        errorMessage.includes('decryption-failed');

                    if (isSessionCorrupted) {
                        console.error(`[WA] ⚠️ Session ${instanceId} appears CORRUPTED (Bad MAC)`);
                        console.error('[WA] Consider deleting session folder and re-scanning QR');
                        retryCounts.set(instanceId, MAX_RETRIES); // Stop retrying corrupted sessions
                    }

                    const shouldReconnect = statusCode !== DisconnectReason.loggedOut && !isSessionCorrupted;

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
                console.log(`[DEBUG] Baileys Upsert: Type = ${type}, Count = ${messages.length}`);
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

            // Handle LID-Phone mapping updates (WITH DUPLICATE VALIDATION)
            sock.ev.on('lid-mapping.update', async (mapping) => {
                try {
                    console.log(`[DEBUG] 🔄 LID Mapping Event Fired!`);
                    console.log(`[DEBUG] Full mapping data:`, JSON.stringify(mapping));

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

                    // NEW: Persist mapping to lid_mappings table
                    await LidMapping.upsert({
                        jid: phoneJid,
                        lid: lid,
                        instance_id: instance.id
                    }).catch(err => console.error('[WA] Error upserting LidMapping:', err));

                    // Find existing contacts by phone JID or LID
                    const candidates = await Contact.findAll({
                        where: {
                            user_id: instance.user_id,
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

                    // 🚨 VALIDATION: Check if this LID is already assigned to a DIFFERENT phone number
                    const lidOwnerCheck = await Contact.findOne({
                        where: {
                            user_id: instance.user_id,
                            lid: lid,
                            jid: {
                                [Op.ne]: phoneJid,
                                [Op.notLike]: '%@lid'
                            } // Must be a phone number, not another LID
                        }
                    });

                    if (lidOwnerCheck) {
                        console.log(`[WA] ⚠️  CONFLICT DETECTED: LID ${lid} is already assigned to ${lidOwnerCheck.jid}`);
                        console.log(`[WA]    Baileys is trying to assign it to ${phoneJid} - REJECTING to prevent cross-contamination`);
                        return; // Skip this mapping - it's corrupted data from Baileys
                    }

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
                    const existingPhoneContact = await Contact.findOne({
                        where: {
                            user_id: instance.user_id,
                            jid: phoneJid,
                            id: { [Op.ne]: contact.id }
                        }
                    });

                    if (existingPhoneContact) {
                        existingPhoneContact.lid = existingPhoneContact.lid || contact.lid || contact.jid;
                        existingPhoneContact.name = existingPhoneContact.name || contact.name;
                        existingPhoneContact.push_name = existingPhoneContact.push_name || contact.push_name;
                        existingPhoneContact.profile_pic = existingPhoneContact.profile_pic || contact.profile_pic;

                        if (update.name && existingPhoneContact.name !== update.name && !update.name.match(/^\d+$/)) {
                            existingPhoneContact.name = update.name;
                        }

                        await existingPhoneContact.save();

                        const sourceJids = [...new Set([contact.jid, contact.lid].filter(Boolean))];
                        if (sourceJids.length > 0) {
                            await Message.update(
                                { jid: phoneJid },
                                {
                                    where: {
                                        jid: { [Op.in]: sourceJids },
                                        instance_id: instance.id
                                    }
                                }
                            );
                        }

                        await contact.destroy();
                        contact = existingPhoneContact;
                    } else {
                        contact.lid = contact.jid;
                        contact.jid = phoneJid;
                        changed = true;
                    }
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
                console.log(`[DEBUG] Creating/Updating NEW mapped contact from sync: ${phoneJid} -> ${lid}`);
                await Contact.upsert({
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

    async mirrorProfilePicture(url, targetJid) {
        if (!url || isLocalUploadUrl(url)) return url || null;

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);

        try {
            const response = await fetch(url, { signal: controller.signal });
            if (!response.ok) return null;

            const mimeType = response.headers.get('content-type') || 'image/jpeg';
            if (!mimeType.startsWith('image/')) return null;

            const buffer = Buffer.from(await response.arrayBuffer());
            if (!buffer.length || buffer.length > PROFILE_IMAGE_MAX_BYTES) return null;

            const extension = mimeType.includes('png')
                ? 'png'
                : (mimeType.includes('webp') ? 'webp' : 'jpg');
            const fileName = `profile-${safeFileStem(targetJid)}-${Date.now()}.${extension}`;
            await fs.promises.writeFile(path.join(this.uploadDir, fileName), buffer);

            return getPublicUploadUrl(fileName);
        } catch (error) {
            console.warn(`[WA] Failed to mirror profile picture for ${targetJid}: ${error.message}`);
            return null;
        } finally {
            clearTimeout(timeout);
        }
    }

    async getPersistentProfilePic(instanceId, targetJid) {
        try {
            const remoteUrl = await sessions.get(instanceId)?.profilePictureUrl(targetJid, 'image').catch(() => null);
            if (!remoteUrl) return null;

            return await this.mirrorProfilePicture(remoteUrl, targetJid);
        } catch (e) {
            return null;
        }
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
                const mediaData = await this.downloadMedia(instanceId, m.imageMessage, 'image', true, msg);
                mediaUrl = mediaData.url;
                msg.mediaBuffer = mediaData.buffer;
                msg.mimeType = m.imageMessage.mimetype;
            } else if (m.videoMessage) {
                textContent = m.videoMessage.caption || '🎥 Video';
                const videoLength = byteLengthToNumber(m.videoMessage.fileLength);
                if (videoLength && videoLength > MAX_VIDEO_BYTES) {
                    textContent = 'Video rejected: file is larger than 10MB';
                    console.warn(`[WA] Rejected inbound video larger than 10MB (${videoLength} bytes)`);
                } else {
                    mediaUrl = await this.downloadMedia(instanceId, m.videoMessage, 'video', false, msg);
                }
            } else if (m.audioMessage) {
                textContent = '🎤 Audio';
                const mediaData = await this.downloadMedia(instanceId, m.audioMessage, 'audio', true, msg);
                mediaUrl = mediaData.url;
                msg.mediaBuffer = mediaData.buffer;
                msg.mimeType = m.audioMessage.mimetype;
            } else if (m.stickerMessage) {
                textContent = '👾 Sticker';
                mediaUrl = await this.downloadMedia(instanceId, m.stickerMessage, 'sticker', false, msg);
            } else if (m.documentMessage) {
                // Handle documents (PDF, Excel, Word, etc.)
                const fileName = m.documentMessage.fileName || 'Document';
                textContent = `📄 ${fileName}`;
                const mediaData = await this.downloadMedia(instanceId, m.documentMessage, 'document', true, msg);
                mediaUrl = mediaData.url;
                msg.mediaBuffer = mediaData.buffer;
                msg.mimeType = m.documentMessage.mimetype;
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
            let existingContact = null;
            try {
                // Helper to fetch profile pic safely
                const getProfilePic = async (targetJid) => {
                    return this.getPersistentProfilePic(instanceId, targetJid);
                };

                // NEW: If this is an LID, check if we have a persistent mapping to a Phone JID
                if (jid.endsWith('@lid') || (lid && lid.endsWith('@lid'))) {
                    const lookupLid = jid.endsWith('@lid') ? jid : lid;
                    try {
                        const mapping = await LidMapping.findOne({
                            where: { lid: lookupLid, instance_id: instance.id }
                        });
                        if (mapping) {
                            console.log(`[WA] Found persistent mapping for message: ${lookupLid} -> ${mapping.jid}`);
                            rawJid = mapping.jid;
                        }
                    } catch (err) {
                        console.error('[WA] Error looking up LidMapping in saveMessage:', err);
                    }
                }

                // Find candidates for merging
                let candidates = await Contact.findAll({
                    where: {
                        user_id: instance.user_id,
                        [Op.or]: [
                            { jid: jid },
                            { lid: jid },
                            { jid: rawJid },
                            { lid: rawJid },
                            ...(lid ? [{ jid: lid }, { lid: lid }] : [])
                        ]
                    }
                });

                existingContact = candidates.find(c => c.jid === jid || (lid && c.lid === lid));

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
                if (!profilePicUrl || !isLocalUploadUrl(profilePicUrl)) {
                    const freshProfilePic = await getProfilePic(jid);
                    profilePicUrl = freshProfilePic || (isLocalUploadUrl(profilePicUrl) ? profilePicUrl : null);
                }

                // FIX: If fromMe is true, DO NOT update the contact name to the pushName
                const newName = fromMe
                    ? (existingContact?.name || jid.split('@')[0])
                    : (msg.pushName || existingContact?.name || jid.split('@')[0]);

                const contactData = {
                    jid: jid,
                    lid: lid || existingContact?.lid,
                    user_id: instance.user_id,
                    instance_id: instance.id,
                    name: isGroup ? (existingContact?.name || jid.split('@')[0]) : newName,
                    push_name: fromMe ? existingContact?.push_name : (isGroup ? null : (msg.pushName || existingContact?.push_name)),
                    is_group: isGroup,
                    profile_pic: profilePicUrl,
                    last_active: new Date()
                };

                await Contact.upsert(contactData);

                // 🔄 SMART AUTO-MERGE: If this is a LID contact with a profile pic, check for duplicates
                if (jid.endsWith('@lid') && profilePicUrl && !isGroup) {
                    console.log(`[WA] 🔍 New LID contact with photo - checking for duplicates: ${jid}`);

                    // Look for other contacts with same profile photo
                    const duplicates = await Contact.findAll({
                        where: {
                            profile_pic: profilePicUrl,
                            user_id: instance.user_id,
                            id: { [Op.ne]: existingContact?.id || 'none' }
                        }
                    });

                    // Find the phone contact (prefer phone over LID)
                    const phoneContact = duplicates.find(d => !d.jid.endsWith('@lid'));

                    if (phoneContact) {
                        console.log(`[WA] 🎯 Auto-merge opportunity: LID ${jid} matches phone ${phoneContact.jid}`);
                        console.log(`[WA]    Updating phone contact with LID mapping...`);

                        // Update the phone contact with the LID
                        if (!phoneContact.lid) {
                            phoneContact.lid = jid;
                            await phoneContact.save();
                            console.log(`[WA] ✅ Auto-merged! Phone contact now has LID.`);
                        }

                        // Migrate any messages from LID to phone
                        const msgCount = await Message.count({ where: { jid: jid, instance_id: instance.id } });
                        if (msgCount > 0) {
                            await Message.update(
                                { jid: phoneContact.jid },
                                { where: { jid: jid, instance_id: instance.id } }
                            );
                            console.log(`[WA] 📨 Migrated ${msgCount} messages from LID to phone contact`);
                        }

                        // Delete the LID-only contact
                        await Contact.destroy({ where: { jid: jid, user_id: instance.user_id } });
                        console.log(`[WA] 🗑️  Deleted duplicate LID contact`);
                    }
                }

                // 2. Individual Sender Contact (if in group)
                if (isGroup && participant) {
                    const existingParticipant = await Contact.findOne({
                        where: { user_id: instance.user_id, jid: participant }
                    });
                    let pPic = existingParticipant?.profile_pic;
                    if (!pPic || !isLocalUploadUrl(pPic)) {
                        const freshParticipantPic = await getProfilePic(participant);
                        pPic = freshParticipantPic || (isLocalUploadUrl(pPic) ? pPic : null);
                    }

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

            // Save Message with graceful error handling
            let savedMsg;
            try {
                [savedMsg] = await Message.upsert({
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
            } catch (dbErr) {
                console.error('[WA] ⚠️ DB save failed, skipping message:', dbErr.message);
                return; // Don't crash the pipeline - continue processing other messages
            }

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
                lid: lid || existingContact?.lid, // Pass LID for frontend matching
                quotedMessage: savedMsg.quotedMessage ? {
                    id: savedMsg.quotedMessage.message_id,
                    content: savedMsg.quotedMessage.content
                } : null,
                time: new Date(savedMsg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                timestamp: savedMsg.timestamp, // Raw timestamp for sorting
                instanceId: instanceId, // Required for multi-instance frontend
                status: savedMsg.status || 'read'
            };
            this.emitToRoom(instanceId, 'new_message', parsedMsg);

            if (!fromMe) {
                const assignmentService = require('./assignment.service');
                await assignmentService.assignChat(instanceId, instance.user_id, jid);

                // Fetch quoted message content if this is a reply
                let quotedText = null;
                if (quotedMessageId) {
                    try {
                        const quotedMsg = await Message.findOne({
                            where: { message_id: quotedMessageId, instance_id: instance.id }
                        });
                        if (quotedMsg) {
                            quotedText = quotedMsg.content;
                            console.log(`[AI] 💬 Reply to: "${quotedText?.substring(0, 50)}..."`);
                        }
                    } catch (err) {
                        console.log('[AI] Could not fetch quoted message:', err.message);
                    }
                }

                // AI TRIGGER LOGIC (Buffered)
                this.bufferMessage(instance, existingContact || { jid }, {
                    text: textContent,
                    type: messageType,
                    quotedText: quotedText, // Pass quoted message context
                    media: msg.mediaBuffer ? {
                        buffer: msg.mediaBuffer,
                        mimeType: msg.mimeType
                    } : null
                });
            }
        } catch (e) {
            console.error('Error saving message:', e);
        }
    }

    // New Buffering Logic (Debounce)
    async bufferMessage(instance, contact, messageData) {
        if (!global.messageBuffers) global.messageBuffers = new Map();

        const key = `${instance.instance_id}:${contact.jid}`;

        // 1. Clear existing timeout
        if (global.messageBuffers.has(key)) {
            const existing = global.messageBuffers.get(key);
            clearTimeout(existing.timeout);
            existing.parts.push(messageData); // Append new message

            // Re-set timeout
            existing.timeout = setTimeout(() => this.processBuffer(key), 3500); // Wait 3.5s
            console.log(`[AI] ⏳ Buffering message for ${contact.jid} (Count: ${existing.parts.length})`);
        } else {
            // 2. New Buffer
            global.messageBuffers.set(key, {
                instance,
                contact,
                parts: [messageData],
                timeout: setTimeout(() => this.processBuffer(key), 3500)
            });
            console.log(`[AI] ⏳ Started buffer for ${contact.jid}`);
        }
    }

    async processBuffer(key) {
        // Retrieve and delete from map immediately
        const data = global.messageBuffers.get(key);
        if (!data) return;
        global.messageBuffers.delete(key);

        const { instance, contact, parts } = data;

        // Combine text parts
        const combinedText = parts.map(p => p.text).filter(t => t).join(' \n');
        // Use the last media found, if any
        const lastMedia = parts.reverse().find(p => p.media)?.media;
        // Use last message type
        const finalType = parts[0].type;

        console.log(`[AI] 🔥 Processing buffered batch (${parts.length} messages) for ${contact.jid}`);

        await this.triggerAI(instance, contact, {
            text: combinedText,
            type: finalType,
            quotedText: parts.find(p => p.quotedText)?.quotedText, // Use any quoted text found
            media: lastMedia
        });
    }

    async downloadMedia(instanceId, message, type, returnBuffer = false, fullMsg = null) {
        try {
            // Validate media key exists to prevent download storms
            if (!message?.mediaKey) {
                console.log('[WA] ⚠️ Empty media key - skipping download');
                return returnBuffer ? { url: null, buffer: null } : null;
            }

            const declaredFileLength = byteLengthToNumber(message.fileLength);
            if (type === 'video' && declaredFileLength && declaredFileLength > MAX_VIDEO_BYTES) {
                console.warn(`[WA] Skipping video larger than 10MB (${declaredFileLength} bytes) before download`);
                return returnBuffer ? { url: null, buffer: null } : null;
            }

            let stream;
            try {
                stream = await downloadContentFromMessage(message, type);
            } catch (dlError) {
                console.log(`[WA] Media download failed, attempting updateMediaMessage (14-day expiry): ${dlError.message}`);
                // Try to update the media message if it expired (WhatsApp 14 day limit)
                const sock = sessions.get(instanceId);
                if (sock && fullMsg) {
                    try {
                        const updatedMsg = await sock.updateMediaMessage(fullMsg);
                        const newMsgContent = updatedMsg.message[Object.keys(updatedMsg.message)[0]];
                        stream = await downloadContentFromMessage(newMsgContent, type);
                        console.log(`[WA] Successfully recovered expired media via updateMediaMessage`);
                    } catch (updateError) {
                        console.error('[WA] Failed to recover expired media:', updateError.message);
                        throw updateError;
                    }
                } else {
                    throw dlError;
                }
            }

            let buffer = Buffer.from([]);
            for await (const chunk of stream) {
                if (type === 'video' && buffer.length + chunk.length > MAX_VIDEO_BYTES) {
                    console.warn('[WA] Stopped video download after it exceeded 10MB');
                    return returnBuffer ? { url: null, buffer: null } : null;
                }
                buffer = Buffer.concat([buffer, chunk]);
            }

            // Determine file extension based on type
            const originalExt = getExtension(message.fileName);
            const ext = originalExt
                ? originalExt.slice(1)
                : (type === 'image' ? 'jpg' : (type === 'video' ? 'mp4' : (type === 'sticker' ? 'webp' : (type === 'audio' ? 'ogg' : 'bin'))));
            const fileName = `${Date.now()}-${Math.floor(Math.random() * 10000)}.${ext}`;
            const filePath = path.join(this.uploadDir, fileName);
            await fs.promises.writeFile(filePath, buffer);

            const publicUrl = getPublicUploadUrl(fileName);
            return returnBuffer ? { url: publicUrl, buffer } : publicUrl;
        } catch (error) {
            console.error('[WA] Media download failed:', error);
            return returnBuffer ? { url: null, buffer: null } : null;
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

    async triggerAI(instance, contact, messageData) {
        try {
            console.log(`[AI] Trigger check for contact ${contact.jid} on instance ${instance.instance_id}`);

            // 1. Check Global Settings
            const siteConfig = await SiteConfig.findOne();
            if (!siteConfig?.ai_settings?.global_enabled) {
                console.log(`[AI] ❌ Global AI is DISABLED in SiteConfig`);
                return;
            }
            console.log(`[AI] ✓ Global AI enabled`);

            // 2. Check Instance Settings
            if (!instance.ai_enabled) {
                console.log(`[AI] ❌ Instance AI is DISABLED for ${instance.name || instance.instance_id}`);
                return;
            }
            console.log(`[AI] ✓ Instance AI enabled`);

            // 3. Check Contact Settings
            if (contact.id && !contact.ai_replies_enabled) {
                console.log(`[AI] ❌ Contact AI replies DISABLED for ${contact.jid}`);
                return;
            }
            console.log(`[AI] ✓ Contact AI enabled (or new contact)`);

            // [SECURITY] 4. Buffering handles the rate limiting now.
            // We removed the 10s cooldown here to allow the 3.5s buffer to work.

            // 4. Check Group Exemption
            if (contact.jid?.endsWith('@g.us')) {
                console.log(`[AI] ❌ Skipping group message`);
                return;
            }

            // 5. Check User Plan & Limits
            const user = await User.findByPk(instance.user_id, { include: ['plan'] });
            if (!user.ai_enabled) {
                console.log(`[AI] ❌ User AI is DISABLED (user.ai_enabled = false)`);
                return;
            }
            console.log(`[AI] ✓ User AI enabled`);

            if (!user.plan?.ai_enabled) {
                console.log(`[AI] ❌ User's plan does NOT have AI enabled (plan: ${user.plan?.name || 'none'})`);
                return;
            }
            console.log(`[AI] ✓ Plan AI enabled (${user.plan.name})`);

            if (user.ai_replies_sent_current_period >= user.plan.ai_reply_limit) {
                console.log(`[AI] ❌ User ${user.id} has reached AI reply limit (${user.ai_replies_sent_current_period}/${user.plan.ai_reply_limit})`);
                return;
            }
            console.log(`[AI] ✓ AI replies remaining: ${user.plan.ai_reply_limit - user.ai_replies_sent_current_period}`);

            // 6. Generate Response
            console.log(`[AI] 🔄 Generating response...`);

            // Show "typing" indicator while AI is generating
            const sock = sessions.get(instance.instance_id);
            if (sock) {
                try {
                    await sock.sendPresenceUpdate('composing', contact.jid);
                    console.log(`[AI] ⌨️ Typing indicator started for ${contact.jid}`);
                } catch (presenceErr) {
                    console.log(`[AI] ⚠️ Could not send typing indicator:`, presenceErr.message);
                }
            }

            const aiResponse = await aiService.generateResponse(user, contact, messageData, instance);

            // Stop typing indicator
            if (sock) {
                try {
                    await sock.sendPresenceUpdate('paused', contact.jid);
                } catch (presenceErr) {
                    // Ignore - not critical
                }
            }

            if (!aiResponse) {
                console.log(`[AI] ❌ AI service returned no response`);
                return;
            }

            // 7. Send Response
            console.log(`🚀 [AI] Delivering response to ${contact.jid}`);
            await this.sendMessage(instance.instance_id, contact.jid, { text: aiResponse.text });

            // 8. Track Usage
            await user.increment('ai_replies_sent_current_period');

        } catch (error) {
            console.error('[AI] Trigger Error:', error);
        }
    }
}

module.exports = new WhatsAppService();
