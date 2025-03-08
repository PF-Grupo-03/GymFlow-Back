import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SendEmailDto {
  @IsEmail()
  to: string;

  @IsNotEmpty({})
  @IsString()
  subject: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsString()
  eventType?: string;
}
