import { useState, useEffect } from "react";
import {
  Search,
  TrendingUp,
  Brain,
  LineChart,
  ArrowRight,
  ChevronDown,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import analysis from "./analysis";
import logo from "../logo.jpg"

interface Stock {
  symbol: string;
  name: string;
  change: string;
  price: string;
}

interface Step {
  title: string;
  description: string;
  icon: JSX.Element;
}

interface FAQ {
  question: string;
  answer: string;
}

interface Stat {
  value: string;
  label: string;
}

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  const handleAnalysis = async (ticker: string) => {
    if (ticker) {
      try {
        // Navigate to analysis page first
        window.location.href = `/analysis?ticker=${ticker}`;

        // Send request to run LSTM analysis
        const response = await fetch("http://localhost:5001/run-lstm", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ticker }),
        });

        const data = await response.json();
        if (!data.success) {
          console.error("LSTM analysis failed:", data.error);
        }
      } catch (error) {
        console.error("Error during LSTM analysis:", error);
      }
    } else {
      console.error("Ticker is empty");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery) {
      console.log("Submitting search for:", searchQuery);
      handleAnalysis(searchQuery);
    }
  };

  const trendingStocks: Stock[] = [
    { symbol: "NVDA", name: "NVIDIA", change: "+3.43%", price: "$149.43" },
    { symbol: "AAPL", name: "Apple", change: "+1.21%", price: "$182.63" },
    { symbol: "MSFT", name: "Microsoft", change: "+2.15%", price: "$397.58" },
    { symbol: "META", name: "Meta", change: "+4.12%", price: "$394.14" },
  ];

  const steps: Step[] = [
    {
      title: "Input Your Criteria",
      description: "Select stocks, timeframes, and analysis parameters",
      icon: <Search className="w-8 h-8" />,
    },
    {
      title: "AI Analysis",
      description: "Our models process market data and indicators in real-time",
      icon: <Brain className="w-8 h-8" />,
    },
    {
      title: "Get Insights",
      description: "Receive actionable predictions and confidence scores",
      icon: <LineChart className="w-8 h-8" />,
    },
  ];

  const stats: Stat[] = [
    { value: "$2.8T", label: "Assets Analyzed" },
    { value: "99.9%", label: "Uptime" },
    { value: "0.2s", label: "Average Response" },
  ];

  const features = [
    { icon: <Brain className="w-8 h-8" />, title: "AI Analysis" },
    { icon: <LineChart className="w-8 h-8" />, title: "Real-time Data" },
    { icon: <TrendingUp className="w-8 h-8" />, title: "Predictive Models" },
  ];

  const faqs: FAQ[] = [
    {
      question: "How accurate are the AI predictions?",
      answer:
        "Our AI model achieves 70-85% accuracy for short-term predictions, continuously improving through machine learning.",
    },
    {
      question: "What data sources do you use?",
      answer:
        "We aggregate data from market feeds, financial statements, news articles, and macroeconomic indicators.",
    },
    {
      question: "How often is the analysis updated?",
      answer:
        "Analysis updates in real-time during market hours, with daily reports after market close.",
    },
  ];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Ticker value:", searchQuery);
    handleAnalysis(searchQuery);
  };

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
      <AnimatePresence>{showAuthModal && <AuthModal />}</AnimatePresence>

      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-colors duration-300 ${
          scrolled
            ? "bg-black/20 backdrop-blur-sm border-b border-white/10"
            : ""
        }`}
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <img src={logo} alt="Logo" className="h-20 w-26 w-auto" />  
          <button
            onClick={() => setShowAuthModal(true)}
            className="px-4 py-2 bg-emerald-500 rounded-lg font-medium hover:bg-emerald-600 transition-colors"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center border-b border-gray-800 pt-20">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container mx-auto px-4 z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-blue-500">
              Market Intelligence,
              <br />
              Reimagined
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto">
              Advanced AI-powered analysis delivering institutional-grade market
              insights
            </p>

            <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-12">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter stock symbol (e.g., AAPL)"
                  className="w-full px-6 py-4 rounded-lg bg-black/20 border border-gray-700 focus:border-emerald-500 outline-none pl-12"
                />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-emerald-500 rounded-lg font-medium hover:bg-emerald-600 transition-colors"
                >
                  Analyze
                </button>
              </div>
            </form>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="px-8 py-4 bg-emerald-500 rounded-lg font-medium hover:bg-emerald-600 transition-colors">
                Start Free Trial
              </button>
              <button className="px-8 py-4 border border-gray-700 rounded-lg font-medium hover:bg-white/5 transition-colors">
                Watch Demo
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="p-6 rounded-xl bg-white/5"
              >
                <div className="text-4xl font-bold text-emerald-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="p-6 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group cursor-pointer"
              >
                <div className="text-emerald-400 mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 border-y border-gray-800">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-3xl font-bold text-center mb-16"
          >
            How It Works
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-12">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6 text-emerald-400">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-emerald-500/50 to-transparent" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Stocks Section */}
      <section className="py-20 border-b border-gray-800">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="flex items-center justify-center gap-3 mb-12"
          >
            <TrendingUp className="w-6 h-6 text-emerald-400" />
            <h2 className="text-3xl font-bold">Trending Now</h2>
          </motion.div>
          <div className="grid md:grid-cols-4 gap-6">
            {trendingStocks.map((stock, i) => (
              <motion.div
                key={stock.symbol}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-xl bg-white/5 hover:bg-white/10 transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold">{stock.symbol}</h3>
                    <p className="text-sm text-gray-400">{stock.name}</p>
                  </div>
                  <span className="text-emerald-400">{stock.change}</span>
                </div>
                <p className="text-2xl font-bold">{stock.price}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-3xl">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-3xl font-bold text-center mb-12"
          >
            Frequently Asked Questions
          </motion.h2>
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-lg bg-white/5"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                  className="w-full p-6 text-left flex justify-between items-center"
                >
                  <span className="font-medium">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 transition-transform ${
                      activeFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {activeFaq === i && (
                  <div className="px-6 pb-6 text-gray-400">{faq.answer}</div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
