
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/integrations/supabase/types';

// Client admin avec service role key
const supabaseAdmin = createClient<Database>(
  "https://uymqovqiuoneslmvtvti.supabase.co",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5bXFvdnFpdW9uZXNsbXZ0dnRpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MDk3NDU4MiwiZXhwIjoyMDY2NTUwNTgyfQ.5F5Z3-k_owksQL6j4pM3-IlYvAiXB1Aq0j-DKZEphFg",
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export const useAdminSupabase = () => {
  return supabaseAdmin;
};
