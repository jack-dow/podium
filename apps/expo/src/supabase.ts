import AsyncStorage from '@react-native-async-storage/async-storage';
import type { AuthSession, AuthUser } from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://alfcsgvnxdrantgovvll.supabase.co';
const supabaseAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlhdCI6MTYzNTU5OTgyNiwiZXhwIjoxOTUxMTc1ODI2fQ.4ZoeEvkhoFCv3CxxwoX8gwCocNUd3by-Yo9lICEh9As';

export type { AuthSession as Session, AuthUser as User };

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
