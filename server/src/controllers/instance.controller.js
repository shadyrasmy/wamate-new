const { WhatsAppInstance, User } = require('../models');
const whatsappService = require('../services/whatsapp.service');
const { AppError } = require('../middlewares/error.middleware');
const { v4: uuidv4 } = require('uuid');

exports.createInstance = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { instanceName } = req.body;

        // Check plan limits
        const user = await User.findByPk(userId);
        const instanceCount = await WhatsAppInstance.count({ where: { user_id: userId } });

        if (instanceCount >= user.max_instances) {
            return next(new AppError('Max instances limit reached for your plan.', 403));
        }

        const instanceId = uuidv4();

        // Create DB record
        const newInstance = await WhatsAppInstance.create({
            instance_id: instanceId,
            user_id: userId,
            name: instanceName || `Instance ${instanceCount + 1}`,
            status: 'disconnected'
        });

        // Initialize Baileys Session
        await whatsappService.initializeInstance(instanceId);

        res.status(201).json({
            status: 'success',
            data: {
                instanceId,
                name: newInstance.name
            }
        });

    } catch (err) {
        next(err);
    }
};

exports.getInstances = async (req, res, next) => {
    try {
        const instances = await WhatsAppInstance.findAll({
            where: { user_id: req.user.id },
            attributes: ['instance_id', 'name', 'phone_number', 'status', 'qr_code', 'chat_enabled']
        });

        res.status(200).json({
            status: 'success',
            data: { instances }
        });
    } catch (err) {
        next(err);
    }
};

exports.deleteInstance = async (req, res, next) => {
    try {
        const { instanceId } = req.params;
        const instance = await WhatsAppInstance.findOne({
            where: { instance_id: instanceId, user_id: req.user.id }
        });

        if (!instance) {
            return next(new AppError('Instance not found', 404));
        }

        // Logout and destroy session
        await whatsappService.deleteInstance(instanceId);

        // Remove from DB
        await instance.destroy();

        res.status(200).json({ status: 'success', message: 'Instance terminated successfully' });
    } catch (err) {
        next(err);
    }
};

exports.updateInstance = async (req, res, next) => {
    try {
        const { instanceId } = req.params;
        const { name } = req.body;

        const instance = await WhatsAppInstance.findOne({
            where: { instance_id: instanceId, user_id: req.user.id }
        });

        if (!instance) return next(new AppError('Instance not found', 404));

        instance.name = name;
        await instance.save();

        res.status(200).json({ status: 'success', data: { instance } });
    } catch (err) {
        next(err);
    }
};

exports.reconnectInstance = async (req, res, next) => {
    try {
        const { instanceId } = req.params;
        const instance = await WhatsAppInstance.findOne({
            where: { instance_id: instanceId, user_id: req.user.id }
        });

        if (!instance) return next(new AppError('Instance not found', 404));

        // FORCE CLEANUP: delete session folder to ensure a fresh QR
        const sessionPath = require('path').join(__dirname, '../../sessions', instanceId);
        if (require('fs').existsSync(sessionPath)) {
            require('fs').rmSync(sessionPath, { recursive: true, force: true });
        }

        // Re-init session
        await whatsappService.initializeInstance(instanceId);

        res.status(200).json({ status: 'success', message: 'Re-initialization started. A fresh QR code will be generated.' });
    } catch (err) {
        next(err);
    }
};

exports.toggleChatLogging = async (req, res, next) => {
    try {
        const { instanceId } = req.params;
        const { enabled } = req.body;

        const instance = await WhatsAppInstance.findOne({
            where: { instance_id: instanceId, user_id: req.user.id }
        });

        if (!instance) return next(new AppError('Instance not found', 404));

        instance.chat_enabled = !!enabled;
        await instance.save();

        res.status(200).json({
            status: 'success',
            message: `Chat logging is now ${instance.chat_enabled ? 'ENABLED' : 'DISABLED'} for this instance.`,
            data: { chat_enabled: instance.chat_enabled }
        });
    } catch (err) {
        next(err);
    }
};
exports.getPairingCode = async (req, res, next) => {
    try {
        const { instanceId } = req.params;
        const { phoneNumber } = req.body;

        const instance = await WhatsAppInstance.findOne({
            where: { instance_id: instanceId, user_id: req.user.id }
        });

        if (!instance) return next(new AppError('Instance not found', 404));

        const code = await whatsappService.requestPairingCode(instanceId, phoneNumber);

        res.status(200).json({
            status: 'success',
            data: { code }
        });
    } catch (err) {
        next(err);
    }
};
