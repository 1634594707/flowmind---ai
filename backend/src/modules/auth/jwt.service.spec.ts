import { Test } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UnauthorizedException } from '@nestjs/common';
import { JwtTokenService } from './jwt-token.service';
import { Session } from './entities/session.entity';
import { User } from '../users/entities/user.entity';

describe('JwtTokenService', () => {
  let service: JwtTokenService;

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key: string, defaultValue?: string) => {
      const config: Record<string, string> = {
        JWT_SECRET: 'test-secret',
        JWT_EXPIRES_IN: '15m',
        JWT_REFRESH_SECRET: 'test-refresh-secret',
        JWT_REFRESH_EXPIRES_IN: '7d',
      };
      return config[key] || defaultValue;
    }),
  };

  const mockSessionRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        JwtTokenService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: getRepositoryToken(Session), useValue: mockSessionRepository },
      ],
    }).compile();

    service = moduleRef.get(JwtTokenService);

    jest.clearAllMocks();
  });

  describe('generateTokenPair', () => {
    it('should generate both access and refresh tokens', async () => {
      const mockUser: User = {
        id: 'user-id',
        email: 'test@example.com',
        role: 'user',
      } as User;

      mockJwtService.sign.mockReturnValueOnce('access-token').mockReturnValueOnce('refresh-token');
      mockSessionRepository.save.mockResolvedValue({});

      const tokens = await service.generateTokenPair(mockUser);

      expect(tokens.accessToken).toBe('access-token');
      expect(tokens.refreshToken).toBe('refresh-token');
      expect(tokens.expiresIn).toBe(900); // 15 minutes in seconds
      expect(mockSessionRepository.save).toHaveBeenCalled();
    });
  });

  describe('verifyAccessToken', () => {
    it('should return payload for valid access token', async () => {
      const payload = {
        sub: 'user-id',
        email: 'test@example.com',
        role: 'user',
        type: 'access' as const,
      };
      mockJwtService.verify.mockReturnValue(payload);

      const result = await service.verifyAccessToken('valid-token');

      expect(result).toEqual(payload);
      expect(mockJwtService.verify).toHaveBeenCalledWith('valid-token', {
        secret: 'test-secret',
      });
    });

    it('should throw UnauthorizedException for invalid token type', async () => {
      mockJwtService.verify.mockReturnValue({
        sub: 'user-id',
        email: 'test@example.com',
        role: 'user',
        type: 'refresh',
      });

      await expect(service.verifyAccessToken('invalid-type-token')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException for expired token', async () => {
      mockJwtService.verify.mockImplementation(() => {
        throw new Error('Token expired');
      });

      await expect(service.verifyAccessToken('expired-token')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('verifyRefreshToken', () => {
    it('should return payload for valid refresh token', async () => {
      const payload = {
        sub: 'user-id',
        email: 'test@example.com',
        role: 'user',
        type: 'refresh' as const,
      };
      mockJwtService.verify.mockReturnValue(payload);
      mockSessionRepository.findOne.mockResolvedValue({
        token: 'valid-refresh-token',
        userId: 'user-id',
        expiresAt: new Date(Date.now() + 86400000), // Tomorrow
      });

      const result = await service.verifyRefreshToken('valid-refresh-token');

      expect(result).toEqual(payload);
    });

    it('should throw UnauthorizedException if token not in database', async () => {
      mockJwtService.verify.mockReturnValue({
        sub: 'user-id',
        email: 'test@example.com',
        role: 'user',
        type: 'refresh',
      });
      mockSessionRepository.findOne.mockResolvedValue(null);

      await expect(service.verifyRefreshToken('unknown-token')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException and remove expired token', async () => {
      const expiredSession = {
        token: 'expired-token',
        userId: 'user-id',
        expiresAt: new Date(Date.now() - 86400000), // Yesterday
      };
      mockJwtService.verify.mockReturnValue({
        sub: 'user-id',
        email: 'test@example.com',
        role: 'user',
        type: 'refresh',
      });
      mockSessionRepository.findOne.mockResolvedValue(expiredSession);

      await expect(service.verifyRefreshToken('expired-token')).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockSessionRepository.remove).toHaveBeenCalledWith(expiredSession);
    });
  });

  describe('refreshAccessToken', () => {
    it('should generate new token pair and revoke old refresh token', async () => {
      const payload = {
        sub: 'user-id',
        email: 'test@example.com',
        role: 'user',
        type: 'refresh' as const,
      };
      mockJwtService.verify.mockReturnValue(payload);
      mockSessionRepository.findOne.mockResolvedValue({
        token: 'old-refresh-token',
        userId: 'user-id',
        expiresAt: new Date(Date.now() + 86400000),
      });
      mockJwtService.sign
        .mockReturnValueOnce('new-access-token')
        .mockReturnValueOnce('new-refresh-token');
      mockSessionRepository.save.mockResolvedValue({});
      mockSessionRepository.delete.mockResolvedValue({});

      const tokens = await service.refreshAccessToken('old-refresh-token');

      expect(tokens.accessToken).toBe('new-access-token');
      expect(tokens.refreshToken).toBe('new-refresh-token');
      expect(mockSessionRepository.delete).toHaveBeenCalledWith({ token: 'old-refresh-token' });
    });
  });

  describe('revokeRefreshToken', () => {
    it('should delete the refresh token', async () => {
      await service.revokeRefreshToken('token-to-revoke');

      expect(mockSessionRepository.delete).toHaveBeenCalledWith({ token: 'token-to-revoke' });
    });
  });

  describe('revokeAllUserSessions', () => {
    it('should delete all sessions for a user', async () => {
      await service.revokeAllUserSessions('user-id');

      expect(mockSessionRepository.delete).toHaveBeenCalledWith({ userId: 'user-id' });
    });
  });

  describe('cleanExpiredSessions', () => {
    it('should remove expired sessions from database', async () => {
      const mockQueryBuilder = {
        delete: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        execute: jest.fn().mockResolvedValue({}),
      };
      mockSessionRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      await service.cleanExpiredSessions();

      expect(mockSessionRepository.createQueryBuilder).toHaveBeenCalled();
      expect(mockQueryBuilder.delete).toHaveBeenCalled();
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('expires_at < :now', {
        now: expect.any(Date),
      });
      expect(mockQueryBuilder.execute).toHaveBeenCalled();
    });
  });
});
