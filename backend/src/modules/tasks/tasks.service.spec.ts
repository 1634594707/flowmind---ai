import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';

type MockRepo<T> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('TasksService', () => {
  let service: TasksService;
  let repo: MockRepo<Task>;

  beforeEach(async () => {
    repo = {
      create: jest.fn((x) => x),
      save: jest.fn(async (x) => x),
      find: jest.fn(async () => [{ id: 't1' } as any]),
      findOne: jest.fn(async () => ({ id: 't1' } as any)),
      update: jest.fn(async () => undefined),
      delete: jest.fn(async () => undefined),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: getRepositoryToken(Task), useValue: repo },
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
