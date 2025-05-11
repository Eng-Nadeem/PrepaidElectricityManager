import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet 
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface QuickActionButtonProps {
  icon: string;
  title: string;
  description: string;
  onPress: () => void;
  color?: string[];
}

const QuickActionButton = ({ 
  icon, 
  title, 
  description, 
  onPress, 
  color = ['#4f46e5', '#3730a3']
}: QuickActionButtonProps) => {
  const iconColor = color[0];
  
  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.headerStrip}>
        <LinearGradient
          colors={color}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.headerGradient}
        />
      </View>
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: `${color[0]}10` }]}>
          <Ionicons name={icon} size={24} color={iconColor} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
  },
  headerStrip: {
    height: 6,
    width: '100%',
  },
  headerGradient: {
    height: '100%',
    width: '100%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 2,
  },
  description: {
    fontSize: 13,
    color: '#6b7280',
  },
});

export default QuickActionButton;