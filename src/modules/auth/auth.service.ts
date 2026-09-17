import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../../infrastructure/prisma.service";
import { RedisService } from "../../infrastructure/redis.service";
import { TooManyRequestException } from "../../shared/exception/too-many-requests.exception";
import { UnauthorizedException } from "../../shared/exception/unauthorized.exception";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
  private readonly prisma: PrismaService;
  private readonly jwt: JwtService;
  private readonly config: ConfigService;
  private readonly redis: RedisService;

  private readonly ATTEMPTS = 5;
  private readonly EXPIRE_TIME = 60;
  private readonly BLOCK_TIME = 2 * 60;

  constructor(prisma: PrismaService, jwt: JwtService, config: ConfigService, redis: RedisService) {
    this.prisma = prisma;
    this.jwt = jwt;
    this.config = config;
    this.redis = redis;
  }

  async login(data: LoginDto, ip: string): Promise<{ accessToken: string; refreshToken: string }> {
    await this.checkRateLimitLogin(ip, data.email);

    const user = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (!user) {
      await this.registerRateLimitLogin(ip, data.email);

      throw new UnauthorizedException("Não foi possível realizar o login. Verifique seus dados e tente novamente.");
    }

    const passwordMatches = await bcrypt.compare(data.password, user.password);
    if (!passwordMatches) {
      await this.registerRateLimitLogin(ip, data.email);

      throw new UnauthorizedException("Não foi possível realizar o login. Verifique seus dados e tente novamente.");
    }

    await this.reset(ip, data.email);

    const accessToken = await this.generateAccessToken(user.id, user.email);
    const refreshToken = await this.generateRefreshToken(user.id, user.email);

    return { accessToken: accessToken, refreshToken: refreshToken };
  }

  async generateAccessToken(id: string, email: string): Promise<string> {
    const payload = { sub: id, email: email };

    return await this.jwt.signAsync(payload, {
      secret: this.config.get<string>("ACCESS_TOKEN_SECRET"),
      expiresIn: this.config.get<number>("ACCESS_TOKEN_EXPIRES_IN"),
    });
  }
  async generateRefreshToken(id: string, email: string): Promise<string> {
    const payload = { sub: id, email: email };

    return await this.jwt.signAsync(payload, {
      secret: this.config.get<string>("REFRESH_TOKEN_SECRET"),
      expiresIn: this.config.get<number>("REFRESH_TOKEN_EXPIRES_IN"),
    });
  }

  async checkRateLimitLogin(ip: string, email: string): Promise<void> {
    const key = `login:limit:${ip}:${email}`;
    const attempts = await this.redis.getClient().get(key);

    if (Number(attempts) > this.ATTEMPTS) {
      throw new TooManyRequestException();
    }
  }

  async registerRateLimitLogin(ip: string, email: string): Promise<void> {
    const key = `login:limit:${ip}:${email}`;
    const attempts = await this.redis.getClient().incr(key);

    if (attempts === 1) {
      await this.redis.getClient().expire(key, this.EXPIRE_TIME);
    }
    if (Number(attempts) > this.ATTEMPTS) {
      await this.redis.getClient().expire(key, this.BLOCK_TIME);

      throw new TooManyRequestException();
    }
  }

  private async reset(ip: string, email: string): Promise<void> {
    const key = `login:limit:${ip}:${email}`;

    await this.redis.getClient().del(key);
  }
}
