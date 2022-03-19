import { Exclude, Expose, Type } from 'class-transformer';
import 'reflect-metadata';

@Exclude()
export class ExperienceTicketEntity {
  @Expose({ name: '_id' })
  id: string;

  @Expose()
  experienceId: string;

  @Expose()
  userId: string;

  @Expose()
  walletAddress: string;

  @Expose()
  walletPrivateKey: string;

  @Expose()
  ticketPrice: string;

  @Expose()
  transactionAmount: number;

  @Expose()
  transactionHashes: string[];

  @Expose()
  @Type(() => Date)
  createdAt: Date;

  @Expose()
  @Type(() => Date)
  updatedAt: Date;

  public constructor(init?: Partial<ExperienceTicketEntity>) {
    Object.assign(this, init);
  }
}
