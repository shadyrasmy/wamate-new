const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Message = sequelize.define('Message', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    message_id: {
        type: DataTypes.STRING,
        allowNull: false
    },
    jid: {
        type: DataTypes.STRING,
        allowNull: false
    },
    from_me: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    type: {
        type: DataTypes.STRING,
        defaultValue: 'text'
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    media_url: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('pending', 'sent', 'delivered', 'read', 'failed'),
        defaultValue: 'sent' // Default for incoming is usually just received/stored
    },
    timestamp: {
        type: DataTypes.DATE,
        allowNull: false
    },
    sender_jid: {
        type: DataTypes.STRING,
        allowNull: true
    },
    sender_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    quoted_message_id: {
        type: DataTypes.STRING,
        allowNull: true
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: true // Optional for now during transition
    }
}, {
    timestamps: true,
    tableName: 'messages',
    indexes: [
        {
            fields: ['instance_id', 'jid']
        },
        {
            // Optimization: Composite index for fast chat history retrieval with sort
            fields: ['instance_id', 'jid', 'timestamp']
        },
        {
            // Optimization: Fast retrieval of latest messages globally for an instance
            fields: ['instance_id', 'timestamp']
        },
        {
            unique: true,
            fields: ['instance_id', 'message_id']
        }
    ]
});

const MessageLog = sequelize.define('MessageLog', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    recipient: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.STRING,
        defaultValue: 'text'
    },
    status: {
        type: DataTypes.ENUM('pending', 'sent', 'delivered', 'read', 'failed'),
        defaultValue: 'pending'
    },
    error: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    timestamps: true,
    tableName: 'message_logs'
});

module.exports = { Message, MessageLog };
