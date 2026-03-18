import { PaginatedResponse } from '../../common/pagination';
import { NotFoundError } from '../../errors/AppError';
import {
  CreateTradeOrderInput,
  FindAllTradeOrdersQuery,
  UpdateTradeOrderInput,
  TradeOrder,
  TradeOrderRepository,
} from '../../domain/trade-order';

export class TradeOrderService {
  constructor(private readonly repository: TradeOrderRepository) {}

  async create(input: CreateTradeOrderInput): Promise<TradeOrder> {
    return this.repository.create(input);
  }

  async findAll(query: FindAllTradeOrdersQuery): Promise<PaginatedResponse<TradeOrder>> {
    return this.repository.findAll(query);
  }

  async findById(id: string): Promise<TradeOrder> {
    const order = await this.repository.findById(id);

    if (!order) {
      throw new NotFoundError(`Trade order with id ${id} not found`);
    }

    return order;
  }

  async update(id: string, input: UpdateTradeOrderInput): Promise<TradeOrder> {
    await this.findById(id);
    return this.repository.update(id, input);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    return this.repository.softDelete(id);
  }
}
