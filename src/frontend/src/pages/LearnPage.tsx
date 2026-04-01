import { ChevronDown } from "lucide-react";
import { useState } from "react";

const FAQ = [
  {
    q: "What is PredictX?",
    a: "PredictX is a decentralized prediction market platform built on the Internet Computer Protocol (ICP). It allows anyone to create and trade prediction markets on real-world events using YES/NO shares.",
  },
  {
    q: "How do YES/NO shares work?",
    a: "Each market has YES and NO shares priced between $0 and $1. The prices reflect the probability of the event occurring. If you buy YES at $0.60, you're saying there's a 60% chance the event happens. If correct, you receive $1 per share.",
  },
  {
    q: "How are markets resolved?",
    a: "Markets are resolved by designated oracles - trusted data sources that confirm whether the event occurred. Multiple sources are used to ensure accuracy, with a consensus mechanism for dispute resolution.",
  },
  {
    q: "How do I earn rewards?",
    a: "You earn points through trading (especially early on new markets), maintaining daily streaks, completing weekly challenges, and referring friends. Points can be converted to rewards.",
  },
  {
    q: "Is my money safe?",
    a: "Funds are managed through smart contracts on ICP. All code is open source and audited. However, prediction markets carry inherent risk - only trade what you can afford to lose.",
  },
  {
    q: "What is Internet Identity?",
    a: "Internet Identity is ICP's secure, privacy-preserving authentication system. It uses hardware cryptography (like your device's biometrics) instead of passwords, making it highly secure.",
  },
];

export function LearnPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  return (
    <div
      className="min-h-screen pt-20"
      style={{
        background: "linear-gradient(180deg, #070812 0%, #0B0D18 100%)",
      }}
    >
      <div className="max-w-[900px] mx-auto px-6 py-12">
        <h1 className="text-4xl font-black text-[#E9ECF5] mb-3">
          Learn <span className="gradient-text">PredictX</span>
        </h1>
        <p className="text-[#A7AEC3] mb-12 text-lg">
          Everything you need to know about decentralized prediction markets
        </p>

        {/* How it works */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#E9ECF5] mb-6">
            How It Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                step: "1",
                title: "Browse Markets",
                desc: "Explore prediction markets across crypto, sports, tech, and more. Each market has a clear YES/NO question.",
                color: "#26E6FF",
              },
              {
                step: "2",
                title: "Trade Shares",
                desc: "Buy YES or NO shares based on your prediction. Prices move with market sentiment in real-time.",
                color: "#A855F7",
              },
              {
                step: "3",
                title: "Earn Rewards",
                desc: "If your prediction is correct, your shares pay out $1 each. Earn bonus rewards for early entries.",
                color: "#2EE59D",
              },
            ].map((s) => (
              <div
                key={s.step}
                className="glass rounded-xl p-5 neon-border text-center"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center mx-auto mb-3 text-xl font-black text-white">
                  {s.step}
                </div>
                <h3 className="font-bold text-[#E9ECF5] mb-2">{s.title}</h3>
                <p className="text-sm text-[#A7AEC3]">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Key concepts */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#E9ECF5] mb-6">
            Key Concepts
          </h2>
          <div className="space-y-4">
            {[
              {
                term: "Prediction Market",
                def: "A market where participants trade contracts based on the outcome of future events. Prices serve as probability estimates.",
              },
              {
                term: "YES Share",
                def: "A contract that pays $1 if the event occurs, $0 if it doesn't. Priced between 0-1 based on probability.",
              },
              {
                term: "NO Share",
                def: "A contract that pays $1 if the event does NOT occur. NO price = 1 - YES price.",
              },
              {
                term: "Order Book",
                def: "A real-time list of buy and sell orders. Bids are purchase offers; asks are sell offers.",
              },
              {
                term: "Early Predictor Bonus",
                def: "Traders who enter markets early get multiplied rewards. The bonus decreases as more traders participate.",
              },
            ].map((c) => (
              <div
                key={c.term}
                className="glass rounded-xl p-4 neon-border flex gap-4"
              >
                <div className="shrink-0">
                  <span className="font-bold text-[#A855F7]">{c.term}</span>
                </div>
                <p className="text-sm text-[#A7AEC3]">{c.def}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-2xl font-bold text-[#E9ECF5] mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <div
                key={item.q}
                className="glass rounded-xl overflow-hidden neon-border"
              >
                <button
                  type="button"
                  className="w-full flex items-center justify-between p-4 text-left"
                  onClick={() => setOpenFAQ(openFAQ === i ? null : i)}
                >
                  <span className="font-semibold text-[#E9ECF5]">{item.q}</span>
                  <ChevronDown
                    className="w-4 h-4 text-[#7E859C] shrink-0 transition-transform"
                    style={{
                      transform: openFAQ === i ? "rotate(180deg)" : "none",
                    }}
                  />
                </button>
                {openFAQ === i && (
                  <div className="px-4 pb-4 text-sm text-[#A7AEC3] border-t border-[rgba(170,80,255,0.1)] pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
