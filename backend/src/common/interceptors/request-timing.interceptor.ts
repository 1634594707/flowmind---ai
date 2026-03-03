import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class RequestTimingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const startedAt = Date.now();
    const http = context.switchToHttp();
    const req = http.getRequest<Request & { originalUrl?: string }>();

    return next.handle().pipe(
      tap(() => {
        const durationMs = Date.now() - startedAt;
        const method = (req as any)?.method || '';
        const url = (req as any)?.originalUrl || (req as any)?.url || '';
        const statusCode = (http.getResponse() as any)?.statusCode;
        console.log(`[API] ${method} ${url} ${statusCode ?? ''} ${durationMs}ms`);
      }),
    );
  }
}
