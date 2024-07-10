import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule,{
    rawBody: true,
  });
  const config = new DocumentBuilder()
  .setTitle('Nest Crud Operation')
  .setDescription('Nest Crud API description')
  .setVersion('1.0')
  .addTag('Nest Crud')
  .build();
const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();
