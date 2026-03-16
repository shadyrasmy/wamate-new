import { createClient } from '@supabase/supabase-js';
import { Database } from './types/supabase';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('⚠️ Supabase URL or Anon Key is missing from environment variables.');
}

// Global Supabase client for direct database interactions (e.g., EasyMate CRM)
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
