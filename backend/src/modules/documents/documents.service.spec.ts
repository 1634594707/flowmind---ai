import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { DocumentsService } from './documents.service';
import { Document } from './entities/document.entity';
import { ProjectsService } from '../projects/projects.service';
import { ProjectEventsService } from '../project-events/project-events.service';

type MockRepo<T extends object> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('DocumentsService', () => {
  let service: DocumentsService;
  let repo: MockRepo<Document>;

  const projectsService = {
    findOneForUser: jest.fn(async () => ({})),
  };

  const projectEventsService = {
    createEvent: jest.fn(async () => ({})),
  };

  beforeEach(async () => {
    repo = {
      create: jest.fn((x) => x),
      save: jest.fn(async (x) => x),
      find: jest.fn(async () => []),
      findOne: jest.fn(),
      update: jest.fn(async () => undefined),
      delete: jest.fn(async () => undefined),
      createQueryBuilder: jest.fn(() => {
        const qb: any = {
          leftJoin: jest.fn().mockReturnThis(),
          leftJoinAndSelect: jest.fn().mockReturnThis(),
          leftJoinAndMapOne: jest.fn().mockReturnThis(),
          where: jest.fn().mockReturnThis(),
          andWhere: jest.fn().mockReturnThis(),
          orderBy: jest.fn().mockReturnThis(),
          getMany: jest.fn(async () => []),
          getOne: jest.fn(async () => null),
        };
        return qb;
      }),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        DocumentsService,
        {
          provide: getRepositoryToken(Document),
          useValue: repo,
        },
        {
          provide: ProjectsService,
          useValue: projectsService,
        },
        {
          provide: ProjectEventsService,
          useValue: projectEventsService,
        },
      ],
    }).compile();

    service = moduleRef.get(DocumentsService);
  });

  it('create() should save document', async () => {
    const dto = { title: 'T', content: 'C' } as any;
    const result = await service.create(dto);
    expect(repo.create).toHaveBeenCalledWith(dto);
    expect(repo.save).toHaveBeenCalled();
    expect(result).toEqual(dto);
  });

  it('findOneForUser() should throw NotFoundException when missing', async () => {
    await expect(service.findOneForUser('d1', 'u1')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('findAllForUser() should call projectsService validation when projectId provided', async () => {
    await service.findAllForUser('u1', 'p1');
    expect(projectsService.findOneForUser).toHaveBeenCalledWith('p1', 'u1');
  });

  it('updateForUser() should validate project when projectId changes', async () => {
    const doc = { id: 'd1', projectId: 'p1' } as any;

    const qb: any = {
      leftJoin: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn(async () => []),
      getOne: jest.fn(async () => doc),
    };
    (repo.createQueryBuilder as jest.Mock).mockReturnValue(qb);

    await service.updateForUser('d1', { projectId: 'p2' } as any, 'u1');

    expect(projectsService.findOneForUser).toHaveBeenCalledWith('p2', 'u1');
    expect(repo.update).toHaveBeenCalledWith('d1', { projectId: 'p2' });
  });
});
