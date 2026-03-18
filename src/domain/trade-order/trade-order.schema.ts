import { z } from 'zod';
import { OrderSide, OrderStatus, OrderType } from '@prisma/client';
import { PAGINATION_DEFAULTS } from '../../common/pagination';
import { SUPPORTED_PAIRS } from './trade-order.constants';

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
  pair: z.string().toUpperCase().pipe(z.enum(SUPPORTED_PAIRS)),
});

export const updateTradeOrderSchema = z
  .object({
    side: z.nativeEnum(OrderSide).optional(),
    type: z.nativeEnum(OrderType).optional(),
    amount: decimalPrecision(AMOUNT_DECIMALS).optional(),
    price: decimalPrecision(PRICE_DECIMALS).optional(),
    status: z.nativeEnum(OrderStatus).optional(),
    pair: z.string().toUpperCase().pipe(z.enum(SUPPORTED_PAIRS)).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });

export const findAllTradeOrdersSchema = z.object({
  page: z.coerce.number().int().positive().optional().default(PAGINATION_DEFAULTS.PAGE),
  limit: z.coerce.number().int().positive().optional().default(PAGINATION_DEFAULTS.LIMIT),
});

export type CreateTradeOrderInput = z.infer<typeof createTradeOrderSchema>;
export type UpdateTradeOrderInput = z.infer<typeof updateTradeOrderSchema>;
export type FindAllTradeOrdersQuery = z.infer<typeof findAllTradeOrdersSchema>;
