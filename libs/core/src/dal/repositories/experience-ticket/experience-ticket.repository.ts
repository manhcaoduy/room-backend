import { BaseRepository } from '@app/core';

import { ExperienceTicketEntity } from './experience-ticket.entity';
import { ExperienceTicket } from './experience-ticket.schema';

export class ExperienceTicketRepository extends BaseRepository<ExperienceTicketEntity> {
  constructor() {
    super(ExperienceTicket, ExperienceTicketEntity);
  }

  async findById(ticketId: string): Promise<ExperienceTicketEntity> {
    return this.findOne({
      _id: ticketId,
    });
  }

  async findByUserAndExperience(
    userId: string,
    experienceId: string,
  ): Promise<ExperienceTicketEntity> {
    const tickets = await this.find({
      userId: userId,
      experienceId: experienceId,
    });
    if (tickets.length > 0) {
      return tickets[0];
    }
    return null;
  }

  async findByWalletAddress(
    walletAddress: string,
  ): Promise<ExperienceTicketEntity | null> {
    return await this.findOne({
      walletAddress,
    });
  }

  async createExperienceTicket(
    userId: string,
    experienceId: string,
    walletAddress: string,
    walletPrivateKey: string,
    ticketPrice: string,
  ): Promise<ExperienceTicketEntity> {
    const experienceTicket: Partial<ExperienceTicketEntity> = {
      userId,
      experienceId,
      walletAddress,
      walletPrivateKey,
      ticketPrice,
    };
    return this.create(experienceTicket);
  }

  async updateTicketById(
    ticketId: string,
    amount: number,
    txHash: string,
  ): Promise<ExperienceTicketEntity> {
    return this.findOneAndUpdate(
      { _id: ticketId },
      {
        $inc: {
          transactionAmount: amount,
        },
        $push: { transactionHashes: txHash },
      },
    );
  }
}
