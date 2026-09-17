import { Injectable } from "@nestjs/common";
import { InternalServerErrorException } from "../../shared/exception/internal-server-error.exception";
import { SupabaseService } from "../../infrastructure/supabase.service";

@Injectable()
export class UploadService {
  private readonly supabse: SupabaseService;

  constructor(supabase: SupabaseService) {
    this.supabse = supabase;
  }

  async save(id: string, file: Express.Multer.File): Promise<string> {
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
