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

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  async create(@Body() createProjectDto: any, @Request() req) {
    const project = await this.projectsService.create(createProjectDto, req.user.userId);
    return {
      code: 201,
      message: '项目创建成功',
      data: project,
    };
  }

  @Get()
  async findAll(@Query() query: any, @Request() req) {
    const result = await this.projectsService.findAll(query, req.user.userId);
    return {
      code: 200,
      data: result,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const project = await this.projectsService.findOne(id);
    return {
      code: 200,
      data: project,
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProjectDto: any) {
    const project = await this.projectsService.update(id, updateProjectDto);
    return {
      code: 200,
      message: '项目更新成功',
      data: project,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.projectsService.remove(id);
    return {
      code: 200,
      message: '项目删除成功',
    };
  }
}
