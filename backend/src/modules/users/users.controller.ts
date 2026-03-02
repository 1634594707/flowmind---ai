import { Controller, Get, Patch, Param, Body, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateTwoFactorDto } from './dto/update-twofactor.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe(@Request() req) {
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
  async updateMe(@Request() req, @Body() updateProfileDto: UpdateProfileDto) {
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
  async updateTwoFactor(@Request() req, @Body() dto: UpdateTwoFactorDto) {
    const user = await this.usersService.setTwoFactorEnabled(req.user.userId, dto.enabled);
    return {
      code: 200,
      message: dto.enabled ? '两步验证已启用' : '两步验证已关闭',
      data: {
        twoFactorEnabled: user.twoFactorEnabled,
      },
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
