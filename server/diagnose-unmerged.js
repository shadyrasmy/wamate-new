const { Contact, Message, sequelize } = require('./src/models');
const { Op } = require('sequelize');

/**
 * Search for a contact by JID pattern or name
 */

(async () => {
    try {
        console.log('\n=== CONTACT SEARCH ===\n');

        const jid1 = '201550217089@s.whatsapp.net';
        const lidPattern = '54160242303150';

        console.log(`Searching for:`);
        console.log(`  Phone JID: ${jid1}`);
        console.log(`  LID pattern: ${lidPattern}\n`);

        // 1. Find contact by phone JID
        const phoneContact = await Contact.findOne({ where: { jid: jid1 } });

        if (phoneContact) {
            console.log('=== PHONE CONTACT FOUND ===');
            console.log(`Name: ${phoneContact.name || 'Unknown'}`);
            console.log(`JID: ${phoneContact.jid}`);
            console.log(`LID: ${phoneContact.lid || 'None'}`);
            console.log(`Profile Pic: ${phoneContact.profile_pic ? phoneContact.profile_pic.substring(0, 80) + '...' : 'None'}`);
            console.log(`User ID: ${phoneContact.user_id}`);
            console.log(`Instance ID: ${phoneContact.instance_id}`);

            const msgCount = await Message.count({
                where: { jid: phoneContact.jid, instance_id: phoneContact.instance_id }
            });
            console.log(`Messages: ${msgCount}\n`);

            // Check if this contact already has a LID
            if (phoneContact.lid) {
                console.log(`✓ This contact already has LID: ${phoneContact.lid}`);
                if (phoneContact.lid.includes(lidPattern)) {
                    console.log(`  ✅ LID matches the pattern you're looking for!`);
                    console.log(`  → They are already merged correctly.`);
                } else {
                    console.log(`  ⚠️  LID is different from the one you mentioned.`);
                }
            } else {
                console.log(`❌ This contact has NO LID field set.`);
            }
        } else {
            console.log('❌ Phone contact NOT found in database\n');
        }

        // 2. Search for any contact with the LID pattern
        console.log('\n=== SEARCHING FOR LID PATTERN ===');
        const lidContacts = await Contact.findAll({
            where: {
                [Op.or]: [
                    { jid: { [Op.like]: `%${lidPattern}%` } },
                    { lid: { [Op.like]: `%${lidPattern}%` } }
                ]
            }
        });

        if (lidContacts.length > 0) {
            console.log(`Found ${lidContacts.length} contact(s) matching LID pattern:\n`);

            for (const c of lidContacts) {
                const msgCount = await Message.count({
                    where: { jid: c.jid, instance_id: c.instance_id }
                });

                console.log(`- Name: ${c.name || 'Unknown'}`);
                console.log(`  JID: ${c.jid}`);
                console.log(`  LID: ${c.lid || 'None'}`);
                console.log(`  Messages: ${msgCount}`);
                console.log(`  Created: ${c.createdAt}\n`);
            }
        } else {
            console.log(`No contacts found with LID pattern "${lidPattern}"\n`);
        }

        // 3. If phone contact has a profile pic, find ALL contacts with same photo
        if (phoneContact && phoneContact.profile_pic) {
            console.log('\n=== SEARCHING FOR SAME PROFILE PHOTO ===');
            const samePhotoContacts = await Contact.findAll({
                where: {
                    profile_pic: phoneContact.profile_pic,
                    id: { [Op.ne]: phoneContact.id } // Exclude the phone contact itself
                }
            });

            if (samePhotoContacts.length > 0) {
                console.log(`🔍 Found ${samePhotoContacts.length} other contact(s) with SAME profile photo:\n`);

                for (const c of samePhotoContacts) {
                    const msgCount = await Message.count({
                        where: { jid: c.jid, instance_id: c.instance_id }
                    });

                    console.log(`- Name: ${c.name || 'Unknown'}`);
                    console.log(`  JID: ${c.jid}`);
                    console.log(`  LID: ${c.lid || 'None'}`);
                    console.log(`  Messages: ${msgCount}`);
                    console.log(`  User: ${c.user_id}`);
                    console.log(`  Instance: ${c.instance_id}`);
                    console.log(`  Created: ${c.createdAt}\n`);
                }

                console.log('⚠️  DUPLICATE DETECTED! These should be merged.');
            } else {
                console.log('✅ No other contacts found with the same profile photo.\n');
            }
        }

        // 4. Check messages table for the LID
        console.log('\n=== CHECKING MESSAGES TABLE ===');
        const lidMessages = await Message.count({
            where: { jid: { [Op.like]: `%${lidPattern}%` } }
        });

        console.log(`Messages with LID pattern in jid field: ${lidMessages}`);

        if (lidMessages > 0) {
            const sample = await Message.findOne({
                where: { jid: { [Op.like]: `%${lidPattern}%` } },
                order: [['timestamp', 'DESC']]
            });

            console.log(`Sample message JID: ${sample.jid}`);
            console.log(`  → This is the JID being used in messages`);

            // Check if there's a contact for this exact JID
            const exactContact = await Contact.findOne({ where: { jid: sample.jid } });
            if (!exactContact) {
                console.log(`  ⚠️  No contact record exists for this JID!`);
                console.log(`  → Messages are orphaned (no contact to display them under)`);
            }
        }

        console.log('\n=== CONCLUSION ===');
        if (phoneContact && phoneContact.lid && phoneContact.lid.includes(lidPattern)) {
            console.log('✅ Contacts are already merged correctly.');
            console.log('   The LID is stored in the phone contact\'s lid field.');
            console.log('\n   If you\'re still seeing 2 conversations, the issue is in the frontend.');
            console.log('   Check how the frontend queries contacts/messages.');
        } else if (!phoneContact) {
            console.log('❌ Phone contact not found. Check if JID is correct.');
        } else {
            console.log('⚠️  Contacts may need manual merging.');
            console.log('    Review the findings above and use merge-specific-contacts.js');
        }

        await sequelize.close();

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
})();
