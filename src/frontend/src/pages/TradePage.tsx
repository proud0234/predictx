import { Clock } from "lucide-react";
import { useState } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import { OrderType, Variant_no_yes } from "../backend";
import { LiveOrderBook } from "../components/LiveOrderBook";
import { OraclePanel } from "../components/OraclePanel";
import { PeraWalletWidget } from "../components/PeraWallet";
import { PoolStats } from "../components/PoolStats";
import { MOCK_MARKETS, MOCK_OHLCV } from "../data/mockData";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const TIME_RANGES = ["1H", "4H", "1D", "1W"] as const;
type TimeRange = (typeof TIME_RANGES)[number];

function getChartData(range: TimeRange) {
  const counts: Record<TimeRange, number> = {
    "1H": 12,
    "4H": 24,
    "1D": 30,
    "1W": 28,
  };
  const n = counts[range];
  return MOCK_OHLCV.slice(-n);
}

export function TradePage() {
  const [selectedMarket, setSelectedMarket] = useState(MOCK_MARKETS[0]);
  const [shareType, setShareType] = useState<"yes" | "no">("yes");
  const [orderType, setOrderType] = useState<"buy" | "sell">("buy");
  const [amount, setAmount] = useState("100");
  const [timeRange, setTimeRange] = useState<TimeRange>("1D");
  const { actor } = useActor();
  const { identity } = useInternetIdentity();

  const isLoggedIn = !!identity && !identity.getPrincipal().isAnonymous();
  const price =
    shareType === "yes" ? selectedMarket.yesPrice : selectedMarket.noPrice;
  const shares = amount ? (Number.parseFloat(amount) / price).toFixed(0) : "0";
  const estimatedReturn = amount
    ? (Number.parseFloat(shares) * 1.0).toFixed(2)
    : "0";
  const chartData = getChartData(timeRange);

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
      <div className="max-w-[1600px] mx-auto px-4 py-6">
        {/* Page header */}
        <div className="flex items-center justify-between mb-5">
          <h1 className="text-2xl font-black text-[#E9ECF5]">
            Trade <span className="gradient-text">Terminal</span>
          </h1>
          <div className="flex items-center gap-2">
            <span
              className="text-[10px] px-3 py-1 rounded-full font-semibold"
              style={{
                background: "rgba(46,229,157,0.1)",
                color: "#2EE59D",
                border: "1px solid rgba(46,229,157,0.3)",
              }}
            >
              ● LIVE
            </span>
            <span
              className="text-[10px] px-3 py-1 rounded-full font-semibold"
              style={{
                background: "rgba(168,85,247,0.1)",
                color: "#A855F7",
                border: "1px solid rgba(168,85,247,0.3)",
              }}
            >
              🔐 ICP Secured
            </span>
          </div>
        </div>

        {/* 3-column trading terminal */}
        <div className="flex gap-4 items-start">
          {/* ── LEFT COLUMN ── */}
          <div className="flex-1 min-w-0 space-y-3">
            {/* Market selector compact */}
            <div className="glass rounded-xl p-3 neon-border">
              <p className="text-[10px] text-[#7E859C] mb-2 uppercase tracking-wider">
                Market
              </p>
              <div className="grid grid-cols-2 gap-1.5 max-h-36 overflow-y-auto">
                {MOCK_MARKETS.map((m) => (
                  <button
                    type="button"
                    key={m.marketId.toString()}
                    onClick={() => setSelectedMarket(m)}
                    data-ocid={`market.item.${Number(m.marketId)}`}
                    className="text-left p-2 rounded-lg text-xs transition-all"
                    style={{
                      background:
                        selectedMarket.marketId === m.marketId
                          ? "rgba(168,85,247,0.15)"
                          : "rgba(20,20,35,0.5)",
                      border: `1px solid ${selectedMarket.marketId === m.marketId ? "rgba(168,85,247,0.5)" : "rgba(170,80,255,0.1)"}`,
                      color:
                        selectedMarket.marketId === m.marketId
                          ? "#E9ECF5"
                          : "#A7AEC3",
                    }}
                  >
                    <p className="truncate font-medium text-[11px]">
                      {m.question}
                    </p>
                    <div className="flex gap-1 mt-0.5">
                      <span
                        className="badge-yes"
                        style={{ fontSize: 9, padding: "1px 6px" }}
                      >
                        YES {Math.round(m.yesPrice * 100)}%
                      </span>
                      <span
                        className="badge-no"
                        style={{ fontSize: 9, padding: "1px 6px" }}
                      >
                        {Math.round(m.noPrice * 100)}% NO
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* OHLCV Chart */}
            <div className="glass rounded-xl p-4 neon-border">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h2 className="text-sm font-bold text-[#E9ECF5] truncate max-w-xs">
                    {selectedMarket.question}
                  </h2>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="badge-yes" style={{ fontSize: 9 }}>
                      ACTIVE
                    </span>
                    <span className="text-[10px] text-[#26E6FF]">
                      {selectedMarket.category}
                    </span>
                    <span className="text-[10px] text-[#7E859C] flex items-center gap-1">
                      <Clock className="w-2.5 h-2.5" />{" "}
                      {timeRemaining(selectedMarket.resolutionDate)}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className="text-xl font-black font-mono"
                    style={{ color: "#26E6FF" }}
                  >
                    {selectedMarket.yesPrice.toFixed(3)}
                  </p>
                  <p className="text-[10px] text-[#7E859C]">ALGO/YES</p>
                </div>
              </div>

              {/* Time range tabs */}
              <div className="flex gap-1 mb-3">
                {TIME_RANGES.map((r) => (
                  <button
                    type="button"
                    key={r}
                    onClick={() => setTimeRange(r)}
                    data-ocid="chart.tab"
                    className="px-2.5 py-1 rounded text-[10px] font-semibold transition-all"
                    style={{
                      background:
                        timeRange === r
                          ? "rgba(168,85,247,0.25)"
                          : "rgba(20,20,35,0.5)",
                      color: timeRange === r ? "#A855F7" : "#7E859C",
                      border: `1px solid ${timeRange === r ? "rgba(168,85,247,0.4)" : "rgba(170,80,255,0.1)"}`,
                    }}
                  >
                    {r}
                  </button>
                ))}
              </div>

              {/* Candlestick chart */}
              <ResponsiveContainer width="100%" height={200}>
                <ComposedChart
                  data={chartData}
                  margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="rgba(255,255,255,0.04)"
                  />
                  <XAxis
                    dataKey="time"
                    tick={{ fill: "#7E859C", fontSize: 8 }}
                    axisLine={false}
                    tickLine={false}
                    interval={Math.floor(chartData.length / 5)}
                  />
                  <YAxis
                    yAxisId="price"
                    domain={["auto", "auto"]}
                    tick={{ fill: "#7E859C", fontSize: 8 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => v.toFixed(2)}
                  />
                  <YAxis
                    yAxisId="vol"
                    orientation="right"
                    tick={{ fill: "#7E859C", fontSize: 8 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(11,13,24,0.97)",
                      border: "1px solid rgba(170,80,255,0.3)",
                      borderRadius: 8,
                      color: "#E9ECF5",
                      fontSize: 11,
                    }}
                    formatter={(value: number, name: string) => [
                      name === "volume"
                        ? `${(value / 1000).toFixed(1)}K`
                        : value.toFixed(4),
                      name,
                    ]}
                  />
                  {/* Volume bars */}
                  <Bar
                    yAxisId="vol"
                    dataKey="volume"
                    fill="rgba(168,85,247,0.2)"
                    radius={[2, 2, 0, 0]}
                    name="volume"
                  />
                  {/* Close line */}
                  <Line
                    yAxisId="price"
                    type="monotone"
                    dataKey="close"
                    stroke="#26E6FF"
                    strokeWidth={1.5}
                    dot={false}
                    name="close"
                  />
                  {/* High line */}
                  <Line
                    yAxisId="price"
                    type="monotone"
                    dataKey="high"
                    stroke="rgba(46,229,157,0.4)"
                    strokeWidth={1}
                    dot={false}
                    strokeDasharray="3 3"
                    name="high"
                  />
                  {/* Low line */}
                  <Line
                    yAxisId="price"
                    type="monotone"
                    dataKey="low"
                    stroke="rgba(255,75,110,0.4)"
                    strokeWidth={1}
                    dot={false}
                    strokeDasharray="3 3"
                    name="low"
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Oracle Panel */}
            <div className="glass rounded-xl p-4 neon-border">
              <OraclePanel />
            </div>
          </div>

          {/* ── CENTER COLUMN — Live Order Book ── */}
          <div
            className="glass rounded-xl p-4 neon-border flex-shrink-0"
            style={{ minWidth: 320, maxWidth: 380, width: 350 }}
          >
            <LiveOrderBook marketId={selectedMarket.marketId} />
          </div>

          {/* ── RIGHT COLUMN ── */}
          <div className="flex-shrink-0 space-y-3" style={{ width: 300 }}>
            {/* Pera Wallet */}
            <div className="glass rounded-xl p-3 neon-border">
              <p className="text-[10px] text-[#7E859C] mb-2 uppercase tracking-wider">
                Wallet
              </p>
              <PeraWalletWidget />
            </div>

            {/* Place Order */}
            <div className="glass rounded-xl p-4 neon-border">
              <h3 className="font-bold text-[#E9ECF5] mb-3 text-sm">
                Place Order
              </h3>

              {/* Buy/Sell toggle */}
              <div
                className="flex rounded-lg overflow-hidden mb-3"
                style={{ border: "1px solid rgba(170,80,255,0.2)" }}
              >
                {(["buy", "sell"] as const).map((t) => (
                  <button
                    type="button"
                    key={t}
                    onClick={() => setOrderType(t)}
                    data-ocid={`order.${t === "buy" ? "primary" : "secondary"}_button`}
                    className="flex-1 py-2 text-xs font-bold transition-all capitalize"
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

              {/* YES/NO */}
              <p className="text-[10px] text-[#7E859C] mb-1.5">Share Type</p>
              <div
                className="flex rounded-lg overflow-hidden mb-3"
                style={{ border: "1px solid rgba(170,80,255,0.2)" }}
              >
                {(["yes", "no"] as const).map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => setShareType(s)}
                    data-ocid={`order.${s}_button`}
                    className="flex-1 py-2 text-xs font-bold transition-all uppercase"
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
                    {s} @{" "}
                    {s === "yes"
                      ? selectedMarket.yesPrice.toFixed(2)
                      : selectedMarket.noPrice.toFixed(2)}{" "}
                    ALGO
                  </button>
                ))}
              </div>

              {/* Amount */}
              <p className="text-[10px] text-[#7E859C] mb-1.5">Amount (ALGO)</p>
              <div className="relative mb-3">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  data-ocid="order.input"
                  className="w-full bg-[rgba(20,20,35,0.8)] border border-[rgba(170,80,255,0.2)] rounded-lg px-3 py-2.5 text-[#E9ECF5] placeholder-[#7E859C] outline-none focus:border-[rgba(168,85,247,0.5)] text-sm font-mono"
                />
              </div>

              {/* Quick amounts */}
              <div className="flex gap-1.5 mb-3">
                {["10", "50", "100", "500"].map((v) => (
                  <button
                    type="button"
                    key={v}
                    onClick={() => setAmount(v)}
                    className="flex-1 text-[10px] py-1 rounded border border-[rgba(170,80,255,0.2)] text-[#A7AEC3] hover:text-[#A855F7] hover:border-[rgba(168,85,247,0.4)] transition-colors"
                  >
                    {v}
                  </button>
                ))}
              </div>

              {/* Summary */}
              <div className="glass rounded-lg p-2.5 space-y-1.5 mb-3">
                {[
                  {
                    label: "Shares",
                    value: `${shares} ${shareType.toUpperCase()}`,
                  },
                  { label: "Price/share", value: `${price.toFixed(3)} ALGO` },
                  {
                    label: "Return",
                    value: `${estimatedReturn} ALGO`,
                    highlight: true,
                  },
                  {
                    label: "Total",
                    value: `${amount || "0"} ALGO`,
                    bold: true,
                  },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex justify-between text-[11px]"
                  >
                    <span className="text-[#7E859C]">{row.label}</span>
                    <span
                      className="font-mono font-semibold"
                      style={{
                        color: row.highlight
                          ? "#2EE59D"
                          : row.bold
                            ? "#E9ECF5"
                            : "#A7AEC3",
                      }}
                    >
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={handleTrade}
                data-ocid="order.submit_button"
                className="w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all"
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
            </div>

            {/* Pool Stats */}
            <div className="glass rounded-xl p-4 neon-border">
              <PoolStats
                yesPool={Number(selectedMarket.volume) * 0.67}
                noPool={Number(selectedMarket.volume) * 0.33}
                resolved={false}
                winnings={342.5}
              />
            </div>

            {/* Market stats */}
            <div className="glass rounded-xl p-3 neon-border">
              <h3 className="text-xs font-semibold text-[#E9ECF5] mb-2">
                Market Stats
              </h3>
              <div className="space-y-1.5">
                {[
                  {
                    label: "Volume",
                    value: `${Number(selectedMarket.volume).toLocaleString()} ALGO`,
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
                  <div
                    key={s.label}
                    className="flex justify-between text-[11px]"
                  >
                    <span className="text-[#7E859C]">{s.label}</span>
                    <span className="text-[#E9ECF5] capitalize font-medium">
                      {s.value}
                    </span>
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
