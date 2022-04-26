import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { lastValueFrom } from 'rxjs';

import {
  GrpcAlreadyExistException,
  GrpcInvalidArgumentException,
  GrpcNotFoundException,
  GrpcUnauthenticatedException,
} from '@app/core/framework/exceptions/grpc-exception';

import { UMasterGrpcServiceUserService } from '@app/microservice/constants/microservice';
import { USER_EXCEPTION_CODES } from '@app/microservice/exceptions/user.exception';
import {
  JwtAccessTokenClaims,
  JwtRefreshTokenClaims,
} from '@app/microservice/http/jwt-auth/jwt-auth.interface';
import { UserServiceClient } from '@app/microservice/proto/umaster/user/v1/user';

import {
  EJwtTokenType,
  JwtTokenRepository,
} from '../shared/repositories/jwt-token';
import { ACCESS_TOKEN_EXPIRES, REFRESH_TOKEN_EXPIRES } from './auth.constant';
import { UserEntity } from '../../../umaster/src/shared/repositories/user';
import { RedisClient } from '@app/core/thirdparty/redis/redis.type';
import { REDIS_CLIENT } from '@app/core/thirdparty/redis/redis.provider';
import { AUTH_EXCEPTION_CODES } from '../shared/constants/exception.constant';

@Injectable()
export class AuthService {
  constructor(
    @Inject(UMasterGrpcServiceUserService)
    private readonly userClient: UserServiceClient,
    private jwtTokenRepository: JwtTokenRepository,
    private jwtService: JwtService,
    @Inject(REDIS_CLIENT) private readonly redisClient: RedisClient,
  ) {}

  decodeAccessToken(token: string): JwtAccessTokenClaims {
    const decoded = this.jwtService.decode(token);
    return decoded as JwtAccessTokenClaims;
  }

  decodeRefreshToken(token: string): JwtRefreshTokenClaims {
    const decoded = this.jwtService.decode(token);
    return decoded as JwtRefreshTokenClaims;
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { user } = await lastValueFrom(
      this.userClient.findByEmail({ email: email }),
    );
    if (!user) {
      throw new GrpcNotFoundException('user not found', {
        code: USER_EXCEPTION_CODES.USER_NOT_FOUND,
      });
    }
    if (user.password !== password) {
      throw new GrpcInvalidArgumentException('wrong password', {
        code: USER_EXCEPTION_CODES.WRONG_PASSWORD,
      });
    }
    const token = await this.genToken(user);
    return token;
  }

  async register(
    email: string,
    password: string,
    username: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const foundUser = await lastValueFrom(
      this.userClient.findByEmail({ email }),
    );
    if (foundUser.user) {
      throw new GrpcAlreadyExistException('user already existed', {
        code: USER_EXCEPTION_CODES.USER_ALREADY_EXISTED,
      });
    }
    const { user } = await lastValueFrom(
      this.userClient.createUser({ email, password, username }),
    );
    const token = await this.genToken(user);
    return token;
  }

  async validateToken(token: string): Promise<boolean> {
    const exist = await this.redisClient.get(
      this.getJwtBlacklistRedisKey(token),
    );
    if (exist) {
      throw new GrpcUnauthenticatedException('token is invalidate', {
        code: AUTH_EXCEPTION_CODES.INVALIDATE_TOKEN,
      });
    }
    try {
      const payload = this.jwtService.verify(token);
      if (payload) {
        return true;
      }
    } catch (e) {
      throw new GrpcUnauthenticatedException(e.message, {
        code: AUTH_EXCEPTION_CODES.INVALID_TOKEN,
      });
    }
    return false;
  }

  async createJwtAccessToken(
    userId: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const { user } = await lastValueFrom(this.userClient.findById({ userId }));
    if (!user) {
      throw new GrpcNotFoundException('user not found', {
        code: USER_EXCEPTION_CODES.USER_NOT_FOUND,
      });
    }
    const token = await this.genToken(user);
    return token;
  }

  async invalidateToken(token: string): Promise<boolean> {
    const decoded = this.jwtService.decode(token);
    const expire = decoded['exp'] * 1000 - Date.now();
    if (expire > 0) {
      await this.redisClient.set(
        this.getJwtBlacklistRedisKey(token),
        1,
        'ex',
        expire,
      );
    }
    return true;
  }

  private getJwtBlacklistRedisKey(token: string): string {
    return `jwt.blacklist:${token}`;
  }

  private async genToken(
    user: UserEntity,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload: Partial<JwtAccessTokenClaims> = {
      userId: user.id,
      email: user.email,
      username: user.username,
    };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: ACCESS_TOKEN_EXPIRES,
    });
    const refreshToken = this.jwtService.sign(
      { userId: user.id },
      {
        expiresIn: REFRESH_TOKEN_EXPIRES,
      },
    );
    await this.jwtTokenRepository.saveToken(
      user.id,
      accessToken,
      EJwtTokenType.AccessToken,
    );
    await this.jwtTokenRepository.saveToken(
      user.id,
      refreshToken,
      EJwtTokenType.RefreshToken,
    );

    return {
      accessToken,
      refreshToken,
    };
  }
}
