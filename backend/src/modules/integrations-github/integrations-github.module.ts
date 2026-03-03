import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { IntegrationsGithubController } from './integrations-github.controller';
import { IntegrationsGithubService } from './integrations-github.service';
import { GithubIntegration } from './entities/github-integration.entity';
import { ProjectGithubRepo } from './entities/project-github-repo.entity';
import { ProjectsModule } from '../projects/projects.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GithubIntegration, ProjectGithubRepo]),
    ProjectsModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET', 'flowmind-secret-key'),
      }),
    }),
  ],
  controllers: [IntegrationsGithubController],
  providers: [IntegrationsGithubService],
  exports: [IntegrationsGithubService],
})
export class IntegrationsGithubModule {}
