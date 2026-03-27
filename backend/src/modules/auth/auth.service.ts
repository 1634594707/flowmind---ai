import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtTokenService, TokenPair } from './jwt-token.service';
import { AuditLogService } from './audit-log.service';
import speakeasy from 'speakeasy';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtTokenService: JwtTokenService,
    private auditLogService: AuditLogService,
  ) {}

  async register(registerDto: RegisterDto) {
    try {
      const user = await this.usersService.create(registerDto);
      const tokens = await this.jwtTokenService.generateTokenPair(user);

      // Log successful registration
      await this.auditLogService.logAuthentication('register', 'success', user.email, user.id);

      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: user.role,
          createdAt: user.createdAt,
          twoFactorEnabled: user.twoFactorEnabled,
        },
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      };
    } catch (error) {
      // Log failed registration
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      await this.auditLogService.logAuthentication(
        'register',
        'failure',
        registerDto.email,
        undefined,
        errorMessage,
      );
      throw error;
    }
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      // Log failed login - user not found
      await this.auditLogService.logAuthentication(
        'login',
        'failure',
        loginDto.email,
        undefined,
        '账号不存在',
      );
      throw new UnauthorizedException('账号不存在');
    }

    const isPasswordValid = await this.usersService.validatePassword(
      loginDto.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      // Log failed login - invalid password
      await this.auditLogService.logAuthentication(
        'login',
        'failure',
        loginDto.email,
        user.id,
        '密码错误',
      );
      throw new UnauthorizedException('密码错误');
    }

    if (user.twoFactorEnabled) {
      if (!user.totpSecret) {
        throw new UnauthorizedException('两步验证配置异常，请联系管理员');
      }
      if (!loginDto.twoFactorCode) {
        throw new UnauthorizedException('需要两步验证码');
      }
      const isCodeValid = speakeasy.totp.verify({
        secret: user.totpSecret,
        encoding: 'base32',
        token: loginDto.twoFactorCode,
      });
      if (!isCodeValid) {
        throw new UnauthorizedException('两步验证码错误');
      }
    }

    const tokens = await this.jwtTokenService.generateTokenPair(user);

    // Log successful login
    await this.auditLogService.logAuthentication('login', 'success', user.email, user.id);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        createdAt: user.createdAt,
        twoFactorEnabled: user.twoFactorEnabled,
      },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      return null;
    }

    const isPasswordValid = await this.usersService.validatePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return null;
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _password, ...result } = user;
    return result;
  }

  async refreshTokens(userId: string, email: string, role: string): Promise<TokenPair> {
    try {
      // Create a minimal user object for token generation
      const user = { id: userId, email, role } as any;
      const tokens = await this.jwtTokenService.generateTokenPair(user);

      // Log successful token refresh
      await this.auditLogService.logAuthentication('token_refresh', 'success', email, userId);

      return tokens;
    } catch (error) {
      // Log failed token refresh
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      await this.auditLogService.logAuthentication(
        'token_refresh',
        'failure',
        email,
        userId,
        errorMessage,
      );
      throw error;
    }
  }

  async logout(userId: string): Promise<void> {
    try {
      await this.jwtTokenService.revokeAllUserSessions(userId);

      // Log successful logout
      await this.auditLogService.logAuthentication('logout', 'success', undefined, userId);
    } catch (error) {
      // Log failed logout
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      await this.auditLogService.logAuthentication(
        'logout',
        'failure',
        undefined,
        userId,
        errorMessage,
      );
      throw error;
    }
  }

  async getProfile(userId: string) {
    return this.usersService.findOne(userId);
  }

  async setupTwoFactor(userId: string) {
    const user = await this.usersService.findOne(userId);
    const secret = user.totpSecret || speakeasy.generateSecret().base32;
    const otpauthUrl = speakeasy.otpauthURL({
      secret,
      label: user.email,
      issuer: 'FlowMind',
      encoding: 'base32',
    });

    await this.usersService.update(userId, { totpSecret: secret, twoFactorEnabled: false });

    return {
      secret,
      otpauthUrl,
    };
  }

  async verifyAndEnableTwoFactor(userId: string, code: string) {
    const user = await this.usersService.findOne(userId);
    if (!user.totpSecret) {
      throw new BadRequestException('请先完成两步验证初始化');
    }

    const isCodeValid = speakeasy.totp.verify({
      secret: user.totpSecret,
      encoding: 'base32',
      token: code,
    });
    if (!isCodeValid) {
      throw new UnauthorizedException('两步验证码错误');
    }

    await this.usersService.update(userId, { twoFactorEnabled: true });
    await this.auditLogService.logAuthentication('2fa_enable', 'success', user.email, user.id);

    return { twoFactorEnabled: true };
  }

  async disableTwoFactor(userId: string, code: string) {
    const user = await this.usersService.findOne(userId);
    if (!user.twoFactorEnabled) {
      return { twoFactorEnabled: false };
    }
    if (!user.totpSecret) {
      throw new BadRequestException('两步验证配置异常');
    }

    const isCodeValid = speakeasy.totp.verify({
      secret: user.totpSecret,
      encoding: 'base32',
      token: code,
    });
    if (!isCodeValid) {
      throw new UnauthorizedException('两步验证码错误');
    }

    await this.usersService.update(userId, { twoFactorEnabled: false, totpSecret: null });
    await this.auditLogService.logAuthentication('2fa_disable', 'success', user.email, user.id);

    return { twoFactorEnabled: false };
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    await this.usersService.changePassword(userId, currentPassword, newPassword);
  }
}
