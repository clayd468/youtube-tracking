import IORedis, { Redis, RedisOptions } from 'ioredis';
import { logger } from './logger';

class RedisInstance {
  client: any;
  constructor() {}

  getRedisInstance(options: Partial<RedisOptions> = {}): Redis {
    if (this.client) {
      return this.client;
    }

    const isTestEnvironment = process.env.NODE_ENV === 'test';
    const defaultOptions: Partial<RedisOptions> = {
      host: process.env.REDIS_HOST || '127.0.0.1',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
      connectTimeout: 17000,
      maxRetriesPerRequest: 4,
      lazyConnect: false,
      retryStrategy: (times: number) => Math.min(times * 30, 1000),
      reconnectOnError: (error: Error) => {
        if (isTestEnvironment) {
          return false;
        }

        logger.error(`Redis reconnectOnError: ${error.message}`);
        const targetErrors = [/READONLY/, /ETIMEDOUT/];
        return !targetErrors.find((targetError) => targetError.test(error.message));
      },
    };
    this.client = new IORedis({ ...defaultOptions, ...options });

    // Silence ETIMEDOUT errors
    this.client.on('error', () => {});

    return this.client;
  }

  async getMemoData(memoKey: string) {
    const redisClient = this.getRedisInstance();
    return redisClient.get(memoKey);
  }

  async memoData(memoKey: string, data: any, time: number = 60) {
    const redisClient = this.getRedisInstance();
    await redisClient.set(memoKey, JSON.stringify(data), 'EX', time);
  }

  async isExistMemoData(memoKey: string) {
    const redisClient = this.getRedisInstance();
    return redisClient.exists(memoKey);
  }

  async getMediaMemoKey(userId: number | string, key: string | number): Promise<string> {
    return `memoMedia:${userId}_${key}`;
  }
}

const redisInstance = new RedisInstance();

export { redisInstance };
