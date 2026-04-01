import { MessageCircle, Send, TrendingUp, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[rgba(170,80,255,0.15)] bg-[rgba(7,8,18,0.9)] mt-16">
      <div className="max-w-[1400px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">PredictX</span>
            </div>
            <p className="text-sm text-[#7E859C] leading-relaxed">
              The future of decentralized prediction markets. Trade on
              real-world events with full transparency.
            </p>
            <div className="flex gap-3">
              <a
                href="/"
                className="p-2 glass rounded-lg text-[#7E859C] hover:text-[#26E6FF] transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="/"
                className="p-2 glass rounded-lg text-[#7E859C] hover:text-[#A855F7] transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href="/"
                className="p-2 glass rounded-lg text-[#7E859C] hover:text-[#26E6FF] transition-colors"
              >
                <Send className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-sm font-semibold text-[#E9ECF5] mb-4">
              Platform
            </h4>
            <ul className="space-y-2">
              {[
                "Markets",
                "Trade",
                "Portfolio",
                "Leaderboard",
                "Rewards Hub",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="/"
                    className="text-sm text-[#7E859C] hover:text-[#26E6FF] transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-sm font-semibold text-[#E9ECF5] mb-4">
              Resources
            </h4>
            <ul className="space-y-2">
              {[
                "Documentation",
                "API Reference",
                "How It Works",
                "Blog",
                "FAQ",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="/"
                    className="text-sm text-[#7E859C] hover:text-[#26E6FF] transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold text-[#E9ECF5] mb-4">Legal</h4>
            <ul className="space-y-2">
              {[
                "Terms of Service",
                "Privacy Policy",
                "Cookie Policy",
                "Risk Disclaimer",
              ].map((item) => (
                <li key={item}>
                  <a
                    href="/"
                    className="text-sm text-[#7E859C] hover:text-[#26E6FF] transition-colors"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-4 space-y-1">
              <p className="text-xs text-[#7E859C]">Network</p>
              <div className="flex gap-2">
                <span className="text-xs glass px-2 py-1 rounded-full text-[#A855F7]">
                  ICP
                </span>
                <span className="text-xs glass px-2 py-1 rounded-full text-[#26E6FF]">
                  Chain
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[rgba(170,80,255,0.1)] flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-xs text-[#7E859C]">
            © 2026 PredictX. All rights reserved. Built on Internet Computer.
          </p>
          <p className="text-xs text-[#7E859C]">
            Trading involves risk. Only invest what you can afford to lose.
          </p>
        </div>
      </div>
    </footer>
  );
}
