import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "./logo.jpg";
import { DollarSign, TrendingUp } from "lucide-react";
import Modal from "react-modal";
import { motion } from "framer-motion"; // Import for animations

Modal.setAppElement("#root");

interface Stock {
  ticker: string;
  quantity: number;
  currentPrice: number;
  priceBought: number;
  date: Date;
}

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState<Stock[] | null>(null);
  const [profitLoss, setProfitLoss] = useState<number | null>(null);
  const [profitLossPercentage, setProfitLossPercentage] = useState<
    number | null
  >(null);

  useEffect(() => {
    fetch("http://localhost:5001/portfolio?user_id=uzair")
      .then((res) => res.json())
      .then((data) => {
        setPortfolio(data);
        setLoading(false);
      })
      .catch((error) => console.error("Error fetching portfolio:", error));

    // Fetch Profit/Loss
    fetch("http://localhost:5001/profit-or-loss", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user_id: "uzair" }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProfitLoss(data.profit_loss);
          setProfitLossPercentage(data.profit_loss_percentage);
        }
      })
      .catch((error) => console.error("Error fetching profit/loss:", error));
  }, []);

  const openModal = (ticker: string) => {
    fetch(
      `http://localhost:5001/individual-stock?user_id=uzair&ticker=${ticker}`
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSelectedStock(data.stocks);
        } else {
          setSelectedStock([]);
        }
        setModalIsOpen(true);
      })
      .catch((error) =>
        console.error("Error fetching individual stocks:", error)
      );
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedStock(null);
  };

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
      <main className="flex-1 px-6 py-10 relative">
        <h1 className="text-3xl font-bold text-center mb-6">Your Portfolio</h1>

        {loading ? (
          <p className="text-center text-gray-400">Loading portfolio...</p>
        ) : portfolio.length === 0 ? (
          <p className="text-center text-gray-400">No stocks bought yet.</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {portfolio.map((stock, index) => (
              <motion.div
                key={index}
                className="bg-gray-900 p-5 rounded-2xl shadow-lg transform hover:scale-105 transition cursor-pointer"
                onClick={() => openModal(stock.ticker)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
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
              </motion.div>
            ))}
          </div>
        )}

        {/* Profit/Loss Display */}
        {profitLoss !== null && (
          <motion.div
            className={`fixed top-20 right-10 p-6 rounded-lg shadow-lg text-white text-xl font-bold ${
              profitLoss >= 0 ? "bg-green-600" : "bg-red-600"
            }`}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
          >
            {profitLoss >= 0 ? "📈 Profit" : "📉 Loss"}: $
            {profitLoss.toFixed(2)}
            <span className="ml-2 text-sm">
              ({profitLossPercentage?.toFixed(2)}%)
            </span>
          </motion.div>
        )}
      </main>

      {/* Modal for Stock Details */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Stock Details Modal"
        className="modal-content bg-black p-12 rounded-3xl text-white w-11/12 max-w-5xl mx-auto"
        overlayClassName="modal-overlay fixed inset-0 bg-black bg-opacity-0 backdrop-blur-sm flex justify-center items-center"
      >
        <h2 className="text-3xl font-semibold mb-8 text-yellow-300">
          {selectedStock ? selectedStock[0].ticker : "Stock Details"}
        </h2>

        {selectedStock ? (
          <table className="w-full text-left table-auto mb-6">
            <thead>
              <tr>
                <th className="px-6 py-3 border-b text-lg font-semibold text-yellow-200">
                  Date & Time
                </th>
                <th className="px-6 py-3 border-b text-lg font-semibold text-yellow-200">
                  Price Bought
                </th>
                <th className="px-6 py-3 border-b text-lg font-semibold text-yellow-200">
                  Current Price
                </th>
              </tr>
            </thead>
            <tbody>
              {selectedStock.map((stock, index) => (
                <tr key={index} className="border-b border-gray-700">
                  <td className="px-6 py-4 text-gray-300">
                    {new Date(stock.date).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-red-400">
                    ${stock.priceBought.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-white">
                    ${stock.currentPrice.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="text-center text-gray-300">No details available.</p>
        )}
      </Modal>
    </div>
  );
};

export default Portfolio;
