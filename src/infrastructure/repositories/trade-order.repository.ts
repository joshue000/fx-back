import { TradeOrder as PrismaTradeOrder } from '@prisma/client';
import { prisma } from '../../config/database';
import { PaginatedResponse, PaginationQuery } from '../../common/pagination';
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

  async findAll(query: PaginationQuery): Promise<PaginatedResponse<TradeOrder>> {
    const { page, limit } = query;
    const skip = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      prisma.tradeOrder.findMany({
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.tradeOrder.count(),
    ]);

    return {
      data: orders.map((order) => this.serialize(order)),
      metadata: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  private serialize(order: PrismaTradeOrder): TradeOrder {
    return {
      ...order,
      amount: order.amount.toString(),
      price: order.price.toString(),
    };
  }
}
