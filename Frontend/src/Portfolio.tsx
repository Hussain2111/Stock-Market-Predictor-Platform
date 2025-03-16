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

const Portfolio = () => {
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
          {/* Main Content */}
          <div className="flex-1 p-6"></div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
