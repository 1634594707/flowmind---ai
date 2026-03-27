import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomBytes, createHash, timingSafeEqual } from 'crypto';
import { ApiKey } from './entities/api-key.entity';

@Injectable()
export class ApiKeyService {
  constructor(
    @InjectRepository(ApiKey)
    private readonly apiKeyRepository: Repository<ApiKey>,
  ) {}

  generatePlainApiKey(): string {
    return `fm_${randomBytes(32).toString('hex')}`;
  }

  hashApiKey(plain: string): string {
    return createHash('sha256').update(plain).digest('hex');
  }

  async createApiKey(userId: string, name: string, expiresAt?: Date) {
    const plain = this.generatePlainApiKey();
    const hashed = this.hashApiKey(plain);

    const entity = this.apiKeyRepository.create({
      userId,
      name,
      key: hashed,
      expiresAt,
    } as any);

    const saved = (await this.apiKeyRepository.save(entity as any)) as unknown as ApiKey;

    return {
      id: saved.id,
      name: saved.name,
      createdAt: saved.createdAt,
      expiresAt: saved.expiresAt,
      apiKey: plain,
    };
  }

  async validateApiKey(plain: string): Promise<{ userId: string } | null> {
    const hashed = this.hashApiKey(plain);
    const found = await this.apiKeyRepository.findOne({ where: { key: hashed } });
    if (!found) {
      return null;
    }
    if (found.expiresAt && found.expiresAt.getTime() <= Date.now()) {
      return null;
    }
    // constant-time-ish compare for extra safety
    const a = Buffer.from(found.key);
    const b = Buffer.from(hashed);
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      return null;
    }

    await this.apiKeyRepository.update(found.id, { lastUsedAt: new Date() } as any);
    return { userId: found.userId };
  }

  async revokeApiKey(userId: string, id: string): Promise<void> {
    const found = await this.apiKeyRepository.findOne({ where: { id, userId } as any });
    if (!found) {
      throw new UnauthorizedException('API Key 不存在或无权限');
    }
    await this.apiKeyRepository.delete({ id } as any);
  }

  async listApiKeys(userId: string) {
    const items = await this.apiKeyRepository.find({
      where: { userId } as any,
      order: { createdAt: 'DESC' } as any,
    });
    return items.map((k) => ({
      id: k.id,
      name: k.name,
      createdAt: k.createdAt,
      lastUsedAt: k.lastUsedAt,
      expiresAt: k.expiresAt,
    }));
  }
}
