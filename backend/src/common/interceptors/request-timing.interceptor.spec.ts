import { of } from 'rxjs';
import type { CallHandler, ExecutionContext } from '@nestjs/common';
import { RequestTimingInterceptor } from './request-timing.interceptor';

describe('RequestTimingInterceptor', () => {
  it('should log api timing on success', (done) => {
    const interceptor = new RequestTimingInterceptor();

    const ctx: any = {
      switchToHttp: () => ({
        getRequest: () => ({ method: 'GET', url: '/api/ping' }),
        getResponse: () => ({ statusCode: 200 }),
      }),
    } as ExecutionContext;

    const next: CallHandler = {
      handle: () => of({ ok: true }),
    };

    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => undefined);

    interceptor.intercept(ctx, next).subscribe({
      next: () => undefined,
      complete: () => {
        expect(logSpy).toHaveBeenCalled();
        logSpy.mockRestore();
        done();
      },
    });
  });
});
