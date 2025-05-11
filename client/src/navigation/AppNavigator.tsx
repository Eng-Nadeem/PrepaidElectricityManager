import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet } from 'react-native';

// Import screens converted from the web app
import DashboardScreen from '../screens/DashboardScreen';
import RechargeScreen from '../screens/RechargeScreen';
import PaymentConfirmationScreen from '../screens/PaymentConfirmationScreen';
import ProcessingScreen from '../screens/ProcessingScreen';
import SuccessScreen from '../screens/SuccessScreen';
import ErrorScreen from '../screens/ErrorScreen';
import TransactionHistoryScreen from '../screens/TransactionHistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MetersScreen from '../screens/MetersScreen';
import DebtsScreen from '../screens/DebtsScreen';
import WalletScreen from '../screens/WalletScreen';
import PayDebtScreen from '../screens/PayDebtScreen';
import NotFoundScreen from '../screens/NotFoundScreen';

// Import theme
import { Colors } from '../styles/Theme';

// Type definitions for navigation
export type RootStackParamList = {
  Main: undefined;
  Recharge: { meterId?: number; meterNumber?: string };
  PaymentConfirmation: { 
    amount: number; 
    meterNumber?: string;
    paymentMethod?: string; 
  };
  Processing: undefined;
  Success: { 
    title?: string;
    message?: string;
    amount?: number;
    meterNumber?: string;
    token?: string;
    type?: 'recharge' | 'payment' | 'wallet';
  };
  Error: { message?: string };
  PayDebt: { debtId: number };
  NotFound: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Meters: undefined;
  History: undefined;
  Debts: undefined;
  Profile: undefined;
  Wallet: undefined;
};

// Create navigators
const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

// Main tab navigator
const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.gray500,
        tabBarStyle: styles.tabBar,
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen} 
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => <TabIcon name="home" color={color} size={size} />,
        }}
      />
      <Tab.Screen 
        name="Meters" 
        component={MetersScreen} 
        options={{
          tabBarLabel: 'Meters',
          tabBarIcon: ({ color, size }) => <TabIcon name="flash" color={color} size={size} />,
        }}
      />
      <Tab.Screen 
        name="History" 
        component={TransactionHistoryScreen} 
        options={{
          tabBarLabel: 'History',
          tabBarIcon: ({ color, size }) => <TabIcon name="list" color={color} size={size} />,
        }}
      />
      <Tab.Screen 
        name="Debts" 
        component={DebtsScreen} 
        options={{
          tabBarLabel: 'Debts',
          tabBarIcon: ({ color, size }) => <TabIcon name="alert-triangle" color={color} size={size} />,
        }}
      />
      <Tab.Screen 
        name="Wallet" 
        component={WalletScreen} 
        options={{
          tabBarLabel: 'Wallet',
          tabBarIcon: ({ color, size }) => <TabIcon name="wallet" color={color} size={size} />,
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => <TabIcon name="user" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
};

// Placeholder for tab icons - will be replaced with actual icons
const TabIcon = ({ name, color, size }: { name: string; color: string; size: number }) => {
  // This will be replaced with actual icons in a real implementation
  return null;
};

// App navigator
const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTintColor: Colors.white,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen 
          name="Main" 
          component={MainTabNavigator} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Recharge" 
          component={RechargeScreen} 
          options={{ title: 'Recharge Meter' }}
        />
        <Stack.Screen 
          name="PaymentConfirmation" 
          component={PaymentConfirmationScreen} 
          options={{ title: 'Confirm Payment' }}
        />
        <Stack.Screen 
          name="Processing" 
          component={ProcessingScreen} 
          options={{ title: 'Processing', headerShown: false }}
        />
        <Stack.Screen 
          name="Success" 
          component={SuccessScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Error" 
          component={ErrorScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="PayDebt" 
          component={PayDebtScreen} 
          options={{ title: 'Pay Debt' }}
        />
        <Stack.Screen 
          name="NotFound" 
          component={NotFoundScreen} 
          options={{ title: 'Not Found' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    borderTopWidth: 1,
    borderTopColor: Colors.gray200,
    height: 60,
    paddingBottom: 5,
    paddingTop: 5,
  },
});

export default AppNavigator;