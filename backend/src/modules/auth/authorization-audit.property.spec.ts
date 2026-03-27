/**
 * Property-Based Tests for Authorization Audit Logging
 *
 * **Property 70: User Activity Tracking**
 * **Validates: Requirements 12.10**
 *
 * For any permission check invocation, an authorization audit log entry
 * should be created whether it succeeds or fails.
 */

import { ForbiddenException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import fc from 'fast-check';
import { AuditLog } from './entities/audit-log.entity';
import { AuditLogService } from './audit-log.service';
import { PermissionsGuard } from './guards/permissions.guard';
import { RbacService } from './rbac.service';

describe('Authorization Audit Logging (Property-Based Tests)', () => {
  it('Property 70: every permission check produces an audit log', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.boolean(),
        fc.uniqueArray(fc.string({ minLength: 1, maxLength: 40 }), { minLength: 1, maxLength: 6 }),
        fc.constantFrom<'all' | 'any'>('all', 'any'),
        async (allowed, requiredPermissions, mode) => {
          const logs: AuditLog[] = [];

          const auditRepo: Partial<Repository<AuditLog>> = {
            create: jest.fn((dto: any) => ({
              ...dto,
              id: `log-${Math.random()}`,
              createdAt: new Date(),
            })) as any,
            save: jest.fn(async (log: any) => {
              logs.push(log as AuditLog);
              return log;
            }) as any,
          };

          const reflector = new Reflector();
          jest.spyOn(reflector, 'getAllAndOverride').mockImplementation((key: any) => {
            if (key === 'permissions') return requiredPermissions as any;
            if (key === 'permission_mode') return mode as any;
            return undefined as any;
          });

          const rbacService: Partial<RbacService> = {
            hasPermissions: jest.fn(async () => allowed) as any,
          };

          const moduleRef = await Test.createTestingModule({
            providers: [
              PermissionsGuard,
              AuditLogService,
              { provide: Reflector, useValue: reflector },
              { provide: RbacService, useValue: rbacService },
              { provide: getRepositoryToken(AuditLog), useValue: auditRepo },
            ],
          }).compile();

          const guard = moduleRef.get(PermissionsGuard);

          const ctx: any = {
            getHandler: () => ({}),
            getClass: () => ({}),
            switchToHttp: () => ({
              getRequest: () => ({
                user: { userId: 'u1' },
                method: 'GET',
                originalUrl: '/x',
                ip: '127.0.0.1',
                headers: { 'user-agent': 'jest' },
              }),
            }),
          };

          if (allowed) {
            await expect(guard.canActivate(ctx)).resolves.toBe(true);
          } else {
            await expect(guard.canActivate(ctx)).rejects.toBeInstanceOf(ForbiddenException);
          }

          expect(logs).toHaveLength(1);
          expect(logs[0].eventType).toBe('authorization');
          expect(logs[0].action).toBe('permission_check');
          expect(logs[0].status).toBe(allowed ? 'success' : 'failure');
          expect(logs[0].userId).toBe('u1');
        },
      ),
      { numRuns: 100 },
    );
  });
});
