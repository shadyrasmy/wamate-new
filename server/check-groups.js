const { Message, sequelize } = require('./src/models');
const { Op } = require('sequelize');

/**
 * Investigate why SOME group messages are missing
 * (not all - just some specific messages)
 */

(async () => {
    try {
        console.log('\n=== GROUP MESSAGE LOSS INVESTIGATION ===\n');

        // 1. Get all groups
        const groupJids = await Message.findAll({
            where: { jid: { [Op.like]: '%@g.us' } },
            attributes: [[sequelize.fn('DISTINCT', sequelize.col('jid')), 'jid']],
            raw: true
        });

        console.log(`Found ${groupJids.length} groups with messages\n`);

        if (groupJids.length === 0) {
            console.log('❌ No group messages at all. Check if groups are being filtered before saveMessage.');
            await sequelize.close();
            return;
        }

        // 2. For each group, check message continuity
        for (const { jid } of groupJids) {
            const messages = await Message.findAll({
                where: { jid },
                attributes: ['message_id', 'content', 'timestamp', 'from_me', 'type'],
                order: [['timestamp', 'ASC']],
                limit: 100
            });

            console.log(`\nGroup: ${jid}`);
            console.log(`Total messages saved: ${messages.length}`);

            // Check if there are gaps in the timeline
            if (messages.length > 1) {
                const timeGaps = [];
                for (let i = 1; i < messages.length; i++) {
                    const prev = new Date(messages[i - 1].timestamp);
                    const current = new Date(messages[i].timestamp);
                    const diffMinutes = (current - prev) / (1000 * 60);

                    // If there's a gap > 1 hour between messages, might indicate missing messages
                    if (diffMinutes > 60) {
                        timeGaps.push({
                            from: prev.toISOString(),
                            to: current.toISOString(),
                            gapHours: (diffMinutes / 60).toFixed(1)
                        });
                    }
                }

                if (timeGaps.length > 0) {
                    console.log(`  ⚠️  Detected ${timeGaps.length} time gaps (>1hr):`);
                    timeGaps.slice(0, 3).forEach(gap => {
                        console.log(`    - ${gap.gapHours}hr gap: ${gap.from} → ${gap.to}`);
                    });
                } else {
                    console.log(`  ✅ No suspicious time gaps`);
                }
            }

            // Check message types
            const typeCount = {};
            messages.forEach(m => {
                typeCount[m.type] = (typeCount[m.type] || 0) + 1;
            });

            console.log(`  Message types: ${JSON.stringify(typeCount)}`);

            // Check from_me ratio
            const fromMeCount = messages.filter(m => m.from_me).length;
            console.log(`  Sent by you: ${fromMeCount}, Received: ${messages.length - fromMeCount}`);
        }

        console.log('\n=== POSSIBLE CAUSES FOR MISSING MESSAGES ===');
        console.log('1. Message type filtering - Check if certain types are skipped');
        console.log('   → Location: whatsapp.service.js saveMessage function');
        console.log('');
        console.log('2. System messages skipped - protocolMessage, senderKeyDistribution');
        console.log('   → These are intentionally skipped (normal)');
        console.log('');
        console.log('3. Error during save - Message save fails silently');
        console.log('   → Check PM2 logs for errors: pm2 logs --lines 100 | grep "Error saving message"');
        console.log('');
        console.log('4. Group sync not complete - Need to sync group history');
        console.log('   → Baileys only syncs recent messages, not full history');
        console.log('');
        console.log('5. Specific message content causing save failure');
        console.log('   → e.g., malformed media, unsupported message type');

        console.log('\n=== RECOMMENDATION ===');
        console.log('Monitor PM2 logs while someone sends a message in the group:');
        console.log('  pm2 logs --lines 0');
        console.log('');
        console.log('Look for:');
        console.log('  - "[DEBUG] Baileys Upsert: Type = notify, Count = X" (new message)');
        console.log('  - "Error saving message" (indicates save failure)');
        console.log('  - "[WA] Skipping system message type: ..." (normal, not a problem)');

        await sequelize.close();

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
})();
