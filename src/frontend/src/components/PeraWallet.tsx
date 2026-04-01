import { useState } from "react";

interface PeraWalletState {
  address: string | null;
  balance: string | null;
  isConnected: boolean;
}

// Shared hook state (module-level singleton for simplicity)
let _state: PeraWalletState = {
  address: null,
  balance: null,
  isConnected: false,
};
let _listeners: Array<() => void> = [];

function setGlobal(update: Partial<PeraWalletState>) {
  _state = { ..._state, ...update };
  for (const fn of _listeners) {
    fn();
  }
}

export function usePeraWallet() {
  const [, setRender] = useState(0);

  const rerender = () => setRender((n) => n + 1);
  if (!_listeners.includes(rerender)) {
    _listeners.push(rerender);
  }

  const connect = async () => {
    // Simulate connection delay
    await new Promise((r) => setTimeout(r, 1500));
    setGlobal({
      isConnected: true,
      address: "ALGO...X7K2",
      balance: "1,247.50",
    });
  };

  const disconnect = () => {
    setGlobal({ isConnected: false, address: null, balance: null });
  };

  return { ..._state, connect, disconnect };
}

export function PeraWalletWidget() {
  const { address, balance, isConnected, connect, disconnect } =
    usePeraWallet();
  const [connecting, setConnecting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [connected, setConnected] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleConnect = async () => {
    setShowModal(true);
    setConnecting(true);
    setConnected(false);
    await connect();
    setConnecting(false);
    setConnected(true);
    setTimeout(() => setShowModal(false), 1200);
  };

  if (isConnected && address) {
    return (
      <div
        className="relative"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        data-ocid="pera.toggle"
      >
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-xl cursor-pointer transition-all"
          style={{
            background: "rgba(255,140,0,0.12)",
            border: "1px solid rgba(255,140,0,0.35)",
          }}
        >
          <div
            className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black"
            style={{ background: "#FF8C00", color: "#000" }}
          >
            P
          </div>
          <div>
            <p className="text-[11px] font-mono text-[#FF8C00] font-semibold">
              {address}
            </p>
            <p className="text-[9px] text-[#7E859C]">{balance} ALGO</p>
          </div>
          <div
            className="w-2 h-2 rounded-full ml-1"
            style={{
              background: "#2EE59D",
              boxShadow: "0 0 6px #2EE59D",
              animation: "pulse-glow 1.5s ease-in-out infinite",
            }}
          />
        </div>
        {hovered && (
          <button
            type="button"
            onClick={disconnect}
            data-ocid="pera.secondary_button"
            className="absolute top-full left-0 right-0 mt-1 py-1.5 rounded-lg text-xs font-semibold transition-all z-50"
            style={{
              background: "rgba(255,75,110,0.15)",
              border: "1px solid rgba(255,75,110,0.3)",
              color: "#FF4B6E",
            }}
          >
            Disconnect
          </button>
        )}
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={handleConnect}
        disabled={connecting}
        data-ocid="pera.primary_button"
        className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all"
        style={{
          background: connecting
            ? "rgba(255,140,0,0.1)"
            : "linear-gradient(135deg, #FF8C00, #FF6B35)",
          color: connecting ? "#FF8C00" : "#fff",
          border: connecting ? "1px solid rgba(255,140,0,0.4)" : "none",
          boxShadow: connecting ? "none" : "0 0 20px rgba(255,140,0,0.3)",
        }}
      >
        <div
          className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black"
          style={{
            background: connecting
              ? "rgba(255,140,0,0.3)"
              : "rgba(255,255,255,0.2)",
            color: "#fff",
          }}
        >
          P
        </div>
        {connecting ? "Connecting..." : "Connect Pera Wallet"}
      </button>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ background: "rgba(7,8,18,0.85)" }}
        >
          <div
            className="rounded-2xl p-6 w-72 text-center"
            style={{
              background: "rgba(20,20,35,0.98)",
              border: "1px solid rgba(255,140,0,0.4)",
              boxShadow: "0 0 40px rgba(255,140,0,0.2)",
            }}
            data-ocid="pera.modal"
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-black mx-auto mb-4"
              style={{
                background: "linear-gradient(135deg, #FF8C00, #FF6B35)",
              }}
            >
              P
            </div>
            <h3 className="font-bold text-[#E9ECF5] mb-1">Pera Wallet</h3>
            {connecting ? (
              <>
                <p className="text-sm text-[#7E859C] mb-4">
                  Connecting to Pera Wallet...
                </p>
                <div className="flex justify-center">
                  <div
                    className="w-6 h-6 border-2 rounded-full animate-spin"
                    style={{
                      borderColor:
                        "#FF8C00 transparent transparent transparent",
                    }}
                  />
                </div>
              </>
            ) : connected ? (
              <>
                <p className="text-sm text-[#2EE59D] font-semibold mb-1">
                  ✅ Connected!
                </p>
                <p className="text-xs text-[#7E859C] font-mono">ALGO...X7K2</p>
                <p className="text-xs text-[#A7AEC3] mt-1">
                  Balance: 1,247.50 ALGO
                </p>
              </>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
}
