import { ScrollArea } from "@/components/ui/scroll-area";
import {
  BookOpen,
  MessageCircle,
  Pin,
  Send,
  Sparkles,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";

type Tier = "Diamond" | "Gold" | "Silver" | "Beginner";
type RoomId = "expert" | "beginners" | "general";

interface ChatMessage {
  id: string;
  username: string;
  tier: Tier;
  avatar: string;
  avatarColor: string;
  timestamp: string;
  text: string;
  isExpertTip?: boolean;
  room: RoomId;
}

interface Room {
  id: RoomId;
  label: string;
  icon: string;
  unread: number;
}

const ROOMS: Room[] = [
  { id: "expert", label: "Expert Lounge", icon: "\ud83c\udfc6", unread: 2 },
  {
    id: "beginners",
    label: "Beginners Corner",
    icon: "\ud83c\udf93",
    unread: 5,
  },
  { id: "general", label: "General", icon: "\ud83d\udcac", unread: 1 },
];

const PINNED_TIPS = [
  {
    id: "p1",
    username: "CryptoSage",
    tier: "Diamond" as Tier,
    text: "Always set a stop-loss before entering any YES/NO position. Discipline over FOMO.",
  },
  {
    id: "p2",
    username: "OracleKing",
    tier: "Diamond" as Tier,
    text: "Watch BTC dominance charts. When dominance rises, altcoin markets tend to underperform.",
  },
  {
    id: "p3",
    username: "PredictMaster",
    tier: "Gold" as Tier,
    text: "Volume spikes 30 min before close are smart-money signals. Track before large YES bets.",
  },
];

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "m1",
    username: "CryptoSage",
    tier: "Diamond",
    avatar: "CS",
    avatarColor: "#7c3aed",
    timestamp: "09:14",
    text: "BTC consolidating around $67k \u2014 classic accumulation zone. Stay sharp.",
    room: "expert",
  },
  {
    id: "m2",
    username: "OracleKing",
    tier: "Diamond",
    avatar: "OK",
    avatarColor: "#2563eb",
    timestamp: "09:17",
    text: "74% probability of BTC breaking $70k before month end. Stacking YES carefully.",
    isExpertTip: true,
    room: "expert",
  },
  {
    id: "m3",
    username: "PredictMaster",
    tier: "Gold",
    avatar: "PM",
    avatarColor: "#d97706",
    timestamp: "09:22",
    text: "Always hedge your BTC position with a small ETH short. Reduces downside without killing upside.",
    isExpertTip: true,
    room: "expert",
  },
  {
    id: "m4",
    username: "NewTrader99",
    tier: "Beginner",
    avatar: "NT",
    avatarColor: "#0891b2",
    timestamp: "09:31",
    text: "Just joined PredictX! How do I read the order book on crypto markets?",
    room: "beginners",
  },
  {
    id: "m5",
    username: "CryptoSage",
    tier: "Diamond",
    avatar: "CS",
    avatarColor: "#7c3aed",
    timestamp: "09:33",
    text: "Green side = YES buyers, red = NO sellers. Watch for large walls \u2014 they act as support/resistance.",
    isExpertTip: true,
    room: "beginners",
  },
  {
    id: "m6",
    username: "CryptoNewbie",
    tier: "Beginner",
    avatar: "CN",
    avatarColor: "#059669",
    timestamp: "09:35",
    text: "What's the safest market to start with? Afraid of losing too much.",
    room: "beginners",
  },
  {
    id: "m7",
    username: "PredictMaster",
    tier: "Gold",
    avatar: "PM",
    avatarColor: "#d97706",
    timestamp: "09:37",
    text: "Start with sports outcomes or tech milestones. Avoid meme coins until you have a strategy.",
    isExpertTip: true,
    room: "beginners",
  },
  {
    id: "m8",
    username: "LearnerX",
    tier: "Beginner",
    avatar: "LX",
    avatarColor: "#be185d",
    timestamp: "09:41",
    text: "Can I lose more than my deposit? Like margin trading?",
    room: "beginners",
  },
  {
    id: "m9",
    username: "OracleKing",
    tier: "Diamond",
    avatar: "OK",
    avatarColor: "#2563eb",
    timestamp: "09:42",
    text: "No margin \u2014 your max loss is your stake. That's the beauty of binary outcomes.",
    room: "beginners",
  },
  {
    id: "m10",
    username: "CryptoSage",
    tier: "Diamond",
    avatar: "CS",
    avatarColor: "#7c3aed",
    timestamp: "10:05",
    text: "Watch for volume spikes before large YES bets. If it 3x's with no news, someone knows something.",
    isExpertTip: true,
    room: "general",
  },
  {
    id: "m11",
    username: "NewTrader99",
    tier: "Beginner",
    avatar: "NT",
    avatarColor: "#0891b2",
    timestamp: "10:08",
    text: "Thanks for all the tips! Diamond tier win rates on the leaderboard are insane.",
    room: "general",
  },
  {
    id: "m12",
    username: "PredictMaster",
    tier: "Gold",
    avatar: "PM",
    avatarColor: "#d97706",
    timestamp: "10:11",
    text: "Focus on +EV decisions consistently. The rank follows naturally.",
    room: "general",
  },
];

