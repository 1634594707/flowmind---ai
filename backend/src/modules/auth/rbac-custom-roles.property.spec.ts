/**
 * Property-Based Test for Custom Role Permission Application
 *
 * **Property 59: Custom Role Permission Application**
 * **Validates: Requirements 9.8**
 *
 * For any set of permissions assigned to a custom role:
 * when the role is assigned to a user, the user's effective permission codes
 * must include all permissions from that custom role.
 */

import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import fc from 'fast-check';
import { Repository } from 'typeorm';
import { RbacService } from './rbac.service';
import { User } from '../users/entities/user.entity';

describe('Custom Role Permissions (Property-Based Tests)', () => {
  it('Property 59: custom role permissions are applied to user', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.uniqueArray(fc.string({ minLength: 1, maxLength: 40 }), { minLength: 1, maxLength: 15 }),
        async (customPermissionCodes) => {
          const mockUserRepository: Partial<Repository<User>> = {
            findOne: jest.fn(async () => {
              return {
                id: 'u1',
                email: 'u1@example.com',
                name: 'u1',
                passwordHash: 'x',
                role: 'user',
                twoFactorEnabled: false,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date(),
                roles: [
                  {
                    id: 'r1',
                    code: 'custom_role',
                    name: 'Custom Role',
                    system: false,
                    createdAt: new Date(),
                    permissions: customPermissionCodes.map((code) => ({
                      id: `p-${code}`,
                      code,
                      name: code,
                      createdAt: new Date(),
                      roles: [] as any,
                    })) as any,
                    users: [] as any,
                  } as any,
                ],
              } as any;
            }) as any,
          };

          const moduleRef = await Test.createTestingModule({
            providers: [
              RbacService,
              { provide: getRepositoryToken(User), useValue: mockUserRepository },
            ],
          }).compile();

          const service = moduleRef.get(RbacService);

          const codes = await service.getUserPermissionCodes('u1');
          for (const p of customPermissionCodes) {
            expect(codes).toContain(p);
          }
        },
      ),
      { numRuns: 100 },
    );
  });
});
