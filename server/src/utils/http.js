/**
 * Robust HTTP utility for making fetch requests with retries and timeout handling.
 * This helps prevent UND_ERR_SOCKET errors and unhandled fetch terminations.
 */

async function fetchWithRetry(url, options = {}, maxRetries = 3) {
    const { timeout = 10000, ...fetchOptions } = options;

    let lastError;
    for (let i = 0; i < maxRetries; i++) {
        const controller = new AbortController();
        const id = setTimeout(() => controller.abort(), timeout);

        try {
            const response = await fetch(url, {
                ...fetchOptions,
                signal: controller.signal
            });
            clearTimeout(id);
            return response;
        } catch (err) {
            clearTimeout(id);
            lastError = err;

            // Log the error with attempt count
            console.warn(`[HTTP] Fetch attempt ${i + 1} failed for ${url}:`, err.message);

            // Don't retry if it's a client error (4xx) usually, 
            // but since fetch doesn't throw on 4xx, we only catch network errors here.

            // Wait before retrying (exponential backoff)
            if (i < maxRetries - 1) {
                const delay = Math.pow(2, i) * 1000;
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }

    throw lastError;
}

module.exports = { fetchWithRetry };
