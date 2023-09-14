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
    try {
      await this.redisClient.hset(key, field, value);
    } catch (error) {
      throw new Error(`Failed to hset ${key}:${field}: ${error.message}`);
    }
  }

  async hget(key: string, field: string) {
    try {
      return await this.redisClient.hget(key, field);
    } catch (error) {
      throw new Error(`Failed to hget ${key}:${field}: ${error.message}`);
    }
  }

  async hdel(key: string, field: string) {
    try {
      return await this.redisClient.hdel(key, field);
    } catch (err) {
      throw new Error(`Failed to hdel ${key}:${field}: ${err.message}`);
    }
  }

  async hgetall(key: string) {
    try {
      return await this.redisClient.hgetall(key);
    } catch (error) {
      throw new Error(`Failed to hgetall ${key}: ${error.message}`);
    }
  }

  async hkeys(key: string) {
    try {
      return await this.redisClient.hkeys(key);
    } catch (error) {
      throw new Error(`Failed to hkeys ${key}: ${error.message}`);
    }
  }

  async hvals(key: string) {
    try {
      return await this.redisClient.hvals(key);
    } catch (err) {
      throw new Error(`Failed to hvals ${key}: ${err.message}`);
    }
  }

  async hincrby(key: string, field: string, increment: number) {
    return await this.redisClient.hincrby(key, field, increment);
  }

  async hincrbyfloat(key: string, field: string, increment: number) {
    return await this.redisClient.hincrbyfloat(key, field, increment);
  }

  async ttl(key: string): Promise<number> {
    return await this.redisClient.ttl(key);
  }

  async expire(key: string, ttl: number): Promise<void> {
    await this.redisClient.expire(key, ttl);
  }

  async incr(key: string): Promise<number> {
    return await this.redisClient.incr(key);
  }

  async decr(key: string): Promise<number> {
    return await this.redisClient.decr(key);
  }

  async incrby(key: string, increment: number): Promise<number> {
    return await this.redisClient.incrby(key, increment);
  }

  async decrby(key: string, decrement: number): Promise<number> {
    return await this.redisClient.decrby(key, decrement);
  }

  async flushall() {
    await this.redisClient.flushall();
  }

  async flushdb() {
    await this.redisClient.flushdb();
  }

  async publish(channel: string, message: string) {
    await this.redisClient.publish(channel, message);
  }

  async subscribe(channel: string) {
    await this.redisClient.subscribe(channel);
  }

  async geoadd(key: string, longitude: number, latitude: number, member: string) {
    await this.redisClient.geoadd(key, longitude, latitude, member);
  }

  async geosearch(key: string, longitude: number, latitude: number, radius: number, unit: string) {
    await this.redisClient.geosearch(key, longitude, latitude, radius, unit);
  }

  async georadius(key: string, longitude: number, latitude: number, radius: number, unit: string) {
    await this.redisClient.georadius(key, longitude, latitude, radius, unit);
  }
}
