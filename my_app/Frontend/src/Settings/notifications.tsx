import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
}

interface NotificationsProps {
  activeTab: string;
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
}

const Notifications = ({ activeTab, notifications, setNotifications }: NotificationsProps) => {
  const markAllAsRead = () => {
    setNotifications(
      notifications.map((notification) => ({ ...notification, read: true }))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(
      notifications.filter((notification) => notification.id !== id)
    );
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
            <button 
              onClick={markAllAsRead}
              className="text-emerald-400 hover:text-emerald-300">
              Mark all as read
            </button>
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
                    onClick={() => removeNotification(notification.id)}
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