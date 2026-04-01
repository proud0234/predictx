import { BarChart2, Clock, TrendingUp, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import { MarketCard } from "../components/MarketCard";
import { MOCK_MARKETS } from "../data/mockData";
import { useActor } from "../hooks/useActor";

const CATEGORIES = [
  "All",
  "Crypto",
  "Sports",
  "Entertainment",
  "Technology",
  "Politics",
  "Ending Soon",
];
const SORTS = ["Trending", "Volume", "Newest", "Ending Soon"];

type Page =
  | "home"
  | "markets"
  | "trade"
  | "portfolio"
  | "leaderboard"
  | "rewards"
  | "create"
  | "learn";

interface MarketsPageProps {
  onNavigate: (page: Page) => void;
}

export function MarketsPage({ onNavigate }: MarketsPageProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeSort, setActiveSort] = useState("Trending");
  const [markets, setMarkets] = useState(MOCK_MARKETS);
  const { actor } = useActor();

  useEffect(() => {
    if (!actor) return;
    actor
      .getActiveMarkets()
      .then((m) => {
        if (m && m.length > 0) setMarkets(m as unknown as typeof MOCK_MARKETS);
      })
      .catch(() => {});
  }, [actor]);

  const filtered = markets.filter((m) => {
    if (activeCategory === "All") return true;
    if (activeCategory === "Ending Soon")
      return Number(m.resolutionDate) - Date.now() < 7 * 24 * 60 * 60 * 1000;
    return m.category.toLowerCase() === activeCategory.toLowerCase();
  });

  const sorted = [...filtered].sort((a, b) => {
    if (activeSort === "Volume") return Number(b.volume) - Number(a.volume);
    if (activeSort === "Ending Soon")
      return Number(a.resolutionDate) - Number(b.resolutionDate);
    return 0;
  });

  return (
    <div
      className="min-h-screen pt-20"
      style={{
        background: "linear-gradient(180deg, #070812 0%, #0B0D18 100%)",
      }}
    >
      <div className="max-w-[1400px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black text-[#E9ECF5] mb-2">
            Prediction <span className="gradient-text">Markets</span>
          </h1>
          <p className="text-[#A7AEC3]">
            Trade YES/NO shares on real-world events
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Active Markets",
              value: markets.length.toString(),
              icon: TrendingUp,
              color: "#26E6FF",
            },
            {
              label: "Total Volume",
              value: "$2.4B",
              icon: BarChart2,
              color: "#A855F7",
            },
            {
              label: "Ending Today",
              value: "12",
              icon: Clock,
              color: "#FF4B6E",
            },
            { label: "New Today", value: "34", icon: Zap, color: "#2EE59D" },
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

        {/* Filters + Sort */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex gap-2 overflow-x-auto pb-1 flex-1">
            {CATEGORIES.map((cat) => (
              <button
                type="button"
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="text-sm px-4 py-2 rounded-full whitespace-nowrap transition-all"
                style={{
                  background:
                    activeCategory === cat
                      ? "rgba(168,85,247,0.2)"
                      : "rgba(20,20,35,0.5)",
                  border: `1px solid ${activeCategory === cat ? "rgba(168,85,247,0.5)" : "rgba(170,80,255,0.2)"}`,
                  color: activeCategory === cat ? "#A855F7" : "#A7AEC3",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
          <select
            value={activeSort}
            onChange={(e) => setActiveSort(e.target.value)}
            className="glass rounded-lg px-3 py-2 text-sm text-[#E9ECF5] border-[rgba(170,80,255,0.2)] bg-transparent outline-none"
          >
            {SORTS.map((s) => (
              <option key={s} value={s} style={{ background: "#0B0D18" }}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Markets grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sorted.map((m) => (
            <MarketCard
              key={m.marketId.toString()}
              market={m}
              onClick={() => onNavigate("trade")}
            />
          ))}
        </div>

        {sorted.length === 0 && (
          <div className="text-center py-20 text-[#7E859C]">
            <p className="text-lg">No markets found for this category.</p>
            <button
              type="button"
              className="btn-primary mt-4"
              onClick={() => onNavigate("create")}
            >
              Create First Market
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