const TIER_CONFIG: Record<
  Tier,
  { label: string; color: string; glow: string }
> = {
  Diamond: {
    label: "\ud83d\udc8e Diamond",
    color: "#a855f7",
    glow: "rgba(168,85,247,0.35)",
  },
  Gold: {
    label: "\ud83e\udd47 Gold",
    color: "#eab308",
    glow: "rgba(234,179,8,0.25)",
  },
  Silver: {
    label: "\ud83e\udd48 Silver",
    color: "#94a3b8",
    glow: "rgba(148,163,184,0.2)",
  },
  Beginner: {
    label: "\ud83c\udf31 Beginner",
    color: "#22d3ee",
    glow: "transparent",
  },
};

function isExpert(tier: Tier) {
  return tier === "Diamond" || tier === "Gold";
}

function TierBadge({ tier }: { tier: Tier }) {
  const cfg = TIER_CONFIG[tier];
  return (
    <span
      className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0"
      style={{
        background: `${cfg.color}22`,
        color: cfg.color,
        border: `1px solid ${cfg.color}55`,
      }}
    >
      {cfg.label}
    </span>
  );
}

function ExpertTipCard({
  msg,
  onApply,
}: {
  msg: ChatMessage;
  onApply: () => void;
}) {
  return (
    <div
      className="rounded-xl p-3 mt-1"
      style={{
        background:
          "linear-gradient(135deg, rgba(124,58,237,0.18) 0%, rgba(37,99,235,0.12) 100%)",
        border: "1px solid rgba(168,85,247,0.4)",
        boxShadow: "0 0 16px rgba(168,85,247,0.1)",
      }}
    >
      <div className="flex items-center gap-1.5 mb-1.5">
        <Sparkles className="w-3 h-3" style={{ color: "#a855f7" }} />
        <span
          className="text-[9px] font-bold tracking-widest uppercase"
          style={{ color: "#a855f7" }}
        >
          Expert Tip
        </span>
      </div>
      <p className="text-xs leading-relaxed" style={{ color: "#e2e8f0" }}>
        {msg.text}
      </p>
      <button
        type="button"
        onClick={onApply}
        className="mt-2 text-[10px] font-semibold px-2.5 py-1 rounded-lg transition-all hover:scale-105"
        style={{
          background: "linear-gradient(135deg, #7c3aed, #2563eb)",
          color: "#fff",
          boxShadow: "0 0 10px rgba(124,58,237,0.4)",
        }}
        data-ocid="chat.expert_tip.button"
      >
        Apply to Trade &#x2192;
      </button>
    </div>
  );
}

function MessageBubble({
  msg,
  onApplyTip,
}: {
  msg: ChatMessage;
  onApplyTip: () => void;
}) {
  const expert = isExpert(msg.tier);
  const tierCfg = TIER_CONFIG[msg.tier];
  return (
    <div className="flex gap-2">
      <div
        className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold text-white mt-0.5"
        style={{
          background: msg.avatarColor,
          boxShadow: expert ? `0 0 8px ${tierCfg.glow}` : "none",
        }}
      >
        {msg.avatar}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
          <span
            className="text-xs font-semibold"
            style={{ color: expert ? tierCfg.color : "#e2e8f0" }}
          >
            {msg.username}
          </span>
          <TierBadge tier={msg.tier} />
          <span className="text-[10px]" style={{ color: "#4b5563" }}>
            {msg.timestamp}
          </span>
        </div>
        {msg.isExpertTip ? (
          <ExpertTipCard msg={msg} onApply={onApplyTip} />
        ) : (
          <div
            className="text-xs leading-relaxed rounded-xl px-3 py-2"
            style={{
              background: expert
                ? "rgba(124,58,237,0.1)"
                : "rgba(255,255,255,0.04)",
              borderLeft: expert ? `2px solid ${tierCfg.color}` : "none",
              color: "#cbd5e1",
            }}
          >
            {msg.text}
          </div>
        )}
      </div>
    </div>
  );
}

