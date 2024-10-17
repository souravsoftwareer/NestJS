import { Body, Controller, Post, HttpCode, HttpStatus, UsePipes, ValidationPipe, UseInterceptors, UseGuards, Logger, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDTO } from '../users/dto/create-user.dto';
import { UserBodyDTO } from '../users/dto/user-body.dto';
import { LoggingInterceptor } from '../interceptors/LoggingInterceptor';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) { }

  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe())
  @UseInterceptors(LoggingInterceptor)
  @Post('login')
  signIn(@Body() signInDto: UserBodyDTO) {
    Logger.log('sign in log')
    return this.authService.signIn(signInDto);
  }

  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe())
  @UseInterceptors(LoggingInterceptor)
  @UseGuards(LocalAuthGuard)
  @Post('loginPassport')
  signPassport(@Request() req) {
    Logger.log('signPassport in log')
    return this.authService.login(req);
  }

  
  @Post("register")
  @UsePipes(new ValidationPipe())
  @UseInterceptors(LoggingInterceptor)
  register(@Body() userDto: CreateUserDTO) {
    return this.authService.register(userDto)
  }

}
