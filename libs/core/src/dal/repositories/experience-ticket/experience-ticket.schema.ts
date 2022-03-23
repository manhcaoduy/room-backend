import * as mongoose from 'mongoose';
import { Document, Schema } from 'mongoose';

import { defaultSchemaOptions } from '@app/core/dal/repositories/schema-default.options';

import { ExperienceTicketEntity } from './experience-ticket.entity';

const experienceTicketSchema = new Schema(
  {
    experienceId: {
      type: Schema.Types.String,
      ref: 'Experience',
      index: true,
    },
    userId: {
      type: Schema.Types.String,
      ref: 'User',
      index: true,
    },
    walletAddress: {
      type: Schema.Types.String,
      index: true,
    },
    walletPrivateKey: Schema.Types.String,
    transactionHashes: {
      type: [Schema.Types.String],
      default: [],
    },
    ticketPrice: Schema.Types.String,
    transactionAmount: {
      type: Schema.Types.Number,
      default: 0,
    },
  },
  {
    ...defaultSchemaOptions,
    collection: 'experience_tickets',
  },
);

export interface IExperienceTicketDocument
  extends ExperienceTicketEntity,
    Document {
  id: string;
}

export const ExperienceTicket =
  mongoose.models.ExperienceTicket ||
  mongoose.model<IExperienceTicketDocument>(
    'ExperienceTicket',
    experienceTicketSchema,
  );
