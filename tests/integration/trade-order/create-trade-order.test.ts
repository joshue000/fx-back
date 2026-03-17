import request from 'supertest';
import { createApp } from '../../../src/app';
import { prisma } from '../../../src/config/database';

const app = createApp();

afterAll(async () => {
  await prisma.tradeOrder.deleteMany();
  await prisma.$disconnect();
});

describe('POST /api/v1/trade_orders', () => {
  const validPayload = {
    side: 'buy',
    type: 'limit',
    amount: 1.5,
    price: 42000.12345,
    pair: 'BTCUSD',
  };

  it('returns 201 with the created order', async () => {
    const res = await request(app).post('/api/v1/trade_orders').send(validPayload);

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      side: 'buy',
      type: 'limit',
      status: 'open',
      pair: 'BTCUSD',
    });
    expect(res.body.id).toBeDefined();
    expect(res.body.createdAt).toBeDefined();
  });

  it('defaults status to open when not provided', async () => {
    const res = await request(app).post('/api/v1/trade_orders').send(validPayload);

    expect(res.status).toBe(201);
    expect(res.body.status).toBe('open');
  });

  it('normalizes pair to uppercase', async () => {
    const res = await request(app)
      .post('/api/v1/trade_orders')
      .send({ ...validPayload, pair: 'ethusd' });

    expect(res.status).toBe(201);
    expect(res.body.pair).toBe('ETHUSD');
  });

  it('returns 422 when side is invalid', async () => {
    const res = await request(app)
      .post('/api/v1/trade_orders')
      .send({ ...validPayload, side: 'hold' });

    expect(res.status).toBe(422);
    expect(res.body.errors.side).toBeDefined();
  });

  it('returns 422 when amount exceeds 2 decimal places', async () => {
    const res = await request(app)
      .post('/api/v1/trade_orders')
      .send({ ...validPayload, amount: 1.123 });

    expect(res.status).toBe(422);
    expect(res.body.errors.amount).toBeDefined();
  });

  it('returns 422 when price exceeds 5 decimal places', async () => {
    const res = await request(app)
      .post('/api/v1/trade_orders')
      .send({ ...validPayload, price: 1.123456 });

    expect(res.status).toBe(422);
    expect(res.body.errors.price).toBeDefined();
  });

  it('returns 422 when required fields are missing', async () => {
    const res = await request(app).post('/api/v1/trade_orders').send({});

    expect(res.status).toBe(422);
  });
});
