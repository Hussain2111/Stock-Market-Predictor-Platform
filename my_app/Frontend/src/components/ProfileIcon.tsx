import { useState, useRef, useEffect } from "react";
import {
  Settings,
  Bell,
  History,
  LogOut,
  Bookmark,
  LineChart,
  Wallet,
  HelpCircle,
  Star,
  List,
} from "lucide-react";
import { Link } from "react-router-dom";

const ProfileIcon = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userProfile, setUserProfile] = useState({
    name: "Alex Johnson",
    email: "alex@example.com",
    avatar: "/api/placeholder/100/100",
    plan: "Free",
    analysesRemaining: 3,
  });

  // Explicitly typing dropdownRef as a reference to a HTMLDivElement
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch user profile data here
    fetchUserData();

    // Close dropdown when clicking outside
    const handleClickOutside = (event: Event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Fetch user data function (mock)
  const fetchUserData = async () => {
    // In a real app, you would fetch from an API
    // For now we'll use mock data
    setUserProfile({
      name: "Alex Johnson",
      email: "alex@example.com",
      avatar: "/api/placeholder/100/100",
      plan: "Free",
      analysesRemaining: 3,
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    // Redirect to login page or home page
    window.location.href = "/login";
  };

  // Get background color based on plan
  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case "Professional":
        return "bg-purple-500";
      case "Trader":
        return "bg-blue-500";
      case "Free":
      default:
        return "bg-emerald-500";
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full bg-gray-800 p-1 hover:bg-gray-700 transition-colors"
      >
        <div className="w-8 h-8 rounded-full overflow-hidden">
          <img
            src={userProfile.avatar}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        {/* <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} /> */}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-gray-900 border border-gray-800 rounded-lg shadow-xl z-50 overflow-hidden">
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <img
                  src={userProfile.avatar}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-grow">
                <p className="font-medium text-white">{userProfile.name}</p>
                <p className="text-sm text-gray-400">{userProfile.email}</p>
              </div>
            </div>

            {/* Plan information */}
            <div className="mt-3 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span
                  className={`px-2 py-1 text-xs rounded-full ${getPlanBadgeColor(
                    userProfile.plan
                  )} text-white`}
                >
                  {userProfile.plan} Plan
                </span>
                <Link
                  to="/settings/subscriptions"
                  className="text-xs text-emerald-500 hover:text-emerald-400"
                  onClick={() => setIsOpen(false)}
                >
                  Upgrade
                </Link>
              </div>
              {userProfile.plan === "Free" && (
                <div className="text-xs text-gray-400">
                  {userProfile.analysesRemaining} analyses remaining today
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-3 gap-1 p-2 border-b border-gray-800">
            <Link
              to="/analysis"
              onClick={() => setIsOpen(false)}
              className="flex flex-col items-center p-2 rounded hover:bg-gray-800 transition-colors"
            >
              <LineChart className="w-5 h-5 text-emerald-500 mb-1" />
              <span className="text-xs text-gray-300">Analysis</span>
            </Link>
            <Link
              to="/watchlist"
              onClick={() => setIsOpen(false)}
              className="flex flex-col items-center p-2 rounded hover:bg-gray-800 transition-colors"
            >
              <Star className="w-5 h-5 text-emerald-500 mb-1" />
              <span className="text-xs text-gray-300">Watchlist</span>
            </Link>
            <Link
              to="/portfolio"
              onClick={() => setIsOpen(false)}
              className="flex flex-col items-center p-2 rounded hover:bg-gray-800 transition-colors"
            >
              <Wallet className="w-5 h-5 text-emerald-500 mb-1" />
              <span className="text-xs text-gray-300">Portfolio</span>
            </Link>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <Link
              to="/settings"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-gray-800 transition-colors"
            >
              <Settings className="w-5 h-5 text-gray-400" />
              <span>Settings</span>
            </Link>
            <Link
              to="/notifications"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-gray-800 transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-400" />
              <span>Notifications</span>
              {/* Optional notification counter */}
              <span className="ml-auto bg-emerald-500 text-white text-xs rounded-full px-1.5 py-0.5">
                2
              </span>
            </Link>
            <Link
              to="/history"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-gray-800 transition-colors"
            >
              <History className="w-5 h-5 text-gray-400" />
              <span>Analysis History</span>
            </Link>
            <Link
              to="/saved-reports"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-gray-800 transition-colors"
            >
              <Bookmark className="w-5 h-5 text-gray-400" />
              <span>Saved Reports</span>
            </Link>
            <Link
              to="/preferences"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-gray-800 transition-colors"
            >
              <List className="w-5 h-5 text-gray-400" />
              <span>Preferences</span>
            </Link>
            <Link
              to="/help"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-gray-800 transition-colors"
            >
              <HelpCircle className="w-5 h-5 text-gray-400" />
              <span>Help & Support</span>
            </Link>
            <div className="border-t border-gray-800 mt-2 pt-2">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-gray-800 transition-colors w-full text-left"
              >
                <LogOut className="w-5 h-5 text-gray-400" />
                <span>Log out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileIcon;
