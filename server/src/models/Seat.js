const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Seat = sequelize.define('Seat', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    user_id: { // Owner of the seat
        type: DataTypes.UUID,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('online', 'offline', 'busy'),
        defaultValue: 'offline'
    },
    last_active: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    },
    assigned_chats_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },
    last_assigned_at: {
        type: DataTypes.DATE,
        allowNull: true
    },
    instance_id: {
        type: DataTypes.UUID,
        allowNull: true
    }
}, {
    timestamps: true,
    tableName: 'seats'
});

module.exports = Seat;
