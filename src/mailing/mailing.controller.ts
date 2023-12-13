import { Body, Controller, HttpCode, HttpStatus, Post, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { MailingService } from './mailing.service';
import { MailDTO } from './dto/mail.dto';
import { log } from 'console';
import { Response } from 'express';

@Controller('mailing')
export class MailingController {

    constructor(readonly mailingService: MailingService) {}

    
    @UsePipes(new ValidationPipe())
    @Post('send-mail')
    public async sendMail(@Body() mailDto:MailDTO,@Res() res:Response):Promise<any> {
      log("mailDto ",mailDto)
      await this.mailingService.sendMail(mailDto.email);
      res.status(HttpStatus.OK).json({ message:"Email sent " })

    }
    
}
