import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api');
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const clientBuildPath = join(__dirname, '..', '..', 'frontend', 'build');
  app.useStaticAssets(clientBuildPath);
  app.use((req, res, next) => {
    if (!req.originalUrl.startsWith('/api')) {
      const indexPath = join(clientBuildPath, 'index.html');
      if (fs.existsSync(indexPath)) {
        return res.sendFile(indexPath);
      }
    }
    next();
  });
  
  await app.listen(process.env.PORT ?? 8080);
}
bootstrap();
