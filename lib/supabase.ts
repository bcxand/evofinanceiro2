import { createClient } from '@supabase/supabase-js';

// Keys provided by the user for the live application
const supabaseUrl = 'https://lrsbbnjgvsfheuluyjnc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxyc2JibmpndnNmaGV1bHV5am5jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAxNTk0NjAsImV4cCI6MjA4NTczNTQ2MH0.YWldvBsy3-XDJ4hsJrq-WApnCOhUcyZiwBxCvzpI0_4';

export const supabase = createClient(supabaseUrl, supabaseKey);

export const isSupabaseConfigured = true;