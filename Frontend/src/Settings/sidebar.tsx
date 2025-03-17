import { useState} from "react";
import {
  User,
  Settings,
  Bell,
  CreditCard,
  Shield,
  LineChart,
  History,
  ChevronRight,
  LogOut,
} from "lucide-react";

import { Link } from "react-router-dom";

interface Notification {
    id: string;
    title: string;
    message: string;
    date: string;
    read: boolean;
  }


  interface SidebarProps {
    activeTab: string;
    setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  }

const Sidebar = ({ activeTab, setActiveTab }: SidebarProps) => {
    

    //const [activeTab, setActiveTab] = useState("profile");
    const [notifications] = useState<Notification[]>([
        {
          id: "1",
          title: "Analysis Complete",
          message: "Your NVDA stock prediction analysis is ready to view.",
          date: "2h ago",
          read: false,
        },
        {
          id: "2",
          title: "Market Alert",
          message: "Unusual trading volume detected for AAPL.",
          date: "Yesterday",
          read: true,
        },
        {
          id: "3",
          title: "Account Updated",
          message: "Your account settings have been successfully updated.",
          date: "3 days ago",
          read: true,
        },
      ]);

      const [userProfile] = useState({
        name: "Alex Johnson",
        email: "alex@example.com",
        phone: "+1 (555) 123-4567",
        joined: "January 2025",
        avatar: "/api/placeholder/100/100",
      });
    

    return (
        <div className="lg:w-1/4">
            <div className="bg-white/5 rounded-xl p-6">
              <div className="flex items-center space-x-4 mb-8">
                <img
                  src={userProfile.avatar}
                  alt="Profile"
                  className="w-16 h-16 rounded-full border-2 border-emerald-500"
                />
                <div>
                  <div className="font-bold text-lg">{userProfile.name}</div>
                  <div className="text-gray-400 text-sm">
                    Member since {userProfile.joined}
                  </div>
                </div>
              </div>

              <nav className="space-y-1">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                    activeTab === "profile"
                      ? "bg-emerald-500 text-white"
                      : "hover:bg-white/10"
                  }`}
                >
                  <span className="flex items-center">
                    <User className="w-5 h-5 mr-3" />
                    Profile
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setActiveTab("subscriptions")}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                    activeTab === "subscriptions"
                      ? "bg-emerald-500 text-white"
                      : "hover:bg-white/10"
                  }`}
                >
                  <span className="flex items-center">
                    <CreditCard className="w-5 h-5 mr-3" />
                    Subscription
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setActiveTab("notifications")}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                    activeTab === "notifications"
                      ? "bg-emerald-500 text-white"
                      : "hover:bg-white/10"
                  }`}
                >
                  <span className="flex items-center">
                    <Bell className="w-5 h-5 mr-3" />
                    Notifications
                    {notifications.some((n) => !n.read) && (
                      <span className="ml-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {notifications.filter((n) => !n.read).length}
                      </span>
                    )}
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setActiveTab("history")}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                    activeTab === "history"
                      ? "bg-emerald-500 text-white"
                      : "hover:bg-white/10"
                  }`}
                >
                  <span className="flex items-center">
                    <History className="w-5 h-5 mr-3" />
                    Analysis History
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setActiveTab("watchlist")}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                    activeTab === "watchlist"
                      ? "bg-emerald-500 text-white"
                      : "hover:bg-white/10"
                  }`}
                >
                  <span className="flex items-center">
                    <LineChart className="w-5 h-5 mr-3" />
                    Watchlist
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setActiveTab("preferences")}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                    activeTab === "preferences"
                      ? "bg-emerald-500 text-white"
                      : "hover:bg-white/10"
                  }`}
                >
                  <span className="flex items-center">
                    <Settings className="w-5 h-5 mr-3" />
                    Preferences
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setActiveTab("security")}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                    activeTab === "security"
                      ? "bg-emerald-500 text-white"
                      : "hover:bg-white/10"
                  }`}
                >
                  <span className="flex items-center">
                    <Shield className="w-5 h-5 mr-3" />
                    Security
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                <div className="pt-4 mt-4 border-t border-gray-700">
                  <Link to="/" className="mr-10">
                    <button className="w-full flex items-center text-red-400 hover:text-red-300 p-3 rounded-lg hover:bg-white/10 transition-colors">
                      <LogOut className="w-5 h-5 mr-3" />
                      Logout
                    </button>
                  </Link>
                </div>
              </nav>
            </div>
          </div>
    )
}

export default Sidebar;