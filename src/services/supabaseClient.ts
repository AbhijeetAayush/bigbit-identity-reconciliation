import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { logger } from '../utils/logger';
import { DatabaseError } from '../utils/error';

let client: SupabaseClient;

export function getSupabaseClient(): SupabaseClient {
  if (!client) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_KEY;

    if (!url || !key) {
      logger.error('Supabase credentials missing');
      throw new DatabaseError('Supabase credentials not configured');
    }

    client = createClient(url, key, {
      auth: { autoRefreshToken: true, persistSession: false },
    });
    logger.info('Supabase client initialized');
  }
  return client;
}