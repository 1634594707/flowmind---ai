import { Module } from '@nestjs/common';
import { ProjectsModule } from '../projects/projects.module';
import { ProjectEventsModule } from '../project-events/project-events.module';
import { ProjectEventsController } from '../project-events/project-events.controller';

@Module({
  imports: [ProjectsModule, ProjectEventsModule],
  controllers: [ProjectEventsController],
})
export class ProjectEventsApiModule {}
