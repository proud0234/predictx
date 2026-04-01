import { useEffect, useRef, useState } from "react";
import type { Order } from "../backend";
import { MOCK_LIVE_ORDERS, MOCK_RECENT_TRADES } from "../data/mockData";
import { useActor } from "../hooks/useActor";

interface BookRow {
  price: number;
  qty: number;
  total: number;
  side: "ask" | "bid";
  matched?: boolean;
  isNew?: boolean;
}

interface RecentTrade {
  side: "buy" | "sell";
  price: number;
  qty: number;
  time: string;
}

function mergeWithMock(backendOrders: Order[]): {
  asks: BookRow[];
  bids: BookRow[];
} {
  const asks: BookRow[] = MOCK_LIVE_ORDERS.filter((o) => o.side === "ask").map(
    (o) => ({
      price: o.price,
      qty: o.qty,
      total: o.total,
      side: "ask",
    }),
  );
  const bids: BookRow[] = MOCK_LIVE_ORDERS.filter((o) => o.side === "bid").map(
    (o) => ({
      price: o.price,
      qty: o.qty,
      total: o.total,
      side: "bid",
    }),
  );

  // Merge backend orders taking priority
  for (const order of backendOrders) {
    const row: BookRow = {
      price: order.price,
      qty: Number(order.quantity),
      total: +(order.price * Number(order.quantity)).toFixed(2),
      side: order.orderType === "buy" ? "bid" : "ask",
      isNew: true,
    };
    if (row.side === "ask") {
      const idx = asks.findIndex((a) => Math.abs(a.price - row.price) < 0.001);
      if (idx >= 0) asks[idx] = row;
      else asks.push(row);
    } else {
      const idx = bids.findIndex((b) => Math.abs(b.price - row.price) < 0.001);
      if (idx >= 0) bids[idx] = row;
      else bids.push(row);
    }
  }

  asks.sort((a, b) => b.price - a.price);
  bids.sort((a, b) => b.price - a.price);

  return { asks, bids };
}

