import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Card, CardHeader, CardTitle, CardContent, CardFooter
} from '../components/ui/card';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import { ChevronLeft, Share2, Star, Maximize2 } from 'lucide-react';

const StockAnalysis = () => {
  const { symbol } = useParams();
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([]);
  const [marketSentiment, setMarketSentiment] = useState('Neutral');
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);

  useEffect(() => {
    if (symbol) {
      fetchStockData(symbol);
      fetchHistoricalData(symbol);
      fetchMarketSentiment(symbol);
      fetchNewsArticles(symbol);
    }
  }, [symbol]);

interface StockData {
    symbol: string;
    price: number;
    change: string;
    volume: number;
    marketCap: number;
}

const fetchStockData = async (symbol: string): Promise<void> => {
    // Fetch current stock data from API
    const data: StockData = {
        symbol,
        price: 124.56,
        change: '+2.3%',
        volume: 18.4e6,
        marketCap: 2.1e12
    };
    setStockData(data);
}

interface HistoricalData {
    date: string;
    price: number;
}

const fetchHistoricalData = async (symbol: string): Promise<void> => {
    // Fetch historical stock data from API
    const data: HistoricalData[] = [
        { date: '2023-01-01', price: 115.20 },
        { date: '2023-02-01', price: 118.75 },
        { date: '2023-03-01', price: 122.30 },
        { date: '2023-04-01', price: 124.56 },
        // Add more historical data points
    ];
    setHistoricalData(data);
}

interface MarketSentimentResponse {
    sentiment: string;
}

const fetchMarketSentiment = async (symbol: string): Promise<void> => {
    // Fetch market sentiment analysis from API
    const sentiment: MarketSentimentResponse = { sentiment: 'Bullish' };
    setMarketSentiment(sentiment.sentiment);
}

interface NewsArticle {
    title: string;
    source: string;
    date: string;
}

const fetchNewsArticles = async (symbol: string): Promise<void> => {
    // Fetch news articles related to the stock from API
    const articles: NewsArticle[] = [
        {
            title: 'Apple Introduces Groundbreaking New Product',
            source: 'Tech Insider',
            date: '2023-04-15'
        },
        {
            title: 'Apple Stock Soars on Earnings Beat',
            source: 'Business Today',
            date: '2023-04-05'
        },
        // Add more news articles
    ];
    setNewsArticles(articles);
}

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white min-h-screen">
      {/* Header */}
      <div className="bg-blue-900 text-white py-4 px-6 flex justify-between items-center">
        <button className="flex items-center gap-2 hover:bg-blue-800 px-3 py-2 rounded-lg">
          <ChevronLeft className="h-5 w-5" /> Back
        </button>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 hover:bg-blue-800 px-3 py-2 rounded-lg">
            <Maximize2 className="h-5 w-5" /> Compare
          </button>
          <button className="hover:bg-blue-800 p-2 rounded-lg">
            <Star className="h-6 w-6" />
          </button>
          <button className="hover:bg-blue-800 p-2 rounded-lg">
            <Share2 className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Stock Overview */}
      <div className="p-6">
        <h1 className="text-3xl font-bold">{stockData?.symbol} - {stockData?.price}</h1>
        <p className="text-green-600 font-medium">{stockData?.change}</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Volume</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stockData?.volume.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Market Cap</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stockData?.marketCap.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Sentiment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${marketSentiment === 'Bullish' ? 'text-green-600' : 'text-red-600'}`}>
                {marketSentiment}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Buy</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Historical Price Chart */}
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">Historical Price</h2>
        <LineChart width={800} height={400} data={historicalData}>
          <XAxis dataKey="date" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="price" stroke="#8884d8" />
        </LineChart>
      </div>

      {/* News and Insights */}
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">News and Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {newsArticles.map((article, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle>{article.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-500">{article.source} - {article.date}</p>
              </CardContent>
              <CardFooter>
                <button className="text-blue-500 hover:underline">Read More</button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StockAnalysis;