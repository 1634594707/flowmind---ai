/**
 * Property-Based Tests for API Key Authentication
 *
 * **Property 61: API Key Authentication**
 * **Validates: Requirements 9.10**
 *
 * For any generated API key:
 * - validateApiKey should accept it and resolve to the correct userId.
 * - A modified key should be rejected.
 */

import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import fc from 'fast-check';
import { Repository } from 'typeorm';
import { ApiKeyService } from './api-key.service';
import { ApiKey } from './entities/api-key.entity';

describe('API Key Auth (Property-Based Tests)', () => {
  it('Property 61: generated API key validates, mutated key rejects', async () => {
    await fc.assert(
      fc.asyncProperty(
        fc.uuid(),
        fc.string({ minLength: 1, maxLength: 40 }),
        async (userId, name) => {
          const store: ApiKey[] = [];

          const repo: Partial<Repository<ApiKey>> = {
            create: jest.fn((dto: any) => dto) as any,
            save: jest.fn(async (dto: any) => {
              const entity: ApiKey = {
                id: `k-${store.length + 1}`,
                userId: dto.userId,
                user: null as any,
                name: dto.name,
                key: dto.key,
                createdAt: new Date(),
                expiresAt: dto.expiresAt,
                lastUsedAt: null as any,
              };
              store.push(entity);
              return entity;
            }) as any,
            findOne: jest.fn(async ({ where }: any) => {
              return store.find((k) => k.key === where.key) || null;
            }) as any,
            update: jest.fn(async () => ({})) as any,
            find: jest.fn(async ({ where }: any) =>
              store.filter((k) => k.userId === where.userId),
            ) as any,
            delete: jest.fn(async () => ({})) as any,
          };

          const moduleRef = await Test.createTestingModule({
            providers: [ApiKeyService, { provide: getRepositoryToken(ApiKey), useValue: repo }],
          }).compile();

          const service = moduleRef.get(ApiKeyService);
          const created = await service.createApiKey(userId, name);

          const ok = await service.validateApiKey(created.apiKey);
          expect(ok?.userId).toBe(userId);

          const mutated = created.apiKey.slice(0, -1) + (created.apiKey.endsWith('a') ? 'b' : 'a');
          const bad = await service.validateApiKey(mutated);
          expect(bad).toBeNull();
        },
      ),
      { numRuns: 100 },
    );
  });
});
