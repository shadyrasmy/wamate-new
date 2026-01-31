const { Contact, sequelize } = require('./src/models');
const { Op } = require('sequelize');

/**
 * PRODUCTION-SAFE: Read-only diagnostic for large databases
 * Run this FIRST on production to assess scope before any cleanup
 */

(async () => {
    try {
        console.log('\n=== PRODUCTION LID DIAGNOSTIC (Read-Only) ===\n');
        console.log('⚠️  This script is READ-ONLY and makes NO changes to your database.\n');

        const startTime = Date.now();

        // Get total contact count
        const totalContacts = await Contact.count();
        console.log(`📊 Total Contacts: ${totalContacts.toLocaleString()}\n`);

        // 1. Contacts with LID field set
        const contactsWithLid = await Contact.count({
            where: { lid: { [Op.ne]: null } }
        });
        console.log(`Contacts with LID field: ${contactsWithLid.toLocaleString()} (${(contactsWithLid / totalContacts * 100).toFixed(2)}%)`);

        // 2. Swapped JID/LID (both fields same LID)
        const swappedCount = await sequelize.query(
            `SELECT COUNT(*) as count FROM contacts WHERE jid LIKE '%@lid' AND jid = lid`,
            { type: sequelize.QueryTypes.SELECT }
        );
        console.log(`Swapped JID/LID: ${swappedCount[0].count.toLocaleString()}`);

        // 3. LID-only contacts (JID ends with @lid)
        const lidOnlyCount = await Contact.count({
            where: { jid: { [Op.like]: '%@lid' } }
        });
        console.log(`LID-only contacts (JID ends with @lid): ${lidOnlyCount.toLocaleString()}`);

        // 4. Find duplicate LID mappings (CRITICAL)
        const duplicateLids = await sequelize.query(`
            SELECT lid, COUNT(*) as count 
            FROM contacts 
            WHERE lid IS NOT NULL 
            GROUP BY lid 
            HAVING count > 1
            ORDER BY count DESC
            LIMIT 50
        `, { type: sequelize.QueryTypes.SELECT });

        console.log(`\n🚨 Duplicate LID Mappings: ${duplicateLids.length}`);
        if (duplicateLids.length > 0) {
            console.log('\nTop duplicate LIDs:');
            for (const { lid, count } of duplicateLids.slice(0, 10)) {
                console.log(`  - ${lid}: ${count} contacts`);
            }
            if (duplicateLids.length > 10) {
                console.log(`  ... and ${duplicateLids.length - 10} more`);
            }
        }

        // 5. Check for naming issues
        const fromMeNames = await Contact.count({
            where: {
                name: { [Op.like]: '%from%me%' }
            }
        });
        console.log(`\n📛 Contacts with "from me" in name: ${fromMeNames.toLocaleString()}`);

        // 6. Contacts with numeric-only names (potential bug indicator)
        const numericNames = await Contact.count({
            where: {
                name: { [Op.regexp]: '^[0-9]+$' }
            }
        });
        console.log(`Contacts with numeric-only names: ${numericNames.toLocaleString()}`);

        // 7. Estimate severity
        const totalIssues = parseInt(swappedCount[0].count) + duplicateLids.length;
        const severityPercent = (totalIssues / totalContacts * 100).toFixed(2);

        console.log('\n=== SEVERITY ASSESSMENT ===');
        console.log(`Total issues found: ${totalIssues.toLocaleString()}`);
        console.log(`Affected percentage: ${severityPercent}%`);

        if (severityPercent > 5) {
            console.log('🔴 HIGH SEVERITY - Manual review required before cleanup');
        } else if (severityPercent > 1) {
            console.log('🟡 MEDIUM SEVERITY - Interactive cleanup recommended');
        } else {
            console.log('🟢 LOW SEVERITY - Automated cleanup safe');
        }

        // 8. Sample affected contacts
        if (duplicateLids.length > 0) {
            console.log('\n=== SAMPLE: First Duplicate LID Details ===');
            const firstDupe = duplicateLids[0];
            const affectedContacts = await Contact.findAll({
                where: { lid: firstDupe.lid },
                attributes: ['id', 'jid', 'lid', 'name', 'createdAt'],
                limit: 5
            });

            console.log(`\nLID: ${firstDupe.lid} (${firstDupe.count} contacts):`);
            affectedContacts.forEach(c => {
                console.log(`  - ${c.name || 'Unknown'}`);
                console.log(`    JID: ${c.jid}`);
                console.log(`    Created: ${c.createdAt}`);
            });
        }

        const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
        console.log(`\n✅ Diagnostic completed in ${elapsed}s`);
        console.log('\n💡 NEXT STEPS:');
        console.log('1. Review the numbers above');
        console.log('2. If severity is HIGH, export affected contacts for manual review');
        console.log('3. Run this script on PRODUCTION to see full scope');
        console.log('4. Only proceed with cleanup after backing up database');

        await sequelize.close();
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
})();
