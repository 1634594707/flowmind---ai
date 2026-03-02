import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Project } from './entities/project.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
  ) {}

  async create(createProjectDto: any, userId: string): Promise<Project> {
    const project = this.projectsRepository.create({
      ...createProjectDto,
      ownerId: userId,
    });
    return await this.projectsRepository.save(project) as Project;
  }

  async findAll(query: any, userId: string) {
    const { page = 1, limit = 10, status, search } = query;
    const skip = (page - 1) * limit;

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
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      items,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      where: { id },
      relations: ['owner'],
    });
    
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
    
    return project;
  }

  async update(id: string, updateProjectDto: any): Promise<Project> {
    const project = await this.findOne(id);
    Object.assign(project, updateProjectDto);
    return await this.projectsRepository.save(project) as Project;
  }

  async remove(id: string): Promise<void> {
    const project = await this.findOne(id);
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

    return {
      total,
      active,
      completed,
      delayed: 0, // TODO: 计算延期项目
    };
  }
}
