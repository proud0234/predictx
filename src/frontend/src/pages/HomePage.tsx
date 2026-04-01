import {
  Activity,
  ArrowRight,
  BarChart2,
  Flame,
  Star,
  TrendingUp,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { MarketCard } from "../components/MarketCard";
import {
  MOCK_LEADERBOARD,
  MOCK_MARKETS,
  MOCK_ORDER_BOOK,
  MOCK_PRICE_HISTORY,
  MOCK_TRADES,
} from "../data/mockData";
import { useActor } from "../hooks/useActor";

type Page =
  | "home"
  | "markets"
  | "trade"
  | "portfolio"
  | "leaderboard"
  | "rewards"
  | "create"
  | "learn";

interface HomePageProps {
  onNavigate: (page: Page) => void;
}

const SLIDES = [
  {
    id: 0,
    isVideo: true,
    videoSrc:
      "/assets/pixverse_v6_image_text_360p_create_a_10second_2-019d44d9-1ae7-71cb-bb8e-160825f70820.mp4",
    headline: "PREDICT.",
    accentWord: "TRADE.",
    subAccent: "EARN.",
    sub: "The future of decentralized forecasting on the Internet Computer",
    btns: ["Start Trading", "Create Market", "Explore Markets"],
    gradient: "from-purple-900/50 via-transparent to-cyan-900/30",
  },
  {
    id: 1,
    isVideo: true,
    videoSrc:
      "/assets/firefly_create_an_ultra-realistic_cinematic_video_of_a_modern_cryptocurrency_trading_office_at_night-019d469d-606d-77b8-b2c8-d6cf9336b1f4.mp4",
    headline: "NEXT-GEN",
    accentWord: "TRADING FLOOR",
    sub: "Professional-grade prediction markets powered by Internet Computer blockchain",
    btns: ["Start Trading", "Explore Markets"],
    gradient: "from-blue-900/60 via-transparent to-purple-900/30",
  },
  {
    id: 2,
    isVideo: false,
    headline: "LIVE PREDICTION",
    accentWord: "MARKETS",
    sub: "Trade on thousands of real-world events in real-time",
    btns: ["View Markets", "Start Trading"],
    gradient: "from-blue-900/60 via-transparent to-purple-900/30",
    bgColor: "#050920",
  },
  {
    id: 3,
    isVideo: false,
    headline: "REAL-TIME",
    accentWord: "ORDER BOOK",
    sub: "Professional trading tools with live bids and asks",
    btns: ["Open Trade", "Learn More"],
    gradient: "from-cyan-900/60 via-transparent to-blue-900/30",
    bgColor: "#040d1a",
  },
  {
    id: 4,
    isVideo: false,
    headline: "SOCIAL",
    accentWord: "TRADING FEED",
    sub: "Follow top traders, copy strategies, earn together",
    btns: ["Join Community", "See Feed"],
    gradient: "from-pink-900/60 via-transparent to-purple-900/30",
    bgColor: "#0d0418",
  },
  {
    id: 5,
    isVideo: false,
    headline: "EARN",
    accentWord: "DAILY REWARDS",
    sub: "Early predictor bonuses, streaks, and weekly challenges",
    btns: ["View Rewards", "See Leaderboard"],
    gradient: "from-yellow-900/40 via-transparent to-purple-900/40",
    bgColor: "#0a0a10",
  },
];

const STATS = [
  { label: "Total Volume", value: "$2.4B", icon: BarChart2, color: "#26E6FF" },
  {
    label: "Active Markets",
    value: "1,247",
    icon: TrendingUp,
    color: "#A855F7",
  },
  { label: "Total Traders", value: "89,432", icon: Users, color: "#2EE59D" },
  { label: "24h Trades", value: "12,891", icon: Activity, color: "#FF4FD8" },
];

const TICKER_ITEMS = [
  { label: "BTC/YES", pct: "67%", up: true },
  { label: "ETH/YES", pct: "43%", up: false },
  { label: "AI AGI/YES", pct: "89%", up: true },
  { label: "SOL/YES", pct: "55%", up: true },
  { label: "TRUMP 2028/YES", pct: "71%", up: true },
  { label: "DOGE/YES", pct: "38%", up: false },
  { label: "XRP/YES", pct: "62%", up: true },
  { label: "AAPL $250/YES", pct: "48%", up: false },
  { label: "FED RATE CUT/YES", pct: "81%", up: true },
  { label: "BNB/YES", pct: "57%", up: true },
  { label: "AVAX/YES", pct: "33%", up: false },
  { label: "LINK/YES", pct: "74%", up: true },
];

const tierColors: Record<string, string> = {
  bronze: "#CD7F32",
  silver: "#C0C0C0",
  gold: "#FFD700",
  elite: "#A855F7",
};

function Particle({ style }: { style: React.CSSProperties }) {
  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        width: 3,
        height: 3,
        background: "rgba(168,85,247,0.6)",
        animation: `particle-drift ${8 + Math.random() * 8}s linear infinite`,
        ...style,
      }}
    />
  );
}

