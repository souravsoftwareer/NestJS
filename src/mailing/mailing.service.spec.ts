import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { MailerService } from '@nestjs-modules/mailer';
import { MailingService } from './mailing.service';
import { google, Auth } from 'googleapis';

jest.mock('googleapis', () => ({
  google: {
    auth: {
      OAuth2: jest.fn().mockImplementation(() => ({
        setCredentials: jest.fn(),
        getAccessToken: jest.fn((callback) => callback(null, 'testAccessToken')),
      })),
    },
  },
}));

describe('MailingService', () => {
  let service: MailingService;
  let mailerService: MailerService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MailingService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              switch (key) {
                case 'CLIENT_ID':
                  return configService.get("CLIENT_ID");
                case 'CLIENT_SECRET':
                  return configService.get("CLIENT_SECRET");
                case 'EMAIL':
                  return configService.get("EMAIL");
                default:
                  return null;
              }
            }),
          },
        },
        {
          provide: MailerService,
          useValue: {
            addTransporter: jest.fn(),
            sendMail: jest.fn().mockResolvedValue('Mail sent'),
          },
        },
      ],
    }).compile();

    service = module.get<MailingService>(MailingService);
    mailerService = module.get<MailerService>(MailerService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should set transport and send mail', async () => {
    const sendMailSpy = jest.spyOn(mailerService, 'sendMail');
    await service.sendMail('testuser@yopmail.com');

    expect(mailerService.addTransporter).toHaveBeenCalledWith('gmail', {
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: configService.get("EMAIL"),
        clientId: configService.get("CLIENT_ID"),
        clientSecret: configService.get("CLIENT_SECRET"),
        accessToken: configService.get("REFRESH_TOKEN"),
      },
    });

    expect(sendMailSpy).toHaveBeenCalledWith({
      transporterName: 'gmail',
      to: 'testuser@yopmail.com',
      from: process.env.EMAIL,
      subject: 'Verficiaction Code',
      template: 'action',
      context: {
        code: '38320',
      },
    });
  });

  it('should log error if access token retrieval fails', async () => {
    const oauth2ClientMock = google.auth.OAuth2 as unknown as jest.Mock;
    oauth2ClientMock.mockImplementationOnce(() => ({
      setCredentials: jest.fn(),
      getAccessToken: jest.fn((callback) => callback('Failed to create access token', null)),
    }));

    const logSpy = jest.spyOn(console, 'log');
    await service.sendMail('testuser@yopmail.com');

    expect(logSpy).toHaveBeenCalledWith('send mail err ', 'Failed to create access token');
  });
});
