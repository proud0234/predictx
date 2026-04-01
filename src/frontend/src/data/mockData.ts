export const MOCK_MARKETS = [
  {
    marketId: 1n,
    question: "Will BTC exceed $100K by end of 2026?",
    description: "Bitcoin price prediction market for end of year 2026",
    category: "crypto",
    yesPrice: 0.67,
    noPrice: 0.33,
    volume: 45230n,
    status: "active",
    resolutionDate: BigInt(Date.now() + 30 * 24 * 60 * 60 * 1000),
    creator: null,
  },
  {
    marketId: 2n,
    question: "Will ETH reach $8,000 in Q1 2026?",
    description: "Ethereum price milestone prediction",
    category: "crypto",
    yesPrice: 0.52,
    noPrice: 0.48,
    volume: 31450n,
    status: "active",
    resolutionDate: BigInt(Date.now() + 15 * 24 * 60 * 60 * 1000),
    creator: null,
  },
  {
    marketId: 3n,
    question: "Will the Lakers win the NBA Championship 2026?",
    description: "NBA Championship prediction market",
    category: "sports",
    yesPrice: 0.34,
    noPrice: 0.66,
    volume: 28900n,
    status: "active",
    resolutionDate: BigInt(Date.now() + 60 * 24 * 60 * 60 * 1000),
    creator: null,
  },
  {
    marketId: 4n,
    question: "Will Apple release a foldable iPhone in 2026?",
    description: "Apple product launch prediction",
    category: "technology",
    yesPrice: 0.45,
    noPrice: 0.55,
    volume: 22100n,
    status: "active",
    resolutionDate: BigInt(Date.now() + 90 * 24 * 60 * 60 * 1000),
    creator: null,
  },
  {
    marketId: 5n,
    question: "Will Elon Musk launch another company in 2026?",
    description: "Elon Musk business activity prediction",
    category: "entertainment",
    yesPrice: 0.78,
    noPrice: 0.22,
    volume: 18750n,
    status: "active",
    resolutionDate: BigInt(Date.now() + 45 * 24 * 60 * 60 * 1000),
    creator: null,
  },
  {
    marketId: 6n,
    question: "Will a new AI model surpass GPT-5 in 2026?",
    description: "AI race prediction market",
    category: "technology",
    yesPrice: 0.61,
    noPrice: 0.39,
    volume: 35600n,
    status: "active",
    resolutionDate: BigInt(Date.now() + 20 * 24 * 60 * 60 * 1000),
    creator: null,
  },
  {
    marketId: 7n,
    question: "Will SpaceX land on Mars before 2028?",
    description: "SpaceX Mars mission timeline prediction",
    category: "technology",
    yesPrice: 0.29,
    noPrice: 0.71,
    volume: 41200n,
    status: "active",
    resolutionDate: BigInt(Date.now() + 120 * 24 * 60 * 60 * 1000),
    creator: null,
  },
  {
    marketId: 8n,
    question: "Will the S&P 500 hit 8,000 in 2026?",
    description: "Stock market index milestone prediction",
    category: "crypto",
    yesPrice: 0.55,
    noPrice: 0.45,
    volume: 67890n,
    status: "active",
    resolutionDate: BigInt(Date.now() + 200 * 24 * 60 * 60 * 1000),
    creator: null,
  },
];

