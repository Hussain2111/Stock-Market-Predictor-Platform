import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "./logo.jpg";
import { Home } from "lucide-react";
import AuthModal from "./AuthModal";
import ProfileIcon from "./ProfileIcon";

const Header = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!localStorage.getItem("authToken");
  });

  return (
    <>
      <header className="border-b border-gray-800 bg-black/20 backdrop-blur-sm">
        <div className="w-full max-w-7xl mx-auto px-6 py-4 flex items-center">
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
          <div className="flex items-center gap-4 pr-4">
            <Link 
              to="/"
              className="p-2 hover:bg-gray-100 hover:bg-opacity-10 rounded-full transition-colors"
              aria-label="Go to homepage"
            >
              <Home className="w-6 h-6" />
            </Link>
            <ProfileIcon />
          </div>
        </div>
      </header>

      {/* Conditionally render the AuthModal */}
      {showAuthModal && (
        <AuthModal
          onClose={() => {
            setShowAuthModal(false);
            // Check if user is logged in after modal closes
            if (localStorage.getItem("authToken")) {
              setIsLoggedIn(true);
            }
          }}
        />
      )}
    </>
  );
};

export default Header;
