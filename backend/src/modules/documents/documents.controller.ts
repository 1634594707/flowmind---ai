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
import { DocumentsService } from './documents.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ProjectsService } from '../projects/projects.service';

@Controller('documents')
@UseGuards(JwtAuthGuard)
export class DocumentsController {
  constructor(
    private readonly documentsService: DocumentsService,
    private readonly projectsService: ProjectsService,
  ) {}

  @Get()
  async findAll(@Query('projectId') projectId: string | undefined, @Request() req) {
    const documents = await this.documentsService.findAllForUser(req.user.userId, projectId);
    return {
      code: 200,
      data: documents,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() req) {
    const document = await this.documentsService.findOneForUser(id, req.user.userId);
    return {
      code: 200,
      data: document,
    };
  }

  @Post()
  async create(@Body() createDocumentDto: any, @Request() req) {
    await this.projectsService.findOneForUser(createDocumentDto.projectId, req.user.userId);
    const document = await this.documentsService.create({
      ...createDocumentDto,
      authorId: req.user.userId,
    });
    return {
      code: 201,
      message: '文档创建成功',
      data: document,
    };
  }

  @Post(':id/set-primary')
  async setPrimary(@Param('id') id: string, @Request() req) {
    const document = await this.documentsService.setPrimaryPrd(id, req.user.userId);
    return {
      code: 200,
      message: '已设为主PRD',
      data: document,
    };
  }

  @Post(':id/freeze')
  async freeze(@Param('id') id: string, @Request() req) {
    const document = await this.documentsService.freezePrd(id, req.user.userId);
    return {
      code: 200,
      message: 'PRD 已冻结',
      data: document,
    };
  }

  @Post(':id/unfreeze')
  async unfreeze(@Param('id') id: string, @Request() req) {
    const document = await this.documentsService.unfreezePrd(id, req.user.userId);
    return {
      code: 200,
      message: 'PRD 已解冻',
      data: document,
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateDocumentDto: any, @Request() req) {
    const document = await this.documentsService.updateForUser(
      id,
      updateDocumentDto,
      req.user.userId,
    );
    return {
      code: 200,
      message: '文档更新成功',
      data: document,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() req) {
    await this.documentsService.removeForUser(id, req.user.userId);
    return {
      code: 200,
      message: '文档删除成功',
    };
  }
}
