import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Loader2,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { MarketCategory } from "../backend";
import { useActor } from "../hooks/useActor";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const CATEGORIES = [
  { value: MarketCategory.crypto, label: "Crypto" },
  { value: MarketCategory.sports, label: "Sports" },
  { value: MarketCategory.entertainment, label: "Entertainment" },
  { value: MarketCategory.technology, label: "Technology" },
  { value: MarketCategory.politics, label: "Politics" },
];

type AISuggestion = {
  question: string;
  description: string;
  category: MarketCategory;
};

const AI_SUGGESTIONS_DB: Record<string, AISuggestion[]> = {
  bitcoin: [
    {
      question: "Will Bitcoin exceed $150K by end of 2026?",
      description:
        "Bitcoin has shown strong bullish momentum. This market resolves YES if BTC/USD price exceeds $150,000 on any major exchange by December 31, 2026.",
      category: MarketCategory.crypto,
    },
    {
      question: "Will Bitcoin ETF AUM exceed $100B in 2026?",
      description:
        "US spot Bitcoin ETFs launched in 2024. Resolves YES if total AUM across all US Bitcoin ETFs exceeds $100 billion by end of 2026.",
      category: MarketCategory.crypto,
    },
    {
      question: "Will Bitcoin replace gold as reserve asset by 2027?",
      description:
        "Multiple sovereign nations are considering Bitcoin as reserve asset. Resolves YES if 3+ countries officially hold BTC as part of national reserves.",
      category: MarketCategory.crypto,
    },
  ],
  ethereum: [
    {
      question: "Will Ethereum reach $10,000 in 2026?",
      description:
        "ETH price prediction market. Resolves YES if ETH/USD price reaches $10,000 on any major exchange before December 31, 2026.",
      category: MarketCategory.crypto,
    },
    {
      question: "Will Ethereum overtake Bitcoin in market cap by 2027?",
      description:
        "The classic 'flippening' market. Resolves YES if Ethereum's market cap exceeds Bitcoin's for 7+ consecutive days.",
      category: MarketCategory.crypto,
    },
    {
      question: "Will ETH staking yield drop below 2% APY in 2026?",
      description:
        "As more ETH is staked, yields decrease. Resolves YES if the average ETH staking APY falls below 2% for 30 consecutive days.",
      category: MarketCategory.crypto,
    },
  ],
  election: [
    {
      question:
        "Will the 2028 US Presidential election see record voter turnout?",
      description:
        "Resolves YES if 2028 US Presidential election voter turnout exceeds 66.8% (2020 record) of eligible voters.",
      category: MarketCategory.politics,
    },
    {
      question: "Will a third-party candidate win a US state in 2028?",
      description:
        "Resolves YES if any third-party/independent presidential candidate wins the electoral votes of at least one US state in the 2028 election.",
      category: MarketCategory.politics,
    },
    {
      question: "Will AI be a central issue in the 2028 US election?",
      description:
        "Resolves YES if AI regulation/governance is listed as a top-3 voter issue in at least 5 major national polls during the 2028 election cycle.",
      category: MarketCategory.politics,
    },
  ],
  ai: [
    {
      question: "Will an AI system pass the Turing Test convincingly by 2027?",
      description:
        "Resolves YES if an AI system is judged indistinguishable from humans by 70%+ of evaluators in a formal Turing Test conducted by a recognized institution.",
      category: MarketCategory.technology,
    },
    {
      question:
        "Will GPT-5 or equivalent model achieve AGI benchmarks by 2026?",
      description:
        "Resolves YES if any publicly available AI model scores 90%+ on the ARC-AGI benchmark or equivalent general intelligence test.",
      category: MarketCategory.technology,
    },
    {
      question:
        "Will AI-generated content exceed 50% of all online articles by 2027?",
      description:
        "Resolves YES if credible research reports that AI-generated text comprises more than 50% of newly published online articles by end of 2027.",
      category: MarketCategory.technology,
    },
  ],
  sports: [
    {
      question: "Will the LA Lakers win the 2026 NBA Championship?",
      description:
        "Resolves YES if the Los Angeles Lakers win the 2025-26 NBA Championship Finals.",
      category: MarketCategory.sports,
    },
    {
      question: "Will a new 100m world record be set at 2028 Olympics?",
      description:
        "Resolves YES if the men's 100m world record (currently 9.58s by Usain Bolt) is broken at the 2028 Los Angeles Olympics.",
      category: MarketCategory.sports,
    },
    {
      question: "Will Lionel Messi retire from professional football by 2026?",
      description:
        "Resolves YES if Lionel Messi officially announces his retirement from professional football before December 31, 2026.",
      category: MarketCategory.sports,
    },
  ],
  default: [
    {
      question:
        "Will a major tech company launch a humanoid robot product by 2026?",
      description:
        "Resolves YES if Apple, Google, Meta, or Amazon releases a consumer humanoid robot product available for public purchase by end of 2026.",
      category: MarketCategory.technology,
    },
    {
      question:
        "Will global inflation return to 2% target in all G7 nations by 2026?",
      description:
        "Resolves YES if all 7 G7 countries report official inflation rates at or below 2% for 3 consecutive months before end of 2026.",
      category: MarketCategory.technology,
    },
    {
      question:
        "Will a new social media platform surpass Twitter/X in users by 2027?",
      description:
        "Resolves YES if any single social media platform launched after 2022 officially reports more monthly active users than Twitter/X.",
      category: MarketCategory.entertainment,
    },
  ],
};

