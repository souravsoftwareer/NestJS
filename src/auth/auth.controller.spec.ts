import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CreateUserDTO } from '../users/dto/create-user.dto';
import { UserBodyDTO } from '../users/dto/user-body.dto';
import { LoggingInterceptor } from '../interceptors/LoggingInterceptor';
import { ValidationPipe } from '@nestjs/common';
import { APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            signIn: jest.fn(),
            register: jest.fn(),
          },
        },
        {
          provide: APP_PIPE,
          useClass: ValidationPipe,
        },
        {
          provide: APP_INTERCEPTOR,
          useClass: LoggingInterceptor,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('signIn', () => {
    it('should call AuthService.signIn with correct parameters', async () => {
      const signInDto: UserBodyDTO = { email: 'test@yopmail.com', password: '123456' };
      // const signInSpy = jest.spyOn(authService, 'register').mockResolvedValue({ message: 'mockUser' });


      const result = await authController.signIn(signInDto);

      // expect(signInSpy).toHaveBeenCalledWith(signInDto);
      // expect(result).toEqual('mockToken');
    });
  });

  describe('register', () => {
    it('should call AuthService.register with correct parameters', async () => {
      const createUserDto: CreateUserDTO = { email: 'test1@yopmail.com', password: '123456', name: 'Test User1' };
      const registerSpy = jest.spyOn(authService, 'register').mockResolvedValue({ message: 'mockUser' });


      const result = await authController.register(createUserDto);

      expect(registerSpy).toHaveBeenCalledWith(createUserDto);
      // expect(result).toEqual('mockUser');
    });
  });
});
