import { Test } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtTokenService } from './jwt-token.service';
import { AuditLogService } from './audit-log.service';

describe('AuthService', () => {
  let service: AuthService;

  const usersService = {
    create: jest.fn(),
    findByEmail: jest.fn(),
    validatePassword: jest.fn(),
    findOne: jest.fn(),
    changePassword: jest.fn(),
  };

  const jwtTokenService = {
    generateTokenPair: jest.fn(() =>
      Promise.resolve({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      }),
    ),
    revokeAllUserSessions: jest.fn(),
  };
  const auditLogService = {
    logAuthentication: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtTokenService, useValue: jwtTokenService },
        { provide: AuditLogService, useValue: auditLogService },
      ],
    }).compile();

    service = moduleRef.get(AuthService);

    jest.clearAllMocks();
  });

  it('login() should throw if user not found', async () => {
    usersService.findByEmail.mockResolvedValueOnce(null);
    await expect(service.login({ email: 'a@b.com', password: 'p' } as any)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('login() should throw if password invalid', async () => {
    usersService.findByEmail.mockResolvedValueOnce({ id: 'u1', passwordHash: 'hashed' });
    usersService.validatePassword.mockResolvedValueOnce(false);

    await expect(service.login({ email: 'a@b.com', password: 'p' } as any)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('register() should return tokens and user', async () => {
    usersService.create.mockResolvedValueOnce({
      id: 'u1',
      name: 'n',
      email: 'a@b.com',
      avatar: '',
      role: 'user',
      createdAt: new Date(),
      twoFactorEnabled: false,
    });

    const result = await service.register({ email: 'a@b.com', password: 'p', name: 'n' } as any);
    expect(result.accessToken).toBe('access-token');
    expect(result.refreshToken).toBe('refresh-token');
    expect(jwtTokenService.generateTokenPair).toHaveBeenCalled();
    expect(result.user.email).toBe('a@b.com');
  });

  it('login() should return tokens and user on success', async () => {
    usersService.findByEmail.mockResolvedValueOnce({
      id: 'u1',
      name: 'n',
      email: 'a@b.com',
      avatar: '',
      role: 'user',
      passwordHash: 'hashed',
      createdAt: new Date(),
      twoFactorEnabled: false,
    });
    usersService.validatePassword.mockResolvedValueOnce(true);

    const result = await service.login({ email: 'a@b.com', password: 'p' } as any);
    expect(result.accessToken).toBe('access-token');
    expect(result.refreshToken).toBe('refresh-token');
    expect(result.user.email).toBe('a@b.com');
  });

  it('login() should require 2FA code when enabled', async () => {
    usersService.findByEmail.mockResolvedValueOnce({
      id: 'u1',
      name: 'n',
      email: 'a@b.com',
      avatar: '',
      role: 'user',
      passwordHash: 'hashed',
      createdAt: new Date(),
      twoFactorEnabled: true,
      totpSecret: 'secret',
    });
    usersService.validatePassword.mockResolvedValueOnce(true);

    await expect(service.login({ email: 'a@b.com', password: 'p' } as any)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('refreshTokens() should generate new token pair', async () => {
    const result = await service.refreshTokens('u1', 'a@b.com', 'user');
    expect(result.accessToken).toBe('access-token');
    expect(result.refreshToken).toBe('refresh-token');
    expect(jwtTokenService.generateTokenPair).toHaveBeenCalledWith({
      id: 'u1',
      email: 'a@b.com',
      role: 'user',
    });
  });

  it('logout() should revoke all user tokens', async () => {
    await service.logout('u1');
    expect(jwtTokenService.revokeAllUserSessions).toHaveBeenCalledWith('u1');
  });
});