export function CommunityChatWidget() {
  const [open, setOpen] = useState(false);
  const [activeRoom, setActiveRoom] = useState<RoomId>("beginners");
  const [rooms, setRooms] = useState<Room[]>(ROOMS);
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const filteredMessages = messages.filter((m) => m.room === activeRoom);
  const totalUnread = rooms.reduce((sum, r) => sum + r.unread, 0);

  function sendMessage() {
    const text = inputValue.trim();
    if (!text) return;
    const newMsg: ChatMessage = {
      id: `m${Date.now()}`,
      username: "You",
      tier: "Beginner",
      avatar: "YO",
      avatarColor: "#0891b2",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      text,
      room: activeRoom,
    };
    setMessages((prev) => [...prev, newMsg]);
    setInputValue("");
    setTimeout(
      () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }),
      60,
    );
  }

  function switchRoom(id: RoomId) {
    setActiveRoom(id);
    setRooms((prev) =>
      prev.map((r) => (r.id === id ? { ...r, unread: 0 } : r)),
    );
    setTimeout(
      () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }),
      60,
    );
  }

  function handleApplyTip() {
    setOpen(false);
  }

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3"
      data-ocid="chat.panel"
    >
      {/* Popup Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            className="flex flex-col rounded-2xl overflow-hidden"
            style={{
              width: "380px",
              height: "520px",
              background: "rgba(9,10,20,0.98)",
              border: "1px solid rgba(168,85,247,0.3)",
              boxShadow:
                "0 24px 60px rgba(0,0,0,0.8), 0 0 40px rgba(124,58,237,0.15)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 flex-shrink-0"
              style={{
                background:
                  "linear-gradient(135deg, rgba(124,58,237,0.2), rgba(37,99,235,0.12))",
                borderBottom: "1px solid rgba(168,85,247,0.2)",
              }}
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-lg flex items-center justify-center"
                  style={{
                    background: "linear-gradient(135deg, #7c3aed, #2563eb)",
                    boxShadow: "0 0 12px rgba(124,58,237,0.5)",
                  }}
                >
                  <MessageCircle className="w-3.5 h-3.5 text-white" />
                </div>
                <div>
                  <p
                    className="text-sm font-bold leading-none"
                    style={{ color: "#e2e8f0" }}
                  >
                    Community Chat
                  </p>
                  <p
                    className="text-[10px] mt-0.5"
                    style={{ color: "#6b7280" }}
                  >
                    Experts mentoring beginners
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  color: "#9ca3af",
                }}
                data-ocid="chat.close_button"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Room Tabs */}
            <div
              className="flex gap-1 px-3 py-2 flex-shrink-0"
              style={{ borderBottom: "1px solid rgba(168,85,247,0.12)" }}
            >
              {rooms.map((room) => (
                <button
                  key={room.id}
                  type="button"
                  data-ocid={`chat.${room.id}.tab`}
                  onClick={() => switchRoom(room.id)}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all flex-1 justify-center"
                  style={{
                    background:
                      activeRoom === room.id
                        ? "linear-gradient(135deg, rgba(124,58,237,0.3), rgba(37,99,235,0.2))"
                        : "transparent",
                    border:
                      activeRoom === room.id
                        ? "1px solid rgba(168,85,247,0.4)"
                        : "1px solid transparent",
                    color: activeRoom === room.id ? "#e2e8f0" : "#6b7280",
                  }}
                >
                  <span>{room.icon}</span>
                  <span className="hidden sm:inline truncate">
                    {room.id === "beginners"
                      ? "Beginners"
                      : room.id === "expert"
                        ? "Experts"
                        : "General"}
                  </span>
                  {room.unread > 0 && (
                    <span
                      className="text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: "#a855f7", color: "#fff" }}
                    >
                      {room.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Pinned Tips — beginners room */}
            {activeRoom === "beginners" && (
              <div
                className="px-3 py-2 flex-shrink-0"
                style={{
                  borderBottom: "1px solid rgba(168,85,247,0.08)",
                  background: "rgba(124,58,237,0.04)",
                }}
              >
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Pin className="w-3 h-3" style={{ color: "#a855f7" }} />
                  <span
                    className="text-[9px] font-bold tracking-wider uppercase"
                    style={{ color: "#a855f7" }}
                  >
                    Pinned Tips
                  </span>
                </div>
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {PINNED_TIPS.map((tip) => (
                    <div
                      key={tip.id}
                      className="flex-shrink-0 w-52 rounded-lg p-2"
                      style={{
                        background:
                          "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(37,99,235,0.08))",
                        border: "1px solid rgba(168,85,247,0.25)",
                      }}
                    >
                      <div className="flex items-center gap-1 mb-1">
                        <Sparkles
                          className="w-2.5 h-2.5"
                          style={{ color: "#a855f7" }}
                        />
                        <span
                          className="text-[9px] font-bold"
                          style={{ color: "#a855f7" }}
                        >
                          {tip.username}
                        </span>
                        <TierBadge tier={tip.tier} />
                      </div>
                      <p
                        className="text-[10px] leading-relaxed"
                        style={{ color: "#9ca3af" }}
                      >
                        {tip.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Online sidebar indicator strip */}
            <div
              className="flex items-center gap-3 px-3 py-1.5 flex-shrink-0"
              style={{
                borderBottom: "1px solid rgba(168,85,247,0.08)",
                background: "rgba(255,255,255,0.01)",
              }}
            >
              <div className="flex items-center gap-1">
                <Users className="w-3 h-3" style={{ color: "#6b7280" }} />
                <span className="text-[10px]" style={{ color: "#6b7280" }}>
                  Online:
                </span>
              </div>
              {[
                { name: "CryptoSage", color: "#7c3aed" },
                { name: "OracleKing", color: "#2563eb" },
                { name: "PredictMaster", color: "#d97706" },
              ].map((e) => (
                <div key={e.name} className="flex items-center gap-1">
                  <div
                    className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold text-white"
                    style={{ background: e.color }}
                  >
                    {e.name[0]}
                  </div>
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: "#22c55e" }}
                  />
                </div>
              ))}
              <div className="ml-auto flex items-center gap-1">
                <TrendingUp className="w-3 h-3" style={{ color: "#22d3ee" }} />
                <span className="text-[10px]" style={{ color: "#22d3ee" }}>
                  3 experts live
                </span>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 px-3 py-3">
              <div className="flex flex-col gap-3">
                {filteredMessages.map((msg) => (
                  <MessageBubble
                    key={msg.id}
                    msg={msg}
                    onApplyTip={handleApplyTip}
                  />
                ))}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input */}
            <div
              className="px-3 py-3 flex-shrink-0"
              style={{ borderTop: "1px solid rgba(168,85,247,0.15)" }}
            >
              <div
                className="flex gap-2 items-center rounded-xl px-3 py-2"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(168,85,247,0.2)",
                }}
              >
                <BookOpen
                  className="w-3.5 h-3.5 flex-shrink-0"
                  style={{ color: "#4b5563" }}
                />
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  placeholder="Ask or share a prediction\u2026"
                  className="flex-1 bg-transparent text-xs outline-none placeholder:text-gray-600"
                  style={{ color: "#e2e8f0" }}
                  data-ocid="chat.input"
                />
                <button
                  type="button"
                  onClick={sendMessage}
                  className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-all hover:scale-110"
                  style={{
                    background: inputValue.trim()
                      ? "linear-gradient(135deg, #7c3aed, #2563eb)"
                      : "rgba(124,58,237,0.15)",
                    boxShadow: inputValue.trim()
                      ? "0 0 10px rgba(124,58,237,0.5)"
                      : "none",
                  }}
                  data-ocid="chat.send.button"
                >
                  <Send className="w-3 h-3 text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Bubble Button */}
      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        className="relative w-14 h-14 rounded-full flex items-center justify-center"
        style={{
          background: open
            ? "linear-gradient(135deg, #5b21b6, #1d4ed8)"
            : "linear-gradient(135deg, #7c3aed, #2563eb)",
          boxShadow:
            "0 0 24px rgba(124,58,237,0.6), 0 4px 16px rgba(0,0,0,0.5)",
        }}
        data-ocid="chat.open_modal_button"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <X className="w-6 h-6 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.15 }}
            >
              <MessageCircle className="w-6 h-6 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
        {!open && totalUnread > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
            style={{
              background: "#ef4444",
              color: "#fff",
              boxShadow: "0 0 8px rgba(239,68,68,0.6)",
            }}
          >
            {totalUnread}
          </motion.span>
        )}
      </motion.button>
    </div>
  );
}
