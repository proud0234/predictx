import {
  BarChart2,
  TrendingDown,
  TrendingUp,
  Trophy,
  Wallet,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { MOCK_MARKETS, MOCK_TRADES } from "../data/mockData";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const MOCK_POSITIONS = [
  {
    market: "Will BTC exceed $100K?",
    type: "YES",
    shares: 250,
    avgPrice: 0.58,
    currentPrice: 0.67,
    category: "crypto",
  },
  {
    market: "Will ETH reach $8K?",
    type: "NO",
    shares: 150,
    avgPrice: 0.51,
    currentPrice: 0.48,
    category: "crypto",
  },
  {
    market: "AI model surpasses GPT-5?",
    type: "YES",
    shares: 400,
    avgPrice: 0.55,
    currentPrice: 0.61,
    category: "technology",
  },
  {
    market: "Lakers win NBA?",
    type: "NO",
    shares: 200,
    avgPrice: 0.62,
    currentPrice: 0.66,
    category: "sports",
  },
];

const portfolioHistory = Array.from({ length: 14 }, (_, i) => ({
  day: `Day ${i + 1}`,
  value: 20000 + Math.sin(i * 0.5) * 2000 + i * 340,
}));

export function PortfolioPage() {
  const { identity } = useInternetIdentity();
  const { actor } = useActor();
  const [positions, setPositions] = useState(MOCK_POSITIONS);
  const isLoggedIn = !!identity && !identity.getPrincipal().isAnonymous();

  useEffect(() => {
    if (!actor || !identity || identity.getPrincipal().isAnonymous()) return;
    actor
      .getUserPositions(identity.getPrincipal())
      .then((ps) => {
        if (ps && ps.length > 0) {
          setPositions(
            ps.map((p) => ({
              market:
                MOCK_MARKETS.find((m) => m.marketId === p.marketId)?.question ||
                "Unknown Market",
              type: p.shareType === "yes" ? "YES" : "NO",
              shares: Number(p.quantity),
              avgPrice: p.avgPrice,
              currentPrice:
                MOCK_MARKETS.find((m) => m.marketId === p.marketId)?.yesPrice ||
                0,
              category:
                MOCK_MARKETS.find((m) => m.marketId === p.marketId)?.category ||
                "",
            })),
          );
        }
      })
      .catch(() => {});
  }, [actor, identity]);

  const totalValue = positions.reduce(
    (acc, p) => acc + p.shares * p.currentPrice,
    0,
  );
  const totalCost = positions.reduce(
    (acc, p) => acc + p.shares * p.avgPrice,
    0,
  );
  const totalPnL = totalValue - totalCost;
  const pnlPct = totalCost > 0 ? (totalPnL / totalCost) * 100 : 0;

  return (
    <div
      className="min-h-screen pt-20"
      style={{
        background: "linear-gradient(180deg, #070812 0%, #0B0D18 100%)",
      }}
    >
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <h1 className="text-3xl font-black text-[#E9ECF5] mb-6">
          My <span className="gradient-text">Portfolio</span>
        </h1>

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Total Value",
              value: `$${totalValue.toFixed(2)}`,
              icon: Wallet,
              color: "#26E6FF",
            },
            {
              label: "Total P&L",
              value: `${totalPnL >= 0 ? "+" : ""}$${totalPnL.toFixed(2)}`,
              icon: totalPnL >= 0 ? TrendingUp : TrendingDown,
              color: totalPnL >= 0 ? "#2EE59D" : "#FF4B6E",
            },
            {
              label: "P&L %",
              value: `${pnlPct >= 0 ? "+" : ""}${pnlPct.toFixed(1)}%`,
              icon: BarChart2,
              color: pnlPct >= 0 ? "#2EE59D" : "#FF4B6E",
            },
            {
              label: "Open Positions",
              value: positions.length.toString(),
              icon: Trophy,
              color: "#A855F7",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="glass rounded-xl p-4 neon-border flex items-center gap-3"
            >
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: `${s.color}20` }}
              >
                <s.icon className="w-4 h-4" style={{ color: s.color }} />
              </div>
              <div>
                <p className="text-xl font-black" style={{ color: s.color }}>
                  {s.value}
                </p>
                <p className="text-xs text-[#7E859C]">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
          {/* Left */}
          <div className="space-y-4">
            {/* Portfolio chart */}
            <div className="glass rounded-xl p-5 neon-border">
              <h3 className="font-semibold text-[#E9ECF5] mb-4">
                Portfolio Value (14 days)
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={portfolioHistory}>
                  <defs>
                    <linearGradient id="portGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#A855F7" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#A855F7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="day"
                    tick={{ fill: "#7E859C", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    interval={2}
                  />
                  <YAxis
                    tick={{ fill: "#7E859C", fontSize: 10 }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `$${(v / 1000).toFixed(0)}K`}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "rgba(11,13,24,0.95)",
                      border: "1px solid rgba(170,80,255,0.3)",
                      borderRadius: 8,
                      color: "#E9ECF5",
                    }}
                    formatter={(v: number) => [`$${v.toFixed(2)}`]}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#A855F7"
                    fill="url(#portGrad)"
                    strokeWidth={2}
                    name="Value"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Positions table */}
            <div className="glass rounded-xl p-5 neon-border">
              <h3 className="font-semibold text-[#E9ECF5] mb-4">
                Open Positions
              </h3>
              {!isLoggedIn && (
                <div className="text-center py-8">
                  <Wallet className="w-8 h-8 mx-auto mb-2 text-[#7E859C]" />
                  <p className="text-[#7E859C]">
                    Connect your wallet to view positions
                  </p>
                </div>
              )}
              {isLoggedIn && (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-[#7E859C] border-b border-[rgba(170,80,255,0.1)]">
                        <th className="pb-3 font-medium">Market</th>
                        <th className="pb-3 font-medium">Type</th>
                        <th className="pb-3 font-medium">Shares</th>
                        <th className="pb-3 font-medium">Avg Price</th>
                        <th className="pb-3 font-medium">Current</th>
                        <th className="pb-3 font-medium">P&L</th>
                      </tr>
                    </thead>
                    <tbody>
                      {positions.map((p) => {
                        const pnl = (p.currentPrice - p.avgPrice) * p.shares;
                        return (
                          <tr
                            key={p.market + p.type}
                            className="border-b border-[rgba(170,80,255,0.05)] hover:bg-white/5 transition-colors"
                          >
                            <td className="py-3 text-[#E9ECF5] max-w-[200px] truncate">
                              {p.market}
                            </td>
                            <td className="py-3">
                              <span
                                className={
                                  p.type === "YES" ? "badge-yes" : "badge-no"
                                }
                              >
                                {p.type}
                              </span>
                            </td>
                            <td className="py-3 text-[#A7AEC3]">{p.shares}</td>
                            <td className="py-3 text-[#A7AEC3]">
                              ${p.avgPrice.toFixed(3)}
                            </td>
                            <td className="py-3 text-[#E9ECF5]">
                              ${p.currentPrice.toFixed(3)}
                            </td>
                            <td
                              className="py-3 font-semibold"
                              style={{
                                color: pnl >= 0 ? "#2EE59D" : "#FF4B6E",
                              }}
                            >
                              {pnl >= 0 ? "+" : ""}${pnl.toFixed(2)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Trade history */}
            <div className="glass rounded-xl p-5 neon-border">
              <h3 className="font-semibold text-[#E9ECF5] mb-4">
                Recent Trades
              </h3>
              <div className="space-y-2">
                {MOCK_TRADES.map((t) => (
                  <div
                    key={t.user + t.time}
                    className="flex items-center justify-between py-2 border-b border-[rgba(170,80,255,0.05)]"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`badge-${t.action === "bought" ? "yes" : "no"}`}
                      >
                        {t.action === "bought" ? "BUY" : "SELL"}
                      </span>
                      <div>
                        <p className="text-sm text-[#E9ECF5]">{t.shares}</p>
                        <p className="text-xs text-[#7E859C]">{t.market}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-[#E9ECF5]">
                        ${t.value.toFixed(2)}
                      </p>
                      <p className="text-xs text-[#7E859C]">{t.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Rewards */}
          <div className="space-y-4">
            <div className="glass rounded-xl p-5 neon-border">
              <h3 className="font-semibold text-[#E9ECF5] mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4" style={{ color: "#FFD700" }} /> Rewards
                Summary
              </h3>
              <div className="space-y-4">
                {[
                  {
                    label: "Early Predictor Points",
                    value: "2,450",
                    color: "#FFD700",
                  },
                  { label: "Streak Bonus", value: "840", color: "#FF4FD8" },
                  {
                    label: "Referral Earnings",
                    value: "$125",
                    color: "#2EE59D",
                  },
                  { label: "Weekly Challenge", value: "320", color: "#26E6FF" },
                ].map((r) => (
                  <div key={r.label} className="flex justify-between">
                    <span className="text-sm text-[#A7AEC3]">{r.label}</span>
                    <span
                      className="text-sm font-bold"
                      style={{ color: r.color }}
                    >
                      {r.value}
                    </span>
                  </div>
                ))}
                <div className="w-full h-px bg-[rgba(170,80,255,0.15)]" />
                <div className="flex justify-between">
                  <span className="text-sm font-semibold text-[#E9ECF5]">
                    Total Points
                  </span>
                  <span className="text-lg font-black gradient-text">
                    3,610
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="btn-primary w-full mt-4 py-2 text-sm"
              >
                Claim Rewards
              </button>
            </div>

            <div className="glass rounded-xl p-5 neon-border">
              <h3 className="text-sm font-semibold text-[#E9ECF5] mb-3">
                Your Tier
              </h3>
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center mx-auto mb-3">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <p className="text-2xl font-black" style={{ color: "#FFD700" }}>
                  Gold
                </p>
                <p className="text-xs text-[#7E859C] mt-1">
                  8,200 / 15,000 points to Elite
                </p>
                <div className="mt-3 h-2 rounded-full bg-[rgba(255,215,0,0.1)]">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: "55%",
                      background: "linear-gradient(90deg, #FFD700, #FF8C00)",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
