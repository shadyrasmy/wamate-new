const Bottleneck = require('bottleneck');

// Store limiters per instance
const instanceLimiters = new Map();

class QueueService {
    /**
     * Get or create a limiter for a specific WhatsApp instance
     * @param {string} instanceId 
     * @returns {Bottleneck}
     */
    getLimiter(instanceId) {
        if (!instanceLimiters.has(instanceId)) {
            // Create new limiter: 1 message every 2 seconds (safe default)
            // This prevents "spam" detection by WhatsApp
            const limiter = new Bottleneck({
                minTime: 2000,
                maxConcurrent: 1
            });

            limiter.on('failed', async (error, jobInfo) => {
                console.warn(`[Queue] Job ${jobInfo.options.id} failed: ${error}`);
                if (jobInfo.retryCount < 2) { // Retry twice
                    return 1000; // Wait 1s before retry
                }
            });

            instanceLimiters.set(instanceId, limiter);
        }
        return instanceLimiters.get(instanceId);
    }

    /**
     * Add a message to the instance queue
     * @param {string} instanceId 
     * @param {Function} sendFunction - Async function that sends the message
     * @returns {Promise<any>}
     */
    async add(instanceId, sendFunction) {
        const limiter = this.getLimiter(instanceId);
        return limiter.schedule(sendFunction);
    }

    /**
     * Update rate limits purely for an instance (e.g. if user is trusted)
     */
    updateLimits(instanceId, minTime) {
        const limiter = this.getLimiter(instanceId);
        limiter.updateSettings({ minTime });
    }
}

module.exports = new QueueService();
