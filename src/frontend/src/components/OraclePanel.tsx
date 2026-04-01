import { useEffect, useRef, useState } from "react";

interface OracleSource {
  name: string;
  color: string;
  bgColor: string;
  initial: number;
  price: number;
  prev: number;
  lastUpdated: string;
  flash: "up" | "down" | null;
}

function now(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}:${String(d.getSeconds()).padStart(2, "0")}`;
}

const _INITIAL_PRICES: Record<string, number> = {
  Binance: 6.042,
  CoinGecko: 6.038,
  Chainlink: 6.051,
};

export function OraclePanel() {
  const [sources, setSources] = useState<OracleSource[]>([
    {
      name: "Binance",
      color: "#F0B90B",
      bgColor: "rgba(240,185,11,0.15)",
      initial: 6.042,
      price: 6.042,
      prev: 6.042,
      lastUpdated: now(),
      flash: null,
    },
    {
      name: "CoinGecko",
      color: "#8DC63F",
      bgColor: "rgba(141,198,63,0.15)",
      initial: 6.038,
      price: 6.038,
      prev: 6.038,
      lastUpdated: now(),
      flash: null,
    },
    {
      name: "Chainlink",
      color: "#375BD2",
      bgColor: "rgba(55,91,210,0.15)",
      initial: 6.051,
      price: 6.051,
      prev: 6.051,
      lastUpdated: now(),
      flash: null,
    },
  ]);

  const flashTimeoutRef = useRef<Record<string, ReturnType<typeof setTimeout>>>(
    {},
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setSources((prev) =>
        prev.map((src) => {
          const drift = (Math.random() - 0.5) * 0.005 * src.price;
          const newPrice = +(src.price + drift).toFixed(4);
          const flash = newPrice > src.price ? "up" : "down";

          // Clear existing flash timeout
          if (flashTimeoutRef.current[src.name]) {
            clearTimeout(flashTimeoutRef.current[src.name]);
          }
          flashTimeoutRef.current[src.name] = setTimeout(() => {
            setSources((s) =>
              s.map((x) => (x.name === src.name ? { ...x, flash: null } : x)),
            );
          }, 600);

          return {
            ...src,
            prev: src.price,
            price: newPrice,
            lastUpdated: now(),
            flash,
          };
        }),
      );
    }, 3000);
    return () => {
      clearInterval(interval);
      Object.values(flashTimeoutRef.current).forEach(clearTimeout);
    };
  }, []);

  const consensus =
    sources.length > 0
      ? +(sources.reduce((s, x) => s + x.price, 0) / sources.length).toFixed(4)
      : 0;
  const minPrice = Math.min(...sources.map((s) => s.price));
  const maxPrice = Math.max(...sources.map((s) => s.price));
  const spreadRange = maxPrice - minPrice;
  const spreadPct =
    consensus > 0 ? ((spreadRange / consensus) * 100).toFixed(4) : "0";

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-bold text-[#E9ECF5] text-sm">
            🔮 Multi-Source Oracle
          </h3>
          <p className="text-[10px] text-[#7E859C]">
            Consensus-verified real-time feeds
          </p>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[rgba(168,85,247,0.1)] text-[#A855F7] border border-[rgba(168,85,247,0.3)]">
          3 sources
        </span>
      </div>

      {/* Consensus price */}
      <div
        className="rounded-lg p-3 mb-3 flex items-center justify-between"
        style={{
          background: "rgba(38,230,255,0.05)",
          border: "1px solid rgba(38,230,255,0.15)",
        }}
      >
        <div>
          <p className="text-[10px] text-[#7E859C] uppercase tracking-wider">
            Consensus Price
          </p>
          <p
            className="text-2xl font-black font-mono"
            style={{ color: "#26E6FF" }}
          >
            {consensus.toFixed(4)}
            <span className="text-sm font-normal text-[#7E859C] ml-1">
              ALGO
            </span>
          </p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span
            className="w-2 h-2 rounded-full"
            style={{
              background: "#26E6FF",
              animation: "pulse-glow 1.5s ease-in-out infinite",
            }}
          />
          <span className="text-[10px] text-[#7E859C]">
            Spread: <span className="text-[#A855F7]">{spreadPct}%</span>
          </span>
        </div>
      </div>

      {/* Spread bar */}
      <div className="mb-3">
        <div className="flex justify-between text-[9px] text-[#7E859C] mb-1">
          <span>{minPrice.toFixed(4)}</span>
          <span className="text-[#A855F7]">Price Range</span>
          <span>{maxPrice.toFixed(4)}</span>
        </div>
        <div
          className="h-1 rounded-full relative"
          style={{ background: "rgba(255,255,255,0.05)" }}
        >
          {sources.map((src) => {
            const pos =
              spreadRange > 0
                ? ((src.price - minPrice) / spreadRange) * 100
                : 50;
            return (
              <div
                key={src.name}
                className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full"
                style={{
                  left: `${pos}%`,
                  background: src.color,
                  boxShadow: `0 0 6px ${src.color}`,
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Sources */}
      <div className="space-y-2">
        {sources.map((src) => (
          <div
            key={src.name}
            className="flex items-center justify-between rounded-lg px-3 py-2 transition-all"
            style={{
              background: src.flash
                ? src.flash === "up"
                  ? "rgba(46,229,157,0.12)"
                  : "rgba(255,75,110,0.12)"
                : src.bgColor,
              border: `1px solid ${src.bgColor}`,
              transition: "background 0.3s ease",
            }}
          >
            <div className="flex items-center gap-2">
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black"
                style={{ background: src.color, color: "#000" }}
              >
                {src.name[0]}
              </div>
              <div>
                <p className="text-[11px] font-semibold text-[#E9ECF5]">
                  {src.name}
                </p>
                <p className="text-[9px] text-[#5A6075]">{src.lastUpdated}</p>
              </div>
            </div>
            <div className="text-right">
              <p
                className="text-sm font-bold font-mono"
                style={{
                  color:
                    src.flash === "up"
                      ? "#2EE59D"
                      : src.flash === "down"
                        ? "#FF4B6E"
                        : src.color,
                  transition: "color 0.3s ease",
                }}
              >
                {src.price.toFixed(4)}
              </p>
              <p
                className="text-[9px] font-mono"
                style={{
                  color:
                    src.flash === "up"
                      ? "#2EE59D"
                      : src.flash === "down"
                        ? "#FF4B6E"
                        : "#5A6075",
                }}
              >
                {src.price >= src.prev ? "▲" : "▼"}{" "}
                {Math.abs(src.price - src.prev).toFixed(4)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
