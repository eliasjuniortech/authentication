import { Body, Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { CreateUserDto } from "./dto/create-user.dto";
import { ResponseUserDto } from "./dto/response-user.dto";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
  private readonly user: UserService;

  constructor(user: UserService) {
    this.user = user;
  }

  @Post()
  @UseInterceptors(FileInterceptor("file"))
  async registerUser(@Body() data: CreateUserDto, @UploadedFile() file?: Express.Multer.File): Promise<ResponseUserDto> {
    return await this.user.registerUser(data, file);
  }
}
