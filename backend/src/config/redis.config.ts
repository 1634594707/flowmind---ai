import { CacheModuleOptions } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';

export const redisConfig: CacheModuleOptions = {
  // @ts-expect-error - cache-manager-redis-store types issue
  store: redisStore,
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379', 10),
  password: process.env.REDIS_PASSWORD || undefined,
  db: parseInt(process.env.REDIS_DB || '0', 10),
  ttl: 600, // Default TTL: 10 minutes
  max: 100, // Maximum number of items in cache
};

export const CACHE_KEYS = {
  USER_SESSION: (userId: string) => `session:${userId}`,
  PROJECT_MEMBERS: (projectId: string) => `project:${projectId}:members`,
  AGENT_STATUS: (agentId: string) => `agent:${agentId}:status`,
  TASK_CACHE: (taskId: string) => `task:${taskId}`,
  DOCUMENT_CACHE: (docId: string) => `doc:${docId}`,
  RATE_LIMIT: (userId: string) => `ratelimit:${userId}`,
};

export const CACHE_TTL = {
  USER_SESSION: 86400, // 24 hours
  PROJECT_MEMBERS: 3600, // 1 hour
  AGENT_STATUS: 300, // 5 minutes
  TASK_CACHE: 600, // 10 minutes
  DOCUMENT_CACHE: 1800, // 30 minutes
  RATE_LIMIT: 60, // 1 minute
};

export const PUBSUB_CHANNELS = {
  CHAT_MESSAGE: (channelId: string) => `chat:${channelId}`,
  AGENT_UPDATE: (agentId: string) => `agent:${agentId}`,
  TASK_UPDATE: (projectId: string) => `task:${projectId}`,
  WORKFLOW_EVENT: (executionId: string) => `workflow:${executionId}`,
  NOTIFICATION: (userId: string) => `notify:${userId}`,
};
