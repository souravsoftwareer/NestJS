import { Body, Controller, Post, HttpCode, HttpStatus, UsePipes, ValidationPipe, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from 'src/users/dto/create-user.dto';
import { UserBodyDTO } from 'src/users/dto/user-body.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @UseInterceptors()
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe())
  @Post('login')
  signIn(@Body() signInDto: UserBodyDTO) {
    return this.authService.signIn(signInDto);
  }

  
  @Post("register")
  @UsePipes(new ValidationPipe())

  register(@Body() userDto: CreateUserDTO) {
    return this.authService.register(userDto)
  }

}
