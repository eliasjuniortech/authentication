import { Module } from "@nestjs/common";
import { InfrastructureModule } from "../../infrastructure/infrastructure.module";
import { UploadService } from "./upload.service";

@Module({
  imports: [InfrastructureModule],
  providers: [UploadService],
  exports: [UploadService],
})
export class UploadModule {}
