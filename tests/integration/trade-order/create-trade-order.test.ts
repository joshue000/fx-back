import request from 'supertest';
import { createApp } from '../../../src/app';
import { prisma } from '../../../src/config/database';

const app = createApp();

afterAll(async () => {
  await prisma.tradeOrder.deleteMany();
  await prisma.$disconnect();
});

describe('POST /api/v1/trade_orders', () => {
  // BTCUSD market price: 100150.4 — buy limit at 99000 is valid (99000 < 100150.4)
  const validPayload = {
    side: 'buy',
    type: 'limit',
    amount: 1.5,
    price: 99000.00000,
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

  // ETHUSD market price: 3310 — buy limit at 3200 is valid (3200 < 3310)
  it('normalizes pair to uppercase', async () => {
    const res = await request(app)
      .post('/api/v1/trade_orders')
      .send({ ...validPayload, pair: 'ethusd', price: 3200.00000 });

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
  });

  it('returns 422 when required fields are missing', async () => {
    const res = await request(app).post('/api/v1/trade_orders').send({});

    expect(res.status).toBe(422);
  });

  describe('pair validation', () => {
    it('returns 422 when pair is not supported', async () => {
      const res = await request(app)
        .post('/api/v1/trade_orders')
        .send({ ...validPayload, pair: 'GBPUSD' });

      expect(res.status).toBe(422);
    });
  });

  describe('price policy — limit orders', () => {
    it('returns 400 when buy limit price is above market price', async () => {
      // BTCUSD market: 100150.4 — 101000 > 100150.4 → invalid
      const res = await request(app)
        .post('/api/v1/trade_orders')
        .send({ ...validPayload, side: 'buy', type: 'limit', price: 101000.00000 });

      expect(res.status).toBe(400);
    });

    it('returns 201 when buy limit price is below market price', async () => {
      // BTCUSD market: 100150.4 — 99000 < 100150.4 → valid
      const res = await request(app)
        .post('/api/v1/trade_orders')
        .send({ ...validPayload, side: 'buy', type: 'limit', price: 99000.00000 });

      expect(res.status).toBe(201);
    });

    it('returns 400 when sell limit price is below market price', async () => {
      // BTCUSD market: 100150.4 — 99000 < 100150.4 → invalid
      const res = await request(app)
        .post('/api/v1/trade_orders')
        .send({ ...validPayload, side: 'sell', type: 'limit', price: 99000.00000 });

      expect(res.status).toBe(400);
    });

    it('returns 201 when sell limit price is above market price', async () => {
      // BTCUSD market: 100150.4 — 101000 > 100150.4 → valid
      const res = await request(app)
        .post('/api/v1/trade_orders')
        .send({ ...validPayload, side: 'sell', type: 'limit', price: 101000.00000 });

      expect(res.status).toBe(201);
    });
  });

  describe('price policy — stop orders', () => {
    it('returns 400 when buy stop price is below market price', async () => {
      // BTCUSD market: 100150.4 — 99000 < 100150.4 → invalid
      const res = await request(app)
        .post('/api/v1/trade_orders')
        .send({ ...validPayload, side: 'buy', type: 'stop', price: 99000.00000 });

      expect(res.status).toBe(400);
    });

    it('returns 201 when buy stop price is above market price', async () => {
      // BTCUSD market: 100150.4 — 101000 > 100150.4 → valid
      const res = await request(app)
        .post('/api/v1/trade_orders')
        .send({ ...validPayload, side: 'buy', type: 'stop', price: 101000.00000 });

      expect(res.status).toBe(201);
    });

    it('returns 400 when sell stop price is above market price', async () => {
      // BTCUSD market: 100150.4 — 101000 > 100150.4 → invalid
      const res = await request(app)
        .post('/api/v1/trade_orders')
        .send({ ...validPayload, side: 'sell', type: 'stop', price: 101000.00000 });

      expect(res.status).toBe(400);
    });

    it('returns 201 when sell stop price is below market price', async () => {
      // BTCUSD market: 100150.4 — 99000 < 100150.4 → valid
      const res = await request(app)
        .post('/api/v1/trade_orders')
        .send({ ...validPayload, side: 'sell', type: 'stop', price: 99000.00000 });

      expect(res.status).toBe(201);
    });
  });

  describe('price policy — market orders', () => {
    it('returns 201 regardless of price for market orders', async () => {
      // Market orders skip price validation entirely
      const res = await request(app)
        .post('/api/v1/trade_orders')
        .send({ ...validPayload, type: 'market', price: 100150.40000 });

      expect(res.status).toBe(201);
    });
  });
});
