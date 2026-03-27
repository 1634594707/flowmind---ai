import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { DEFAULT_ROLE_PERMISSIONS } from './rbac.constants';

@Injectable()
export class RbacService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async getUserPermissionCodes(userId: string): Promise<string[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles', 'roles.permissions'],
    });
    if (!user) {
      return [];
    }

    const roleCodes = new Set<string>();
    if (user.role) {
      roleCodes.add(user.role);
    }
    for (const role of user.roles || []) {
      roleCodes.add(role.code);
    }

    if (roleCodes.has('admin')) {
      return ['*'];
    }

    const permissions = new Set<string>();

    for (const roleCode of roleCodes) {
      for (const permission of DEFAULT_ROLE_PERMISSIONS[roleCode] || []) {
        permissions.add(permission);
      }
    }

    for (const role of user.roles || []) {
      for (const permission of role.permissions || []) {
        permissions.add(permission.code);
      }
    }

    return [...permissions];
  }

  async hasPermissions(
    userId: string,
    requiredPermissions: string[],
    mode: 'all' | 'any' = 'all',
  ): Promise<boolean> {
    if (requiredPermissions.length === 0) {
      return true;
    }

    const userPermissions = await this.getUserPermissionCodes(userId);
    if (userPermissions.includes('*')) {
      return true;
    }

    if (mode === 'any') {
      return requiredPermissions.some((code) => userPermissions.includes(code));
    }

    return requiredPermissions.every((code) => userPermissions.includes(code));
  }
}
