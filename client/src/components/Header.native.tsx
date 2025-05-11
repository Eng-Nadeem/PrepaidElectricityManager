import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors, FontSize, FontWeight, Spacing } from '../styles/Theme';

// Placeholder for icons until we implement actual vector icons
const BoltIcon = () => (
  <View style={[styles.iconPlaceholder, { backgroundColor: Colors.white }]} />
);

const UserCircleIcon = () => (
  <View style={[styles.iconPlaceholder, { backgroundColor: Colors.white, borderRadius: 12 }]} />
);

interface HeaderProps {
  title?: string;
}

const Header = ({ title = 'PowerPay' }: HeaderProps) => {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.logoContainer}
          onPress={() => navigation.navigate('Main')}
        >
          <BoltIcon />
          <Text style={styles.title}>{title}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <UserCircleIcon />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: Colors.primary,
    padding: Spacing[4],
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
    zIndex: 10,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.white,
    marginLeft: Spacing[2],
  },
  profileButton: {
    padding: Spacing[2],
  },
  iconPlaceholder: {
    width: 24,
    height: 24,
  },
});

export default Header;