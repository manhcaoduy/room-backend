import { Test, TestingModule } from '@nestjs/testing';

import { ExperienceTicketEntity } from '@app/core/dal/repositories/experience-ticket/experience-ticket.entity';
import { ExperienceTicketRepository } from '@app/core/dal/repositories/experience-ticket/experience-ticket.repository';
import { MockDalService, getMockDalService } from '@app/core/testing/utils';

describe('ExperienceTicketRepository.updateTicketById', () => {
  let repo: ExperienceTicketRepository;
  let mockDalService: MockDalService;

  beforeAll(async () => {
    mockDalService = await getMockDalService();
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [ExperienceTicketRepository],
    }).compile();
    await mockDalService.dalService.destroy();

    repo = module.get<ExperienceTicketRepository>(ExperienceTicketRepository);
  });

  afterAll(async () => {
    await mockDalService.close();
  });

  // const data: Array<Partial<IExperienceTicketDocument>> = [
  const data: Array<Partial<ExperienceTicketEntity>> = [
    // first ticket - index 0
    {
      transactionAmount: 0,
      transactionHashes: [],
    },
    // second ticket - index 1
    {
      transactionAmount: 100,
      transactionHashes: ['123', '456'],
    },
  ];

  const tests = [
    {
      name: 'should update for empty transaction',
      input: {
        ticketIndex: 0,
        amount: 123,
        txHash: '789',
      },
      expected: {
        transactionHashes: ['789'],
        transactionAmount: 123,
      },
    },
    {
      name: 'should update existing transaction',
      input: {
        ticketIndex: 1,
        amount: 123,
        txHash: '789',
      },
      expected: {
        transactionHashes: ['123', '456', '789'],
        transactionAmount: 223,
      },
    },
  ];

  tests.forEach((test) => {
    it(test.name, async () => {
      const createdTickets = await repo.createMany(data);
      const ids = createdTickets.map((ticket) => ticket.id);
      const actual = await repo.updateTicketById(
        ids[test.input.ticketIndex],
        test.input.amount,
        test.input.txHash,
      );
      expect(actual.transactionAmount).toBe(test.expected.transactionAmount);
      expect(actual.transactionHashes).toStrictEqual(
        test.expected.transactionHashes,
      );
    });
  });
});
