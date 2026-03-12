import { IsEmail, IsOptional, IsString } from 'class-validator'

export class RegisterDto {
  @IsString()
  name: string

  @IsEmail()
  email: string

  @IsString()
  password: string

  @IsOptional()
  @IsString()
  preferences?: string

  @IsString()
  roleId: string
}
