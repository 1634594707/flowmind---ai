import { Controller, Post, Get, Body, UseGuards, Request, Delete, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { TwoFactorCodeDto } from './dto/two-factor-code.dto';
import { ApiKeyService } from './api-key.service';
import { CreateApiKeyDto } from './dto/create-api-key.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly apiKeyService: ApiKeyService,
  ) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const result = await this.authService.register(registerDto);
    return {
      code: 200,
      message: '注册成功',
      data: result,
    };
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.login(loginDto);
    return {
      code: 200,
      message: '登录成功',
      data: result,
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req: any) {
    const user = await this.authService.getProfile(req.user.userId);
    return {
      code: 200,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        createdAt: user.createdAt,
        twoFactorEnabled: user.twoFactorEnabled,
      },
    };
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  async changePassword(@Request() req: any, @Body() dto: ChangePasswordDto) {
    await this.authService.changePassword(req.user.userId, dto.currentPassword, dto.newPassword);
    return {
      code: 200,
      message: '密码修改成功',
    };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Request() req: any) {
    await this.authService.logout(req.user.userId);
    return {
      code: 200,
      message: '退出成功',
    };
  }

  @Post('refresh')
  @UseGuards(JwtRefreshGuard)
  async refreshTokens(@Request() req: any) {
    const tokens = await this.authService.refreshTokens(
      req.user.userId,
      req.user.email,
      req.user.role,
    );
    return {
      code: 200,
      message: 'Token刷新成功',
      data: tokens,
    };
  }

  @Post('2fa/setup')
  @UseGuards(JwtAuthGuard)
  async setupTwoFactor(@Request() req: any) {
    const data = await this.authService.setupTwoFactor(req.user.userId);
    return {
      code: 200,
      message: '两步验证初始化成功',
      data,
    };
  }

  @Post('2fa/verify')
  @UseGuards(JwtAuthGuard)
  async verifyAndEnableTwoFactor(@Request() req: any, @Body() dto: TwoFactorCodeDto) {
    const data = await this.authService.verifyAndEnableTwoFactor(req.user.userId, dto.code);
    return {
      code: 200,
      message: '两步验证已启用',
      data,
    };
  }

  @Post('2fa/disable')
  @UseGuards(JwtAuthGuard)
  async disableTwoFactor(@Request() req: any, @Body() dto: TwoFactorCodeDto) {
    const data = await this.authService.disableTwoFactor(req.user.userId, dto.code);
    return {
      code: 200,
      message: '两步验证已关闭',
      data,
    };
  }

  @Get('api-keys')
  @UseGuards(JwtAuthGuard)
  async listApiKeys(@Request() req: any) {
    const items = await this.apiKeyService.listApiKeys(req.user.userId);
    return { code: 200, data: items };
  }

  @Post('api-keys')
  @UseGuards(JwtAuthGuard)
  async createApiKey(@Request() req: any, @Body() dto: CreateApiKeyDto) {
    const expiresAt = dto.expiresAt ? new Date(dto.expiresAt) : undefined;
    const created = await this.apiKeyService.createApiKey(req.user.userId, dto.name, expiresAt);
    return { code: 201, message: 'API Key 创建成功', data: created };
  }

  @Delete('api-keys/:id')
  @UseGuards(JwtAuthGuard)
  async revokeApiKey(@Request() req: any, @Param('id') id: string) {
    await this.apiKeyService.revokeApiKey(req.user.userId, id);
    return { code: 200, message: 'API Key 已撤销' };
  }
}
