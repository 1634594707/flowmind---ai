# FlowMind Redis Guide

## Overview

FlowMind uses Redis for caching and pub/sub messaging to improve performance and enable real-time features.

## Redis Configuration

### Environment Variables

Add to `backend/.env`:

```env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
```

### Docker Setup

Redis is included in `docker-compose.yml`:

```yaml
redis:
  image: redis:7-alpine
  container_name: flowmind-redis
  restart: unless-stopped
  command: redis-server --appendonly yes
  ports:
    - '6379:6379'
  volumes:
    - redis_data:/data
```

## Using Redis Service

### Importing Redis Module

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { RedisModule } from './common/redis.module';

@Module({
  imports: [RedisModule],
  // ...
})
export class AppModule {}
```

### Injecting Redis Service

```typescript
import { Injectable } from '@nestjs/common';
import { RedisService } from '@/common/services/redis.service';

@Injectable()
export class MyService {
  constructor(private readonly redisService: RedisService) {}

  async example() {
    // Use Redis operations
  }
}
```

## Cache Operations

### Basic Cache Operations

```typescript
// Set value with TTL
await this.redisService.set('key', 'value', 3600); // 1 hour

// Get value
const value = await this.redisService.get('key');

// Delete value
await this.redisService.del('key');

// Check if key exists
const exists = await this.redisService.exists('key');

// Set expiration
await this.redisService.expire('key', 3600);

// Get TTL
const ttl = await this.redisService.ttl('key');
```

### Cache Patterns

#### User Session Cache

```typescript
import { CACHE_KEYS, CACHE_TTL } from '@/config/redis.config';

async cacheUserSession(userId: string, sessionData: any) {
  const key = CACHE_KEYS.USER_SESSION(userId);
  await this.redisService.set(
    key,
    JSON.stringify(sessionData),
    CACHE_TTL.USER_SESSION
  );
}

async getUserSession(userId: string) {
  const key = CACHE_KEYS.USER_SESSION(userId);
  const data = await this.redisService.get(key);
  return data ? JSON.parse(data) : null;
}
```

#### Project Members Cache

```typescript
async cacheProjectMembers(projectId: string, members: any[]) {
  const key = CACHE_KEYS.PROJECT_MEMBERS(projectId);
  await this.redisService.set(
    key,
    JSON.stringify(members),
    CACHE_TTL.PROJECT_MEMBERS
  );
}

async getProjectMembers(projectId: string) {
  const key = CACHE_KEYS.PROJECT_MEMBERS(projectId);
  const data = await this.redisService.get(key);
  return data ? JSON.parse(data) : null;
}

async invalidateProjectMembers(projectId: string) {
  const key = CACHE_KEYS.PROJECT_MEMBERS(projectId);
  await this.redisService.del(key);
}
```

## Hash Operations

Useful for storing objects with multiple fields:

```typescript
// Set hash field
await this.redisService.hSet('user:123', 'name', 'John Doe');
await this.redisService.hSet('user:123', 'email', 'john@example.com');

// Get hash field
const name = await this.redisService.hGet('user:123', 'name');

// Get all hash fields
const user = await this.redisService.hGetAll('user:123');
// { name: 'John Doe', email: 'john@example.com' }

// Delete hash field
await this.redisService.hDel('user:123', 'email');
```

## List Operations

Useful for queues and recent items:

```typescript
// Push to list (left/right)
await this.redisService.lPush('notifications', JSON.stringify(notification));
await this.redisService.rPush('queue', JSON.stringify(task));

// Get list range
const items = await this.redisService.lRange('notifications', 0, 9); // First 10

// Get list length
const length = await this.redisService.lLen('notifications');
```

## Set Operations

Useful for unique collections:

```typescript
// Add to set
await this.redisService.sAdd('online_users', userId);

// Get all members
const onlineUsers = await this.redisService.sMembers('online_users');

// Check membership
const isOnline = await this.redisService.sIsMember('online_users', userId);

// Remove from set
await this.redisService.sRem('online_users', userId);
```

## Pub/Sub Messaging

### Publishing Messages

```typescript
import { PUBSUB_CHANNELS } from '@/config/redis.config';

async publishChatMessage(channelId: string, message: any) {
  const channel = PUBSUB_CHANNELS.CHAT_MESSAGE(channelId);
  await this.redisService.publish(channel, JSON.stringify(message));
}

async publishAgentUpdate(agentId: string, update: any) {
  const channel = PUBSUB_CHANNELS.AGENT_UPDATE(agentId);
  await this.redisService.publish(channel, JSON.stringify(update));
}
```

### Subscribing to Messages

```typescript
async subscribeToChannel(channelId: string) {
  const channel = PUBSUB_CHANNELS.CHAT_MESSAGE(channelId);

  await this.redisService.subscribe(channel, (message) => {
    const data = JSON.parse(message);
    this.handleChatMessage(data);
  });
}

async unsubscribeFromChannel(channelId: string) {
  const channel = PUBSUB_CHANNELS.CHAT_MESSAGE(channelId);
  await this.redisService.unsubscribe(channel);
}
```

### Pattern Subscription

Subscribe to multiple channels with a pattern:

```typescript
// Subscribe to all chat channels
await this.redisService.pSubscribe('chat:*', (message, channel) => {
  console.log(`Message from ${channel}:`, message);
  this.handleMessage(channel, JSON.parse(message));
});

