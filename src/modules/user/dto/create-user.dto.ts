import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, Matches, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
  @IsString({ message: "O nome deve ser um texto." })
  @IsNotEmpty({ message: "Informe seu nome." })
  @MinLength(3, { message: "O nome é muito curto." })
  @MaxLength(50, { message: "O nome é muito longo." })
  @Matches(/^[\p{L}\s]+$/u, { message: "O nome contém caracteres inválidos." })
  @Transform(({ value }) => value.trim())
  firstName: string;

  @IsString({ message: "O sobrenome deve ser um texto." })
  @IsNotEmpty({ message: "Informe seu sobrenome." })
  @MinLength(3, { message: "O sobrenome é muito curto." })
  @MaxLength(50, { message: "O sobrenome é muito longo." })
  @Matches(/^[\p{L}\s]+$/u, { message: "O sobrenome contém caracteres inválidos." })
  @Transform(({ value }) => value.trim())
  lastName: string;

  @IsEmail({ allow_utf8_local_part: false, require_tld: true, allow_ip_domain: false, allow_underscores: false, ignore_max_length: false }, { message: "Informe um e-mail válido." })
  @IsNotEmpty({ message: "Informe seu e-mail." })
  @Transform(({ value }) => value?.trim())
  email: string;

  @IsString({ message: "A senha deve ser um texto." })
  @IsNotEmpty({ message: "Informe sua senha." })
  @IsStrongPassword({ minLength: 8, minLowercase: 1, minNumbers: 1, minSymbols: 1, minUppercase: 1 }, { message: "A senha é muito fraca." })
  @MaxLength(64, { message: "A senha é muito longa." })
  @Matches(/^[a-zA-Z0-9!@#$%&?.]+$/, { message: "A senha contém caracteres inválidos." })
  password: string;
}
