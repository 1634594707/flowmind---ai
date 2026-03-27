import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './entities/document.entity';
import { ProjectsService } from '../projects/projects.service';
import { ProjectEventsService } from '../project-events/project-events.service';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private documentsRepository: Repository<Document>,
    private projectsService: ProjectsService,
    private projectEventsService: ProjectEventsService,
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

  async findOne(id: string): Promise<Document | null> {
    return this.documentsRepository.findOne({ where: { id } });
  }

  async update(id: string, updateDocumentDto: any): Promise<Document | null> {
    await this.documentsRepository.update(id, updateDocumentDto);
    return this.findOne(id);
  }

  async updateForUser(id: string, updateDocumentDto: any, userId: string): Promise<Document> {
    const doc = await this.findOneForUser(id, userId);

    if (updateDocumentDto?.projectId && updateDocumentDto.projectId !== doc.projectId) {
      await this.projectsService.findOneForUser(updateDocumentDto.projectId, userId);
    }

    if ((doc.type || '').toLowerCase() === 'prd' && doc.status === 'FROZEN') {
      const hasTitleChange =
        typeof updateDocumentDto?.title === 'string' && updateDocumentDto.title !== doc.title;
      const hasContentChange =
        typeof updateDocumentDto?.content === 'string' && updateDocumentDto.content !== doc.content;

      if (hasTitleChange || hasContentChange) {
        const level = updateDocumentDto?.changeLevel;
        const reason = (updateDocumentDto?.changeReason || '').trim();

        if (!level || !reason) {
          throw new BadRequestException('PRD 已冻结：修改必须选择变更级别并填写原因');
        }

        if (level === 'MAJOR') {
          throw new BadRequestException('PRD 已冻结：重大变更请先解冻后再修改');
        }
      }
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

  async setPrimaryPrd(id: string, userId: string): Promise<Document> {
    const doc = await this.findOneForUser(id, userId);
    if ((doc.type || '').toLowerCase() !== 'prd') {
      throw new BadRequestException('Only PRD documents can be set as primary');
    }

    await this.documentsRepository.update(
      {
        projectId: doc.projectId,
        type: 'prd',
      } as any,
      {
        isPrimary: false,
      } as any,
    );

    await this.documentsRepository.update(doc.id, { isPrimary: true } as any);

    await this.projectEventsService.createEvent({
      projectId: doc.projectId,
      type: 'document.prd.primary_set',
      actorId: userId,
      payload: {
        documentId: doc.id,
        title: doc.title,
      },
    });

    return this.findOneForUser(doc.id, userId);
  }

  async freezePrd(id: string, userId: string): Promise<Document> {
    const doc = await this.findOneForUser(id, userId);
    if ((doc.type || '').toLowerCase() !== 'prd') {
      throw new BadRequestException('Only PRD documents can be frozen');
    }

    if (doc.status === 'FROZEN') {
      return doc;
    }

    await this.documentsRepository.update(doc.id, {
      status: 'FROZEN',
      frozenAt: new Date(),
    } as any);

    const updated = await this.findOneForUser(doc.id, userId);

    await this.projectEventsService.createEvent({
      projectId: doc.projectId,
      type: 'document.prd.frozen',
      actorId: userId,
      payload: {
        documentId: doc.id,
        title: doc.title,
        isPrimary: !!updated.isPrimary,
      },
    });

    if (updated.isPrimary) {
      const project = await this.projectsService.findOneForUser(doc.projectId, userId);
      if ((project.stage || 'requirements') === 'requirements') {
        await this.projectsService.transitionStage(project.id, userId, 'design');

        await this.projectEventsService.createEvent({
          projectId: project.id,
          type: 'project.stage.auto_advanced',
          actorId: userId,
          payload: {
            from: 'requirements',
            to: 'design',
            reason: 'primary_prd_frozen',
            documentId: updated.id,
          },
        });
      }
    }

    return updated;
  }

  async unfreezePrd(id: string, userId: string): Promise<Document> {
    const doc = await this.findOneForUser(id, userId);
    if ((doc.type || '').toLowerCase() !== 'prd') {
      throw new BadRequestException('Only PRD documents can be unfrozen');
    }

    if (doc.status !== 'FROZEN') {
      return doc;
    }

    await this.documentsRepository.update(doc.id, {
      status: 'REVIEW',
      frozenAt: null,
    } as any);

    const updated = await this.findOneForUser(doc.id, userId);

    await this.projectEventsService.createEvent({
      projectId: doc.projectId,
      type: 'document.prd.unfrozen',
      actorId: userId,
      payload: {
        documentId: doc.id,
        title: doc.title,
        isPrimary: !!updated.isPrimary,
      },
    });

    return updated;
  }
}
