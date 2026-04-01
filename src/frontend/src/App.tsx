import { Toaster } from "@/components/ui/sonner";
import { useState } from "react";
import { CommunityChatWidget } from "./components/CommunityChat";
import { Footer } from "./components/Footer";
import { Navbar } from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import { CreateMarketPage } from "./pages/CreateMarketPage";
import { HomePage } from "./pages/HomePage";
import { LeaderboardPage } from "./pages/LeaderboardPage";
import { LearnPage } from "./pages/LearnPage";
import { MarketsPage } from "./pages/MarketsPage";
import { PortfolioPage } from "./pages/PortfolioPage";
import { RewardsPage } from "./pages/RewardsPage";
import { TradePage } from "./pages/TradePage";

type Page =
  | "home"
  | "markets"
  | "trade"
  | "portfolio"
  | "leaderboard"
  | "rewards"
  | "create"
  | "learn";

function AppInner() {
  const [currentPage, setCurrentPage] = useState<Page>("home");

  const navigate = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage onNavigate={navigate} />;
      case "markets":
        return <MarketsPage onNavigate={navigate} />;
      case "trade":
        return <TradePage />;
      case "portfolio":
        return <PortfolioPage />;
      case "leaderboard":
        return <LeaderboardPage />;
      case "rewards":
        return <RewardsPage />;
      case "create":
        return <CreateMarketPage />;
      case "learn":
        return <LearnPage />;
      default:
        return <HomePage onNavigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "#070812" }}>
      <Navbar currentPage={currentPage} onNavigate={navigate} />
      <main>{renderPage()}</main>
      <Footer />
      <CommunityChatWidget />
      <Toaster
        theme="dark"
        toastOptions={{
          style: {
            background: "rgba(20,20,35,0.95)",
            border: "1px solid rgba(170,80,255,0.3)",
            color: "#E9ECF5",
          },
        }}
      />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}

export default App;
