const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

let supabase = null;

if (supabaseUrl && supabaseKey) {
    supabase = createClient(supabaseUrl, supabaseKey);
} else {
    console.warn('[Supabase] Credentials missing. Unified login text will fail if not configured.');
}

/**
 * Authenticates a user against Supabase Auth.
 * @param {string} email 
 * @param {string} password 
 * @returns {Promise<Object|null>} User user object if successful, null if failed
 */
const authenticateWithSupabase = async (email, password) => {
    if (!supabase) return null;

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            console.log(`[Supabase Auth] Login failed for ${email}: ${error.message}`);
            return null;
        }

        return data.user;
    } catch (err) {
        console.error('[Supabase Auth] Unexpected error:', err.message);
        return null;
    }
};

/**
 * Verifies a Supabase JWT.
 * @param {string} token 
 * @returns {Promise<Object|null>} Decoded user object if valid, null if invalid
 */
const verifySupabaseToken = async (token) => {
    if (!supabase) return null;

    try {
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            return null;
        }

        return user;
    } catch (err) {
        console.error('[Supabase Auth] Token verification failed:', err.message);
        return null;
    }
};

module.exports = {
    authenticateWithSupabase,
    verifySupabaseToken
};
