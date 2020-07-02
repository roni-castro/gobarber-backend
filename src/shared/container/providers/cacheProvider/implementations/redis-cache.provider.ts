import Redis, { Redis as RedisClient } from 'ioredis';
import cacheConfig from '@config/redis';
import ICacheProvider from '../models/i-cache-provider';

export default class RedisCacheProvider implements ICacheProvider {
  private client: RedisClient;

  constructor() {
    this.client = new Redis(cacheConfig.config.redis);
  }

  public async save(key: string, value: any) {
    await this.client.set(key, JSON.stringify(value));
  }

  public async recover<T>(key: string): Promise<T | null> {
    const value = await this.client.get(key);
    return value ? (JSON.parse(value) as T) : null;
  }

  public async invalidate(key: string) {
    await this.client.del(key);
  }

  public async invalidatePrefix(prefix: string) {
    const keys = await this.client.keys(`${prefix}:*`);
    const promisses = keys.map(key => {
      return this.client.del(`${key}`);
    });
    await Promise.all(promisses);
  }
}
