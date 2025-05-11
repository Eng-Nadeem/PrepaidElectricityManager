import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Meter {
  id: number;
  meterNumber: string;
  nickname?: string;
  createdAt: string;
}

interface MeterCardProps {
  meter: Meter;
  onSelect: (meter: Meter) => void;
}

const MeterCard = ({ meter, onSelect }: MeterCardProps) => {
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => onSelect(meter)}
      activeOpacity={0.7}
    >
      <View style={styles.topSection}>
        <Ionicons name="flash" size={24} color="#4f46e5" />
        <View style={styles.labelContainer}>
          <Text style={styles.label}>Meter</Text>
        </View>
      </View>
      
      <Text style={styles.nickname}>
        {meter.nickname || `Meter ${meter.id}`}
      </Text>
      
      <View style={styles.numberContainer}>
        <Text style={styles.numberLabel}>Meter Number:</Text>
        <Text style={styles.meterNumber}>{meter.meterNumber}</Text>
      </View>
      
      <View style={styles.footer}>
        <View style={styles.footerItem}>
          <Ionicons name="time-outline" size={14} color="#6b7280" />
          <Text style={styles.footerText}>
            {new Date(meter.createdAt).toLocaleDateString()}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.rechargeButton}
          onPress={() => onSelect(meter)}
        >
          <Ionicons name="flash" size={14} color="white" />
          <Text style={styles.rechargeText}>Recharge</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 200,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  topSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  labelContainer: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  label: {
    fontSize: 12,
    color: '#4f46e5',
    fontWeight: '500',
  },
  nickname: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
  numberContainer: {
    marginBottom: 12,
  },
  numberLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 2,
  },
  meterNumber: {
    fontSize: 14,
    color: '#4b5563',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    fontSize: 12,
    color: '#6b7280',
  },
  rechargeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#4f46e5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  rechargeText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
  },
});

export default MeterCard;