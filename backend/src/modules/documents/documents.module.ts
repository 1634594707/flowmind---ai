import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { Document } from './entities/document.entity';
import { ProjectsModule } from '../projects/projects.module';
import { ProjectEventsModule } from '../project-events/project-events.module';

@Module({
  imports: [TypeOrmModule.forFeature([Document]), ProjectsModule, ProjectEventsModule],
  controllers: [DocumentsController],
  providers: [DocumentsService],
  exports: [DocumentsService],
})
export class DocumentsModule {}
