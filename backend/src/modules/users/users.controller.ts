import { Controller, Get, Patch, Param, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { AuthenticatedRequest } from '../../common/types/request.interface';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { PermissionsGuard } from '../auth/guards/permissions.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(PermissionsGuard)
  @RequirePermissions(['project.read'], 'any')
  async getMe(@Request() req: AuthenticatedRequest) {
    const user = await this.usersService.findOne(req.user.userId);
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

  @Patch('me')
  @UseGuards(PermissionsGuard)
  @RequirePermissions(['project.read'], 'any')
  async updateMe(@Request() req: AuthenticatedRequest, @Body() updateProfileDto: UpdateProfileDto) {
    const user = await this.usersService.updateProfile(req.user.userId, updateProfileDto);
    return {
      code: 200,
      message: '个人信息更新成功',
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

  @Patch('me/2fa')
  async updateTwoFactor() {
    return {
      code: 400,
      message: '请使用 /auth/2fa/setup、/auth/2fa/verify、/auth/2fa/disable 完成两步验证开关',
    };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: any) {
    return this.usersService.update(id, updateUserDto);
  }
}
