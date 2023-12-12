import { BadRequestException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDTO } from 'src/users/dto/create-user.dto';
import { UserBodyDTO } from 'src/users/dto/user-body.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async signIn(userData:UserBodyDTO) {
    const user = await this.usersService.getUser(userData.email,userData.password);
    if (!user) {
      throw new UnauthorizedException();
    }
  
    const payload = { sub: user.id, username: user.name }
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async register(userDto:CreateUserDTO) {
    const user = await this.usersService.getUserByEmail(userDto.email)
    if(user) {
        throw new HttpException('Email already exists',HttpStatus.FORBIDDEN)
    }
    this.usersService.createUser(userDto)
    
    return {
        message:"User registered !!"
      };
  }


}
