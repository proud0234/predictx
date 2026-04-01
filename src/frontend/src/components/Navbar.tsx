import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Bell,
  ChevronDown,
  ChevronLeft,
  Lock,
  LogOut,
  Menu,
  Moon,
  Search,
  Shield,
  Sun,
  TrendingUp,
  Wallet,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

type Page =
  | "home"
  | "markets"
  | "trade"
  | "portfolio"
  | "leaderboard"
  | "rewards"
  | "create"
  | "learn";

interface NavbarProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

const DROPDOWNS: Record<
  string,
  { label: string; items: { label: string; page?: Page }[] }
> = {
  markets: {
    label: "Markets",
    items: [
      { label: "Trending", page: "markets" },
      { label: "Crypto", page: "markets" },
      { label: "Sports", page: "markets" },
      { label: "Entertainment", page: "markets" },
      { label: "Technology", page: "markets" },
      { label: "Ending Soon", page: "markets" },
      { label: "High Volume", page: "markets" },
      { label: "New Markets", page: "markets" },
    ],
  },
  trade: {
    label: "Trade",
    items: [
      { label: "Spot YES/NO Trading", page: "trade" },
      { label: "Order Book", page: "trade" },
      { label: "Advanced Chart", page: "trade" },
      { label: "Open Orders", page: "trade" },
      { label: "Trade History", page: "trade" },
    ],
  },
  rewards: {
    label: "Rewards Hub",
    items: [
      { label: "Early Predictor Bonus", page: "rewards" },
      { label: "Referral Program", page: "rewards" },
      { label: "Streak Rewards", page: "rewards" },
      { label: "Weekly Challenges", page: "rewards" },
    ],
  },
  leaderboard: {
    label: "Leaderboard",
    items: [
      { label: "Top ROI", page: "leaderboard" },
      { label: "Accuracy Ranking", page: "leaderboard" },
      { label: "Monthly Winners", page: "leaderboard" },
    ],
  },
};

interface Notification {
  id: string;
  icon: string;
  title: string;
  time: string;
  read: boolean;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    icon: "🎯",
    title: "Your BTC prediction is winning! +$24.50",
    time: "2m ago",
    read: false,
  },
  {
    id: "2",
    icon: "⚡",
    title: "New market: Will ETH hit $5000 this month?",
    time: "15m ago",
    read: false,
  },
  {
    id: "3",
    icon: "🏆",
    title: "You've climbed to Rank #47 on the leaderboard",
    time: "1h ago",
    read: false,
  },
  {
    id: "4",
    icon: "💰",
    title: "Reward unlocked: Early Predictor Bonus — claim now",
    time: "3h ago",
    read: true,
  },
  {
    id: "5",
    icon: "🔔",
    title: "Market closing in 2 hours: US Election 2024",
    time: "5h ago",
    read: true,
  },
];

function getPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  if (password.length === 0) return { score: 0, label: "", color: "" };
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return { score: 25, label: "Weak", color: "#ff4b6e" };
  if (score <= 2) return { score: 50, label: "Fair", color: "#ffd700" };
  if (score <= 3) return { score: 75, label: "Good", color: "#26e6ff" };
  return { score: 100, label: "Strong", color: "#2ee59d" };
}

const GLASS_PANEL = {
  background: "rgba(11,13,24,0.97)",
  backdropFilter: "blur(24px)",
  WebkitBackdropFilter: "blur(24px)",
  border: "1px solid rgba(170,80,255,0.3)",
  boxShadow: "0 24px 60px rgba(0,0,0,0.7), 0 0 40px rgba(170,80,255,0.08)",
};

type ModalView = "account-picker" | "email-login" | "signup";

