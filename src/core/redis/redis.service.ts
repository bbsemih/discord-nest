import { Injectable, Inject } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import Redis from 'ioredis';
import { REDIS_CLIENT } from '../constants';

@Injectable()
export class RedisService {
  constructor(@Inject(REDIS_CLIENT) private readonly redisClient: Redis, @Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  async setCache(key: string, value: any, ttl: number) {
    await this.cacheManager.set(key, value, ttl);
  }

  async getCache<T>(key: string): Promise<T> {
    return await this.cacheManager.get(key);
  }

  async set(key: string, value: any, options?: { ttl: number }): Promise<void> {
    await this.redisClient.set(key, value, 'EX', options?.ttl);
  }

  async get<T>(key: string): Promise<T> {
    const value = await this.redisClient.get(key);
    return JSON.parse(value);
  }

  async del(key: string): Promise<void> {
    await this.redisClient.del(key);
  }

  async hset(key: string, field: string, value: any) {
    await this.redisClient.hset(key, field, value);
  }

  async hget(key: string, field: string) {}

  async hdel(key: string, field: string) {}

  async hgetall(key: string) {}

  async hkeys(key: string) {}

  async ttl(key: string): Promise<number> {
    return await this.redisClient.ttl(key);
  }

  async flushall() {
    await this.redisClient.flushall();
  }

  async flushdb() {
    await this.redisClient.flushdb();
  }
}
