// Define the Notification interface
export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
}

// Get notifications from localStorage
export const getNotifications = (): Notification[] => {
  const storedNotifications = localStorage.getItem('notifications');
  return storedNotifications ? JSON.parse(storedNotifications) : [];
};

// Save notifications to localStorage
export const saveNotifications = (notifications: Notification[]): void => {
  localStorage.setItem('notifications', JSON.stringify(notifications));
};

// Add a new notification
export const addNotification = (title: string, message: string): void => {
  const notifications = getNotifications();
  
  // Create a new notification
  const newNotification: Notification = {
    id: Date.now().toString(), // Use timestamp as ID
    title,
    message,
    date: formatDate(new Date()),
    read: false
  };
  
  // Add new notification at the beginning of the array
  notifications.unshift(newNotification);
  
  // Store in localStorage
  saveNotifications(notifications);
};

// Add a stock analysis notification
export const addAnalysisNotification = (ticker: string): void => {
  addNotification(
    "Stock Analysis Completed",
    `Analysis for ${ticker} stock has been completed.`
  );
};

// Format date as "Xh ago", "Yesterday", or "X days ago"
const formatDate = (date: Date): string => {
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) {
    return 'Just now';
  } else if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else if (diffInHours < 48) {
    return 'Yesterday';
  } else {
    const days = Math.floor(diffInHours / 24);
    return `${days} days ago`;
  }
};

// Mark a notification as read
export const markNotificationAsRead = (id: string): void => {
  const notifications = getNotifications();
  const updatedNotifications = notifications.map(notification => 
    notification.id === id ? { ...notification, read: true } : notification
  );
  
  saveNotifications(updatedNotifications);
};

// Mark all notifications as read
export const markAllNotificationsAsRead = (): void => {
  const notifications = getNotifications();
  const updatedNotifications = notifications.map(notification => ({ ...notification, read: true }));
  
  saveNotifications(updatedNotifications);
};

// Remove a notification
export const removeNotification = (id: string): void => {
  const notifications = getNotifications();
  const filteredNotifications = notifications.filter(notification => notification.id !== id);
  
  saveNotifications(filteredNotifications);
};

// Clear all notifications
export const clearAllNotifications = (): void => {
  saveNotifications([]);
}; 