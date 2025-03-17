import { useState} from "react";
import Sidebar from "./sidebar";
import Profile from "./Profile";
import Subscriptions from "./Subscriptions";
import Notifications from "./notifications";
import History from "./history";
import Watchlist from "./watchlist";
import Preferences from "./preferences";
import Security from "./security";
import logo from "../logo.jpg";
import { useEffect, useRef } from "react";
import {Search} from "lucide-react";
import {Link} from "react-router-dom";
import {motion, AnimatePresence} from "framer-motion";
import {X} from "lucide-react";

// SearchOverlay Component
const SearchOverlay = () => {
  const [isOpen, setIsOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check if focus is in an input field or textarea
      const target = e.target as HTMLElement;
      const isInputFocused =
        target.tagName === "INPUT" || target.tagName === "TEXTAREA";

      // Only handle Cmd/Ctrl+K if not typing in an input
      if ((e.metaKey || e.ctrlKey) && e.key === "k" && !isInputFocused) {
        e.preventDefault(); // Prevent default browser behavior
        setIsOpen(true);
      }

      // Handle Escape key to close (this is fine for any element)
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    // Add event listener
    document.addEventListener("keydown", handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  // Prevent body scroll when overlay is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";

      // Focus the search input when overlay opens
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 100);
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const toggleSearch = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add search logic here
    setIsOpen(false); // Close after search
  };

  return (
    <div>
      {/* Search Icon Button */}
      <button
        onClick={toggleSearch}
        className="p-2 hover:bg-gray-100 hover:bg-opacity-10 rounded-full transition-colors"
        aria-label="Open search"
      >
        <Search className="w-6 h-6" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 min-h-screen overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsOpen(false);
            }
          }}
        >
          {/* Blur Background */}
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-xl backdrop-saturate-200"
            onClick={() => setIsOpen(false)}
          />

          {/* Search Content */}
          <div
            className="relative min-h-screen flex flex-col opacity-90 rounded-full border-emerald-200 items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Container */}
            <div className="w-full max-w-2xl rounded-full border-emerald-200 mx-auto px-4 pt-32">
              {/* Search Form */}
              <div className="bg-white rounded-full border-emerald-200 shadow-lg mb-4">
                <form onSubmit={handleSubmit} className="relative">
                  <input
                    type="text"
                    placeholder="Search... (⌘K)"
                    className="w-full px-4 py-4 pr-12 text-lg border-emerald-200 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-700 text-gray-900"
                    autoFocus
                    ref={searchInputRef}
                  />
                  {/* Close Button */}
                  <button
                    type="button"
                    onClick={toggleSearch}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Close search"
                  >
                    <X className="w-6 h-6 text-gray-600" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface Subscription {
  plan: string;
  price: string;
  features: string[];
  current: boolean;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
}

