import { Redis } from '@upstash/redis';
import { logger } from '../utils/logger';
import { CacheError } from '../utils/error';

let redis: Redis;

export function getRedisClient(): Redis {
    if (!redis) {
        const url = process.env.UPSTASH_REDIS_REST_URL;
        const token = process.env.UPSTASH_REDIS_REST_TOKEN;

        if (!url || !token) {
            logger.error('Upstash Redis credentials missing');
            throw new CacheError('Upstash Redis credentials not configured');
        }

        redis = new Redis({ url, token });
        logger.info('Upstash Redis client initialized');
    }
    return redis;
}
