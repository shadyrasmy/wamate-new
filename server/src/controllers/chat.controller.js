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
                    name: remoteJid.replace('@s.whatsapp.net', ''),
                    profilePicUrl: null // Will be populated from contacts
                });
            }
        }

        // 4. Enrich with Contact Names - Look for ANY contact owned by user for this JID
        const uniqueJids = Array.from(chatsMap.keys());
        if (uniqueJids.length > 0) {
            const contacts = await Contact.findAll({
                where: {
                    user_id: req.user.id,
                    [Op.or]: [
                        { jid: uniqueJids },
                        { lid: uniqueJids }
                    ]
                }
            });

            // Create lookup
            const contactNameMap = {};
            contacts.forEach(c => {
                contactNameMap[c.jid] = { name: c.name, profile_pic: c.profile_pic, canonical_jid: c.jid };
                if (c.lid) {
                    contactNameMap[c.lid] = { name: c.name, profile_pic: c.profile_pic, canonical_jid: c.jid };
                }
            });

            // Apply names, profile pics, and MERGE duplicates (LID -> Phone)
            const mergedMap = new Map();

            for (const [jid, chat] of chatsMap.entries()) {
                let canonicalJid = jid;

                // Check for LID mapping in contacts
                if (jid.endsWith('@lid') && contactNameMap[jid] && contactNameMap[jid].jid) {
                    // We found a contact that links this LID to a phone number!
                    // But wait, our contactNameMap needs to store the JID too.
                    // We'll trust the contact's 'jid' field if it looks like a phone number.
                    const mappedJid = contactNameMap[jid].canonical_jid;
                    if (mappedJid && mappedJid.includes('@s.whatsapp.net')) {
                        canonicalJid = mappedJid;
                    }
                }

                // Get existing entry or create new
                const existing = mergedMap.get(canonicalJid);

                // Add contact info
                let displayName = chat.name;
                let displayPic = chat.profilePicUrl;

                if (contactNameMap[canonicalJid]) {
                    displayName = contactNameMap[canonicalJid].name || displayName;
                    displayPic = contactNameMap[canonicalJid].profile_pic || displayPic;
                } else if (contactNameMap[jid]) {
                    displayName = contactNameMap[jid].name || displayName;
                    displayPic = contactNameMap[jid].profile_pic || displayPic;
                }

                if (existing) {
                    // Merge logic: Take latest time, sum unread (conceptually), use latest message
                    if (new Date(chat.time) > new Date(existing.time)) {
                        existing.time = chat.time;
                        existing.lastMessage = chat.lastMessage;
                        existing.status = chat.status;
                        existing.type = chat.type;
                        existing.fromMe = chat.fromMe;
                    }
                    existing.unread += chat.unread;
                    existing.profilePicUrl = displayPic || existing.profilePicUrl; // Prefer non-null
                    existing.name = displayName || existing.name;
                } else {
                    // Update the chat object with canonical data
                    chat.jid = canonicalJid;
                    chat.name = displayName;
                    chat.profilePicUrl = displayPic;
                    mergedMap.set(canonicalJid, chat);
                }
            }

            // Return values from the merged map
            return res.status(200).json({ status: 'success', data: { chats: Array.from(mergedMap.values()) } });
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

        // Enrich with Sender Profile Pics
        const senderJids = [...new Set(messages.map(m => m.sender_jid).filter(Boolean))];
        const contactMap = {};

        if (senderJids.length > 0) {
            const contacts = await Contact.findAll({
                where: {
                    user_id: req.user.id,
                    [Op.or]: [
                        { jid: senderJids },
                        { lid: senderJids }
                    ]
                }
            });
            contacts.forEach(c => {
                contactMap[c.jid] = c.profile_pic;
                if (c.lid) contactMap[c.lid] = c.profile_pic;
            });
        }

        const parsedMessages = messages.map(m => ({
            id: m.message_id,
            content: m.content,
            isMe: m.from_me,
            type: m.type,
            mediaUrl: m.media_url,
            senderName: m.sender_name,
            senderJid: m.sender_jid,
            senderProfilePic: contactMap[m.sender_jid] || null,
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

        if (!content && type === 'text') {
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

        // PROD FIX: Detect if mediaUrl is local and send as absolute file path
        // This prevents the server from needing to fetch itself over HTTP, which fails often in production.
        let localMessagePayload = { ...messagePayload };
        if (mediaUrl) {
            const isLocal = mediaUrl.includes('localhost') ||
                (process.env.PUBLIC_URL && mediaUrl.includes(process.env.PUBLIC_URL)) ||
                mediaUrl.startsWith('/');

            if (isLocal) {
                const filename = mediaUrl.split('/').pop();
                const path = require('path');
                const filePath = path.join(__dirname, '../../public/uploads', filename);
                const fs = require('fs');
                if (fs.existsSync(filePath)) {
                    console.log(`[WA] Optimized sending local file: ${filePath}`);
                    if (type === 'image') localMessagePayload.image = { url: filePath };
                    if (type === 'video') localMessagePayload.video = { url: filePath };
                    if (type === 'audio') localMessagePayload.audio = { url: filePath };
                    if (type === 'document') localMessagePayload.document = { url: filePath };
                }
            }
        }

        const response = await whatsappService.sendMessage(instanceId, formattedJid, localMessagePayload, options);

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

        // Construct public URL - Dynamic fallback if PUBLIC_URL is missing
        const baseUrl = process.env.PUBLIC_URL || `${req.protocol}://${req.get('host')}`;
        const fileUrl = `${baseUrl}/public/uploads/${req.file.filename}`;

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

        const whereClause = { jid, user_id: req.user.id };
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
        // Contact model uses user_id, not instance_id
        const contacts = await Contact.findAll({
            where: { user_id: req.user.id },
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
