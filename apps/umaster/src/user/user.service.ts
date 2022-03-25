import { Injectable } from '@nestjs/common';

import {
  GrpcAlreadyExistException,
  GrpcNotFoundException,
} from '@app/core/framework/exceptions/grpc-exception';
import { LoggerFactoryService } from '@app/core/utils/logger/logger-factory.service';
import { LoggerService } from '@app/core/utils/logger/logger.service';

import { USER_EXCEPTION_CODES } from '@app/microservice/exceptions/user.exception';
import { UserEntity, UserRepository } from '../shared/repositories/user';
import {
  UserGender,
  UserProfile,
} from '@app/microservice/proto/shared/user/v1/user';

@Injectable()
export class UserService {
  private logger: LoggerService;

  constructor(
    private userRepository: UserRepository,
    private readonly loggerFactory: LoggerFactoryService,
  ) {
    this.logger = loggerFactory.createLogger(UserService.name);
  }

  async createUserByEmail(req: {
    email: string;
    password: string;
    username: string;
    gender: UserGender;
  }): Promise<{ user: UserEntity }> {
    let user = await this.userRepository.findOne({ email: req.email });
    if (user) {
      throw new GrpcAlreadyExistException(`user already exisited`, {
        code: USER_EXCEPTION_CODES.USER_ALREADY_EXISTED,
        metadata: { email: req.email },
      });
    }

    user = new UserEntity();
    user.email = req.email;
    user.password = req.password;
    user.username = req.username;
    user.gender = req.gender;
    user = await this.userRepository.create(user);

    return { user };
  }

  async getUserById(userId: string): Promise<UserEntity> {
    const user = await this.userRepository.findByObjectId(userId);
    if (!user) {
      throw new GrpcNotFoundException(`user not found`, {
        code: USER_EXCEPTION_CODES.USER_NOT_FOUND,
        metadata: { userId },
      });
    }
    return user;
  }

  async getUserByEmail(email: string): Promise<UserEntity> {
    return await this.userRepository.findOne({ email });
  }

  async getUserByWalletAddress(walletAddress: string): Promise<UserEntity> {
    return await this.userRepository.findOne({ walletAddress });
  }

  async getUserByUsername(username: string): Promise<UserEntity> {
    return await this.userRepository.findOne({ username });
  }

  async getUserByIds(userIds: string[]): Promise<UserEntity[]> {
    return await this.userRepository.find({ _id: { $in: userIds } });
  }

  async updateProfile(userId: string, body: UserProfile): Promise<UserEntity> {
    try {
      return await this.userRepository.updateOneAndReturn(
        { _id: userId },
        body,
      );
    } catch (err) {
      if (err?.code === 11000 && err?.keyPattern?.username) {
        throw new GrpcAlreadyExistException(`username already taken`, {
          code: USER_EXCEPTION_CODES.USERNAME_TAKEN,
          metadata: { username: body?.username },
        });
      }
      throw err;
    }
  }
}
