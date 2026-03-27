import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { GithubIntegration } from './entities/github-integration.entity';
import { ProjectGithubRepo } from './entities/project-github-repo.entity';
import { ProjectsService } from '../projects/projects.service';

type GithubTokenResponse = {
  access_token?: string;
  token_type?: string;
  scope?: string;
  error?: string;
  error_description?: string;
};

@Injectable()
export class IntegrationsGithubService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private projectsService: ProjectsService,
    @InjectRepository(GithubIntegration)
    private githubIntegrationsRepo: Repository<GithubIntegration>,
    @InjectRepository(ProjectGithubRepo)
    private projectGithubReposRepo: Repository<ProjectGithubRepo>,
  ) {}

  private getClientId(): string {
    return this.configService.get<string>('GITHUB_CLIENT_ID', '') || '';
  }

  private getClientSecret(): string {
    return this.configService.get<string>('GITHUB_CLIENT_SECRET', '') || '';
  }

  private getBackendBaseUrl(): string {
    return this.configService.get<string>('BACKEND_URL', '') || '';
  }

  private getFrontendBaseUrl(): string {
    return this.configService.get<string>('FRONTEND_URL', '') || 'http://localhost:5173';
  }

  createConnectUrl(userId: string, projectId?: string): string {
    const clientId = this.getClientId();
    if (!clientId) {
      throw new BadRequestException('GITHUB_CLIENT_ID is not configured');
    }

    const backendBase = this.getBackendBaseUrl();
    if (!backendBase) {
      throw new BadRequestException('BACKEND_URL is not configured');
    }

    const redirectUri = `${backendBase.replace(/\/$/, '')}/api/integrations/github/callback`;

    const state = this.jwtService.sign(
      {
        userId,
        projectId,
        nonce: Math.random().toString(36).slice(2),
      },
      { expiresIn: '10m' },
    );

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: 'repo read:org',
      state,
    });

    return `https://github.com/login/oauth/authorize?${params.toString()}`;
  }

  async handleCallback(
    code: string,
    state: string,
  ): Promise<{ userId: string; projectId?: string }> {
    if (!code) {
      throw new BadRequestException('code is required');
    }
    if (!state) {
      throw new BadRequestException('state is required');
    }

    let decoded: any;
    try {
      decoded = this.jwtService.verify(state);
    } catch {
      throw new BadRequestException('Invalid state');
    }

    const userId = String(decoded?.userId || '');
    const projectId = decoded?.projectId ? String(decoded.projectId) : undefined;
    if (!userId) {
      throw new BadRequestException('Invalid state payload');
    }

    const clientId = this.getClientId();
    const clientSecret = this.getClientSecret();
    if (!clientId || !clientSecret) {
      throw new BadRequestException('GitHub OAuth is not configured');
    }

    const backendBase = this.getBackendBaseUrl();
    if (!backendBase) {
      throw new BadRequestException('BACKEND_URL is not configured');
    }
    const redirectUri = `${backendBase.replace(/\/$/, '')}/api/integrations/github/callback`;

    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
      }),
    });

    const tokenJson = (await tokenResponse.json()) as GithubTokenResponse;
    if (tokenJson.error) {
      throw new BadRequestException(tokenJson.error_description || tokenJson.error);
    }

    const accessToken = String(tokenJson.access_token || '');
    if (!accessToken) {
      throw new BadRequestException('GitHub token exchange failed');
    }

    const existing = await this.githubIntegrationsRepo.findOne({ where: { userId } });
    const entity = existing
      ? this.githubIntegrationsRepo.merge(existing, {
          accessToken,
          tokenType: tokenJson.token_type || '',
          scope: tokenJson.scope || '',
        })
      : this.githubIntegrationsRepo.create({
          userId,
          accessToken,
          tokenType: tokenJson.token_type || '',
          scope: tokenJson.scope || '',
        });

    await this.githubIntegrationsRepo.save(entity as any);

    return { userId, projectId };
  }

  private async getAccessTokenForUser(userId: string): Promise<string> {
    const row = await this.githubIntegrationsRepo.findOne({ where: { userId } });
    if (!row) {
      throw new NotFoundException('GitHub integration not connected');
    }
    return row.accessToken;
  }

  async listReposForUser(
    userId: string,
  ): Promise<Array<{ id: number; fullName: string; htmlUrl: string; private: boolean }>> {
    const token = await this.getAccessTokenForUser(userId);

    const resp = await fetch('https://api.github.com/user/repos?per_page=100&sort=updated', {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `token ${token}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });

    if (!resp.ok) {
      throw new BadRequestException('Failed to fetch repos from GitHub');
    }

    const json = (await resp.json()) as any[];
    return (json || []).map((r) => ({
      id: Number(r.id),
      fullName: String(r.full_name),
      htmlUrl: String(r.html_url),
      private: !!r.private,
    }));
  }

  async bindRepoToProject(
    userId: string,
    projectId: string,
    fullName: string,
  ): Promise<ProjectGithubRepo> {
    await this.projectsService.findOneForUser(projectId, userId);

    const token = await this.getAccessTokenForUser(userId);

    const safeFullName = String(fullName || '').trim();
    const [ownerRaw, repoRaw] = safeFullName.split('/');
    if (!ownerRaw || !repoRaw) {
      throw new BadRequestException('Invalid repo fullName, expected "owner/repo"');
    }

    const owner = encodeURIComponent(ownerRaw);
    const repo = encodeURIComponent(repoRaw);

    const repoResp = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `token ${token}`,
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });

    if (!repoResp.ok) {
      throw new BadRequestException('Repo not found or not accessible');
    }

    const repoJson = (await repoResp.json()) as any;

    const existing = await this.projectGithubReposRepo.findOne({ where: { projectId } });
    const entity = existing
      ? this.projectGithubReposRepo.merge(existing, {
          repoId: Number(repoJson.id),
          fullName: String(repoJson.full_name),
          htmlUrl: String(repoJson.html_url),
          defaultBranch: String(repoJson.default_branch || ''),
        })
      : this.projectGithubReposRepo.create({
          projectId,
          repoId: Number(repoJson.id),
          fullName: String(repoJson.full_name),
          htmlUrl: String(repoJson.html_url),
          defaultBranch: String(repoJson.default_branch || ''),
        });

    return (await this.projectGithubReposRepo.save(entity as any)) as unknown as ProjectGithubRepo;
  }

  async getProjectBinding(userId: string, projectId: string): Promise<ProjectGithubRepo | null> {
    await this.projectsService.findOneForUser(projectId, userId);
    return this.projectGithubReposRepo.findOne({ where: { projectId } });
  }

  buildFrontendRedirectUrl(projectId?: string): string {
    const base = this.getFrontendBaseUrl().replace(/\/$/, '');
    if (projectId) {
      return `${base}/app/projects/${projectId}/tasks?github=connected`;
    }
    return `${base}/app/settings?github=connected`;
  }
}
