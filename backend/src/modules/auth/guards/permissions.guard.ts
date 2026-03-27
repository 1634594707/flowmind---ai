import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY, PERMISSION_MODE_KEY } from '../decorators/permissions.decorator';
import { RbacService } from '../rbac.service';
import { AuditLogService } from '../audit-log.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly rbacService: RbacService,
    private readonly auditLogService: AuditLogService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions =
      this.reflector.getAllAndOverride<string[]>(PERMISSIONS_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) || [];

    if (requiredPermissions.length === 0) {
      return true;
    }

    const mode =
      this.reflector.getAllAndOverride<'all' | 'any'>(PERMISSION_MODE_KEY, [
        context.getHandler(),
        context.getClass(),
      ]) || 'all';

    const request = context.switchToHttp().getRequest<{
      user?: { userId?: string };
      ip?: string;
      headers?: Record<string, string | string[] | undefined>;
      method?: string;
      originalUrl?: string;
    }>();
    const userId = request.user?.userId;
    if (!userId) {
      throw new ForbiddenException('缺少用户上下文');
    }

    const allowed = await this.rbacService.hasPermissions(userId, requiredPermissions, mode);
    await this.auditLogService.logAuthorization(
      'permission_check',
      allowed ? 'success' : 'failure',
      userId,
      allowed ? undefined : '权限不足',
      {
        requiredPermissions,
        mode,
        method: request.method,
        path: request.originalUrl,
        ip: request.ip,
        userAgent:
          typeof request.headers?.['user-agent'] === 'string'
            ? request.headers['user-agent']
            : undefined,
      },
    );
    if (!allowed) {
      throw new ForbiddenException('权限不足');
    }

    return true;
  }
}
