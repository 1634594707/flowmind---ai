import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { RequestTimingInterceptor } from './common/interceptors/request-timing.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 全局验证管道
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // CORS 配置
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  });

  // API 前缀
  app.setGlobalPrefix('api');

  app.useGlobalInterceptors(new RequestTimingInterceptor());

  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 FlowMind Backend is running on: http://localhost:${port}`);
  console.log(`📚 API Documentation: http://localhost:${port}/api`);
}

bootstrap();
