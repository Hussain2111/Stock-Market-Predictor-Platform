import { useState, useEffect } from "react";
import Sidebar from "./sidebar";
import Profile from "./Profile";
import Subscriptions from "./Subscriptions";
import Notifications from "./notifications";
import History from "./history";
import Security from "./security";
import Header from "../components/Header";
import {AnimatePresence} from "framer-motion";
import AuthModal from "../components/AuthModal";
import { Notification, getNotifications } from "../utils/notificationService";
import defaultAvatar from "./defaultpic.jpg";

interface Subscription {
  plan: string;
  price: string;
  features: string[];
  current: boolean;
}

interface AnalysisHistory {
  id: string;
  ticker: string;
  date: string;
  prediction: string;
  accuracy: string;
}

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [savedTickers, setSavedTickers] = useState<string[]>([
    "AAPL",
    "NVDA",
    "MSFT",
    "GOOGL",
  ]);
  // Now fetching notifications from our notification service
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // Load notifications from localStorage when component mounts
  useEffect(() => {
    const storedNotifications = getNotifications();
    if (storedNotifications.length === 0) {
      // If no notifications exist yet, add some default ones
      setNotifications([
        {
          id: "1",
          title: "Welcome to Stock Analyzer",
          message: "Start analyzing stocks to see your analysis history here.",
          date: "Just now",
          read: false,
        }
      ]);
    } else {
      setNotifications(storedNotifications);
    }
  }, []);

  const [analysisHistory] = useState<AnalysisHistory[]>([
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
    name: "User",
    email: "",
    joined: "2023",
    avatar: defaultAvatar,
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

  const [showAuthModal] = useState(false);

  

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] to-[#111827] text-white">
      {/* Header */}
      <AnimatePresence>{showAuthModal && <AuthModal onClose={() => console.log("AuthModal closed")} />}</AnimatePresence>
      <Header />
      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />
          {/* Main Content */}
          <div className="lg:w-3/4">
            <div className="bg-white/5 rounded-xl p-6">
              {/* Profile */}
              {activeTab === "profile" && (
                <Profile 
                  activeTab={activeTab}
                  userProfile={userProfile}
                  setUserProfile={setUserProfile}
                />
              )}
              {/* Subscriptions */}
              {activeTab === "subscriptions" && (
                <Subscriptions
                  activeTab={activeTab}
                  subscription={subscriptions}
                  setSubscription={setSubscriptions}
                />
              )}

              {/* Notifications */}
              {activeTab === "notifications" && (
                <Notifications
                  activeTab={activeTab}
                  notifications={notifications}
                  setNotifications={setNotifications}
                />
              )}
              {/* Analysis History */}
              {activeTab === "history" && (
                <History
                  activeTab={activeTab}
                  analysisHistory={analysisHistory}
                />
              )}
              {/* Security */}
              {activeTab === "security" && (
                <Security
                  activeTab={activeTab}
                  preferences={preferences}
                  setPreferences={setPreferences}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