export function CreateMarketPage() {
  const [question, setQuestion] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<MarketCategory>(
    MarketCategory.crypto,
  );
  const [resolutionDate, setResolutionDate] = useState("");
  const [rules, setRules] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // AI Panel state
  const [showAiPanel, setShowAiPanel] = useState(true);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiCategory, setAiCategory] = useState<MarketCategory>(
    MarketCategory.crypto,
  );
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<AISuggestion[]>([]);

  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const isLoggedIn = !!identity && !identity.getPrincipal().isAnonymous();

  const generateSuggestions = () => {
    if (!aiPrompt.trim()) {
      toast.error("Enter a topic to generate suggestions");
      return;
    }
    setAiLoading(true);
    setAiSuggestions([]);
    setTimeout(() => {
      const lower = aiPrompt.toLowerCase();
      let suggestions: AISuggestion[];
      if (lower.includes("bitcoin") || lower.includes("btc")) {
        suggestions = AI_SUGGESTIONS_DB.bitcoin;
      } else if (lower.includes("ethereum") || lower.includes("eth")) {
        suggestions = AI_SUGGESTIONS_DB.ethereum;
      } else if (
        lower.includes("election") ||
        lower.includes("vote") ||
        lower.includes("president")
      ) {
        suggestions = AI_SUGGESTIONS_DB.election;
      } else if (
        lower.includes("ai") ||
        lower.includes("artificial") ||
        lower.includes("gpt") ||
        lower.includes("agi")
      ) {
        suggestions = AI_SUGGESTIONS_DB.ai;
      } else if (
        lower.includes("sport") ||
        lower.includes("nba") ||
        lower.includes("football") ||
        lower.includes("soccer")
      ) {
        suggestions = AI_SUGGESTIONS_DB.sports;
      } else {
        suggestions = AI_SUGGESTIONS_DB.default;
      }
      setAiSuggestions(suggestions);
      setAiLoading(false);
    }, 1500);
  };

  const applySuggestion = (s: AISuggestion) => {
    setQuestion(s.question);
    setDescription(s.description);
    setCategory(s.category);
    toast.success("Suggestion applied to form!");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      toast.error("Connect your wallet first");
      return;
    }
    if (!question.trim() || !description.trim() || !resolutionDate) {
      toast.error("All fields are required");
      return;
    }
    if (question.length < 10) {
      toast.error("Question must be at least 10 characters");
      return;
    }
    if (!actor) {
      toast.error("Backend not available");
      return;
    }

    setSubmitting(true);
    try {
      const resDate = BigInt(new Date(resolutionDate).getTime());
      await actor.createMarket(question, description, category, resDate);
      setSuccess(true);
      toast.success("Market created successfully!");
    } catch {
      toast.error("Failed to create market");
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div
        className="min-h-screen pt-20 flex items-center justify-center"
        style={{
          background: "linear-gradient(180deg, #070812 0%, #0B0D18 100%)",
        }}
      >
        <div className="glass rounded-2xl p-12 neon-border text-center max-w-md">
          <CheckCircle
            className="w-16 h-16 mx-auto mb-4"
            style={{ color: "#2EE59D" }}
          />
          <h2 className="text-2xl font-bold text-[#E9ECF5] mb-2">
            Market Created!
          </h2>
          <p className="text-[#A7AEC3] mb-6">
            Your market is pending approval and will go live soon.
          </p>
          <button
            type="button"
            className="btn-primary px-8 py-3"
            onClick={() => setSuccess(false)}
          >
            Create Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen pt-20"
      style={{
        background: "linear-gradient(180deg, #070812 0%, #0B0D18 100%)",
      }}
    >
      <div className="max-w-[1000px] mx-auto px-6 py-8">
        <h1 className="text-3xl font-black text-[#E9ECF5] mb-2">
          Create <span className="gradient-text">Market</span>
        </h1>
        <p className="text-[#A7AEC3] mb-8">
          Launch your own prediction market on the decentralized platform
        </p>

        {/* ===== AI MARKET GENERATOR ===== */}
        <div
          className="glass rounded-2xl mb-6"
          style={{
            border: "1px solid rgba(168,85,247,0.4)",
            boxShadow: "0 0 30px rgba(168,85,247,0.08)",
          }}
        >
          {/* Header */}
          <button
            type="button"
            className="w-full flex items-center justify-between px-6 py-4"
            onClick={() => setShowAiPanel((v) => !v)}
            data-ocid="ai_panel.toggle"
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(168,85,247,0.3) 0%, rgba(38,230,255,0.2) 100%)",
                  border: "1px solid rgba(168,85,247,0.4)",
                }}
              >
                <Sparkles className="w-4 h-4" style={{ color: "#A855F7" }} />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#E9ECF5]">
                    AI Market Generator
                  </span>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{
                      background: "rgba(168,85,247,0.2)",
                      border: "1px solid rgba(168,85,247,0.4)",
                      color: "#A855F7",
                    }}
                  >
                    BETA
                  </span>
                </div>
                <p className="text-xs text-[#7E859C]">
                  Describe a topic or trend and AI generates prediction markets
                </p>
              </div>
            </div>
            <div style={{ color: "#7E859C" }}>
              {showAiPanel ? (
                <ChevronUp className="w-5 h-5" />
              ) : (
                <ChevronDown className="w-5 h-5" />
              )}
            </div>
          </button>

          {showAiPanel && (
            <div className="px-6 pb-6 space-y-4">
              <div
                className="h-px"
                style={{ background: "rgba(168,85,247,0.2)" }}
              />

              {/* Input row */}
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && generateSuggestions()}
                  placeholder="e.g. Bitcoin ETF, US election 2028, AI AGI..."
                  className="flex-1 bg-[rgba(20,20,35,0.8)] border border-[rgba(170,80,255,0.2)] rounded-xl px-4 py-3 text-[#E9ECF5] placeholder-[#7E859C] outline-none focus:border-[rgba(168,85,247,0.5)] transition-colors"
                  data-ocid="ai_panel.input"
                />
                <select
                  value={aiCategory}
                  onChange={(e) =>
                    setAiCategory(e.target.value as MarketCategory)
                  }
                  className="bg-[rgba(20,20,35,0.8)] border border-[rgba(170,80,255,0.2)] rounded-xl px-3 py-3 text-[#E9ECF5] outline-none focus:border-[rgba(168,85,247,0.5)] transition-colors"
                  data-ocid="ai_panel.select"
                >
                  {CATEGORIES.map((c) => (
                    <option
                      key={c.value}
                      value={c.value}
                      style={{ background: "#0B0D18" }}
                    >
                      {c.label}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="btn-primary px-6 py-3 flex items-center gap-2 shrink-0"
                  onClick={generateSuggestions}
                  disabled={aiLoading}
                  data-ocid="ai_panel.button"
                >
                  {aiLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Sparkles className="w-4 h-4" />
                  )}
                  {aiLoading ? "Generating..." : "Generate Markets"}
                </button>
              </div>

              {/* Loading state */}
              {aiLoading && (
                <div
                  className="flex items-center gap-3 py-4"
                  data-ocid="ai_panel.loading_state"
                >
                  <div
                    className="w-6 h-6 rounded-full border-2 border-transparent animate-spin"
                    style={{
                      borderTopColor: "#A855F7",
                      borderRightColor: "rgba(168,85,247,0.3)",
                    }}
                  />
                  <span className="text-sm text-[#A7AEC3]">
                    AI is analyzing trends and generating market ideas...
                  </span>
                </div>
              )}

              {/* Suggestions */}
              {aiSuggestions.length > 0 && (
                <div className="space-y-3" data-ocid="ai_panel.success_state">
                  <p className="text-xs text-[#A7AEC3] flex items-center gap-1.5">
                    <Sparkles
                      className="w-3 h-3"
                      style={{ color: "#A855F7" }}
                    />
                    <span style={{ color: "#A855F7" }}>✨ Powered by AI</span>
                    <span className="text-[#7E859C]">
                      · Click any suggestion to use it
                    </span>
                  </p>
                  <div className="space-y-2">
                    {aiSuggestions.map((s, i) => (
                      <button
                        type="button"
                        key={s.question}
                        className="glass rounded-xl p-3 cursor-pointer text-left w-full transition-all"
                        style={{ border: "1px solid rgba(170,80,255,0.2)" }}
                        onClick={() => applySuggestion(s)}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLElement).style.borderColor =
                            "rgba(168,85,247,0.5)";
                          (e.currentTarget as HTMLElement).style.background =
                            "rgba(168,85,247,0.05)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLElement).style.borderColor =
                            "rgba(170,80,255,0.2)";
                          (e.currentTarget as HTMLElement).style.background =
                            "";
                        }}
                        data-ocid={`ai_panel.item.${i + 1}`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm text-[#E9ECF5] mb-1">
                              {s.question}
                            </p>
                            <p className="text-xs text-[#7E859C] leading-relaxed line-clamp-2">
                              {s.description}
                            </p>
                          </div>
                          <span
                            className="text-xs px-2 py-0.5 rounded-full shrink-0"
                            style={{
                              background: "rgba(168,85,247,0.15)",
                              border: "1px solid rgba(168,85,247,0.3)",
                              color: "#A855F7",
                            }}
                          >
                            {CATEGORIES.find((c) => c.value === s.category)
                              ?.label ?? s.category}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ===== MAIN FORM ===== */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="glass rounded-xl p-5 neon-border space-y-4">
              <h3 className="font-semibold text-[#E9ECF5]">Market Details</h3>

              <div>
                <label
                  htmlFor="market-question"
                  className="text-sm text-[#A7AEC3] mb-1.5 block"
                >
                  Market Question *
                </label>
                <input
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Will BTC reach $200K in 2027?"
                  className="w-full bg-[rgba(20,20,35,0.8)] border border-[rgba(170,80,255,0.2)] rounded-lg px-4 py-3 text-[#E9ECF5] placeholder-[#7E859C] outline-none focus:border-[rgba(168,85,247,0.5)] transition-colors"
                  maxLength={200}
                  id="market-question"
                  data-ocid="create_market.input"
                />
                <p className="text-xs text-[#7E859C] mt-1">
                  {question.length}/200 characters
                </p>
              </div>

              <div>
                <label
                  htmlFor="market-description"
                  className="text-sm text-[#A7AEC3] mb-1.5 block"
                >
                  Description *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Provide context, data sources, and any relevant information..."
                  rows={4}
                  className="w-full bg-[rgba(20,20,35,0.8)] border border-[rgba(170,80,255,0.2)] rounded-lg px-4 py-3 text-[#E9ECF5] placeholder-[#7E859C] outline-none focus:border-[rgba(168,85,247,0.5)] transition-colors resize-none"
                  id="market-description"
                  data-ocid="create_market.textarea"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="market-category"
                    className="text-sm text-[#A7AEC3] mb-1.5 block"
                  >
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value as MarketCategory)
                    }
                    className="w-full bg-[rgba(20,20,35,0.8)] border border-[rgba(170,80,255,0.2)] rounded-lg px-3 py-3 text-[#E9ECF5] outline-none focus:border-[rgba(168,85,247,0.5)] transition-colors"
                    id="market-category"
                    data-ocid="create_market.select"
                  >
                    {CATEGORIES.map((c) => (
                      <option
                        key={c.value}
                        value={c.value}
                        style={{ background: "#0B0D18" }}
                      >
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label
                    htmlFor="market-resolution-date"
                    className="text-sm text-[#A7AEC3] mb-1.5 block"
                  >
                    Resolution Date *
                  </label>
                  <input
                    id="market-resolution-date"
                    type="date"
                    value={resolutionDate}
                    onChange={(e) => setResolutionDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full bg-[rgba(20,20,35,0.8)] border border-[rgba(170,80,255,0.2)] rounded-lg px-3 py-3 text-[#E9ECF5] outline-none focus:border-[rgba(168,85,247,0.5)] transition-colors"
                    style={{ colorScheme: "dark" }}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="market-rules"
                  className="text-sm text-[#A7AEC3] mb-1.5 block"
                >
                  Resolution Rules
                </label>
                <textarea
                  value={rules}
                  onChange={(e) => setRules(e.target.value)}
                  placeholder="How will this market resolve? What oracle/source will be used?"
                  rows={3}
                  className="w-full bg-[rgba(20,20,35,0.8)] border border-[rgba(170,80,255,0.2)] rounded-lg px-4 py-3 text-[#E9ECF5] placeholder-[#7E859C] outline-none focus:border-[rgba(168,85,247,0.5)] transition-colors resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={
                submitting || !question || !description || !resolutionDate
              }
              className="btn-primary w-full py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
              data-ocid="create_market.submit_button"
            >
              {submitting ? "Creating Market..." : "Create Market"}
            </button>
          </form>

          {/* Preview */}
          <div className="space-y-4">
            <div className="glass rounded-xl p-5 neon-border">
              <h3 className="text-sm font-semibold text-[#E9ECF5] mb-4">
                Preview
              </h3>
              <div
                className="glass rounded-xl p-4"
                style={{ borderColor: "rgba(170,80,255,0.2)" }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs glass px-2 py-0.5 rounded-full text-[#26E6FF] capitalize">
                    {category}
                  </span>
                  <span className="badge-yes">ACTIVE</span>
                </div>
                <p className="font-semibold text-[#E9ECF5] mb-3">
                  {question || "Your market question will appear here..."}
                </p>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-[#2EE59D] font-semibold">YES 50%</span>
                  <span className="text-[#FF4B6E] font-semibold">50% NO</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden bg-[rgba(255,75,110,0.2)]">
                  <div
                    className="h-full w-1/2 rounded-full"
                    style={{
                      background: "linear-gradient(90deg, #2EE59D, #26E6FF)",
                    }}
                  />
                </div>
                {resolutionDate && (
                  <p className="text-xs text-[#7E859C] mt-3">
                    Resolves: {new Date(resolutionDate).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>

            <div className="glass rounded-xl p-4 neon-border space-y-2">
              <h3 className="text-sm font-semibold text-[#E9ECF5]">
                Guidelines
              </h3>
              {[
                "Question must have a clear YES/NO outcome",
                "Include reliable resolution sources",
                "Resolution date must be in the future",
                "Markets are reviewed before going live",
              ].map((g, i) => (
                <div
                  key={g}
                  className="flex items-start gap-2 text-xs text-[#A7AEC3]"
                >
                  <div className="w-4 h-4 rounded-full bg-[rgba(168,85,247,0.2)] flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[#A855F7]" style={{ fontSize: 9 }}>
                      {i + 1}
                    </span>
                  </div>
                  {g}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
