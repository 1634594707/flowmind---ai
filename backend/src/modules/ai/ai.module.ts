import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiController } from './ai.controller';
import { AiDesignController } from './ai-design.controller';
import { AiService } from './ai.service';
import { RequirementSession } from './entities/requirement-session.entity';
import { RequirementMessage } from './entities/requirement-message.entity';
import { ProjectsModule } from '../projects/projects.module';
import { DocumentsModule } from '../documents/documents.module';
import { LlmService } from './llm.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([RequirementSession, RequirementMessage]),
    ProjectsModule,
    DocumentsModule,
  ],
  controllers: [AiController, AiDesignController],
  providers: [AiService, LlmService],
  exports: [AiService, LlmService],
})
export class AiModule {}
