import { useState } from 'react';
import { Search, ArrowRight, BarChart2, Target, TrendingUp, ChevronRight, Award, ChevronDown} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle} from '../components/ui/card';

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-blue-900 text-white">
        <div className="max-w-full mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl font-bold leading-tight">
                Predict Stock Movements with AI Precision
              </h1>
              <p className="text-xl text-blue-100">
                Make informed investment decisions with our advanced AI-powered stock prediction platform
              </p>
              <form className="relative mt-8">
                <div className="relative">
                  <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Enter any stock symbol (e.g., AAPL)"
                    className="w-full pl-12 pr-4 py-3 rounded-lg text-gray-900"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <button className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 transition-colors">
                  Analyze Stock <ArrowRight className="h-5 w-5" />
                </button>
              </form>
            </div>
            <div className="relative">
              <div className="bg-white p-6 rounded-xl shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">AAPL Prediction</h3>
                    <p className="text-sm text-gray-500">Next 30 Days Forecast</p>
                  </div>
                  <span className="text-green-600 font-bold">+8.2%</span>
                </div>
                {/* Preview Chart */}
                <div className="h-48 bg-gray-50 rounded-lg mb-4">
                  {/* Placeholder for actual chart component */}
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    Interactive Chart Preview
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* How It Works Section */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">How Our Predictor Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">1. Enter Stock Symbol</h3>
              <p className="text-gray-600">
                Simply enter any stock symbol to start. Our system supports all major exchanges worldwide.
              </p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart2 className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">2. AI Analysis</h3>
              <p className="text-gray-600">
                Our AI analyzes historical data, market sentiment, and global factors in real-time.
              </p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">3. Get Predictions</h3>
              <p className="text-gray-600">
                Receive detailed predictions, trends, and confidence scores for informed decisions.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      {/* Preview Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What You'll Get</h2>
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 divide-x divide-gray-200">
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4">Price Predictions</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span>30-day price forecast</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                    <span>Confidence intervals</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                    <span>Support & resistance levels</span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4">Technical Analysis</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                    <span>Moving averages</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span>Volume analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-teal-500"></div>
                    <span>Trend indicators</span>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-4">Market Insights</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                    <span>Sentiment analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <span>News impact</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                    <span>Market correlation</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Results Preview */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Preview the Analysis Dashboard</h2>
        <div className="bg-white rounded-xl shadow-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Price Prediction</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">$189.42</div>
                <div className="text-sm text-gray-500">Expected in 30 days</div>
                <div className="text-sm text-green-600">+12.3%</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Confidence Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">87%</div>
                <div className="text-sm text-gray-500">Based on historical accuracy</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Market Sentiment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">Bullish</div>
                <div className="text-sm text-gray-500">Strong buy signals</div>
              </CardContent>
            </Card>
          </div>
          <div className="bg-gray-50 h-64 rounded-lg flex items-center justify-center text-gray-400">
            Interactive Chart Preview
          </div>
        </div>
      </div>
      {/* Trending & Recent Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Most Analyzed Stocks Today
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['AAPL', 'MSFT', 'GOOGL', 'AMZN'].map((symbol) => (
                    <div key={symbol} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                      <span className="font-medium">{symbol}</span>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Most Accurate Predictions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {['TSLA', 'NVDA', 'META', 'AMD'].map((symbol) => (
                    <div key={symbol} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer">
                      <span className="font-medium">{symbol}</span>
                      <span className="text-green-600">94% accurate</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <button className="flex items-center justify-between w-full">
                <span className="font-medium text-white">How accurate are the predictions?</span>
                <ChevronDown className="h-5 w-5" />
              </button>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <button className="flex items-center justify-between w-full">
                <span className="font-medium text-white">What data sources do you use?</span>
                <ChevronDown className="h-5 w-5" />
              </button>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <button className="flex items-center justify-between w-full">
                <span className="font-medium text-white">How often are predictions updated?</span>
                <ChevronDown className="h-5 w-5" />
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default HomePage;