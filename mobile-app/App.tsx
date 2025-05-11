import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import screens
import DashboardScreen from './src/screens/DashboardScreen';
import WalletScreen from './src/screens/WalletScreen';
import MetersScreen from './src/screens/MetersScreen';
import DebtsScreen from './src/screens/DebtsScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import RechargeScreen from './src/screens/RechargeScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import PayDebtScreen from './src/screens/PayDebtScreen';

// Import icons
import { Ionicons } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Wallet') {
            iconName = focused ? 'wallet' : 'wallet-outline';
          } else if (route.name === 'Meters') {
            iconName = focused ? 'flash' : 'flash-outline';
          } else if (route.name === 'Debts') {
            iconName = focused ? 'card' : 'card-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Wallet" component={WalletScreen} />
      <Tab.Screen name="Meters" component={MetersScreen} />
      <Tab.Screen name="Debts" component={DebtsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#f9fafb',
            },
            headerTintColor: '#3b82f6',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}
        >
          <Stack.Screen 
            name="Home" 
            component={HomeTabs} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Recharge" 
            component={RechargeScreen} 
            options={{ title: 'Buy Electricity' }}
          />
          <Stack.Screen 
            name="History" 
            component={HistoryScreen} 
            options={{ title: 'Transaction History' }}
          />
          <Stack.Screen 
            name="PayDebt" 
            component={PayDebtScreen} 
            options={{ title: 'Pay Debt' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}