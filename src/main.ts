import { BadRequestException, HttpStatus, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import cookieParser from "cookie-parser";
import { AppModule } from "./app.module";

import "express";
import "multer";

const config = new ConfigService();

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,

      exceptionFactory: (errors) => {
        const formattedErrors = errors.map(function (error) {
          return {
            filed: error.property,
            messages: Object.values(error.constraints ?? {}),
          };
        });

        return new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: "Erro de validação.",
          formattedErrors: formattedErrors,
        });
      },
    }),
  );
  app.use(cookieParser());

  await app.listen(config.get<number>("PORT") ?? 3000, "0.0.0.0");
}
bootstrap();
