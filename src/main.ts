import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('v1/api');

  const config = new DocumentBuilder()
    .setTitle('sequelize-chat')
    .setDescription("The API documentation for 'discord-nest'")
    .setVersion('1.0.0')
    .addTag('api', 'swagger')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swaggger', app, document);

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