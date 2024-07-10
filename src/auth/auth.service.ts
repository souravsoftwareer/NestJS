import { BadRequestException, HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDTO } from 'src/users/dto/create-user.dto';
import { UserBodyDTO } from 'src/users/dto/user-body.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async signIn(userData:UserBodyDTO) {
    const user = await this.usersService.getUserByEmail(userData.email);
    if (!user) {
        throw new UnauthorizedException();
      }
    let validUser = await this.comparePasswords(userData.password,user.password)
    if (!validUser ) {
        throw new UnauthorizedException();
      }
    const payload = { sub: user.id, username: user.name }
    return {
      access_token: await this.jwtService.signAsync(payload),
      user
    };
  }

  async register(userDto:CreateUserDTO) {
    const user = await this.usersService.getUserByEmail(userDto.email)
    if(user) {
        throw new HttpException('Email already exists',HttpStatus.FORBIDDEN)
    }
    userDto.password = await this.hashPassword(userDto.password)
    this.usersService.createUser(userDto)

    return {
        message:"User registered !!"
      }
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10; // You can adjust this according to your needs
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  }

  // Verify a password against a hashed password
  async comparePasswords(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainTextPassword, hashedPassword);
  }


}
