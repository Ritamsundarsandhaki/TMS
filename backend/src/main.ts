import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as morgan from 'morgan';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const logger = new Logger('Bootstrap');

  // ================= MIDDLEWARE =================
  app.use(cookieParser.default());

  app.use(
    morgan.default(
      ':method :url :status :response-time ms - :res[content-length] - :remote-addr',
    ),
  );

  // ================= CORS =================
  const origins = process.env.FRONTEND_URLS
    ? process.env.FRONTEND_URLS.split(',')
    : ['http://localhost:3000'];

  app.enableCors({
    origin: origins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // ================= VALIDATION =================
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // ================= SWAGGER =================
  const config = new DocumentBuilder()
    .setTitle('Task Management API')
    .setDescription('API documentation for Task Management System')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  // ================= START SERVER =================
  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  logger.log(`Server running on: ${await app.getUrl()}`);
  logger.log(`Swagger docs: ${await app.getUrl()}/api`);

  // ================= MEMORY MONITOR =================
  if (process.env.NODE_ENV !== 'production') {
    setInterval(() => {
      const mem = process.memoryUsage();

      logger.log('Memory Usage:');
      logger.log(`RSS: ${(mem.rss / 1024 / 1024).toFixed(2)} MB`);
      logger.log(`Heap Used: ${(mem.heapUsed / 1024 / 1024).toFixed(2)} MB`);
      logger.log(`Heap Total: ${(mem.heapTotal / 1024 / 1024).toFixed(2)} MB`);
      logger.log(`External: ${(mem.external / 1024 / 1024).toFixed(2)} MB`);
      logger.log('----------------------------------');
    }, 60000);
  }
}

bootstrap();