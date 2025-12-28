const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Order = sequelize.define('Order', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    contact_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'contacts',
            key: 'id'
        }
    },
    items: {
        type: DataTypes.JSON,
        allowNull: true
    },
    total_price: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00
    },
    currency: {
        type: DataTypes.STRING,
        defaultValue: 'USD'
    },
    source: {
        type: DataTypes.STRING, // 'ai' or 'manual'
        defaultValue: 'manual'
    },
    status: {
        type: DataTypes.ENUM('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'),
        defaultValue: 'Pending'
    },
    shipping_details: {
        type: DataTypes.JSON,
        allowNull: true,
        defaultValue: {}
    }
}, {
    timestamps: true,
    tableName: 'orders'
});

module.exports = Order;