export function LiveOrderBook({ marketId }: { marketId: bigint }) {
  const { actor } = useActor();
  const [asks, setAsks] = useState<BookRow[]>([]);
  const [bids, setBids] = useState<BookRow[]>([]);
  const [matchedPrices, setMatchedPrices] = useState<Set<number>>(new Set());
  const [recentTrades, setRecentTrades] =
    useState<RecentTrade[]>(MOCK_RECENT_TRADES);
  const prevAsksRef = useRef<BookRow[]>([]);

  useEffect(() => {
    const init = mergeWithMock([]);
    setAsks(init.asks);
    setBids(init.bids);
    prevAsksRef.current = init.asks;
  }, []);

  // Poll backend every 2s
  useEffect(() => {
    const poll = async () => {
      if (!actor) return;
      try {
        const orders = await actor.getOrderBook(marketId);
        const merged = mergeWithMock(orders);
        setAsks(merged.asks);
        setBids(merged.bids);

        // Check for matches: bid.price >= ask.price
        const bestAsk = merged.asks[merged.asks.length - 1]?.price;
        const bestBid = merged.bids[0]?.price;
        if (
          bestBid !== undefined &&
          bestAsk !== undefined &&
          bestBid >= bestAsk
        ) {
          setMatchedPrices(new Set([bestAsk, bestBid]));
          // Add matched trade to recent
          const matchedQty = Math.min(
            merged.asks[merged.asks.length - 1]?.qty ?? 0,
            merged.bids[0]?.qty ?? 0,
          );
          const now = new Date();
          const t = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
          setRecentTrades((prev) => [
            { side: "buy", price: bestAsk, qty: matchedQty, time: t },
            ...prev.slice(0, 9),
          ]);
          setTimeout(() => setMatchedPrices(new Set()), 2000);
        }
      } catch {
        // silently use mock data
      }
    };

    // Add slight drift to mock orders every 2s for visual liveliness
    const drift = () => {
      setAsks((prev) =>
        prev.map((row) => ({
          ...row,
          qty: Math.max(10, row.qty + Math.floor((Math.random() - 0.5) * 20)),
          isNew: false,
        })),
      );
      setBids((prev) =>
        prev.map((row) => ({
          ...row,
          qty: Math.max(10, row.qty + Math.floor((Math.random() - 0.5) * 20)),
          isNew: false,
        })),
      );
    };

    poll();
    const interval = setInterval(() => {
      poll();
      drift();
    }, 2000);
    return () => clearInterval(interval);
  }, [actor, marketId]);

  const maxTotal = Math.max(
    ...asks.map((a) => a.total),
    ...bids.map((b) => b.total),
    1,
  );
  const bestAskPrice = asks.length > 0 ? asks[asks.length - 1].price : null;
  const bestBidPrice = bids.length > 0 ? bids[0].price : null;
  const spread =
    bestAskPrice !== null && bestBidPrice !== null
      ? (((bestAskPrice - bestBidPrice) / bestAskPrice) * 100).toFixed(3)
      : null;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-[#E9ECF5] text-sm tracking-wide">
          📊 Live Order Book
        </h3>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(46,229,157,0.1)] text-[#2EE59D] border border-[rgba(46,229,157,0.3)] animate-pulse">
          LIVE
        </span>
      </div>

      {/* Header */}
      <div className="grid grid-cols-3 text-[10px] text-[#7E859C] font-semibold mb-1 px-1">
        <span>PRICE (ALGO)</span>
        <span className="text-center">QTY</span>
        <span className="text-right">TOTAL</span>
      </div>

      {/* Scrollable book */}
      <div className="overflow-y-auto" style={{ maxHeight: 320 }}>
        {/* ASKS — displayed reversed so lowest ask is nearest spread */}
        {[...asks].reverse().map((row, i) => {
          const depthPct = (row.total / maxTotal) * 100;
          const isMatched = matchedPrices.has(row.price);
          return (
            <div
              key={`ask-${row.price}-${i}`}
              className="relative grid grid-cols-3 text-[11px] py-[3px] px-1 group transition-all"
              style={{
                animation: isMatched
                  ? "matchFlash 0.4s ease 3"
                  : row.isNew
                    ? "newOrderPop 0.4s ease"
                    : undefined,
              }}
            >
              {/* Depth bar */}
              <div
                className="absolute inset-y-0 right-0"
                style={{
                  width: `${depthPct}%`,
                  background: "rgba(255,75,110,0.08)",
                }}
              />
              <span className="relative z-10 text-[#FF4B6E] font-mono font-semibold">
                {row.price.toFixed(4)}
              </span>
              <span className="relative z-10 text-center text-[#A7AEC3] font-mono">
                {row.qty.toLocaleString()}
              </span>
              <span className="relative z-10 text-right text-[#7E859C] font-mono">
                {row.total.toFixed(2)}
              </span>
              {isMatched && (
                <span
                  className="absolute right-0 top-0 text-[9px] font-bold px-1.5 rounded z-20"
                  style={{ background: "rgba(255,200,0,0.9)", color: "#000" }}
                >
                  MATCHED ✓
                </span>
              )}
            </div>
          );
        })}

        {/* Spread indicator */}
        <div
          className="flex items-center gap-2 py-2 px-1 my-1 rounded"
          style={{ background: "rgba(38,230,255,0.05)" }}
        >
          <span className="text-[10px] text-[#7E859C]">Bid</span>
          <span className="text-xs font-bold text-[#2EE59D] font-mono">
            {bestBidPrice?.toFixed(4) ?? "—"}
          </span>
          {spread && (
            <span className="text-[10px] text-[#7E859C] mx-auto">
              Spread: <span className="text-[#26E6FF]">{spread}%</span>
            </span>
          )}
          <span className="text-xs font-bold text-[#FF4B6E] font-mono">
            {bestAskPrice?.toFixed(4) ?? "—"}
          </span>
          <span className="text-[10px] text-[#7E859C]">Ask</span>
        </div>

        {/* BIDS */}
        {bids.map((row, i) => {
          const depthPct = (row.total / maxTotal) * 100;
          const isMatched = matchedPrices.has(row.price);
          return (
            <div
              key={`bid-${row.price}-${i}`}
              className="relative grid grid-cols-3 text-[11px] py-[3px] px-1 transition-all"
              style={{
                animation: isMatched
                  ? "matchFlash 0.4s ease 3"
                  : row.isNew
                    ? "newOrderPop 0.4s ease"
                    : undefined,
              }}
            >
              <div
                className="absolute inset-y-0 right-0"
                style={{
                  width: `${depthPct}%`,
                  background: "rgba(46,229,157,0.08)",
                }}
              />
              <span className="relative z-10 text-[#2EE59D] font-mono font-semibold">
                {row.price.toFixed(4)}
              </span>
              <span className="relative z-10 text-center text-[#A7AEC3] font-mono">
                {row.qty.toLocaleString()}
              </span>
              <span className="relative z-10 text-right text-[#7E859C] font-mono">
                {row.total.toFixed(2)}
              </span>
              {isMatched && (
                <span
                  className="absolute right-0 top-0 text-[9px] font-bold px-1.5 rounded z-20"
                  style={{ background: "rgba(255,200,0,0.9)", color: "#000" }}
                >
                  MATCHED ✓
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Recent Trades */}
      <div className="mt-3 pt-3 border-t border-[rgba(170,80,255,0.15)]">
        <p className="text-[10px] font-semibold text-[#7E859C] mb-1.5 uppercase tracking-wider">
          Recent Trades
        </p>
        <div className="grid grid-cols-4 text-[9px] text-[#5A6075] mb-1 font-semibold">
          <span>SIDE</span>
          <span>PRICE</span>
          <span>QTY</span>
          <span className="text-right">TIME</span>
        </div>
        {recentTrades.slice(0, 8).map((t, i) => (
          <div
            key={`${t.time}-${i}`}
            className="grid grid-cols-4 text-[10px] py-[2px]"
          >
            <span
              className="font-bold uppercase text-[9px] px-1 rounded w-fit"
              style={{
                background:
                  t.side === "buy"
                    ? "rgba(46,229,157,0.15)"
                    : "rgba(255,75,110,0.15)",
                color: t.side === "buy" ? "#2EE59D" : "#FF4B6E",
              }}
            >
              {t.side}
            </span>
            <span className="font-mono text-[#A7AEC3]">
              {t.price.toFixed(2)}
            </span>
            <span className="font-mono text-[#A7AEC3]">{t.qty}</span>
            <span className="text-right text-[#5A6075]">{t.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
