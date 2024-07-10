import { Body, Controller, HttpCode, HttpStatus, Post, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { MailingService } from './mailing.service';
import { MailBodyDTO } from './dto/mail-body.dto';
import { log } from 'console';
import { Response } from 'express';

@Controller('mailing')
export class MailingController {

    constructor(readonly mailingService: MailingService) {}

    
    // @UsePipes(new ValidationPipe())
    @Post('send-mail')
    public async sendMail(@Body() mailBodyDTO:MailBodyDTO,@Res() res:Response) {
      
      await this.mailingService.sendMail(mailBodyDTO.email);
      res.status(HttpStatus.OK).json({ message:"Email sent " })
      
    }
    
}
