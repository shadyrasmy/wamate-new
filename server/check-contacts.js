const { Contact, sequelize } = require('./src/models');

(async () => {
    try {
        const contacts = await Contact.findAll({
            limit: 30,
            order: [['createdAt', 'DESC']]
        });

        console.log('\n=== Recent Contacts ===\n');
        contacts.forEach(c => {
            console.log(JSON.stringify({
                id: c.id,
                jid: c.jid,
                lid: c.lid,
                name: c.name,
                user_id: c.user_id,
                instance_id: c.instance_id
            }, null, 2));
            console.log('---');
        });

        // Check for potential issues
        console.log('\n=== Checking for Issues ===\n');

        // 1. Contacts with LID as JID
        const lidAsJid = contacts.filter(c => c.jid && c.jid.endsWith('@lid'));
        console.log(`Contacts with LID as primary JID: ${lidAsJid.length}`);
        lidAsJid.forEach(c => console.log(`  - ${c.jid} (name: ${c.name})`));

        // 2. Contacts with matching JID and LID
        const matchingJidLid = contacts.filter(c => c.jid === c.lid);
        console.log(`\nContacts with JID === LID: ${matchingJidLid.length}`);
        matchingJidLid.forEach(c => console.log(`  - ${c.jid}`));

        // 3. Contacts with phone JID but no LID
        const phoneMissingLid = contacts.filter(c => c.jid && c.jid.endsWith('@s.whatsapp.net') && !c.lid);
        console.log(`\nContacts with phone JID but missing LID: ${phoneMissingLid.length}`);

        // 4. Duplicate JIDs
        const jidCounts = {};
        contacts.forEach(c => {
            if (c.jid) {
                jidCounts[c.jid] = (jidCounts[c.jid] || 0) + 1;
            }
        });
        const duplicates = Object.entries(jidCounts).filter(([jid, count]) => count > 1);
        console.log(`\nDuplicate JIDs found: ${duplicates.length}`);
        duplicates.forEach(([jid, count]) => console.log(`  - ${jid} (${count} times)`));

        await sequelize.close();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
})();
