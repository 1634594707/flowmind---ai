import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';

export interface CreateAuditLogDto {
  userId?: string;
  email?: string;
  eventType: 'authentication' | 'authorization';
  action: string;
  status: 'success' | 'failure';
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
  errorMessage?: string;
}

@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  /**
   * Create an audit log entry
   */
  async createLog(dto: CreateAuditLogDto): Promise<AuditLog> {
    const log = this.auditLogRepository.create(dto);
    return this.auditLogRepository.save(log);
  }

  /**
   * Log authentication attempt
   */
  async logAuthentication(
    action: string,
    status: 'success' | 'failure',
    email?: string,
    userId?: string,
    errorMessage?: string,
    metadata?: Record<string, any>,
  ): Promise<AuditLog> {
    return this.createLog({
      userId,
      email,
      eventType: 'authentication',
      action,
      status,
      errorMessage,
      metadata,
    });
  }

  /**
   * Log authorization attempt
   */
  async logAuthorization(
    action: string,
    status: 'success' | 'failure',
    userId: string,
    errorMessage?: string,
    metadata?: Record<string, any>,
  ): Promise<AuditLog> {
    return this.createLog({
      userId,
      eventType: 'authorization',
      action,
      status,
      errorMessage,
      metadata,
    });
  }

  /**
   * Get audit logs for a user
   */
  async getUserLogs(userId: string, limit = 100): Promise<AuditLog[]> {
    return this.auditLogRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  /**
   * Get all audit logs with pagination
   */
  async getAllLogs(
    page = 1,
    limit = 100,
    eventType?: 'authentication' | 'authorization',
  ): Promise<{ logs: AuditLog[]; total: number }> {
    const query = this.auditLogRepository.createQueryBuilder('audit_log');

    if (eventType) {
      query.where('audit_log.event_type = :eventType', { eventType });
    }

    const [logs, total] = await query
      .orderBy('audit_log.created_at', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    return { logs, total };
  }

  /**
   * Get logs by action
   */
  async getLogsByAction(action: string, limit = 100): Promise<AuditLog[]> {
    return this.auditLogRepository.find({
      where: { action },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  /**
   * Count failed authentication attempts for an email
   */
  async countFailedAttempts(email: string, since: Date): Promise<number> {
    return this.auditLogRepository.count({
      where: {
        email,
        eventType: 'authentication',
        status: 'failure',
        createdAt: since as any,
      },
    });
  }
}
