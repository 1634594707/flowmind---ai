import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { QueryTasksDto } from './dto/query-tasks.dto';
import { DecomposeTasksDto } from './dto/decompose-tasks.dto';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async findAll(@Query() query: QueryTasksDto, @Request() req) {
    const tasks = await this.tasksService.findAllForUser(req.user.userId, query);
    return {
      code: 200,
      data: tasks,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    const task = await this.tasksService.findOneForUser(id, req.user.userId);
    return {
      code: 200,
      data: task,
    };
  }

  @Post()
  async create(@Body() createTaskDto: CreateTaskDto, @Request() req) {
    const task = await this.tasksService.create(createTaskDto, req.user.userId);
    return {
      code: 201,
      message: '任务创建成功',
      data: task,
    };
  }

  @Post('decompose')
  async decompose(@Body() dto: DecomposeTasksDto, @Request() req) {
    const tasks = await this.tasksService.decomposeAndCreateTasks(dto, req.user.userId);
    return {
      code: 201,
      message: '任务拆解并创建成功',
      data: tasks,
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto, @Request() req) {
    const task = await this.tasksService.updateForUser(id, updateTaskDto, req.user.userId);
    return {
      code: 200,
      message: '任务更新成功',
      data: task,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    await this.tasksService.removeForUser(id, req.user.userId);
    return {
      code: 200,
      message: '任务删除成功',
    };
  }
}
