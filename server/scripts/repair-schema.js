require('dotenv').config({ path: require('path').join(__dirname, '../.env') });

const { DataTypes } = require('sequelize');
const { sequelize } = require('../src/config/db');

function timestampSuffix() {
    return new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 14);
}

async function tableExists(tableName) {
    const [rows] = await sequelize.query(`
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = DATABASE()
          AND table_name = :tableName
    `, {
        replacements: { tableName }
    });

    return rows.length > 0;
}

async function createOrdersTable(queryInterface) {
    await queryInterface.createTable('orders', {
        id: {
            type: DataTypes.STRING(36),
            allowNull: false,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.STRING(36),
            allowNull: false
        },
        contact_id: {
            type: DataTypes.STRING(36),
            allowNull: true
        },
        items: {
            type: DataTypes.JSON,
            allowNull: true
        },
        total_price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0
        },
        currency: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'USD'
        },
        source: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: 'manual'
        },
        status: {
            type: DataTypes.ENUM('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'),
            allowNull: false,
            defaultValue: 'Pending'
        },
        shipping_details: {
            type: DataTypes.JSON,
            allowNull: true
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        }
    });

    await queryInterface.addIndex('orders', ['user_id', 'createdAt'], { name: 'orders_user_created_at_idx' });
    await queryInterface.addIndex('orders', ['contact_id'], { name: 'orders_contact_id_idx' });
    await queryInterface.addIndex('orders', ['status'], { name: 'orders_status_idx' });
}

async function createLeadsTable(queryInterface) {
    await queryInterface.createTable('leads', {
        id: {
            type: DataTypes.STRING(36),
            allowNull: false,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.STRING(36),
            allowNull: false
        },
        contact_id: {
            type: DataTypes.STRING(36),
            allowNull: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true
        },
        phone: {
            type: DataTypes.STRING,
            allowNull: true
        },
        intent: {
            type: DataTypes.STRING,
            allowNull: true
        },
        status: {
            type: DataTypes.ENUM('New', 'Contacted', 'Hot', 'Closed', 'Lost'),
            allowNull: false,
            defaultValue: 'New'
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        metadata: {
            type: DataTypes.JSON,
            allowNull: true
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        }
    });

    await queryInterface.addIndex('leads', ['user_id', 'createdAt'], { name: 'leads_user_created_at_idx' });
    await queryInterface.addIndex('leads', ['contact_id'], { name: 'leads_contact_id_idx' });
    await queryInterface.addIndex('leads', ['status'], { name: 'leads_status_idx' });
}

async function createKnowledgeTable(queryInterface) {
    await queryInterface.createTable('knowledge_base', {
        id: {
            type: DataTypes.STRING(36),
            allowNull: false,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.STRING(36),
            allowNull: false
        },
        instance_id: {
            type: DataTypes.STRING(36),
            allowNull: true
        },
        type: {
            type: DataTypes.ENUM('text', 'file', 'url'),
            allowNull: false,
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
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        }
    });

    await queryInterface.addIndex('knowledge_base', ['user_id', 'createdAt'], { name: 'knowledge_user_created_at_idx' });
    await queryInterface.addIndex('knowledge_base', ['instance_id'], { name: 'knowledge_instance_id_idx' });
}

async function createBotsTable(queryInterface) {
    await queryInterface.createTable('bots', {
        id: {
            type: DataTypes.STRING(36),
            allowNull: false,
            primaryKey: true
        },
        user_id: {
            type: DataTypes.STRING(36),
            allowNull: false
        },
        instance_id: {
            type: DataTypes.STRING(36),
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        system_instruction: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        is_active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: true
        },
        metadata: {
            type: DataTypes.JSON,
            allowNull: true
        },
        createdAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        },
        updatedAt: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
        }
    });

    await queryInterface.addIndex('bots', ['user_id', 'createdAt'], { name: 'bots_user_created_at_idx' });
    await queryInterface.addIndex('bots', ['instance_id'], { name: 'bots_instance_id_idx' });
}

async function ensureOrdersTable(queryInterface) {
    if (await tableExists('orders')) {
        console.log('Orders table already exists.');
        return;
    }

    console.log('Creating orders table...');
    await createOrdersTable(queryInterface);
}

async function ensureLeadsTable(queryInterface) {
    if (await tableExists('leads')) {
        console.log('Leads table already exists.');
        return;
    }

    console.log('Creating leads table...');
    await createLeadsTable(queryInterface);
}

async function ensureKnowledgeTable(queryInterface) {
    if (await tableExists('knowledge_base')) {
        console.log('Knowledge table already exists.');
        return;
    }

    console.log('Creating knowledge_base table...');
    await createKnowledgeTable(queryInterface);
}

async function repairBotsTable(queryInterface) {
    if (!(await tableExists('bots'))) {
        console.log('Bots table is missing. Creating a compatible table...');
        await createBotsTable(queryInterface);
        return;
    }

    const columns = await queryInterface.describeTable('bots');
    const isLegacySchema =
        columns.id?.autoIncrement === true ||
        columns.id?.type?.toUpperCase().includes('INT') ||
        columns.user_id?.type?.toUpperCase().includes('INT');

    if (!isLegacySchema) {
        console.log('Bots table already uses the compatible schema.');
        return;
    }

    const backupTableName = `bots_legacy_${timestampSuffix()}`;
    console.log(`Backing up legacy bots table to ${backupTableName}...`);
    await queryInterface.renameTable('bots', backupTableName);

    console.log('Creating compatible bots table...');
    await createBotsTable(queryInterface);

    console.log('Migrating legacy bot rows using whatsapp_instances.instance_id -> whatsapp_instances.id...');
    await sequelize.query(`
        INSERT INTO bots (id, user_id, instance_id, name, system_instruction, is_active, metadata, createdAt, updatedAt)
        SELECT
            UUID(),
            wi.user_id,
            wi.id,
            COALESCE(NULLIF(TRIM(lb.name), ''), 'WhatsApp Bot'),
            lb.system_instruction,
            COALESCE(lb.is_active, 1),
            lb.metadata,
            COALESCE(lb.createdAt, NOW()),
            COALESCE(lb.updatedAt, NOW())
        FROM \`${backupTableName}\` lb
        INNER JOIN whatsapp_instances wi ON wi.instance_id = lb.instance_id
    `);

    const [[migratedRows]] = await sequelize.query('SELECT COUNT(*) AS count FROM bots');
    const [[unresolvedRows]] = await sequelize.query(`
        SELECT COUNT(*) AS count
        FROM \`${backupTableName}\` lb
        LEFT JOIN whatsapp_instances wi ON wi.instance_id = lb.instance_id
        WHERE wi.id IS NULL
    `);

    console.log(`Migrated ${migratedRows.count} bot row(s).`);
    if (unresolvedRows.count > 0) {
        console.log(`Skipped ${unresolvedRows.count} legacy bot row(s) because their instance_id no longer maps to a current WhatsApp instance.`);
    }
}

async function main() {
    try {
        console.log('Connecting to database...');
        await sequelize.authenticate();
        console.log('Database connection successful.');

        const queryInterface = sequelize.getQueryInterface();

        await ensureOrdersTable(queryInterface);
        await ensureLeadsTable(queryInterface);
        await ensureKnowledgeTable(queryInterface);
        await repairBotsTable(queryInterface);

        console.log('Schema repair completed successfully.');
        process.exit(0);
    } catch (error) {
        console.error('Schema repair failed:', error);
        process.exit(1);
    }
}

main();
