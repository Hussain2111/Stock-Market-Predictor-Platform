import React, { useState } from 'react';
import { Search, Heart, Share2, Bell, Download, ArrowUpRight, ArrowRight, ArrowDownRight, 
         ChevronDown, AlertTriangle, TrendingUp, Activity, DollarSign, 
         Calendar, BarChart2, FileText, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
         BarChart, Bar, Legend } from 'recharts';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { useNavigate } from 'react-router-dom';

// Mock data for the chart
const historicalData = Array.from({ length: 30 }, (_, i) => ({
  date: `2024-${String(i + 1).padStart(2, '0')}-01`,
  price: Math.random() * 50 + 150,
  prediction: Math.random() * 50 + 160,
  volume: Math.floor(Math.random() * 1000000)
}));

// New mock data for sentiment analysis
const sentimentData = Array.from({ length: 7 }, (_, i) => ({
  date: `2024-${String(i + 1).padStart(2, '0')}-01`,
  positive: Math.random() * 100,
  negative: Math.random() * 50,
  neutral: Math.random() * 30
}));

// New mock news data
const newsData = [
  {
    title: "Apple's AI Strategy Revealed",
    source: "Tech Analysis Daily",
    sentiment: "positive",
    time: "2 hours ago"
  },
  {
    title: "Supply Chain Concerns Impact Production",
    source: "Market Watch",
    sentiment: "negative",
    time: "4 hours ago"
  },
  {
    title: "Q4 Earnings Preview",
    source: "Financial Times",
    sentiment: "neutral",
    time: "6 hours ago"
  }
];

const StockSidebar = () => {
  return (
    <aside className="w-1/4 p-4 border-l bg-gray-50">
      {/* Company Logo and Info */}
      <div className="flex items-center mb-4">
        <img
          src="https://via.placeholder.com/50"
          alt="Company Logo"
          className="w-12 h-12 rounded-full"
        />
        <div className="ml-2">
          <h2 className="text-xl font-bold">AAPL / US0378331005</h2>
          <p className="text-sm text-gray-500">Apple Inc.</p>
        </div>
      </div>

      {/* Market Overview */}
      <div className="mb-4">
        <h3 className="font-bold text-lg">Market Overview</h3>
        <ul className="mt-2 text-sm">
          <li>Market Cap: <span className="font-bold">$3350.14B</span></li>
          <li>Short Interest: <span className="font-bold">1.04%</span></li>
          <li>Volume: <span className="font-bold">53,846,082</span></li>
          <li>Dividend %: <span className="font-bold">0.46%</span></li>
        </ul>
      </div>

      {/* Performance Metrics */}
      <div className="mb-4">
        <h3 className="font-bold text-lg">Performance</h3>
        <ul className="mt-2 text-sm">
          <li>Perf Week: <span className="text-red-500">-2.40%</span></li>
          <li>Perf Quarter: <span className="text-red-500">-5.55%</span></li>
          <li>Perf Year: <span className="text-red-500">-14.14%</span></li>
          <li>Perf YTD: <span className="text-red-500">-11.04%</span></li>
        </ul>
      </div>

      {/* Technical Indicators */}
      <div className="mb-4">
        <h3 className="font-bold text-lg">Technical Indicators</h3>
        <ul className="mt-2 text-sm">
          <li>52W Range: <span className="font-bold">164.07 - 260.10</span></li>
          <li>52W High: <span className="text-red-500">-14.35%</span></li>
          <li>52W Low: <span className="text-green-500">35.78%</span></li>
          <li>Avg Volume: <span className="font-bold">47.46M</span></li>
          <li>Beta: <span className="font-bold">1.18</span></li>
          <li>ATR: <span className="font-bold">5.26</span></li>
          <li>Volatility: <span className="font-bold">1.99% / 1.90%</span></li>
        </ul>
      </div>

      {/* Profile Summary */}
      <div>
        <h3 className="font-bold text-lg">Apple Company Profile Summary</h3>
        <p className="mt-2 text-sm text-gray-700">
          Apple Inc. designs and markets tech products like iPhones, Macs, iPads, wearables, and accessories. It offers services via the App Store, AppleCare, and cloud platforms.
        </p>
        <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md">
          Full Company Profile
        </button>
      </div>
    </aside>
  );
};




const AnalysisPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const [isSignupPopupOpen, setIsSignupPopupOpen] = useState(false);
  const [timeframe, setTimeframe] = useState('1M');
  const [stockPrice, setStockPrice] = useState(null);

  // Add useEffect to fetch stock price
  useEffect(() => {
    const fetchStockPrice = async () => {
      console.log('Starting fetch request...');
      try {
        const response = await fetch('http://127.0.0.1:5001/stock-price', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        });
        
        console.log('Response received:', response);
        const data = await response.json();
        console.log('Data parsed:', data);
        
        if (data.success) {
          console.log('Setting stock price to:', data.stock_price);
          setStockPrice(data.stock_price);
        } else {
          console.error('API returned error:', data.error);
        }
      } catch (error) {
        console.error('Fetch failed:', error);
      }
    };

    fetchStockPrice();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-900 text-white p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center flex-1 max-w-xl">
            <Search className="h-5 w-5 text-gray-400 absolute ml-3" />
            <input
              type="text"
              placeholder="Search for another stock..."
              className="w-9/12 pl-10 pr-4 mr-2 py-2 rounded-lg bg-white/10 text-white placeholder-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button onClick={Redirect_Search} className="max-w-50 h-9 bg-blue-500 hover:bg-blue-600 text-white rounded-md flex items-center justify-center gap-2 transition-colors">
                  Search 
                </button>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setIsLoginPopupOpen(true)} 
              className="hover:bg-blue-800 px-4 py-2 rounded-lg">
              Login
            </button>
            <button onClick={() => setIsSignupPopupOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded-lg">
              Sign Up
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-8 px-4 flex gap-8">
        <div className="flex-1">
          {/* Price Alert Banner */}
          {isAlertSet && (
            <Alert className="mb-4 bg-blue-50 border-blue-200">
              <AlertTriangle className="h-4 w-4 text-blue-500" />
              <AlertDescription>
                Price alerts set: Above ${priceAlertThresholds.upper} or below ${priceAlertThresholds.lower}
              </AlertDescription>
            </Alert>
          )}

          {/* Stock Overview */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center gap-4 mb-2">
                  <h1 className="text-3xl font-bold">AAPL</h1>
                  <span className="text-gray-500">Apple Inc.</span>
                  <div className="flex gap-2">
                    <button className="p-2 bg-blue-500 hover:bg-gray-100 rounded-full">
                      <Heart className="h-5 w-5" />
                    </button>
                    <button className="p-2 bg-blue-500 hover:bg-gray-100 rounded-full">
                      <Bell className="h-5 w-5" />
                    </button>
                    <button className="p-2 bg-blue-500 hover:bg-gray-100 rounded-full">
                      <Share2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold">${stockPrice ?? 'Loading...'}</span>
                  <span className="flex items-center text-green-500">
                    <ArrowUpRight className="h-4 w-4" />
                    +2.45%
                  </span>
                </div>
              </div>
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                <Download className="h-4 w-4" /> Export Data
              </button>
            </div>

            {/* Price Chart */}
            <div className="h-[400px]">
              <div className="flex gap-2 mb-4">
                {['1D', '1W', '1M', '3M', '1Y', 'ALL'].map((period) => (
                  <button
                    key={period}
                    className={`px-3 py-1 rounded-lg ${
                      timeframe === period ? 'bg-blue-500 text-white' : 'bg-gray-100'
                    }`}
                    onClick={() => setTimeframe(period)}
                  >
                    {period}
                  </button>
                ))}
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historicalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={['auto', 'auto']} />
                  <Tooltip />
                  <Line type="monotone" dataKey="price" stroke="#2563eb" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="prediction" stroke="#16a34a" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Enhanced Analysis Tabs */}
          <Tabs defaultValue="prediction" className="mb-8">
            <TabsList className="w-full flex gap-4 rounded-s-lg">
              <TabsTrigger value="prediction" className=" bg-blue-500 flex-1">
                <TrendingUp className="w-4 h-4 mr-2" /> Prediction
              </TabsTrigger>
              <TabsTrigger value="technical" className="bg-blue-500 flex-1">
                <Activity className="w-4 h-4 mr-2" /> Technical
              </TabsTrigger>
              <TabsTrigger value="fundamental" className="bg-blue-500 flex-1">
                <DollarSign className="w-4 h-4 mr-2" /> Fundamental
              </TabsTrigger>
              <TabsTrigger value="sentiment" className="bg-blue-500 flex-1">
                <MessageSquare className="w-4 h-4 mr-2" /> Sentiment
              </TabsTrigger>
            </TabsList>

            <TabsContent value="prediction" className="mt-4">
              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Price Target</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">$195.50</div>
                    <div className="text-sm text-gray-500">30-day forecast</div>
                    <div className="text-sm text-green-600">+7.2%</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Confidence Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">85%</div>
                    <div className="text-sm text-gray-500">Based on model accuracy</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Risk Level</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-yellow-600">Moderate</div>
                    <div className="text-sm text-gray-500">Volatility: Medium</div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="technical" className="mt-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Volume Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={historicalData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="volume" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Price Momentum</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span>Momentum Score</span>
                        <span className="text-green-600 font-bold">Strong Buy</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Trend Strength</span>
                        <span className="text-blue-600 font-bold">85%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span>Volatility Index</span>
                        <span className="font-bold">Medium</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="fundamental" className="mt-4">
              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Financial Ratios</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>P/E Ratio</span>
                        <span className="font-bold">28.5</span>
                      </div>
                      <div className="flex justify-between">
                        <span>PEG Ratio</span>
                        <span className="font-bold">1.8</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Price/Book</span>
                        <span className="font-bold">15.2</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Debt/Equity</span>
                        <span className="font-bold">1.2</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Growth Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span>Revenue Growth (YoY)</span>
                        <span className="text-green-600 font-bold">+12.4%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>EPS Growth (YoY)</span>
                        <span className="text-green-600 font-bold">+15.2%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Profit Margin</span>
                        <span className="font-bold">25.3%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="sentiment" className="mt-4">
              <div className="space-y-4">
                {/* Sentiment Analysis Chart */}
                <Card>
                  <CardHeader>
                    <CardTitle>Market Sentiment Analysis</CardTitle>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={sentimentData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="positive" fill="#22c55e" stackId="sentiment" />
                        <Bar dataKey="negative" fill="#ef4444" stackId="sentiment" />
                        <Bar dataKey="neutral" fill="#94a3b8" stackId="sentiment" />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* News Feed */}
                <Card>
                  <CardHeader>
                    <CardTitle>Latest News & Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {newsData.map((news, index) => (
                        <div key={index} className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-lg">
                          <div className={`w-2 h-2 mt-2 rounded-full ${
                            news.sentiment === 'positive' ? 'bg-green-500' :
                            news.sentiment === 'negative' ? 'bg-red-500' : 'bg-gray-500'
                          }`} />
                          <div className="flex-1">
                            <h4 className="font-medium">{news.title}</h4>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <span>{news.source}</span>
                              <span>•</span>
                              <span>{news.time}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <StockSidebar />
      </main>
    </div>
  );
};

export default AnalysisPage;