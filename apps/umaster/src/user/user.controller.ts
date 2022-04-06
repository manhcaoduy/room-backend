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
  CreateUserRequest,
  CreateUserResponse,
  USER_SERVICE_NAME,
  UpdateProfileRequest,
  UpdateProfileResponse,
  GenerateNonceMessageRequest,
  GenerateNonceMessageResponse,
  ConnectWalletAddressRequest,
  ConnectWalletAddressResponse,
  DisconnectWalletAddressRequest,
  DisconnectWalletAddressResponse,
  GetWalletsRequest,
  GetWalletsResponse,
} from '@app/microservice/proto/umaster/user/v1/user';

import { UserService } from './user.service';

@Controller()
@UseFilters(GrpcExceptionFilter)
@UseInterceptors(GrpcLoggingInterceptor)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @GrpcMethod(USER_SERVICE_NAME)
  async createUser(req: CreateUserRequest): Promise<CreateUserResponse> {
    const { user } = await this.userService.createUserByEmail(req);
    if (!user) {
      throw new GrpcInternalException(`cannot process ${req.email}`, {
        code: USER_EXCEPTION_CODES.INTERNAL_EXCEPTION,
      });
    }
    return {
      user,
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
    return {
      user,
    };
  }

  @GrpcMethod(USER_SERVICE_NAME)
  async findByUsername(
    req: FindByUsernameRequest,
  ): Promise<FindByUsernameResponse> {
    const user = await this.userService.getUserByUsername(req.username);
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

  @GrpcMethod(USER_SERVICE_NAME)
  async generateNonceMessage(
    req: GenerateNonceMessageRequest,
  ): Promise<GenerateNonceMessageResponse> {
    const { message } = await this.userService.generateNonceMessage(
      req.userId,
      req.walletAddress,
      req.type,
    );
    return {
      message,
    };
  }

  @GrpcMethod(USER_SERVICE_NAME)
  async connectWalletAddress(
    req: ConnectWalletAddressRequest,
  ): Promise<ConnectWalletAddressResponse> {
    const { userWallet } = await this.userService.connectWalletAddress(
      req.userId,
      req.walletAddress,
      req.type,
      req.signature,
    );
    return {
      userWallet,
    };
  }

  @GrpcMethod(USER_SERVICE_NAME)
  async disconnectWalletAddress(
    req: DisconnectWalletAddressRequest,
  ): Promise<DisconnectWalletAddressResponse> {
    const { result } = await this.userService.disconnectWalletAddress(
      req.userId,
      req.walletAddress,
      req.type,
    );
    return {
      result,
    };
  }

  @GrpcMethod(USER_SERVICE_NAME)
  async getWallets(req: GetWalletsRequest): Promise<GetWalletsResponse> {
    const { userWallets } = await this.userService.getWallets(req.userId);
    return {
      userWallets,
    };
  }
}
