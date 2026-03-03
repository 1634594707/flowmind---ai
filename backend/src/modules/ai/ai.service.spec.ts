import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { AiService } from './ai.service';
import { RequirementSession } from './entities/requirement-session.entity';
import { RequirementMessage } from './entities/requirement-message.entity';
import { ProjectsService } from '../projects/projects.service';
import { DocumentsService } from '../documents/documents.service';
import { LlmService } from './llm.service';

type MockRepo<T> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('AiService', () => {
  let service: AiService;
  let sessionsRepo: MockRepo<RequirementSession>;
  let messagesRepo: MockRepo<RequirementMessage>;

  const projectsService = {
    findOneForUser: jest.fn(async () => ({})),
  };

  const documentsService = {
    create: jest.fn(async () => ({ id: 'd1', content: 'c' })),
  };

  const llmService = {
    chat: jest.fn(async () => 'assistant'),
  };

  const cacheManager = {
    get: jest.fn(async () => undefined),
    set: jest.fn(async () => undefined),
    del: jest.fn(async () => undefined),
  };

  beforeEach(async () => {
    sessionsRepo = {
      create: jest.fn((x) => x),
      save: jest.fn(async (x) => ({ id: 's1', ...x })),
      findOne: jest.fn(),
      createQueryBuilder: jest.fn(() => ({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        leftJoinAndMapOne: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn(async () => []),
      })),
    };

    messagesRepo = {
      create: jest.fn((x) => x),
      save: jest.fn(async (x) => ({ id: 'm1', ...x })),
      find: jest.fn(async () => []),
      findOne: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        AiService,
        { provide: getRepositoryToken(RequirementSession), useValue: sessionsRepo },
        { provide: getRepositoryToken(RequirementMessage), useValue: messagesRepo },
        { provide: ProjectsService, useValue: projectsService },
        { provide: DocumentsService, useValue: documentsService },
        { provide: LlmService, useValue: llmService },
        { provide: CACHE_MANAGER, useValue: cacheManager },
      ],
    }).compile();

    service = moduleRef.get(AiService);
    jest.clearAllMocks();
  });

  it('createRequirementSession() should save and invalidate cache', async () => {
    const result = await service.createRequirementSession(
      { projectId: 'p1', title: 't', summary: '' } as any,
      'u1',
    );
    expect(projectsService.findOneForUser).toHaveBeenCalledWith('p1', 'u1');
    expect(sessionsRepo.save).toHaveBeenCalled();
    expect(cacheManager.del).toHaveBeenCalled();
    expect(result.id).toBe('s1');
  });

  it('addRequirementMessage() should throw when session missing', async () => {
    (sessionsRepo.findOne as jest.Mock).mockResolvedValueOnce(null);

    await expect(
      service.addRequirementMessage('s1', { role: 'user', content: 'c' } as any, 'u1'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('getRequirementSession() should return cached when present', async () => {
    (cacheManager.get as jest.Mock).mockResolvedValueOnce({ id: 's1' });

    const result = await service.getRequirementSession('s1', 'u1');
    expect(result).toEqual({ id: 's1' });
    expect(sessionsRepo.findOne).not.toHaveBeenCalled();
  });
});
