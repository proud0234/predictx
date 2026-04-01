import { useState } from "react";
import { toast } from "sonner";

interface PoolStatsProps {
  yesPool?: number;
  noPool?: number;
  resolved?: boolean;
  winnings?: number;
}

export function PoolStats({
  yesPool = 28450,
  noPool = 14220,
  resolved = false,
  winnings = 342.5,
}: PoolStatsProps) {
  const [claimed, setClaimed] = useState(false);

  const total = yesPool + noPool;
  const yesPct = total > 0 ? (yesPool / total) * 100 : 50;
  const noPct = 100 - yesPct;
  const impliedYes = yesPct.toFixed(1);
  const impliedNo = noPct.toFixed(1);

  const handleClaim = () => {
    if (claimed) return;
    setClaimed(true);
    toast.success(`🏆 Winnings claimed: ${winnings.toFixed(2)} ALGO`, {
      description: "Transferred to your Pera Wallet",
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-[#E9ECF5] text-sm">💰 Pool Stats</h3>
        <span
          className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
          style={{
            background: "rgba(38,230,255,0.1)",
            color: "#26E6FF",
            border: "1px solid rgba(38,230,255,0.3)",
          }}
        >
          ⚡ Auto-Pool
        </span>
      </div>

      {/* Pool sizes */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        <div
          className="rounded-lg p-2 text-center"
          style={{
            background: "rgba(46,229,157,0.08)",
            border: "1px solid rgba(46,229,157,0.2)",
          }}
        >
          <p className="text-[9px] text-[#7E859C] uppercase">YES Pool</p>
          <p
            className="text-sm font-black font-mono"
            style={{ color: "#2EE59D" }}
          >
            {(yesPool / 1000).toFixed(1)}K
          </p>
          <p className="text-[9px] text-[#5A6075]">ALGO</p>
        </div>
        <div
          className="rounded-lg p-2 text-center"
          style={{
            background: "rgba(168,85,247,0.08)",
            border: "1px solid rgba(168,85,247,0.2)",
          }}
        >
          <p className="text-[9px] text-[#7E859C] uppercase">Total</p>
          <p
            className="text-sm font-black font-mono"
            style={{ color: "#A855F7" }}
          >
            {(total / 1000).toFixed(1)}K
          </p>
          <p className="text-[9px] text-[#5A6075]">ALGO</p>
        </div>
        <div
          className="rounded-lg p-2 text-center"
          style={{
            background: "rgba(255,75,110,0.08)",
            border: "1px solid rgba(255,75,110,0.2)",
          }}
        >
          <p className="text-[9px] text-[#7E859C] uppercase">NO Pool</p>
          <p
            className="text-sm font-black font-mono"
            style={{ color: "#FF4B6E" }}
          >
            {(noPool / 1000).toFixed(1)}K
          </p>
          <p className="text-[9px] text-[#5A6075]">ALGO</p>
        </div>
      </div>

      {/* Probability bars */}
      <div className="mb-3">
        <div className="flex justify-between text-[10px] mb-1">
          <span className="text-[#2EE59D] font-semibold">
            YES {impliedYes}%
          </span>
          <span className="text-[#7E859C]">Implied Probability</span>
          <span className="text-[#FF4B6E] font-semibold">{impliedNo}% NO</span>
        </div>
        <div
          className="h-3 rounded-full overflow-hidden flex"
          style={{ background: "rgba(255,255,255,0.05)" }}
        >
          <div
            className="h-full transition-all duration-700"
            style={{
              width: `${yesPct}%`,
              background: "linear-gradient(90deg, #2EE59D, #26E6FF)",
              borderRadius: "9999px 0 0 9999px",
            }}
          />
          <div
            className="h-full flex-1"
            style={{
              background: "linear-gradient(90deg, #FF4B6E, #FF4FD8)",
              borderRadius: "0 9999px 9999px 0",
            }}
          />
        </div>
      </div>

      {/* Smart contract badge */}
      <div
        className="rounded-lg p-2 mb-3 flex items-center gap-2"
        style={{
          background: "rgba(38,230,255,0.04)",
          border: "1px solid rgba(38,230,255,0.1)",
        }}
      >
        <span className="text-[#26E6FF] text-sm">🔐</span>
        <div>
          <p className="text-[10px] text-[#7E859C]">
            Secured by Smart Contract
          </p>
          <p className="text-[9px] text-[#5A6075]">
            Auto-settlement on resolution
          </p>
        </div>
      </div>

      {/* Claim button */}
      <button
        type="button"
        onClick={handleClaim}
        disabled={!resolved || claimed}
        data-ocid="pool.claim_button"
        className="w-full py-2.5 rounded-xl text-sm font-bold transition-all"
        style={{
          background:
            resolved && !claimed
              ? "linear-gradient(135deg, #FFD700, #FF8C00)"
              : "rgba(255,255,255,0.05)",
          color: resolved && !claimed ? "#000" : "#5A6075",
          cursor: resolved && !claimed ? "pointer" : "not-allowed",
          boxShadow:
            resolved && !claimed ? "0 0 20px rgba(255,215,0,0.3)" : "none",
        }}
      >
        {claimed
          ? "✅ Winnings Claimed"
          : resolved
            ? "🏆 Claim Winnings"
            : "🔒 Awaiting Resolution"}
      </button>
      {!resolved && (
        <p className="text-[9px] text-center text-[#5A6075] mt-1">
          Market must resolve before claiming
        </p>
      )}
    </div>
  );
}
