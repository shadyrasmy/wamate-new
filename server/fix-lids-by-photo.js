const { Contact, Message, sequelize } = require('./src/models');
const { Op } = require('sequelize');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

/**
 * SMART DEDUPLICATION SCRIPT
 * Uses profile photo URLs as unique fingerprints to detect duplicate contacts
 * and correct LID mappings.
 * 
 * Theory: Profile photos are unique per WhatsApp account, so if two contacts
 * have the EXACT same profile_pic URL, they're the same person.
 */

(async () => {
    try {
        console.log('\n=== PROFILE-PHOTO-BASED LID CORRECTION ===\n');
        console.log('This script uses profile photos as unique identifiers to detect');
        console.log('and merge duplicate contacts with incorrect LID mappings.\n');

        // 1. Find all contacts with profile pictures
        const contactsWithPhotos = await Contact.findAll({
            where: {
                profile_pic: { [Op.ne]: null }
            },
            order: [['profile_pic', 'ASC']]
        });

        console.log(`📸 Found ${contactsWithPhotos.length} contacts with profile photos\n`);

        // 2. Group by profile_pic URL
        const photoGroups = {};
        contactsWithPhotos.forEach(c => {
            if (!photoGroups[c.profile_pic]) {
                photoGroups[c.profile_pic] = [];
            }
            photoGroups[c.profile_pic].push(c);
        });

        // 3. Find duplicates (same photo = same person)
        const duplicateGroups = Object.entries(photoGroups)
            .filter(([url, contacts]) => contacts.length > 1);

        console.log(`🔍 Found ${duplicateGroups.length} profile photos shared by multiple contacts\n`);

        if (duplicateGroups.length === 0) {
            console.log('✅ No duplicate contacts found. Database is clean!');
            rl.close();
            await sequelize.close();
            return;
        }

        // 4. Analyze each duplicate group
        let totalIssues = 0;
        let autoFixable = 0;
        let needsReview = 0;

        const issues = [];

        for (const [photoUrl, contacts] of duplicateGroups) {
            // Get message counts for each contact
            const contactsWithMsgCount = await Promise.all(
                contacts.map(async (c) => {
                    const msgCount = await Message.count({
                        where: { jid: c.jid, instance_id: c.instance_id }
                    });
                    return { ...c.toJSON(), messageCount: msgCount };
                })
            );

            // Find the "canonical" contact (phone JID > LID JID, more messages better)
            contactsWithMsgCount.sort((a, b) => {
                // Prefer phone JID over LID JID
                const aIsPhone = !a.jid.endsWith('@lid');
                const bIsPhone = !b.jid.endsWith('@lid');
                if (aIsPhone && !bIsPhone) return -1;
                if (!aIsPhone && bIsPhone) return 1;

                // Then prefer more messages
                return b.messageCount - a.messageCount;
            });

            const canonical = contactsWithMsgCount[0];
            const duplicates = contactsWithMsgCount.slice(1);

            // Check if there's a conflict
            const differentJids = new Set(contactsWithMsgCount.map(c => c.jid)).size > 1;
            const differentLids = new Set(contactsWithMsgCount.filter(c => c.lid).map(c => c.lid)).size > 1;

            if (differentJids || differentLids) {
                totalIssues++;

                const issue = {
                    photoUrl: photoUrl.substring(0, 60) + '...',
                    canonical,
                    duplicates,
                    canAutoFix: duplicates.every(d => d.messageCount === 0)
                };

                if (issue.canAutoFix) {
                    autoFixable++;
                } else {
                    needsReview++;
                }

                issues.push(issue);
            }
        }

        console.log('=== ANALYSIS RESULTS ===\n');
        console.log(`Total duplicate groups: ${duplicateGroups.length}`);
        console.log(`Issues requiring action: ${totalIssues}`);
        console.log(`  - Auto-fixable (0 messages): ${autoFixable}`);
        console.log(`  - Needs review (has messages): ${needsReview}\n`);

        if (totalIssues === 0) {
            console.log('✅ All duplicates have matching JIDs/LIDs. No action needed!');
            rl.close();
            await sequelize.close();
            return;
        }

        // 5. Show issues and prompt for action
        console.log('=== DETECTED ISSUES ===\n');

        for (let i = 0; i < issues.length; i++) {
            const issue = issues[i];
            console.log(`\n--- Issue ${i + 1}/${issues.length} ---`);
            console.log(`Photo URL: ${issue.photoUrl}`);
            console.log(`\nCANONICAL (Keep):`);
            console.log(`  Name: ${issue.canonical.name || 'Unknown'}`);
            console.log(`  JID: ${issue.canonical.jid}`);
            console.log(`  LID: ${issue.canonical.lid || 'None'}`);
            console.log(`  Messages: ${issue.canonical.messageCount}`);
            console.log(`  Created: ${issue.canonical.createdAt}`);

            console.log(`\nDUPLICATES (${issue.duplicates.length}):`);
            issue.duplicates.forEach((dup, idx) => {
                console.log(`  ${idx + 1}. ${dup.name || 'Unknown'}`);
                console.log(`     JID: ${dup.jid}`);
                console.log(`     LID: ${dup.lid || 'None'}`);
                console.log(`     Messages: ${dup.messageCount}`);
            });

            if (issue.canAutoFix) {
                console.log(`\n✅ Auto-fixable: All duplicates have 0 messages.`);
                console.log(`   Action: Delete duplicates, keep canonical`);
            } else {
                console.log(`\n⚠️  Needs review: Some duplicates have messages.`);
                console.log(`   Recommended: Merge into canonical, migrate messages`);
            }
        }

        console.log('\n\n=== CLEANUP OPTIONS ===\n');
        console.log('1. Auto-fix safe issues (delete 0-message duplicates)');
        console.log('2. Fix all issues (merge & migrate messages)');
        console.log('3. Export issues to JSON for manual review');
        console.log('4. Cancel');

        const choice = await question('\nYour choice (1-4): ');

        let fixed = 0;

        if (choice === '1') {
            console.log('\n🔧 Auto-fixing safe issues...\n');

            for (const issue of issues) {
                if (issue.canAutoFix) {
                    for (const dup of issue.duplicates) {
                        console.log(`Deleting: ${dup.name} (${dup.jid})`);
                        await Contact.destroy({ where: { id: dup.id } });
                        fixed++;
                    }
                }
            }

            console.log(`\n✅ Fixed ${fixed} contacts`);

        } else if (choice === '2') {
            console.log('\n🔧 Fixing all issues with merge...\n');

            for (const issue of issues) {
                // Update canonical with best LID
                const allLids = [issue.canonical.lid, ...issue.duplicates.map(d => d.lid)].filter(Boolean);
                const bestLid = allLids.find(lid => !lid.endsWith('@lid')) || allLids[0];

                if (bestLid && issue.canonical.lid !== bestLid) {
                    console.log(`Updating canonical LID: ${issue.canonical.lid} -> ${bestLid}`);
                    await Contact.update(
                        { lid: bestLid },
                        { where: { id: issue.canonical.id } }
                    );
                }

                // Migrate messages from duplicates to canonical
                for (const dup of issue.duplicates) {
                    if (dup.messageCount > 0) {
                        console.log(`Migrating ${dup.messageCount} messages from ${dup.jid} to ${issue.canonical.jid}`);
                        await Message.update(
                            { jid: issue.canonical.jid },
                            { where: { jid: dup.jid, instance_id: dup.instance_id } }
                        );
                    }

                    console.log(`Deleting duplicate: ${dup.name} (${dup.jid})`);
                    await Contact.destroy({ where: { id: dup.id } });
                    fixed++;
                }
            }

            console.log(`\n✅ Merged and fixed ${fixed} contacts`);

        } else if (choice === '3') {
            const fs = require('fs');
            const exportData = issues.map(issue => ({
                photo_url: issue.photoUrl,
                canonical: {
                    name: issue.canonical.name,
                    jid: issue.canonical.jid,
                    lid: issue.canonical.lid,
                    messages: issue.canonical.messageCount
                },
                duplicates: issue.duplicates.map(d => ({
                    name: d.name,
                    jid: d.jid,
                    lid: d.lid,
                    messages: d.messageCount
                }))
            }));

            const filename = `lid_issues_${Date.now()}.json`;
            fs.writeFileSync(filename, JSON.stringify(exportData, null, 2));
            console.log(`\n📄 Exported to: ${filename}`);

        } else {
            console.log('\n❌ Cancelled. No changes made.');
        }

        if (fixed > 0) {
            console.log('\n✅ CLEANUP COMPLETE');
            console.log(`Run the diagnostic again to verify: node check-lid-integrity.js`);
        }

        rl.close();
        await sequelize.close();

    } catch (error) {
        console.error('❌ Error:', error);
        rl.close();
        process.exit(1);
    }
})();
