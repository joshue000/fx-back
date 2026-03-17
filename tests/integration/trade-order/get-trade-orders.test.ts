import request from 'supertest';
import { createApp } from '../../../src/app';
import { prisma } from '../../../src/config/database';
import { PAGINATION_DEFAULTS } from '../../../src/common/pagination';

const app = createApp();

beforeEach(async () => {
  await prisma.tradeOrder.deleteMany();
});

afterAll(async () => {
  await prisma.tradeOrder.deleteMany();
  await prisma.$disconnect();
});

describe('GET /api/v1/trade_orders', () => {
  it('returns 200 with empty data and correct metadata when no orders exist', async () => {
    const res = await request(app).get('/api/v1/trade_orders');

    expect(res.status).toBe(200);
    expect(res.body.data).toEqual([]);
    expect(res.body.metadata).toMatchObject({
      page: PAGINATION_DEFAULTS.PAGE,
      limit: PAGINATION_DEFAULTS.LIMIT,
      total: 0,
      totalPages: 0,
    });
  });

  it('returns orders sorted by createdAt descending', async () => {
    await prisma.tradeOrder.createMany({
      data: [
        { side: 'buy', type: 'limit', amount: 1.0, price: 100.0, pair: 'BTCUSD' },
        { side: 'sell', type: 'market', amount: 2.5, price: 200.0, pair: 'ETHUSD' },
      ],
    });

    const res = await request(app).get('/api/v1/trade_orders');

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(2);
    expect(new Date(res.body.data[0].createdAt).getTime()).toBeGreaterThanOrEqual(
      new Date(res.body.data[1].createdAt).getTime(),
    );
  });

  it('returns orders with the expected shape', async () => {
    await prisma.tradeOrder.create({
      data: { side: 'buy', type: 'stop', amount: 0.5, price: 50000.12345, pair: 'BTCUSD' },
    });

    const res = await request(app).get('/api/v1/trade_orders');

    expect(res.status).toBe(200);
    expect(res.body.data[0]).toMatchObject({
      side: 'buy',
      type: 'stop',
      status: 'open',
      pair: 'BTCUSD',
    });
    expect(res.body.data[0].id).toBeDefined();
    expect(res.body.data[0].amount).toBeDefined();
    expect(res.body.data[0].price).toBeDefined();
  });

  it('returns correct metadata for a single order', async () => {
    await prisma.tradeOrder.create({
      data: { side: 'buy', type: 'limit', amount: 1.0, price: 100.0, pair: 'BTCUSD' },
    });

    const res = await request(app).get('/api/v1/trade_orders');

    expect(res.body.metadata).toMatchObject({
      page: PAGINATION_DEFAULTS.PAGE,
      limit: PAGINATION_DEFAULTS.LIMIT,
      total: 1,
      totalPages: 1,
    });
  });

  it('paginates results using query params', async () => {
    await prisma.tradeOrder.createMany({
      data: Array.from({ length: 15 }, (_, i) => ({
        side: 'buy' as const,
        type: 'limit' as const,
        amount: 1.0,
        price: 100.0,
        pair: `PAIR${i}`,
      })),
    });

    const res = await request(app).get('/api/v1/trade_orders?page=2&limit=5');

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(5);
    expect(res.body.metadata).toMatchObject({
      page: 2,
      limit: 5,
      total: 15,
      totalPages: 3,
    });
  });

  it('returns 422 when page is not a positive number', async () => {
    const res = await request(app).get('/api/v1/trade_orders?page=0');

    expect(res.status).toBe(422);
  });
});
