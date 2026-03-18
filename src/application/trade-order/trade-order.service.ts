import { PaginatedResponse } from '../../common/pagination';
import { NotFoundError } from '../../errors/AppError';
import {
  CreateTradeOrderInput,
  FindAllTradeOrdersQuery,
  UpdateTradeOrderInput,
  TradeOrder,
  TradeOrderRepository,
  validateOrderPrice,
} from '../../domain/trade-order';

export class TradeOrderService {
  constructor(private readonly repository: TradeOrderRepository) {}

  async create(input: CreateTradeOrderInput): Promise<TradeOrder> {
    validateOrderPrice(input);
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
    const current = await this.findById(id);

    validateOrderPrice({
      side: input.side ?? current.side,
      type: input.type ?? current.type,
      price: input.price ?? Number(current.price),
      pair: input.pair ?? current.pair,
    });

    return this.repository.update(id, input);
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    return this.repository.softDelete(id);
  }
}
