import { BadRequestException, Injectable } from '@nestjs/common';
import { GetDto } from './static/commission.dto';
import * as rp from 'request-promise-native';
import { ResponseSerializer } from './static/commission.serializer';
import { DateTime } from 'luxon';
import { Currency } from './static/commission.enum';

const TRANSACTIONS_HISTORY = {};

@Injectable()
export class CommissionService {
  async getComissionPrice(dto: GetDto): Promise<ResponseSerializer> {
    const MIN_PRICE = 0.05;
    const DISCOUNTED_PRICE = '0.04';
    const DEFAULT_PRICE_IN_PERCENTS = 0.5;
    const UNIQUE_DISCOUNT_PRICE = '0.05';
    const UNIQUE_DISCOUNT_CLIENT_ID = 42;
    let amount: number;
    let commissionPrice: string;

    if (dto.currency !== Currency.EUR) {
      const ratesStringResponse: string = await rp(
        'https://api.exchangerate.host/latest',
      );

      const parsedRates: {
        motd: any;
        success: boolean;
        base: string;
        date: string;
        rates: { [currencyName: string]: number };
      } = JSON.parse(ratesStringResponse);

      const rate = parsedRates.rates[dto.currency];

      if (!rate) throw new BadRequestException();

      amount = Number(dto.amount) / rate;
    } else amount = Number(dto.amount);

    const TRANSACTIONS_HISTORY_KEY = `${dto.client_id}_${DateTime.fromJSDate(
      new Date(dto.date),
    ).get('year')}_${DateTime.fromJSDate(new Date(dto.date)).get('month')}`;

    TRANSACTIONS_HISTORY[TRANSACTIONS_HISTORY_KEY] =
      TRANSACTIONS_HISTORY[TRANSACTIONS_HISTORY_KEY] || 0;

    if (TRANSACTIONS_HISTORY[TRANSACTIONS_HISTORY_KEY] >= 1000)
      commissionPrice = DISCOUNTED_PRICE;
    else if (dto.client_id === UNIQUE_DISCOUNT_CLIENT_ID)
      commissionPrice = UNIQUE_DISCOUNT_PRICE;
    else {
      const price = (amount / 100) * DEFAULT_PRICE_IN_PERCENTS;

      commissionPrice =
        price < MIN_PRICE ? MIN_PRICE.toString() : price.toFixed(2);
    }

    TRANSACTIONS_HISTORY[TRANSACTIONS_HISTORY_KEY] += amount;

    return { amount: commissionPrice, currency: Currency.EUR };
  }
}
