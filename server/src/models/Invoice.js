const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Invoice = sequelize.define('Invoice', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    invoice_number: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    currency: {
        type: DataTypes.STRING,
        defaultValue: 'USD'
    },
    status: {
        type: DataTypes.ENUM('pending', 'paid', 'failed', 'cancelled'),
        defaultValue: 'pending'
    },
    plan_name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    plan_id: {
        type: DataTypes.STRING(36),
        allowNull: true,
        references: {
            model: 'plans',
            key: 'id'
        }
    },
    fawaterak_invoice_id: {
        type: DataTypes.STRING,
        allowNull: true
    },
    payment_url: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    billing_period_start: {
        type: DataTypes.DATE,
        allowNull: false
    },
    billing_period_end: {
        type: DataTypes.DATE,
        allowNull: false
    },
    paid_at: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    timestamps: true,
    tableName: 'invoices'
});

module.exports = Invoice;
