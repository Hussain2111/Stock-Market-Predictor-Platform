import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface AnalysisHistoryItem {
  id: string;
  ticker: string;
  date: string;
}

interface Notification {
  id: string;
  type: string;
  ticker?: string;
  message: string;
  date: string;
  read: boolean;
}

interface HistoryProps {
  activeTab: string;
}

// Create a helper function to add a stock to analysis history
// This function can be exported and used by other components
export const addToAnalysisHistory = (ticker: string) => {
  try {
    const now = new Date();
    const newNotification: Notification = {
      id: `notification-${Date.now()}`,
      type: 'analysis',
      ticker: ticker,
      message: `Stock analysis completed for ${ticker}`,
      date: now.toLocaleString(),
      read: false
    };
    
    // Get existing notifications or create a new array
    let notifications: Notification[] = [];
    const storedNotifications = localStorage.getItem("notifications");
    
    if (storedNotifications) {
      notifications = JSON.parse(storedNotifications);
    }
    
    // Add the new notification
    notifications.push(newNotification);
    
    // Save back to localStorage
    localStorage.setItem("notifications", JSON.stringify(notifications));
    
    console.log(`Added ${ticker} to analysis history`);
    return true;
  } catch (error) {
    console.error("Error adding to analysis history:", error);
    return false;
  }
};

const History = ({ activeTab }: HistoryProps) => {
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisHistoryItem[]>([]);
  const navigate = useNavigate();

  // Add a function to check for URL parameters that indicate a stock was analyzed
  useEffect(() => {
    const checkForAnalyzedStock = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const analyzedTicker = urlParams.get('ticker');
      
      if (analyzedTicker) {
        // If we find a ticker in the URL, add it to history
        addToAnalysisHistory(analyzedTicker);
      }
    };
    
    // Call once on component mount
    checkForAnalyzedStock();
  }, []);

  useEffect(() => {
    // In a real app, you would fetch notifications from an API
    const fetchNotifications = () => {
      try {
        // Check if we have any stored notifications
        const storedNotifications = localStorage.getItem("notifications");
        
        if (storedNotifications) {
          const notifications: Notification[] = JSON.parse(storedNotifications);
          
          // Filter notifications to only include analysis-related ones with tickers
          const analysisNotifications = notifications.filter(
            notification => 
              notification.type === 'analysis' && 
              notification.ticker !== undefined
          );
          
          // Map notifications to history items
          const historyItems = analysisNotifications.map(notification => ({
            id: notification.id,
            ticker: notification.ticker as string,
            date: notification.date
          }));
          
          setAnalysisHistory(historyItems);
        } else {
          // If no notifications exist yet, create a mock notification system
          createMockNotificationsIfNeeded();
        }
      } catch (error) {
        console.error("Error fetching analysis history from notifications:", error);
        setAnalysisHistory([]);
      }
    };
    
    // Function to create mock notifications if none exist
    const createMockNotificationsIfNeeded = () => {
      // Check if we have any stored tickers from watchlist
      const watchlist = localStorage.getItem("watchlist");
      
      if (watchlist) {
        const tickers = JSON.parse(watchlist);
        
        // Create mock notifications for the tickers
        tickers.forEach((ticker: string) => {
          addToAnalysisHistory(ticker);
        });
        
        // Fetch the newly created notifications
        fetchNotifications();
      }
    };

    if (activeTab === "history") {
      fetchNotifications();
      
      // Set up an interval to check for new notifications periodically
      const intervalId = setInterval(fetchNotifications, 5000);
      
      // Clean up the interval when component unmounts or tab changes
      return () => clearInterval(intervalId);
    }
  }, [activeTab]);

  // Function to navigate to analysis page with the selected ticker
  const goToAnalysis = (ticker: string) => {
    navigate(`/analysis?ticker=${ticker}`);
  };

  return (
    <>
      {activeTab === "history" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Analysis History</h2>
          </div>

          <div className="overflow-x-auto">
            {analysisHistory.length > 0 ? (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-4 px-2">Ticker</th>
                    <th className="text-left py-4 px-2">Date</th>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-8 text-gray-400">
                No analysis history found. Analyze some stocks to see them here.
              </div>
            )}
          </div>
        </motion.div>
      )}
    </>
  );
};

export default History;