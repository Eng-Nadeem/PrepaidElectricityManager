import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import * as Notifications from 'expo-notifications';
import {
  Notification,
  NotificationSetting,
  NotificationType,
  getNotifications,
  getNotificationSettings,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  clearAllNotifications,
  updateNotificationSetting,
  initializeNotifications,
  checkAndCreateNotifications,
  simulateRemoteNotification
} from '../services/notificationService';
import { useApi } from './ApiContext';

// Context type definition
interface NotificationContextType {
  // Data
  notifications: Notification[];
  unreadCount: number;
  notificationSettings: NotificationSetting[];
  permissionStatus: boolean;
  
  // Loading states
  isLoading: boolean;
  
  // Actions
  refreshNotifications: () => Promise<void>;
  refreshSettings: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  clearAll: () => Promise<void>;
  updateSetting: (type: NotificationType, updates: Partial<NotificationSetting>) => Promise<void>;
  checkConditionsAndNotify: () => Promise<void>;
  simulateNotification: (type: NotificationType, title?: string, body?: string) => Promise<void>;
}

// Create context with default values
const NotificationContext = createContext<NotificationContextType>({
  // Default data
  notifications: [],
  unreadCount: 0,
  notificationSettings: [],
  permissionStatus: false,
  
  // Default loading state
  isLoading: false,
  
  // Default actions (empty functions)
  refreshNotifications: async () => {},
  refreshSettings: async () => {},
  markAsRead: async () => {},
  markAllAsRead: async () => {},
  deleteNotification: async () => {},
  clearAll: async () => {},
  updateSetting: async () => {},
  checkConditionsAndNotify: async () => {},
  simulateNotification: async () => {},
});

// Provider props
interface NotificationProviderProps {
  children: ReactNode;
}

// Provider component
export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const { walletBalance, debts, meters } = useApi();
  
  // States
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSetting[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [permissionStatus, setPermissionStatus] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Initialize notifications system
  useEffect(() => {
    const initialize = async () => {
      const hasPermission = await initializeNotifications();
      setPermissionStatus(hasPermission);
      await refreshNotifications();
      await refreshSettings();
      setIsLoading(false);
    };
    
    initialize();
    
    // Set up app state change listener to refresh notifications when app comes to foreground
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    // Set up notification received listener
    const notificationReceivedSubscription = Notifications.addNotificationReceivedListener(
      handleNotificationReceived
    );
    
    return () => {
      subscription.remove();
      notificationReceivedSubscription.remove();
    };
  }, []);
  
  // App state change handler
  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    if (nextAppState === 'active') {
      await refreshNotifications();
      await checkConditionsAndNotify();
    }
  };
  
  // Notification received handler
  const handleNotificationReceived = async () => {
    await refreshNotifications();
  };
  
  // Count unread notifications
  useEffect(() => {
    const count = notifications.filter(notification => !notification.read).length;
    setUnreadCount(count);
  }, [notifications]);
  
  // Actions
  const refreshNotifications = async () => {
    try {
      const fetchedNotifications = await getNotifications();
      setNotifications(fetchedNotifications);
    } catch (error) {
      console.error('Error refreshing notifications:', error);
    }
  };
  
  const refreshSettings = async () => {
    try {
      const settings = await getNotificationSettings();
      setNotificationSettings(settings);
    } catch (error) {
      console.error('Error refreshing notification settings:', error);
    }
  };
  
  const markAsRead = async (id: string) => {
    try {
      await markNotificationAsRead(id);
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };
  
  const markAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications(prev => 
        prev.map(n => ({ ...n, read: true }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };
  
  const removeNotification = async (id: string) => {
    try {
      await deleteNotification(id);
      setNotifications(prev => 
        prev.filter(n => n.id !== id)
      );
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };
  
  const clearAll = async () => {
    try {
      await clearAllNotifications();
      setNotifications([]);
    } catch (error) {
      console.error('Error clearing all notifications:', error);
    }
  };
  
  const updateSetting = async (type: NotificationType, updates: Partial<NotificationSetting>) => {
    try {
      await updateNotificationSetting(type, updates);
      
      // Update local state
      setNotificationSettings(prev => 
        prev.map(setting => 
          setting.type === type ? { ...setting, ...updates } : setting
        )
      );
    } catch (error) {
      console.error('Error updating notification setting:', error);
    }
  };
  
  const checkConditionsAndNotify = async () => {
    try {
      await checkAndCreateNotifications(walletBalance, debts, meters);
      await refreshNotifications();
    } catch (error) {
      console.error('Error checking conditions and notifying:', error);
    }
  };
  
  const simulateNotification = async (type: NotificationType, title?: string, body?: string) => {
    try {
      await simulateRemoteNotification(type, title, body);
      await refreshNotifications();
    } catch (error) {
      console.error('Error simulating notification:', error);
    }
  };
  
  // Context value
  const value: NotificationContextType = {
    notifications,
    unreadCount,
    notificationSettings,
    permissionStatus,
    isLoading,
    refreshNotifications,
    refreshSettings,
    markAsRead,
    markAllAsRead,
    deleteNotification: removeNotification,
    clearAll,
    updateSetting,
    checkConditionsAndNotify,
    simulateNotification,
  };
  
  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook to use the notification context
export const useNotifications = () => useContext(NotificationContext);

export default NotificationContext;