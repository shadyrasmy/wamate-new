const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const ReferralTransaction = sequelize.define('ReferralTransaction', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    referrer_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    referred_user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    percentage: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 20
    },
    type: {
        type: DataTypes.ENUM('commission', 'payout', 'adjustment'),
        defaultValue: 'commission'
    },
    status: {
        type: DataTypes.ENUM('completed', 'pending'),
        defaultValue: 'completed'
    },
    note: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'referral_transactions',
    timestamps: true
});

module.exports = ReferralTransaction;
