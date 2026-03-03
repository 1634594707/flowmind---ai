import { Controller, Get, Param, Query, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProjectsService } from '../projects/projects.service';
import { ProjectEventsService } from './project-events.service';

@Controller('projects/:projectId/events')
@UseGuards(JwtAuthGuard)
export class ProjectEventsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly projectEventsService: ProjectEventsService,
  ) {}

  @Get()
  async getRecent(
    @Param('projectId') projectId: string,
    @Query('limit') limit: string | undefined,
    @Request() req,
  ) {
    await this.projectsService.findOneForUser(projectId, req.user.userId);

    const take = Math.min(Math.max(Number(limit) || 20, 1), 100);
    const events = await this.projectEventsService.findRecent(projectId, take);

    return {
      code: 200,
      data: events,
    };
  }
}
