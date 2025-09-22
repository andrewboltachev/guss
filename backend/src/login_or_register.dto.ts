import { IsNotEmpty } from 'class-validator';

export class LoginOrRegisterDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}
