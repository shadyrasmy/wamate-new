const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    access_token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    role: {
        type: DataTypes.ENUM('admin', 'user'),
        defaultValue: 'user'
    },
    id_plan: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'plans',
            key: 'id'
        }
    },
    max_instances: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    max_seats: {
        type: DataTypes.INTEGER,
        defaultValue: 1
    },
    // Subscription Fields
    monthly_message_limit: {
        type: DataTypes.INTEGER,
        defaultValue: 1000 // Free tier default
    },
    messages_sent_current_period: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    subscription_start_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    subscription_end_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    phone_number: {
        type: DataTypes.STRING,
        allowNull: true // Optional for existing users, mandatory for new
    }
}, {
    timestamps: true,
    tableName: 'users'
});

module.exports = User;