interface AnalysisHistory {
  id: string;
  ticker: string;
  date: string;
  prediction: string;
  accuracy: string;
}

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [savedTickers, setSavedTickers] = useState<string[]>([
    "AAPL",
    "NVDA",
    "MSFT",
    "GOOGL",
  ]);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Analysis Complete",
      message: "Your NVDA stock prediction analysis is ready to view.",
      date: "2h ago",
      read: false,
    },
    {
      id: "2",
      title: "Market Alert",
      message: "Unusual trading volume detected for AAPL.",
      date: "Yesterday",
      read: true,
    },
    {
      id: "3",
      title: "Account Updated",
      message: "Your account settings have been successfully updated.",
      date: "3 days ago",
      read: true,
    },
  ]);

  const [analysisHistory] = useState<AnalysisHistory[]>([
    {
      id: "1",
      ticker: "AAPL",
      date: "Mar 12, 2025",
      prediction: "+2.4%",
      accuracy: "84%",
    },
    {
      id: "2",
      ticker: "NVDA",
      date: "Mar 10, 2025",
      prediction: "+5.1%",
      accuracy: "79%",
    },
    {
      id: "3",
      ticker: "MSFT",
      date: "Mar 8, 2025",
      prediction: "-0.8%",
      accuracy: "82%",
    },
    {
      id: "4",
      ticker: "META",
      date: "Mar 5, 2025",
      prediction: "+3.2%",
      accuracy: "76%",
    },
  ]);

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([
    {
      plan: "Free",
      price: "$0/month",
      features: [
        "3 analyses per day",
        "Basic prediction models",
        "24-hour data updates",
      ],
      current: true,
    },
    {
      plan: "Trader",
      price: "$29/month",
      features: [
        "25 analyses per day",
        "Advanced LSTM models",
        "Real-time data updates",
        "Portfolio tracking",
        "Email alerts",
      ],
      current: false,
    },
    {
      plan: "Professional",
      price: "$99/month",
      features: [
        "Unlimited analyses",
        "All prediction models",
        "Real-time data + sentiment",
        "API access",
        "Custom alerts",
        "Technical indicators",
        "Priority support",
      ],
      current: false,
    },
  ]);

  const [userProfile, setUserProfile] = useState({
    name: "Alex Johnson",
    email: "alex@example.com",
    phone: "+1 (555) 123-4567",
    joined: "January 2025",
    avatar: "/api/placeholder/100/100",
  });

  const [preferences, setPreferences] = useState({
    emailAlerts: true,
    pushNotifications: true,
    smsAlerts: false,
    twoFactorAuth: true,
    darkMode: true,
    autoRefresh: true,
    defaultTimeframe: "3m",
    predictionHorizon: "7d",
  });

  const [showAuthModal, setShowAuthModal] = useState(false);
    const [isLogin, setIsLogin] = useState(true);

  // Authentication Modal
    const AuthModal = () => (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
      >
        <div className="bg-[#111827] rounded-xl p-8 w-full max-w-md relative">
          <button
            onClick={() => setShowAuthModal(false)}
            className="absolute right-4 top-4 text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-bold mb-6">
            {isLogin ? "Login" : "Sign Up"}
          </h2>
          <form className="space-y-4">
            {!isLogin && (
              <input
                type="text"
                placeholder="Full Name"
                className="w-full p-3 rounded-lg bg-black/20 border border-gray-700 focus:border-emerald-500 outline-none"
              />
            )}
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 rounded-lg bg-black/20 border border-gray-700 focus:border-emerald-500 outline-none"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 rounded-lg bg-black/20 border border-gray-700 focus:border-emerald-500 outline-none"
            />
            <button className="w-full py-3 bg-emerald-500 rounded-lg font-medium hover:bg-emerald-600 transition-colors">
              {isLogin ? "Login" : "Create Account"}
            </button>
          </form>
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="mt-4 text-sm text-gray-400 hover:text-white"
          >
            {isLogin
              ? "Need an account? Sign up"
              : "Already have an account? Login"}
          </button>
        </div>
      </motion.div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#111827] text-white">
      {/* Header */}
      <AnimatePresence>{showAuthModal && <AuthModal />}</AnimatePresence>

      <div className="flex-1">
        <header className="border-b border-gray-800 bg-black/20 backdrop-blur-sm">
          <div className="w-full px-6 py-4 flex items-center">
            <div className="flex items-center">
              <Link to="/" className="mr-10">
                <img src={logo} alt="Logo" className="h-16 w-auto" />
              </Link>
              <nav className="hidden md:flex gap-6">
                <Link
                  to="/analysis"
                  className="text-white hover:text-emerald-500 transition-colors"
                >
                  Analysis
                </Link>
                <Link
                  to="/portfolio"
                  className="text-white hover:text-emerald-500 transition-colors"
                >
                  Portfolio
                </Link>
                <Link
                  to="/watchlist"
                  className="text-white hover:text-emerald-500 transition-colors"
                >
                  Watchlist
                </Link>
                <Link
                  to="/trade"
                  className="text-white hover:text-emerald-500 transition-colors"
                >
                  Trade
                </Link>
                <Link
                  to="/settings"
                  className="text-white hover:text-emerald-500 transition-colors"
                >
                  Settings
                </Link>
              </nav>
            </div>
            <div className="flex-grow"></div>
            <div className="flex items-center gap-4">
              <button
                className="h-10 px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                onClick={() => setShowAuthModal(true)}
              >
                Get Started
              </button>
              <SearchOverlay />
            </div>
          </div>
        </header>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />
          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="bg-white/5 rounded-xl p-6">
              {/* Profile */}
              {activeTab === "profile" && (
                <Profile 
                  activeTab={activeTab}
                  userProfile={userProfile}
                  setUserProfile={setUserProfile}
                />
              )}
              {/* Subscriptions */}
              {activeTab === "subscriptions" && (
                <Subscriptions
                  activeTab={activeTab}
                  subscription={subscriptions}
                  setSubscription={setSubscriptions}
                />
              )}

              {/* Notifications */}
              {activeTab === "notifications" && (
                <Notifications
                  activeTab={activeTab}
                  notifications={notifications}
                  setNotifications={setNotifications}
                />
              )}
              {/* Analysis History */}
              {activeTab === "history" && (
                <History
                  activeTab={activeTab}
                  analysisHistory={analysisHistory}
                />
              )}

              {/* Watchlist */}
              {activeTab === "watchlist" && (
                <Watchlist
                  activeTab={activeTab}
                  savedTickers={savedTickers}
                  setSavedTickers={setSavedTickers}
                />
              )}
              {/* Preferences */}
              {activeTab === "preferences" && (
                <Preferences
                  activeTab={activeTab}
                  preferences={preferences}
                  setPreferences={setPreferences}
                />
              )
              }
              {/* Security */}
              {activeTab === "security" && (
                <Security
                  activeTab={activeTab}
                  preferences={preferences}
                  setPreferences={setPreferences}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
