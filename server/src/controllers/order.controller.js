const { Order, Contact, User } = require('../models');
const { AppError } = require('../middlewares/error.middleware');
const { Op } = require('sequelize');

exports.getOrders = async (req, res, next) => {
    try {
        const { page = 1, limit = 10, status, search } = req.query;
        const offset = (page - 1) * limit;

        const where = { user_id: req.user.id };

        if (status && status !== 'All') {
            where.status = status;
        }

        // Ideally search orders by contact name or order items
        if (search) {
            // This relies on include search or just item search
            // For MVP, search by id or exact match
        }

        const { count, rows } = await Order.findAndCountAll({
            where,
            include: [{ model: Contact, as: 'contact', attributes: ['name', 'jid'] }],
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({
            status: 'success',
            data: {
                orders: rows,
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

exports.updateOrder = async (req, res, next) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findOne({ where: { id: orderId, user_id: req.user.id } });

        if (!order) return next(new AppError('Order not found', 404));

        await order.update(req.body);

        res.status(200).json({ status: 'success', data: { order } });
    } catch (err) {
        next(err);
    }
};

exports.exportOrders = async (req, res, next) => {
    try {
        const { status } = req.query;
        const where = { user_id: req.user.id };

        if (status && status !== 'All') where.status = status;

        const orders = await Order.findAll({
            where,
            include: [{ model: Contact, as: 'contact', attributes: ['name', 'jid'] }],
            order: [['createdAt', 'DESC']]
        });

        const fields = ['id', 'contact_name', 'contact_phone', 'items', 'total_price', 'currency', 'status', 'shipping_details', 'createdAt'];
        const csv = [
            fields.join(','),
            ...orders.map(order => {
                const flat = {
                    id: order.id,
                    contact_name: order.contact?.name,
                    contact_phone: order.contact?.jid?.split('@')[0],
                    items: JSON.stringify(order.items).replace(/"/g, '""'),
                    total_price: order.total_price,
                    currency: order.currency,
                    status: order.status,
                    shipping_details: JSON.stringify(order.shipping_details).replace(/"/g, '""'),
                    createdAt: order.createdAt
                };
                return fields.map(f => {
                    let val = flat[f] || '';
                    if (typeof val === 'string' && /^[=\+\-@]/.test(val)) {
                        val = `'${val}`;
                    }
                    return `"${val}"`;
                }).join(',');
            })
        ].join('\n');

        res.header('Content-Type', 'text/csv');
        res.attachment(`orders-${Date.now()}.csv`);
        return res.send(csv);

    } catch (err) {
        next(err);
    }
};
