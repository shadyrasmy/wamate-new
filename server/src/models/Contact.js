const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Contact = sequelize.define('Contact', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    jid: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lid: {
        type: DataTypes.STRING,
        allowNull: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    push_name: {
        type: DataTypes.STRING,
        allowNull: true
    },
    profile_pic: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    is_group: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    assigned_seat_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'seats',
            key: 'id'
        }
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: true
    },
    instance_id: {
        type: DataTypes.UUID,
        allowNull: true
    }
}, {
    timestamps: true,
    tableName: 'contacts',
    indexes: [
        {
            unique: true,
            fields: ['user_id', 'instance_id', 'jid']
        },
        {
            // Optimization: Fast LID lookup for JID-LID resolution
            fields: ['lid']
        },
        {
            // Optimization: Composite lookup for contacts by LID within an instance
            fields: ['user_id', 'instance_id', 'lid']
        }
    ]
});

module.exports = Contact;
