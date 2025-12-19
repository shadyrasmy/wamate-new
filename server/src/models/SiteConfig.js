const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const SiteConfig = sequelize.define('SiteConfig', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    cms_visibility: {
        type: DataTypes.JSON,
        defaultValue: {
            hero: true,
            numbers: true,
            whyUs: true,
            benefits: true,
            howEasy: true
        }
    },
    header_scripts: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    fb_pixel_id: {
        type: DataTypes.STRING,
        allowNull: true
    },
    fb_capi_token: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    timestamps: true,
    tableName: 'site_configs'
});

module.exports = SiteConfig;
