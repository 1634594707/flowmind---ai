import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AiService } from './ai.service';
import { CreateRequirementSessionDto } from './dto/create-requirement-session.dto';
import { AddRequirementMessageDto } from './dto/add-requirement-message.dto';
import { GeneratePrdDto } from './dto/generate-prd.dto';
import { ChatRequirementDto } from './dto/chat-requirement.dto';
import { AuthenticatedRequest } from '../../common/types/request.interface';

@Controller('ai/requirement')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('sessions')
  async createSession(
    @Body() dto: CreateRequirementSessionDto,
    @Request() req: AuthenticatedRequest,
  ) {
    const session = await this.aiService.createRequirementSession(dto, req.user.userId);
    return {
      code: 201,
      message: '会话创建成功',
      data: session,
    };
  }

  @Get('sessions')
  async listSessions(@Query('projectId') projectId: string, @Request() req: AuthenticatedRequest) {
    if (!projectId) {
      throw new BadRequestException('projectId is required');
    }
    const sessions = await this.aiService.listRequirementSessionsByProject(
      projectId,
      req.user.userId,
    );
    return {
      code: 200,
      data: sessions,
    };
  }

  @Get('sessions/:id')
  async getSession(@Param('id') id: string, @Request() req: AuthenticatedRequest) {
    const session = await this.aiService.getRequirementSession(id, req.user.userId);
    return {
      code: 200,
      data: session,
    };
  }

  @Post('sessions/:id/messages')
  async addMessage(
    @Param('id') id: string,
    @Body() dto: AddRequirementMessageDto,
    @Request() req: AuthenticatedRequest,
  ) {
    const message = await this.aiService.addRequirementMessage(id, dto, req.user.userId);
    return {
      code: 201,
      message: '消息已添加',
      data: message,
    };
  }

  @Post('sessions/:id/chat')
  async chat(
    @Param('id') id: string,
    @Body() dto: ChatRequirementDto,
    @Request() req: AuthenticatedRequest,
  ) {
    const result = await this.aiService.chat(id, dto.content, req.user.userId);
    return {
      code: 200,
      message: '推理成功',
      data: result,
    };
  }

  @Post('sessions/:id/generate-prd')
  async generatePrd(
    @Param('id') id: string,
    @Body() dto: GeneratePrdDto,
    @Request() req: AuthenticatedRequest,
  ) {
    const result = await this.aiService.generatePrd(id, dto, req.user.userId);
    return {
      code: 200,
      message: 'PRD 生成成功',
      data: result,
    };
  }
}
