import { OrderSide, OrderStatus, OrderType } from '@prisma/client';

export type { OrderSide, OrderStatus, OrderType };

export interface TradeOrder {
  id: string;
  side: OrderSide;
  type: OrderType;
  amount: string;
  price: string;
  status: OrderStatus;
  pair: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTradeOrderDto {
  side: OrderSide;
  type: OrderType;
  amount: number;
  price: number;
  status?: OrderStatus;
  pair: string;
}

export interface UpdateTradeOrderDto {
  status?: OrderStatus;
}
