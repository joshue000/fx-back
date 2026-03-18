import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { TradeOrderController } from '../../../src/presentation/trade-order/trade-order.controller';
import { TradeOrderService } from '../../../src/application/trade-order/trade-order.service';
import { PaginatedResponse, PAGINATION_DEFAULTS } from '../../../src/common/pagination';
import { TradeOrder } from '../../../src/domain/trade-order/trade-order.types';
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

const mockResponse = (): Response => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockRequest = (body: unknown = {}, query: Record<string, string> = {}): Request =>
  ({ body, query }) as unknown as Request;

jest.mock('../../../src/application/trade-order/trade-order.service');

describe('TradeOrderController', () => {
  let controller: TradeOrderController;
  let service: jest.Mocked<TradeOrderService>;

  beforeEach(() => {
    service = new TradeOrderService(null as never) as jest.Mocked<TradeOrderService>;
    controller = new TradeOrderController(service);
  });

  describe('create', () => {
    const body = {
      side: 'buy',
      type: 'limit',
      amount: 1.5,
      price: 42000.12345,
      pair: 'BTCUSD',
    };

    it('responds with 201 and the created order', async () => {
      const order = makeOrder();
      service.create.mockResolvedValue(order);

      const req = mockRequest(body);
      const res = mockResponse();

      await controller.create(req, res);

      expect(service.create).toHaveBeenCalledWith(body);
      expect(res.status).toHaveBeenCalledWith(StatusCodes.CREATED);
      expect(res.json).toHaveBeenCalledWith(order);
    });

    it('propagates errors from the service', async () => {
      service.create.mockRejectedValue(new Error('Service error'));

      const req = mockRequest(body);
      const res = mockResponse();

      await expect(controller.create(req, res)).rejects.toThrow('Service error');
    });
  });

  describe('findAll', () => {
    const makePaginated = (orders: TradeOrder[]): PaginatedResponse<TradeOrder> => ({
      data: orders,
      metadata: {
        page: PAGINATION_DEFAULTS.PAGE,
        limit: PAGINATION_DEFAULTS.LIMIT,
        total: orders.length,
        totalPages: Math.ceil(orders.length / PAGINATION_DEFAULTS.LIMIT),
      },
    });

    it('responds with 200 and a paginated result', async () => {
      const orders = [makeOrder()];
      const paginated = makePaginated(orders);
      service.findAll.mockResolvedValue(paginated);

      const req = mockRequest({}, {});
      const res = mockResponse();

      await controller.findAll(req, res);

      expect(res.status).toHaveBeenCalledWith(StatusCodes.OK);
      expect(res.json).toHaveBeenCalledWith(paginated);
    });

    it('applies default pagination when no query params are provided', async () => {
      const paginated = makePaginated([]);
      service.findAll.mockResolvedValue(paginated);

      const req = mockRequest({}, {});
      const res = mockResponse();

      await controller.findAll(req, res);

      expect(service.findAll).toHaveBeenCalledWith({
        page: PAGINATION_DEFAULTS.PAGE,
        limit: PAGINATION_DEFAULTS.LIMIT,
      });
    });

    it('passes custom page and limit to the service', async () => {
      const paginated: PaginatedResponse<TradeOrder> = {
        data: [],
        metadata: { page: 2, limit: 5, total: 0, totalPages: 0 },
      };
      service.findAll.mockResolvedValue(paginated);

      const req = mockRequest({}, { page: '2', limit: '5' });
      const res = mockResponse();

      await controller.findAll(req, res);

      expect(service.findAll).toHaveBeenCalledWith({ page: 2, limit: 5 });
    });

    it('returns data and metadata in the response body', async () => {
      const orders = [makeOrder({ id: 'order-1' }), makeOrder({ id: 'order-2' })];
      const paginated = makePaginated(orders);
      service.findAll.mockResolvedValue(paginated);

      const req = mockRequest({}, {});
      const res = mockResponse();

      await controller.findAll(req, res);

      const jsonCall = (res.json as jest.Mock).mock.calls[0][0] as PaginatedResponse<TradeOrder>;
      expect(jsonCall.data).toHaveLength(2);
      expect(jsonCall.metadata.total).toBe(2);
      expect(jsonCall.metadata.page).toBe(PAGINATION_DEFAULTS.PAGE);
      expect(jsonCall.metadata.limit).toBe(PAGINATION_DEFAULTS.LIMIT);
    });

    it('propagates errors from the service', async () => {
      service.findAll.mockRejectedValue(new Error('Service error'));

      const req = mockRequest({}, {});
      const res = mockResponse();

      await expect(controller.findAll(req, res)).rejects.toThrow('Service error');
    });
  });
});
