require('dotenv').config({ path: '../.env' });
const { Sequelize } = require('sequelize');

async function checkDB() {
    console.log('1. Connecting to DB...');
    console.log('   Host:', process.env.DB_HOST);
    console.log('   User:', process.env.DB_USER);
    console.log('   DB:', process.env.DB_NAME);

    const sequelize = new Sequelize(
        process.env.DB_NAME,
        process.env.DB_USER,
        process.env.DB_PASS,
        {
            host: process.env.DB_HOST,
            dialect: 'mysql',
            logging: false,
            dialectOptions: {
                connectTimeout: 10000
            }
        }
    );

    try {
        await sequelize.authenticate();
        console.log('✅ Connection Successful.');

        console.log('2. Checking tables...');
        const [results] = await sequelize.query('SHOW TABLES');
        const tables = results.map(r => Object.values(r)[0]);
        console.log('   Tables found:', tables.join(', '));

        console.log('3. Checking "lid_mappings" table...');
        if (tables.includes('lid_mappings')) {
            console.log('✅ Table "lid_mappings" exists.');

            // Try to query it
            try {
                const count = await sequelize.query('SELECT count(*) as count FROM lid_mappings');
                console.log('✅ Select query worked. Count:', count[0][0].count);
            } catch (err) {
                console.error('❌ Select query failed:', err.original ? err.original.sqlMessage : err.message);
            }

        } else {
            console.error('❌ Table "lid_mappings" DOES NOT EXIST.');
            console.error('   -> This is the cause of the 500 Error in getRecentChats.');
        }

    } catch (error) {
        console.error('❌ Connection failed:', error.message);
    } finally {
        await sequelize.close();
    }
}

checkDB();
