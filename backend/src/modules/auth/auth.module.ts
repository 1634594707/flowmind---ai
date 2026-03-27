import { Module, forwardRef } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { Session } from './entities/session.entity';
import { ApiKey } from './entities/api-key.entity';
import { AuditLog } from './entities/audit-log.entity';
import { Role } from './entities/role.entity';
import { Permission } from './entities/permission.entity';
import { User } from '../users/entities/user.entity';
import { JwtTokenService } from './jwt-token.service';
import { AccountLockoutService } from './account-lockout.service';
import { AuditLogService } from './audit-log.service';
import { RedisModule } from '../../common/redis.module';
import { RbacService } from './rbac.service';
import { PermissionsGuard } from './guards/permissions.guard';
import { ApiKeyService } from './api-key.service';
import { ApiKeyAuthGuard } from './guards/api-key.guard';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    PassportModule,
    RedisModule,
    TypeOrmModule.forFeature([Session, ApiKey, AuditLog, Role, Permission, User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'flowmind-secret-key'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN', '15m'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtTokenService,
    AccountLockoutService,
    AuditLogService,
    RbacService,
    ApiKeyService,
    JwtStrategy,
    LocalStrategy,
    PermissionsGuard,
    ApiKeyAuthGuard,
  ],
  exports: [
    AuthService,
    JwtTokenService,
    AccountLockoutService,
    AuditLogService,
    RbacService,
    PermissionsGuard,
    ApiKeyService,
    ApiKeyAuthGuard,
  ],
})
export class AuthModule {}
