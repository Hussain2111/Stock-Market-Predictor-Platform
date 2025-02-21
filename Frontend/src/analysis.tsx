import { useState} from 'react';
import { Button } from './button'; // Adjust the import path as necessary
import { Search, Brain, LineChart, ArrowUpRight, 
         MessageSquare, Activity, DollarSign, Bell, Share2, Download,
        ExternalLink, BarChart as BarChartIcon, X, 
         } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
         BarChart, Bar, ComposedChart } from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from './card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import logo from './logo.jpg';
import {Link} from 'react-router-dom';
import { Input } from './input'; // Adjust the import path as necessary

const SearchOverlay = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Check for Windows/Command + K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault(); // Prevent default browser behavior
        setIsOpen(true);
      }
      // Handle Escape key to close
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    // Add event listener
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Prevent body scroll when overlay is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const toggleSearch = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your search logic here
  };

  return (
    <div>
      {/* Search Icon Button */}
      <button
        onClick={toggleSearch}
        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        aria-label="Open search"
      >
        <Search className="w-6 h-6" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div className="absolute inset-0 z-50 min-h-screen overflow-y-auto">
          {/* Blur Background */}
          <div 
            className="absolute inset-0 bg-black/30 backdrop-blur-xl backdrop-saturate-200"
          />

          {/* Search Content */}
          <div className="relative min-h-screen flex flex-col opacity-90 rounded-full border-emerald-200 items-center">
            {/* Search Container */}
            <div className="w-full max-w-2xl rounded-full border-emerald-200 mx-auto px-4 pt-32">
              {/* Search Form */}
              <div className="bg-white rounded-full border-emerald-200 shadow-lg mb-4">
                <form onSubmit={handleSubmit} className="relative">
                  <input
                    type="text"
                    placeholder="Search... (⌘K)"
                    className="w-full px-4 py-4 pr-12 text-lg border-emerald-200 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-700"
                    autoFocus
                  />
                  {/* Close Button */}
                  <button
                    type="button"
                    onClick={toggleSearch}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full transition-colors"
                    aria-label="Close search"
                  >
                    <X className="w-6 h-6" />
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
const Chatbot = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I can help you analyze this stock. What would you like to know?' }
  ]);
  const [input, setInput] = useState('');

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsFullscreen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Prevent body scroll when fullscreen
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isFullscreen]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setMessages(prev => [...prev, 
      { role: 'user', content: input },
      { role: 'assistant', content: 'This is a simulated response. In a real implementation, this would be connected to an AI backend.' }
    ]);
    setInput('');
  };

  // Preview Chat Component
  const ChatContent = ({ isPreview = false }) => (
    <div className={`flex flex-col ${isPreview ? 'h-full' : 'h-[600px]'}`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <h3 className="text-xl font-bold">Aurora</h3>
        {!isPreview && (
          <button 
            onClick={() => setIsFullscreen(false)}
            className="p-2 hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
        {isPreview && (
          <button
            onClick={() => setIsFullscreen(true)}
            className="p-2 hover:bg-gray-700 rounded-full transition-colors"
          >
            <MessageSquare className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-3 rounded-lg ${
              msg.role === 'assistant' ? 'bg-gray-800' : 'bg-emerald-500/20'
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} className="p-4 border-t border-gray-800">
        <div className="flex gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-black/20 rounded-lg px-4 py-2 border border-gray-700 focus:border-emerald-500 focus:outline-none"
            placeholder="Ask about this stock..."
          />
          <button 
            type="submit" 
            className="px-4 py-2 bg-emerald-500 rounded-lg hover:bg-emerald-600 transition-colors"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <>
      {/* Preview Chat */}
      <div className="w-[350px] border-l border-gray-800 bg-black/20 h-full">
        <ChatContent isPreview={true} />
      </div>

      {/* Fullscreen Overlay */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 overflow-y-auto"
          >
            {/* Blur Background */}
            <div 
              className="fixed inset-0 bg-black/30 backdrop-blur-xl backdrop-saturate-200"
              onClick={() => setIsFullscreen(false)}
            />

            {/* Chat Content */}
            <div className="relative min-h-screen flex items-center justify-center p-4">
              <motion.div 
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="bg-[#111827] rounded-xl w-full max-w-lg shadow-xl"
              >
                <ChatContent />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};


const AnalysisDashboard = () => {

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const sentimentData = [
    { 
      period: 'Last Week', 
      positive: 65, 
      negative: 25, 
      neutral: 10,
      totalMentions: 1250,
      averageSentiment: 0.65
    },
    { 
      period: 'Last Month', 
      positive: 58, 
      negative: 30, 
      neutral: 12,
      totalMentions: 5500,
      averageSentiment: 0.52
    }
  ];

  const newsData = [
    {
      title: "Apple's AI Strategy Revealed",
      source: "Tech Analysis Daily",
      sentiment: "positive",
      time: "2h ago",
      summary: "Apple plans to integrate AI features across its product line...",
      impact: "High",
      url: "https://example.com/apple-ai-strategy"
    },
    {
      title: "Tech Giant's Q4 Earnings Exceed Expectations",
      source: "Financial Times",
      sentiment: "positive",
      time: "1d ago", 
      summary: "Strong performance in services and wearables segment drives growth...",
      impact: "Medium",
      url: "https://example.com/earnings-report"
    },
    {
      title: "Supply Chain Challenges Ahead",
      source: "Wall Street Journal",
      sentiment: "negative",
      time: "3d ago",
      summary: "Potential component shortages may impact Q1 production...",
      impact: "Low",
      url: "https://example.com/supply-chain-issues"
    }
  ];


  const technicalIndicators = {
    rsi: 65.4,
    macd: 2.34,
    bollinger: {
      upper: 185.2,
      middle: 182.63,
      lower: 180.1
    }
  };

  const fundamentalData = {
    peRatio: 28.5,
    pbRatio: 15.2,
    debtEquity: 1.2,
    quickRatio: 1.5,
    currentRatio: 1.8,
    returnOnEquity: 0.35,
    returnOnAssets: 0.22
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
        <h2 className="text-2xl font-bold mb-6">{isLogin ? "Login" : "Sign Up"}</h2>
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
          {isLogin ? "Need an account? Sign up" : "Already have an account? Login"}
        </button>
      </div>
    </motion.div>
  )

  const mockData = Array.from({ length: 30 }, (_, i) => ({
    date: `2024-${String(i + 1).padStart(2, '0')}-01`,
    price: Math.random() * 50 + 150,
    volume: Math.floor(Math.random() * 1000000)
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#111827] text-white flex">
      <AnimatePresence>
        {showAuthModal && <AuthModal />}
      </AnimatePresence>
      <div className="flex-1">
      <header className="border-b border-gray-800 bg-black/20 backdrop-blur-sm">
          <div className="container max-w-6xl mx-4 ml-10 px-6 py-4 flex items-center justify-between gap-6">

            <Link to="/">
              <img src={logo} alt="Logo" className="h-16 w-22 w-auto" /> 
            </Link>     
            <nav className="hidden md:flex gap-6">
              <Link to="/analysis" className="text-white hover:text-emerald-500 transition-colors">Analysis</Link>
              <Link to="/portfolio" className="text-white hover:text-emerald-500 transition-colors">Portfolio</Link>
              <Link to="/watchlist" className="text-white hover:text-emerald-500 transition-colors">Watchlist</Link>
              <Link to="/news" className="text-white hover:text-emerald-500 transition-colors">News</Link>
            </nav>        
            <div className="relative flex-1 max-w-xl mx-4">
              </div>
              <button 
                className="h-10 w-18 px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
                onClick={() => setShowAuthModal(true)}
              >
                Get Started
              </button>
              <SearchOverlay />
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
                <h1 className="text-3xl font-bold">AAPL</h1>
                <span className="text-gray-400">Apple Inc.</span>
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
                <span className="text-2xl font-bold">$182.63</span>
                <span className="flex items-center text-emerald-400">
                  <ArrowUpRight className="w-4 h-4" />
                  +1.21%
                </span>
              </div>
            </div>
            <button className="px-4 py-2 bg-emerald-500 rounded-lg hover:bg-emerald-600 flex items-center gap-2">
              <Download className="w-4 h-4" /> Export Data
            </button>
          </div>

          <div className="flex mt-8 h-[400px] bg-white/5 rounded-xl p-6">
            <ResponsiveContainer>
              <RechartsLineChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip contentStyle={{ background: '#1F2937', border: 'none' }} />
                <Line type="monotone" dataKey="price" stroke="#10B981" strokeWidth={2} dot={false} />
              </RechartsLineChart>
            </ResponsiveContainer>
            <Chatbot />
          </div>
        </motion.div>

        <Tabs defaultValue="prediction" className="space-y-8">
          <TabsList className="grid grid-cols-5 gap-2 bg-transparent">
            {[
              { value: 'prediction', icon: <Brain className="w-4 h-4" />, label: 'AI Prediction' },
              { value: 'technical', icon: <LineChart className="w-4 h-4" />, label: 'Technical' },
              { value: 'fundamental', icon: <DollarSign className="w-4 h-4" />, label: 'Fundamental' },
              { value: 'sentiment', icon: <MessageSquare className="w-4 h-4" />, label: 'Sentiment' },
              { value: 'News', icon: <Activity className="w-4 h-4" />, label: 'News' }
            ].map(tab => (
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
                { title: 'Price Target', value: '$195.50', subtext: '+7.2% Upside' },
                { title: 'Confidence', value: '85%', subtext: 'High Confidence' },
                { title: 'Risk Level', value: 'Medium', subtext: 'Moderate Volatility' }
              ].map((metric, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="bg-white/5 border-gray-800">
                    <CardHeader>
                      <CardTitle className="text-gray-400">{metric.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold text-emerald-400">{metric.value}</div>
                      <div className="text-sm text-gray-400">{metric.subtext}</div>
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
                    <span className={`font-bold ${
                      technicalIndicators.rsi > 70 ? 'text-red-500' : 
                      technicalIndicators.rsi < 30 ? 'text-green-500' : 'text-gray-400'
                    }`}>{technicalIndicators.rsi}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>MACD</span>
                    <span className={`font-bold ${
                      technicalIndicators.macd > 0 ? 'text-green-500' : 'text-red-500'
                    }`}>{technicalIndicators.macd}</span>
                  </div>
                  <div>
                    <span className="block mb-2">Bollinger Bands</span>
                    <div className="space-y-2 pl-4">
                      <div className="flex justify-between">
                        <span className="text-sm">Upper</span>
                        <span className="font-bold">${technicalIndicators.bollinger.upper}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Middle</span>
                        <span className="font-bold">${technicalIndicators.bollinger.middle}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Lower</span>
                        <span className="font-bold">${technicalIndicators.bollinger.lower}</span>
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
                    <Tooltip contentStyle={{ background: '#1F2937', border: 'none' }} />
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
                    <span className="font-bold">{fundamentalData.peRatio}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>P/B Ratio</span>
                    <span className="font-bold">{fundamentalData.pbRatio}</span>
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
                    <span className="font-bold">{fundamentalData.quickRatio}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Current Ratio</span>
                    <span className="font-bold">{fundamentalData.currentRatio}</span>
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
                    <span className="font-bold">{(fundamentalData.returnOnEquity * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>ROA</span>
                    <span className="font-bold">{(fundamentalData.returnOnAssets * 100).toFixed(1)}%</span>
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
                <BarChartIcon className="w-5 h-5" /> Sentiment Distribution
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer>
                <ComposedChart data={sentimentData}>
                  <XAxis dataKey="period" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      background: '#1F2937', 
                      border: 'none', 
                      color: 'white' 
                    }}
                  />
                  <Bar dataKey="positive" fill="#10B981" stackId="sentiment" />
                  <Bar dataKey="neutral" fill="#6B7280" stackId="sentiment" />
                  <Bar dataKey="negative" fill="#EF4444" stackId="sentiment" />
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
                        {(data.averageSentiment * 100).toFixed(1)}% Positive
                      </span>
                    </div>
                    <div className="flex space-x-4">
                      <div className="flex-1">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Positive</span>
                          <span className="text-green-500">{data.positive}%</span>
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
                          <span className="text-red-500">{data.negative}%</span>
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
                className={`bg-white/5 border-gray-800 hover:bg-white/10 transition-colors 
                  ${news.sentiment === 'positive' ? 'border-l-4 border-green-500' : 
                     news.sentiment === 'negative' ? 'border-l-4 border-red-500' : 
                     'border-l-4 border-gray-500'}`}
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
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          news.impact === 'High' ? 'bg-red-500/20 text-red-400' :
                          news.impact === 'Medium' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-green-500/20 text-green-400'
                        }`}>
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
                    {newsData.filter(n => n.sentiment === 'positive').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Negative News</span>
                  <span className="text-red-500 font-bold">
                    {newsData.filter(n => n.sentiment === 'negative').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>High Impact News</span>
                  <span className="text-red-400 font-bold">
                    {newsData.filter(n => n.impact === 'High').length}
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
  
import { useEffect } from 'react';
export default AnalysisDashboard;

