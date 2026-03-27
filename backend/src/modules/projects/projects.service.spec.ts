import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ProjectsService } from './projects.service';
import { Project } from './entities/project.entity';

type MockRepo<T extends object> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const buildProject = (overrides?: Partial<Project>): Project => {
  return {
    id: 'p1',
    name: 'Test Project',
    description: null as unknown as string,
    status: 'planning',
    progress: 0,
    startDate: null as unknown as Date,
    deadline: null as unknown as Date,
    tags: [],
    sdlcTemplate: 'agile',
    stage: 'requirements',
    ownerId: 'u1',
    owner: null as unknown as any,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  };
};

describe('ProjectsService', () => {
  let service: ProjectsService;
  let repo: MockRepo<Project>;

  beforeEach(async () => {
    repo = {
      create: jest.fn((x) => x),
      save: jest.fn(async (x) => x),
      findOne: jest.fn(),
      findAndCount: jest.fn(async () => [[], 0]),
      count: jest.fn(async () => 0),
      createQueryBuilder: jest.fn(() => ({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getCount: jest.fn(async () => 0),
      })),
      remove: jest.fn(async () => undefined),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        ProjectsService,
        {
          provide: getRepositoryToken(Project),
          useValue: repo,
        },
      ],
    }).compile();

    service = moduleRef.get(ProjectsService);
  });

  it('create() should save project with ownerId', async () => {
    const saved = buildProject();
    (repo.save as jest.Mock).mockResolvedValueOnce(saved);

    const result = await service.create({ name: 'A' } as any, 'u1');

    expect(repo.create).toHaveBeenCalledWith({ name: 'A', ownerId: 'u1' });
    expect(repo.save).toHaveBeenCalled();
    expect(result).toEqual(saved);
  });

  it('findOneForUser() should throw NotFoundException when missing', async () => {
    (repo.findOne as jest.Mock).mockResolvedValueOnce(null);

    await expect(service.findOneForUser('p1', 'u1')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('transitionStage() should advance to next stage when toStage is omitted', async () => {
    const project = buildProject({ stage: 'requirements', sdlcTemplate: 'agile' });
    (repo.findOne as jest.Mock).mockResolvedValueOnce(project);
    (repo.save as jest.Mock).mockImplementationOnce(async (p) => p);

    const result = await service.transitionStage('p1', 'u1');

    expect(result.stage).toBe('design');
    expect(repo.save).toHaveBeenCalled();
  });

  it('transitionStage() should reject unsupported template', async () => {
    const project = buildProject({ sdlcTemplate: 'waterfall' as any });
    (repo.findOne as jest.Mock).mockResolvedValueOnce(project);

    await expect(service.transitionStage('p1', 'u1')).rejects.toBeInstanceOf(BadRequestException);
  });

  it('transitionStage() should reject invalid manual transition', async () => {
    const project = buildProject({ stage: 'requirements', sdlcTemplate: 'agile' });
    (repo.findOne as jest.Mock).mockResolvedValueOnce(project);

    await expect(service.transitionStage('p1', 'u1', 'testing')).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('findAll() should return items and pagination', async () => {
    (repo.findAndCount as jest.Mock).mockResolvedValueOnce([[buildProject()], 11]);

    const result = await service.findAll({ page: 2, limit: 10 } as any, 'u1');

    expect(result.items).toHaveLength(1);
    expect(result.pagination.page).toBe(2);
    expect(result.pagination.limit).toBe(10);
    expect(result.pagination.total).toBe(11);
    expect(result.pagination.totalPages).toBe(2);
  });

  it('getStats() should return totals', async () => {
    (repo.count as jest.Mock)
      .mockResolvedValueOnce(5)
      .mockResolvedValueOnce(2)
      .mockResolvedValueOnce(1);

    const qb = {
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getCount: jest.fn(async () => 3),
    };
    (repo.createQueryBuilder as jest.Mock).mockReturnValueOnce(qb);

    const result = await service.getStats('u1');

    expect(result.total).toBe(5);
    expect(result.active).toBe(2);
    expect(result.completed).toBe(1);
    expect(result.delayed).toBe(3);
  });
});
