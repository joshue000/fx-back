-- CreateIndex
CREATE INDEX "trade_order_deleted_createdAt_idx" ON "trade_order"("deleted", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "trade_order_pair_idx" ON "trade_order"("pair");
