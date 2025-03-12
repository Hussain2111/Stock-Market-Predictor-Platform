import { useState } from "react";
import { Link } from "react-router-dom";

const Trading = () => {
  const [search, setSearch] = useState("");
  const [savedStocks, setSavedStocks] = useState(["AAPL", "TSLA", "GOOGL"]);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Top Navigation Bar */}
      <nav className="bg-gray-800 p-4 flex items-center justify-start gap-6">
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
      </nav>

      {/* Main Content Area */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-1/4 bg-gray-800 p-4">
          <h2 className="text-lg font-bold mb-4">Saved Stocks</h2>
          <ul>
            {savedStocks.map((stock, index) => (
              <li key={index} className="py-2 border-b border-gray-700">
                {stock}
              </li>
            ))}
          </ul>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search stocks..."
            className="w-full p-2 mb-4 text-black rounded"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Placeholder Chart */}
          <div className="w-full h-64 bg-gray-700 flex items-center justify-center mb-4 rounded">
            <span>Placeholder Chart</span>
          </div>

          {/* Buy & Sell Buttons */}
          <div className="flex gap-4">
            <button className="bg-green-500 px-6 py-2 rounded hover:bg-green-700">
              Buy
            </button>
            <button className="bg-red-500 px-6 py-2 rounded hover:bg-red-700">
              Sell
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trading;
