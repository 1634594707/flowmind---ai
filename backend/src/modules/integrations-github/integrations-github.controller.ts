import { Controller, Get, Post, Query, Request, UseGuards, Body, Res } from '@nestjs/common';
import type { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { IntegrationsGithubService } from './integrations-github.service';
import { BindGithubRepoDto } from './dto/bind-github-repo.dto';
import { AuthenticatedRequest } from '../../common/types/request.interface';

@Controller('integrations/github')
export class IntegrationsGithubController {
  constructor(private readonly githubService: IntegrationsGithubService) {}

  @Get('connect')
  @UseGuards(JwtAuthGuard)
  async connect(
    @Request() req: AuthenticatedRequest,
    @Query('projectId') projectId: string | undefined,
  ) {
    const url = this.githubService.createConnectUrl(req.user.userId, projectId);
    return {
      code: 200,
      data: { url },
    };
  }

  @Get('connect/redirect')
  @UseGuards(JwtAuthGuard)
  async connectRedirect(
    @Request() req: AuthenticatedRequest,
    @Query('projectId') projectId: string | undefined,
    @Res() res: Response,
  ) {
    const url = this.githubService.createConnectUrl(req.user.userId, projectId);
    return res.redirect(url);
  }

  @Get('callback')
  async callback(@Query('code') code: string, @Query('state') state: string, @Res() res: Response) {
    const { projectId } = await this.githubService.handleCallback(code, state);
    const redirectTo = this.githubService.buildFrontendRedirectUrl(projectId);
    return res.redirect(redirectTo);
  }

  @Get('repos')
  @UseGuards(JwtAuthGuard)
  async repos(@Request() req: AuthenticatedRequest) {
    const repos = await this.githubService.listReposForUser(req.user.userId);
    return {
      code: 200,
      data: repos,
    };
  }

  @Get('binding')
  @UseGuards(JwtAuthGuard)
  async binding(@Request() req: AuthenticatedRequest, @Query('projectId') projectId: string) {
    const row = await this.githubService.getProjectBinding(req.user.userId, projectId);
    return {
      code: 200,
      data: row,
    };
  }

  @Post('bind')
  @UseGuards(JwtAuthGuard)
  async bind(@Request() req: AuthenticatedRequest, @Body() dto: BindGithubRepoDto) {
    const row = await this.githubService.bindRepoToProject(
      req.user.userId,
      dto.projectId,
      dto.fullName,
    );
    return {
      code: 200,
      message: '绑定成功',
      data: row,
    };
  }
}
