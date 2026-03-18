export const MARKET_PRICES: Record<string, number> = {
  BTCUSD: 100150.4,
  EURUSD: 1.035,
  ETHUSD: 3310,
};

export const SUPPORTED_PAIRS = Object.keys(MARKET_PRICES) as [string, ...string[]];
