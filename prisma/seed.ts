import { OrderSide, OrderStatus, OrderType, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Market prices: BTCUSD=100150.4 | EURUSD=1.035 | ETHUSD=3310
// Limit buy  → price < market | Limit sell  → price > market
// Stop  buy  → price > market | Stop  sell  → price < market
const SEED_ORDERS = [
  // BTCUSD
  { side: OrderSide.buy,  type: OrderType.limit,  amount: 1.50, price: 99000.00000, status: OrderStatus.open,      pair: 'BTCUSD' },
  { side: OrderSide.sell, type: OrderType.limit,  amount: 0.75, price: 101000.00000, status: OrderStatus.open,     pair: 'BTCUSD' },
  { side: OrderSide.buy,  type: OrderType.stop,   amount: 0.50, price: 101500.00000, status: OrderStatus.open,     pair: 'BTCUSD' },
  { side: OrderSide.sell, type: OrderType.stop,   amount: 1.00, price: 98000.00000, status: OrderStatus.open,      pair: 'BTCUSD' },
  { side: OrderSide.buy,  type: OrderType.market, amount: 0.25, price: 100150.40000, status: OrderStatus.executed, pair: 'BTCUSD' },
  { side: OrderSide.sell, type: OrderType.market, amount: 0.50, price: 100150.40000, status: OrderStatus.executed, pair: 'BTCUSD' },
  { side: OrderSide.buy,  type: OrderType.limit,  amount: 2.00, price: 97500.00000, status: OrderStatus.cancelled, pair: 'BTCUSD' },
  { side: OrderSide.sell, type: OrderType.stop,   amount: 1.25, price: 95000.00000, status: OrderStatus.cancelled, pair: 'BTCUSD' },

  // EURUSD
  { side: OrderSide.buy,  type: OrderType.limit,  amount: 10000.00, price: 1.02000, status: OrderStatus.open,      pair: 'EURUSD' },
  { side: OrderSide.sell, type: OrderType.limit,  amount:  5000.00, price: 1.05000, status: OrderStatus.open,      pair: 'EURUSD' },
  { side: OrderSide.buy,  type: OrderType.stop,   amount:  8000.00, price: 1.06000, status: OrderStatus.open,      pair: 'EURUSD' },
  { side: OrderSide.sell, type: OrderType.stop,   amount:  3000.00, price: 1.01000, status: OrderStatus.open,      pair: 'EURUSD' },
  { side: OrderSide.buy,  type: OrderType.market, amount:  2000.00, price: 1.03500, status: OrderStatus.executed,  pair: 'EURUSD' },
  { side: OrderSide.sell, type: OrderType.market, amount:  4000.00, price: 1.03500, status: OrderStatus.executed,  pair: 'EURUSD' },
  { side: OrderSide.buy,  type: OrderType.limit,  amount:  6000.00, price: 1.00000, status: OrderStatus.cancelled, pair: 'EURUSD' },
  { side: OrderSide.sell, type: OrderType.stop,   amount:  7000.00, price: 0.99000, status: OrderStatus.cancelled, pair: 'EURUSD' },

  // ETHUSD
  { side: OrderSide.buy,  type: OrderType.limit,  amount: 3.00, price: 3200.00000, status: OrderStatus.open,      pair: 'ETHUSD' },
  { side: OrderSide.sell, type: OrderType.limit,  amount: 5.00, price: 3400.00000, status: OrderStatus.open,      pair: 'ETHUSD' },
  { side: OrderSide.buy,  type: OrderType.stop,   amount: 2.00, price: 3450.00000, status: OrderStatus.open,      pair: 'ETHUSD' },
  { side: OrderSide.sell, type: OrderType.stop,   amount: 4.00, price: 3100.00000, status: OrderStatus.open,      pair: 'ETHUSD' },
  { side: OrderSide.buy,  type: OrderType.market, amount: 1.50, price: 3310.00000, status: OrderStatus.executed,  pair: 'ETHUSD' },
  { side: OrderSide.sell, type: OrderType.market, amount: 2.50, price: 3310.00000, status: OrderStatus.executed,  pair: 'ETHUSD' },
  { side: OrderSide.buy,  type: OrderType.limit,  amount: 6.00, price: 3000.00000, status: OrderStatus.cancelled, pair: 'ETHUSD' },
  { side: OrderSide.sell, type: OrderType.stop,   amount: 3.00, price: 3050.00000, status: OrderStatus.cancelled, pair: 'ETHUSD' },
  { side: OrderSide.buy,  type: OrderType.stop,   amount: 1.00, price: 3500.00000, status: OrderStatus.cancelled, pair: 'ETHUSD' },
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
