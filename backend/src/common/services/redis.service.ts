import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { createClient, RedisClientType } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client!: RedisClientType;
  private publisher!: RedisClientType;
  private subscriber!: RedisClientType;

  async onModuleInit() {
    // Main client for cache operations
    this.client = createClient({
      socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
      },
      password: process.env.REDIS_PASSWORD || undefined,
      database: parseInt(process.env.REDIS_DB || '0', 10),
    });

    // Publisher client for pub/sub
    this.publisher = this.client.duplicate();

    // Subscriber client for pub/sub
    this.subscriber = this.client.duplicate();

    await Promise.all([this.client.connect(), this.publisher.connect(), this.subscriber.connect()]);

    console.log('✅ Redis connected successfully');
  }

  async onModuleDestroy() {
    await Promise.all([this.client.quit(), this.publisher.quit(), this.subscriber.quit()]);
  }

  // Cache operations
  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: string, ttl?: number): Promise<void> {
    if (ttl) {
      await this.client.setEx(key, ttl, value);
    } else {
      await this.client.set(key, value);
    }
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.client.exists(key);
    return result === 1;
  }

  async expire(key: string, seconds: number): Promise<void> {
    await this.client.expire(key, seconds);
  }

  async ttl(key: string): Promise<number> {
    return this.client.ttl(key);
  }

  async keys(pattern: string): Promise<string[]> {
    return this.client.keys(pattern);
  }

  async flushDb(): Promise<void> {
    await this.client.flushDb();
  }

  // Hash operations
  async hGet(key: string, field: string): Promise<string | undefined> {
    return this.client.hGet(key, field);
  }

  async hSet(key: string, field: string, value: string): Promise<void> {
    await this.client.hSet(key, field, value);
  }

  async hGetAll(key: string): Promise<Record<string, string>> {
    return this.client.hGetAll(key);
  }

  async hDel(key: string, field: string): Promise<void> {
    await this.client.hDel(key, field);
  }

  // List operations
  async lPush(key: string, value: string): Promise<void> {
    await this.client.lPush(key, value);
  }

  async rPush(key: string, value: string): Promise<void> {
    await this.client.rPush(key, value);
  }

  async lRange(key: string, start: number, stop: number): Promise<string[]> {
    return this.client.lRange(key, start, stop);
  }

  async lLen(key: string): Promise<number> {
    return this.client.lLen(key);
  }

  // Set operations
  async sAdd(key: string, member: string): Promise<void> {
    await this.client.sAdd(key, member);
  }

  async sMembers(key: string): Promise<string[]> {
    return this.client.sMembers(key);
  }

  async sIsMember(key: string, member: string): Promise<boolean> {
    return this.client.sIsMember(key, member);
  }

  async sRem(key: string, member: string): Promise<void> {
    await this.client.sRem(key, member);
  }

  // Pub/Sub operations
  async publish(channel: string, message: string): Promise<void> {
    await this.publisher.publish(channel, message);
  }

  async subscribe(channel: string, callback: (message: string) => void): Promise<void> {
    await this.subscriber.subscribe(channel, callback);
  }

  async unsubscribe(channel: string): Promise<void> {
    await this.subscriber.unsubscribe(channel);
  }

  async pSubscribe(
    pattern: string,
    callback: (message: string, channel: string) => void,
  ): Promise<void> {
    await this.subscriber.pSubscribe(pattern, callback);
  }

  async pUnsubscribe(pattern: string): Promise<void> {
    await this.subscriber.pUnsubscribe(pattern);
  }

  // Increment/Decrement operations
  async incr(key: string): Promise<number> {
    return this.client.incr(key);
  }

  async decr(key: string): Promise<number> {
    return this.client.decr(key);
  }

  async incrBy(key: string, increment: number): Promise<number> {
    return this.client.incrBy(key, increment);
  }

  async decrBy(key: string, decrement: number): Promise<number> {
    return this.client.decrBy(key, decrement);
  }
}
