import { motion } from 'framer-motion';
import { X, RefreshCcw, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { 
  Notification, 
  getNotifications, 
  markAllNotificationsAsRead, 
  removeNotification,
  saveNotifications,
  clearAllNotifications
} from '../utils/notificationService';

interface NotificationsProps {
  activeTab: string;
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}

const Notifications = ({ activeTab, notifications, setNotifications }: NotificationsProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load notifications from localStorage when component mounts or becomes active
  useEffect(() => {
    if (activeTab === "notifications") {
      refreshNotifications();
    }
  }, [activeTab]);

  // Function to refresh notifications
  const refreshNotifications = () => {
    setIsRefreshing(true);
    const storedNotifications = getNotifications();
    setNotifications(storedNotifications);
    
    // Simulate loading for better UX
    setTimeout(() => {
      setIsRefreshing(false);
    }, 500);
  };

  // Function to mark all notifications as read
  const markAllAsRead = () => {
    markAllNotificationsAsRead();
    setNotifications(
      notifications.map((notification) => ({ ...notification, read: true }))
    );
  };

  // Function to remove a notification
  const handleRemoveNotification = (id: string) => {
    removeNotification(id);
    setNotifications(
      notifications.filter((notification) => notification.id !== id)
    );
  };

  // Function to clear all notifications
  const handleClearAll = () => {
    clearAllNotifications();
    setNotifications([]);
  };

  return (
    <>
      {activeTab === "notifications" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Notifications</h2>
            <div className="flex gap-4">
              <button 
                onClick={refreshNotifications}
                disabled={isRefreshing}
                className="text-gray-400 hover:text-white flex items-center gap-1">
                <RefreshCcw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>Refresh</span>
              </button>
              <button 
                onClick={markAllAsRead}
                className="text-emerald-400 hover:text-emerald-300">
                Mark all as read
              </button>
              <button 
                onClick={handleClearAll}
                className="text-red-500 hover:text-red-400 flex items-center gap-1">
                <Trash2 className="w-4 h-4" />
                <span>Clear All</span>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="p-4 rounded-lg bg-white/5 flex justify-between"
                >
                  <div>
                    <div className="flex items-center">
                      <div className="font-medium">{notification.title}</div>
                      {!notification.read && (
                        <span className="ml-2 text-xs bg-emerald-500 text-white px-2 py-1 rounded">
                          New
                        </span>
                      )}
                    </div>
                    <div className="text-gray-400 mt-1">
                      {notification.message}
                    </div>
                    <div className="text-xs text-gray-500 mt-2">
                      {notification.date}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveNotification(notification.id)}
                    className="text-gray-500 hover:text-gray-300"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center p-4 text-gray-400">
                No notifications to display
              </div>
            )}
          </div>
        </motion.div>
      )}
    </>
  );
};

export default Notifications;