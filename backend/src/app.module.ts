import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { AiModule } from './modules/ai/ai.module';

@Module({
  imports: [
    // 配置模块
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const redisUrl = configService.get<string>('REDIS_URL', '');

        if (!redisUrl) {
          return {
            ttl: 30_000,
          };
        }

        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const redisStore = require('cache-manager-redis-store');

        return {
          store: redisStore,
          url: redisUrl,
          ttl: 30_000,
        };
      },
    }),

    // 数据库模块
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get('DB_PORT', 5432),
        username: configService.get('DB_USERNAME', 'postgres'),
        password: configService.get('DB_PASSWORD') || '',
        database: configService.get('DB_DATABASE', 'flowmind'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('NODE_ENV') !== 'production',
        logging: configService.get('NODE_ENV') === 'development',
      }),
      inject: [ConfigService],
    }),

    // 业务模块
    AuthModule,
    UsersModule,
    ProjectsModule,
    DashboardModule,
    TasksModule,
    DocumentsModule,
    AiModule,
  ],
})
export class AppModule {}
