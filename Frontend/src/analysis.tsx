import React, { useState } from 'react';
import { Search, Heart, Share2, Bell, Download, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Mock data for the chart
const historicalData = Array.from({ length: 30 }, (_, i) => ({
  date: `2024-${String(i + 1).padStart(2, '0')}-01`,
  price: Math.random() * 50 + 150,
  prediction: Math.random() * 50 + 160
}));

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-900 text-white p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center flex-1 max-w-xl">
            <Search className="h-5 w-5 text-gray-400 absolute ml-3" />
            <input
              type="text"
              placeholder="Search for another stock..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/10 text-white placeholder-gray-400"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
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
          {/* Stock Overview */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <div className="flex items-center gap-4 mb-2">
                  <h1 className="text-3xl font-bold">AAPL</h1>
                  <span className="text-gray-500">Apple Inc.</span>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                      <Heart className="h-5 w-5" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                      <Bell className="h-5 w-5" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-full">
                      <Share2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold">$182.63</span>
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

          {/* Prediction Analysis */}
          <div className="grid grid-cols-3 gap-4 mb-8">
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

          {/* Technical Analysis */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Technical Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Moving Averages</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>MA(20)</span>
                      <span className="font-medium">180.45</span>
                    </div>
                    <div className="flex justify-between">
                      <span>MA(50)</span>
                      <span className="font-medium">178.32</span>
                    </div>
                    <div className="flex justify-between">
                      <span>MA(200)</span>
                      <span className="font-medium">175.89</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Oscillators</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>RSI(14)</span>
                      <span className="font-medium">56.78</span>
                    </div>
                    <div className="flex justify-between">
                      <span>MACD</span>
                      <span className="text-green-600">Bullish</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Stochastic</span>
                      <span className="text-yellow-600">Neutral</span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Support/Resistance</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Support 1</span>
                      <span className="font-medium">178.50</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Support 2</span>
                      <span className="font-medium">175.20</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Resistance 1</span>
                      <span className="font-medium">185.30</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <StockSidebar />
      </main>
    </div>
  );
};

export default AnalysisPage;