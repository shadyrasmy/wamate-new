const { sequelize, SiteConfig } = require('../src/models');

const resetConfig = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to DB.');

        // Delete existing config to force re-creation with defaults or update it
        await SiteConfig.destroy({ where: {}, truncate: true });

        // Create new one with explicit defaults to be safe
        const defaultConfig = await SiteConfig.create({});

        console.log('✅ Site Configuration has been reset to defaults.');
        console.log('Landing content:', JSON.stringify(defaultConfig.landing_content, null, 2));

        process.exit(0);
    } catch (error) {
        console.error('Error resetting config:', error);
        process.exit(1);
    }
};

resetConfig();
