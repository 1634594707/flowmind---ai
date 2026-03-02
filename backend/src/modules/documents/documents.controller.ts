import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('documents')
@UseGuards(JwtAuthGuard)
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get()
  async findAll() {
    const documents = await this.documentsService.findAll();
    return {
      code: 200,
      data: documents,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const document = await this.documentsService.findOne(id);
    return {
      code: 200,
      data: document,
    };
  }

  @Post()
  async create(@Body() createDocumentDto: any) {
    const document = await this.documentsService.create(createDocumentDto);
    return {
      code: 201,
      message: '文档创建成功',
      data: document,
    };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateDocumentDto: any) {
    const document = await this.documentsService.update(id, updateDocumentDto);
    return {
      code: 200,
      message: '文档更新成功',
      data: document,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.documentsService.remove(id);
    return {
      code: 200,
      message: '文档删除成功',
    };
  }
}
