import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "./logo.jpg";
import { DollarSign, TrendingUp } from "lucide-react";

interface Stock {
  ticker: string;
  quantity: number;
  currentPrice: number;
}

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5001/portfolio?user_id=uzair")
      .then((res) => res.json())
      .then((data) => {
        setPortfolio(data);
        setLoading(false);
      })
      .catch((error) => console.error("Error fetching portfolio:", error));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#111827] text-white flex flex-col">
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
        </div>
      </header>

      {/* Portfolio Content */}
      <main className="flex-1 px-6 py-10">
        <h1 className="text-3xl font-bold text-center mb-6">Your Portfolio</h1>

        {loading ? (
          <p className="text-center text-gray-400">Loading portfolio...</p>
        ) : portfolio.length === 0 ? (
          <p className="text-center text-gray-400">No stocks bought yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {portfolio.map((stock, index) => (
              <div
                key={index}
                className="bg-gray-900 p-5 rounded-2xl shadow-lg transform hover:scale-105 transition"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">{stock.ticker}</h2>
                  <TrendingUp className="text-green-400 w-6 h-6" />
                </div>
                <p className="text-gray-400 mt-2">
                  Quantity:{" "}
                  <span className="text-white font-medium">
                    {stock.quantity}
                  </span>
                </p>
                <div className="flex items-center mt-4">
                  <DollarSign className="text-yellow-400 w-5 h-5 mr-2" />
                  <p className="text-lg font-semibold">
                    ${stock.currentPrice?.toFixed(2) || "N/A"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Portfolio;
