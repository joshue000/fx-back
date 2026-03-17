import request from 'supertest';
import { createApp } from '../../../src/app';
import { prisma } from '../../../src/config/database';

const app = createApp();

beforeEach(async () => {
  await prisma.tradeOrder.deleteMany();
});

afterAll(async () => {
  await prisma.tradeOrder.deleteMany();
  await prisma.$disconnect();
});

describe('GET /api/v1/trade_orders', () => {
  it('returns 200 with an empty array when no orders exist', async () => {
    const res = await request(app).get('/api/v1/trade_orders');

    expect(res.status).toBe(200);
    expect(res.body).toEqual([]);
  });

  it('returns all orders sorted by createdAt descending', async () => {
    await prisma.tradeOrder.createMany({
      data: [
        { side: 'buy', type: 'limit', amount: 1.0, price: 100.0, pair: 'BTCUSD' },
        { side: 'sell', type: 'market', amount: 2.5, price: 200.0, pair: 'ETHUSD' },
      ],
    });

    const res = await request(app).get('/api/v1/trade_orders');

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(2);
    expect(new Date(res.body[0].createdAt).getTime()).toBeGreaterThanOrEqual(
      new Date(res.body[1].createdAt).getTime(),
    );
  });

  it('returns orders with the expected shape', async () => {
    await prisma.tradeOrder.create({
      data: { side: 'buy', type: 'stop', amount: 0.5, price: 50000.12345, pair: 'BTCUSD' },
    });

    const res = await request(app).get('/api/v1/trade_orders');

    expect(res.status).toBe(200);
    expect(res.body[0]).toMatchObject({
      side: 'buy',
      type: 'stop',
      status: 'open',
      pair: 'BTCUSD',
    });
    expect(res.body[0].id).toBeDefined();
    expect(res.body[0].amount).toBeDefined();
    expect(res.body[0].price).toBeDefined();
  });
});
