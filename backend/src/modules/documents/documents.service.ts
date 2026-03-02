import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Document } from './entities/document.entity';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private documentsRepository: Repository<Document>,
  ) {}

  async create(createDocumentDto: any): Promise<Document> {
    const document = this.documentsRepository.create(createDocumentDto);
    return await this.documentsRepository.save(document) as Document;
  }

  async findAll(): Promise<Document[]> {
    return this.documentsRepository.find();
  }

  async findOne(id: string): Promise<Document> {
    return this.documentsRepository.findOne({ where: { id } });
  }

  async update(id: string, updateDocumentDto: any): Promise<Document> {
    await this.documentsRepository.update(id, updateDocumentDto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.documentsRepository.delete(id);
  }
}
