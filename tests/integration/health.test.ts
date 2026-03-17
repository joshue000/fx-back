import request from 'supertest';
import { createApp } from '../../src/app';
import { prisma } from '../../src/config/database';

const app = createApp();

afterAll(async () => {
  await prisma.$disconnect();
});

describe('GET /api/v1/health', () => {
  it('returns 200 with status ok when database is connected', async () => {
    const res = await request(app).get('/api/v1/health');

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({
      status: 'ok',
      database: 'connected',
    });
    expect(res.body.timestamp).toBeDefined();
  });
});
