import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Notification types
export type NotificationType = 
  | 'payment_reminder' 
  | 'low_balance' 
  | 'meter_recharge' 
  | 'debt_due' 
  | 'price_update'
  | 'service_outage'
  | 'consumption_alert';

// Notification settings interface
export interface NotificationSetting {
  type: NotificationType;
  enabled: boolean;
  threshold?: number; // For low balance, consumption alerts, etc.
  timing?: number; // Days before for reminders
  description: string;
  title: string;
}

// Notification interface
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: any;
  read: boolean;
  createdAt: string;
}

// Default notification settings
export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSetting[] = [
  {
    type: 'payment_reminder',
    enabled: true,
    timing: 3, // 3 days before due
    description: 'Get reminders before your bills are due',
    title: 'Payment Reminders'
  },
  {
    type: 'low_balance',
    enabled: true,
    threshold: 10, // $10 threshold
    description: 'Get notified when your wallet balance is low',
    title: 'Low Balance Alerts'
  },
  {
    type: 'meter_recharge',
    enabled: true,
    description: 'Notifications for meter recharge success and failure',
    title: 'Meter Recharge Alerts'
  },
  {
    type: 'debt_due',
    enabled: true,
    timing: 2, // 2 days before due
    description: 'Get notified when debts are close to due date',
    title: 'Debt Due Alerts'
  },
  {
    type: 'price_update',
    enabled: true,
    description: 'Get notified about electricity price updates',
    title: 'Price Updates'
  },
  {
    type: 'service_outage',
    enabled: true,
    description: 'Notifications about planned and unplanned service outages',
    title: 'Service Outage Alerts'
  },
  {
    type: 'consumption_alert',
    enabled: true,
    threshold: 20, // 20% increase
    description: 'Alerts when your consumption patterns change significantly',
    title: 'Consumption Pattern Alerts'
  }
];

// Storage keys
const NOTIFICATION_SETTINGS_KEY = 'notification_settings';
const NOTIFICATIONS_STORAGE_KEY = 'notifications';

// Initialize the notification system
export async function initializeNotifications() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#3b82f6',
    });
  }

  // Request permissions
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  // Initialize settings if they don't exist
  const settings = await getNotificationSettings();
  if (!settings || settings.length === 0) {
    await saveNotificationSettings(DEFAULT_NOTIFICATION_SETTINGS);
  }

  return finalStatus === 'granted';
}

// Get notification settings
export async function getNotificationSettings(): Promise<NotificationSetting[]> {
  try {
    const settingsJson = await AsyncStorage.getItem(NOTIFICATION_SETTINGS_KEY);
    if (settingsJson) {
      return JSON.parse(settingsJson);
    }
    return DEFAULT_NOTIFICATION_SETTINGS;
  } catch (error) {
    console.error('Error getting notification settings:', error);
    return DEFAULT_NOTIFICATION_SETTINGS;
  }
}

// Save notification settings
export async function saveNotificationSettings(settings: NotificationSetting[]): Promise<void> {
  try {
    await AsyncStorage.setItem(NOTIFICATION_SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving notification settings:', error);
  }
}

// Update a specific notification setting
export async function updateNotificationSetting(
  type: NotificationType, 
  updates: Partial<NotificationSetting>
): Promise<void> {
  const settings = await getNotificationSettings();
  const updatedSettings = settings.map(setting => 
    setting.type === type ? { ...setting, ...updates } : setting
  );
  await saveNotificationSettings(updatedSettings);
}

// Get notifications from storage
export async function getNotifications(): Promise<Notification[]> {
  try {
    const notificationsJson = await AsyncStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    if (notificationsJson) {
      return JSON.parse(notificationsJson);
    }
    return [];
  } catch (error) {
    console.error('Error getting notifications:', error);
    return [];
  }
}

// Save notifications to storage
export async function saveNotifications(notifications: Notification[]): Promise<void> {
  try {
    await AsyncStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
  } catch (error) {
    console.error('Error saving notifications:', error);
  }
}

// Add a new notification
export async function addNotification(notification: Omit<Notification, 'id' | 'createdAt' | 'read'>): Promise<void> {
  const notifications = await getNotifications();
  
  const newNotification: Notification = {
    ...notification,
    id: Math.random().toString(36).substring(2, 15),
    createdAt: new Date().toISOString(),
    read: false,
  };
  
  await saveNotifications([newNotification, ...notifications]);
  
  // Also trigger a push notification if enabled for this type
  const settings = await getNotificationSettings();
  const notificationSetting = settings.find(s => s.type === notification.type);
  
  if (notificationSetting?.enabled) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: notification.title,
        body: notification.body,
        data: notification.data || {},
      },
      trigger: null, // Immediately
    });
  }
}

