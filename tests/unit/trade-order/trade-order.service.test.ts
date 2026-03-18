import { TradeOrderService } from '../../../src/application/trade-order/trade-order.service';
import { PaginatedResponse } from '../../../src/common/pagination';
import { PAGINATION_DEFAULTS } from '../../../src/common/pagination';
import { TradeOrderRepository } from '../../../src/domain/trade-order/trade-order.repository';
import { TradeOrder } from '../../../src/domain/trade-order/trade-order.types';
import { CreateTradeOrderInput } from '../../../src/domain/trade-order/trade-order.schema';
import { OrderSide, OrderStatus, OrderType } from '@prisma/client';

const makeOrder = (overrides: Partial<TradeOrder> = {}): TradeOrder => ({
  id: 'order-1',
  side: OrderSide.buy,
  type: OrderType.limit,
  amount: '1.50',
  price: '42000.12345',
  status: OrderStatus.open,
  pair: 'BTCUSD',
  deleted: false,
  createdAt: new Date('2024-01-01T00:00:00Z'),
  updatedAt: new Date('2024-01-01T00:00:00Z'),
  ...overrides,
});

const makePaginatedResponse = (orders: TradeOrder[]): PaginatedResponse<TradeOrder> => ({
  data: orders,
  metadata: {
    page: PAGINATION_DEFAULTS.PAGE,
    limit: PAGINATION_DEFAULTS.LIMIT,
    total: orders.length,
    totalPages: Math.ceil(orders.length / PAGINATION_DEFAULTS.LIMIT),
  },
});

const mockRepository: jest.Mocked<TradeOrderRepository> = {
  create: jest.fn(),
  findAll: jest.fn(),
  findById: jest.fn(),
  update: jest.fn(),
  softDelete: jest.fn(),
};

describe('TradeOrderService', () => {
  let service: TradeOrderService;

  beforeEach(() => {
    service = new TradeOrderService(mockRepository);
  });

  describe('create', () => {
    const input: CreateTradeOrderInput = {
      side: OrderSide.buy,
      type: OrderType.limit,
      amount: 1.5,
      price: 42000.12345,
      status: OrderStatus.open,
      pair: 'BTCUSD',
    };

    it('delegates to the repository and returns the created order', async () => {
      const order = makeOrder();
      mockRepository.create.mockResolvedValue(order);

      const result = await service.create(input);

      expect(mockRepository.create).toHaveBeenCalledTimes(1);
      expect(mockRepository.create).toHaveBeenCalledWith(input);
      expect(result).toEqual(order);
    });

    it('propagates errors thrown by the repository', async () => {
      mockRepository.create.mockRejectedValue(new Error('DB error'));

      await expect(service.create(input)).rejects.toThrow('DB error');
    });
  });

  describe('findAll', () => {
    const defaultQuery = {
      page: PAGINATION_DEFAULTS.PAGE,
      limit: PAGINATION_DEFAULTS.LIMIT,
    };

    it('delegates to the repository with the given pagination query', async () => {
      const orders = [makeOrder({ id: 'order-1' }), makeOrder({ id: 'order-2' })];
      const paginated = makePaginatedResponse(orders);
      mockRepository.findAll.mockResolvedValue(paginated);

      const result = await service.findAll(defaultQuery);

      expect(mockRepository.findAll).toHaveBeenCalledTimes(1);
      expect(mockRepository.findAll).toHaveBeenCalledWith(defaultQuery);
      expect(result).toEqual(paginated);
    });

    it('returns an empty data array when no orders exist', async () => {
      const paginated = makePaginatedResponse([]);
      mockRepository.findAll.mockResolvedValue(paginated);

      const result = await service.findAll(defaultQuery);

      expect(result.data).toHaveLength(0);
      expect(result.metadata.total).toBe(0);
      expect(result.metadata.totalPages).toBe(0);
    });

    it('forwards custom page and limit to the repository', async () => {
      const query = { page: 3, limit: 5 };
      const paginated: PaginatedResponse<TradeOrder> = {
        data: [],
        metadata: { page: 3, limit: 5, total: 0, totalPages: 0 },
      };
      mockRepository.findAll.mockResolvedValue(paginated);

      await service.findAll(query);

      expect(mockRepository.findAll).toHaveBeenCalledWith(query);
    });

    it('propagates errors thrown by the repository', async () => {
      mockRepository.findAll.mockRejectedValue(new Error('DB error'));

      await expect(service.findAll(defaultQuery)).rejects.toThrow('DB error');
    });
  });
});
