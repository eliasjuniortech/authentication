import { Body, Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { CreateUserDto } from "./dto/create-user.dto";
import { ResponseUserDto } from "./dto/response-user.dto";
import { UserService } from "./user.service";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseInterceptors(FileInterceptor("file"))
  async registerUser(@Body() createUserDto: CreateUserDto, @UploadedFile() file?: Express.Multer.File): Promise<ResponseUserDto> {
    return await this.userService.registerUser(createUserDto, file);
  }
}
