const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const WhatsAppInstance = sequelize.define('WhatsAppInstance', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    instance_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    phone_number: {
        type: DataTypes.STRING,
        allowNull: true
    },
    status: {
        type: DataTypes.ENUM('disconnected', 'connecting', 'connected'),
        defaultValue: 'disconnected'
    },
    qr_code: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    session_data: {
        type: DataTypes.JSON, // Stores minimal session info if needed, but Baileys handles auth separately usually
        allowNull: true
    },
    is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    timestamps: true,
    tableName: 'whatsapp_instances'
});

module.exports = WhatsAppInstance;
