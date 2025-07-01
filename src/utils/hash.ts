import { createHash } from 'crypto';

export function generateCacheKey(email?: string, phoneNumber?: string): string {
  const normalized = `${email?.toLowerCase() || 'null'}:${phoneNumber || 'null'}`;
  return createHash('sha256').update(normalized).digest('hex');
}