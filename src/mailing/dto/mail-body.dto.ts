import { IsEmail, IsOptional, IsString } from "class-validator";

export class MailBodyDTO {
 

  @IsEmail()
  email: string;
}