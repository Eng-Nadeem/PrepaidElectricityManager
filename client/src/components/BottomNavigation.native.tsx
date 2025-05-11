import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Colors, FontSize, FontWeight, Spacing } from '../styles/Theme';

// Placeholder for icons until we implement actual vector icons
const HomeIcon = ({ color }: { color: string }) => (
  <View style={[styles.iconPlaceholder, { backgroundColor: color }]} />
);

const BoltIcon = ({ color }: { color: string }) => (
  <View style={[styles.iconPlaceholder, { backgroundColor: color }]} />
);

const WalletIcon = ({ color }: { color: string }) => (
  <View style={[styles.iconPlaceholder, { backgroundColor: color }]} />
);

const AlertTriangleIcon = ({ color }: { color: string }) => (
  <View style={[styles.iconPlaceholder, { backgroundColor: color }]} />
);

const UserIcon = ({ color }: { color: string }) => (
  <View style={[styles.iconPlaceholder, { backgroundColor: color }]} />
);

const BottomNavigation = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const isActive = (routeName: string) => {
    return route.name === routeName;
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => navigation.navigate('Dashboard')}
        >
          <HomeIcon color={isActive('Dashboard') ? Colors.primary : Colors.gray500} />
          <Text style={[
            styles.tabLabel,
            {color: isActive('Dashboard') ? Colors.primary : Colors.gray500}
          ]}>
            Home
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => navigation.navigate('Meters')}
        >
          <BoltIcon color={isActive('Meters') ? Colors.primary : Colors.gray500} />
          <Text style={[
            styles.tabLabel,
            {color: isActive('Meters') ? Colors.primary : Colors.gray500}
          ]}>
            Meters
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => navigation.navigate('Wallet')}
        >
          <WalletIcon color={isActive('Wallet') ? Colors.primary : Colors.gray500} />
          <Text style={[
            styles.tabLabel,
            {color: isActive('Wallet') ? Colors.primary : Colors.gray500}
          ]}>
            Wallet
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => navigation.navigate('Debts')}
        >
          <AlertTriangleIcon color={isActive('Debts') ? Colors.primary : Colors.gray500} />
          <Text style={[
            styles.tabLabel,
            {color: isActive('Debts') ? Colors.primary : Colors.gray500}
          ]}>
            Debts
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => navigation.navigate('Profile')}
        >
          <UserIcon color={isActive('Profile') ? Colors.primary : Colors.gray500} />
          <Text style={[
            styles.tabLabel,
            {color: isActive('Profile') ? Colors.primary : Colors.gray500}
          ]}>
            Profile
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: Spacing[2],
  },
  tabItem: {
    alignItems: 'center',
    paddingVertical: Spacing[2],
    paddingHorizontal: Spacing[2],
  },
  tabLabel: {
    fontSize: FontSize.xs,
    marginTop: Spacing[1],
  },
  iconPlaceholder: {
    width: 20,
    height: 20,
  },
});

export default BottomNavigation;