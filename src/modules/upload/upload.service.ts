import { Injectable } from "@nestjs/common";
import { InternalServerErrorException } from "../../shared/exception/internal_server_error.exception";
import { SupabaseService } from "./supabase/supabase.service";

@Injectable()
export class UploadService {
  private readonly supabse: SupabaseService;

  constructor(supabase: SupabaseService) {
    this.supabse = supabase;
  }

  async uploadService(id: string, file: Express.Multer.File): Promise<string> {
    const client = this.supabse.getClient();

    const extesion = file.originalname.split(".")[1];
    const path = `${id}/avatar.${extesion}`;

    const { error } = await client.storage.from("avatars").upload(path, file.buffer, {
      contentType: file.mimetype,
      cacheControl: "3600",
      upsert: true,
    });

    if (error) throw new InternalServerErrorException(error.message);
    return path;
  }
}
