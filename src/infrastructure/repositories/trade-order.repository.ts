import { TradeOrder as PrismaTradeOrder } from '@prisma/client';
import { prisma } from '../../config/database';
import { PaginatedResponse, PaginationQuery } from '../../common/pagination';
import { UpdateTradeOrderInput } from '../../domain/trade-order/trade-order.schema';
import { CreateTradeOrderDto, TradeOrder, TradeOrderRepository } from '../../domain/trade-order';

const ACTIVE_FILTER = { deleted: false } as const;

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
        where: ACTIVE_FILTER,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.tradeOrder.count({ where: ACTIVE_FILTER }),
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

  async findById(id: string): Promise<TradeOrder | null> {
    const order = await prisma.tradeOrder.findFirst({
      where: { id, ...ACTIVE_FILTER },
    });

    return order ? this.serialize(order) : null;
  }

  async update(id: string, dto: UpdateTradeOrderInput): Promise<TradeOrder> {
    const order = await prisma.tradeOrder.update({
      where: { id },
      data: dto,
    });

    return this.serialize(order);
  }

  async softDelete(id: string): Promise<void> {
    await prisma.tradeOrder.update({
      where: { id },
      data: { deleted: true },
    });
  }

  private serialize(order: PrismaTradeOrder): TradeOrder {
    return {
      ...order,
      amount: order.amount.toString(),
      price: order.price.toString(),
    };
  }
}
