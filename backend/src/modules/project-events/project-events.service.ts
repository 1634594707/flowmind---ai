import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectEvent } from './entities/project-event.entity';

@Injectable()
export class ProjectEventsService {
  constructor(
    @InjectRepository(ProjectEvent)
    private readonly projectEventsRepository: Repository<ProjectEvent>,
  ) {}

  async createEvent(params: {
    projectId: string;
    type: string;
    source?: string;
    payload?: any;
    actorId?: string | null;
  }): Promise<ProjectEvent> {
    const event = this.projectEventsRepository.create({
      projectId: params.projectId,
      type: params.type,
      source: params.source || 'internal',
      payload: params.payload ?? null,
      actorId: params.actorId ?? null,
    });

    return (await this.projectEventsRepository.save(event)) as unknown as ProjectEvent;
  }

  async findRecent(projectId: string, limit = 20): Promise<ProjectEvent[]> {
    return this.projectEventsRepository.find({
      where: { projectId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }
}
