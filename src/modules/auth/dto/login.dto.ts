import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
  @IsEmail({ allow_utf8_local_part: false, require_tld: true, allow_ip_domain: false, allow_underscores: false, ignore_max_length: false }, { message: "Informe um e-mail válido." })
  @IsNotEmpty({ message: "Informe seu e-mail." })
  email: string;

  @IsString({ message: "A senha deve ser um texto." })
  @IsNotEmpty({ message: "Informe sua senha." })
  password: string;
}
