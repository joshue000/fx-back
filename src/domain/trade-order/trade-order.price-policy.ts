import { OrderSide, OrderType } from '@prisma/client';
import { BadRequestError } from '../../errors/AppError';
import { MARKET_PRICES } from './trade-order.constants';

interface PriceValidationInput {
  side: OrderSide;
  type: OrderType;
  price: number;
  pair: string;
}

export function validateOrderPrice({ side, type, price, pair }: PriceValidationInput): void {
  if (type === OrderType.market) return;

  const marketPrice = MARKET_PRICES[pair];

  if (type === OrderType.limit) {
    if (side === OrderSide.buy && price >= marketPrice) {
      throw new BadRequestError(
        `Buy limit order price must be lower than the current market price (${marketPrice})`,
      );
    }
    if (side === OrderSide.sell && price <= marketPrice) {
      throw new BadRequestError(
        `Sell limit order price must be higher than the current market price (${marketPrice})`,
      );
    }
  }

  if (type === OrderType.stop) {
    if (side === OrderSide.buy && price <= marketPrice) {
      throw new BadRequestError(
        `Buy stop order price must be higher than the current market price (${marketPrice})`,
      );
    }
    if (side === OrderSide.sell && price >= marketPrice) {
      throw new BadRequestError(
        `Sell stop order price must be lower than the current market price (${marketPrice})`,
      );
    }
  }
}
