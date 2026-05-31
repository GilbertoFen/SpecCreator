import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './shared/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const frontendOrigin = process.env.FRONTEND_ORIGIN ?? 'http://localhost:3000';
  const host = process.env.HOST ?? '127.0.0.1';
  const port = resolveBackendPort();

  app.enableCors({
    origin: frontendOrigin,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new GlobalExceptionFilter());

  await app.listen(port, host);
  console.log(`Backend running on http://${host}:${port}`);
}

void bootstrap();

function resolveBackendPort(): number {
  const explicitPort = Number(process.env.PORT);

  if (Number.isInteger(explicitPort) && explicitPort > 0) {
    return explicitPort;
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (apiUrl) {
    try {
      const parsedUrl = new URL(apiUrl);
      const inferredPort = Number(parsedUrl.port);

      if (Number.isInteger(inferredPort) && inferredPort > 0) {
        return inferredPort;
      }
    } catch {
      // Ignore malformed URLs and fall back to the default port.
    }
  }

  return 3001;
}
