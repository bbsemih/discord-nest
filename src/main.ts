import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { VersioningType } from '@nestjs/common';
import helmet from 'helmet';
import * as dotenv from 'dotenv';
dotenv.config();

const signalNames: NodeJS.Signals[] = ['SIGTERM', 'SIGINT', 'SIGUSR2'];

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  //eslint-disable-next-line @typescript-eslint/no-var-requires
  app.use(
    require('express-status-monitor')({
      title: 'discord-nest',
      path: '/v1/monitor/status',
      chartVisibility: {
        cpu: true,
        mem: true,
        load: true,
        heap: true,
        eventLoop: true,
        responseTime: true,
        rps: true,
        statusCodes: true,
      },
    }),
  );

  /*
  const snapshotFolderPath = path.join(__dirname, 'snapshots');
  heapdump.writeSnapshot(snapshotFolderPath, function(err, filename) {
    if (err) {
      console.error('Error writing snapshot:', err);
    } else {
      console.log('Snapshot written to', filename);
    }
  });
  */

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  app.use(helmet());

  const config = new DocumentBuilder()
    .setTitle('discord-nest')
    .setDescription("The API documentation for 'discord-nest' - Semih Berkay Ozturk")
    .setVersion('1.0.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/v1/swagger', app, document, {
    swaggerOptions: {
      filter: true,
      showRequestDuration: true,
    },
  });

  if (process.env.CORS_ENABLE) {
    app.enableCors({
      origin: origin.length === 0 ? '*' : origin,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      //add more options
    });
  } else {
    app.enableCors();
  }

  process.on('unhandledRejection', (reason, promise) => {
    console.log('Unhandled Rejection - Reason:', reason);
    promise.catch((err: Error) => {
      console.log('Unhandled Rejection - Error:', err);
      process.exit(1);
    });
  });

  process.on('uncaughtException', error => {
    console.log('Uncaught Exception - Error:', error);
    process.exit(1);
  });

  signalNames.forEach(signalName => {
    process.on(signalName, async () => {
      await app.close();
      console.log(`Process terminated with signal: ${signalName}`);
      process.exit(0);
    });
  });

  await app.listen(3000);
}
bootstrap();
