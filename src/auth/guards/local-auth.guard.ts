import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        console.log('LocalAuthGuard canActivate called'); // Debug log
        const result = await super.canActivate(context);

        return result as boolean
      }
}