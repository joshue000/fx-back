import { PaginatedResponse, PaginationQuery } from '../../common/pagination';
import { CreateTradeOrderDto, TradeOrder } from './trade-order.types';

export interface TradeOrderRepository {
  create(dto: CreateTradeOrderDto): Promise<TradeOrder>;
  findAll(query: PaginationQuery): Promise<PaginatedResponse<TradeOrder>>;
}
