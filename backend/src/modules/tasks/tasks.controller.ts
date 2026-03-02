import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('tasks')
@UseGuards(JwtAuthGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async findAll() {
    const tasks = await this.tasksService.findAll();
    return {
      code: 200,
      data: tasks,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const task = await this.tasksService.findOne(id);
    return {
      code: 200,
      data: task,
    };
  }

  @Post()
  async create(@Body() createTaskDto: any) {
    const task = await this.tasksService.create(createTaskDto);
    return {
      code: 201,
      message: '任务创建成功',
      data: task,
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTaskDto: any) {
    const task = await this.tasksService.update(id, updateTaskDto);
    return {
      code: 200,
      message: '任务更新成功',
      data: task,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.tasksService.remove(id);
    return {
      code: 200,
      message: '任务删除成功',
    };
  }
}
