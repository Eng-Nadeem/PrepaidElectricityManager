import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Switch,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import NotificationSettingItem from '../../components/notifications/NotificationSettingItem';
import { useNotifications } from '../../context/NotificationContext';

const NotificationSettingsList: React.FC = () => {
  const { notificationSettings, isLoading, permissionStatus, refreshSettings } = useNotifications();

  // Show alert to guide user to enable notifications in settings
  const handlePermissionGuide = () => {
    if (Platform.OS === 'ios') {
      Alert.alert(
        'Enable Notifications',
        'Please go to your device Settings > Notifications > Your App Name and enable notifications.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => {
            // This would ideally open settings, but it's not simple in React Native
            // You would use a library like react-native-permissions for this
          }}
        ]
      );
    } else {
      Alert.alert(
        'Enable Notifications',
        'Please go to your device Settings > Apps > Your App Name > Notifications and enable notifications.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => {
            // This would ideally open settings, but it's not simple in React Native
            // You would use a library like react-native-permissions for this
          }}
        ]
      );
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Loading notification settings...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Permission status card */}
      <View style={[styles.permissionCard, permissionStatus ? styles.permissionEnabled : styles.permissionDisabled]}>
        <View style={styles.permissionContent}>
          <Ionicons
            name={permissionStatus ? 'checkmark-circle' : 'alert-circle'}
            size={24}
            color={permissionStatus ? '#10b981' : '#ef4444'}
            style={styles.permissionIcon}
          />
          <View style={styles.permissionTextContainer}>
            <Text style={styles.permissionTitle}>
              {permissionStatus ? 'Notifications Enabled' : 'Notifications Disabled'}
            </Text>
            <Text style={styles.permissionDescription}>
              {permissionStatus
                ? 'You will receive notifications based on your preferences below.'
                : 'Enable notifications to stay updated about important events.'}
            </Text>
          </View>
        </View>
        
        {!permissionStatus && (
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={handlePermissionGuide}
          >
            <Text style={styles.permissionButtonText}>Enable</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Section header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Notification Settings</Text>
        <Text style={styles.sectionDescription}>
          Customize which notifications you want to receive
        </Text>
      </View>

      {/* Settings list */}
      {notificationSettings.map((setting) => (
        <NotificationSettingItem key={setting.type} setting={setting} />
      ))}

      {/* Info section */}
      <View style={styles.infoSection}>
        <Ionicons name="information-circle-outline" size={20} color="#6b7280" />
        <Text style={styles.infoText}>
          These settings control when and how you'll be notified about events in the app.
          Some notifications may still be sent for critical updates.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  contentContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    fontSize: 16,
    color: '#6b7280',
    marginTop: 16,
  },
  permissionCard: {
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  permissionEnabled: {
    backgroundColor: '#ecfdf5',
  },
  permissionDisabled: {
    backgroundColor: '#fef2f2',
  },
  permissionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  permissionIcon: {
    marginRight: 12,
  },
  permissionTextContainer: {
    flex: 1,
  },
  permissionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  permissionDescription: {
    fontSize: 14,
    color: '#6b7280',
    lineHeight: 20,
  },
  permissionButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 12,
  },
  permissionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  infoSection: {
    flexDirection: 'row',
    backgroundColor: '#eff6ff',
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
    marginBottom: 16,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: '#3b82f6',
    marginLeft: 8,
    lineHeight: 20,
  },
});

export default NotificationSettingsList;