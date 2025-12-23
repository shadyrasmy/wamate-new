/**
 * Script to merge duplicate contacts (LID + Phone JID) in the database
 * Run this once to fix existing split conversations
 * 
 * Usage: node scripts/merge-lid-contacts.js
 */

require('dotenv').config();
const { Sequelize, Op } = require('sequelize');

const sequelize = new Sequelize(
    process.env.DB_NAME || 'wamate_new',
    process.env.DB_USER || 'root',
    process.env.DB_PASS || '',
    {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql',
        logging: false
    }
);

async function mergeContacts() {
    try {
        await sequelize.authenticate();
        console.log('✅ Connected to database');

        // Find all LID-only contacts (jid ends with @lid)
        const [lidContacts] = await sequelize.query(`
            SELECT c1.id, c1.jid, c1.lid, c1.user_id, c1.instance_id, c1.name, c1.push_name, c1.profile_pic
            FROM contacts c1
            WHERE c1.jid LIKE '%@lid'
        `);

        console.log(`Found ${lidContacts.length} LID-only contacts`);

        let mergedCount = 0;
        let updatedCount = 0;

        for (const lidContact of lidContacts) {
            // Extract potential phone number from LID (the number before @lid)
            const lidNumber = lidContact.jid.split('@')[0];

            // Look for a matching phone contact (same user_id, instance_id)
            // that has a lid field matching this LID
            const [phoneContacts] = await sequelize.query(`
                SELECT id, jid, lid, name, push_name, profile_pic
                FROM contacts 
                WHERE user_id = ? 
                  AND instance_id = ?
                  AND jid LIKE '%@s.whatsapp.net'
                  AND (lid = ? OR lid IS NULL)
                  AND id != ?
                ORDER BY 
                    CASE WHEN lid = ? THEN 0 ELSE 1 END
                LIMIT 1
            `, {
                replacements: [
                    lidContact.user_id,
                    lidContact.instance_id,
                    lidContact.jid,
                    lidContact.id,
                    lidContact.jid
                ]
            });

            if (phoneContacts.length > 0) {
                const phoneContact = phoneContacts[0];

                console.log(`\nMerging: ${lidContact.jid} -> ${phoneContact.jid}`);

                // Update the phone contact to have the LID
                await sequelize.query(`
                    UPDATE contacts 
                    SET lid = ?,
                        name = COALESCE(NULLIF(name, ''), ?),
                        push_name = COALESCE(push_name, ?),
                        profile_pic = COALESCE(profile_pic, ?)
                    WHERE id = ?
                `, {
                    replacements: [
                        lidContact.jid,
                        lidContact.name,
                        lidContact.push_name,
                        lidContact.profile_pic,
                        phoneContact.id
                    ]
                });

                // Move all messages from LID contact to phone contact
                const [moveResult] = await sequelize.query(`
                    UPDATE messages 
                    SET jid = ?
                    WHERE jid = ? AND instance_id = ?
                `, {
                    replacements: [
                        phoneContact.jid,
                        lidContact.jid,
                        lidContact.instance_id
                    ]
                });

                console.log(`  - Moved messages to ${phoneContact.jid}`);

                // Delete the LID contact
                await sequelize.query(`
                    DELETE FROM contacts WHERE id = ?
                `, {
                    replacements: [lidContact.id]
                });

                console.log(`  - Deleted duplicate LID contact`);
                mergedCount++;
            } else {
                // No matching phone contact found - this might be a valid LID-only contact
                // Or we need to upgrade it if we can find the phone number
                console.log(`⚠️ No phone contact found for ${lidContact.jid} - keeping as LID contact`);
            }
        }

        console.log(`\n✅ Merge complete!`);
        console.log(`   - Merged: ${mergedCount} contacts`);
        console.log(`   - Remaining LID-only: ${lidContacts.length - mergedCount}`);

    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await sequelize.close();
    }
}

mergeContacts();
