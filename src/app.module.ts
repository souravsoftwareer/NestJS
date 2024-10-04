import { Module, ValidationPipe } from '@nestjs/common';
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


@Module({
  imports: [
    ProductModule,
    TypeOrmModule.forRootAsync({
      // type: 'mongodb',
      // host: 'localhost',
      // port: 27017,
      // database: 'test_db',
      // entities: [join(__dirname, "**", "*.entity.{ts,js}")],
      // "synchronize": true,
      // "useUnifiedTopology": true
      imports: [ConfigModule], // Ensure ConfigModule is imported
      inject: [ParameterStoreService],
      useFactory: async (parameterStoreService: ParameterStoreService) => {
        const dbUri = await parameterStoreService.getParameter('MONGODB_URL');
        console.log('dbUri ',dbUri)
        return {
          type: 'mongodb',
          url: dbUri,  // Use the dynamically fetched DB URI
          synchronize: true,
          useUnifiedTopology: true,
          entities: [join(__dirname, '**', '*.entity.{ts,js}')],
        };
      },
      // }),
    }),
    
    AuthModule,
    UsersModule,
    MailingModule,
    ConfigurationModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
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
    MediaModule,
    ConfigModule
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
export class AppModule {}
