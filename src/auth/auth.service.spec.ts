import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDTO } from '../users/dto/create-user.dto';
import { UserBodyDTO } from '../users/dto/user-body.dto';
import { User } from './../users/user.entity'
import { UnauthorizedException, HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

jest.mock('../users/users.service'); // Mock UsersService

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        {
          provide: UsersService,
          useFactory: () => ({
            getUserByEmail: jest.fn(),
            createUser: jest.fn(),
          }),
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('signIn', () => {
    it('should sign in a user with valid credentials', async () => {
      const userData: UserBodyDTO = { email: 'test@yopmail.com', password: await bcrypt.hash('123456', 10) };
      // const mockUser = { id:1,email: 'Test User', password: await bcrypt.hash('password', 10),active:'0', eotp:'', createdOn:"" };
      // Mock the User entity with TypeORM methods
      const mockUser: Promise<User> = Promise.resolve({
        id: 1,
        email: 'test@example.com',
        password: await bcrypt.hash('password', 10),
        name: 'Test User',
        active: true,
        eotp: '',
        createdOn: new Date(),

        // Mock TypeORM methods (if needed)
        save: jest.fn().mockResolvedValue(this),
        remove: jest.fn().mockResolvedValue(this),
        softRemove: jest.fn().mockResolvedValue(this),
        hasId: jest.fn().mockReturnValue(true),

        // Add other TypeORM methods as needed
      } as unknown as User); // Cast as User to satisfy TypeScript

      jest.spyOn(usersService, 'getUserByEmail').mockResolvedValue(mockUser);
      jest.spyOn(authService, 'comparePasswords').mockResolvedValue(true);
      jest.spyOn(jwtService, 'signAsync').mockResolvedValue('mockToken');

      const result = await authService.signIn(userData);

      expect(result).toHaveProperty('access_token');
      // expect(result.user).toEqual(mockUser);
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      const userData: UserBodyDTO = { email: 'test@example.com', password: 'invalidpassword' };
      jest.spyOn(usersService, 'getUserByEmail').mockResolvedValue(null);

      await expect(authService.signIn(userData)).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const mockUser: Promise<User> = Promise.resolve({
        id: 1,
        email: 'newuser@example.com',
        password: await bcrypt.hash('password', 10),
        name: 'Test User',
        active: true,
        eotp: '',
        createdOn: new Date(),

        // Mock TypeORM methods (if needed)
        save: jest.fn().mockResolvedValue(this),
        remove: jest.fn().mockResolvedValue(this),
        softRemove: jest.fn().mockResolvedValue(this),
        hasId: jest.fn().mockReturnValue(true),

        // Add other TypeORM methods as needed
      } as unknown as User); // Cast as User to satisfy TypeScript
      const createUserDto: CreateUserDTO = { email: 'newuser@example.com',  password: await bcrypt.hash('password', 10), name: 'New User' };
      jest.spyOn(usersService, 'getUserByEmail').mockResolvedValue(null);
      jest.spyOn(authService, 'hashPassword').mockResolvedValue('hashedPassword');
      jest.spyOn(usersService, 'createUser').mockResolvedValue(mockUser);

      const result = await authService.register(createUserDto);

      expect(result).toEqual({ message: 'User registered !!' });
    });

    it('should throw HttpException for existing email during registration', async () => {
      const mockUser: Promise<User> = Promise.resolve({
        id: 1,
        email: 'testuser1@yopmail.com',
        password: await bcrypt.hash('123456', 10),
        name: 'Test User',
        active: true,
        eotp: '',
        createdOn: new Date(),

        // Mock TypeORM methods (if needed)
        save: jest.fn().mockResolvedValue(this),
        remove: jest.fn().mockResolvedValue(this),
        softRemove: jest.fn().mockResolvedValue(this),
        hasId: jest.fn().mockReturnValue(true),

        // Add other TypeORM methods as needed
      } as unknown as User); // Cast as User to satisfy TypeScript
      const existingUserDto: CreateUserDTO = { email: 'testuser1@yopmail.com', password: await bcrypt.hash('123456', 10), name: 'Test User1' };
      jest.spyOn(usersService, 'getUserByEmail').mockResolvedValue(mockUser);

      await expect(authService.register(existingUserDto)).rejects.toThrow(HttpException);
    });
  });
});
