import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { Logger } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let repository: MongoRepository<User>;

  const mockUserRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    aggregate: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<MongoRepository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  
  //Test getUserByEmail Method

  describe('getUserByEmail', () => {
    it('should return a user if found', async () => {
      let password = await bcrypt.hash('123456', 10)
      const mockUser = { id: 1, email: 'test@yopmail.com', password } as User;
      mockUserRepository.findOne.mockReturnValue(Promise.resolve(mockUser));
  
      const user = await service.getUserByEmail('test@yopmail.com');
      expect(user).toEqual(mockUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { email: 'test@yopmail.com' } });
    });
  
    it('should return null if no user is found', async () => {
      mockUserRepository.findOne.mockReturnValue(Promise.resolve(null));
  
      const user = await service.getUserByEmail('nonexistent@example.com');
      expect(user).toBeNull();
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { email: 'nonexistent@example.com' } });
    });
  });

  describe('createUser', () => {
    it('should create and save a new user', async () => {
      const createUserDto: CreateUserDTO = { name:"Test User1",email: 'test1@yopmail.com', password: '123456' };
      const mockUser = { id: 1, ...createUserDto } as User;

      mockUserRepository.create.mockReturnValue(mockUser);
      mockUserRepository.save.mockReturnValue(Promise.resolve(mockUser));

      const result = await service.createUser(createUserDto);
      expect(result).toEqual(mockUser);
      expect(mockUserRepository.create).toHaveBeenCalledWith(createUserDto);
      expect(mockUserRepository.save).toHaveBeenCalledWith(mockUser);
    });
  });
  
});



