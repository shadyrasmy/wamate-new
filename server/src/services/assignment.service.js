const { Seat, Contact, Message } = require('../models');

class AssignmentService {
    /**
     * Assigns a chat (jid) to a seat using Round Robin or Sticky assignment.
     * @param {string} instanceId 
     * @param {string} userId - The main user ID (manager)
     * @param {string} jid 
     */
    async assignChat(instanceId, userId, jid) {
        try {
            // 1. Check if already assigned
            let contact = await Contact.findOne({ where: { jid, instance_id: instanceId } }); // Note: Contact model needs instance_id or unique constraint

            // If contact doesn't exist or isn't assigned, proceed
            if (contact && contact.assigned_seat_id) {
                return; // Already assigned
            }

            // 2. Sticky Assignment Check (Logic could be here: check history)
            // For now, simpler: Round Robin

            // 3. Find Available Seats (Online & Available)
            const availableSeats = await Seat.findAll({
                where: {
                    user_id: userId,
                    status: ['online', 'available'] // Only assign if online? Or any status? Let's say online/avail.
                },
                order: [['last_assigned_at', 'ASC']] // Get the one waiting longest
            });

            if (availableSeats.length === 0) {
                console.log(`[Assignment] No available seats for user ${userId}`);
                return; // Leave unassigned
            }

            // 4. Select Seat (Round Robin based on time or count)
            // Here we use 'last_assigned_at' to pick the seat that hasn't received a chat for the longest time
            const selectedSeat = availableSeats[0];

            // 5. Update Contact with Assignment
            if (!contact) {
                // Should have been created by saveMessage logic usually, but to be safe calculate/find
                // For now assuming contact exists or we update metadata elsewhere
                // Actually saveMessage calls upsert Contact. WE should hook into that.
            } else {
                contact.assigned_seat_id = selectedSeat.id;
                await contact.save();
            }

            // 6. Update Seat Stats
            selectedSeat.last_assigned_at = new Date();
            selectedSeat.assigned_chats_count += 1;
            await selectedSeat.save();

            console.log(`[Assignment] Assigned chat ${jid} to seat ${selectedSeat.name}`);

            // TODO: Notify Seat via Socket (need socket implementation for seats)

        } catch (error) {
            console.error('[Assignment] Error:', error);
        }
    }
}

module.exports = new AssignmentService();
