// types.ts
export interface Subscription {
    plan: string;
    price: string;
    features: string[];
    current: boolean;
  }
  
  export interface Notification {
    id: string;
    title: string;
    message: string;
    date: string;
    read: boolean;
  }
  
  export interface AnalysisHistory {
    id: string;
    ticker: string;
    date: string;
    prediction: string;
    accuracy: string;
  }
  
  export interface UserProfile {
    name: string;
    email: string;
    phone: string;
    joined: string;
    avatar: string;
  }
  
  export interface Preferences {
    emailAlerts: boolean;
    pushNotifications: boolean;
    smsAlerts: boolean;
    twoFactorAuth: boolean;
    darkMode: boolean;
    autoRefresh: boolean;
    defaultTimeframe: string;
    predictionHorizon: string;
  }
  
  // Initial data
  export const initialSavedTickers: string[] = [
    "AAPL",
    "NVDA",
    "MSFT",
    "GOOGL",
  ];
  
  export const initialNotifications: Notification[] = [
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
  ];
  
  export const initialAnalysisHistory: AnalysisHistory[] = [
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
  ];
  
  export const initialSubscriptions: Subscription[] = [
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
  ];
  
  export const initialUserProfile: UserProfile = {
    name: "Alex Johnson",
    email: "alex@example.com",
    phone: "+1 (555) 123-4567",
    joined: "January 2025",
    avatar: "/api/placeholder/100/100",
  };
  
  export const initialPreferences: Preferences = {
    emailAlerts: true,
    pushNotifications: true,
    smsAlerts: false,
    twoFactorAuth: true,
    darkMode: true,
    autoRefresh: true,
    defaultTimeframe: "3m",
    predictionHorizon: "7d",
  };