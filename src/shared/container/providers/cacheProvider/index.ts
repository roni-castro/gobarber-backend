import { container } from 'tsyringe';
import cacheConfig from '@config/redis';
import RedisCacheProvider from './implementations/redis-cache.provider';
import ICacheProvider from './models/i-cache-provider';

const providers = {
  redis: container.resolve(RedisCacheProvider),
};

container.registerInstance<ICacheProvider>(
  'CacheProvider',
  providers[cacheConfig.driver]
);
