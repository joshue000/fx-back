import { OrderSide, OrderStatus, OrderType, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SEED_ORDERS = [
  // BTCUSD
  { side: OrderSide.buy,  type: OrderType.limit,  amount: 1.50,     price: 42000.12345, status: OrderStatus.open,      pair: 'BTCUSD' },
  { side: OrderSide.sell, type: OrderType.market,  amount: 0.75,     price: 41850.00000, status: OrderStatus.executed,  pair: 'BTCUSD' },
  { side: OrderSide.buy,  type: OrderType.stop,    amount: 0.25,     price: 40500.00000, status: OrderStatus.cancelled, pair: 'BTCUSD' },
  { side: OrderSide.sell, type: OrderType.limit,   amount: 2.00,     price: 43500.00000, status: OrderStatus.open,      pair: 'BTCUSD' },
  { side: OrderSide.buy,  type: OrderType.market,  amount: 0.50,     price: 42100.75000, status: OrderStatus.executed,  pair: 'BTCUSD' },

  // ETHUSD
  { side: OrderSide.buy,  type: OrderType.stop,    amount: 3.00,     price: 2800.50000,  status: OrderStatus.open,      pair: 'ETHUSD' },
  { side: OrderSide.sell, type: OrderType.limit,   amount: 5.00,     price: 2750.25000,  status: OrderStatus.cancelled, pair: 'ETHUSD' },
  { side: OrderSide.buy,  type: OrderType.market,  amount: 1.50,     price: 2820.00000,  status: OrderStatus.executed,  pair: 'ETHUSD' },
  { side: OrderSide.sell, type: OrderType.stop,    amount: 4.00,     price: 2700.00000,  status: OrderStatus.open,      pair: 'ETHUSD' },
  { side: OrderSide.buy,  type: OrderType.limit,   amount: 2.25,     price: 2780.50000,  status: OrderStatus.open,      pair: 'ETHUSD' },

  // EURUSD
  { side: OrderSide.buy,  type: OrderType.limit,   amount: 10000.00, price: 1.08000,     status: OrderStatus.open,      pair: 'EURUSD' },
  { side: OrderSide.sell, type: OrderType.market,  amount: 5000.00,  price: 1.07950,     status: OrderStatus.executed,  pair: 'EURUSD' },
  { side: OrderSide.buy,  type: OrderType.stop,    amount: 8000.00,  price: 1.07500,     status: OrderStatus.cancelled, pair: 'EURUSD' },
  { side: OrderSide.sell, type: OrderType.limit,   amount: 3000.00,  price: 1.08500,     status: OrderStatus.open,      pair: 'EURUSD' },
  { side: OrderSide.buy,  type: OrderType.market,  amount: 2000.00,  price: 1.08100,     status: OrderStatus.executed,  pair: 'EURUSD' },

  // GBPUSD
  { side: OrderSide.buy,  type: OrderType.stop,    amount: 8000.00,  price: 1.26500,     status: OrderStatus.open,      pair: 'GBPUSD' },
  { side: OrderSide.sell, type: OrderType.limit,   amount: 2000.00,  price: 1.26450,     status: OrderStatus.cancelled, pair: 'GBPUSD' },
  { side: OrderSide.buy,  type: OrderType.market,  amount: 5000.00,  price: 1.26300,     status: OrderStatus.executed,  pair: 'GBPUSD' },
  { side: OrderSide.sell, type: OrderType.stop,    amount: 4000.00,  price: 1.27000,     status: OrderStatus.open,      pair: 'GBPUSD' },
  { side: OrderSide.buy,  type: OrderType.limit,   amount: 6000.00,  price: 1.25900,     status: OrderStatus.open,      pair: 'GBPUSD' },

  // USDJPY
  { side: OrderSide.buy,  type: OrderType.market,  amount: 100.00,   price: 185.50000,   status: OrderStatus.executed,  pair: 'USDJPY' },
  { side: OrderSide.sell, type: OrderType.limit,   amount: 200.00,   price: 186.25000,   status: OrderStatus.open,      pair: 'USDJPY' },
  { side: OrderSide.buy,  type: OrderType.stop,    amount: 150.00,   price: 184.00000,   status: OrderStatus.cancelled, pair: 'USDJPY' },
  { side: OrderSide.sell, type: OrderType.market,  amount: 300.00,   price: 186.00000,   status: OrderStatus.executed,  pair: 'USDJPY' },
  { side: OrderSide.buy,  type: OrderType.limit,   amount: 250.00,   price: 185.00000,   status: OrderStatus.open,      pair: 'USDJPY' },
];

async function main(): Promise<void> {
  console.log('Seeding trade orders...');

  await prisma.tradeOrder.deleteMany();

  const orders = await prisma.tradeOrder.createMany({ data: SEED_ORDERS });

  console.log(`Seeded ${orders.count} trade orders.`);
}

main()
  .catch((err) => {
    console.error('Seed failed:', err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
