import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

// Server-side environment variables
// Note: Backend prefers SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY, but can fallback to VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY for local development.
const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const isSupabaseConfigured = () => {
  if (!supabaseUrl || !supabaseKey) return false;
  if (supabaseUrl.includes('your-project') || supabaseKey.includes('PASTE_YOUR')) return false;
  return true;
};

let supabaseClient = null;

if (isSupabaseConfigured()) {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
    console.log('✓ Server-side Supabase client initialized successfully.');
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error.message);
  }
} else {
  console.info('ℹ Supabase credentials incomplete or using placeholders. Server running in demo fallback mode.');
}

export const supabase = supabaseClient;
