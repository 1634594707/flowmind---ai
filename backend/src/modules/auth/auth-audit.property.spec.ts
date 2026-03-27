/**
 * Property-Based Tests for Authentication Event Logging
 * Feature: flowmind-feature-enhancement
 *
 * **Property 58: Authentication Event Logging**
 * **Validates: Requirements 9.7**
 *
 * For any authentication or authorization attempt (success or failure),
 * an audit log entry should be created.
 */

import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import fc from 'fast-check';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtTokenService } from './jwt-token.service';
import { AuditLogService } from './audit-log.service';
import { AuditLog } from './entities/audit-log.entity';
import { UnauthorizedException } from '@nestjs/common';

describe('Authentication Event Logging (Property-Based Tests)', () => {
  let authService: AuthService;
  let mockUsersService: Partial<UsersService>;
  let mockJwtTokenService: Partial<JwtTokenService>;
  let mockAuditLogRepository: Partial<Repository<AuditLog>>;
  let auditLogs: AuditLog[];

  beforeEach(async () => {
    // Reset audit logs for each test
    auditLogs = [];

    // Mock audit log repository
    mockAuditLogRepository = {
      create: jest.fn((dto: any) => ({
        ...dto,
        id: `log-${Date.now()}`,
        createdAt: new Date(),
      })) as any,
      save: jest.fn((log: any) => {
        auditLogs.push(log as AuditLog);
        return Promise.resolve(log);
      }) as any,
      find: jest.fn(() => Promise.resolve(auditLogs)) as any,
      count: jest.fn(() => Promise.resolve(auditLogs.length)) as any,
    };

    // Mock users service
    mockUsersService = {
      create: jest.fn(),
      findByEmail: jest.fn(),
      validatePassword: jest.fn(),
    };

    // Mock JWT token service
    mockJwtTokenService = {
      generateTokenPair: jest.fn(() =>
        Promise.resolve({
          accessToken: 'access-token',
          refreshToken: 'refresh-token',
          expiresIn: 900,
        }),
      ) as any,
      revokeAllUserSessions: jest.fn(() => Promise.resolve()),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        AuditLogService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtTokenService, useValue: mockJwtTokenService },
        { provide: getRepositoryToken(AuditLog), useValue: mockAuditLogRepository },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Property 58: Authentication Event Logging', () => {
    it('should create audit log for successful registration', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            name: fc.string({ minLength: 1, maxLength: 50 }),
            email: fc.emailAddress(),
            password: fc.string({ minLength: 8, maxLength: 50 }),
          }),
          async (registerDto) => {
            // Reset audit logs
            auditLogs = [];

            const mockUser = {
              id: `user-${Date.now()}`,
              name: registerDto.name,
              email: registerDto.email,
              role: 'user',
              createdAt: new Date(),
              twoFactorEnabled: false,
            };

            (mockUsersService.create as jest.Mock).mockResolvedValue(mockUser);

            // Execute registration
            await authService.register(registerDto);

            // Verify audit log was created
            expect(auditLogs.length).toBe(1);
            expect(auditLogs[0].eventType).toBe('authentication');
            expect(auditLogs[0].action).toBe('register');
            expect(auditLogs[0].status).toBe('success');
            expect(auditLogs[0].email).toBe(registerDto.email);
            expect(auditLogs[0].userId).toBe(mockUser.id);
          },
        ),
        { numRuns: 50 },
      );
    });

    it('should create audit log for failed registration', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            name: fc.string({ minLength: 1, maxLength: 50 }),
            email: fc.emailAddress(),
            password: fc.string({ minLength: 8, maxLength: 50 }),
          }),
          async (registerDto) => {
            // Reset audit logs
            auditLogs = [];

            const error = new Error('Email already exists');
            (mockUsersService.create as jest.Mock).mockRejectedValue(error);

            // Execute registration (should fail)
            try {
              await authService.register(registerDto);
            } catch (e) {
              // Expected to fail
            }

            // Verify audit log was created for failure
            expect(auditLogs.length).toBe(1);
            expect(auditLogs[0].eventType).toBe('authentication');
            expect(auditLogs[0].action).toBe('register');
            expect(auditLogs[0].status).toBe('failure');
            expect(auditLogs[0].email).toBe(registerDto.email);
            expect(auditLogs[0].errorMessage).toBe(error.message);
          },
        ),
        { numRuns: 50 },
      );
    });

    it('should create audit log for successful login', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            email: fc.emailAddress(),
            password: fc.string({ minLength: 8, maxLength: 50 }),
          }),
          async (loginDto) => {
            // Reset audit logs
            auditLogs = [];

            const mockUser = {
              id: `user-${Date.now()}`,
              email: loginDto.email,
              passwordHash: 'hashed-password',
              name: 'Test User',
              role: 'user',
              createdAt: new Date(),
              twoFactorEnabled: false,
            };

            (mockUsersService.findByEmail as jest.Mock).mockResolvedValue(mockUser);
            (mockUsersService.validatePassword as jest.Mock).mockResolvedValue(true);

            // Execute login
            await authService.login(loginDto);

            // Verify audit log was created
            expect(auditLogs.length).toBe(1);
            expect(auditLogs[0].eventType).toBe('authentication');
            expect(auditLogs[0].action).toBe('login');
            expect(auditLogs[0].status).toBe('success');
            expect(auditLogs[0].email).toBe(loginDto.email);
            expect(auditLogs[0].userId).toBe(mockUser.id);
          },
        ),
        { numRuns: 50 },
      );
    });

    it('should create audit log for failed login - user not found', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            email: fc.emailAddress(),
            password: fc.string({ minLength: 8, maxLength: 50 }),
          }),
          async (loginDto) => {
            // Reset audit logs
            auditLogs = [];

            (mockUsersService.findByEmail as jest.Mock).mockResolvedValue(null);

            // Execute login (should fail)
            try {
              await authService.login(loginDto);
            } catch (e) {
              expect(e).toBeInstanceOf(UnauthorizedException);
            }

            // Verify audit log was created for failure
            expect(auditLogs.length).toBe(1);
            expect(auditLogs[0].eventType).toBe('authentication');
            expect(auditLogs[0].action).toBe('login');
            expect(auditLogs[0].status).toBe('failure');
            expect(auditLogs[0].email).toBe(loginDto.email);
            expect(auditLogs[0].userId).toBeUndefined();
            expect(auditLogs[0].errorMessage).toBe('账号不存在');
          },
        ),
        { numRuns: 50 },
      );
    });

    it('should create audit log for failed login - invalid password', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            email: fc.emailAddress(),
            password: fc.string({ minLength: 8, maxLength: 50 }),
          }),
          async (loginDto) => {
            // Reset audit logs
            auditLogs = [];

            const mockUser = {
              id: `user-${Date.now()}`,
              email: loginDto.email,
              passwordHash: 'hashed-password',
              name: 'Test User',
              role: 'user',
              createdAt: new Date(),
              twoFactorEnabled: false,
            };

            (mockUsersService.findByEmail as jest.Mock).mockResolvedValue(mockUser);
            (mockUsersService.validatePassword as jest.Mock).mockResolvedValue(false);

            // Execute login (should fail)
            try {
              await authService.login(loginDto);
            } catch (e) {
              expect(e).toBeInstanceOf(UnauthorizedException);
            }

            // Verify audit log was created for failure
            expect(auditLogs.length).toBe(1);
            expect(auditLogs[0].eventType).toBe('authentication');
            expect(auditLogs[0].action).toBe('login');
            expect(auditLogs[0].status).toBe('failure');
            expect(auditLogs[0].email).toBe(loginDto.email);
            expect(auditLogs[0].userId).toBe(mockUser.id);
            expect(auditLogs[0].errorMessage).toBe('密码错误');
          },
        ),
        { numRuns: 50 },
      );
    });

    it('should create audit log for successful logout', async () => {
      await fc.assert(
        fc.asyncProperty(fc.uuid(), async (userId) => {
          // Reset audit logs
          auditLogs = [];

          // Execute logout
          await authService.logout(userId);

          // Verify audit log was created
          expect(auditLogs.length).toBe(1);
          expect(auditLogs[0].eventType).toBe('authentication');
          expect(auditLogs[0].action).toBe('logout');
          expect(auditLogs[0].status).toBe('success');
          expect(auditLogs[0].userId).toBe(userId);
        }),
        { numRuns: 50 },
      );
    });

    it('should create audit log for successful token refresh', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            userId: fc.uuid(),
            email: fc.emailAddress(),
            role: fc.constantFrom('user', 'admin'),
          }),
          async ({ userId, email, role }) => {
            // Reset audit logs
            auditLogs = [];

            // Execute token refresh
            await authService.refreshTokens(userId, email, role);

            // Verify audit log was created
            expect(auditLogs.length).toBe(1);
            expect(auditLogs[0].eventType).toBe('authentication');
            expect(auditLogs[0].action).toBe('token_refresh');
            expect(auditLogs[0].status).toBe('success');
            expect(auditLogs[0].email).toBe(email);
            expect(auditLogs[0].userId).toBe(userId);
          },
        ),
        { numRuns: 50 },
      );
    });

    it('should create audit log for failed token refresh', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.record({
            userId: fc.uuid(),
            email: fc.emailAddress(),
            role: fc.constantFrom('user', 'admin'),
          }),
          async ({ userId, email, role }) => {
            // Reset audit logs
            auditLogs = [];

            const error = new Error('Token generation failed');
            (mockJwtTokenService.generateTokenPair as jest.Mock).mockRejectedValue(error);

            // Execute token refresh (should fail)
            try {
              await authService.refreshTokens(userId, email, role);
            } catch (e) {
              // Expected to fail
            }

            // Verify audit log was created for failure
            expect(auditLogs.length).toBe(1);
            expect(auditLogs[0].eventType).toBe('authentication');
            expect(auditLogs[0].action).toBe('token_refresh');
            expect(auditLogs[0].status).toBe('failure');
            expect(auditLogs[0].email).toBe(email);
            expect(auditLogs[0].userId).toBe(userId);
            expect(auditLogs[0].errorMessage).toBe(error.message);

            // Reset mock for next iteration
            (mockJwtTokenService.generateTokenPair as jest.Mock).mockResolvedValue({
              accessToken: 'access-token',
              refreshToken: 'refresh-token',
            });
          },
        ),
        { numRuns: 50 },
      );
    });

    it('should create audit logs for multiple authentication attempts', async () => {
      await fc.assert(
        fc.asyncProperty(
          fc.array(
            fc.record({
              email: fc.emailAddress(),
              password: fc.string({ minLength: 8, maxLength: 50 }),
            }),
            { minLength: 2, maxLength: 10 },
          ),
          async (loginAttempts) => {
            // Reset audit logs
            auditLogs = [];

            // Execute multiple login attempts
            for (const loginDto of loginAttempts) {
              const mockUser = {
                id: `user-${Date.now()}-${Math.random()}`,
                email: loginDto.email,
                passwordHash: 'hashed-password',
                name: 'Test User',
                role: 'user',
                createdAt: new Date(),
                twoFactorEnabled: false,
              };

              (mockUsersService.findByEmail as jest.Mock).mockResolvedValue(mockUser);
              (mockUsersService.validatePassword as jest.Mock).mockResolvedValue(true);

              await authService.login(loginDto);
            }

            // Verify audit logs were created for all attempts
            expect(auditLogs.length).toBe(loginAttempts.length);

            // Verify each log has correct properties
            auditLogs.forEach((log, index) => {
              expect(log.eventType).toBe('authentication');
              expect(log.action).toBe('login');
              expect(log.status).toBe('success');
              expect(log.email).toBe(loginAttempts[index].email);
            });
          },
        ),
        { numRuns: 30 },
      );
    });
  });
});
