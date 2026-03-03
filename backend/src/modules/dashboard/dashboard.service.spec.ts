import { Test } from '@nestjs/testing';
import { DashboardService } from './dashboard.service';
import { ProjectsService } from '../projects/projects.service';
import { DocumentsService } from '../documents/documents.service';

describe('DashboardService', () => {
  let service: DashboardService;

  const projectsService = {
    getStats: jest.fn(async () => ({ total: 2, active: 1, completed: 1, delayed: 0 })),
  };

  const documentsService = {
    findAllForUser: jest.fn(async () => []),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        DashboardService,
        { provide: ProjectsService, useValue: projectsService },
        { provide: DocumentsService, useValue: documentsService },
      ],
    }).compile();

    service = moduleRef.get(DashboardService);
    jest.clearAllMocks();
  });

  it('getStats() should map project stats', async () => {
    const result = await service.getStats('u1');
    expect(projectsService.getStats).toHaveBeenCalledWith('u1');
    expect(result.totalProjects).toBe(2);
    expect(result.activeProjects).toBe(1);
    expect(result.completedProjects).toBe(1);
    expect(result.overdueProjects).toBe(0);
  });
});
