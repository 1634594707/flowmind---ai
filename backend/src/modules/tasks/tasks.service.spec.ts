import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';
import { ProjectsService } from '../projects/projects.service';
import { DocumentsService } from '../documents/documents.service';
import { LlmService } from '../ai/llm.service';

type MockRepo<T extends object> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('TasksService', () => {
  let service: TasksService;
  let repo: MockRepo<Task>;
  let projectsService: { findOneForUser: jest.Mock };

  beforeEach(async () => {
    const qb = {
      leftJoin: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn(async () => [{ id: 't1' } as any]),
      getOne: jest.fn(async () => ({ id: 't1' }) as any),
    };

    repo = {
      create: jest.fn((x) => x),
      save: jest.fn(async (x) => x),
      find: jest.fn(async () => [{ id: 't1' } as any]),
      findOne: jest.fn(async () => ({ id: 't1' }) as any),
      createQueryBuilder: jest.fn(() => qb as any),
      update: jest.fn(async () => undefined),
      delete: jest.fn(async () => undefined),
    };

    projectsService = {
      findOneForUser: jest.fn(async () => ({ id: 'p1' })),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: getRepositoryToken(Task), useValue: repo },
        { provide: ProjectsService, useValue: projectsService },
        { provide: DocumentsService, useValue: { findOneForUser: jest.fn() } },
        { provide: LlmService, useValue: { chat: jest.fn() } },
      ],
    }).compile();

    service = moduleRef.get(TasksService);
  });

  it('create() should save task', async () => {
    const result = await service.create({ title: 't' } as any);
    expect(repo.create).toHaveBeenCalled();
    expect(repo.save).toHaveBeenCalled();
    expect(result).toEqual({ title: 't' });
  });

  it('create() with userId should validate project ownership', async () => {
    await service.create({ title: 't', projectId: 'p1' } as any, 'u1');
    expect(projectsService.findOneForUser).toHaveBeenCalledWith('p1', 'u1');
  });

  it('findAll() should return tasks', async () => {
    const result = await service.findAll();
    expect(result).toEqual([{ id: 't1' } as any]);
  });

  it('update() should call update and then findOne', async () => {
    const result = await service.update('t1', { status: 'done' });
    expect(repo.update).toHaveBeenCalledWith('t1', { status: 'done' });
    expect(result).toEqual({ id: 't1' } as any);
  });
});
