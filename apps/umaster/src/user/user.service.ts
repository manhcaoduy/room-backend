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
  UserProfile,
  WalletNetwork,
} from '@app/microservice/proto/shared/user/v1/user';
import { WalletEntity, WalletRepository } from '../shared/repositories/wallet';
import { randU32Sync } from '../shared/utils/random.util';
import * as sigUtil from 'eth-sig-util';
import * as ethUtil from 'ethereumjs-util';

@Injectable()
export class UserService {
  private logger: LoggerService;

  constructor(
    private userRepository: UserRepository,
    private walletRepository: WalletRepository,
    private readonly loggerFactory: LoggerFactoryService,
  ) {
    this.logger = loggerFactory.createLogger(UserService.name);
  }

  async createUserByEmail(req: {
    email: string;
    password: string;
    username: string;
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
    network: WalletNetwork,
  ): Promise<{ message: string }> {
    const user = await this.getUserById(userId);
    const wallet = await this.walletRepository.getOrCreate({
      address: walletAddress,
      network,
    });
    if (wallet.isVerified && wallet.isOwned && wallet.userId !== user.id) {
      throw new GrpcPermissionDeniedException(
        `Wallet address is existed & owned by another user`,
        {
          metadata: {
            walletAddress,
            walletUserId: wallet.userId,
            userId: user.id,
          },
        },
      );
    }

    const userWallet = new WalletEntity({
      network,
      address: walletAddress,
      isOwned: true,
      userId,
      isVerified: false,
      nonce: `${randU32Sync()}`,
    });

    await this.walletRepository.update(wallet, userWallet);
    return { message: this.getNonceMessage(userWallet.nonce) };
  }

  async connectWalletAddress(
    userId: string,
    walletAddress: string,
    network: WalletNetwork,
    signature: string,
  ): Promise<WalletEntity> {
    const wallet = await this.walletRepository.findOne({
      address: walletAddress,
      network,
    });
    if (!wallet) {
      throw new GrpcNotFoundException('Wallet is not found', {
        code: USER_EXCEPTION_CODES.WALLET_NOT_FOUND,
      });
    }

    if (!wallet.isOwned) {
      throw new GrpcNotFoundException('User wallet is not owned by any user', {
        code: USER_EXCEPTION_CODES.WALLET_NOT_OWNED,
      });
    }

    if (wallet.userId !== userId) {
      throw new GrpcPermissionDeniedException(
        `Wallet address is owned by another user`,
        {
          metadata: {
            walletAddress,
          },
        },
      );
    }

    const msg = this.getNonceMessage(wallet.nonce);

    switch (wallet.network) {
      case WalletNetwork.EVM: {
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

    const updatedWallet = await this.walletRepository.updateOneAndReturn(
      { _id: wallet.id },
      { nonce: `${randU32Sync()}`, isVerified: true },
    );
    return updatedWallet;
  }

  async disconnectWalletAddress(
    userId: string,
    walletAddress: string,
    network: WalletNetwork,
  ): Promise<WalletEntity> {
    const wallet = await this.walletRepository.findOne({
      address: walletAddress,
      network,
    });
    if (!wallet) {
      throw new GrpcNotFoundException('User wallet is not found', {
        code: USER_EXCEPTION_CODES.USER_NOT_FOUND,
      });
    }

    if (!wallet.isOwned) {
      throw new GrpcNotFoundException('User wallet is not owned by any user', {
        code: USER_EXCEPTION_CODES.WALLET_NOT_OWNED,
      });
    }

    if (wallet.userId !== userId) {
      throw new GrpcPermissionDeniedException(
        `Wallet address is owned by another user`,
        {
          metadata: {
            walletAddress,
          },
        },
      );
    }

    const updatedWallet = await this.walletRepository.updateOneAndReturn(
      { _id: wallet.id },
      {
        nonce: `${randU32Sync()}`,
        isVerified: true,
        isOwned: false,
        userId: '',
      },
    );
    return updatedWallet;
  }

  async getWallets(userId: string): Promise<{ userWallets: WalletEntity[] }> {
    const userWallets = await this.walletRepository.find({
      isOwned: true,
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
