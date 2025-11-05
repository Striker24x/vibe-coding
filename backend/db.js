import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function connectDB() {
  try {
    const { error } = await supabase.from('clients').select('count', { count: 'exact', head: true });
    if (error && error.code !== 'PGRST116') {
      throw error;
    }
    console.log('✅ Connected to Supabase');
  } catch (error) {
    console.error('❌ Supabase connection error:', error);
    throw error;
  }
}

export function getDB() {
  return supabase;
}
