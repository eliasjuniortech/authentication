import { HttpStatus } from "@nestjs/common";
import { AppException } from "./app.exception";
import { ErroCode } from "./enum/error-code.enum";

export class UnauthorizedException extends AppException {
  constructor(message?: string) {
    super(ErroCode.UNAUTHORIZED, message ?? "Você não tem autorização para realizar esta ação.", HttpStatus.UNAUTHORIZED);
  }
}
