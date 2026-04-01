import { Check, Copy, Flame, Trophy, Users, Zap } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const CHALLENGES = [
  {
    title: "Trade 10 Markets",
    description: "Place trades on 10 different markets",
    progress: 6,
    total: 10,
    reward: "500 pts",
    color: "#26E6FF",
  },
  {
    title: "Achieve 70% Win Rate",
    description: "Maintain 70%+ accuracy this week",
    progress: 7,
    total: 10,
    reward: "1000 pts",
    color: "#2EE59D",
  },
  {
    title: "Refer 3 Friends",
    description: "Get 3 friends to join PredictX",
    progress: 1,
    total: 3,
    reward: "$75",
    color: "#A855F7",
  },
  {
    title: "Early Bird Trader",
    description: "Trade within 1hr of market creation x5",
    progress: 3,
    total: 5,
    reward: "750 pts",
    color: "#FFD700",
  },
];

export function RewardsPage() {
  const [copied, setCopied] = useState(false);
  const referralLink = "https://predictx.icp/ref/USER123";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success("Referral link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className="min-h-screen pt-20"
      style={{
        background: "linear-gradient(180deg, #070812 0%, #0B0D18 100%)",
      }}
    >
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        <h1 className="text-3xl font-black text-[#E9ECF5] mb-2">
          Rewards <span className="gradient-text">Hub</span>
        </h1>
        <p className="text-[#A7AEC3] mb-8">
          Earn points, bonuses, and real rewards for your trading activity
        </p>

        {/* Total Points */}
        <div
          className="glass rounded-2xl p-6 neon-border mb-8"
          style={{
            background:
              "linear-gradient(135deg, rgba(168,85,247,0.1), rgba(38,230,255,0.05))",
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#A7AEC3]">Total Points Balance</p>
              <p className="text-5xl font-black gradient-text mt-1">3,610</p>
              <p className="text-sm text-[#7E859C] mt-1">
                ~$36.10 USD equivalent
              </p>
            </div>
            <button type="button" className="btn-primary px-6 py-3">
              Claim All Rewards
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Early Predictor Bonus */}
          <div className="glass rounded-xl p-6 neon-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-yellow-400" />
              </div>
              <div>
                <h3 className="font-bold text-[#E9ECF5]">
                  Early Predictor Bonus
                </h3>
                <p className="text-xs text-[#7E859C]">Trade early, earn more</p>
              </div>
              <span className="ml-auto text-3xl font-black text-yellow-400">
                2.5x
              </span>
            </div>
            <p className="text-sm text-[#A7AEC3] mb-4">
              Be among the first traders on a new market and earn up to 2.5x
              bonus multiplier. The bonus decreases as more traders enter.
            </p>
            <div className="space-y-2">
              {[
                {
                  label: "First 10 traders",
                  multiplier: "2.5x",
                  color: "#FFD700",
                },
                {
                  label: "Traders 11-50",
                  multiplier: "1.8x",
                  color: "#2EE59D",
                },
                {
                  label: "Traders 51-200",
                  multiplier: "1.3x",
                  color: "#26E6FF",
                },
                { label: "All others", multiplier: "1.0x", color: "#A7AEC3" },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex justify-between items-center py-2 border-b border-[rgba(170,80,255,0.05)]"
                >
                  <span className="text-sm text-[#A7AEC3]">{row.label}</span>
                  <span
                    className="text-sm font-bold"
                    style={{ color: row.color }}
                  >
                    {row.multiplier}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Streak Rewards */}
          <div className="glass rounded-xl p-6 neon-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                <Flame className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <h3 className="font-bold text-[#E9ECF5]">Streak Rewards</h3>
                <p className="text-xs text-[#7E859C]">
                  Trade daily, stack bonuses
                </p>
              </div>
              <span className="ml-auto text-3xl font-black text-orange-400">
                🔥 7
              </span>
            </div>
            <p className="text-sm text-[#A7AEC3] mb-4">
              Your current streak:{" "}
              <span className="font-bold text-orange-400">7 days</span>. Keep
              trading daily to reach the next milestone!
            </p>
            <div className="space-y-3">
              {[
                { days: 3, bonus: "+50 pts/day", done: true },
                { days: 7, bonus: "+100 pts/day", done: true },
                { days: 14, bonus: "+200 pts/day + badge", done: false },
                { days: 30, bonus: "+500 pts/day + NFT", done: false },
              ].map((m) => (
                <div key={m.days} className="flex items-center gap-3">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center"
                    style={{
                      background: m.done
                        ? "rgba(46,229,157,0.2)"
                        : "rgba(20,20,35,0.8)",
                      border: `1px solid ${m.done ? "#2EE59D" : "rgba(170,80,255,0.2)"}`,
                    }}
                  >
                    {m.done && <Check className="w-3 h-3 text-[#2EE59D]" />}
                  </div>
                  <span className="text-sm text-[#A7AEC3]">
                    {m.days} day streak
                  </span>
                  <span
                    className="ml-auto text-sm font-semibold"
                    style={{ color: m.done ? "#2EE59D" : "#7E859C" }}
                  >
                    {m.bonus}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <div className="flex justify-between text-xs text-[#7E859C] mb-1">
                <span>Progress to 14 days</span>
                <span>7/14</span>
              </div>
              <div className="h-2 rounded-full bg-[rgba(255,79,216,0.1)]">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: "50%",
                    background: "linear-gradient(90deg, #FF4FD8, #A855F7)",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Referral Program */}
          <div className="glass rounded-xl p-6 neon-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                <Users className="w-5 h-5" style={{ color: "#26E6FF" }} />
              </div>
              <div>
                <h3 className="font-bold text-[#E9ECF5]">Referral Program</h3>
                <p className="text-xs text-[#7E859C]">Earn $25 per referral</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { label: "Referrals", value: "1", color: "#26E6FF" },
                { label: "Earned", value: "$25", color: "#2EE59D" },
                { label: "Pending", value: "$50", color: "#FFD700" },
              ].map((s) => (
                <div key={s.label} className="glass rounded-lg p-3 text-center">
                  <p className="text-xl font-black" style={{ color: s.color }}>
                    {s.value}
                  </p>
                  <p className="text-xs text-[#7E859C]">{s.label}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-[#7E859C] mb-2">Your referral link:</p>
            <div className="flex gap-2">
              <input
                readOnly
                value={referralLink}
                className="flex-1 bg-[rgba(20,20,35,0.8)] border border-[rgba(170,80,255,0.2)] rounded-lg px-3 py-2 text-xs text-[#A7AEC3] outline-none"
              />
              <button
                type="button"
                onClick={handleCopy}
                className="btn-primary px-3 py-2 text-sm flex items-center gap-1"
              >
                {copied ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Weekly Challenges */}
          <div className="glass rounded-xl p-6 neon-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="font-bold text-[#E9ECF5]">Weekly Challenges</h3>
                <p className="text-xs text-[#7E859C]">Resets every Monday</p>
              </div>
            </div>
            <div className="space-y-4">
              {CHALLENGES.map((c) => (
                <div key={c.title}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-semibold text-[#E9ECF5]">
                      {c.title}
                    </span>
                    <span className="font-bold" style={{ color: c.color }}>
                      {c.reward}
                    </span>
                  </div>
                  <p className="text-xs text-[#7E859C] mb-2">{c.description}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 rounded-full bg-[rgba(170,80,255,0.1)]">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${(c.progress / c.total) * 100}%`,
                          background: `linear-gradient(90deg, ${c.color}, ${c.color}99)`,
                        }}
                      />
                    </div>
                    <span className="text-xs text-[#7E859C] shrink-0">
                      {c.progress}/{c.total}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
