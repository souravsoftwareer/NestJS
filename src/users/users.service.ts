import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository,MongoRepository } from 'typeorm';
import { CreateUserDTO } from './dto/create-user.dto';
import { log } from 'console';


// This should be a real class/interface representing a user entity
// export type User = any;

@Injectable()
export class UsersService {
  // private readonly users = [
  //   {
  //     userId: 1,
  //     username: 'john',
  //     password: 'changeme',
  //   },
  //   {
  //     userId: 2,
  //     username: 'maria',
  //     password: 'guess',
  //   },
  // ];

  constructor(
    @InjectRepository(User)
    private userRepository: MongoRepository<User>
    // private userRepository: Repository<User>
  ) {}
  async getUser(email: string,password:string): Promise<User | undefined> {
    let userData = this.userRepository.aggregate([
      {$match:{email,password}}
    ])
    
    return userData?.[0]??{}
    // return this.users.find(user => user.username === username);
  }

  async getUserByEmail(email:string) {
    let userData = await this.userRepository.findOne( {where: { email }})
    return userData
  }

  async createUser(createUserDto:CreateUserDTO):Promise<User> {
    const user = this.userRepository.create(createUserDto);
    const user_after_save = await this.userRepository.save(user);
    console.log('User after save:', user_after_save);
    return user_after_save
  }
}