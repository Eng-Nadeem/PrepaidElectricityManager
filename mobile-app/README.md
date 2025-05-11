# Prepaid Meter Mobile App

A React Native mobile application built with Expo for managing prepaid electricity meters, electricity purchases, bill payments, and wallet management.

## Features

- Dashboard with quick access to key features
- Electricity meter management (add, edit, view meters)
- Electricity recharge functionality
- Virtual wallet with top-up capability
- Debt tracking and payment
- Transaction history
- User profile management
- Animated success screens

## Tech Stack

- **React Native**: Core framework for building the mobile app
- **Expo**: Development platform for React Native
- **React Navigation**: Navigation between screens
- **Expo Linear Gradient**: For gradient UI elements
- **Expo Icons**: Ionicons for the UI

## Project Structure

```
mobile-app/
├── App.tsx                 # Main application component
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── MeterCard.tsx   # Meter display component
│   │   ├── TransactionCard.tsx  # Transaction history item
│   │   └── QuickActionButton.tsx # Dashboard action buttons
│   ├── screens/            # Application screens
│   │   ├── DashboardScreen.tsx      # Home screen
│   │   ├── DebtsScreen.tsx          # Debts management
│   │   ├── MetersScreen.tsx         # Meter management
│   │   ├── PayDebtScreen.tsx        # Debt payment confirmation
│   │   ├── RechargeScreen.tsx       # Meter recharge 
│   │   ├── SuccessScreen.tsx        # Payment success screen
│   │   ├── WalletScreen.tsx         # Wallet management
│   │   └── ...                      # Other screens
│   ├── hooks/              # Custom React hooks
│   ├── utils/              # Utility functions
│   │   └── formatters.ts   # Formatting utilities for currency, dates, etc.
│   ├── context/            # React context for app-wide state
│   ├── api/                # API service functions
│   └── types/              # TypeScript definitions
```

## Getting Started

1. Install dependencies:
   ```
   npm install
   ```

2. Start the Expo development server:
   ```
   npm start
   ```

3. Use the Expo Go app on your mobile device or an emulator to view the application.

## Converting from Web to Mobile

This application was converted from a React.js web application to a React Native mobile app. Key differences include:

1. **Component Changes**:
   - HTML elements replaced with React Native components
   - CSS replaced with React Native StyleSheet
   - Web-specific event handling adapted for touch interactions

2. **Navigation**:
   - Web router (wouter) replaced with React Navigation
   - Bottom tab navigation for main sections
   - Stack navigation for drill-down flows

3. **Styling Adaptations**:
   - CSS gradients converted to LinearGradient components
   - Flexbox used extensively for layouts
   - Pixel-perfect styling replaced with more fluid layouts

4. **Mobile-Specific Features**:
   - Pull-to-refresh functionality
   - Mobile-friendly input handling
   - Touch feedback and animations

## Future Enhancements

1. Implement offline capability with AsyncStorage
2. Add biometric authentication
3. Integrate push notifications
4. Add barcode/QR code scanner for meter identification
5. Implement dark mode