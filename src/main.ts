import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { log } from 'console';
import { Logger } from '@nestjs/common';


async function bootstrap() {
  const PORT = process.env.PORT||3000
  const app = await NestFactory.create(AppModule,{
    rawBody: true,
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });
  const config = new DocumentBuilder()
  .setTitle('Nest Crud Operation')
  .setDescription('Nest Crud API description')
  .setVersion('1.0')
  .addTag('Nest Crud')
  .build();
const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, document);
Logger.log(`Serivce is running on ${PORT}`)
await app.listen(PORT);
}
bootstrap();
