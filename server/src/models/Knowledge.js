const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Knowledge = sequelize.define('Knowledge', {
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
    instance_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: 'whatsapp_instances',
            key: 'id'
        }
    },
    type: {
        type: DataTypes.ENUM('text', 'file', 'url'),
        defaultValue: 'text'
    },
    title: {
        type: DataTypes.STRING,
        allowNull: true
    },
    content: {
        type: DataTypes.TEXT('long'),
        allowNull: true
    },
    metadata: {
        type: DataTypes.JSON,
        allowNull: true
    },
    vector_id: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    timestamps: true,
    tableName: 'knowledge_base'
});

module.exports = Knowledge;
