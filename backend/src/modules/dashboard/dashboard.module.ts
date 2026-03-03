import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { ProjectsModule } from '../projects/projects.module';
import { DocumentsModule } from '../documents/documents.module';

@Module({
  imports: [ProjectsModule, DocumentsModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
