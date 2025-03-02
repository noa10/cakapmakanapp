
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

const supabaseUrl = 'https://dxqunhauabqjcklhkrsu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4cXVuaGF1YWJxamNrbGhrcnN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA5MTc4NzksImV4cCI6MjA1NjQ5Mzg3OX0.MPCpFPBzRnyFGVsO6CqpeuV7JT6usSdEhy4kLa9Vt_Q';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Custom interface for our profiles table that includes the is_admin field
export interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}
