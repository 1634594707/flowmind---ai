import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AiService } from './ai.service';
import { GenerateArchitectureDto } from './dto/generate-architecture.dto';
import { GenerateApiSpecDto } from './dto/generate-api-spec.dto';
import { GenerateDatabaseDesignDto } from './dto/generate-database-design.dto';
import { GenerateTechStackDto } from './dto/generate-tech-stack.dto';

@Controller('ai/design')
@UseGuards(JwtAuthGuard)
export class AiDesignController {
  constructor(private readonly aiService: AiService) {}

  @Post('architecture')
  async generateArchitecture(@Body() dto: GenerateArchitectureDto, @Request() req) {
    if (!dto.sourceDocumentId && !dto.context) {
      throw new BadRequestException('sourceDocumentId or context is required');
    }
    const result = await this.aiService.generateArchitecture(dto, req.user.userId);
    return {
      code: 200,
      message: '架构设计建议生成成功',
      data: result,
    };
  }

  @Post('api-spec')
  async generateApiSpec(@Body() dto: GenerateApiSpecDto, @Request() req) {
    if (!dto.sourceDocumentId && !dto.context) {
      throw new BadRequestException('sourceDocumentId or context is required');
    }
    const result = await this.aiService.generateApiSpec(dto, req.user.userId);
    return {
      code: 200,
      message: 'API 接口定义生成成功',
      data: result,
    };
  }

  @Post('database')
  async generateDatabaseDesign(@Body() dto: GenerateDatabaseDesignDto, @Request() req) {
    if (!dto.sourceDocumentId && !dto.context) {
      throw new BadRequestException('sourceDocumentId or context is required');
    }
    const result = await this.aiService.generateDatabaseDesign(dto, req.user.userId);
    return {
      code: 200,
      message: '数据库设计建议生成成功',
      data: result,
    };
  }

  @Post('tech-stack')
  async generateTechStack(@Body() dto: GenerateTechStackDto, @Request() req) {
    if (!dto.sourceDocumentId && !dto.context) {
      throw new BadRequestException('sourceDocumentId or context is required');
    }
    const result = await this.aiService.generateTechStack(dto, req.user.userId);
    return {
      code: 200,
      message: '技术选型推荐生成成功',
      data: result,
    };
  }
}
