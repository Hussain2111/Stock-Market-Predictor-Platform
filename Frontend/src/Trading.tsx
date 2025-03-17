import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import logo from "./logo.jpg";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// StockData interface
interface StockData {
  symbol: string;
  name: string;
  currency: string;
  currentPrice: number;
  previousClose: number;
  marketCap: number;
  dayHigh: number;
  dayLow: number;
  priceData: {
    Date: string;
    Open: number;
    High: number;
    Low: number;
    Close: number;
    Volume: number;
  }[];
}

// API functions
const fetchStockData = async (
  symbol: string,
  period: string = "1y"
): Promise<StockData> => {
  try {
    const response = await fetch(
      `http://localhost:5001/api/stock?symbol=${symbol}&period=${period}`
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch stock data");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching stock data:", error);
    throw error;
  }
};

const searchStocks = async (
  query: string
): Promise<Array<{ symbol: string; name: string; exchange: string }>> => {
  try {
    if (!query || query.length < 2) return [];

    const response = await fetch(`http://localhost:5001/api/search?q=${query}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to search stocks");
    }

    return await response.json();
  } catch (error) {
    console.error("Error searching stocks:", error);
    throw error;
  }
};

const Trading = () => {
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<
    Array<{ symbol: string; name: string; exchange: string }>
  >([]);
  const [savedStocks, setSavedStocks] = useState([""]);
  const [selectedStock, setSelectedStock] = useState<string>("");
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [timePeriod, setTimePeriod] = useState("1mo");

  // Fetch stock data when selected stock or time period changes
  useEffect(() => {
    const getStockData = async () => {
      if (!selectedStock) return;

      setLoading(true);
      setError("");

      try {
        const data = await fetchStockData(selectedStock, timePeriod);
        setStockData(data);
      } catch (err) {
        setError("Failed to load stock data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getStockData();
  }, [selectedStock, timePeriod]);

  // Handle search input changes
  const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);

    if (value.length >= 2) {
      try {
        const results = await searchStocks(value);
        setSearchResults(results);
      } catch (err) {
        console.error("Search error:", err);
      }
    } else {
      setSearchResults([]);
    }
  };

  // Select a stock from search results
  const selectStock = (symbol: string) => {
    setSelectedStock(symbol);
    setSearch("");
    setSearchResults([]);

    // Add to saved stocks if not already there
    if (!savedStocks.includes(symbol)) {
      setSavedStocks([...savedStocks, symbol]);
    }
  };

  const buyStock = async () => {
    if (!stockData) {
      alert("Stock data is unavailable.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5001/buy-stock", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: "uzair", // Replace with actual user ID
          ticker: selectedStock,
          stock_holdings: stockData.currentPrice,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert("Stock purchased successfully!");
      } else {
        alert("Error buying stock: " + data.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSellStock = async () => {
    if (!selectedStock || !stockData) return;

    try {
      const response = await fetch("http://localhost:5001/sell-stock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: "uzair",
          ticker: selectedStock,
          currentPrice: stockData.currentPrice,
        }),
      });

      const result = await response.json();
      if (result.success) {
        console.log(result.message);
      } else {
        console.error("Sell failed:", result.error);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#111827] text-white flex">
      <div className="flex-1 flex flex-col">
        {/* Top Navigation Bar */}
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
            <div className="flex items-center gap-4"></div>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="flex flex-1">
          {/* Sidebar */}
          <div className="w-1/6 bg-gray-800/50 p-4">
            <h2 className="text-lg font-bold mb-4">Recent Stocks</h2>
            <ul>
              {savedStocks.map((stock, index) => (
                <li
                  key={index}
                  className={`py-2 border-b border-gray-700 cursor-pointer hover:text-emerald-500 ${
                    selectedStock === stock ? "text-emerald-500" : ""
                  }`}
                  onClick={() => setSelectedStock(stock)}
                >
                  {stock}
                </li>
              ))}
            </ul>
          </div>

          {/* Main Content */}
          <div className="flex-1 p-6">
            {/* Search Bar with Dropdown */}
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="Search stocks..."
                className="w-full p-3 bg-gray-800/50 border border-gray-700 text-white rounded-lg focus:ring-emerald-500 focus:border-emerald-500"
                value={search}
                onChange={handleSearchChange}
              />
              {searchResults.length > 0 && (
                <div className="absolute z-10 w-full bg-gray-800 text-white mt-1 rounded-lg shadow-lg border border-gray-700">
                  {searchResults.map((result, index) => (
                    <div
                      key={index}
                      className="p-3 hover:bg-gray-700 cursor-pointer border-b border-gray-700 last:border-b-0"
                      onClick={() => selectStock(result.symbol)}
                    >
                      <span className="font-bold text-emerald-500">
                        {result.symbol}
                      </span>{" "}
                      - {result.name} ({result.exchange})
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Time Period Selector */}
            <div className="flex gap-2 mb-6">
              {["1d", "1wk", "1mo", "3mo", "6mo", "1y", "5y"].map((period) => (
                <button
                  key={period}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    timePeriod === period
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-800/70 hover:bg-gray-700"
                  }`}
                  onClick={() => setTimePeriod(period)}
                >
                  {period}
                </button>
              ))}
            </div>

            {/* Stock Info */}
            {stockData && (
              <div className="mb-6 bg-gray-800/40 p-4 rounded-lg border border-gray-700">
                <h2 className="text-2xl font-bold mb-2">
                  {stockData.name} ({stockData.symbol})
                </h2>
                <div className="flex gap-4 mb-4">
                  <div className="text-2xl">
                    ${stockData.currentPrice.toFixed(2)} {stockData.currency}
                  </div>
                  <div
                    className={`text-lg ${
                      stockData.currentPrice > stockData.previousClose
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {stockData.currentPrice > stockData.previousClose
                      ? "↑"
                      : "↓"}
                    {(
                      ((stockData.currentPrice - stockData.previousClose) /
                        stockData.previousClose) *
                      100
                    ).toFixed(2)}
                    %
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="text-gray-400 text-sm">Previous Close</div>
                    <div>${stockData.previousClose.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm">Day Range</div>
                    <div>
                      ${stockData.dayLow.toFixed(2)} - $
                      {stockData.dayHigh.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm">Market Cap</div>
                    <div>${(stockData.marketCap / 1000000000).toFixed(2)}B</div>
                  </div>
                </div>
              </div>
            )}

            {/* Stock Chart */}
            <div className="w-full h-80 mb-6 bg-gray-800/40 p-4 rounded-lg border border-gray-700">
              {loading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-500"></div>
                </div>
              ) : error ? (
                <div className="w-full h-full flex items-center justify-center text-red-500">
                  <span>{error}</span>
                </div>
              ) : stockData && stockData.priceData ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stockData.priceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                    <XAxis
                      dataKey="Date"
                      tick={{ fill: "#aaa" }}
                      tickFormatter={(value) => {
                        if (timePeriod === "1d") return value.split(" ")[1]; // Show time for 1d
                        if (["1wk", "1mo"].includes(timePeriod))
                          return value.split("-")[2]; // Show day for short periods
                        return value.split("-").slice(1).join("/"); // Show month/day for longer periods
                      }}
                    />
                    <YAxis
                      domain={["auto", "auto"]}
                      tick={{ fill: "#aaa" }}
                      tickFormatter={(value) => `$${value.toFixed(0)}`}
                    />
                    <Tooltip
                      labelFormatter={(label) => `Date: ${label}`}
                      formatter={(value: any) => [
                        `$${Number(value).toFixed(2)}`,
                        "",
                      ]}
                      contentStyle={{
                        backgroundColor: "#1f2937",
                        borderColor: "#374151",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="Close"
                      stroke="#10b981"
                      dot={false}
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span>Select a stock to view chart</span>
                </div>
              )}
            </div>

            {/* Buy & Sell Buttons */}
            <div className="flex gap-4">
              <button
                onClick={buyStock}
                className="bg-green-500 px-8 py-3 rounded-lg hover:bg-green-600 font-medium transition-colors"
              >
                Buy
              </button>
              <button
                onClick={handleSellStock}
                className="bg-red-500 px-8 py-3 rounded-lg hover:bg-red-600 font-medium transition-colors"
              >
                Sell
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trading;