export function HomePage({ onNavigate }: HomePageProps) {
  const [slide, setSlide] = useState(0);
  const [marketFilter, setMarketFilter] = useState("all");
  const [blockHeight, setBlockHeight] = useState(14891234);
  const { actor } = useActor();
  const slideRef = useRef<NodeJS.Timeout | null>(null);

  // Slideshow auto-play
  useEffect(() => {
    slideRef.current = setInterval(() => {
      setSlide((s) => (s + 1) % SLIDES.length);
    }, 5000);
    return () => {
      if (slideRef.current) clearInterval(slideRef.current);
    };
  }, []);

  // Animating block height counter
  useEffect(() => {
    const t = setInterval(() => {
      setBlockHeight((h) => h + Math.floor(Math.random() * 3 + 1));
    }, 1500);
    return () => clearInterval(t);
  }, []);

  // Load markets from backend
  useEffect(() => {
    if (!actor) return;
    actor
      .getActiveMarkets()
      .then(() => {})
      .catch(() => {});
  }, [actor]);

  const currentSlide = SLIDES[slide];
  const filteredMarkets =
    marketFilter === "all"
      ? MOCK_MARKETS
      : MOCK_MARKETS.filter((m) => m.category === marketFilter);

  // Particles
  const particles = Array.from({ length: 20 }, (_, i) => ({
    left: `${(i * 5.1) % 100}%`,
    animationDelay: `${(i * 0.7) % 8}s`,
    opacity: 0.4 + (i % 4) * 0.15,
  }));

  return (
    <div
      className="min-h-screen"
      style={{
        background: "linear-gradient(180deg, #070812 0%, #0B0D18 100%)",
      }}
    >
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes orb-float {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.6; }
          50% { transform: translateY(-30px) scale(1.05); opacity: 0.9; }
        }
        @keyframes orb-float2 {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.4; }
          50% { transform: translateY(20px) scale(0.95); opacity: 0.7; }
        }
        @keyframes orb-pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.1); }
        }
        .ticker-track { animation: marquee 30s linear infinite; }
        .ticker-track:hover { animation-play-state: paused; }
      `}</style>

      {/* TICKER BAR */}
      <div
        className="fixed top-16 left-0 right-0 z-40 overflow-hidden"
        style={{
          background: "rgba(7,8,18,0.95)",
          borderBottom: "1px solid rgba(168,85,247,0.25)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div className="flex items-center h-8">
          <div
            className="shrink-0 px-3 text-xs font-bold tracking-widest flex items-center gap-1.5"
            style={{
              color: "#A855F7",
              borderRight: "1px solid rgba(168,85,247,0.3)",
              height: "100%",
              background: "rgba(168,85,247,0.08)",
            }}
          >
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            LIVE
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="ticker-track flex gap-8 whitespace-nowrap w-max">
              {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
                <span
                  key={`ticker-${i}-${item.label}`}
                  className="inline-flex items-center gap-1.5 text-xs px-2"
                >
                  <span className="text-[#A7AEC3] font-medium">
                    {item.label}
                  </span>
                  <span
                    className="font-bold"
                    style={{ color: item.up ? "#2EE59D" : "#FF4B6E" }}
                  >
                    {item.pct} {item.up ? "↑" : "↓"}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ===================== HERO SLIDESHOW ===================== */}
      <section className="relative h-screen overflow-hidden pt-8">
        {/* Glowing Orbs */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: 600,
            height: 600,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(168,85,247,0.25) 0%, transparent 70%)",
            top: "-150px",
            left: "-100px",
            animation: "orb-float 8s ease-in-out infinite",
            filter: "blur(40px)",
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            width: 500,
            height: 500,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(38,230,255,0.2) 0%, transparent 70%)",
            top: "200px",
            right: "-80px",
            animation: "orb-float2 10s ease-in-out infinite",
            filter: "blur(50px)",
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            width: 400,
            height: 400,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(168,85,247,0.15) 0%, transparent 70%)",
            bottom: "50px",
            left: "35%",
            animation: "orb-pulse 6s ease-in-out infinite",
            filter: "blur(60px)",
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            width: 300,
            height: 300,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(46,229,157,0.12) 0%, transparent 70%)",
            bottom: "100px",
            right: "20%",
            animation: "orb-float 12s ease-in-out infinite 2s",
            filter: "blur(45px)",
          }}
        />

        {/* Scanline overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, rgba(0,0,0,0.03) 0px, rgba(0,0,0,0.03) 1px, transparent 1px, transparent 4px)",
          }}
        />

        {/* Video BG */}
        {currentSlide.isVideo && (
          <video
            key={currentSlide.id}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-30"
            src={currentSlide.videoSrc}
          />
        )}

        {/* Gradient BG for non-video slides */}
        {!currentSlide.isVideo && (
          <div
            className="absolute inset-0 transition-all duration-1000"
            style={{
              background: `radial-gradient(ellipse at 30% 50%, ${
                (currentSlide as { bgColor?: string }).bgColor || "#070812"
              } 0%, #070812 70%)`,
            }}
          />
        )}

        {/* Gradient overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-r ${currentSlide.gradient}`}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 50% 50%, rgba(168,85,247,0.08) 0%, transparent 70%)",
          }}
        />

        {/* Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map((p) => (
            <Particle
              key={p.left + p.animationDelay}
              style={{
                left: p.left,
                animationDelay: p.animationDelay,
                opacity: p.opacity,
              }}
            />
          ))}
          {particles.slice(0, 8).map((p, i) => (
            <Particle
              key={`cyan-${p.left}`}
              style={{
                left: `${(Number.parseFloat(p.left) * 1.3) % 100}%`,
                animationDelay: `${i * 1.1}s`,
                background: "rgba(38,230,255,0.5)",
              }}
            />
          ))}
        </div>

        {/* Grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(168,85,247,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.03) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Hero content */}
        <div className="relative z-20 h-full flex items-center">
          <div className="max-w-[1400px] mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-sm">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-[#A7AEC3]">
                  Live on Internet Computer · Trustless Blockchain
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-black leading-tight">
                <span className="text-[#E9ECF5]">{currentSlide.headline} </span>
                <span className="gradient-text">{currentSlide.accentWord}</span>
                {(currentSlide as { subAccent?: string }).subAccent && (
                  <>
                    {" "}
                    <span
                      style={{
                        background:
                          "linear-gradient(135deg, #2EE59D 0%, #26E6FF 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                    >
                      {(currentSlide as { subAccent?: string }).subAccent}
                    </span>
                  </>
                )}
              </h1>

              <p className="text-lg text-[#A7AEC3] max-w-lg leading-relaxed">
                {currentSlide.sub}
              </p>

              <div className="flex flex-wrap gap-3">
                {currentSlide.btns.map((btn, i) => (
                  <button
                    type="button"
                    key={btn}
                    data-ocid={`hero.${i === 0 ? "primary_button" : "secondary_button"}`}
                    className={
                      i === 0
                        ? "btn-primary px-6 py-3"
                        : "btn-secondary px-6 py-3"
                    }
                    onClick={() =>
                      onNavigate(
                        btn.toLowerCase().includes("market")
                          ? btn.toLowerCase().includes("create")
                            ? "create"
                            : "markets"
                          : "trade",
                      )
                    }
                  >
                    {btn}
                    {i === 0 && <ArrowRight className="inline w-4 h-4 ml-2" />}
                  </button>
                ))}
              </div>

              {/* Mini stats */}
              <div className="flex gap-6 pt-2">
                <div>
                  <p
                    className="text-2xl font-bold"
                    style={{ color: "#26E6FF" }}
                  >
                    $2.4B+
                  </p>
                  <p className="text-xs text-[#7E859C]">Total Volume</p>
                </div>
                <div className="w-px bg-[rgba(170,80,255,0.2)]" />
                <div>
                  <p
                    className="text-2xl font-bold"
                    style={{ color: "#A855F7" }}
                  >
                    1,247
                  </p>
                  <p className="text-xs text-[#7E859C]">Active Markets</p>
                </div>
                <div className="w-px bg-[rgba(170,80,255,0.2)]" />
                <div>
                  <p
                    className="text-2xl font-bold"
                    style={{ color: "#2EE59D" }}
                  >
                    89K+
                  </p>
                  <p className="text-xs text-[#7E859C]">Traders</p>
                </div>
              </div>
            </div>

            {/* Right: Floating card */}
            <div className="hidden lg:flex justify-center">
              {slide === 0 && (
                <div className="animate-float w-full max-w-sm">
                  <div className="glass rounded-2xl p-5 neon-border space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-[#A7AEC3]">
                        🔥 Hottest Market
                      </span>
                      <span className="badge-yes">LIVE</span>
                    </div>
                    <p className="font-bold text-[#E9ECF5]">
                      Will BTC exceed $100K by end of 2026?
                    </p>
                    <div className="flex gap-4">
                      <div className="flex-1 bg-[rgba(46,229,157,0.1)] rounded-xl p-3 text-center border border-[rgba(46,229,157,0.2)]">
                        <p className="text-2xl font-black text-[#2EE59D]">
                          67%
                        </p>
                        <p className="text-xs text-[#7E859C]">YES · $0.67</p>
                      </div>
                      <div className="flex-1 bg-[rgba(255,75,110,0.1)] rounded-xl p-3 text-center border border-[rgba(255,75,110,0.2)]">
                        <p className="text-2xl font-black text-[#FF4B6E]">
                          33%
                        </p>
                        <p className="text-xs text-[#7E859C]">NO · $0.33</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-[#7E859C]">
                      <span>Vol: $45.2K</span>
                      <span>30d left</span>
                    </div>
                    <button
                      type="button"
                      className="btn-primary w-full py-2 text-sm"
                      onClick={() => onNavigate("trade")}
                    >
                      Trade Now
                    </button>
                  </div>
                </div>
              )}
              {slide === 1 && (
                <div className="animate-float w-full max-w-sm">
                  <div className="glass rounded-2xl p-5 neon-border space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
                        style={{
                          background: "rgba(168,85,247,0.2)",
                          color: "#A855F7",
                        }}
                      >
                        ⚡
                      </div>
                      <span className="font-semibold text-[#E9ECF5]">
                        ICP Blockchain
                      </span>
                      <span className="ml-auto text-xs text-green-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block animate-pulse" />
                        Online
                      </span>
                    </div>
                    {[
                      { label: "Finality", value: "~1.5s", color: "#26E6FF" },
                      { label: "TPS", value: "11,500+", color: "#2EE59D" },
                      {
                        label: "Block Height",
                        value: blockHeight.toLocaleString(),
                        color: "#A855F7",
                      },
                    ].map((s) => (
                      <div
                        key={s.label}
                        className="flex justify-between items-center p-2 rounded-lg"
                        style={{ background: "rgba(255,255,255,0.03)" }}
                      >
                        <span className="text-sm text-[#A7AEC3]">
                          {s.label}
                        </span>
                        <span
                          className="text-sm font-bold"
                          style={{ color: s.color }}
                        >
                          {s.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {(slide === 2 || slide === 3) && (
                <div className="animate-float w-full max-w-sm space-y-3">
                  {MOCK_MARKETS.slice(0, 3).map((m) => (
                    <div
                      key={m.marketId.toString()}
                      className="glass rounded-xl p-3 flex items-center justify-between neon-border"
                    >
                      <div className="flex-1 mr-4">
                        <p className="text-sm font-semibold text-[#E9ECF5] truncate">
                          {m.question}
                        </p>
                        <p className="text-xs text-[#7E859C] capitalize">
                          {m.category}
                        </p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <span className="badge-yes">
                          {Math.round(m.yesPrice * 100)}%
                        </span>
                        <span className="badge-no">
                          {Math.round(m.noPrice * 100)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {slide === 4 && (
                <div className="animate-float w-full max-w-sm space-y-2">
                  <p className="text-sm text-[#A7AEC3] mb-2">
                    Live Activity Feed
                  </p>
                  {MOCK_TRADES.map((t) => (
                    <div
                      key={t.user + t.time}
                      className="glass rounded-xl p-3 flex items-center gap-3 neon-border"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center text-xs font-bold text-white shrink-0">
                        {t.user.slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-[#E9ECF5]">
                          {t.user}{" "}
                          <span
                            className={
                              t.action === "bought"
                                ? "text-[#2EE59D]"
                                : "text-[#FF4B6E]"
                            }
                          >
                            {t.action}
                          </span>{" "}
                          {t.shares}
                        </p>
                        <p className="text-xs text-[#7E859C] truncate">
                          {t.market}
                        </p>
                      </div>
                      <span className="text-xs text-[#7E859C] shrink-0">
                        {t.time}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              {slide === 5 && (
                <div className="animate-float w-full max-w-sm">
                  <div className="glass rounded-2xl p-5 neon-border space-y-4">
                    <div className="flex items-center gap-2">
                      <Trophy
                        className="w-5 h-5"
                        style={{ color: "#FFD700" }}
                      />
                      <p className="font-semibold text-[#E9ECF5]">
                        Top Traders
                      </p>
                    </div>
                    {MOCK_LEADERBOARD.slice(0, 4).map((t) => (
                      <div
                        key={t.rank}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-bold text-[#7E859C]">
                            #{t.rank}
                          </span>
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center text-xs font-bold text-white">
                            {t.username.slice(0, 2)}
                          </div>
                          <span className="text-sm text-[#E9ECF5]">
                            {t.username}
                          </span>
                        </div>
                        <span
                          className="text-sm font-bold"
                          style={{ color: tierColors[t.tier] }}
                        >
                          {t.winRate}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {SLIDES.map((s) => (
            <button
              type="button"
              key={`slide-${s.id}`}
              onClick={() => setSlide(s.id)}
              className="transition-all"
              style={{
                width: s.id === slide ? 24 : 8,
                height: 8,
                borderRadius: 4,
                background:
                  s.id === slide
                    ? "linear-gradient(90deg, #A855F7, #26E6FF)"
                    : "rgba(255,255,255,0.2)",
                boxShadow:
                  s.id === slide ? "0 0 10px rgba(168,85,247,0.6)" : "none",
              }}
            />
          ))}
        </div>
      </section>

      {/* ===================== ICP BLOCKCHAIN BANNER ===================== */}
      <section
        className="border-y"
        style={{
          background: "rgba(7,8,18,0.9)",
          borderColor: "rgba(168,85,247,0.3)",
          boxShadow: "0 0 40px rgba(168,85,247,0.08)",
        }}
      >
        <div className="max-w-[1400px] mx-auto px-6 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Left */}
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0"
                style={{
                  background: "rgba(168,85,247,0.15)",
                  border: "1px solid rgba(168,85,247,0.4)",
                  boxShadow: "0 0 20px rgba(168,85,247,0.2)",
                }}
              >
                ⚡
              </div>
              <div>
                <p className="font-bold text-sm" style={{ color: "#A855F7" }}>
                  Powered by Internet Computer Protocol
                </p>
                <p className="text-xs text-[#7E859C]">
                  Next-generation blockchain infrastructure
                </p>
              </div>
            </div>

            {/* Center: stat chips */}
            <div className="flex items-center gap-3 flex-wrap justify-center">
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
                style={{
                  background: "rgba(168,85,247,0.1)",
                  border: "1px solid rgba(168,85,247,0.3)",
                  color: "#A855F7",
                }}
              >
                <span className="text-[#7E859C] font-normal">Block:</span>
                {blockHeight.toLocaleString()}
              </div>
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
                style={{
                  background: "rgba(38,230,255,0.1)",
                  border: "1px solid rgba(38,230,255,0.3)",
                  color: "#26E6FF",
                }}
              >
                <span className="text-[#7E859C] font-normal">Finality:</span>
                ~1.5s
              </div>
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
                style={{
                  background: "rgba(46,229,157,0.1)",
                  border: "1px solid rgba(46,229,157,0.3)",
                  color: "#2EE59D",
                }}
              >
                <span className="text-[#7E859C] font-normal">TPS:</span>
                11,500+
              </div>
            </div>

            {/* Right: badges */}
            <div className="flex items-center gap-2 flex-wrap justify-end">
              {["On-chain", "Trustless", "Decentralized"].map((b) => (
                <span
                  key={b}
                  className="text-xs px-3 py-1.5 rounded-full font-semibold"
                  style={{
                    background: "rgba(168,85,247,0.08)",
                    border: "1px solid rgba(168,85,247,0.25)",
                    color: "#A7AEC3",
                  }}
                >
                  {b}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===================== STATS BAR ===================== */}
      <section
        className="py-8 border-b border-[rgba(170,80,255,0.15)]"
        style={{ background: "rgba(7,8,18,0.8)" }}
      >
        <div className="max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map((s) => (
              <div key={s.label} className="flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `${s.color}20` }}
                >
                  <s.icon className="w-5 h-5" style={{ color: s.color }} />
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
        </div>
      </section>

      {/* ===================== MAIN DASHBOARD ===================== */}
      <section className="max-w-[1400px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_300px] gap-6">
          {/* LEFT SIDEBAR */}
          <div className="space-y-4">
            <div className="glass rounded-xl p-4 neon-border">
              <h3 className="text-sm font-semibold text-[#E9ECF5] mb-3">
                Markets Overview
              </h3>
              <input
                placeholder="Search markets..."
                className="w-full bg-[rgba(20,20,35,0.8)] border border-[rgba(170,80,255,0.2)] rounded-lg px-3 py-2 text-sm text-[#E9ECF5] placeholder-[#7E859C] outline-none mb-3"
              />
              {/* Category filters */}
              <div className="flex flex-wrap gap-2 mb-4">
                {["All", "Crypto", "Sports", "Tech", "Entertainment"].map(
                  (cat) => (
                    <button
                      type="button"
                      key={cat}
                      onClick={() =>
                        setMarketFilter(
                          cat.toLowerCase() === "all"
                            ? "all"
                            : cat.toLowerCase().replace("tech", "technology"),
                        )
                      }
                      className="text-xs px-3 py-1 rounded-full transition-all"
                      style={{
                        background:
                          marketFilter === cat.toLowerCase() ||
                          (marketFilter === "technology" && cat === "Tech")
                            ? "rgba(168,85,247,0.2)"
                            : "rgba(20,20,35,0.8)",
                        border: `1px solid ${
                          marketFilter === cat.toLowerCase() ||
                          (marketFilter === "technology" && cat === "Tech")
                            ? "rgba(168,85,247,0.5)"
                            : "rgba(170,80,255,0.2)"
                        }`,
                        color:
                          marketFilter === cat.toLowerCase() ||
                          (marketFilter === "technology" && cat === "Tech")
                            ? "#A855F7"
                            : "#A7AEC3",
                      }}
                    >
                      {cat}
                    </button>
                  ),
                )}
              </div>
              {/* Hot markets list */}
              <p className="text-xs text-[#7E859C] mb-2 flex items-center gap-1">
                <Flame className="w-3 h-3 text-orange-400" /> Hot Markets
              </p>
              <div className="space-y-2">
                {MOCK_MARKETS.slice(0, 5).map((m) => (
                  <button
                    type="button"
                    key={m.marketId.toString()}
                    className="w-full text-left flex items-center justify-between p-2 rounded-lg hover:bg-white/5 transition-colors gap-2"
                  >
                    <p className="text-xs text-[#A7AEC3] truncate flex-1">
                      {m.question}
                    </p>
                    <span className="badge-yes shrink-0">
                      {Math.round(m.yesPrice * 100)}%
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* CENTER: Chart + Order Book */}
          <div className="space-y-4">
            <div className="glass rounded-xl p-5 neon-border">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-[#E9ECF5]">
                    Will BTC exceed $100K?
                  </h3>
                  <div className="flex gap-2 mt-1">
                    <span className="text-xs glass px-2 py-0.5 rounded-full text-[#26E6FF]">
                      Crypto
                    </span>
                    <span className="badge-yes">ACTIVE</span>
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className="text-2xl font-black"
                    style={{ color: "#26E6FF" }}
                  >
                    $0.67
                  </p>
                  <p className="text-xs text-[#2EE59D]">+4.2% today</p>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={MOCK_PRICE_HISTORY}>
                  <defs>
                    <linearGradient id="yesGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2EE59D" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#2EE59D" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="noGrad" x1="0" y1="0" x2="0" y2="1">
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
                    formatter={(value: number) => [
                      `${Math.round(value * 100)}%`,
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="yes"
                    stroke="#2EE59D"
                    fill="url(#yesGrad)"
                    strokeWidth={2}
                    name="YES"
                  />
                  <Area
                    type="monotone"
                    dataKey="no"
                    stroke="#FF4B6E"
                    fill="url(#noGrad)"
                    strokeWidth={2}
                    name="NO"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Order Book */}
            <div className="glass rounded-xl p-4 neon-border">
              <h3 className="text-sm font-semibold text-[#E9ECF5] mb-3">
                Order Book
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between text-xs text-[#7E859C] mb-2">
                    <span>Price</span>
                    <span>Qty</span>
                    <span>Total</span>
                  </div>
                  {MOCK_ORDER_BOOK.asks.map((a) => (
                    <div
                      key={a.price}
                      className="relative flex justify-between text-xs py-1"
                    >
                      <div
                        className="absolute inset-0 right-0"
                        style={{
                          background: "rgba(255,75,110,0.06)",
                          width: `${(a.quantity / 500) * 100}%`,
                        }}
                      />
                      <span className="text-[#FF4B6E] relative z-10">
                        ${a.price.toFixed(2)}
                      </span>
                      <span className="text-[#A7AEC3] relative z-10">
                        {a.quantity}
                      </span>
                      <span className="text-[#7E859C] relative z-10">
                        ${a.total}
                      </span>
                    </div>
                  ))}
                </div>
                <div>
                  <div className="flex justify-between text-xs text-[#7E859C] mb-2">
                    <span>Price</span>
                    <span>Qty</span>
                    <span>Total</span>
                  </div>
                  {MOCK_ORDER_BOOK.bids.map((b) => (
                    <div
                      key={b.price}
                      className="relative flex justify-between text-xs py-1"
                    >
                      <div
                        className="absolute inset-0 right-0"
                        style={{
                          background: "rgba(46,229,157,0.06)",
                          width: `${(b.quantity / 500) * 100}%`,
                        }}
                      />
                      <span className="text-[#2EE59D] relative z-10">
                        ${b.price.toFixed(2)}
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
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-4">
            {/* Portfolio summary */}
            <div className="glass rounded-xl p-4 neon-border">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-[#E9ECF5]">
                  Portfolio
                </h3>
                <button
                  type="button"
                  className="text-xs text-[#26E6FF]"
                  onClick={() => onNavigate("portfolio")}
                >
                  View All →
                </button>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#A7AEC3]">Balance</span>
                  <span className="font-bold text-[#E9ECF5]">$1,284.50</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#A7AEC3]">P&L Today</span>
                  <span className="font-bold text-[#2EE59D]">+$128.40</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#A7AEC3]">Open Positions</span>
                  <span className="font-bold text-[#26E6FF]">7</span>
                </div>
                <div className="h-px bg-[rgba(170,80,255,0.15)]" />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#A7AEC3]">Win Rate</span>
                  <span className="font-bold text-[#A855F7]">68%</span>
                </div>
              </div>
              <button
                type="button"
                className="btn-primary w-full py-2 text-sm mt-4"
                onClick={() => onNavigate("trade")}
              >
                Trade Now
              </button>
            </div>

            {/* Live trades */}
            <div className="glass rounded-xl p-4 neon-border">
              <h3 className="text-sm font-semibold text-[#E9ECF5] mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Live Trades
              </h3>
              <div className="space-y-2">
                {MOCK_TRADES.slice(0, 4).map((t) => (
                  <div
                    key={t.user + t.time}
                    className="flex items-center gap-2 text-xs py-1"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                      {t.user.slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[#E9ECF5]">{t.user}</span>{" "}
                      <span
                        className={
                          t.action === "bought"
                            ? "text-[#2EE59D]"
                            : "text-[#FF4B6E]"
                        }
                      >
                        {t.action}
                      </span>
                    </div>
                    <span className="text-[#7E859C] shrink-0">{t.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== MARKETS GRID ===================== */}
      <section className="max-w-[1400px] mx-auto px-6 pb-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-black text-[#E9ECF5]">
            Featured <span className="gradient-text">Markets</span>
          </h2>
          <button
            type="button"
            className="text-sm text-[#26E6FF] flex items-center gap-1"
            onClick={() => onNavigate("markets")}
          >
            View All <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        <div className="flex gap-3 mb-5 flex-wrap">
          {[
            "All",
            "Crypto",
            "Sports",
            "Politics",
            "Technology",
            "Entertainment",
          ].map((cat) => (
            <button
              type="button"
              key={cat}
              onClick={() =>
                setMarketFilter(
                  cat.toLowerCase() === "all" ? "all" : cat.toLowerCase(),
                )
              }
              className="text-sm px-4 py-2 rounded-full whitespace-nowrap transition-all"
              style={{
                background:
                  marketFilter === cat.toLowerCase() ||
                  (marketFilter === "all" && cat === "All")
                    ? "rgba(168,85,247,0.2)"
                    : "rgba(20,20,35,0.5)",
                border: `1px solid ${
                  marketFilter === cat.toLowerCase()
                    ? "rgba(168,85,247,0.5)"
                    : "rgba(170,80,255,0.2)"
                }`,
                color:
                  marketFilter === cat.toLowerCase() ? "#A855F7" : "#A7AEC3",
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMarkets.slice(0, 6).map((m) => (
            <MarketCard
              key={m.marketId.toString()}
              market={m}
              onClick={() => onNavigate("trade")}
            />
          ))}
        </div>
      </section>

      {/* ===================== LEADERBOARD PREVIEW ===================== */}
      <section className="max-w-[1400px] mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Leaderboard */}
          <div className="glass rounded-xl p-6 neon-border">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-[#E9ECF5] flex items-center gap-2">
                <Trophy className="w-5 h-5" style={{ color: "#FFD700" }} /> Top
                Traders
              </h2>
              <button
                type="button"
                className="text-sm text-[#26E6FF]"
                onClick={() => onNavigate("leaderboard")}
              >
                Full Leaderboard →
              </button>
            </div>
            <div className="space-y-3">
              {MOCK_LEADERBOARD.slice(0, 5).map((t) => (
                <div
                  key={t.rank}
                  className="flex items-center gap-4 p-2 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <span
                    className="text-sm font-bold w-5 text-center"
                    style={{
                      color:
                        t.rank <= 3
                          ? (["#FFD700", "#C0C0C0", "#CD7F32"] as string[])[
                              t.rank - 1
                            ]
                          : "#7E859C",
                    }}
                  >
                    #{t.rank}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center text-xs font-bold text-white">
                    {t.username.slice(0, 2)}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-[#E9ECF5]">
                      {t.username}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: tierColors[t.tier] }}
                    >
                      {t.tier.charAt(0).toUpperCase() + t.tier.slice(1)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-[#2EE59D]">
                      {t.winRate}%
                    </p>
                    <p className="text-xs text-[#7E859C]">win rate</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-[#26E6FF]">
                      ${t.pnl.toLocaleString()}
                    </p>
                    <p className="text-xs text-[#7E859C]">P&L</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rewards preview */}
          <div className="glass rounded-xl p-6 neon-border">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold text-[#E9ECF5] flex items-center gap-2">
                <Star className="w-5 h-5" style={{ color: "#A855F7" }} />{" "}
                Rewards Hub
              </h2>
              <button
                type="button"
                className="text-sm text-[#26E6FF]"
                onClick={() => onNavigate("rewards")}
              >
                View All →
              </button>
            </div>
            <div className="space-y-4">
              <div
                className="glass rounded-xl p-4"
                style={{
                  borderColor: "rgba(255,165,0,0.2)",
                  background: "rgba(255,165,0,0.05)",
                }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Zap className="w-5 h-5 text-yellow-400" />
                  <div>
                    <p className="font-semibold text-[#E9ECF5]">
                      Early Predictor Bonus
                    </p>
                    <p className="text-xs text-[#7E859C]">
                      Be first to trade, earn up to 2.5x rewards
                    </p>
                  </div>
                  <span className="ml-auto text-yellow-400 font-bold">
                    2.5x
                  </span>
                </div>
              </div>
              <div
                className="glass rounded-xl p-4"
                style={{
                  borderColor: "rgba(255,79,216,0.2)",
                  background: "rgba(255,79,216,0.05)",
                }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Flame className="w-5 h-5 text-orange-400" />
                  <div className="flex-1">
                    <p className="font-semibold text-[#E9ECF5]">Daily Streak</p>
                    <p className="text-xs text-[#7E859C]">
                      7 day streak · Next milestone: 14 days
                    </p>
                  </div>
                  <span className="ml-auto text-orange-400 font-bold">
                    🔥 7
                  </span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-[rgba(255,79,216,0.1)]">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: "50%",
                      background: "linear-gradient(90deg, #FF4FD8, #A855F7)",
                    }}
                  />
                </div>
              </div>
              <div
                className="glass rounded-xl p-4"
                style={{
                  borderColor: "rgba(38,230,255,0.2)",
                  background: "rgba(38,230,255,0.05)",
                }}
              >
                <div className="flex items-center gap-3">
                  <Trophy className="w-5 h-5" style={{ color: "#26E6FF" }} />
                  <div className="flex-1">
                    <p className="font-semibold text-[#E9ECF5]">
                      Weekly Challenge
                    </p>
                    <p className="text-xs text-[#7E859C]">
                      Trade 10 markets this week (6/10)
                    </p>
                  </div>
                  <span className="ml-auto text-[#26E6FF] font-bold">60%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-[rgba(38,230,255,0.1)]">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: "60%",
                      background: "linear-gradient(90deg, #26E6FF, #A855F7)",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
