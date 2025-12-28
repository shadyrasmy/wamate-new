const { User, Plan, Knowledge } = require('../models');
const { AppError } = require('../middlewares/error.middleware');
const aiService = require('../services/ai.service');

exports.getProfile = async (req, res, next) => {
    try {
        // If it's a SEAT user, handle differently
        if (req.user.role === 'seat') {
            const { Seat, User } = require('../models');
            const seat = await Seat.findByPk(req.user.id, {
                include: [{ model: User, as: 'manager', attributes: ['name', 'email'] }]
            });
            if (!seat) return next(new AppError('Seat not found', 404));
            return res.status(200).json({ status: 'success', data: { user: seat } });
        }

        // Standard User Profile
        let user;
        try {
            user = await User.findByPk(req.user.id, {
                attributes: ['id', 'name', 'email', 'access_token', 'max_instances', 'monthly_message_limit', 'messages_sent_current_period', 'role', 'ai_enabled'],
                include: [{ model: Plan, as: 'plan', attributes: ['name', 'price', 'ai_enabled', 'ai_reply_limit', 'ai_knowledge_limit', 'ai_model_id'] }]
            });
        } catch (queryErr) {
            console.error('[CRITICAL] Profile Fetch Failed with Association. Falling back to basic fetch.', queryErr.message);
            // Fallback: This handles cases where 'id_plan' or the Plan table is missing in an outdated DB schema
            user = await User.findByPk(req.user.id, {
                attributes: ['id', 'name', 'email', 'access_token', 'max_instances', 'monthly_message_limit', 'messages_sent_current_period', 'role', 'ai_enabled']
            });
        }

        if (!user) return next(new AppError('User not found', 404));

        res.status(200).json({
            status: 'success',
            data: { user }
        });
    } catch (err) {
        next(err);
    }
};

exports.updateProfile = async (req, res, next) => {
    try {
        const { name, ai_enabled } = req.body;
        const user = await User.findByPk(req.user.id);

        if (name) user.name = name;
        if (ai_enabled !== undefined) user.ai_enabled = !!ai_enabled;
        await user.save();

        res.status(200).json({
            status: 'success',
            message: 'Profile updated successfully',
            data: {
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    ai_enabled: user.ai_enabled
                }
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.getKnowledge = async (req, res, next) => {
    try {
        const knowledge = await Knowledge.findAll({
            where: { user_id: req.user.id },
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json({ status: 'success', data: { knowledge } });
    } catch (err) {
        next(err);
    }
};

exports.createKnowledge = async (req, res, next) => {
    try {
        const { title, content, type, instance_id } = req.body;

        // Check plan limits
        const user = await User.findByPk(req.user.id, {
            include: [{ model: Plan, as: 'plan' }]
        });
        const currentCount = await Knowledge.count({ where: { user_id: req.user.id } });
        const limit = user.ai_knowledge_limit || user.plan?.ai_knowledge_limit || 0;

        if (currentCount >= limit) {
            return next(new AppError(`You have reached your cognitive knowledge limit (${limit} units). Please upgrade your protocol.`, 403));
        }

        const knowledge = await Knowledge.create({
            user_id: req.user.id,
            instance_id: instance_id || null, // Global if null
            title,
            content,
            type: type || 'text'
        });

        // Sync to Pinecone
        if (knowledge.content) {
            aiService.upsertKnowledge(req.user.id, knowledge.id, knowledge.content, knowledge.instance_id);
        }

        res.status(201).json({ status: 'success', data: { knowledge } });
    } catch (err) {
        next(err);
    }
};

exports.updateKnowledge = async (req, res, next) => {
    try {
        const { knowledgeId } = req.params;
        const { title, content, type, instance_id } = req.body;
        const knowledge = await Knowledge.findOne({
            where: { id: knowledgeId, user_id: req.user.id }
        });

        if (!knowledge) return next(new AppError('Knowledge not found', 404));

        if (title) knowledge.title = title;
        if (content) knowledge.content = content;
        if (type) knowledge.type = type;
        if (instance_id !== undefined) knowledge.instance_id = instance_id || null;

        await knowledge.save();

        // Sync to Pinecone
        if (knowledge.content) {
            aiService.upsertKnowledge(req.user.id, knowledge.id, knowledge.content, knowledge.instance_id);
        }

        res.status(200).json({ status: 'success', data: { knowledge } });
    } catch (err) {
        next(err);
    }
};

exports.deleteKnowledge = async (req, res, next) => {
    try {
        const { knowledgeId } = req.params;
        const deleted = await Knowledge.destroy({
            where: { id: knowledgeId, user_id: req.user.id }
        });

        if (!deleted) return next(new AppError('Knowledge not found', 404));

        // Sync to Pinecone
        aiService.deleteKnowledge(req.user.id, knowledgeId);

        res.status(204).json({ status: 'success', data: null });
    } catch (err) {
        next(err);
    }
};
