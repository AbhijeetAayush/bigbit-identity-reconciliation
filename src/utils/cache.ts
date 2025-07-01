import { getRedisClient } from '../services/redisClient';
import { logger } from './logger';
import { CacheError } from './error';
import { generateCacheKey } from './hash';

export async function getCache(key: string): Promise<string | null> {
    try {
        const redis = getRedisClient();
        const result = await redis.get(key);
        return result as string | null;
    } catch (error) {
        logger.error('Redis get error', { key, error });
        throw new CacheError('Failed to get cache');
    }
}

export async function setCache(key: string, value: string): Promise<void> {
    try {
        const redis = getRedisClient();
        await redis.set(key, value, { ex: 3600 }); // 1-hour TTL
        logger.info('Cache set', { key });
    } catch (error) {
        logger.error('Redis set error', { key, error });
        throw new CacheError('Failed to set cache');
    }
}

export async function deleteCache(key: string): Promise<void> {
    try {
        const redis = getRedisClient();
        await redis.del(key);
        logger.info('Cache deleted', { key });
    } catch (error) {
        logger.error('Redis delete error', { key, error });
        throw new CacheError('Failed to delete cache');
    }
}

export function getIdentifyCacheKey(email?: string, phoneNumber?: string): string {
    return `identify:${generateCacheKey(email, phoneNumber)}`;
}
