const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    const EmailTemplate = sequelize.define('EmailTemplate', {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        key: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            comment: 'Unique key for the template e.g., "verification", "welcome"'
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: 'Human readable name e.g., "Email Verification"'
        },
        subject: {
            type: DataTypes.STRING,
            allowNull: false
        },
        body: {
            type: DataTypes.TEXT,
            allowNull: false,
            comment: 'HTML body content'
        },
        variables: {
            type: DataTypes.JSON, // Stores array of available vars ["{{name}}", "{{link}}"]
            defaultValue: []
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        tableName: 'email_templates',
        timestamps: true
    });

    return EmailTemplate;
};
