import React, { useState } from "react";
import { authService } from "./authService";
import AuthModal from "./AuthModal";

interface ProtectedWatchlistProps {
  children: React.ReactNode;
}

export default function ProtectedWatchlist({
  children,
}: ProtectedWatchlistProps) {
  const [showAuthModal, setShowAuthModal] = useState(
    !authService.isAuthenticated()
  );

  const handleCloseModal = () => {
    // If user authenticated after modal close, continue
    if (authService.isAuthenticated()) {
      setShowAuthModal(false);
    }
  };

  return (
    <>
      {authService.isAuthenticated() ? (
        children
      ) : (
        <div className="flex flex-col items-center justify-center p-8 bg-[#111827] rounded-xl">
          <h2 className="text-2xl font-bold mb-4">Login Required</h2>
          <p className="text-gray-400 mb-6 text-center">
            You need to login or create an account to view your watchlist.
          </p>
          <button
            onClick={() => setShowAuthModal(true)}
            className="py-3 px-6 bg-emerald-500 rounded-lg font-medium hover:bg-emerald-600 transition-colors"
          >
            Login / Register
          </button>
        </div>
      )}

      <AuthModal isOpen={showAuthModal} onClose={handleCloseModal} />
    </>
  );
}
