import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { log } from 'console';
import { google } from 'googleapis';
import { Options } from 'nodemailer/lib/smtp-transport';

@Injectable()
export class MailingService {
    constructor(
        private readonly configService: ConfigService,
        private readonly mailerService: MailerService
    ) {
    }

    private async setTransport() {
        try{
        const OAuth2 = google.auth.OAuth2;
        const oauth2Client = new OAuth2(
            this.configService.get('CLIENT_ID'),
            this.configService.get('CLIENT_SECRET'),
            'https://developers.google.com/oauthplayground',
        );
        // log("client id",this.configService.get('CLIENT_ID')) 
        // log("client id",process.env.CLIENT_ID) 
        oauth2Client.setCredentials({
            refresh_token: process.env.REFRESH_TOKEN,
        });

        const accessToken: string = await new Promise((resolve, reject) => {
            oauth2Client.getAccessToken((err, token) => {
                if (err) {
                    reject('Failed to create access token');
                }
                resolve(token);
            });
        })

        const config: Options = {
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: this.configService.get('EMAIL'),
                clientId: this.configService.get('CLIENT_ID'),
                clientSecret: this.configService.get('CLIENT_SECRET'),
                accessToken,
                // refreshToken:process.env.REFRESH_TOKEN
            },
        };
        this.mailerService.addTransporter('gmail', config);
     }catch(err) {
        log("send mail err ",err)
     }
    }

    public async sendMail(to:string) {
        await this.setTransport();
        this.mailerService
            .sendMail({
                transporterName: 'gmail',
                to, // list of receivers
                from: process.env.EMAIL, // sender address
                subject: 'Verficiaction Code', // Subject line
                template: 'action',
                context: {
                    // Data to bef sent to template engine..
                    code: '38320',
                },
            })
            .then((success) => {
                log(success);
            })
            .catch((err) => {
                log(err);
            });
    }
}