export function Navbar({ currentPage, onNavigate }: NavbarProps) {
  const { identity, login: icpLogin, clear: icpClear } = useInternetIdentity();
  const { user, isLoggedIn, login, logout, savedAccounts } = useAuth();

  // Dropdowns
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);

  // Notifications
  const [notifications, setNotifications] = useState<Notification[]>(
    INITIAL_NOTIFICATIONS,
  );
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Profile dropdown
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Auth modal
  const [authOpen, setAuthOpen] = useState(false);
  const [modalView, setModalView] = useState<ModalView>("account-picker");

  // Login form
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginErrors, setLoginErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  // Signup form
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPass, setSignupPass] = useState("");
  const [signupConfirm, setSignupConfirm] = useState("");
  const [signupErrors, setSignupErrors] = useState<Record<string, string>>({});
  const [signupTouched, setSignupTouched] = useState<Record<string, boolean>>(
    {},
  );

  const dropdownRef = useRef<HTMLDivElement>(null);
  const icpLoggedIn = !!identity && !identity.getPrincipal().isAnonymous();

  const unreadCount = notifications.filter((n) => !n.read).length;
  const pwStrength = getPasswordStrength(signupPass);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      )
        setActiveDropdown(null);
      if (notifRef.current && !notifRef.current.contains(e.target as Node))
        setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node))
        setProfileOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Theme toggle
  function toggleTheme() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.setAttribute(
      "data-theme",
      next ? "dark" : "light",
    );
    localStorage.setItem("predictx_theme", next ? "dark" : "light");
  }

  // Mark all read
  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function markRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }

  // Open auth modal
  function openLogin() {
    setModalView("account-picker");
    setAuthOpen(true);
  }
  function openSignup() {
    setModalView("signup");
    setAuthOpen(true);
  }
  function closeAuth() {
    setAuthOpen(false);
    setLoginEmail("");
    setLoginPassword("");
    setLoginErrors({});
    setSignupName("");
    setSignupEmail("");
    setSignupPass("");
    setSignupConfirm("");
    setSignupErrors({});
    setSignupTouched({});
  }

  // Login via saved account
  function loginWithAccount(name: string, email: string) {
    login(name, email);
    closeAuth();
    toast.success(`Welcome back, ${name.split(" ")[0]}! 👋`);
  }

  // Login via email/password
  function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    const errs: { email?: string; password?: string } = {};
    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/i.test(loginEmail))
      errs.email = "Please enter a valid Gmail address (@gmail.com)";
    if (loginPassword.length < 6)
      errs.password = "Password must be at least 6 characters";
    if (Object.keys(errs).length > 0) {
      setLoginErrors(errs);
      return;
    }
    // Find saved account or create anonymous
    const match = savedAccounts.find((a) => a.email === loginEmail);
    const name = match?.name ?? loginEmail.split("@")[0];
    login(name, loginEmail);
    closeAuth();
    toast.success(`Welcome back, ${name.split(" ")[0]}! 👋`);
  }

  // Validate signup fields
  function validateSignup() {
    const errs: Record<string, string> = {};
    if (signupName.trim().length < 3)
      errs.name = "Full name must be at least 3 characters";
    if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/i.test(signupEmail))
      errs.email = "Please enter a valid Gmail address (@gmail.com)";
    if (signupPass.length < 8)
      errs.pass = "Password must be at least 8 characters";
    else if (!/[A-Z]/.test(signupPass))
      errs.pass = "Password must contain at least 1 uppercase letter";
    else if (!/[0-9]/.test(signupPass))
      errs.pass = "Password must contain at least 1 digit";
    if (signupConfirm !== signupPass) errs.confirm = "Passwords do not match";
    return errs;
  }

  function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    const errs = validateSignup();
    setSignupErrors(errs);
    setSignupTouched({ name: true, email: true, pass: true, confirm: true });
    if (Object.keys(errs).length > 0) return;
    login(signupName.trim(), signupEmail);
    closeAuth();
    toast.success(`Welcome to PredictX, ${signupName.split(" ")[0]}! 🎉`);
  }

  function getSignupError(field: string) {
    return signupTouched[field] ? signupErrors[field] : undefined;
  }

  const inputClass =
    "bg-[rgba(20,20,35,0.8)] border-[rgba(170,80,255,0.3)] text-[#E9ECF5] placeholder:text-[#7E859C] focus:border-[rgba(170,80,255,0.7)] focus:ring-1 focus:ring-[rgba(170,80,255,0.4)]";
  const errorClass = "text-xs text-[#ff4b6e] mt-1";

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 glass-dark">
        <div className="max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <button
            type="button"
            data-ocid="nav.link"
            onClick={() => onNavigate("home")}
            className="flex items-center gap-2 shrink-0"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">PredictX</span>
          </button>

          {/* Center Nav */}
          <div
            ref={dropdownRef}
            className="hidden lg:flex items-center gap-1 relative"
          >
            {Object.entries(DROPDOWNS).map(([key, dd]) => (
              <div key={key} className="relative">
                <button
                  type="button"
                  data-ocid={`nav.${key}.link`}
                  className={`nav-link px-3 py-2 flex items-center gap-1 ${currentPage === key ? "active" : ""}`}
                  onMouseEnter={() => setActiveDropdown(key)}
                  onMouseLeave={() => setActiveDropdown(null)}
                  onClick={() => onNavigate(dd.items[0]?.page as Page)}
                >
                  {dd.label}
                  <ChevronDown className="w-3 h-3" />
                </button>
                <AnimatePresence>
                  {activeDropdown === key && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-1 w-52 rounded-xl py-2 z-50"
                      style={GLASS_PANEL}
                      onMouseEnter={() => setActiveDropdown(key)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      {dd.items.map((item) => (
                        <button
                          type="button"
                          key={item.label}
                          className="w-full text-left px-4 py-2 text-sm text-[#A7AEC3] hover:text-[#26E6FF] hover:bg-white/5 transition-colors"
                          onClick={() => {
                            onNavigate(item.page as Page);
                            setActiveDropdown(null);
                          }}
                        >
                          {item.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
            {(["portfolio", "create", "learn"] as const).map((p) => (
              <button
                key={p}
                type="button"
                data-ocid={`nav.${p}.link`}
                className={`nav-link px-3 py-2 capitalize ${currentPage === p ? "active" : ""}`}
                onClick={() => onNavigate(p)}
              >
                {p === "create" ? "Create Market" : p}
              </button>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2 shrink-0">
            {/* ICP Status Chip */}
            <div
              className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs"
              style={{
                background: "rgba(20,20,35,0.8)",
                border: "1px solid rgba(46,229,157,0.3)",
                color: "#A7AEC3",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              ICP Mainnet
            </div>

            {/* Security indicator */}
            <div
              className="hidden lg:flex items-center gap-1 px-2 py-1 rounded-md text-xs text-[#2ee59d] cursor-default relative group"
              style={{
                background: "rgba(46,229,157,0.06)",
                border: "1px solid rgba(46,229,157,0.15)",
              }}
            >
              <Lock className="w-3 h-3" />
              <span>ICP Secured</span>
              <div
                className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 rounded-lg text-xs text-[#E9ECF5] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                style={{
                  background: "rgba(11,13,24,0.97)",
                  border: "1px solid rgba(170,80,255,0.3)",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.5)",
                }}
              >
                Secured by Internet Computer blockchain
              </div>
            </div>

            {/* Search */}
            <div className="hidden md:flex items-center">
              {searchOpen ? (
                <div className="flex items-center gap-2 glass rounded-lg px-3 py-1.5">
                  <Search className="w-4 h-4 text-[#7E859C]" />
                  <input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search markets..."
                    data-ocid="nav.search_input"
                    className="bg-transparent text-sm text-[#E9ECF5] placeholder-[#7E859C] outline-none w-40"
                    onBlur={() => setSearchOpen(false)}
                  />
                </div>
              ) : (
                <button
                  type="button"
                  data-ocid="nav.search_input"
                  className="p-2 text-[#7E859C] hover:text-[#26E6FF] transition-colors"
                  onClick={() => setSearchOpen(true)}
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Notifications */}
            <div ref={notifRef} className="relative">
              <button
                type="button"
                data-ocid="nav.bell.button"
                className="relative p-2 text-[#7E859C] hover:text-[#26E6FF] transition-colors"
                onClick={() => setNotifOpen(!notifOpen)}
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-0.5 right-0.5 w-4 h-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-[10px] font-bold text-white flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              <AnimatePresence>
                {notifOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.97 }}
                    transition={{ duration: 0.18 }}
                    data-ocid="nav.notifications.panel"
                    className="absolute right-0 top-full mt-2 w-80 rounded-2xl overflow-hidden z-50"
                    style={GLASS_PANEL}
                  >
                    <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(170,80,255,0.15)]">
                      <span className="font-semibold text-[#E9ECF5] text-sm">
                        Notifications
                      </span>
                      <button
                        type="button"
                        data-ocid="nav.notifications.mark_all_button"
                        onClick={markAllRead}
                        className="text-xs text-[#a855f7] hover:text-[#26e6ff] transition-colors"
                      >
                        Mark all read
                      </button>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.map((n) => (
                        <button
                          type="button"
                          key={n.id}
                          data-ocid={`nav.notification.item.${n.id}`}
                          className="w-full flex items-start gap-3 px-4 py-3 hover:bg-white/5 transition-colors text-left border-b border-[rgba(170,80,255,0.08)] last:border-0"
                          onClick={() => markRead(n.id)}
                        >
                          <span className="text-lg leading-none mt-0.5">
                            {n.icon}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-[#E9ECF5] leading-snug">
                              {n.title}
                            </p>
                            <p className="text-xs text-[#7E859C] mt-0.5">
                              {n.time}
                            </p>
                          </div>
                          {!n.read && (
                            <span className="w-2 h-2 rounded-full bg-[#a855f7] shrink-0 mt-1.5" />
                          )}
                        </button>
                      ))}
                    </div>
                    <div className="px-4 py-2 border-t border-[rgba(170,80,255,0.15)]">
                      <button
                        type="button"
                        data-ocid="nav.notification_settings.button"
                        className="text-xs text-[#7E859C] hover:text-[#26e6ff] transition-colors w-full text-center py-1"
                      >
                        Notification Settings
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Auth + Profile */}
            {isLoggedIn && user ? (
              <div ref={profileRef} className="relative">
                <button
                  type="button"
                  data-ocid="nav.profile.button"
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white ring-2 ring-[rgba(170,80,255,0.4)] hover:ring-[rgba(170,80,255,0.8)] transition-all"
                  style={{ background: user.avatarColor }}
                >
                  {user.avatarInitials}
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.97 }}
                      transition={{ duration: 0.18 }}
                      data-ocid="nav.profile.dropdown_menu"
                      className="absolute right-0 top-full mt-2 w-72 rounded-2xl overflow-hidden z-50"
                      style={GLASS_PANEL}
                    >
                      {/* Header */}
                      <div className="px-4 py-4 border-b border-[rgba(170,80,255,0.15)]">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold text-white ring-2 ring-[rgba(170,80,255,0.4)] shrink-0"
                            style={{ background: user.avatarColor }}
                          >
                            {user.avatarInitials}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-[#E9ECF5] truncate">
                              {user.name}
                            </p>
                            <p className="text-xs text-[#7E859C] truncate">
                              {user.email}
                            </p>
                            <p className="text-xs text-[#7E859C] mt-0.5">
                              Joined {user.joinDate}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        {[
                          {
                            icon: "👤",
                            label: "My Profile",
                            action: () => {
                              onNavigate("portfolio");
                              setProfileOpen(false);
                            },
                          },
                          {
                            icon: "⚙️",
                            label: "Account Settings",
                            action: () => setProfileOpen(false),
                          },
                          {
                            icon: isDark ? "🌙" : "☀️",
                            label: `Appearance: ${isDark ? "Dark" : "Light"} Mode`,
                            action: () => {
                              toggleTheme();
                            },
                            suffix: (
                              <div
                                className="w-10 h-5 rounded-full flex items-center transition-all px-0.5"
                                style={{
                                  background: isDark
                                    ? "rgba(170,80,255,0.4)"
                                    : "rgba(200,200,200,0.3)",
                                }}
                              >
                                <div
                                  className="w-4 h-4 rounded-full bg-white transition-all"
                                  style={{ marginLeft: isDark ? "auto" : "0" }}
                                />
                              </div>
                            ),
                          },
                          {
                            icon: "🏆",
                            label: "Leaderboard",
                            action: () => {
                              onNavigate("leaderboard");
                              setProfileOpen(false);
                            },
                          },
                          {
                            icon: "🔔",
                            label: "Notification Settings",
                            action: () => setProfileOpen(false),
                          },
                          {
                            icon: "💼",
                            label: "My Portfolio",
                            action: () => {
                              onNavigate("portfolio");
                              setProfileOpen(false);
                            },
                          },
                          {
                            icon: "🔐",
                            label: "Security & Privacy",
                            action: () => setProfileOpen(false),
                          },
                        ].map(({ icon, label, action, suffix }) => (
                          <button
                            key={label}
                            type="button"
                            data-ocid={`nav.profile.${label.toLowerCase().replace(/[^a-z0-9]/g, "_")}.button`}
                            className="w-full flex items-center justify-between gap-3 px-4 py-2.5 text-sm text-[#A7AEC3] hover:text-[#E9ECF5] hover:bg-white/5 transition-colors text-left"
                            onClick={action}
                          >
                            <span className="flex items-center gap-3">
                              <span>{icon}</span>
                              <span>{label}</span>
                            </span>
                            {suffix}
                          </button>
                        ))}
                      </div>

                      {/* Sign Out */}
                      <div className="px-3 pb-3 pt-1 border-t border-[rgba(170,80,255,0.15)]">
                        <button
                          type="button"
                          data-ocid="nav.profile.sign_out.button"
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#ff4b6e] hover:bg-[rgba(255,75,110,0.1)] rounded-xl transition-colors"
                          onClick={() => {
                            logout();
                            icpClear();
                            setProfileOpen(false);
                          }}
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                        <div className="flex items-center justify-center gap-1.5 mt-2 text-xs text-[#2ee59d]">
                          <Shield className="w-3 h-3" />
                          <span>Secured by ICP Blockchain</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <button
                  type="button"
                  data-ocid="nav.login.button"
                  onClick={openLogin}
                  className="btn-secondary text-sm px-4 py-2 hidden sm:block"
                >
                  Login
                </button>
                <button
                  type="button"
                  data-ocid="nav.signup.button"
                  onClick={openSignup}
                  className="btn-primary text-sm px-4 py-2 hidden sm:block"
                >
                  Sign Up
                </button>
              </>
            )}

            {/* ICP Wallet Connect */}
            <button
              type="button"
              data-ocid="nav.wallet_connect.button"
              onClick={icpLoggedIn ? icpClear : icpLogin}
              className="flex items-center gap-2 glass rounded-lg px-3 py-1.5 text-sm font-semibold text-[#26E6FF] border border-[rgba(38,230,255,0.3)] hover:border-[rgba(38,230,255,0.6)] transition-all hover:bg-[rgba(38,230,255,0.05)]"
            >
              <Wallet className="w-4 h-4" />
              <span className="hidden sm:inline">
                {icpLoggedIn ? "Disconnect" : "Connect"}
              </span>
            </button>

            {/* Mobile Hamburger */}
            <button
              type="button"
              data-ocid="nav.mobile_menu.button"
              className="lg:hidden p-2 text-[#7E859C]"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.22 }}
              data-ocid="nav.mobile_menu.panel"
              className="lg:hidden overflow-hidden border-t border-[rgba(170,80,255,0.2)]"
              style={{
                background: "rgba(7,8,18,0.97)",
                backdropFilter: "blur(20px)",
              }}
            >
              <div className="px-4 py-4 space-y-1">
                {/* Section 1: Navigation */}
                <p className="text-[10px] font-semibold uppercase tracking-widest text-[#7E859C] mb-2">
                  Navigation
                </p>
                {(
                  [
                    "markets",
                    "trade",
                    "rewards",
                    "leaderboard",
                    "portfolio",
                    "create",
                    "learn",
                  ] as Page[]
                ).map((p) => (
                  <button
                    key={p}
                    type="button"
                    data-ocid={`nav.mobile.${p}.link`}
                    className={`nav-link w-full py-2 text-left capitalize ${currentPage === p ? "active" : ""}`}
                    onClick={() => {
                      onNavigate(p);
                      setMobileOpen(false);
                    }}
                  >
                    {p === "create" ? "Create Market" : p}
                  </button>
                ))}

                {/* Section 2: Settings */}
                <div className="border-t border-[rgba(170,80,255,0.15)] pt-3 mt-3">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[#7E859C] mb-2">
                    Settings
                  </p>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-sm text-[#A7AEC3] flex items-center gap-2">
                      {isDark ? (
                        <Moon className="w-4 h-4" />
                      ) : (
                        <Sun className="w-4 h-4" />
                      )}
                      Appearance: {isDark ? "Dark" : "Light"} Mode
                    </span>
                    <button
                      type="button"
                      data-ocid="nav.mobile.theme.toggle"
                      onClick={toggleTheme}
                      className="w-10 h-5 rounded-full flex items-center px-0.5 transition-all"
                      style={{
                        background: isDark
                          ? "rgba(170,80,255,0.4)"
                          : "rgba(200,200,200,0.3)",
                      }}
                    >
                      <div
                        className="w-4 h-4 rounded-full bg-white transition-all"
                        style={{ marginLeft: isDark ? "auto" : "0" }}
                      />
                    </button>
                  </div>
                </div>

                {/* Section 3: Account */}
                <div className="border-t border-[rgba(170,80,255,0.15)] pt-3 mt-3">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-[#7E859C] mb-2">
                    Account
                  </p>
                  {isLoggedIn && user ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                          style={{ background: user.avatarColor }}
                        >
                          {user.avatarInitials}
                        </div>
                        <div>
                          <p className="text-sm text-[#E9ECF5]">{user.name}</p>
                          <p className="text-xs text-[#7E859C]">{user.email}</p>
                        </div>
                      </div>
                      <button
                        type="button"
                        data-ocid="nav.mobile.logout.button"
                        onClick={() => {
                          logout();
                          setMobileOpen(false);
                        }}
                        className="text-xs text-[#ff4b6e] hover:underline"
                      >
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        data-ocid="nav.mobile.login.button"
                        onClick={() => {
                          openLogin();
                          setMobileOpen(false);
                        }}
                        className="btn-secondary text-sm px-4 py-2 flex-1"
                      >
                        Login
                      </button>
                      <button
                        type="button"
                        data-ocid="nav.mobile.signup.button"
                        onClick={() => {
                          openSignup();
                          setMobileOpen(false);
                        }}
                        className="btn-primary text-sm px-4 py-2 flex-1"
                      >
                        Sign Up
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Auth Modal Backdrop */}
      <AnimatePresence>
        {authOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{
              background: "rgba(0,0,0,0.75)",
              backdropFilter: "blur(6px)",
            }}
            onClick={(e) => {
              if (e.target === e.currentTarget) closeAuth();
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.22 }}
              className="w-full max-w-md rounded-2xl overflow-hidden"
              style={GLASS_PANEL}
              data-ocid="auth.modal"
            >
              {/* Header bar */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(170,80,255,0.15)]">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-400 flex items-center justify-center">
                    <TrendingUp className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="font-bold gradient-text">PredictX</span>
                </div>
                <button
                  type="button"
                  data-ocid="auth.close_button"
                  onClick={closeAuth}
                  className="text-[#7E859C] hover:text-[#E9ECF5] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="px-6 py-6">
                {/* Account Picker */}
                {modalView === "account-picker" && (
                  <div>
                    <h2 className="text-2xl font-bold text-[#E9ECF5] mb-1">
                      Sign in to PredictX
                    </h2>
                    <p className="text-sm text-[#7E859C] mb-5">
                      Choose an account
                    </p>

                    <div className="space-y-2 mb-5">
                      {savedAccounts.map((acc) => (
                        <button
                          type="button"
                          key={acc.email}
                          data-ocid="auth.account_picker.item"
                          className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors border border-[rgba(170,80,255,0.15)] hover:border-[rgba(170,80,255,0.4)] group"
                          onClick={() => loginWithAccount(acc.name, acc.email)}
                        >
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                            style={{ background: acc.avatarColor }}
                          >
                            {acc.avatarInitials}
                          </div>
                          <div className="text-left min-w-0">
                            <p className="text-sm font-semibold text-[#E9ECF5]">
                              {acc.name}
                            </p>
                            <p className="text-xs text-[#7E859C] truncate">
                              {acc.email}
                            </p>
                          </div>
                          <ChevronDown className="w-4 h-4 text-[#7E859C] rotate-[-90deg] ml-auto group-hover:text-[#26e6ff] transition-colors shrink-0" />
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-3 my-4">
                      <div className="flex-1 h-px bg-[rgba(170,80,255,0.2)]" />
                      <span className="text-xs text-[#7E859C]">or</span>
                      <div className="flex-1 h-px bg-[rgba(170,80,255,0.2)]" />
                    </div>

                    <button
                      type="button"
                      data-ocid="auth.use_another_account.button"
                      className="w-full btn-secondary py-2.5 text-sm"
                      onClick={() => setModalView("email-login")}
                    >
                      Use another account
                    </button>

                    <p className="text-center text-xs text-[#7E859C] mt-4">
                      Don't have an account?{" "}
                      <button
                        type="button"
                        className="text-[#26E6FF] hover:underline"
                        onClick={() => setModalView("signup")}
                      >
                        Sign Up
                      </button>
                    </p>
                  </div>
                )}

                {/* Email Login */}
                {modalView === "email-login" && (
                  <div>
                    <button
                      type="button"
                      data-ocid="auth.back.button"
                      className="flex items-center gap-1.5 text-sm text-[#7E859C] hover:text-[#26e6ff] transition-colors mb-4"
                      onClick={() => setModalView("account-picker")}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Back
                    </button>

                    <h2 className="text-2xl font-bold text-[#E9ECF5] mb-1">
                      Sign in
                    </h2>
                    <p className="text-sm text-[#7E859C] mb-5">
                      Use your Gmail account
                    </p>

                    <form onSubmit={handleEmailLogin} className="space-y-4">
                      <div>
                        <label
                          htmlFor="login-email"
                          className="text-sm text-[#A7AEC3] block mb-1"
                        >
                          Gmail Address
                        </label>
                        <div className="relative">
                          <Input
                            id="login-email"
                            data-ocid="auth.email.input"
                            type="email"
                            placeholder="yourname@gmail.com"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            className={inputClass}
                          />
                        </div>
                        {loginErrors.email && (
                          <p className={errorClass}>{loginErrors.email}</p>
                        )}
                      </div>
                      <div>
                        <label
                          htmlFor="login-password"
                          className="text-sm text-[#A7AEC3] block mb-1"
                        >
                          Password
                        </label>
                        <Input
                          id="login-password"
                          data-ocid="auth.password.input"
                          type="password"
                          placeholder="Enter your password"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          className={inputClass}
                        />
                        {loginErrors.password && (
                          <p className={errorClass}>{loginErrors.password}</p>
                        )}
                      </div>
                      <Button
                        type="submit"
                        data-ocid="auth.signin.submit_button"
                        className="w-full btn-primary py-3 text-sm border-0"
                      >
                        Sign In
                      </Button>
                    </form>

                    <p className="text-center text-xs text-[#7E859C] mt-4">
                      Don't have an account?{" "}
                      <button
                        type="button"
                        className="text-[#26E6FF] hover:underline"
                        onClick={() => setModalView("signup")}
                      >
                        Sign Up
                      </button>
                    </p>
                  </div>
                )}

                {/* Signup */}
                {modalView === "signup" && (
                  <div>
                    <button
                      type="button"
                      data-ocid="auth.back.button"
                      className="flex items-center gap-1.5 text-sm text-[#7E859C] hover:text-[#26e6ff] transition-colors mb-4"
                      onClick={() => setModalView("account-picker")}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Back
                    </button>

                    <h2 className="text-2xl font-bold text-[#E9ECF5] mb-1">
                      Create Account
                    </h2>
                    <p className="text-sm text-[#7E859C] mb-5">
                      Join PredictX today
                    </p>

                    <form onSubmit={handleSignup} className="space-y-3">
                      <div>
                        <label
                          htmlFor="signup-name"
                          className="text-sm text-[#A7AEC3] block mb-1"
                        >
                          Full Name
                        </label>
                        <Input
                          id="signup-name"
                          data-ocid="auth.signup.name.input"
                          placeholder="John Doe"
                          value={signupName}
                          onChange={(e) => setSignupName(e.target.value)}
                          onBlur={() =>
                            setSignupTouched((p) => ({ ...p, name: true }))
                          }
                          className={inputClass}
                        />
                        {getSignupError("name") && (
                          <p className={errorClass}>{getSignupError("name")}</p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="signup-email"
                          className="text-sm text-[#A7AEC3] block mb-1"
                        >
                          Gmail Address
                        </label>
                        <Input
                          id="signup-email"
                          data-ocid="auth.signup.email.input"
                          type="email"
                          placeholder="yourname@gmail.com"
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                          onBlur={() =>
                            setSignupTouched((p) => ({ ...p, email: true }))
                          }
                          className={inputClass}
                        />
                        {getSignupError("email") && (
                          <p className={errorClass}>
                            {getSignupError("email")}
                          </p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="signup-pass"
                          className="text-sm text-[#A7AEC3] block mb-1"
                        >
                          Password
                        </label>
                        <Input
                          id="signup-pass"
                          data-ocid="auth.signup.password.input"
                          type="password"
                          placeholder="Min 8 chars, 1 uppercase, 1 digit"
                          value={signupPass}
                          onChange={(e) => setSignupPass(e.target.value)}
                          onBlur={() =>
                            setSignupTouched((p) => ({ ...p, pass: true }))
                          }
                          className={inputClass}
                        />
                        {signupPass.length > 0 && (
                          <div className="mt-1.5">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs text-[#7E859C]">
                                Password strength
                              </span>
                              <span
                                className="text-xs font-semibold"
                                style={{ color: pwStrength.color }}
                              >
                                {pwStrength.label}
                              </span>
                            </div>
                            <Progress
                              value={pwStrength.score}
                              className="h-1"
                              style={{ background: "rgba(170,80,255,0.15)" }}
                            />
                          </div>
                        )}
                        {getSignupError("pass") && (
                          <p className={errorClass}>{getSignupError("pass")}</p>
                        )}
                      </div>

                      <div>
                        <label
                          htmlFor="signup-confirm"
                          className="text-sm text-[#A7AEC3] block mb-1"
                        >
                          Confirm Password
                        </label>
                        <Input
                          id="signup-confirm"
                          data-ocid="auth.signup.confirm_password.input"
                          type="password"
                          placeholder="Repeat your password"
                          value={signupConfirm}
                          onChange={(e) => setSignupConfirm(e.target.value)}
                          onBlur={() =>
                            setSignupTouched((p) => ({ ...p, confirm: true }))
                          }
                          className={inputClass}
                        />
                        {getSignupError("confirm") && (
                          <p className={errorClass}>
                            {getSignupError("confirm")}
                          </p>
                        )}
                      </div>

                      <Button
                        type="submit"
                        data-ocid="auth.signup.submit_button"
                        className="w-full btn-primary py-3 text-sm border-0 mt-1"
                      >
                        Create Account
                      </Button>
                    </form>

                    <p className="text-center text-xs text-[#7E859C] mt-3">
                      Already have an account?{" "}
                      <button
                        type="button"
                        className="text-[#26E6FF] hover:underline"
                        onClick={() => setModalView("account-picker")}
                      >
                        Sign In
                      </button>
                    </p>
                  </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-center gap-1.5 mt-5 text-xs text-[#2ee59d] opacity-80">
                  <Shield className="w-3 h-3" />
                  <span>Secured by Internet Computer Protocol</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
