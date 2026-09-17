import { HttpStatus } from "@nestjs/common";
import { AppException } from "./app.exception";
import { ErroCode } from "./enum/error-code.enum";

export class TooManyRequestException extends AppException {
  constructor() {
    super(ErroCode.TOO_MANY_REQUESTS, "Muitas tentativas de login. Tente novamente mais tarde.", HttpStatus.TOO_MANY_REQUESTS);
  }
}
