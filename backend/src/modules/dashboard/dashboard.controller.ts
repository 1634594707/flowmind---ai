import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  async getStats(@Request() req) {
    const stats = await this.dashboardService.getStats(req.user.userId);
    return {
      code: 200,
      data: stats,
    };
  }

  @Get('activities')
  async getActivities(@Request() req) {
    const activities = await this.dashboardService.getActivities(req.user.userId);
    return {
      code: 200,
      data: activities,
    };
  }

  @Get('projects')
  async getProjectOverviews(@Request() req) {
    const result = await this.dashboardService.getProjectOverviews(req.user.userId);
    return {
      code: 200,
      data: result,
    };
  }
}
