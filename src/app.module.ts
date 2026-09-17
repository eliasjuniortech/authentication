import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { InfrastructureModule } from "./infrastructure/infrastructure.module";
import { AuthModule } from "./modules/auth/auth.module";
import { UploadModule } from "./modules/upload/upload.module";
import { UserModule } from "./modules/user/user.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    UploadModule,
    AuthModule,
    InfrastructureModule,
  ],
})
export class AppModule {}
