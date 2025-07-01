import { getCache, setCache } from '../utils/cache';
import { getConsolidatedContact } from '../services/contactService';
import { logger } from '../utils/logger';
import { IdentifyResponse } from '../types/model';

export async function reconcileContacts(email?: string, phoneNumber?: string): Promise<IdentifyResponse> {
    const cacheKey = `identify:${email || 'null'}:${phoneNumber || 'null'}`;
    logger.info('Checking cache', { cacheKey });

    const cached = await getCache(cacheKey);
    if (cached) {
        logger.info('Cache hit', { cacheKey });
        return JSON.parse(cached);
    }

    logger.info('Cache miss, querying database', { cacheKey });
    const response = await getConsolidatedContact(email, phoneNumber);

    await setCache(cacheKey, JSON.stringify(response));
    return response;
}
