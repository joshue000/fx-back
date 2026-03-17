-- CreateEnum
CREATE TYPE "OrderSide" AS ENUM ('buy', 'sell');

-- CreateEnum
CREATE TYPE "OrderType" AS ENUM ('limit', 'market', 'stop');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('open', 'cancelled', 'executed');

-- CreateTable
CREATE TABLE "trade_order" (
    "id" TEXT NOT NULL,
    "side" "OrderSide" NOT NULL,
    "type" "OrderType" NOT NULL,
    "amount" DECIMAL(18,2) NOT NULL,
    "price" DECIMAL(18,5) NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'open',
    "pair" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trade_order_pkey" PRIMARY KEY ("id")
);
