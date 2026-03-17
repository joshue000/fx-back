import { CreateTradeOrderInput, TradeOrder, TradeOrderRepository } from '../../domain/trade-order';

export class TradeOrderService {
  constructor(private readonly repository: TradeOrderRepository) {}

  async create(input: CreateTradeOrderInput): Promise<TradeOrder> {
    return this.repository.create(input);
  }

  async findAll(): Promise<TradeOrder[]> {
    return this.repository.findAll();
  }
}
