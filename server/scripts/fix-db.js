const { sequelize, Plan } = require('../src/models');

async function fix() {
    try {
        console.log('--- Database Fix & Verify Script ---');

        // 1. Find and drop all foreign keys on all tables
        console.log('Searching for all foreign keys...');
        const [constraints] = await sequelize.query(`
            SELECT TABLE_NAME, CONSTRAINT_NAME 
            FROM information_schema.TABLE_CONSTRAINTS 
            WHERE TABLE_SCHEMA = DATABASE()
            AND CONSTRAINT_TYPE = 'FOREIGN KEY'
        `);

        console.log(`Found ${constraints.length} total constraints.`);

        for (const c of constraints) {
            console.log(`Attempting to drop constraint: ${c.CONSTRAINT_NAME} from ${c.TABLE_NAME}...`);
            try {
                await sequelize.query(`ALTER TABLE ${c.TABLE_NAME} DROP FOREIGN KEY ${c.CONSTRAINT_NAME}`);
                console.log(`✅ Dropped ${c.CONSTRAINT_NAME}`);
            } catch (e) {
                console.log(`❌ Failed to drop ${c.CONSTRAINT_NAME}: ${e.message}`);
            }
        }

        // 1.5 Inspect and DROP all non-primary indexes from ALL tables
        console.log('\n--- Cleaning All Indexes ---');
        const [tables] = await sequelize.query(`SHOW TABLES`);
        const dbName = sequelize.config.database;
        const tableKey = `Tables_in_${dbName}`;

        for (const tableRow of tables) {
            const tableName = tableRow[tableKey];
            console.log(`\nProcessing table: ${tableName}`);

            const [existingIndexes] = await sequelize.query(`SHOW INDEX FROM ${tableName}`);
            const indexNames = [...new Set(existingIndexes.map(idx => idx.Key_name))];

            for (const idxName of indexNames) {
                if (idxName === 'PRIMARY') continue;
                console.log(`  Attempting to drop index: ${idxName}...`);
                try {
                    await sequelize.query(`ALTER TABLE ${tableName} DROP INDEX ${idxName}`);
                    console.log(`  ✅ Dropped index ${idxName}`);
                } catch (e) {
                    console.log(`  ❌ Failed to drop index ${idxName}: ${e.message}`);
                }
            }
        }

        // 2. Check Plans
        const count = await Plan.count();
        console.log(`\n--- Plan Verification ---`);
        console.log(`Total Plans in Database: ${count}`);

        if (count === 0) {
            console.log('Seeding default plans...');
            await Plan.bulkCreate([
                { name: 'free', price: 0, monthly_message_limit: 1000, max_instances: 1, max_seats: 1, description: 'Connectivity for individuals.' },
                { name: 'pro', price: 49.99, monthly_message_limit: 10000, max_instances: 5, max_seats: 5, description: 'Growth tier for small teams.' },
                { name: 'enterprise', price: 199.99, monthly_message_limit: 100000, max_instances: 20, max_seats: 20, description: 'Global scale operations.' }
            ]);
            console.log('✅ Default plans seeded successfully!');
        } else {
            console.log('Plans already exist. Skipping seeding.');
            const plans = await Plan.findAll();
            plans.forEach(p => {
                console.log(`- [${p.name}] Price: ${p.price}, Instance Limit: ${p.max_instances}`);
            });
        }

        console.log('\nDone.');
        process.exit(0);
    } catch (error) {
        console.error('Fatal error in fix script:', error);
        process.exit(1);
    }
}

fix();
