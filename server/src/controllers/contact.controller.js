const { Contact, WhatsAppInstance } = require('../models');
const { AppError } = require('../middlewares/error.middleware');

exports.getContacts = async (req, res, next) => {
    try {
        const { instanceId } = req.query;

        // If instanceId is provided, filter by it. 
        // Otherwise, we might want to return all contacts for the user's instances.
        // For specific requirement, let's look for instances belonging to user first.

        const userInstances = await WhatsAppInstance.findAll({
            where: { user_id: req.user.id },
            attributes: ['id']
        });

        const instanceIds = userInstances.map(i => i.id);

        if (instanceIds.length === 0) {
            return res.status(200).json({ status: 'success', data: { contacts: [] } });
        }

        const whereClause = {};
        // If specific instance requested, ensure it belongs to user
        if (instanceId) {
            const instance = await WhatsAppInstance.findOne({ where: { instance_id: instanceId, user_id: req.user.id } });
            if (!instance) return next(new AppError('Instance not found', 404));
            whereClause.instance_id = instance.id;
        } else {
            whereClause.instance_id = instanceIds;
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
