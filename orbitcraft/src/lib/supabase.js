import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hwirzjytkpjgeogsztfy.supabase.co'; // Ada di bagian Project URL
const supabaseAnonKey = 'sb_publishable_4K5AOoD98nx3Qk7hiREnBg_IAfTa3ky'; // Tempel hasil copy tadi di sini

export const supabase = createClient(supabaseUrl, supabaseAnonKey);