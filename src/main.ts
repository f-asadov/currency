import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
const xmlParser = require('express-xml-bodyparser');

const cluster = require('cluster'); 
import * as process from 'node:process';
import { ClusterService } from './cluster.service';
const numCPUs = parseInt(process.argv[2] || "1");

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Currency Exchange API')
    .setDescription('API для получения и обработки курсов валют')
    .setVersion('1.0')
    .addTag('currency')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.use(xmlParser());

  await app.listen(3000);
  const server = app.getHttpServer();
  const address = server.address();

  console.log(`Application is listening on port ${address.port}`);
  
  
}
bootstrap();

// ClusterService.clusterize(bootstrap);