export const MOCK_LEADERBOARD = [
  {
    rank: 1,
    username: "CryptoWhale",
    winRate: 87.4,
    pnl: 45230,
    tier: "elite",
    trades: 342,
    reputation: 9800n,
  },
  {
    rank: 2,
    username: "PredictGuru",
    winRate: 82.1,
    pnl: 38750,
    tier: "gold",
    trades: 281,
    reputation: 8200n,
  },
  {
    rank: 3,
    username: "MarketSage",
    winRate: 79.5,
    pnl: 31200,
    tier: "gold",
    trades: 215,
    reputation: 7100n,
  },
  {
    rank: 4,
    username: "BlockOracle",
    winRate: 76.8,
    pnl: 27890,
    tier: "silver",
    trades: 189,
    reputation: 6400n,
  },
  {
    rank: 5,
    username: "AlgoTrader",
    winRate: 74.2,
    pnl: 22340,
    tier: "silver",
    trades: 164,
    reputation: 5900n,
  },
  {
    rank: 6,
    username: "DefiWizard",
    winRate: 71.9,
    pnl: 18900,
    tier: "silver",
    trades: 143,
    reputation: 5100n,
  },
  {
    rank: 7,
    username: "TokenVault",
    winRate: 69.3,
    pnl: 15670,
    tier: "bronze",
    trades: 127,
    reputation: 4400n,
  },
  {
    rank: 8,
    username: "ChainPulse",
    winRate: 66.7,
    pnl: 12450,
    tier: "bronze",
    trades: 98,
    reputation: 3800n,
  },
];

export const MOCK_TRADES = [
  {
    user: "CryptoWhale",
    action: "bought",
    shares: "250 YES",
    market: "BTC > $100K",
    time: "2m ago",
    value: 167.5,
  },
  {
    user: "PredictGuru",
    action: "sold",
    shares: "100 NO",
    market: "ETH > $8K",
    time: "5m ago",
    value: 48.0,
  },
  {
    user: "MarketSage",
    action: "bought",
    shares: "500 YES",
    market: "AI surpasses GPT-5",
    time: "8m ago",
    value: 305.0,
  },
  {
    user: "BlockOracle",
    action: "sold",
    shares: "75 YES",
    market: "Lakers win NBA",
    time: "12m ago",
    value: 25.5,
  },
  {
    user: "AlgoTrader",
    action: "bought",
    shares: "200 NO",
    market: "Foldable iPhone",
    time: "18m ago",
    value: 110.0,
  },
];

export const MOCK_ORDER_BOOK = {
  bids: [
    { price: 0.66, quantity: 150, total: 99 },
    { price: 0.65, quantity: 320, total: 208 },
    { price: 0.64, quantity: 500, total: 320 },
    { price: 0.63, quantity: 200, total: 126 },
    { price: 0.62, quantity: 450, total: 279 },
  ],
  asks: [
    { price: 0.68, quantity: 100, total: 68 },
    { price: 0.69, quantity: 280, total: 193 },
    { price: 0.7, quantity: 420, total: 294 },
    { price: 0.71, quantity: 180, total: 128 },
    { price: 0.72, quantity: 350, total: 252 },
  ],
};

export const MOCK_PRICE_HISTORY = Array.from({ length: 30 }, (_, i) => ({
  day: `Day ${i + 1}`,
  yes: Math.max(0.1, Math.min(0.9, 0.5 + Math.sin(i * 0.4) * 0.15 + i * 0.005)),
  no: 0,
})).map((d) => ({ ...d, no: 1 - d.yes }));

// ALGO/USD OHLCV candlestick data (30 candles)
const basePrice = 6.0;
export const MOCK_OHLCV = Array.from({ length: 30 }, (_, i) => {
  const trend = Math.sin(i * 0.3) * 0.8 + i * 0.02;
  const open = +(basePrice + trend + (Math.random() - 0.5) * 0.4).toFixed(4);
  const close = +(open + (Math.random() - 0.48) * 0.5).toFixed(4);
  const high = +(Math.max(open, close) + Math.random() * 0.3).toFixed(4);
  const low = +(Math.min(open, close) - Math.random() * 0.3).toFixed(4);
  const volume = Math.floor(80000 + Math.random() * 120000);
  const _hours = i * 4;
  const d = new Date();
  d.setHours(d.getHours() - (30 - i) * 4);
  const label = `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, "0")}h`;
  return {
    time: label,
    open,
    high,
    low,
    close,
    volume,
    bullish: close >= open,
  };
});

