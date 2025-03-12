import React, { useState, useEffect, useRef } from "react";
import {
  Search,
  Brain,
  TrendingUp,
  LineChart,
  ArrowUpRight,
  ArrowDownRight,
  MessageSquare,
  Activity,
  DollarSign,
  Bell,
  Share2,
  Download,
  Newspaper,
  TrendingDown,
  AlertTriangle,
  ExternalLink,
  BarChart as BarChartIcon,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  AreaChart,
  Area,
  ComposedChart,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "./card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useNavigate } from "react-router-dom";
import logo from "./logo.jpg";
import { Link } from "react-router-dom";
import { Input } from "./input";
import { Button } from "./button";

// SearchOverlay Component
const SearchOverlay = () => {
  const [isOpen, setIsOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Extracted event listeners into reusable functions
useEffect(() => {
  const handleKeyDown = (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k" && !isInputFocused) {
      e.preventDefault();
      setIsOpen(true);
    } else if (e.key === "Escape" && isOpen) {
      setIsOpen(false);
    }
  };

  document.addEventListener("keydown", handleKeyDown);
  return () => document.removeEventListener("keydown", handleKeyDown);
}, [isOpen]);

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

interface Message {
  id: number;
  text: string;
  isBot: boolean;
}

const Chatbot = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I can help you analyze this stock. What would you like to know?",
      isBot: true,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle escape key for fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen]);

  // Handle body scroll lock
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isFullscreen]);

  // Handle sending a message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputRef.current || isLoading) return;

    const messageText = inputRef.current.value.trim();
    if (!messageText) return;

    // Add user message
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: Date.now(),
        text: messageText,
        isBot: false,
      },
    ]);

    // Clear input field
    inputRef.current.value = "";

    // Add thinking message
    const thinkingId = Date.now() + 1;
    setMessages((prevMessages) => [
      ...prevMessages,
      {
        id: thinkingId,
        text: "Thinking...",
        isBot: true,
      },
    ]);

    // Send to API
    sendToAPI(messageText, thinkingId);
  };

  // Send message to API
  const sendToAPI = async (message: string, thinkingId: number) => {
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5001/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          symbol: "AAPL",
          userId: "user123",
        }),
      });

      const data = await response.json();

      // Remove thinking message
      setMessages((prev) => prev.filter((msg) => msg.id !== thinkingId));

      if (data.success) {
        // Add bot response
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            text: formatResponse(data.response),
            isBot: true,
          },
        ]);
      } else {
        // Add error message
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now(),
            text: `Sorry, I couldn't process your request. ${data.error || ""}`,
            isBot: true,
          },
        ]);
      }
    } catch (error) {
      // Handle error
      setMessages((prev) =>
        prev
          .filter((msg) => msg.id !== thinkingId)
          .concat({
            id: Date.now(),
            text: "Sorry, I encountered an error processing your request. Please try again.",
            isBot: true,
          })
      );
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);

      // Re-focus the input field
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  // Format response text
  const formatResponse = (response: string) => {
    // Format currency
    response = response.replace(/\$(\d+(\.\d+)?)/g, (match, price) =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(parseFloat(price))
    );

const [showMA, setShowMA] = useState({
  ma20: true,
  ma50: true,
  ma200: false,
});

<LineChart>
  {showMA.ma20 && <Line type="monotone" dataKey="ma20" stroke="#60A5FA" />}
  {showMA.ma50 && <Line type="monotone" dataKey="ma50" stroke="#F59E0B" />}
</LineChart>
    // Format market cap
    response = response.replace(/Market Cap: (\d+)/g, (match, cap) => {
      const value = parseInt(cap);
      if (value >= 1e12) return `Market Cap: ${(value / 1e12).toFixed(2)}T`;
      if (value >= 1e9) return `Market Cap: ${(value / 1e9).toFixed(2)}B`;
      if (value >= 1e6) return `Market Cap: ${(value / 1e6).toFixed(2)}M`;
      return `Market Cap: ${value.toLocaleString()}`;
    });

    // Format volume
    response = response.replace(/Volume: (\d+)/g, (match, vol) => {
      const value = parseInt(vol);
      if (value >= 1e12) return `Volume: ${(value / 1e12).toFixed(2)}T`;
      if (value >= 1e9) return `Volume: ${(value / 1e9).toFixed(2)}B`;
      if (value >= 1e6) return `Volume: ${(value / 1e6).toFixed(2)}M`;
      return `Volume: ${value.toLocaleString()}`;
    });

    // Format percentages
    response = response.replace(/([-+]?\d+(\.\d+)?%)/g, (match) => {
      const value = parseFloat(match);
      return `${value.toFixed(2)}%`;
    });

    return response;
  };

  // Chat component (shared between preview and fullscreen)
  const ChatUI = ({ isPreview = false }) => {
    // Focus the input field on mount
    useEffect(() => {
      if (!isPreview && inputRef.current) {
        inputRef.current.focus();
      }
    }, [isPreview, isFullscreen]);

    return (
      <div className={`flex flex-col ${isPreview ? "h-full" : "h-[600px]"}`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h3 className="text-xl font-bold">Aurora</h3>
          {isPreview ? (
            <button
              type="button"
              onClick={() => setIsFullscreen(true)}
              className="p-2 hover:bg-gray-700 rounded-full transition-colors"
            >
              <MessageSquare className="w-5 h-5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsFullscreen(false)}
              className="p-2 hover:bg-gray-700 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Messages */}
        <div
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
        >
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`p-3 rounded-lg ${
                msg.isBot ? "bg-gray-800" : "bg-emerald-500/20"
              } ${msg.text === "Thinking..." ? "animate-pulse" : ""}`}
            >
              {msg.text}
            </div>
          ))}
        </div>

        {/* Input form */}
        <form
          onSubmit={handleSendMessage}
          className="p-4 border-t border-gray-800"
        >
          <div className="flex gap-2">
            <input
              type="text"
              ref={inputRef}
              className="flex-1 bg-black/20 rounded-lg px-4 py-2 border border-gray-700 focus:border-emerald-500 outline-none"
              placeholder="Ask about this stock..."
              disabled={isLoading}
              autoComplete="off"
            />
            <button
              type="submit"
              disabled={isLoading}
              className={`px-4 py-2 bg-emerald-500 rounded-lg hover:bg-emerald-600 transition-colors ${
                isLoading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              Send
            </button>
          </div>
        </form>
      </div>
    );
  };

  // Main component render
  return (
    <>
      {/* Sidebar preview */}
      <div className="w-[350px] border-l border-gray-800 bg-black/20 h-full">
        <ChatUI isPreview={true} />
      </div>

      {/* Fullscreen modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ duration: 0.15 }}
              className="bg-[#111827] rounded-xl w-full max-w-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <ChatUI isPreview={false} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const AnalysisDashboard = () => {
  const [sentimentData, setSentimentData] = useState([
    {
      period: "Current",
      positive: 0,
      negative: 0,
      neutral: 0,
      totalMentions: 0,
      averageSentiment: 0,
    },
    {
      period: "Last Week",
      positive: 0,
      negative: 0,
      neutral: 0,
      totalMentions: 0,
      averageSentiment: 0,
    },
    {
      period: "Last Month",
      positive: 0,
      negative: 0,
      neutral: 0,
      totalMentions: 0,
      averageSentiment: 0,
    },
  ]);

  const newsData = [
    {
      title: "Apple's AI Strategy Revealed",
      source: "Tech Analysis Daily",
      sentiment: "positive",
      time: "2h ago",
      summary:
        "Apple plans to integrate AI features across its product line...",
      impact: "High",
      url: "https://example.com/apple-ai-strategy",
    },
    {
      title: "Tech Giant's Q4 Earnings Exceed Expectations",
      source: "Financial Times",
      sentiment: "positive",
      time: "1d ago",
      summary:
        "Strong performance in services and wearables segment drives growth...",
      impact: "Medium",
      url: "https://example.com/earnings-report",
    },
    {
      title: "Supply Chain Challenges Ahead",
      source: "Wall Street Journal",
      sentiment: "negative",
      time: "3d ago",
      summary: "Potential component shortages may impact Q1 production...",
      impact: "Low",
      url: "https://example.com/supply-chain-issues",
    },
  ];

  const [technicalIndicators, setTechnicalIndicators] = useState({
    rsi: 0,
    macd: 0,
    bollinger: {
      upper: 0,
      middle: 0,
      lower: 0,
    },
  });

  const [fundamentalData, setFundamentalData] = useState({
    peRatio: 0,
    pbRatio: 0,
    debtEquity: 0,
    quickRatio: 0,
    currentRatio: 0,
    returnOnEquity: 0,
    returnOnAssets: 0,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [timeframe, setTimeframe] = useState("1M");
  const [activeTab, setActiveTab] = useState("prediction");
  const [isAlertSet, setIsAlertSet] = useState(false);
  const [selectedTab, setSelectedTab] = useState("overview");
  const [stockPrice, setStockPrice] = useState<number | null>(null);
  const [error, setError] = useState(null);
  const [isLoadingGraph, setIsLoadingGraph] = useState(true);
  const [priceHistoryImage, setPriceHistoryImage] = useState<string | null>(
    null
  );
  const [predictionImage, setPredictionImage] = useState<string | null>(null);
  const [ticker, setTicker] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get("ticker") || "AAPL";
  });
  const [stockName, setStockName] = useState("");
  const [priceChange, setPriceChange] = useState<string>("+0.00%");
  const [isLoading, setIsLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const Redirect_Search = () => {
    // This will navigate to second component
    navigate("/analysis");
  };
  const priceAlertThresholds = {
    upper: 190,
    lower: 175,
  };

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

  useEffect(() => {
    const fetchStockInfo = async () => {
      try {
        const stock = await fetch(`http://localhost:5001/stock-price`);
        const data = await stock.json();

        if (data.success) {
          setStockPrice(data.stock_price);
          // Get company name using yfinance
          const info = await fetch(
            `http://localhost:5001/stock-info?ticker=${ticker}`
          );
          const infoData = await info.json();
          if (infoData.success) {
            setStockName(infoData.company_name);
            setPriceChange(infoData.price_change);
          }
        }
      } catch (error) {
        console.error("Error fetching stock info:", error);
      } finally {
        setIsLoadingGraph(false);
        setIsLoading(false);
      }
    };

    fetchStockInfo();
  }, [ticker]);

  useEffect(() => {
    const fetchPriceHistory = async () => {
      setIsLoadingGraph(true);
      try {
        console.log(`Starting analysis for ticker: ${ticker}`);

        // First ensure the analysis is complete
        const analysisResponse = await fetch("http://localhost:5001/run-lstm", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ticker: ticker,
          }),
        });

        const analysisData = await analysisResponse.json();
        console.log("Analysis response:", analysisData);

        if (!analysisData.success) {
          throw new Error(analysisData.error || "Analysis failed");
        }

        // Add delay to ensure plots are generated
        console.log("Waiting for plots generation...");
        await new Promise((resolve) => setTimeout(resolve, 5000));

        // Fetch both price history and prediction plots
        const [historyResponse, predictionResponse] = await Promise.all([
          fetch(`http://localhost:5001/get-price-history?ticker=${ticker}`),
          fetch(`http://localhost:5001/get-prediction?ticker=${ticker}`),
        ]);
        const historyData = await historyResponse.json();
        const predictionData = await predictionResponse.json();

        console.log("History response:", historyData);
        console.log("Prediction response:", predictionData);

        if (!historyData.success || !predictionData.success) {
          throw new Error("Failed to load one or both plots");
        }

        setPriceHistoryImage(historyData.image);
        setPredictionImage(predictionData.image);
        setStockPrice(predictionData.current_price);
      } catch (error) {
        console.error("Error in fetchPriceHistory:", error);
        setError(error.message);
      } finally {
        setIsLoadingGraph(false);
      }
    };

    fetchPriceHistory();
  }, [ticker]);

  useEffect(() => {
    const fetchTechnicalFundamental = async () => {
      try {
        setIsLoading(true);
        // Pass the ticker as a query parameter
        const response = await fetch(
          `http://localhost:5001/get-technical-fundamental?ticker=${ticker}`
        );
        const data = await response.json();

        if (data.success) {
          console.log("Technical data received:", data.technical);
          console.log("Fundamental data received:", data.fundamental);
          setTechnicalIndicators(data.technical);
          setFundamentalData(data.fundamental);
        } else {
          console.error("API returned error:", data.error || "Unknown error");
        }
      } catch (error) {
        console.error("Error fetching technical/fundamental data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (ticker) {
      fetchTechnicalFundamental();
    }
  }, [ticker]);

  useEffect(() => {
    const fetchSentimentData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `http://localhost:5001/get-sentiment?ticker=${ticker}`
        );
        const data = await response.json();

        if (data.success) {
          console.log("Sentiment data received:", data);

          // Format the data for our chart
          const formattedData = [data.current, ...data.historical];

          setSentimentData(formattedData);
        } else {
          console.error("API returned error:", data.error || "Unknown error");
        }
      } catch (error) {
        console.error("Error fetching sentiment data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (ticker) {
      fetchSentimentData();
    }
  }, [ticker]);

  const mockData = Array.from({ length: 30 }, (_, i) => ({
    date: `2024-${String(i + 1).padStart(2, "0")}-01`,
    price: Math.random() * 50 + 150,
    volume: Math.floor(Math.random() * 1000000),
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#111827] text-white flex">
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

        <main className="container mx-auto px-6 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-4 mb-2">
                  <h1 className="text-3xl font-bold">{ticker}</h1>
                  <span className="text-gray-400">{stockName}</span>
                  <div className="flex gap-2">
                    <button className="p-2 rounded-full bg-white/5 hover:bg-white/10">
                      <Bell className="w-5 h-5" />
                    </button>
                    <button className="p-2 rounded-full bg-white/5 hover:bg-white/10">
                      <Share2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold">
                    ${stockPrice?.toFixed(2) || "0.00"}
                  </span>
                  <span className="flex items-center text-emerald-400">
                    {priceChange}
                  </span>
                </div>
              </div>
              <button className="px-4 py-2 bg-emerald-500 rounded-lg hover:bg-emerald-600 flex items-center gap-2">
                <Download className="w-4 h-4" /> Export Data
              </button>
            </div>

            <div className="flex mt-8 h-[400px] bg-white/5 rounded-xl">
              <div className="flex-1 p-6">
                <Tabs defaultValue="history" className="h-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="history">Price History</TabsTrigger>
                    <TabsTrigger value="prediction">Prediction</TabsTrigger>
                  </TabsList>
                  <TabsContent value="history" className="h-full">
                    {priceHistoryImage ? (
                      <img
                        src={`data:image/png;base64,${priceHistoryImage}`}
                        alt="Price History"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                      </div>
                    )}
                  </TabsContent>
                  <TabsContent value="prediction" className="h-full">
                    {predictionImage ? (
                      <img
                        src={`data:image/png;base64,${predictionImage}`}
                        alt="Price Prediction"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </div>
              <Chatbot />
            </div>
          </motion.div>

          <Tabs defaultValue="prediction" className="space-y-8">
            <TabsList className="grid grid-cols-5 gap-2 bg-transparent">
              {[
                {
                  value: "prediction",
                  icon: <Brain className="w-4 h-4" />,
                  label: "AI Prediction",
                },
                {
                  value: "technical",
                  icon: <LineChart className="w-4 h-4" />,
                  label: "Technical",
                },
                {
                  value: "fundamental",
                  icon: <DollarSign className="w-4 h-4" />,
                  label: "Fundamental",
                },
                {
                  value: "sentiment",
                  icon: <MessageSquare className="w-4 h-4" />,
                  label: "Sentiment",
                },
                {
                  value: "News",
                  icon: <Activity className="w-4 h-4" />,
                  label: "News",
                },
              ].map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="flex items-center gap-2 p-4 bg-white/5 hover:bg-white/10 data-[state=active]:bg-emerald-500"
                >
                  {tab.icon}
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="prediction">
              <div className="grid grid-cols-3 gap-4">
                {[
                  {
                    title: "Price Target",
                    value: "$195.50",
                    subtext: "+7.2% Upside",
                  },
                  {
                    title: "Confidence",
                    value: "85%",
                    subtext: "High Confidence",
                  },
                  {
                    title: "Risk Level",
                    value: "Medium",
                    subtext: "Moderate Volatility",
                  },
                ].map((metric, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card className="bg-white/5 border-gray-800">
                      <CardHeader>
                        <CardTitle className="text-gray-400">
                          {metric.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-emerald-400">
                          {metric.value}
                        </div>
                        <div className="text-sm text-gray-400">
                          {metric.subtext}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="technical">
              <div className="grid grid-cols-2 gap-6">
                <Card className="bg-white/5 border-gray-800">
                  <CardHeader>
                    <CardTitle>Technical Indicators</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>RSI (14)</span>
                        <span
                          className={`font-bold ${
                            technicalIndicators.rsi > 70
                              ? "text-red-500"
                              : technicalIndicators.rsi < 30
                              ? "text-green-500"
                              : "text-gray-400"
                          }`}
                        >
                          {technicalIndicators.rsi}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>MACD</span>
                        <span
                          className={`font-bold ${
                            technicalIndicators.macd > 0
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {technicalIndicators.macd}
                        </span>
                      </div>
                      <div>
                        <span className="block mb-2">Bollinger Bands</span>
                        <div className="space-y-2 pl-4">
                          <div className="flex justify-between">
                            <span className="text-sm">Upper</span>
                            <span className="font-bold">
                              ${technicalIndicators.bollinger.upper}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Middle</span>
                            <span className="font-bold">
                              ${technicalIndicators.bollinger.middle}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Lower</span>
                            <span className="font-bold">
                              ${technicalIndicators.bollinger.lower}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-gray-800">
                  <CardHeader>
                    <CardTitle>Volume Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer>
                      <BarChart data={mockData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="date" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip
                          contentStyle={{
                            background: "#1F2937",
                            border: "none",
                          }}
                        />
                        <Bar dataKey="volume" fill="#10B981" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="fundamental">
              <div className="grid grid-cols-3 gap-6">
                <Card className="bg-white/5 border-gray-800">
                  <CardHeader>
                    <CardTitle>Valuation Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>P/E Ratio</span>
                        <span className="font-bold">
                          {fundamentalData.peRatio}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>P/B Ratio</span>
                        <span className="font-bold">
                          {fundamentalData.pbRatio}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-gray-800">
                  <CardHeader>
                    <CardTitle>Liquidity Ratios</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>Quick Ratio</span>
                        <span className="font-bold">
                          {fundamentalData.quickRatio}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Current Ratio</span>
                        <span className="font-bold">
                          {fundamentalData.currentRatio}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-gray-800">
                  <CardHeader>
                    <CardTitle>Profitability</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span>ROE</span>
                        <span className="font-bold">
                          {(fundamentalData.returnOnEquity * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>ROA</span>
                        <span className="font-bold">
                          {(fundamentalData.returnOnAssets * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="sentiment">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-white/5 border-gray-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChartIcon className="w-5 h-5" /> Sentiment
                      Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer>
                      <ComposedChart data={sentimentData}>
                        <XAxis dataKey="period" stroke="#9CA3AF" />
                        <YAxis stroke="#9CA3AF" />
                        <Tooltip
                          contentStyle={{
                            background: "#1F2937",
                            border: "none",
                            color: "white",
                          }}
                        />
                        <Bar
                          dataKey="positive"
                          fill="#10B981"
                          stackId="sentiment"
                        />
                        <Bar
                          dataKey="neutral"
                          fill="#6B7280"
                          stackId="sentiment"
                        />
                        <Bar
                          dataKey="negative"
                          fill="#EF4444"
                          stackId="sentiment"
                        />
                        <Line
                          type="monotone"
                          dataKey="averageSentiment"
                          stroke="#FBBF24"
                          strokeWidth={2}
                        />
                      </ComposedChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="bg-white/5 border-gray-800">
                  <CardHeader>
                    <CardTitle>Sentiment Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {sentimentData.map((data, index) => (
                        <div key={index} className="bg-white/10 p-4 rounded-lg">
                          <div className="flex justify-between mb-2">
                            <span className="font-medium">{data.period}</span>
                            <span className="text-emerald-400">
                              {(data.averageSentiment * 100).toFixed(1)}%
                              Positive
                            </span>
                          </div>
                          <div className="flex space-x-4">
                            <div className="flex-1">
                              <div className="flex justify-between text-sm mb-1">
                                <span>Positive</span>
                                <span className="text-green-500">
                                  {data.positive}%
                                </span>
                              </div>
                              <div className="h-2 bg-green-500/30 rounded-full">
                                <div
                                  className="h-full bg-green-500 rounded-full"
                                  style={{ width: `${data.positive}%` }}
                                />
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between text-sm mb-1">
                                <span>Negative</span>
                                <span className="text-red-500">
                                  {data.negative}%
                                </span>
                              </div>
                              <div className="h-2 bg-red-500/30 rounded-full">
                                <div
                                  className="h-full bg-red-500 rounded-full"
                                  style={{ width: `${data.negative}%` }}
                                />
                              </div>
                            </div>
                          </div>
                          <div className="mt-2 text-sm text-gray-400">
                            Total Mentions: {data.totalMentions}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="News">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                  {newsData.map((news, i) => (
                    <Card
                      key={i}
                      className={`bg-white/5 border-gray-800 hover:bg-white/10 transition-colors ${
                        news.sentiment === "positive"
                          ? "border-l-4 border-green-500"
                          : news.sentiment === "negative"
                          ? "border-l-4 border-red-500"
                          : "border-l-4 border-gray-500"
                      }`}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="flex-1">
                            <h4 className="font-medium text-lg mb-1 flex justify-between items-start">
                              {news.title}
                              <a
                                href={news.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-emerald-400 hover:text-emerald-300"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            </h4>
                            <p className="text-gray-400 mb-2">{news.summary}</p>
                            <div className="flex items-center justify-between text-sm text-gray-500">
                              <div className="flex items-center gap-2">
                                <span>{news.source}</span>
                                <span>•</span>
                                <span>{news.time}</span>
                              </div>
                              <div
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  news.impact === "High"
                                    ? "bg-red-500/20 text-red-400"
                                    : news.impact === "Medium"
                                    ? "bg-yellow-500/20 text-yellow-400"
                                    : "bg-green-500/20 text-green-400"
                                }`}
                              >
                                {news.impact} Impact
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card className="bg-white/5 border-gray-800">
                  <CardHeader>
                    <CardTitle>News Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Total News Items</span>
                        <span className="font-bold">{newsData.length}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Positive News</span>
                        <span className="text-green-500 font-bold">
                          {
                            newsData.filter((n) => n.sentiment === "positive")
                              .length
                          }
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Negative News</span>
                        <span className="text-red-500 font-bold">
                          {
                            newsData.filter((n) => n.sentiment === "negative")
                              .length
                          }
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>High Impact News</span>
                        <span className="text-red-400 font-bold">
                          {newsData.filter((n) => n.impact === "High").length}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default AnalysisDashboard;
