import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet,
  TouchableOpacity
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { formatCurrency } from '../utils/formatters';

interface Transaction {
  id: number;
  meterNumber: string;
  meterNickname?: string;
  amount: number;
  status: string;
  token?: string;
  createdAt: string;
  type: string;
}

interface TransactionCardProps {
  transaction: Transaction;
  onPress?: (transaction: Transaction) => void;
}

const TransactionCard = ({ transaction, onPress }: TransactionCardProps) => {
  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          icon: 'checkmark-circle',
          color: '#10b981',
          label: 'Completed',
          bgColor: '#d1fae5'
        };
      case 'pending':
        return {
          icon: 'time',
          color: '#f59e0b',
          label: 'Pending',
          bgColor: '#fef3c7'
        };
      case 'failed':
        return {
          icon: 'close-circle',
          color: '#ef4444',
          label: 'Failed',
          bgColor: '#fee2e2'
        };
      default:
        return {
          icon: 'help-circle',
          color: '#6b7280',
          label: status,
          bgColor: '#f3f4f6'
        };
    }
  };

  const getTypeInfo = (type: string) => {
    switch (type) {
      case 'recharge':
        return {
          icon: 'flash',
          color: '#4f46e5'
        };
      case 'payment':
        return {
          icon: 'card',
          color: '#0ea5e9'
        };
      case 'wallet':
        return {
          icon: 'wallet',
          color: '#10b981'
        };
      default:
        return {
          icon: 'documents',
          color: '#6b7280'
        };
    }
  };

  const statusInfo = getStatusInfo(transaction.status);
  const typeInfo = getTypeInfo(transaction.type);
  const date = new Date(transaction.createdAt);

  const handlePress = () => {
    if (onPress) {
      onPress(transaction);
    }
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress ? handlePress : undefined}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.leftSection}>
        <View style={[styles.iconContainer, { backgroundColor: `${typeInfo.color}10` }]}>
          <Ionicons name={typeInfo.icon} size={20} color={typeInfo.color} />
        </View>
      </View>
      
      <View style={styles.middleSection}>
        <Text style={styles.meterName}>
          {transaction.meterNickname || `Meter ${transaction.meterNumber.substring(0, 5)}...`}
        </Text>
        <Text style={styles.meterNumber}>
          {`Meter: ${transaction.meterNumber.slice(0, 5)}...${transaction.meterNumber.slice(-4)}`}
        </Text>
        <Text style={styles.date}>
          {date.toLocaleDateString()} · {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
      
      <View style={styles.rightSection}>
        <Text style={styles.amount}>{formatCurrency(transaction.amount)}</Text>
        <View style={[styles.statusContainer, { backgroundColor: statusInfo.bgColor }]}>
          <Ionicons name={statusInfo.icon} size={12} color={statusInfo.color} />
          <Text style={[styles.statusText, { color: statusInfo.color }]}>
            {statusInfo.label}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  leftSection: {
    marginRight: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  middleSection: {
    flex: 1,
  },
  meterName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 2,
  },
  meterNumber: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 2,
  },
  date: {
    fontSize: 12,
    color: '#9ca3af',
  },
  rightSection: {
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
});

export default TransactionCard;