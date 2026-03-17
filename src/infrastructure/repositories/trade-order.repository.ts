import { TradeOrder as PrismaTradeOrder } from '@prisma/client';
import { prisma } from '../../config/database';
import { CreateTradeOrderDto, TradeOrder, TradeOrderRepository } from '../../domain/trade-order';

export class PrismaTradeOrderRepository implements TradeOrderRepository {
  async create(dto: CreateTradeOrderDto): Promise<TradeOrder> {
    const order = await prisma.tradeOrder.create({
      data: {
        side: dto.side,
        type: dto.type,
        amount: dto.amount,
        price: dto.price,
        status: dto.status,
        pair: dto.pair,
      },
    });

    return this.serialize(order);
  }

  async findAll(): Promise<TradeOrder[]> {
    const orders = await prisma.tradeOrder.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return orders.map((order) => this.serialize(order));
  }

  private serialize(order: PrismaTradeOrder): TradeOrder {
    return {
      ...order,
      amount: order.amount.toString(),
      price: order.price.toString(),
    };
  }
}
