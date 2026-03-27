import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { QueryProjectsDto } from './dto/query-projects.dto';
import { TransitionProjectStageDto } from './dto/transition-project-stage.dto';
import { AuthenticatedRequest } from '../../common/types/request.interface';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { PermissionsGuard } from '../auth/guards/permissions.guard';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get('stats')
  @UseGuards(PermissionsGuard)
  @RequirePermissions(['project.read'])
  async getStats(@Request() req: AuthenticatedRequest) {
    const stats = await this.projectsService.getStats(req.user.userId);
    return {
      code: 200,
      data: stats,
    };
  }

  @Post(':id/stage/transition')
  @UseGuards(PermissionsGuard)
  @RequirePermissions(['project.update'])
  async transitionStage(
    @Param('id') id: string,
    @Body() dto: TransitionProjectStageDto,
    @Request() req: AuthenticatedRequest,
  ) {
    const project = await this.projectsService.transitionStage(id, req.user.userId, dto.toStage);
    return {
      code: 200,
      message: '阶段流转成功',
      data: project,
    };
  }

  @Post()
  @UseGuards(PermissionsGuard)
  @RequirePermissions(['project.update'])
  async create(@Body() createProjectDto: CreateProjectDto, @Request() req: AuthenticatedRequest) {
    const project = await this.projectsService.create(createProjectDto, req.user.userId);
    return {
      code: 201,
      message: '项目创建成功',
      data: project,
    };
  }

  @Get()
  @UseGuards(PermissionsGuard)
  @RequirePermissions(['project.read'])
  async findAll(@Query() query: QueryProjectsDto, @Request() req: AuthenticatedRequest) {
    const result = await this.projectsService.findAll(query, req.user.userId);
    return {
      code: 200,
      data: result,
    };
  }

  @Get(':id')
  @UseGuards(PermissionsGuard)
  @RequirePermissions(['project.read'])
  async findOne(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    const project = await this.projectsService.findOneForUser(id, req.user.userId);
    return {
      code: 200,
      data: project,
    };
  }

  @Patch(':id')
  @UseGuards(PermissionsGuard)
  @RequirePermissions(['project.update'])
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @Request() req: AuthenticatedRequest,
  ) {
    const project = await this.projectsService.update(id, updateProjectDto, req.user.userId);
    return {
      code: 200,
      message: '项目更新成功',
      data: project,
    };
  }

  @Delete(':id')
  @UseGuards(PermissionsGuard)
  @RequirePermissions(['project.update'])
  async remove(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    await this.projectsService.remove(id, req.user.userId);
    return {
      code: 200,
      message: '项目删除成功',
    };
  }
}
