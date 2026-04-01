# PredictX — Live Orderbook, Oracle System & Pera Wallet

## Current State
TradePage exists with a static mock orderbook (MOCK_ORDER_BOOK data), a price chart, and a trade placement panel. Backend has `placeOrder`, `getOrderBook`, `cancelOrder`, `getTradeHistory` APIs. The orderbook display is purely visual with no live matching, no oracle, no Pera Wallet.

## Requested Changes (Diff)

### Add
- **Live Orderbook with Order Matching**: Real-time orderbook panel showing buy/sell orders at each price level. When a buy order matches a sell order at the same price (e.g., 6 ALGO), visually highlight the match and show a "MATCHED" flash animation. Poll `getOrderBook` every 2 seconds. Show asks (red, sellers) above spread and bids (green, buyers) below. Show depth bars behind each row.
- **Pera Wallet Integration**: "Connect Pera Wallet" button in the trade panel and navbar. Show wallet address + ALGO balance once connected. Use `@perawallet/connect` mock-integration (simulate connect/disconnect since real SDK can't run on ICP; show realistic UI with address display).
- **Multi-Source Oracle Panel**: New section in TradePage showing 3 oracle sources (Binance, CoinGecko, Chainlink) each with a live-updating price feed and timestamp. Show consensus price derived from average. Flash price green/red on update. Include a small bar chart showing spread between sources.
- **Automated Pool Stats Panel**: Show total pool size, YES pool, NO pool, current odds derived from pool ratio. Update when orders are placed.
- **Winning Claims Widget**: After market resolution, show claimable winnings for the user with a "Claim Winnings" button.
- **Enhanced Price Chart**: Add candlestick-style OHLCV chart using recharts ComposedChart with volume bars at the bottom. Add time range selector (1H, 4H, 1D, 1W).
- **Order History Tab**: Below orderbook, add recent matched trades feed with buyer/seller indicators, price, quantity, and time.
- **Spread Indicator**: Show the spread (difference between best ask and best bid) prominently between the two halves of the orderbook.

### Modify
- **TradePage**: Reorganize into a professional trading terminal layout: left column (chart + oracle panel), center (orderbook + recent trades), right (trade panel + pool stats + claim widget). Make orderbook scroll independently.
- **Order Book data**: Replace MOCK_ORDER_BOOK with live data from `actor.getOrderBook(marketId)` polled every 2 seconds, supplemented with generated mock orders to fill the book visually.
- **Navbar**: Add Pera Wallet connect button next to existing wallet/identity button.

### Remove
- Static MOCK_ORDER_BOOK rendering in favor of live data

## Implementation Plan
1. Create `src/frontend/src/components/LiveOrderBook.tsx` — live orderbook component with ask/bid depth bars, spread indicator, match flash animations, polling backend
2. Create `src/frontend/src/components/OraclePanel.tsx` — 3-source oracle feeds with consensus price, animated price updates
3. Create `src/frontend/src/components/PoolStats.tsx` — YES/NO pool sizes, odds, claim winnings
4. Create `src/frontend/src/components/PeraWallet.tsx` — connect button, address display, simulated wallet state
5. Update `src/frontend/src/pages/TradePage.tsx` — professional 3-column trading terminal layout integrating all new components
6. Update MOCK data to include more realistic orderbook data for visual fill
