import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    // By default, Passport expects `username` and `password`. You can configure it to use other fields if necessary.
    super();
  }

  async validate(username: string, password: string): Promise<any> {
  
    
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user; // If user is valid, return it. Passport will attach it to req.user.
  }
}
