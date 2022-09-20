import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabase';

export default async function authHandler(req: NextApiRequest, res: NextApiResponse) {
  await supabase.auth.api.setAuthCookie(req, res);
}
