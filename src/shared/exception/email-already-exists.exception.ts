import { HttpStatus } from "@nestjs/common";
import { AppException } from "./app.exception";
import { ErroCode } from "./enum/error-code.enum";

export class EmailAlreadyExistsException extends AppException {
  constructor() {
    super(ErroCode.EMAIL_ALREADY_EXISTS, "Este e-mail já está cadastrado.", HttpStatus.CONFLICT);
  }
}
