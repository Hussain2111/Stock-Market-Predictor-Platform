import { useState, useEffect } from "react";
import logo from "./logo.jpg";
import {
  User,
  Settings,
  Bell,
  CreditCard,
  Shield,
  LineChart,
  Download,
  History,
  Save,
  ArrowLeft,
  ChevronRight,
  LogOut,
  X,
  CheckCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface Subscription {
  plan: string;
  price: string;
  features: string[];
  current: boolean;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
}

interface AnalysisHistory {
  id: string;
  ticker: string;
  date: string;
  prediction: string;
  accuracy: string;
}

const Account = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [savedTickers, setSavedTickers] = useState<string[]>([
    "AAPL",
    "NVDA",
    "MSFT",
    "GOOGL",
  ]);
  const [notifications, setNotifications] = useState<Notification[]>([
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

  const [analysisHistory, setAnalysisHistory] = useState<AnalysisHistory[]>([
    {
      id: "1",
      ticker: "AAPL",
      date: "Mar 12, 2025",
      prediction: "+2.4%",
      accuracy: "84%",
    },
    {
      id: "2",
      ticker: "NVDA",
      date: "Mar 10, 2025",
      prediction: "+5.1%",
      accuracy: "79%",
    },
    {
      id: "3",
      ticker: "MSFT",
      date: "Mar 8, 2025",
      prediction: "-0.8%",
      accuracy: "82%",
    },
    {
      id: "4",
      ticker: "META",
      date: "Mar 5, 2025",
      prediction: "+3.2%",
      accuracy: "76%",
    },
  ]);

  const [subscriptions, setSubscriptions] = useState<Subscription[]>([
    {
      plan: "Free",
      price: "$0/month",
      features: [
        "3 analyses per day",
        "Basic prediction models",
        "24-hour data updates",
      ],
      current: true,
    },
    {
      plan: "Trader",
      price: "$29/month",
      features: [
        "25 analyses per day",
        "Advanced LSTM models",
        "Real-time data updates",
        "Portfolio tracking",
        "Email alerts",
      ],
      current: false,
    },
    {
      plan: "Professional",
      price: "$99/month",
      features: [
        "Unlimited analyses",
        "All prediction models",
        "Real-time data + sentiment",
        "API access",
        "Custom alerts",
        "Technical indicators",
        "Priority support",
      ],
      current: false,
    },
  ]);

  const [userProfile, setUserProfile] = useState({
    name: "Alex Johnson",
    email: "alex@example.com",
    phone: "+1 (555) 123-4567",
    joined: "January 2025",
    avatar: "/api/placeholder/100/100",
  });

  const [preferences, setPreferences] = useState({
    emailAlerts: true,
    pushNotifications: true,
    smsAlerts: false,
    twoFactorAuth: true,
    darkMode: true,
    autoRefresh: true,
    defaultTimeframe: "3m",
    predictionHorizon: "7d",
  });

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({ ...notification, read: true }))
    );
  };

  const removeTicker = (ticker: string) => {
    setSavedTickers(savedTickers.filter((t) => t !== ticker));
  };

  const removeNotification = (id: string) => {
    setNotifications(
      notifications.filter((notification) => notification.id !== id)
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#111827] text-white">
      {/* Header */}
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
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
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

          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="bg-white/5 rounded-xl p-6">
              {/* Profile */}
              {activeTab === "profile" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-bold mb-6">
                    Profile Information
                  </h2>
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="md:w-1/3">
                        <img
                          src={userProfile.avatar}
                          alt="Profile"
                          className="w-32 h-32 rounded-full border-2 border-emerald-500"
                        />
                      </div>
                      <div className="md:w-2/3">
                        <button className="px-4 py-2 border border-emerald-500 text-emerald-500 rounded-lg hover:bg-emerald-500 hover:text-white transition-colors">
                          Upload New Photo
                        </button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-400 mb-2">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={userProfile.name}
                          onChange={(e) =>
                            setUserProfile({
                              ...userProfile,
                              name: e.target.value,
                            })
                          }
                          className="w-full p-3 rounded-lg bg-black/20 border border-gray-700 focus:border-emerald-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={userProfile.email}
                          onChange={(e) =>
                            setUserProfile({
                              ...userProfile,
                              email: e.target.value,
                            })
                          }
                          className="w-full p-3 rounded-lg bg-black/20 border border-gray-700 focus:border-emerald-500 outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={userProfile.phone}
                          onChange={(e) =>
                            setUserProfile({
                              ...userProfile,
                              phone: e.target.value,
                            })
                          }
                          className="w-full p-3 rounded-lg bg-black/20 border border-gray-700 focus:border-emerald-500 outline-none"
                        />
                      </div>
                    </div>

                    <div className="border-t border-gray-700 pt-6">
                      <h3 className="font-semibold mb-4">Change Password</h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-gray-400 mb-2">
                            Current Password
                          </label>
                          <input
                            type="password"
                            placeholder="••••••••••"
                            className="w-full p-3 rounded-lg bg-black/20 border border-gray-700 focus:border-emerald-500 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-gray-400 mb-2">
                            New Password
                          </label>
                          <input
                            type="password"
                            placeholder="••••••••••"
                            className="w-full p-3 rounded-lg bg-black/20 border border-gray-700 focus:border-emerald-500 outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button className="px-6 py-2 bg-emerald-500 rounded-lg font-medium hover:bg-emerald-600 transition-colors">
                        Save Changes
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Subscriptions */}
              {activeTab === "subscriptions" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-bold mb-6">
                    Subscription Plans
                  </h2>
                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                    {subscriptions.map((sub, i) => (
                      <div
                        key={i}
                        className={`rounded-xl p-6 transition-all ${
                          sub.current
                            ? "border-2 border-emerald-500 bg-emerald-500/10"
                            : "border border-gray-700 hover:border-emerald-500/50 bg-white/5"
                        }`}
                      >
                        <h3 className="text-xl font-bold mb-2">{sub.plan}</h3>
                        <div className="text-2xl font-bold mb-4 text-emerald-400">
                          {sub.price}
                        </div>
                        <ul className="space-y-2 mb-6">
                          {sub.features.map((feature, j) => (
                            <li key={j} className="flex items-start">
                              <CheckCircle className="w-5 h-5 text-emerald-400 mr-2 flex-shrink-0 mt-0.5" />
                              <span className="text-gray-300">{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <button
                          className={`w-full py-2 rounded-lg font-medium transition-colors ${
                            sub.current
                              ? "bg-gray-700 text-gray-300 cursor-default"
                              : "bg-emerald-500 hover:bg-emerald-600"
                          }`}
                          disabled={sub.current}
                        >
                          {sub.current ? "Current Plan" : "Upgrade"}
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white/5 rounded-xl p-6">
                    <h3 className="font-semibold mb-4">Billing Information</h3>
                    <div className="flex justify-between items-center p-4 border border-gray-700 rounded-lg mb-4">
                      <div className="flex items-center">
                        <div className="bg-white/20 p-2 rounded mr-4">
                          <CreditCard className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="font-medium">Visa ending in 4242</div>
                          <div className="text-sm text-gray-400">
                            Expires 09/26
                          </div>
                        </div>
                      </div>
                      <button className="text-emerald-400 hover:text-emerald-300">
                        Edit
                      </button>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                      <button className="text-gray-400 hover:text-white">
                        + Add Payment Method
                      </button>
                      <button className="text-emerald-400 hover:text-emerald-300">
                        View Billing History
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Notifications */}
              {activeTab === "notifications" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Notifications</h2>
                    <button
                      onClick={markAllAsRead}
                      className="text-emerald-400 hover:text-emerald-300"
                    >
                      Mark all as read
                    </button>
                  </div>

                  <div className="space-y-4 mb-8">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 rounded-lg flex justify-between items-start ${
                            notification.read
                              ? "bg-white/5"
                              : "bg-emerald-500/10 border border-emerald-500/20"
                          }`}
                        >
                          <div>
                            <div className="font-semibold mb-1">
                              {notification.title}
                              {!notification.read && (
                                <span className="ml-2 bg-emerald-500 text-white text-xs py-0.5 px-2 rounded-full">
                                  New
                                </span>
                              )}
                            </div>
                            <p className="text-gray-400 mb-2">
                              {notification.message}
                            </p>
                            <div className="text-xs text-gray-500">
                              {notification.date}
                            </div>
                          </div>
                          <button
                            onClick={() => removeNotification(notification.id)}
                            className="text-gray-500 hover:text-gray-300"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-400">
                        No notifications to display
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Analysis History */}
              {activeTab === "history" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Analysis History</h2>
                    <button className="flex items-center text-emerald-400 hover:text-emerald-300">
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="text-left py-4 px-2">Ticker</th>
                          <th className="text-left py-4 px-2">Date</th>
                          <th className="text-left py-4 px-2">Prediction</th>
                          <th className="text-left py-4 px-2">Accuracy</th>
                          <th className="text-right py-4 px-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {analysisHistory.map((item) => (
                          <tr
                            key={item.id}
                            className="border-b border-gray-800 hover:bg-white/5"
                          >
                            <td className="py-4 px-2 font-medium">
                              {item.ticker}
                            </td>
                            <td className="py-4 px-2 text-gray-400">
                              {item.date}
                            </td>
                            <td
                              className={`py-4 px-2 ${
                                item.prediction.startsWith("+")
                                  ? "text-green-500"
                                  : "text-red-500"
                              }`}
                            >
                              {item.prediction}
                            </td>
                            <td className="py-4 px-2">{item.accuracy}</td>
                            <td className="py-4 px-2 text-right">
                              <button className="text-emerald-400 hover:text-emerald-300">
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {/* Watchlist */}
              {activeTab === "watchlist" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Watchlist</h2>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Add ticker..."
                        className="px-4 py-2 rounded-lg bg-black/20 border border-gray-700 focus:border-emerald-500 outline-none"
                      />
                      <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-emerald-400">
                        <Save className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {savedTickers.map((ticker) => (
                      <div
                        key={ticker}
                        className="flex justify-between items-center p-4 rounded-lg bg-white/5 hover:bg-white/10"
                      >
                        <div className="font-medium">{ticker}</div>
                        <div className="flex space-x-2">
                          <button className="px-3 py-1 text-sm rounded bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30">
                            Analyze
                          </button>
                          <button
                            onClick={() => removeTicker(ticker)}
                            className="text-gray-500 hover:text-gray-300"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Preferences */}
              {activeTab === "preferences" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-bold mb-6">Preferences</h2>

                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-4">Notifications</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">Email Alerts</div>
                            <div className="text-sm text-gray-400">
                              Receive important updates via email
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={preferences.emailAlerts}
                              onChange={() =>
                                setPreferences({
                                  ...preferences,
                                  emailAlerts: !preferences.emailAlerts,
                                })
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-emerald-500"></div>
                            <div className="absolute w-4 h-4 bg-white rounded-full left-1 top-1 peer-checked:left-6 transition-all"></div>
                          </label>
                        </div>

                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">
                              Push Notifications
                            </div>
                            <div className="text-sm text-gray-400">
                              Receive alerts in your browser
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={preferences.pushNotifications}
                              onChange={() =>
                                setPreferences({
                                  ...preferences,
                                  pushNotifications:
                                    !preferences.pushNotifications,
                                })
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-emerald-500"></div>
                            <div className="absolute w-4 h-4 bg-white rounded-full left-1 top-1 peer-checked:left-6 transition-all"></div>
                          </label>
                        </div>

                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">SMS Alerts</div>
                            <div className="text-sm text-gray-400">
                              Receive text messages for urgent updates
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={preferences.smsAlerts}
                              onChange={() =>
                                setPreferences({
                                  ...preferences,
                                  smsAlerts: !preferences.smsAlerts,
                                })
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-emerald-500"></div>
                            <div className="absolute w-4 h-4 bg-white rounded-full left-1 top-1 peer-checked:left-6 transition-all"></div>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-700 pt-6">
                      <h3 className="font-semibold mb-4">Display Settings</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">Dark Mode</div>
                            <div className="text-sm text-gray-400">
                              Use dark theme for interface
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={preferences.darkMode}
                              onChange={() =>
                                setPreferences({
                                  ...preferences,
                                  darkMode: !preferences.darkMode,
                                })
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-emerald-500"></div>
                            <div className="absolute w-4 h-4 bg-white rounded-full left-1 top-1 peer-checked:left-6 transition-all"></div>
                          </label>
                        </div>

                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">Auto Refresh</div>
                            <div className="text-sm text-gray-400">
                              Automatically refresh data every 5 minutes
                            </div>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={preferences.autoRefresh}
                              onChange={() =>
                                setPreferences({
                                  ...preferences,
                                  autoRefresh: !preferences.autoRefresh,
                                })
                              }
                              className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-emerald-500"></div>
                            <div className="absolute w-4 h-4 bg-white rounded-full left-1 top-1 peer-checked:left-6 transition-all"></div>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-700 pt-6">
                      <h3 className="font-semibold mb-4">Analysis Settings</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-gray-400 mb-2">
                            Default Timeframe
                          </label>
                          <select
                            value={preferences.defaultTimeframe}
                            onChange={(e) =>
                              setPreferences({
                                ...preferences,
                                defaultTimeframe: e.target.value,
                              })
                            }
                            className="w-full p-3 rounded-lg bg-black/20 border border-gray-700 focus:border-emerald-500 outline-none"
                          >
                            <option value="1m">1 Month</option>
                            <option value="3m">3 Months</option>
                            <option value="6m">6 Months</option>
                            <option value="1y">1 Year</option>
                            <option value="5y">5 Years</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-gray-400 mb-2">
                            Prediction Horizon
                          </label>
                          <select
                            value={preferences.predictionHorizon}
                            onChange={(e) =>
                              setPreferences({
                                ...preferences,
                                predictionHorizon: e.target.value,
                              })
                            }
                            className="w-full p-3 rounded-lg bg-black/20 border border-gray-700 focus:border-emerald-500 outline-none"
                          >
                            <option value="1d">1 Day</option>
                            <option value="3d">3 Days</option>
                            <option value="7d">1 Week</option>
                            <option value="14d">2 Weeks</option>
                            <option value="30d">1 Month</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button className="px-6 py-2 bg-emerald-500 rounded-lg font-medium hover:bg-emerald-600 transition-colors">
                        Save Preferences
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Security */}
              {activeTab === "security" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className="text-2xl font-bold mb-6">Security Settings</h2>

                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">
                          Two-Factor Authentication
                        </div>
                        <div className="text-sm text-gray-400">
                          Add an extra layer of security to your account
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={preferences.twoFactorAuth}
                          onChange={() =>
                            setPreferences({
                              ...preferences,
                              twoFactorAuth: !preferences.twoFactorAuth,
                            })
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-700 rounded-full peer peer-checked:bg-emerald-500"></div>
                        <div className="absolute w-4 h-4 bg-white rounded-full left-1 top-1 peer-checked:left-6 transition-all"></div>
                      </label>
                    </div>

                    <div className="border-t border-gray-700 pt-6">
                      <h3 className="font-semibold mb-4">Login Sessions</h3>
                      <div className="space-y-4">
                        <div className="p-4 rounded-lg bg-white/5 flex justify-between items-center">
                          <div>
                            <div className="font-medium">Current Session</div>
                            <div className="text-sm text-gray-400">
                              Chrome on MacOS • IP: 192.168.1.1
                            </div>
                            <div className="text-xs text-emerald-400 mt-1">
                              Active Now
                            </div>
                          </div>
                          <div>
                            <button className="text-gray-400 hover:text-gray-300">
                              This is you
                            </button>
                          </div>
                        </div>

                        <div className="p-4 rounded-lg bg-white/5 flex justify-between items-center">
                          <div>
                            <div className="font-medium">Previous Session</div>
                            <div className="text-sm text-gray-400">
                              Safari on iOS • IP: 192.168.1.2
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              2 days ago
                            </div>
                          </div>
                          <div>
                            <button className="text-red-400 hover:text-red-300">
                              Revoke
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-700 pt-6">
                      <h3 className="font-semibold mb-4">API Keys</h3>
                      <div className="space-y-4">
                        <div className="p-4 rounded-lg bg-white/5 flex justify-between items-center">
                          <div>
                            <div className="font-medium">Personal API Key</div>
                            <div className="text-sm text-gray-400">
                              Created on Mar 5, 2025
                            </div>
                            <div className="text-xs text-emerald-400 mt-1">
                              Active
                            </div>
                          </div>
                          <div>
                            <button className="text-red-400 hover:text-red-300 mr-4">
                              Revoke
                            </button>
                            <button className="text-emerald-400 hover:text-emerald-300">
                              View
                            </button>
                          </div>
                        </div>
                      </div>

                      <button className="mt-4 text-emerald-400 hover:text-emerald-300">
                        + Generate New API Key
                      </button>
                    </div>

                    <div className="border-t border-gray-700 pt-6">
                      <h3 className="font-semibold mb-4 text-red-400">
                        Danger Zone
                      </h3>
                      <button className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors">
                        Delete Account
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
