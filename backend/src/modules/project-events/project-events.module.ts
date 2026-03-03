import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectEvent } from './entities/project-event.entity';
import { ProjectEventsService } from './project-events.service';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectEvent])],
  providers: [ProjectEventsService],
  exports: [ProjectEventsService],
})
export class ProjectEventsModule {}
