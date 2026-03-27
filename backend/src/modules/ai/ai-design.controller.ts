import {
  BadRequestException,
  Body,
  Controller,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AiService } from './ai.service';
import { LlmService } from './llm.service';
import { GenerateArchitectureDto } from './dto/generate-architecture.dto';
import { GenerateApiSpecDto } from './dto/generate-api-spec.dto';
import { GenerateDatabaseDesignDto } from './dto/generate-database-design.dto';
import { GenerateTechStackDto } from './dto/generate-tech-stack.dto';
import { AuthenticatedRequest } from '../../common/types/request.interface';

@Controller('ai/design')
@UseGuards(JwtAuthGuard)
export class AiDesignController {
  constructor(
    private readonly aiService: AiService,
    private readonly llmService: LlmService,
  ) {}

  @Post('architecture')
  async generateArchitecture(
    @Body() dto: GenerateArchitectureDto,
    @Request() req: AuthenticatedRequest,
  ) {
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
  async generateApiSpec(@Body() dto: GenerateApiSpecDto, @Request() req: AuthenticatedRequest) {
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
  async generateDatabaseDesign(
    @Body() dto: GenerateDatabaseDesignDto,
    @Request() req: AuthenticatedRequest,
  ) {
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
  async generateTechStack(@Body() dto: GenerateTechStackDto, @Request() req: AuthenticatedRequest) {
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

  /**
   * SSE 流式生成 PRD（需求分析会话）
   * 前端通过 EventSource 或 fetch+ReadableStream 消费
   */
  @Post('stream/chat')
  async streamChat(
    @Body() body: { messages: Array<{ role: string; content: string }>; temperature?: number },
    @Res() res: Response,
  ) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');
    res.flushHeaders();

    try {
      await this.llmService.chatStream(
        body.messages as any,
        (chunk) => {
          res.write(`data: ${JSON.stringify({ delta: chunk })}\n\n`);
        },
        { temperature: body.temperature },
      );
      res.write('data: [DONE]\n\n');
    } catch (err) {
      res.write(`data: ${JSON.stringify({ error: String(err) })}\n\n`);
    } finally {
      res.end();
    }
  }
}
