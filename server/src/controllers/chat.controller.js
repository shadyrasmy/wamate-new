const { Message, WhatsAppInstance, Contact, User } = require('../models');
const whatsappService = require('../services/whatsapp.service');
const { AppError } = require('../middlewares/error.middleware');
const { Op } = require('sequelize');

exports.getRecentChats = async (req, res, next) => {
    try {
        const { instanceId } = req.query;
        let instanceIds = [];

        // 1. Determine which instances to query
        if (instanceId && instanceId !== 'all') {
            const instance = await WhatsAppInstance.findOne({ where: { instance_id: instanceId, user_id: req.user.id } });
            if (!instance) return next(new AppError('Instance not found', 404));
            instanceIds = [instance.id];
        } else {
            const instances = await WhatsAppInstance.findAll({ where: { user_id: req.user.id } });
            instanceIds = instances.map(i => i.id);
        }

        if (instanceIds.length === 0) {
            return res.status(200).json({ status: 'success', data: { chats: [] } });
        }

        // 2. Fetch latest messages, grouped by JID is hard in standard Sequelize without raw query.
        // We will fetch all messages (lite attributes) and process in JS for now (not efficient for huge DBs but fine for this scale).
        // Optimally: Use a separate 'Chat' model or raw SQL 'GROUP BY'.
        // 2. Fetch latest messages, grouped by JID
        const messages = await Message.findAll({
            where: instanceId && instanceId !== 'all'
                ? { instance_id: instanceIds }
                : { user_id: req.user.id },
            attributes: ['jid', 'content', 'timestamp', 'from_me'],
            order: [['timestamp', 'DESC']],
        });

        // 3. Group and unique
        const chatsMap = new Map();
        for (const msg of messages) {
            const remoteJid = msg.jid;
            // Skip status broadcasts
            if (remoteJid === 'status@broadcast') continue;

            if (!chatsMap.has(remoteJid)) {
                chatsMap.set(remoteJid, {
                    jid: remoteJid,
                    lastMessage: msg.content,
                    time: msg.timestamp,
                    unread: 0,
                    name: remoteJid.replace('@s.whatsapp.net', '')
                });
            }
        }

        // 4. Enrich with Contact Names - Look for ANY contact owned by user for this JID
        const uniqueJids = Array.from(chatsMap.keys());
        if (uniqueJids.length > 0) {
            const contacts = await Contact.findAll({
                where: {
                    jid: uniqueJids,
                    user_id: req.user.id
                }
            });

            // Create lookup
            const contactNameMap = {};
            contacts.forEach(c => { contactNameMap[c.jid] = c.name; });

            // Apply names
            for (const chat of chatsMap.values()) {
                if (contactNameMap[chat.jid]) {
                    chat.name = contactNameMap[chat.jid];
                }
            }
        }

        res.status(200).json({
            status: 'success',
            data: { chats: Array.from(chatsMap.values()) }
        });
    } catch (err) {
        next(err);
    }
};

exports.getMessages = async (req, res, next) => {
    try {
        const { instanceId, jid } = req.query;

        let whereClause = { jid };

        if (instanceId && instanceId !== 'all') {
            const instance = await WhatsAppInstance.findOne({ where: { instance_id: instanceId, user_id: req.user.id } });
            if (!instance) return next(new AppError('Instance not found', 404));
            whereClause.instance_id = instance.id;
        } else {
            // If searching all, we show everything for this JID that belongs to the user
            whereClause.user_id = req.user.id;
        }

        const messages = await Message.findAll({
            where: whereClause,
            order: [['timestamp', 'ASC']],
            limit: 100,
            include: [
                {
                    model: Message,
                    as: 'quotedMessage',
                    attributes: ['content', 'message_id']
                }
            ]
        });

        const parsedMessages = messages.map(m => ({
            id: m.message_id,
            content: m.content,
            isMe: m.from_me,
            type: m.type,
            mediaUrl: m.media_url,
            senderName: m.sender_name,
            senderJid: m.sender_jid,
            quotedMessage: m.quotedMessage ? {
                id: m.quotedMessage.message_id,
                content: m.quotedMessage.content
            } : null,
            time: new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: m.status || 'read'
        }));

        res.status(200).json({
            status: 'success',
            data: { messages: parsedMessages }
        });

    } catch (err) {
        next(err);
    }
};

