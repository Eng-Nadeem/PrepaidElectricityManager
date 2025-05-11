import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, FontSize, FontWeight, Spacing } from '../styles/Theme';

// Define Meter interface for React Native
interface Meter {
  id: number;
  nickname?: string;
  meterNumber: string;
  status?: string;
  createdAt: string;
}

interface MeterCardProps {
  meter: Meter;
  onSelect: (meter: Meter) => void;
  style?: ViewStyle;
}

const MeterCard = ({ meter, onSelect, style }: MeterCardProps) => {
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={() => onSelect(meter)}
    >
      <Text style={styles.nickname}>{meter.nickname || "Meter"}</Text>
      <Text style={styles.meterNumber}>{meter.meterNumber}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexShrink: 0,
    backgroundColor: Colors.gray100,
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[2],
    borderRadius: Spacing[2],
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  nickname: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
    color: Colors.gray800,
  },
  meterNumber: {
    fontSize: FontSize.xs,
    color: Colors.gray500,
  },
});

export default MeterCard;