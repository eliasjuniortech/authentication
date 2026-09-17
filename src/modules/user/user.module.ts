import { Module } from "@nestjs/common";
import { InfrastructureModule } from "../../infrastructure/infrastructure.module";
import { UploadModule } from "../upload/upload.module";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
  imports: [InfrastructureModule, UploadModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
