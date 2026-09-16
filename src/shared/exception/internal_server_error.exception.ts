import { HttpStatus } from "@nestjs/common";
import { AppException } from "./app.exception";
import { ErroCode } from "./enum/error-code.enum";

export class InternalServerErrorException extends AppException {
  constructor(message?: string) {
    super(ErroCode.INTERNAL_SERVER_ERROR, message ?? "Ocorreu um erro interno. Tente novamente mais tarde.", HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
