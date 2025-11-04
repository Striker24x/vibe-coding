import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://yrhtrwjbtrwrhzamdbay.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlyaHRyd2pidHJ3cmh6YW1kYmF5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3NjI1MTIsImV4cCI6MjA3NzMzODUxMn0.dDwCbWCMmyNzADeCot_lXzW6xzOeZA7mZFGJQdFahFo';

export const webhookSupabase = createClient(supabaseUrl, supabaseAnonKey);