exports.sendMessage = async (req, res, next) => {
    try {
        // Support both req.body (POST) and req.query (GET for one-line API)
        const params = { ...req.body, ...req.query };
        const { instanceId, type = 'text', mediaUrl, reaction, quotedMessageId } = params;

        // Support 'number' as alias for 'jid' and 'message' as alias for 'content'
        const jid = params.jid || params.number;
        const content = params.content || params.message;

        console.log(`[DEBUG] Controller: sendMessage called. Instance: ${instanceId}, JID: ${jid}, Content: ${content}`);

        if (!instanceId) {
            return next(new AppError('Missing field: instanceId. Please provide the unique ID of your WhatsApp channel.', 400));
        }

        if (!jid) {
            return next(new AppError('Missing field: number (destination). Provide the phone number with country code.', 400));
        }

        const instance = await WhatsAppInstance.findOne({ where: { instance_id: instanceId, user_id: req.user.id } });

        if (!instance) {
            return next(new AppError(`Instance [${instanceId}] not found. Check your instance ID or ensure you own this channel.`, 404));
        }

        if (instance.status !== 'connected') {
            return next(new AppError(`Your WhatsApp node [${instance.name || instanceId}] is ${instance.status}. Please scan the QR code and ensure it is connected before sending messages.`, 400));
        }

        if (!content && type !== 'reaction') {
            return next(new AppError('Missing field: message/content. You cannot send an empty message.', 400));
        }

        // Check Message Limits
        const user = await User.findByPk(req.user.id);
        if (user.messages_sent_current_period >= (user.monthly_message_limit || 0)) {
            return next(new AppError('Monthly message limit reached. Please upgrade your plan in the dashboard to continue sending messages.', 403));
        }

        // Increment count
        await user.increment('messages_sent_current_period');

        let messagePayload;
        let options = {};

        // Handle Quoted Message (Reply)
        if (quotedMessageId) {
            const quotedMsg = await Message.findOne({ where: { message_id: quotedMessageId } });
            if (quotedMsg) {
                // Construct a minimal quoted message object for Baileys
                // This allows the "Reply" bubble to appear
                options.quoted = {
                    key: {
                        remoteJid: quotedMsg.jid,
                        fromMe: quotedMsg.from_me,
                        id: quotedMsg.message_id,
                    },
                    message: {
                        conversation: quotedMsg.content // Simplified: Assuming text for now. ideally check quotedMsg.type
                    }
                };
            }
        }

        if (type === 'reaction' && reaction) {
            // reaction payload: { text: "❤️", key: { id: "...", fromMe: ... } }
            if (!reaction.key || !reaction.text) return next(new AppError('Invalid reaction payload', 400));
            messagePayload = {
                react: {
                    text: reaction.text,
                    key: reaction.key
                }
            };
        } else if (type === 'image' && mediaUrl) {
            messagePayload = { image: { url: mediaUrl }, caption: content };
        } else if (type === 'video' && mediaUrl) {
            messagePayload = { video: { url: mediaUrl }, caption: content };
        } else if (type === 'audio' && mediaUrl) {
            messagePayload = { audio: { url: mediaUrl }, ptt: true }; // Treat as voice note by default
        } else if (type === 'document' && mediaUrl) {
            messagePayload = { document: { url: mediaUrl }, mimetype: 'application/pdf', fileName: 'document.pdf' }; // Simple default
        } else {
            messagePayload = { text: content || '' };
        }

        // Normalize JID
        const formattedJid = jid.includes('@') ? jid : `${jid}@s.whatsapp.net`;

        const response = await whatsappService.sendMessage(instanceId, formattedJid, messagePayload, options);

        res.status(200).json({ status: 'success', message: 'Message queued', data: response });

    } catch (err) {
        next(err);
    }
};

exports.uploadMedia = async (req, res, next) => {
    try {
        if (!req.file) {
            return next(new AppError('No file uploaded', 400));
        }

        // Construct public URL - Use PORT 3000 as per user request (Proxy)
        const fileUrl = `${process.env.PUBLIC_URL || 'http://localhost:3000'}/public/uploads/${req.file.filename}`;

        res.status(200).json({
            status: 'success',
            data: {
                url: fileUrl,
                filename: req.file.filename,
                mimetype: req.file.mimetype,
                size: req.file.size
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.getAssignedChats = async (req, res, next) => {
    try {
        const { Contact, Message } = require('../models');

        // Find contacts assigned to this seat
        const contacts = await Contact.findAll({
            where: { assigned_seat_id: req.user.id },
            order: [['updatedAt', 'DESC']]
        });

        // Enrich with last message
        const chats = await Promise.all(contacts.map(async (contact) => {
            const lastMsg = await Message.findOne({
                where: { jid: contact.jid, instance_id: contact.instance_id }, // specific instance
                order: [['timestamp', 'DESC']]
            });
            return {
                ...contact.toJSON(),
                lastMessage: lastMsg
            };
        }));

        res.status(200).json({ status: 'success', data: { chats } });
    } catch (err) {
        next(err);
    }
};

exports.resolveChat = async (req, res, next) => {
    try {
        const { jid } = req.body;
        const { Contact } = require('../models');

        let whereClause = { jid };
        if (req.user.role === 'seat') {
            whereClause.assigned_seat_id = req.user.id;
        }

        const contact = await Contact.findOne({ where: whereClause });
        if (!contact) {
            return next(new AppError('Chat not found or you do not have permission to resolve it', 404));
        }

        // Save sticky history and unassign
        contact.last_assigned_seat_id = contact.assigned_seat_id;
        contact.assigned_seat_id = null;
        await contact.save();

        res.status(200).json({ status: 'success', message: 'Chat resolved and unassigned' });

    } catch (err) {
        next(err);
    }
};

exports.getContacts = async (req, res, next) => {
    try {
        const { instanceId } = req.query;
        const whereClause = {};

        if (instanceId && instanceId !== 'all') {
            const instance = await WhatsAppInstance.findOne({ where: { instance_id: instanceId, user_id: req.user.id } });
            if (!instance) return next(new AppError('Instance not found', 404));
            whereClause.instance_id = instance.id;
        } else {
            const instances = await WhatsAppInstance.findAll({ where: { user_id: req.user.id } });
            whereClause.instance_id = instances.map(i => i.id);
        }

        const contacts = await Contact.findAll({
            where: whereClause,
            order: [['name', 'ASC']]
        });

        res.status(200).json({
            status: 'success',
            data: { contacts }
        });
    } catch (err) {
        next(err);
    }
};
