import { Injectable } from "@nestjs/common";
import * as bcrypt from "bcrypt";
import { randomUUID } from "crypto";
import { EmailAlreadyExistsException } from "../../shared/exception/email-already-exists.exception";
import { PrismaService } from "../prisma/prisma.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { ResponseUserDto } from "./dto/response-user.dto";

@Injectable()
export class UserService {
  private readonly prisma: PrismaService;

  constructor(prisma: PrismaService) {
    this.prisma = prisma;
  }

  async registerUser(data: CreateUserDto): Promise<ResponseUserDto> {
    const userExists = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (userExists) throw new EmailAlreadyExistsException();

    const id = randomUUID();
    const hash = await bcrypt.hash(data.password, await bcrypt.genSalt());

    const user = await this.prisma.user.create({
      data: {
        id: id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: hash,
      },
    });
    return new ResponseUserDto(user.id, user.firstName, user.lastName, user.email, user.imagePath, user.createdAt, user.updatedAt);
  }
}
