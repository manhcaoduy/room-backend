import { Controller, UseFilters, UseInterceptors } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import {
  GrpcExceptionFilter,
  GrpcInternalException,
  GrpcNotFoundException,
} from '@app/core/framework/exceptions/grpc-exception';

import { USER_EXCEPTION_CODES } from '@app/microservice/exceptions/user.exception';
import { GrpcLoggingInterceptor } from '@app/microservice/grpc/grpc-logging/grpc-logging.interceptor';
import {
  FindByEmailRequest,
  FindByEmailResponse,
  FindByIdRequest,
  FindByIdResponse,
  FindByIdsRequest,
  FindByIdsResponse,
  FindByUsernameRequest,
  FindByUsernameResponse,
  GetOrCreateUserByEmailRequest,
  GetOrCreateUserByEmailResponse,
  USER_SERVICE_NAME,
  UpdateProfileRequest,
  UpdateProfileResponse,
} from '@app/microservice/proto/umaster/user/v1/user';

import { UserService } from './user.service';

@Controller()
@UseFilters(GrpcExceptionFilter)
@UseInterceptors(GrpcLoggingInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod(USER_SERVICE_NAME)
  async getOrCreateUserByEmail(
    req: GetOrCreateUserByEmailRequest,
  ): Promise<GetOrCreateUserByEmailResponse> {
    const { user, isNewUser } = await this.userService.getOrCreateUserByEmail(
      req.email,
    );
    if (!user) {
      throw new GrpcInternalException(`cannot process ${req.email}`, {
        code: USER_EXCEPTION_CODES.INTERNAL_EXCEPTION,
      });
    }
    return {
      user,
      isNewUser,
    };
  }

  @GrpcMethod(USER_SERVICE_NAME)
  async findById(req: FindByIdRequest): Promise<FindByIdResponse> {
    const user = await this.userService.getUserById(req.userId);
    return {
      user,
    };
  }

  @GrpcMethod(USER_SERVICE_NAME)
  async findByEmail(req: FindByEmailRequest): Promise<FindByEmailResponse> {
    const user = await this.userService.getUserByEmail(req.email);
    if (!user) {
      throw new GrpcNotFoundException(`email not found`, {
        code: USER_EXCEPTION_CODES.USER_NOT_FOUND,
        metadata: { email: req.email },
      });
    }
    return {
      user,
    };
  }

  @GrpcMethod(USER_SERVICE_NAME)
  async findByUsername(
    req: FindByUsernameRequest,
  ): Promise<FindByUsernameResponse> {
    const user = await this.userService.getUserByUsername(req.username);
    if (!user) {
      throw new GrpcNotFoundException(`username not found`, {
        code: USER_EXCEPTION_CODES.USER_NOT_FOUND,
        metadata: { username: req.username },
      });
    }
    return {
      user,
    };
  }

  @GrpcMethod(USER_SERVICE_NAME)
  async updateProfile(
    req: UpdateProfileRequest,
  ): Promise<UpdateProfileResponse> {
    const { userId, userProfile } = req;
    const user = await this.userService.updateProfile(userId, userProfile);
    return {
      user,
    };
  }

  @GrpcMethod(USER_SERVICE_NAME)
  async findByIds(req: FindByIdsRequest): Promise<FindByIdsResponse> {
    const users = await this.userService.getUserByIds(req.userIds);
    if (users.length !== req.userIds.length) {
      const notFoundUserIds = [];
      const foundUserIds = users.map((u) => u.id);
      req.userIds.forEach((userId) => {
        if (foundUserIds.indexOf(userId) === -1) {
          notFoundUserIds.push(userId);
        }
      });
      throw new GrpcNotFoundException(`users not found`, {
        code: USER_EXCEPTION_CODES.USER_NOT_FOUND,
        metadata: { notFoundUserIds },
      });
    }
    return {
      users,
    };
  }
}
