import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Project } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { QueryProjectsDto } from './dto/query-projects.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  async create(createProjectDto: CreateProjectDto, userId: string): Promise<Project> {
    const project = this.projectsRepository.create({
      ...createProjectDto,
      ownerId: userId,
    });
    return (await this.projectsRepository.save(project)) as unknown as Project;
  }

  async findAll(query: QueryProjectsDto, userId: string) {
    const { page = 1, limit = 10, status, search } = query;
    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    const where: any = { ownerId: userId };
    if (status) {
      where.status = status;
    }
    if (search) {
      where.name = Like(`%${search}%`);
    }

    const [items, total] = await this.projectsRepository.findAndCount({
      where,
      relations: ['owner'],
      skip,
      take: limitNumber,
      order: { createdAt: 'DESC' },
    });

    return {
      items,
      pagination: {
        page: pageNumber,
        limit: limitNumber,
        total,
        totalPages: Math.ceil(total / limitNumber),
      },
    };
  }

  async findOneForUser(id: string, userId: string): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      where: { id, ownerId: userId },
      relations: ['owner'],
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return project;
  }

  async update(id: string, updateProjectDto: UpdateProjectDto, userId: string): Promise<Project> {
    const project = await this.findOneForUser(id, userId);
    Object.assign(project, updateProjectDto);
    return (await this.projectsRepository.save(project)) as unknown as Project;
  }

  async remove(id: string, userId: string): Promise<void> {
    const project = await this.findOneForUser(id, userId);
    await this.projectsRepository.remove(project);
  }

  async getStats(userId: string) {
    const total = await this.projectsRepository.count({ where: { ownerId: userId } });
    const active = await this.projectsRepository.count({
      where: { ownerId: userId, status: 'active' },
    });
    const completed = await this.projectsRepository.count({
      where: { ownerId: userId, status: 'completed' },
    });

    const today = new Date();
    const delayed = await this.projectsRepository
      .createQueryBuilder('project')
      .where('project.ownerId = :userId', { userId })
      .andWhere('project.deadline IS NOT NULL')
      .andWhere('project.deadline < :today', { today })
      .andWhere('project.status NOT IN (:...excludedStatuses)', {
        excludedStatuses: ['completed', 'archived'],
      })
      .getCount();

    return {
      total,
      active,
      completed,
      delayed,
    };
  }
}
