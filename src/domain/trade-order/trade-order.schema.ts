import { z } from 'zod';
import { OrderSide, OrderStatus, OrderType } from '@prisma/client';

const AMOUNT_DECIMALS = 2;
const PRICE_DECIMALS = 5;

const decimalPrecision = (maxDecimals: number) =>
  z
    .number()
    .positive()
    .refine(
      (val) => {
        const decimals = val.toString().split('.')[1];
        return !decimals || decimals.length <= maxDecimals;
      },
      { message: `Maximum ${maxDecimals} decimal places allowed` },
    );

export const createTradeOrderSchema = z.object({
  side: z.nativeEnum(OrderSide),
  type: z.nativeEnum(OrderType),
  amount: decimalPrecision(AMOUNT_DECIMALS),
  price: decimalPrecision(PRICE_DECIMALS),
  status: z.nativeEnum(OrderStatus).optional().default(OrderStatus.open),
  pair: z.string().min(1).toUpperCase(),
});

export const updateTradeOrderSchema = z.object({
  status: z.nativeEnum(OrderStatus),
});

export type CreateTradeOrderInput = z.infer<typeof createTradeOrderSchema>;
export type UpdateTradeOrderInput = z.infer<typeof updateTradeOrderSchema>;
