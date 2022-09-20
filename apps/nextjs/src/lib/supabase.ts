import { createClient } from '@supabase/supabase-js';

import { clientEnv } from '@/env/schema.mjs';

const supabaseUrl = clientEnv.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
