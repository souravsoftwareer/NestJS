import { IsEmail, IsOptional } from "class-validator";

export class MailBodyDTO {
 
  @IsOptional()
  @IsEmail()
  email: string;
}