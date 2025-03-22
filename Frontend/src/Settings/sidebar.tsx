import { useState} from "react";
import {
  User,
  Bell,
  CreditCard,
  Shield,
  History,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { Link } from "react-router-dom";
import defaultAvatar from "./defaultpic.jpg";
import { authService } from "../authService";

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
        name: "User",
        email: "",
        joined: "2023",
        avatar: defaultAvatar,
      });

      // Try to get user's email and name
      const userEmail = authService.getUserEmail();
      
      // Extract username from email if available
      if (userEmail) {
        const atIndex = userEmail.indexOf('@');
        if (atIndex !== -1) {
          // Extract username part of email
          const username = userEmail.substring(0, atIndex);
          // Capitalize first letter
          userProfile.name = username.charAt(0).toUpperCase() + username.slice(1);
          userProfile.email = userEmail;
        }
      }

    return (
        <div className="lg:w-1/4">
            <div className="bg-white/5 rounded-xl p-6">
              <div className="flex items-center space-x-4 mb-8">
                <img
                  src={userProfile.avatar}
                  alt="Profile"
                  className="w-16 h-16 rounded-full border-2 border-emerald-500 object-cover"
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
                    <div className="flex items-center">
                      Notifications
                      {notifications.some((n) => !n.read) && (
                        <span className="ml-2 w-2 h-2 rounded-full bg-red-500"></span>
                      )}
                    </div>
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
                    History
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

                <Link
                  to="/"
                  className="mt-6 w-full flex items-center text-red-500 hover:text-red-400 p-3"
                >
                  <LogOut className="w-5 h-5 mr-3" />
                  Logout
                </Link>
              </nav>
            </div>
          </div>
    );
};

export default Sidebar;