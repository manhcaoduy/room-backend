import { Injectable } from '@nestjs/common';

import {
  GrpcAlreadyExistException,
  GrpcInvalidArgumentException,
  GrpcNotFoundException,
  GrpcPermissionDeniedException,
} from '@app/core/framework/exceptions/grpc-exception';
import { LoggerFactoryService } from '@app/core/utils/logger/logger-factory.service';
import { LoggerService } from '@app/core/utils/logger/logger.service';

import { USER_EXCEPTION_CODES } from '@app/microservice/exceptions/user.exception';
import { UserEntity, UserRepository } from '../shared/repositories/user';
import {
  UserGender,
  UserProfile,
  UserWalletType,
} from '@app/microservice/proto/shared/user/v1/user';
import {
  UserWalletEntity,
  UserWalletRepository,
} from '../shared/repositories/user-wallet';
import { randU32Sync } from '../shared/utils/random.util';
import * as sigUtil from 'eth-sig-util';
import * as ethUtil from 'ethereumjs-util';

@Injectable()
export class UserService {
  private logger: LoggerService;

  constructor(
    private userRepository: UserRepository,
    private userWalletRepository: UserWalletRepository,
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

  async generateNonceMessage(
    userId: string,
    walletAddress: string,
    type: UserWalletType,
  ): Promise<{ message: string }> {
    const user = await this.getUserById(userId);
    let userWallet = await this.userWalletRepository.findOne({
      address: walletAddress,
      type,
    });
    if (userWallet) {
      if (userWallet.isVerified && userWallet.userId !== user.id) {
        throw new GrpcPermissionDeniedException(
          `Wallet address is existed & owned by another user`,
          {
            metadata: {
              walletAddress,
              walletUserId: userWallet.userId,
              userId: user.id,
            },
          },
        );
      }

      const nonce = `${randU32Sync()}`;

      await this.userWalletRepository.update(
        { _id: userWallet.id },
        { nonce, isVerified: false, userId },
      );

      return { message: this.getNonceMessage(nonce) };
    }

    userWallet = new UserWalletEntity({
      userId,
      type,
      address: walletAddress,
      nonce: `${randU32Sync()}`,
    });

    userWallet = await this.userWalletRepository.create(userWallet);

    return { message: this.getNonceMessage(userWallet.nonce) };
  }

  async connectWalletAddress(
    userId: string,
    walletAddress: string,
    type: UserWalletType,
    signature: string,
  ): Promise<{ userWallet: UserWalletEntity; user: UserEntity }> {
    const user = await this.getUserById(userId);
    const userWallet = await this.userWalletRepository.findOne({
      address: walletAddress,
      type,
    });
    if (!userWallet) {
      throw new GrpcNotFoundException('User wallet is not found', {
        code: USER_EXCEPTION_CODES.USER_NOT_FOUND,
      });
    }

    if (userWallet.userId !== user.id) {
      throw new GrpcPermissionDeniedException(
        `Wallet address is owned by another user`,
        {
          metadata: {
            walletAddress,
          },
        },
      );
    }

    const msg = this.getNonceMessage(userWallet.nonce);

    switch (userWallet.type) {
      case UserWalletType.EVM: {
        if (!this.verifyEthereumSignature(walletAddress, signature, msg)) {
          throw new GrpcInvalidArgumentException(
            'Provided signature does not match',
            {
              code: USER_EXCEPTION_CODES.SIGNATURE_NOT_MATCH,
              metadata: {
                walletAddress,
                signature,
              },
            },
          );
        }
        break;
      }

      default: {
        throw new GrpcInvalidArgumentException('Wallet type is not supported', {
          code: USER_EXCEPTION_CODES.WALLET_TYPE_NOT_SUPPORT,
        });
      }
    }

    await this.userWalletRepository.update(
      { _id: userWallet.id },
      { nonce: `${randU32Sync()}`, isVerified: true },
    );
    // if (!hasVerifyStatus(user.verifyStatus, UserVerifyStatusType.Wallet)) {
    //   const verifyStatus = updateVerifyStatus(
    //     user.verifyStatus,
    //     UserVerifyStatusType.Wallet,
    //   );
    //   user = await this.userRepository.updateOneAndReturn(
    //     { _id: user.id },
    //     { verifyStatus },
    //   );
    // }
    return {
      userWallet,
      user,
    };
  }

  async disconnectWalletAddress(
    userId: string,
    walletAddress: string,
    type: UserWalletType,
  ): Promise<{ result: boolean }> {
    const user = await this.getUserById(userId);
    const userWallet = await this.userWalletRepository.findOne({
      address: walletAddress,
      type,
    });
    if (!userWallet) {
      throw new GrpcNotFoundException('User wallet is not found', {
        code: USER_EXCEPTION_CODES.USER_NOT_FOUND,
      });
    }

    if (userWallet.userId !== user.id) {
      throw new GrpcPermissionDeniedException(
        `Wallet address is owned by another user`,
        {
          metadata: {
            walletAddress,
          },
        },
      );
    }

    await this.userWalletRepository.delete({ _id: userWallet.id });

    return {
      result: true,
    };
  }

  async getWallets(
    userId: string,
  ): Promise<{ userWallets: UserWalletEntity[] }> {
    const userWallets = await this.userWalletRepository.find({
      userId,
      isVerified: true,
    });
    return { userWallets };
  }

  private verifyEthereumSignature(
    walletAddress: string,
    signature: string,
    msg: string,
  ): boolean {
    // We now are in possession of msg, publicAddress and signature. We
    // will use a helper from eth-sig-util to extract the address from the signature
    const msgBufferHex = ethUtil.bufferToHex(Buffer.from(msg, 'utf8'));
    const address = sigUtil.recoverPersonalSignature({
      data: msgBufferHex,
      sig: signature,
    });

    // The signature verification is successful if the address found with
    // sigUtil.recoverPersonalSignature matches the initial publicAddress
    return address.toLowerCase() === walletAddress.toLowerCase();
  }

  private getNonceMessage(nonce: string): string {
    return `One-time nonce: ${nonce}`;
  }
}
