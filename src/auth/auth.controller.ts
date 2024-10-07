import { Body, Controller, Post, HttpCode, HttpStatus, UsePipes, ValidationPipe, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from '../users/dto/create-user.dto';
import { UserBodyDTO } from '../users/dto/user-body.dto';
import { LoggingInterceptor } from '../interceptors/LoggingInterceptor';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe())
  @UseInterceptors(LoggingInterceptor)
  @Post('login')
  signIn(@Body() signInDto: UserBodyDTO) {
    return this.authService.signIn(signInDto);
  }

  
  @Post("register")
  @UsePipes(new ValidationPipe())
  @UseInterceptors(LoggingInterceptor)
  register(@Body() userDto: CreateUserDTO) {
    return this.authService.register(userDto)
  }

}
