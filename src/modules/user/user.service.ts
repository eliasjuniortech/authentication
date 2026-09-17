import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import { EmailAlreadyExistsException } from "../../shared/exception/email-already-exists.exception";
import { PrismaService } from "../../infrastructure/prisma.service";
import { UploadService } from "../upload/upload.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { ResponseUserDto } from "./dto/response-user.dto";

@Injectable()
export class UserService {
  private readonly prisma: PrismaService;
  private readonly upload: UploadService;

  constructor(prisma: PrismaService, upload: UploadService) {
    this.prisma = prisma;
    this.upload = upload;
  }

  async registerUser(data: CreateUserDto, file?: Express.Multer.File): Promise<ResponseUserDto> {
    const userExists = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (userExists) throw new EmailAlreadyExistsException();

    const id = randomUUID();
    const hash = await bcrypt.hash(data.password, await bcrypt.genSalt());

    const path = file ? await this.upload.save(id, file) : null;

    const user = await this.prisma.user.create({
      data: {
        id: id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: hash,
        imagePath: path,
      },
    });
    return new ResponseUserDto(user.id, user.firstName, user.lastName, user.email, user.imagePath, user.createdAt, user.updatedAt);
  }
}
