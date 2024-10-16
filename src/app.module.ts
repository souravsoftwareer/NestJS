import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from "path";
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MailingModule } from './mailing/mailing.module';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { APP_PIPE } from '@nestjs/core';
import { MediaModule } from './media/media.module';
import { ConfigurationModule } from './config/configuration.module';
import { ParameterStoreService } from './config/parameter-store/parameter-store.service'; // Import your service
import * as fileUpload from 'express-fileupload';
import * as dotenv from 'dotenv';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

// Load the appropriate .env file based on NODE_ENV
const nodeEnv = process.env.NODE_ENV || 'dev'; // Default to development
const envFilePath = nodeEnv === 'prod' ? '.env.prod' : '.env';
dotenv.config({ path: envFilePath });

@Module({

  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // ConfigurationModule,
    ProductModule,
    ConfigurationModule, // Import it here
    TypeOrmModule.forRootAsync({
      inject: [ParameterStoreService], // Inject the service
      useFactory: async (parameterStoreService: ParameterStoreService) => {
        const dbUri = await parameterStoreService.getParameter('MONGODB_URL');
        return {
          type: 'mongodb',
          url: dbUri,
          synchronize: true,
          useUnifiedTopology: true,
          entities: [join(__dirname, '**', '*.entity.{ts,js}')],
        };
      },
    }),
    MulterModule.register({
      storage: memoryStorage(), // Use memory storage to get buffer for AWS S3 upload
    }),
    AuthModule,
    UsersModule,
    MailingModule,
    
    MailerModule.forRoot({
      transport: 'smtps://user@domain.com:pass@smtp.domain.com',
      template: {
        dir: process.cwd() + '/templates/',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    MediaModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(fileUpload({
  //     limits: { fileSize: 5000 * 1024 * 1024 }, // Set file size limit (50 MB in this case)
  //   })).forRoutes('*');
  // }
}
