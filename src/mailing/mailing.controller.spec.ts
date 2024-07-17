import { Test, TestingModule } from '@nestjs/testing';
import { MailingController } from './mailing.controller';
import { MailingService } from './mailing.service';
import { MailBodyDTO } from './dto/mail-body.dto';
import * as request from 'supertest';
import { INestApplication, HttpStatus, ValidationPipe } from '@nestjs/common';

describe('MailingController', () => {
  let app: INestApplication;
  let mailingService = {
    sendMail: jest.fn().mockResolvedValue(undefined)
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MailingController],
      providers: [
        {
          provide: MailingService,
          useValue: mailingService
        }
      ],
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());  // Uncomment if ValidationPipe is used
    await app.init();
  });

  it('/POST mailing/send-mail', async () => {
    const mailBodyDTO: MailBodyDTO = { email: 'test@example.com' };

    const response = await request(app.getHttpServer())
      .post('/mailing/send-mail')
      .send(mailBodyDTO)
      .expect(HttpStatus.OK);

    expect(response.body).toEqual({ message: 'Email sent ' });
    expect(mailingService.sendMail).toHaveBeenCalledWith(mailBodyDTO.email);
  });

  afterAll(async () => {
    await app.close();
  });
});
