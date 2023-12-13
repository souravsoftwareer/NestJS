import { IsEmail, IsString } from "class-validator";

export class MailDTO {
 
  @IsEmail()
  email: string;
}