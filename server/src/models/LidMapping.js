const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

/**
 * LidMapping stores the association between a WhatsApp Phone JID and its Linked ID (LID).
 * This allows the system to correctly merge conversations even if the mapping update
 * arrives before the contact is created, or if contacts are deleted/reset.
 */
const LidMapping = sequelize.define('LidMapping', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    jid: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'The Phone JID (e.g., 12345678@s.whatsapp.net)'
    },
    lid: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: 'The Linked ID (e.g., 98765432@lid)'
    },
    instance_id: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: 'The ID of the instance that discovered this mapping'
    }
}, {
    timestamps: true,
    tableName: 'lid_mappings',
    indexes: [
        {
            unique: true,
            fields: ['instance_id', 'lid'],
            name: 'unique_lid_per_instance'
        },
        {
            fields: ['jid']
        },
        {
            fields: ['lid']
        }
    ]
});

module.exports = LidMapping;
