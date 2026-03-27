/**
 * Property-Based Tests for Role-Based Access Control
 *
 * **Property 56: Role-Based Access Control**
 * **Validates: Requirements 9.1, 9.2**
 *
 * For any user permission set and required permission set:
 * - If user has '*' permission, access should always be granted.
 * - In 'all' mode, access granted iff user has all required permissions.
 * - In 'any' mode, access granted iff user has at least one required permission.
 */

import fc from 'fast-check';
import { RbacService } from './rbac.service';

describe('RBAC (Property-Based Tests)', () => {
  // We only test the logical contract of hasPermissions by stubbing getUserPermissionCodes.
  it('Property 56: RBAC decision logic is consistent', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.uniqueArray(fc.string({ minLength: 1, maxLength: 30 }), { minLength: 0, maxLength: 20 }),
        fc.uniqueArray(fc.string({ minLength: 1, maxLength: 30 }), { minLength: 0, maxLength: 10 }),
        fc.boolean(),
        async (userPerms, requiredPerms, isAllMode) => {
          const service = new RbacService({} as any);
          const mode = isAllMode ? ('all' as const) : ('any' as const);

          const hasStar = userPerms.includes('*');
          const effectiveUserPerms = hasStar ? ['*'] : userPerms;
          (service as any).getUserPermissionCodes = jest.fn(async () => effectiveUserPerms);

          const expected = hasStar
            ? true
            : requiredPerms.length === 0
              ? true
              : mode === 'all'
                ? requiredPerms.every((p) => userPerms.includes(p))
                : requiredPerms.some((p) => userPerms.includes(p));

          const allowed = await service.hasPermissions('u1', requiredPerms, mode);
          expect(allowed).toBe(expected);
        },
      ),
      { numRuns: 100 },
    );
  });
});
