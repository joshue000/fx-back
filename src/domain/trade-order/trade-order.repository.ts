import { CreateTradeOrderDto, TradeOrder } from './trade-order.types';

export interface TradeOrderRepository {
  create(dto: CreateTradeOrderDto): Promise<TradeOrder>;
  findAll(): Promise<TradeOrder[]>;
}
