import React, { useState } from "react";
import { authService } from "./authService";
import AuthModal from "./AuthModal";
import { ChartLine, Lock, TrendingUp, Eye } from "lucide-react";

interface ProtectedWatchlistProps {
  children: React.ReactNode;
}

export default function ProtectedWatchlist({
  children,
}: ProtectedWatchlistProps) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const isAuthenticated = authService.isAuthenticated();

  const handleCloseModal = () => {
    setShowAuthModal(false);
    if (authService.isAuthenticated()) {
      window.location.reload();
    }
  };

  return (
    <>
      {isAuthenticated ? (
        children
      ) : (
        <div className="min-h-[80vh] w-full bg-gradient-to-b from-[#111827] to-[#0c111b] rounded-lg overflow-hidden shadow-xl flex flex-col">
          {/* Top section with blurred chart background */}
          <div className="relative p-8 flex-grow flex flex-col items-center justify-center text-center">
            <div className="absolute inset-0 bg-[url('/path/to/stock-chart-bg.jpg')] bg-cover opacity-10"></div>
            <div className="relative z-10 max-w-2xl mx-auto">
              <div className="flex items-center justify-center mb-4">
                <Lock className="w-8 h-8 text-emerald-500 mr-3" />
                <h2 className="text-3xl font-bold text-white">
                  Premium Watchlist
                </h2>
              </div>
              <p className="text-gray-300 text-xl mb-8">
                Create an account to track your favorite stocks and get
                personalized alerts
              </p>

              <button
                onClick={() => setShowAuthModal(true)}
                className="px-8 py-4 bg-emerald-500 rounded-lg font-medium hover:bg-emerald-600 transition-colors text-white shadow-lg text-lg"
              >
                Get Started Now
              </button>
            </div>
          </div>

          {/* Features section */}
          <div className="bg-black/30 p-12 grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center">
              <Eye className="w-12 h-12 text-emerald-500 mb-4" />
              <h3 className="text-white text-xl font-medium mb-3">
                Track Favorites
              </h3>
              <p className="text-gray-400">
                Monitor your favorite stocks in real-time with custom alerts
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <TrendingUp className="w-12 h-12 text-emerald-500 mb-4" />
              <h3 className="text-white text-xl font-medium mb-3">
                Market Insights
              </h3>
              <p className="text-gray-400">
                Get personalized insights for stocks in your watchlist
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <ChartLine className="w-12 h-12 text-emerald-500 mb-4" />
              <h3 className="text-white text-xl font-medium mb-3">
                Performance Tracking
              </h3>
              <p className="text-gray-400">
                Monitor how stocks perform over time with historical data
              </p>
            </div>
          </div>
        </div>
      )}

      <AuthModal isOpen={showAuthModal} onClose={handleCloseModal} />
    </>
  );
}
