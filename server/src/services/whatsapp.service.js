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
                browser: ['WaMate', 'Chrome', '10.0'],
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

            sessions.set(instanceId, sock);
            return sock;

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

            emitToRoom(instanceId, event, data) {
                if (global.io) global.io.to(instanceId).emit(event, data);
            }

    async saveMessage(instanceId, msg) {
                try {
                    const fromMe = msg.key.fromMe;
                    let jid = msg.key.remoteJid;
                    const participant = msg.key.participant || msg.participant || null; // Sender JID in a group
                    const isGroup = jid.endsWith('@g.us');

                    console.log(`[DEBUG] saveMessage START. JID: ${jid}. Participant: ${participant}. FromMe: ${fromMe}`);

                    // Normalize JID: Ensure domain exists
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
                    } else if (m.conversation) {
                        textContent = m.conversation;
                    } else if (m.extendedTextMessage) {
                        textContent = m.extendedTextMessage.text;
                    } else if (m.imageMessage) {
                        textContent = m.imageMessage.caption || '📷 Image';
                        if (!fromMe) mediaUrl = await this.downloadMedia(m.imageMessage, 'image');
                        else mediaUrl = m.imageMessage.url;
                    } else if (m.videoMessage) {
                        textContent = m.videoMessage.caption || '🎥 Video';
                        if (!fromMe) mediaUrl = await this.downloadMedia(m.videoMessage, 'video');
                        else mediaUrl = m.videoMessage.url;
                    } else if (m.audioMessage) {
                        textContent = '🎤 Audio';
                        if (!fromMe) mediaUrl = await this.downloadMedia(m.audioMessage, 'audio');
                        else mediaUrl = m.audioMessage.url;
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
                        // 1. Group/Main Chat Contact
                        const existingContact = await Contact.findOne({
                            where: { user_id: instance.user_id, jid: jid }
                        });

                        await Contact.upsert({
                            jid: jid,
                            user_id: instance.user_id,
                            name: isGroup ? (existingContact?.name || jid.split('@')[0]) : (msg.pushName || jid.split('@')[0]),
                            push_name: isGroup ? null : msg.pushName,
                            is_group: isGroup,
                            last_active: new Date()
                        });

                        // 2. Individual Sender Contact (if in group)
                        if (isGroup && participant) {
                            await Contact.upsert({
                                jid: participant,
                                user_id: instance.user_id,
                                name: msg.pushName || participant.split('@')[0],
                                push_name: msg.pushName,
                                is_group: false,
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

                    const fileName = `${Date.now()}-${Math.floor(Math.random() * 10000)}.${type === 'image' ? 'jpg' : (type === 'video' ? 'mp4' : 'ogg')}`;
                    const filePath = path.join(this.uploadDir, fileName);
                    fs.writeFileSync(filePath, buffer);

                    const publicUrl = `${process.env.PUBLIC_URL || 'http://localhost:3000'}/public/uploads/${fileName}`;
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
