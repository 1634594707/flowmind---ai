import { Injectable } from '@nestjs/common';
import { RedisService } from '../../common/services/redis.service';

@Injectable()
export class AccountLockoutService {
  private readonly MAX_ATTEMPTS = 5;
  private readonly LOCKOUT_DURATION = 15 * 60; // 15 minutes in seconds
  private readonly ATTEMPT_WINDOW = 15 * 60; // 15 minutes in seconds

  constructor(private readonly redisService: RedisService) {}

  /**
   * Get lockout key for user
   */
  private getLockoutKey(identifier: string): string {
    return `lockout:${identifier}`;
  }

  /**
   * Get attempts key for user
   */
  private getAttemptsKey(identifier: string): string {
    return `attempts:${identifier}`;
  }

  /**
   * Check if account is locked
   */
  async isLocked(identifier: string): Promise<boolean> {
    const key = this.getLockoutKey(identifier);
    return this.redisService.exists(key);
  }

  /**
   * Get remaining lockout time in seconds
   */
  async getRemainingLockoutTime(identifier: string): Promise<number> {
    const key = this.getLockoutKey(identifier);
    const ttl = await this.redisService.ttl(key);
    return ttl > 0 ? ttl : 0;
  }

  /**
   * Record failed login attempt
   * Returns true if account should be locked
   */
  async recordFailedAttempt(identifier: string): Promise<boolean> {
    const attemptsKey = this.getAttemptsKey(identifier);

    // Increment attempt counter
    const attempts = await this.redisService.incr(attemptsKey);

    // Set expiration on first attempt
    if (attempts === 1) {
      await this.redisService.expire(attemptsKey, this.ATTEMPT_WINDOW);
    }

    // Lock account if max attempts reached
    if (attempts >= this.MAX_ATTEMPTS) {
      await this.lockAccount(identifier);
      return true;
    }

    return false;
  }

  /**
   * Lock account
   */
  async lockAccount(identifier: string): Promise<void> {
    const lockoutKey = this.getLockoutKey(identifier);
    await this.redisService.set(lockoutKey, new Date().toISOString(), this.LOCKOUT_DURATION);
  }

  /**
   * Reset failed attempts after successful login
   */
  async resetAttempts(identifier: string): Promise<void> {
    const attemptsKey = this.getAttemptsKey(identifier);
    await this.redisService.del(attemptsKey);
  }

  /**
   * Unlock account (admin action)
   */
  async unlockAccount(identifier: string): Promise<void> {
    const lockoutKey = this.getLockoutKey(identifier);
    const attemptsKey = this.getAttemptsKey(identifier);

    await Promise.all([this.redisService.del(lockoutKey), this.redisService.del(attemptsKey)]);
  }

  /**
   * Get current attempt count
   */
  async getAttemptCount(identifier: string): Promise<number> {
    const attemptsKey = this.getAttemptsKey(identifier);
    const count = await this.redisService.get(attemptsKey);
    return count ? parseInt(count, 10) : 0;
  }

  /**
   * Get remaining attempts before lockout
   */
  async getRemainingAttempts(identifier: string): Promise<number> {
    const currentAttempts = await this.getAttemptCount(identifier);
    return Math.max(0, this.MAX_ATTEMPTS - currentAttempts);
  }
}
