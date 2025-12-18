require('dotenv').config({ path: '../.env' });
const { sequelize } = require('../src/config/db');
const { User, WhatsAppInstance, Message, Contact } = require('../src/models');
const { v4: uuidv4 } = require('uuid');

const seedMessage = async () => {
    try {
        console.log('🔌 Connecting to Database...');
        await sequelize.authenticate();
        console.log('✅ Connected.');

        // 1. Get or Create User
        let user = await User.findOne({ where: { email: 'admin@test.com' } });
        if (!user) {
            console.log('Creating mock user...');
            user = await User.create({
                name: 'Test Admin',
                email: 'admin@test.com',
                password: 'password123',
                role: 'admin'
            });
        }
        console.log(`👤 User: ${user.email} (${user.id})`);

        // 2. Get or Create Instance
        let instance = await WhatsAppInstance.findOne({ where: { user_id: user.id } });
        if (!instance) {
            console.log('Creating mock instance...');
            instance = await WhatsAppInstance.create({
                user_id: user.id,
                instance_id: uuidv4(),
                name: 'Mock Instance',
                status: 'connected',
                phone_number: '1234567890'
            });
        }
        console.log(`📱 Instance: ${instance.instance_id} (${instance.id})`);

        // 3. Mock Incoming Message Data
        const jid = '5551234567@s.whatsapp.net';
        const msgId = 'MOCK_' + Date.now();
        const content = 'Hello! This is a test message injected directly into the DB. 🚀';

        console.log('📝 Creating Contact and Message...');

        // 4. Ensure Contact Exists
        await Contact.findOrCreate({
            where: { jid, instance_id: instance.id },
            defaults: {
                name: 'Mock Sender',
                push_name: 'Mock Sender',
                profile_picture: null,
                instance_id: instance.id,
                last_active: new Date()
            }
        });

        // 5. Create Message
        const message = await Message.create({
            instance_id: instance.id,
            message_id: msgId,
            jid: jid,
            from_me: false,
            type: 'text',
            content: content,
            timestamp: new Date(),
            status: 'delivered'
        });

        console.log('\n✅ SUCCESS: Message Saved to Database!');
        console.log('---------------------------------------');
        console.log('ID:', message.id);
        console.log('JID:', message.jid);
        console.log('Content:', message.content);
        console.log('Time:', message.timestamp);
        console.log('---------------------------------------');

        process.exit(0);

    } catch (error) {
        console.error('\n❌ ERROR: Failed to save message.');
        console.error(error.message);
        if (error.message.includes('max_questions')) {
            console.error('⚠️  CRITICAL: Database Query Limit Exceeded (FreeDB Limit).');
        }
        process.exit(1);
    }
};

seedMessage();
