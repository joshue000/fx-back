import { PaginatedResponse, PaginationQuery } from '../../common/pagination';
import { UpdateTradeOrderInput } from './trade-order.schema';
import { CreateTradeOrderDto, TradeOrder } from './trade-order.types';

export interface TradeOrderRepository {
  create(dto: CreateTradeOrderDto): Promise<TradeOrder>;
  findAll(query: PaginationQuery): Promise<PaginatedResponse<TradeOrder>>;
  findById(id: string): Promise<TradeOrder | null>;
  update(id: string, dto: UpdateTradeOrderInput): Promise<TradeOrder>;
  softDelete(id: string): Promise<void>;
}
