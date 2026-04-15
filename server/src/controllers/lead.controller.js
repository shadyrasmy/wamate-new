const { Lead, Contact, User } = require('../models');
const { AppError } = require('../middlewares/error.middleware');
const { Op } = require('sequelize');

exports.getLeads = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, status, search, startDate, endDate } = req.query;
        const offset = (page - 1) * limit;

        const where = { user_id: req.user.id };

        if (status && status !== 'All') {
            where.status = status;
        }

        if (search) {
            where[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { phone: { [Op.like]: `%${search}%` } },
                { intent: { [Op.like]: `%${search}%` } },
                { notes: { [Op.like]: `%${search}%` } }
            ];
        }

        if (startDate && endDate) {
            where.createdAt = {
                [Op.between]: [new Date(startDate), new Date(endDate)]
            };
        }

        const { count, rows } = await Lead.findAndCountAll({
            where,
            include: [{ model: Contact, as: 'contact', attributes: ['profile_pic', 'jid'] }],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            status: 'success',
            data: {
                leads: rows,
                pagination: {
                    total: count,
                    page: parseInt(page),
                    pages: Math.ceil(count / limit)
                }
            }
        });
    } catch (err) {
        next(err);
    }
};

exports.updateLead = async (req, res, next) => {
    try {
        const { leadId } = req.params;
        const lead = await Lead.findOne({ where: { id: leadId, user_id: req.user.id } });

        if (!lead) return next(new AppError('Lead not found', 404));

        await lead.update(req.body);

        res.status(200).json({ status: 'success', data: { lead } });
    } catch (err) {
        next(err);
    }
};

exports.deleteLead = async (req, res, next) => {
    try {
        const { leadId } = req.params;
        const deleted = await Lead.destroy({ where: { id: leadId, user_id: req.user.id } });

        if (!deleted) return next(new AppError('Lead not found', 404));

        res.status(204).json({ status: 'success', data: null });
    } catch (err) {
        next(err);
    }
};

exports.exportLeads = async (req, res, next) => {
    try {
        const { status, startDate, endDate } = req.query;
        const where = { user_id: req.user.id };

        if (status && status !== 'All') where.status = status;
        if (startDate && endDate) {
            where.createdAt = { [Op.between]: [new Date(startDate), new Date(endDate)] };
        }

        const leads = await Lead.findAll({
            where,
            order: [['createdAt', 'DESC']]
        });

        // Simple CSV generation
        const fields = ['id', 'name', 'phone', 'intent', 'status', 'notes', 'metadata', 'createdAt'];
        const csv = [
            fields.join(','),
            ...leads.map(lead => {
                return fields.map(field => {
                    let val = lead[field];
                    if (field === 'metadata') val = JSON.stringify(val).replace(/"/g, '""');
                    // Prevent CSV Injection (Formula Injection)
                    if (typeof val === 'string') {
                        if (/^[=\+\-@]/.test(val)) {
                            val = `'${val}`; // Prepend single quote to force text
                        }
                        val = `"${val}"`;
                    }
                    return val;
                }).join(',');
            })
        ].join('\n');

        res.header('Content-Type', 'text/csv');
        res.attachment(`leads-${Date.now()}.csv`);
        return res.send(csv);

    } catch (err) {
        next(err);
    }
};
