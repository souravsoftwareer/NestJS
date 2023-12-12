import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class UserBodyDTO {
  
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}