// Unsubscribe from pattern
await this.redisService.pUnsubscribe('chat:*');
```

## Rate Limiting

### Simple Rate Limiter

```typescript
async checkRateLimit(userId: string, limit: number = 100): Promise<boolean> {
  const key = CACHE_KEYS.RATE_LIMIT(userId);
  const count = await this.redisService.incr(key);

  if (count === 1) {
    // First request, set expiration
    await this.redisService.expire(key, CACHE_TTL.RATE_LIMIT);
  }

  return count <= limit;
}
```

### Advanced Rate Limiter with Sliding Window

```typescript
async checkSlidingWindowRateLimit(
  userId: string,
  limit: number = 100,
  windowSeconds: number = 60
): Promise<boolean> {
  const key = `ratelimit:${userId}`;
  const now = Date.now();
  const windowStart = now - windowSeconds * 1000;

  // Remove old entries
  await this.redisService.client.zRemRangeByScore(key, 0, windowStart);

  // Count requests in window
  const count = await this.redisService.client.zCard(key);

  if (count < limit) {
    // Add current request
    await this.redisService.client.zAdd(key, { score: now, value: `${now}` });
    await this.redisService.expire(key, windowSeconds);
    return true;
  }

  return false;
}
```

## Counter Operations

```typescript
// Increment counter
const views = await this.redisService.incr('page:views');

// Decrement counter
const stock = await this.redisService.decr('product:stock');

// Increment by amount
const score = await this.redisService.incrBy('user:score', 10);

// Decrement by amount
const balance = await this.redisService.decrBy('user:balance', 50);
```

## Cache Invalidation Strategies

### Time-based Expiration

```typescript
// Set with TTL
await this.redisService.set('key', 'value', 3600);
```

### Event-based Invalidation

```typescript
async updateUser(userId: string, data: any) {
  // Update database
  await this.userRepository.update(userId, data);

  // Invalidate cache
  await this.redisService.del(CACHE_KEYS.USER_SESSION(userId));
}
```

### Pattern-based Invalidation

```typescript
async invalidateProjectCache(projectId: string) {
  const pattern = `project:${projectId}:*`;
  const keys = await this.redisService.keys(pattern);

  for (const key of keys) {
    await this.redisService.del(key);
  }
}
```

## Best Practices

### 1. Use Consistent Key Naming

```typescript
// Good: Hierarchical naming
'user:123:profile';
'project:456:members';
'cache:task:789';

// Bad: Inconsistent naming
'user_123';
'proj456members';
'task789cache';
```

### 2. Set Appropriate TTLs

```typescript
// Short-lived data
await this.redisService.set('otp:123', code, 300); // 5 minutes

// Medium-lived data
await this.redisService.set('session:456', token, 3600); // 1 hour

// Long-lived data
await this.redisService.set('config:app', settings, 86400); // 24 hours
```

### 3. Handle Cache Misses

```typescript
async getUser(userId: string) {
  // Try cache first
  const cached = await this.redisService.get(`user:${userId}`);
  if (cached) {
    return JSON.parse(cached);
  }

  // Cache miss - fetch from database
  const user = await this.userRepository.findOne(userId);

  // Update cache
  if (user) {
    await this.redisService.set(
      `user:${userId}`,
      JSON.stringify(user),
      3600
    );
  }

  return user;
}
```

### 4. Use Transactions for Atomic Operations

```typescript
// Use Redis transactions for atomic operations
const multi = this.redisService.client.multi();
multi.incr('counter:a');
multi.decr('counter:b');
multi.set('flag', 'true');
await multi.exec();
```

### 5. Monitor Memory Usage

```typescript
// Get memory info
const info = await this.redisService.client.info('memory');
console.log(info);

// Set max memory policy
// In redis.conf or docker-compose:
// maxmemory 256mb
// maxmemory-policy allkeys-lru
```

## Monitoring and Debugging

### Redis CLI Commands

```bash
# Connect to Redis
docker-compose exec redis redis-cli

# Get all keys
KEYS *

# Get key value
GET key

# Get key type
TYPE key

# Get key TTL
TTL key

# Delete key
DEL key

# Flush all data (CAUTION!)
FLUSHALL

# Get info
INFO

# Monitor commands in real-time
MONITOR
```

### Performance Monitoring

```typescript
// Log slow operations
const start = Date.now();
await this.redisService.get('key');
const duration = Date.now() - start;

if (duration > 100) {
  console.warn(`Slow Redis operation: ${duration}ms`);
}
```

## Troubleshooting

### Connection Issues

```bash
# Check if Redis is running
docker-compose ps redis

# Check Redis logs
docker-compose logs redis

# Test connection
docker-compose exec redis redis-cli ping
# Should return: PONG
```

### Memory Issues

```bash
# Check memory usage
docker-compose exec redis redis-cli INFO memory

# Check key count
docker-compose exec redis redis-cli DBSIZE

# Find large keys
docker-compose exec redis redis-cli --bigkeys
```

### Performance Issues

```bash
# Check slow log
docker-compose exec redis redis-cli SLOWLOG GET 10

# Monitor commands
docker-compose exec redis redis-cli MONITOR
```

## Resources

- [Redis Documentation](https://redis.io/documentation)
- [Redis Commands](https://redis.io/commands)
- [Node Redis Client](https://github.com/redis/node-redis)
- [Cache-Manager](https://github.com/node-cache-manager/node-cache-manager)
