require('dotenv').config({ path: '../.env' }); // Adjust path if needed, assuming run from server/scripts
const { sequelize } = require('../src/config/db');
const { User } = require('../src/models');

const email = process.argv[2];

if (!email) {
    console.error('Usage: node set-admin.js <email>');
    process.exit(1);
}

const makeAdmin = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to DB.');

        const user = await User.findOne({ where: { email } });
        if (!user) {
            console.error(`User with email ${email} not found.`);
            process.exit(1);
        }

        user.role = 'admin';
        await user.save();

        console.log(`\nSUCCESS: User ${user.name} (${user.email}) is now an ADMIN.`);
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

makeAdmin();
