import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { formatCurrency } from '../utils/formatters';

const SuccessScreen = ({ route, navigation }) => {
  const { type, amount, category, date, token } = route.params;
  
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.3)).current;
  const opacityAnim = React.useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    // Pulse animation for success icon
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.bezier(0.4, 0, 0.2, 1),
          useNativeDriver: true,
        }),
      ])
    ).start();
    
    // Scale and fade in animations for content
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);
  
  const getScreenInfo = () => {
    switch (type) {
      case 'recharge':
        return {
          title: 'Recharge Successful',
          message: 'Your electricity token has been generated successfully.',
          icon: 'flash',
          color: '#4f46e5',
          gradient: ['#4f46e5', '#6366f1'],
        };
      case 'debt_payment':
        return {
          title: 'Payment Successful',
          message: 'Your debt has been paid successfully.',
          icon: 'checkmark-circle',
          color: '#10b981',
          gradient: ['#10b981', '#34d399'],
        };
      case 'wallet_topup':
        return {
          title: 'Top-Up Successful',
          message: 'Your wallet has been topped up successfully.',
          icon: 'wallet',
          color: '#f59e0b',
          gradient: ['#f59e0b', '#fbbf24'],
        };
      default:
        return {
          title: 'Operation Successful',
          message: 'Your request has been processed successfully.',
          icon: 'checkmark-circle',
          color: '#4f46e5',
          gradient: ['#4f46e5', '#6366f1'],
        };
    }
  };
  
  const info = getScreenInfo();
  const dateObj = new Date(date);
  
  const handleDone = () => {
    if (type === 'recharge') {
      navigation.navigate('Dashboard');
    } else if (type === 'debt_payment') {
      navigation.navigate('Debts');
    } else if (type === 'wallet_topup') {
      navigation.navigate('Wallet');
    } else {
      navigation.navigate('Dashboard');
    }
  };
  
  const handleViewHistory = () => {
    navigation.navigate('History');
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <Animated.View 
        style={[
          styles.content,
          {
            opacity: opacityAnim,
            transform: [{ scale: scaleAnim }],
          }
        ]}
      >
        <LinearGradient
          colors={info.gradient}
          style={styles.header}
        >
          <Animated.View 
            style={[
              styles.iconContainer,
              {
                transform: [{ scale: pulseAnim }],
              }
            ]}
          >
            <Ionicons name={info.icon} size={48} color="white" />
          </Animated.View>
          <Text style={styles.title}>{info.title}</Text>
          <Text style={styles.message}>{info.message}</Text>
        </LinearGradient>
        
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Amount</Text>
            <Text style={styles.detailValue}>{formatCurrency(amount)}</Text>
          </View>
          
          {category && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Category</Text>
              <Text style={styles.detailValue}>{category}</Text>
            </View>
          )}
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date & Time</Text>
            <Text style={styles.detailValue}>
              {dateObj.toLocaleDateString()} {dateObj.toLocaleTimeString([], { 
                hour: '2-digit', 
                minute: '2-digit' 
              })}
            </Text>
          </View>
          
          {token && (
            <View style={styles.tokenContainer}>
              <Text style={styles.tokenLabel}>Token</Text>
              <Text style={styles.token}>{token}</Text>
              <TouchableOpacity style={styles.copyButton}>
                <Ionicons name="copy-outline" size={16} color="#4f46e5" />
                <Text style={styles.copyText}>Copy Token</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={handleDone}
          >
            <Text style={styles.primaryButtonText}>Done</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.secondaryButton}
            onPress={handleViewHistory}
          >
            <Text style={styles.secondaryButtonText}>View Transaction History</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 16,
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  header: {
    width: '100%',
    alignItems: 'center',
    padding: 24,
    borderRadius: 16,
    marginBottom: 24,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
  },
  detailsCard: {
    backgroundColor: 'white',
    width: '100%',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 15,
    color: '#6b7280',
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1f2937',
  },
  tokenContainer: {
    backgroundColor: '#f3f4f6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  tokenLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  token: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    letterSpacing: 1,
    marginBottom: 12,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#e0e7ff',
    borderRadius: 8,
    gap: 6,
  },
  copyText: {
    fontSize: 14,
    color: '#4f46e5',
    fontWeight: '500',
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#4f46e5',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4f46e5',
  },
});

export default SuccessScreen;