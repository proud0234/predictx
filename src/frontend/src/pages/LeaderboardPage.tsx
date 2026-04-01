import { Calendar, Target, TrendingUp, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { MOCK_LEADERBOARD } from "../data/mockData";
import { useActor } from "../hooks/useActor";

const tierColors: Record<string, string> = {
  bronze: "#CD7F32",
  silver: "#C0C0C0",
  gold: "#FFD700",
  elite: "#A855F7",
};

const tierBg: Record<string, string> = {
  bronze: "rgba(205,127,50,0.1)",
  silver: "rgba(192,192,192,0.1)",
  gold: "rgba(255,215,0,0.1)",
  elite: "rgba(168,85,247,0.1)",
};

export function LeaderboardPage() {
  const [tab, setTab] = useState<"roi" | "accuracy" | "monthly">("roi");
  const [leaders, setLeaders] = useState(MOCK_LEADERBOARD);
  const { actor } = useActor();

  useEffect(() => {
    if (!actor) return;
    const fn =
      tab === "accuracy"
        ? actor.getTopUsersByWinRate()
        : actor.getTopUsersByPnl();
    fn.then((users) => {
      if (users && users.length > 0) {
        setLeaders(
          users.map((u, i) => ({
            rank: i + 1,
            username: u.username,
            winRate: u.winRate,
            pnl: u.pnl,
            tier: u.tier,
            trades: Number(u.totalTrades),
            reputation: u.reputation,
          })),
        );
      }
    }).catch(() => {});
  }, [actor, tab]);

  return (
    <div
      className="min-h-screen pt-20"
      style={{
        background: "linear-gradient(180deg, #070812 0%, #0B0D18 100%)",
      }}
    >
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
            <Trophy className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-[#E9ECF5]">
              Leader<span className="gradient-text">board</span>
            </h1>
            <p className="text-sm text-[#7E859C]">Top traders on PredictX</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-8">
          {(
            [
              { key: "roi", label: "Top ROI", icon: TrendingUp },
              { key: "accuracy", label: "Accuracy", icon: Target },
              { key: "monthly", label: "Monthly Winners", icon: Calendar },
            ] as const
          ).map((t) => (
            <button
              type="button"
              key={t.key}
              onClick={() => setTab(t.key)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
              style={{
                background:
                  tab === t.key ? "rgba(168,85,247,0.2)" : "rgba(20,20,35,0.5)",
                border: `1px solid ${tab === t.key ? "rgba(168,85,247,0.5)" : "rgba(170,80,255,0.2)"}`,
                color: tab === t.key ? "#A855F7" : "#A7AEC3",
              }}
            >
              <t.icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
        </div>

        {/* Top 3 podium */}
        <div className="flex items-end justify-center gap-4 mb-10">
          {[leaders[1], leaders[0], leaders[2]].map((t, pI) => {
            if (!t) return null;
            const heights = ["h-28", "h-36", "h-24"];
            const podiumRanks = [2, 1, 3];
            const rankColors = ["#C0C0C0", "#FFD700", "#CD7F32"];
            return (
              <div key={t.rank} className="flex flex-col items-center">
                <div
                  className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center text-lg font-black text-white mb-2 "
                  // ring removed
                >
                  {t.username.slice(0, 2)}
                </div>
                <p className="text-sm font-semibold text-[#E9ECF5]">
                  {t.username}
                </p>
                <p className="text-xs" style={{ color: tierColors[t.tier] }}>
                  {t.tier}
                </p>
                <div
                  className={`${heights[pI]} w-20 rounded-t-xl flex flex-col items-center justify-start pt-3 mt-3 glass`}
                  style={{
                    borderColor: rankColors[pI],
                    borderWidth: 1,
                    background: `${rankColors[pI]}15`,
                  }}
                >
                  <span
                    className="text-2xl font-black"
                    style={{ color: rankColors[pI] }}
                  >
                    #{podiumRanks[pI]}
                  </span>
                  <span className="text-xs text-[#2EE59D] font-semibold mt-1">
                    {t.winRate}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Full list */}
        <div className="glass rounded-xl neon-border overflow-hidden">
          <div className="grid grid-cols-6 gap-4 px-6 py-3 text-xs font-semibold text-[#7E859C] border-b border-[rgba(170,80,255,0.15)]">
            <span>Rank</span>
            <span className="col-span-2">Trader</span>
            <span>Win Rate</span>
            <span>P&L</span>
            <span>Trades</span>
          </div>
          {leaders.map((t, i) => (
            <div
              key={t.rank}
              className="grid grid-cols-6 gap-4 px-6 py-4 items-center border-b border-[rgba(170,80,255,0.05)] hover:bg-white/5 transition-colors"
            >
              <span
                className="text-sm font-bold"
                style={{
                  color:
                    i < 3 ? ["#FFD700", "#C0C0C0", "#CD7F32"][i] : "#7E859C",
                }}
              >
                {i < 3 ? ["🥇", "🥈", "🥉"][i] : `#${t.rank}`}
              </span>
              <div className="col-span-2 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center text-xs font-bold text-white">
                  {t.username.slice(0, 2)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#E9ECF5]">
                    {t.username}
                  </p>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full capitalize"
                    style={{
                      background: tierBg[t.tier],
                      color: tierColors[t.tier],
                      border: `1px solid ${tierColors[t.tier]}40`,
                    }}
                  >
                    {t.tier}
                  </span>
                </div>
              </div>
              <span className="text-sm font-bold text-[#2EE59D]">
                {t.winRate}%
              </span>
              <span className="text-sm font-bold text-[#26E6FF]">
                ${t.pnl.toLocaleString()}
              </span>
              <span className="text-sm text-[#A7AEC3]">{t.trades}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
