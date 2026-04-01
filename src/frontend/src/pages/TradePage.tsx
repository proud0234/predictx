import { Clock, TrendingUp } from "lucide-react";
import { useState } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import { OrderType, Variant_no_yes } from "../backend";
import {
  MOCK_MARKETS,
  MOCK_ORDER_BOOK,
  MOCK_PRICE_HISTORY,
  MOCK_TRADES,
} from "../data/mockData";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export function TradePage() {
  const [selectedMarket, setSelectedMarket] = useState(MOCK_MARKETS[0]);
  const [shareType, setShareType] = useState<"yes" | "no">("yes");
  const [orderType, setOrderType] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("100");
  const { actor } = useActor();
  const { identity } = useInternetIdentity();

  const isLoggedIn = !!identity && !identity.getPrincipal().isAnonymous();

  const price =
    shareType === "yes" ? selectedMarket.yesPrice : selectedMarket.noPrice;
  const shares = amount ? (Number.parseFloat(amount) / price).toFixed(0) : "0";
  const estimatedReturn = amount
    ? (Number.parseFloat(shares) * 1.0).toFixed(2)
    : "0";

  const handleTrade = async () => {
    if (!isLoggedIn) {
      toast.error("Please connect your wallet first");
      return;
    }
    if (!actor || !amount || Number.parseFloat(amount) <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    try {
      await actor.placeOrder(
        selectedMarket.marketId,
        orderType === "buy" ? OrderType.buy : OrderType.sell,
        shareType === "yes" ? Variant_no_yes.yes : Variant_no_yes.no,
        price,
        BigInt(Number.parseInt(shares)),
      );
      toast.success(
        `Order placed: ${orderType} ${shares} ${shareType.toUpperCase()} shares`,
      );
      setAmount("");
    } catch {
      toast.error("Failed to place order");
    }
  };

  function timeRemaining(resolutionDate: bigint): string {
    const ms = Number(resolutionDate) - Date.now();
    if (ms <= 0) return "Resolved";
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));
    return `${days}d remaining`;
  }

  return (
    <div
      className="min-h-screen pt-20"
      style={{
        background: "linear-gradient(180deg, #070812 0%, #0B0D18 100%)",
      }}
    >
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <h1 className="text-3xl font-black text-[#E9ECF5] mb-6">
          Trade <span className="gradient-text">Markets</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
          {/* Left: Market selector + Chart + Order Book */}
          <div className="space-y-4">
            {/* Market selector */}
            <div className="glass rounded-xl p-4 neon-border">
              <p className="text-xs text-[#7E859C] mb-2">Select Market</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                {MOCK_MARKETS.map((m) => (
                  <button
                    type="button"
                    key={m.marketId.toString()}
                    onClick={() => setSelectedMarket(m)}
                    className="text-left p-3 rounded-lg text-sm transition-all"
                    style={{
                      background:
                        selectedMarket.marketId === m.marketId
                          ? "rgba(168,85,247,0.15)"
                          : "rgba(20,20,35,0.5)",
                      border: `1px solid ${selectedMarket.marketId === m.marketId ? "rgba(168,85,247,0.5)" : "rgba(170,80,255,0.15)"}`,
                      color:
                        selectedMarket.marketId === m.marketId
                          ? "#E9ECF5"
                          : "#A7AEC3",
                    }}
                  >
                    <p className="truncate font-medium">{m.question}</p>
                    <div className="flex gap-2 mt-1">
                      <span className="badge-yes">
                        YES {Math.round(m.yesPrice * 100)}%
                      </span>
                      <span className="badge-no">
                        {Math.round(m.noPrice * 100)}% NO
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Market info */}
            <div className="glass rounded-xl p-5 neon-border">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-[#E9ECF5]">
                    {selectedMarket.question}
                  </h2>
                  <div className="flex items-center gap-3 mt-2 text-sm">
                    <span className="badge-yes">ACTIVE</span>
                    <span className="text-xs capitalize glass px-2 py-0.5 rounded-full text-[#26E6FF]">
                      {selectedMarket.category}
                    </span>
                    <span className="text-xs text-[#7E859C] flex items-center gap-1">
                      <Clock className="w-3 h-3" />{" "}
                      {timeRemaining(selectedMarket.resolutionDate)}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className="text-2xl font-black"
                    style={{ color: "#26E6FF" }}
                  >
                    ${selectedMarket.yesPrice.toFixed(2)}
                  </p>
                  <p className="text-xs text-[#7E859C]">YES price</p>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={MOCK_PRICE_HISTORY}>
                  <defs>
                    <linearGradient id="tradeYes" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2EE59D" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2EE59D" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="tradeNo" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF4B6E" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#FF4B6E" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="day"
                    tick={{ fill: "#7E859C", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    interval={4}
                  />
                  <YAxis
                    domain={[0, 1]}
                    tick={{ fill: "#7E859C", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${Math.round(v * 100)}%`}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(11,13,24,0.95)",
                      border: "1px solid rgba(170,80,255,0.3)",
                      borderRadius: 8,
                      color: "#E9ECF5",
                    }}
                    formatter={(v: number) => [`${Math.round(v * 100)}%`]}
                  />
                  <Area
                    type="monotone"
                    dataKey="yes"
                    stroke="#2EE59D"
                    fill="url(#tradeYes)"
                    strokeWidth={2}
                    name="YES"
                  />
                  <Area
                    type="monotone"
                    dataKey="no"
                    stroke="#FF4B6E"
                    fill="url(#tradeNo)"
                    strokeWidth={2}
                    name="NO"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Order Book */}
            <div className="glass rounded-xl p-4 neon-border">
              <h3 className="font-semibold text-[#E9ECF5] mb-3">Order Book</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between text-xs text-[#7E859C] mb-2 font-semibold">
                    <span>Price (YES)</span>
                    <span>Qty</span>
                    <span>Total</span>
                  </div>
                  {MOCK_ORDER_BOOK.asks.map((a) => (
                    <div
                      key={a.price}
                      className="relative flex justify-between text-xs py-1.5"
                    >
                      <div
                        className="absolute inset-0"
                        style={{
                          background: "rgba(255,75,110,0.05)",
                          width: `${(a.quantity / 500) * 100}%`,
                        }}
                      />
                      <span className="text-[#FF4B6E] relative z-10">
                        ${a.price.toFixed(3)}
                      </span>
                      <span className="text-[#A7AEC3] relative z-10">
                        {a.quantity}
                      </span>
                      <span className="text-[#7E859C] relative z-10">
                        ${a.total}
                      </span>
                    </div>
                  ))}
                  <div
                    className="text-center py-2 text-lg font-black"
                    style={{ color: "#26E6FF" }}
                  >
                    ${selectedMarket.yesPrice.toFixed(3)}
                  </div>
                  {MOCK_ORDER_BOOK.bids.map((b) => (
                    <div
                      key={b.price}
                      className="relative flex justify-between text-xs py-1.5"
                    >
                      <div
                        className="absolute inset-0"
                        style={{
                          background: "rgba(46,229,157,0.05)",
                          width: `${(b.quantity / 500) * 100}%`,
                        }}
                      />
                      <span className="text-[#2EE59D] relative z-10">
                        ${b.price.toFixed(3)}
                      </span>
                      <span className="text-[#A7AEC3] relative z-10">
                        {b.quantity}
                      </span>
                      <span className="text-[#7E859C] relative z-10">
                        ${b.total}
                      </span>
                    </div>
                  ))}
                </div>
                {/* Recent trades */}
                <div>
                  <div className="flex justify-between text-xs text-[#7E859C] mb-2 font-semibold">
                    <span>Trader</span>
                    <span>Shares</span>
                    <span>Time</span>
                  </div>
                  {MOCK_TRADES.map((t) => (
                    <div
                      key={t.user + t.time}
                      className="flex justify-between text-xs py-1.5"
                    >
                      <span className="text-[#A7AEC3]">
                        {t.user.slice(0, 8)}
                      </span>
                      <span
                        className={
                          t.action === "bought"
                            ? "text-[#2EE59D]"
                            : "text-[#FF4B6E]"
                        }
                      >
                        {t.shares}
                      </span>
                      <span className="text-[#7E859C]">{t.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Trade Panel */}
          <div className="space-y-4">
            <div className="glass rounded-xl p-5 neon-border">
              <h3 className="font-semibold text-[#E9ECF5] mb-4">Place Order</h3>

              {/* Buy / Sell toggle */}
              <div className="flex rounded-lg overflow-hidden border border-[rgba(170,80,255,0.2)] mb-4">
                {(["buy", "sell"] as const).map((t) => (
                  <button
                    type="button"
                    key={t}
                    onClick={() => setOrderType(t)}
                    className="flex-1 py-2 text-sm font-semibold transition-all capitalize"
                    style={{
                      background:
                        orderType === t
                          ? t === "buy"
                            ? "rgba(46,229,157,0.2)"
                            : "rgba(255,75,110,0.2)"
                          : "transparent",
                      color:
                        orderType === t
                          ? t === "buy"
                            ? "#2EE59D"
                            : "#FF4B6E"
                          : "#7E859C",
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* YES / NO toggle */}
              <p className="text-xs text-[#7E859C] mb-2">Share Type</p>
              <div className="flex rounded-lg overflow-hidden border border-[rgba(170,80,255,0.2)] mb-4">
                {(["yes", "no"] as const).map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setShareType(s)}
                    className="flex-1 py-2.5 text-sm font-bold transition-all uppercase"
                    style={{
                      background:
                        shareType === s
                          ? s === "yes"
                            ? "rgba(46,229,157,0.2)"
                            : "rgba(255,75,110,0.2)"
                          : "transparent",
                      color:
                        shareType === s
                          ? s === "yes"
                            ? "#2EE59D"
                            : "#FF4B6E"
                          : "#7E859C",
                    }}
                  >
                    {s} @ $
                    {s === "yes"
                      ? selectedMarket.yesPrice.toFixed(2)
                      : selectedMarket.noPrice.toFixed(2)}
                  </button>
                ))}
              </div>

              {/* Amount */}
              <p className="text-xs text-[#7E859C] mb-2">Amount (USD)</p>
              <div className="relative mb-4">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7E859C]">
                  $
                </span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-[rgba(20,20,35,0.8)] border border-[rgba(170,80,255,0.2)] rounded-lg pl-7 pr-3 py-3 text-[#E9ECF5] placeholder-[#7E859C] outline-none focus:border-[rgba(168,85,247,0.5)]"
                />
              </div>

              {/* Quick amounts */}
              <div className="flex gap-2 mb-4">
                {["25", "50", "100", "500"].map((v) => (
                  <button
                    type="button"
                    key={v}
                    onClick={() => setAmount(v)}
                    className="flex-1 text-xs py-1.5 rounded-lg border border-[rgba(170,80,255,0.2)] text-[#A7AEC3] hover:text-[#A855F7] hover:border-[rgba(168,85,247,0.4)] transition-colors"
                  >
                    ${v}
                  </button>
                ))}
              </div>

              {/* Summary */}
              <div className="glass rounded-lg p-3 space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-[#7E859C]">Shares</span>
                  <span className="text-[#E9ECF5] font-semibold">
                    {shares} {shareType.toUpperCase()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#7E859C]">Price per share</span>
                  <span className="text-[#E9ECF5]">${price.toFixed(3)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#7E859C]">If correct, return</span>
                  <span className="text-[#2EE59D] font-bold">
                    ${estimatedReturn}
                  </span>
                </div>
                <div className="w-full h-px bg-[rgba(170,80,255,0.15)]" />
                <div className="flex justify-between text-sm">
                  <span className="text-[#7E859C]">Total cost</span>
                  <span className="text-[#E9ECF5] font-bold">
                    ${amount || "0"}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleTrade}
                className="w-full py-3 rounded-xl text-base font-bold text-white transition-all"
                style={{
                  background:
                    orderType === "buy"
                      ? "linear-gradient(135deg, #2EE59D, #26E6FF)"
                      : "linear-gradient(135deg, #FF4B6E, #FF4FD8)",
                  boxShadow:
                    orderType === "buy"
                      ? "0 0 20px rgba(46,229,157,0.3)"
                      : "0 0 20px rgba(255,75,110,0.3)",
                }}
              >
                {isLoggedIn
                  ? `${orderType === "buy" ? "Buy" : "Sell"} ${shareType.toUpperCase()} Shares`
                  : "Connect Wallet to Trade"}
              </button>

              {!isLoggedIn && (
                <p className="text-xs text-center text-[#7E859C] mt-2">
                  Connect Internet Identity to start trading
                </p>
              )}
            </div>

            {/* Market stats */}
            <div className="glass rounded-xl p-4 neon-border">
              <h3 className="text-sm font-semibold text-[#E9ECF5] mb-3">
                Market Stats
              </h3>
              <div className="space-y-2">
                {[
                  {
                    label: "Volume",
                    value: `$${Number(selectedMarket.volume).toLocaleString()}`,
                  },
                  {
                    label: "Status",
                    value: selectedMarket.status.toUpperCase(),
                  },
                  { label: "Category", value: selectedMarket.category },
                  {
                    label: "Resolves",
                    value: timeRemaining(selectedMarket.resolutionDate),
                  },
                ].map((s) => (
                  <div key={s.label} className="flex justify-between text-sm">
                    <span className="text-[#7E859C]">{s.label}</span>
                    <span className="text-[#E9ECF5] capitalize">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
