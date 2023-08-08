import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { VersioningType } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1', ''],
  });
  app.use(helmet());

  const config = new DocumentBuilder()
    .setTitle('discord-nest')
    .setDescription("The API documentation for 'discord-nest'")
    .setVersion('1.0.0')
    .addTag('api', 'swagger')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);

  if (process.env.CORS_ENABLE) {
    app.enableCors({
      origin: origin.length === 0 ? '*' : origin,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      //will add more options
    });
  } else {
    app.enableCors();
  }

  await app.listen(3000);
}
bootstrap();
