import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './entities/document.entity';
import { ProjectsService } from '../projects/projects.service';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private documentsRepository: Repository<Document>,
    private projectsService: ProjectsService,
  ) {}

  async create(createDocumentDto: any): Promise<Document> {
    const document = this.documentsRepository.create(createDocumentDto);
    return (await this.documentsRepository.save(document)) as unknown as Document;
  }

  async findAllForUser(userId: string, projectId?: string): Promise<Document[]> {
    const qb = this.documentsRepository
      .createQueryBuilder('document')
      .leftJoin('document.project', 'project')
      .where('project.ownerId = :userId', { userId })
      .orderBy('document.updatedAt', 'DESC');

    if (projectId) {
      await this.projectsService.findOneForUser(projectId, userId);
      qb.andWhere('document.projectId = :projectId', { projectId });
    }

    return qb.getMany();
  }

  async findAll(): Promise<Document[]> {
    return this.documentsRepository.find();
  }

  async findOneForUser(id: string, userId: string): Promise<Document> {
    const doc = await this.documentsRepository
      .createQueryBuilder('document')
      .leftJoin('document.project', 'project')
      .where('document.id = :id', { id })
      .andWhere('project.ownerId = :userId', { userId })
      .getOne();

    if (!doc) {
      throw new NotFoundException('Document not found');
    }

    return doc;
  }

  async findOne(id: string): Promise<Document> {
    return this.documentsRepository.findOne({ where: { id } });
  }

  async update(id: string, updateDocumentDto: any): Promise<Document> {
    await this.documentsRepository.update(id, updateDocumentDto);
    return this.findOne(id);
  }

  async updateForUser(id: string, updateDocumentDto: any, userId: string): Promise<Document> {
    const doc = await this.findOneForUser(id, userId);

    if (updateDocumentDto?.projectId && updateDocumentDto.projectId !== doc.projectId) {
      await this.projectsService.findOneForUser(updateDocumentDto.projectId, userId);
    }

    await this.documentsRepository.update(id, updateDocumentDto);
    return this.findOneForUser(id, userId);
  }

  async remove(id: string): Promise<void> {
    await this.documentsRepository.delete(id);
  }

  async removeForUser(id: string, userId: string): Promise<void> {
    await this.findOneForUser(id, userId);
    await this.documentsRepository.delete(id);
  }
}
