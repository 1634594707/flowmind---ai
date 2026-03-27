import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ApiKeyService } from '../api-key.service';

@Injectable()
export class ApiKeyAuthGuard implements CanActivate {
  constructor(private readonly apiKeyService: ApiKeyService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<any>();
    const header = (request.headers?.['x-api-key'] || request.headers?.['X-API-Key']) as
      | string
      | undefined;
    const apiKey = header?.trim();
    if (!apiKey) {
      throw new UnauthorizedException('缺少 API Key');
    }

    const validated = await this.apiKeyService.validateApiKey(apiKey);
    if (!validated) {
      throw new UnauthorizedException('API Key 无效或已过期');
    }

    request.apiKeyUserId = validated.userId;
    return true;
  }
}