// Mark a notification as read
export async function markNotificationAsRead(id: string): Promise<void> {
  const notifications = await getNotifications();
  const updatedNotifications = notifications.map(n => 
    n.id === id ? { ...n, read: true } : n
  );
  await saveNotifications(updatedNotifications);
}

// Mark all notifications as read
export async function markAllNotificationsAsRead(): Promise<void> {
  const notifications = await getNotifications();
  const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
  await saveNotifications(updatedNotifications);
}

// Delete a notification
export async function deleteNotification(id: string): Promise<void> {
  const notifications = await getNotifications();
  const updatedNotifications = notifications.filter(n => n.id !== id);
  await saveNotifications(updatedNotifications);
}

// Clear all notifications
export async function clearAllNotifications(): Promise<void> {
  await saveNotifications([]);
}

// Check conditions and create notifications based on app data
export async function checkAndCreateNotifications(
  walletBalance: number,
  debts: any[],
  meters: any[]
) {
  const settings = await getNotificationSettings();
  
  // Check for low balance
  const lowBalanceSetting = settings.find(s => s.type === 'low_balance');
  if (lowBalanceSetting?.enabled && lowBalanceSetting.threshold && walletBalance <= lowBalanceSetting.threshold) {
    await addNotification({
      type: 'low_balance',
      title: 'Low Wallet Balance',
      body: `Your wallet balance (${walletBalance.toFixed(2)}) is below the threshold of $${lowBalanceSetting.threshold}. Consider adding funds.`,
    });
  }
  
  // Check for debts nearing due date
  const debtDueSetting = settings.find(s => s.type === 'debt_due');
  if (debtDueSetting?.enabled && debtDueSetting.timing) {
    const now = new Date();
    
    for (const debt of debts) {
      if (debt.isPaid) continue;
      
      const dueDate = new Date(debt.dueDate);
      const diffTime = dueDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays <= debtDueSetting.timing && diffDays >= 0) {
        await addNotification({
          type: 'debt_due',
          title: 'Upcoming Payment Due',
          body: `Your ${debt.category} payment of $${debt.amount.toFixed(2)} is due in ${diffDays} days.`,
          data: { debtId: debt.id }
        });
      }
    }
  }
  
  // Additional checks can be added based on app data
}

// Simulate receiving a remote notification (for demo purposes)
export async function simulateRemoteNotification(type: NotificationType, customTitle?: string, customBody?: string) {
  const typeToTitle = {
    payment_reminder: 'Payment Reminder',
    low_balance: 'Low Balance Alert',
    meter_recharge: 'Meter Recharge Update',
    debt_due: 'Debt Payment Due',
    price_update: 'Electricity Price Update',
    service_outage: 'Service Outage Alert',
    consumption_alert: 'Consumption Alert'
  };
  
  const typeToBody = {
    payment_reminder: 'You have an upcoming payment due soon.',
    low_balance: 'Your wallet balance is running low.',
    meter_recharge: 'Your meter has been recharged successfully.',
    debt_due: 'A debt payment is due in the next few days.',
    price_update: 'Electricity prices have been updated.',
    service_outage: 'A service outage is scheduled in your area.',
    consumption_alert: 'Your electricity consumption has changed significantly.'
  };
  
  await addNotification({
    type,
    title: customTitle || typeToTitle[type],
    body: customBody || typeToBody[type]
  });
}