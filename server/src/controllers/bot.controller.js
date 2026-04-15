const { Op } = require('sequelize');
const { Bot, WhatsAppInstance } = require('../models');
const { AppError } = require('../middlewares/error.middleware');

exports.getBots = async (req, res, next) => {
    try {
        const bots = await Bot.findAll({
            where: { user_id: req.user.id },
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json({ status: 'success', data: { bots } });
    } catch (err) {
        next(err);
    }
};

exports.createBot = async (req, res, next) => {
    try {
        const { name, system_instruction, instance_id, is_active } = req.body;

        // Verify instance ownership
        const instance = await WhatsAppInstance.findOne({
            where: {
                user_id: req.user.id,
                [Op.or]: [
                    { instance_id },
                    { id: instance_id }
                ]
            }
        });
        if (!instance) return next(new AppError('Instance not found or unauthorized', 404));

        const bot = await Bot.create({
            user_id: req.user.id,
            instance_id: instance.id, // Internal UUID
            name,
            system_instruction,
            is_active: is_active ?? true
        });

        res.status(201).json({ status: 'success', data: { bot } });
    } catch (err) {
        next(err);
    }
};

exports.updateBot = async (req, res, next) => {
    try {
        const { botId } = req.params;
        const { name, system_instruction, instance_id, is_active } = req.body;

        const bot = await Bot.findOne({
            where: { id: botId, user_id: req.user.id }
        });
        if (!bot) return next(new AppError('Bot not found', 404));

        if (name) bot.name = name;
        if (system_instruction !== undefined) bot.system_instruction = system_instruction;
        if (instance_id) {
            const instance = await WhatsAppInstance.findOne({
                where: {
                    user_id: req.user.id,
                    [Op.or]: [
                        { instance_id },
                        { id: instance_id }
                    ]
                }
            });

            if (!instance) return next(new AppError('Instance not found or unauthorized', 404));
            bot.instance_id = instance.id;
        }
        if (is_active !== undefined) bot.is_active = !!is_active;

        await bot.save();
        res.status(200).json({ status: 'success', data: { bot } });
    } catch (err) {
        next(err);
    }
};

exports.deleteBot = async (req, res, next) => {
    try {
        const { botId } = req.params;
        const deleted = await Bot.destroy({
            where: { id: botId, user_id: req.user.id }
        });
        if (!deleted) return next(new AppError('Bot not found', 404));
        res.status(204).json({ status: 'success', data: null });
    } catch (err) {
        next(err);
    }
};
