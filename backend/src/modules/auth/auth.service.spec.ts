import { Test } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

describe('AuthService', () => {
  let service: AuthService;

  const usersService = {
    create: jest.fn(),
    findByEmail: jest.fn(),
    validatePassword: jest.fn(),
    findOne: jest.fn(),
    changePassword: jest.fn(),
  };

  const jwtService = {
    sign: jest.fn(() => 'token'),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
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
    usersService.findByEmail.mockResolvedValueOnce({ id: 'u1', password: 'hashed' });
    usersService.validatePassword.mockResolvedValueOnce(false);

    await expect(service.login({ email: 'a@b.com', password: 'p' } as any)).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });

  it('register() should return token and user', async () => {
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
    expect(result.token).toBe('token');
    expect(jwtService.sign).toHaveBeenCalled();
    expect(result.user.email).toBe('a@b.com');
  });
});
