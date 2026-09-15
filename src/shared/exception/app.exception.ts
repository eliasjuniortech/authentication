import { HttpException, HttpStatus } from "@nestjs/common";
import { ErroCode } from "./enum/error-code.enum";

export class AppException extends HttpException {
  constructor(errorCode: ErroCode, message: string, statusCode: HttpStatus) {
    super({ errorCode: errorCode, message: message, statusCode: statusCode }, statusCode);
  }
}
