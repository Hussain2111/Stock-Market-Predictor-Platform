import { useState } from 'react';
import { Search,  BarChart2, Target, ArrowRight} from 'lucide-react';
import { Card, CardContent,} from '../components/ui/card';

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

      
    </div>
    
  );
};

export default HomePage;