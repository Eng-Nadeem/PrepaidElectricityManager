import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { Colors, FontSize, FontWeight, Spacing } from '../styles/Theme';
import MeterCard from '../components/MeterCard.native';
import TransactionCard from '../components/TransactionCard.native';

// Placeholder for icons
const IconPlaceholder = ({ color = Colors.primary }: { color?: string }) => (
  <View style={[styles.iconPlaceholder, { backgroundColor: color }]} />
);

interface Meter {
  id: number;
  nickname?: string;
  meterNumber: string;
  status?: string;
  createdAt: string;
}

interface Transaction {
  id: number;
  type?: string;
  amount: number | string;
  status: string;
  meterNumber?: string;
  timestamp?: string;
  createdAt?: string | Date;
}

interface QuickActionButtonProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onPress: () => void;
  color?: string;
}

const QuickActionButton = ({
  icon,
  title,
  description,
  onPress,
  color = Colors.primary
}: QuickActionButtonProps) => (
  <TouchableOpacity
    onPress={onPress}
    style={styles.quickActionButton}
  >
    <View style={styles.quickActionTopBorder} />
    <View style={styles.quickActionContent}>
      <View style={[styles.quickActionIcon, { backgroundColor: color + '10' }]}>
        {icon}
      </View>
      <View style={styles.quickActionTextContainer}>
        <Text style={styles.quickActionTitle}>{title}</Text>
        <Text style={styles.quickActionDescription}>{description}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const DashboardScreen = () => {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);

  // Queries for data
  const { 
    data: recentMeters = [],
    isLoading: isLoadingMeters,
    refetch: refetchMeters
  } = useQuery({
    queryKey: ['/api/meters/recent'],
    queryFn: async () => {
      const response = await fetch('/api/meters/recent');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    }
  });

  const { 
    data: recentTransactions = [],
    isLoading: isLoadingTransactions,
    refetch: refetchTransactions
  } = useQuery({
    queryKey: ['/api/transactions/recent'],
    queryFn: async () => {
      const response = await fetch('/api/transactions/recent');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    }
  });

  const { 
    data: walletData,
    isLoading: isLoadingWallet,
    refetch: refetchWallet
  } = useQuery({
    queryKey: ['/api/wallet'],
    queryFn: async () => {
      const response = await fetch('/api/wallet');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    }
  });

  const { 
    data: userProfile,
    isLoading: isLoadingProfile,
    refetch: refetchProfile
  } = useQuery({
    queryKey: ['/api/user/profile'],
    queryFn: async () => {
      const response = await fetch('/api/user/profile');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    }
  });

  const { 
    data: debts = [],
    isLoading: isLoadingDebts,
    refetch: refetchDebts
  } = useQuery({
    queryKey: ['/api/debts'],
    queryFn: async () => {
      const response = await fetch('/api/debts');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    }
  });

  // Format currency helper
  const formatCurrency = (value: number | string | undefined | null) => {
    if (value === undefined || value === null) return '$0.00';
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return !isNaN(numValue) ? `$${numValue.toFixed(2)}` : '$0.00';
  };
  
  // Handle pull-to-refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      refetchMeters(),
      refetchTransactions(),
      refetchWallet(),
      refetchProfile(),
      refetchDebts()
    ]);
    setRefreshing(false);
  }, []);

  // Navigation handlers
  const handleMeterSelect = (meter: Meter) => {
    navigation.navigate('Recharge', { meterId: meter.id, meterNumber: meter.meterNumber });
  };

  const handleAddMeter = () => {
    navigation.navigate('Meters');
  };

  const handleTopUpWallet = () => {
    navigation.navigate('Wallet');
  };

  const handleViewDebts = () => {
    navigation.navigate('Debts');
  };

  const isLoading = isLoadingMeters || isLoadingTransactions || isLoadingWallet || isLoadingProfile || isLoadingDebts;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* User welcome section */}
        <View style={styles.welcomeSection}>
          <View>
            <Text style={styles.greetingText}>
              Hello, {userProfile?.fullName || userProfile?.name || 'User'}
            </Text>
            <Text style={styles.subtitleText}>
              Welcome back to your electricity manager
            </Text>
          </View>
        </View>

        {/* Wallet balance card */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceContent}>
            <View>
              <Text style={styles.balanceLabel}>Wallet Balance</Text>
              <Text style={styles.balanceAmount}>
                {isLoadingWallet ? 
                  <ActivityIndicator size="small" color={Colors.primary} /> : 
                  formatCurrency(walletData?.balance)
                }
              </Text>
            </View>
            <TouchableOpacity
              style={styles.topUpButton}
              onPress={handleTopUpWallet}
            >
              <Text style={styles.topUpButtonText}>Top Up</Text>
            </TouchableOpacity>
          </View>
        </View>
          
        {/* Quick actions */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsRow}>
            <QuickActionButton
              icon={<IconPlaceholder color={Colors.primary} />}
              title="Add Meter"
              description="Register a new meter"
              onPress={handleAddMeter}
              color={Colors.primary}
            />
            <QuickActionButton
              icon={<IconPlaceholder color={Colors.secondary} />}
              title="View Debts"
              description="Check outstanding payments"
              onPress={handleViewDebts}
              color={Colors.secondary}
            />
          </View>
        </View>

        {/* My Meters section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>My Meters</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Meters')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {isLoadingMeters ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={Colors.primary} />
            </View>
          ) : recentMeters.length > 0 ? (
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.metersScrollContainer}
            >
              {recentMeters.map((meter: Meter) => (
                <MeterCard
                  key={meter.id}
                  meter={meter}
                  onSelect={handleMeterSelect}
                  style={styles.meterCard}
                />
              ))}
              <TouchableOpacity
                style={styles.addMeterButton}
                onPress={handleAddMeter}
              >
                <Text style={styles.addMeterText}>+ Add Meter</Text>
              </TouchableOpacity>
            </ScrollView>
          ) : (
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateText}>No meters found</Text>
              <TouchableOpacity
                style={styles.addMeterButtonLarge}
                onPress={handleAddMeter}
              >
                <Text style={styles.addMeterTextLarge}>+ Add Your First Meter</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Recent Transactions section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeaderRow}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <TouchableOpacity onPress={() => navigation.navigate('History')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {isLoadingTransactions ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={Colors.primary} />
            </View>
          ) : recentTransactions.length > 0 ? (
            <View style={styles.transactionsContainer}>
              {recentTransactions.slice(0, 3).map((transaction: Transaction) => (
                <TransactionCard
                  key={transaction.id}
                  transaction={transaction}
                  style={styles.transactionCard}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyStateContainer}>
              <Text style={styles.emptyStateText}>No transactions found</Text>
            </View>
          )}
        </View>

        {/* Pending Debts section */}
        {debts.length > 0 && (
          <View style={styles.sectionContainer}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionTitle}>Pending Debts</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Debts')}>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>
            
            {isLoadingDebts ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={Colors.primary} />
              </View>
            ) : (
              <View style={styles.debtsContainer}>
                <View style={styles.debtSummaryCard}>
                  <View>
                    <Text style={styles.debtTotalLabel}>Total Amount Due</Text>
                    <Text style={styles.debtTotalAmount}>
                      {formatCurrency(
                        debts.reduce((total: number, debt: any) => 
                          total + parseFloat(debt.amount.toString()), 0)
                      )}
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={styles.viewDebtsButton}
                    onPress={handleViewDebts}
                  >
                    <Text style={styles.viewDebtsButtonText}>View Debts</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        )}

        {/* Bottom padding */}
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray100,
  },
  scrollContent: {
    paddingHorizontal: Spacing[4],
  },
  welcomeSection: {
    marginTop: Spacing[4],
    marginBottom: Spacing[6],
  },
  greetingText: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    color: Colors.gray900,
  },
  subtitleText: {
    fontSize: FontSize.base,
    color: Colors.gray600,
    marginTop: Spacing[1],
  },
  balanceCard: {
    backgroundColor: Colors.white,
    borderRadius: Spacing[3],
    padding: Spacing[4],
    marginBottom: Spacing[6],
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  balanceContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  balanceLabel: {
    fontSize: FontSize.sm,
    color: Colors.gray600,
    marginBottom: Spacing[1],
  },
  balanceAmount: {
    fontSize: FontSize['2xl'],
    fontWeight: FontWeight.bold,
    color: Colors.gray900,
  },
  topUpButton: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing[2],
    paddingHorizontal: Spacing[4],
    borderRadius: Spacing[2],
  },
  topUpButtonText: {
    color: Colors.white,
    fontWeight: FontWeight.medium,
    fontSize: FontSize.sm,
  },
  sectionContainer: {
    marginBottom: Spacing[6],
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing[3],
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.gray800,
  },
  viewAllText: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: FontWeight.medium,
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    flex: 1,
    marginHorizontal: Spacing[1],
    borderRadius: Spacing[3],
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    overflow: 'hidden',
  },
  quickActionTopBorder: {
    height: Spacing[1.5],
    backgroundColor: Colors.primary,
  },
  quickActionContent: {
    flexDirection: 'row',
    padding: Spacing[4],
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: Spacing[3],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing[4],
    borderWidth: 1,
    borderColor: Colors.white + '80',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  quickActionTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  quickActionTitle: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.gray800,
    marginBottom: Spacing[1],
  },
  quickActionDescription: {
    fontSize: FontSize.sm,
    color: Colors.gray500,
  },
  metersScrollContainer: {
    paddingBottom: Spacing[2],
  },
  meterCard: {
    marginRight: Spacing[2],
  },
  addMeterButton: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[2],
    borderRadius: Spacing[2],
    borderWidth: 1,
    borderColor: Colors.gray200,
    justifyContent: 'center',
  },
  addMeterText: {
    color: Colors.primary,
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },
  addMeterButtonLarge: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3],
    borderRadius: Spacing[2],
    borderWidth: 1,
    borderColor: Colors.gray200,
    marginTop: Spacing[3],
  },
  addMeterTextLarge: {
    color: Colors.primary,
    fontSize: FontSize.base,
    fontWeight: FontWeight.medium,
  },
  loadingContainer: {
    paddingVertical: Spacing[8],
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateContainer: {
    alignItems: 'center',
    paddingVertical: Spacing[8],
  },
  emptyStateText: {
    fontSize: FontSize.base,
    color: Colors.gray500,
    marginBottom: Spacing[2],
  },
  transactionsContainer: {
    backgroundColor: Colors.white,
    borderRadius: Spacing[3],
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    overflow: 'hidden',
  },
  transactionCard: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray100,
  },
  debtsContainer: {
    marginBottom: Spacing[2],
  },
  debtSummaryCard: {
    backgroundColor: Colors.white,
    borderRadius: Spacing[3],
    padding: Spacing[4],
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  debtTotalLabel: {
    fontSize: FontSize.sm,
    color: Colors.gray600,
    marginBottom: Spacing[1],
  },
  debtTotalAmount: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.danger,
  },
  viewDebtsButton: {
    backgroundColor: Colors.dangerDark,
    paddingVertical: Spacing[2],
    paddingHorizontal: Spacing[4],
    borderRadius: Spacing[2],
  },
  viewDebtsButtonText: {
    color: Colors.white,
    fontWeight: FontWeight.medium,
    fontSize: FontSize.sm,
  },
  bottomPadding: {
    height: 80, // Extra padding for bottom navigation
  },
  iconPlaceholder: {
    width: 24,
    height: 24,
    borderRadius: 4,
  },
});

export default DashboardScreen;