import { Test, TestingModule } from '@nestjs/testing';
import { CommissionService } from './commission.service';
import { Currency } from './static/commission.enum';
import { BadRequestException } from '@nestjs/common';
import { TO } from '../helpers/promise.helper';

describe('CommisionService', () => {
  let service: CommissionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommissionService],
    }).compile();

    service = module.get<CommissionService>(CommissionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getComissionPrice', () => {
    it(`if client_id equals 42 and transaction turnover per month is less then 1000, should return amount: 0.05 and currency: ${Currency.EUR}`, async () => {
      const result = await service.getComissionPrice({
        date: new Date('2030-05-02'),
        amount: '5000',
        currency: 'ZAR',
        client_id: 42,
      });

      expect(result.amount).toEqual('0.05');
      expect(result.currency).toEqual(Currency.EUR);
    });

    it(`if currency isn't ${Currency.EUR} and "exchangerate" API doesn't support provided currency, should throw Bad Request exception `, async () => {
      const [error] = await TO(
        service.getComissionPrice({
          date: new Date('2021-03-02'),
          amount: '5000',
          currency: 'ZR1',
          client_id: 1,
        }),
      );

      expect(error).toBeInstanceOf(BadRequestException);
    });
  });
});
