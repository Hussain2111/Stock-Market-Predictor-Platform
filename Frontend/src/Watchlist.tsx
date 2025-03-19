import { useState, useEffect } from "react";
import Header from "./components/Header";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  ExternalLink,
  Trash2,
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useWatchlist } from "./context/WatchlistContext";

interface StockData {
  ticker: string;
  companyName: string;
  currentPrice: number;
  priceChange: number;
  percentChange: number;
}

const Watchlist = () => {
  const { watchlist, removeFromWatchlist } = useWatchlist();
  const [stocksData, setStocksData] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStocksData = async () => {
      if (watchlist.length === 0) {
        setStocksData([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const stocksPromises = watchlist.map(async ticker => {
          try {
            // Get basic stock info
            const infoResponse = await fetch(`http://localhost:5001/stock-info?ticker=${ticker}`);
            const infoData = await infoResponse.json();
            
            // Get current price - need to set the global ticker first
            await fetch(`http://localhost:5001/stock-info?ticker=${ticker}`);
            const priceResponse = await fetch(`http://localhost:5001/stock-price?ticker=${ticker}`);
            const priceData = await priceResponse.json();
            
            console.log(`Price data for ${ticker}:`, priceData);
            
            let currentPrice = 0;
            let priceChange = 0;
            let percentChange = 0;
            
            if (priceData.success) {
              currentPrice = priceData.currentPrice || 0;
              
              // Get price change data from stock-price-data endpoint
              const priceHistoryResponse = await fetch(
                `http://localhost:5001/stock-price-data?ticker=${ticker}&timeframe=1D`
              );
              const priceHistoryData = await priceHistoryResponse.json();
              
              console.log(`Price history data for ${ticker}:`, priceHistoryData);
              
              if (priceHistoryData.success && priceHistoryData.priceData && priceHistoryData.priceData.length >= 2) {
                const prices = priceHistoryData.priceData.map((item: { price: number }) => item.price);
                
                // Use the opening price (first price) and latest price for calculation
                const openPrice = prices[0];
                const latestPrice = prices[prices.length - 1];
                
                priceChange = latestPrice - openPrice;
                percentChange = (priceChange / openPrice) * 100;
                
                console.log(`${ticker} calculated price data:`, {
                  openPrice,
                  latestPrice,
                  priceChange,
                  percentChange
                });
              } else {
                // If we can't get price history, use a hardcoded small positive change for demo purposes
                // This ensures we always show some price movement in the UI
                priceChange = 0.00;
                percentChange = 0.00;
              }
            }
            
            return {
              ticker,
              companyName: infoData.success ? infoData.company_name : ticker,
              currentPrice,
              priceChange,
              percentChange
            };
          } catch (error) {
            console.error(`Error fetching data for ${ticker}:`, error);
            return {
              ticker,
              companyName: ticker,
              currentPrice: 0,
              priceChange: 0,
              percentChange: 0
            };
          }
        });

        const results = await Promise.all(stocksPromises);
        setStocksData(results);
      } catch (error) {
        console.error("Error fetching watchlist data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStocksData();
    
    // Set up an interval to refresh data every minute
    const intervalId = setInterval(fetchStocksData, 60000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [watchlist]);

  const handleRemoveFromWatchlist = (ticker: string, e: React.MouseEvent) => {
    e.stopPropagation();
    removeFromWatchlist(ticker);
  };

  const navigateToAnalysis = (ticker: string) => {
    navigate(`/analysis?ticker=${ticker}`);
  };

