import { Clock, TrendingUp } from "lucide-react";

interface Market {
  marketId: bigint;
  question: string;
  category: string;
  yesPrice: number;
  noPrice: number;
  volume: bigint;
  status: string;
  resolutionDate: bigint;
}

interface MarketCardProps {
  market: Market;
  onClick?: () => void;
  compact?: boolean;
}

const CATEGORY_COLORS: Record<string, string> = {
  crypto: "rgba(38,230,255,0.15):#26E6FF",
  sports: "rgba(46,229,157,0.15):#2EE59D",
  entertainment: "rgba(255,79,216,0.15):#FF4FD8",
  technology: "rgba(91,140,255,0.15):#5B8CFF",
  politics: "rgba(255,165,0,0.15):#FFA500",
};

function getCategoryStyle(category: string) {
  const style =
    CATEGORY_COLORS[category.toLowerCase()] || "rgba(168,85,247,0.15):#A855F7";
  const [bg, color] = style.split(":");
  return { background: bg, color };
}

function timeRemaining(resolutionDate: bigint): string {
  const ms = Number(resolutionDate) - Date.now();
  if (ms <= 0) return "Resolved";
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));
  if (days > 0) return `${days}d left`;
  const hours = Math.floor(ms / (1000 * 60 * 60));
  return `${hours}h left`;
}

function formatVolume(volume: bigint): string {
  const n = Number(volume);
  if (n >= 1000000) return `$${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `$${(n / 1000).toFixed(1)}K`;
  return `$${n}`;
}

export function MarketCard({
  market,
  onClick,
  compact = false,
}: MarketCardProps) {
  const catStyle = getCategoryStyle(market.category);
  const yesPercent = Math.round(market.yesPrice * 100);
  const noPercent = Math.round(market.noPrice * 100);

  return (
    <button
      type="button"
      className="glass rounded-xl market-card cursor-pointer p-4 flex flex-col gap-3 text-left w-full"
      onClick={onClick}
      style={{ borderColor: "rgba(170,80,255,0.2)" }}
    >
      {/* Category + Status */}
      <div className="flex items-center justify-between">
        <span
          className="text-xs font-semibold px-2 py-0.5 rounded-full capitalize"
          style={catStyle}
        >
          {market.category}
        </span>
        <div className="flex items-center gap-1 text-xs text-[#7E859C]">
          <Clock className="w-3 h-3" />
          {timeRemaining(market.resolutionDate)}
        </div>
      </div>

      {/* Question */}
      <p
        className={`font-semibold text-[#E9ECF5] leading-snug ${compact ? "text-sm" : "text-base"}`}
      >
        {market.question}
      </p>

      {/* YES/NO Bar */}
      <div>
        <div className="flex justify-between text-xs mb-1">
          <span className="text-[#2EE59D] font-semibold">
            YES {yesPercent}%
          </span>
          <span className="text-[#FF4B6E] font-semibold">{noPercent}% NO</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden bg-[rgba(255,75,110,0.2)]">
          <div
            className="h-full rounded-full transition-all"
            style={{
              width: `${yesPercent}%`,
              background: "linear-gradient(90deg, #2EE59D, #26E6FF)",
            }}
          />
        </div>
      </div>

      {/* Volume + Trade button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs text-[#7E859C]">
          <TrendingUp className="w-3 h-3" />
          Vol: {formatVolume(market.volume)}
        </div>
        {!compact && (
          <div className="flex gap-2">
            <span className="badge-yes">YES ${market.yesPrice.toFixed(2)}</span>
            <span className="badge-no">NO ${market.noPrice.toFixed(2)}</span>
          </div>
        )}
      </div>
    </button>
  );
}