// Live orderbook — asks 6.01–7.00, bids 5.50–6.00, intentional overlap at 6.00
export const MOCK_LIVE_ORDERS: {
  side: "ask" | "bid";
  price: number;
  qty: number;
  total: number;
}[] = [
  // ASKS (sellers) — ascending from 6.00
  { side: "ask", price: 6.0, qty: 120, total: 720 },
  { side: "ask", price: 6.05, qty: 85, total: 514.25 },
  { side: "ask", price: 6.12, qty: 200, total: 1224 },
  { side: "ask", price: 6.18, qty: 310, total: 1915.8 },
  { side: "ask", price: 6.25, qty: 150, total: 937.5 },
  { side: "ask", price: 6.33, qty: 95, total: 601.35 },
  { side: "ask", price: 6.45, qty: 260, total: 1677 },
  { side: "ask", price: 6.52, qty: 180, total: 1173.6 },
  { side: "ask", price: 6.71, qty: 75, total: 503.25 },
  { side: "ask", price: 6.9, qty: 140, total: 966 },
  // BIDS (buyers) — descending from 6.00
  { side: "bid", price: 6.0, qty: 110, total: 660 },
  { side: "bid", price: 5.95, qty: 220, total: 1309 },
  { side: "bid", price: 5.88, qty: 175, total: 1029 },
  { side: "bid", price: 5.81, qty: 300, total: 1743 },
  { side: "bid", price: 5.75, qty: 95, total: 546.25 },
  { side: "bid", price: 5.68, qty: 410, total: 2328.8 },
  { side: "bid", price: 5.62, qty: 130, total: 730.6 },
  { side: "bid", price: 5.55, qty: 280, total: 1554 },
  { side: "bid", price: 5.5, qty: 160, total: 880 },
  { side: "bid", price: 5.42, qty: 90, total: 487.8 },
];

// Recent trades in ALGO
export const MOCK_RECENT_TRADES = [
  {
    side: "buy" as const,
    price: 6.0,
    qty: 110,
    time: "14:32:05",
    buyer: "ALGO...X7K2",
    seller: "ALGO...P4M8",
  },
  {
    side: "sell" as const,
    price: 5.98,
    qty: 45,
    time: "14:31:52",
    buyer: "ALGO...Q3N1",
    seller: "ALGO...Z2R5",
  },
  {
    side: "buy" as const,
    price: 6.03,
    qty: 200,
    time: "14:31:38",
    buyer: "ALGO...W9L6",
    seller: "ALGO...T8K3",
  },
  {
    side: "sell" as const,
    price: 5.95,
    qty: 80,
    time: "14:31:21",
    buyer: "ALGO...B5J7",
    seller: "ALGO...V1N4",
  },
  {
    side: "buy" as const,
    price: 6.07,
    qty: 150,
    time: "14:31:09",
    buyer: "ALGO...E4H2",
    seller: "ALGO...C6P9",
  },
  {
    side: "buy" as const,
    price: 6.05,
    qty: 92,
    time: "14:30:55",
    buyer: "ALGO...D7M3",
    seller: "ALGO...F2S8",
  },
  {
    side: "sell" as const,
    price: 5.92,
    qty: 310,
    time: "14:30:41",
    buyer: "ALGO...G8Q5",
    seller: "ALGO...H3R6",
  },
  {
    side: "buy" as const,
    price: 6.12,
    qty: 65,
    time: "14:30:28",
    buyer: "ALGO...I1K4",
    seller: "ALGO...J9T7",
  },
  {
    side: "sell" as const,
    price: 5.88,
    qty: 180,
    time: "14:30:14",
    buyer: "ALGO...K6N2",
    seller: "ALGO...L4W1",
  },
  {
    side: "buy" as const,
    price: 6.01,
    qty: 250,
    time: "14:29:59",
    buyer: "ALGO...M2V8",
    seller: "ALGO...N5U3",
  },
];
