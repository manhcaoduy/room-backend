import { Injectable } from '@nestjs/common';
import slugify from 'slugify';
import {
  NumberDictionary,
  adjectives,
  animals,
  colors,
  uniqueNamesGenerator,
} from 'unique-names-generator';

import { caseInsensitiveOption } from '@app/core/dal/repositories/schema-default.options';
import {
  GrpcAlreadyExistException,
  GrpcNotFoundException,
} from '@app/core/framework/exceptions/grpc-exception';
import { getUsernameFromEmail } from '@app/core/utils/email.utils';
import { LoggerFactoryService } from '@app/core/utils/logger/logger-factory.service';
import { LoggerService } from '@app/core/utils/logger/logger.service';

import { USER_EXCEPTION_CODES } from '@app/microservice/exceptions/user.exception';
import { UserEntity, UserRepository } from '../shared/repositories/user';
import { UserProfile } from '@app/microservice/proto/shared/user/v1/user';

@Injectable()
export class UserService {
  private logger: LoggerService;

  constructor(
    private userRepository: UserRepository,
    private readonly loggerFactory: LoggerFactoryService,
  ) {
    this.logger = loggerFactory.createLogger(UserService.name);
  }

  async isUsernameAvailable(username: string): Promise<boolean> {
    const exist = await this.userRepository.count(
      { username },
      { ...caseInsensitiveOption },
    );
    return !exist;
  }

  async getUniqueUsernameFromEmail(
    email: string,
  ): Promise<{ fullName: string; username: string }> {
    const emailUsername = getUsernameFromEmail(email);
    if (!emailUsername) {
      this.logger.error(`can not get email user name from email ${email}`);
      return this.getUniqueUsername();
    }
    const originUsername = slugify(emailUsername);
    let username = originUsername;
    let index = 0;
    let exist = 0;

    do {
      if (index > 0) {
        username = `${originUsername}-${index}`;
      }
      exist = await this.userRepository.count({ username });
      index++;
    } while (exist > 0);

    return { fullName: username, username };
  }

  async getUniqueUsername(): Promise<{ fullName: string; username: string }> {
    let fullName = '';
    let username = '';
    let exist: number;
    do {
      const numberDictionary = NumberDictionary.generate({
        min: 100,
        max: 9999,
      });
      fullName = uniqueNamesGenerator({
        dictionaries: [colors, adjectives, animals, numberDictionary],
        length: 2,
        separator: '',
        style: 'capital',
      });
      username = slugify(fullName);
      exist = await this.userRepository.count({ username });
    } while (exist > 0);

    return { fullName, username };
  }

  async getOrCreateUserByEmail(
    email: string,
  ): Promise<{ user: UserEntity; isNewUser: boolean }> {
    let user = await this.userRepository.findOne({ email });
    let isNewUser = false;
    if (!user) {
      isNewUser = true;
      const { username, fullName } = await this.getUniqueUsernameFromEmail(
        email,
      );
      // create user, save it to repo
      user = new UserEntity();
      user.username = username;
      user.fullName = fullName;
      user.email = email;

      user = await this.userRepository.create(user);
    }

    return { user, isNewUser };
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
