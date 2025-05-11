import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Image,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

// Import components
import QuickActionButton from '../components/QuickActionButton';
import MeterCard from '../components/MeterCard';
import TransactionCard from '../components/TransactionCard';
import { formatCurrency } from '../utils/formatters';

// Mock data for demo purposes (in a real app, this would come from API)
const mockUserProfile = {
  fullName: 'John Doe',
  email: 'john.doe@example.com',
  username: 'john_doe',
  phone: '+1 234 567 8901',
  address: '123 Main St, City, Country',
};

const mockMeters = [
  {
    id: 1,
    meterNumber: '12345678901',
    nickname: 'Home Meter',
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    meterNumber: '98765432109',
    nickname: 'Office Meter',
    createdAt: new Date().toISOString(),
  },
];

const mockTransactions = [
  {
    id: 1,
    meterNumber: '12345678901',
    meterNickname: 'Home Meter',
    amount: 50.00,
    status: 'completed',
    token: 'ABC-123-DEF-456',
    createdAt: new Date().toISOString(),
    type: 'recharge',
  },
  {
    id: 2,
    meterNumber: '98765432109',
    meterNickname: 'Office Meter',
    amount: 100.00,
    status: 'completed',
    token: 'GHI-789-JKL-012',
    createdAt: new Date().toISOString(),
    type: 'recharge',
  },
];

const mockStats = {
  totalSpent: 150.00,
  transactionCount: 2,
};

const mockWalletBalance = 75.00;
const mockPendingDebtsCount = 1;

const DashboardScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [userProfile, setUserProfile] = useState(mockUserProfile);
  const [recentMeters, setRecentMeters] = useState(mockMeters);
  const [recentTransactions, setRecentTransactions] = useState(mockTransactions);
  const [stats, setStats] = useState(mockStats);
  const [walletBalance, setWalletBalance] = useState(mockWalletBalance);
  const [pendingDebtsCount, setPendingDebtsCount] = useState(mockPendingDebtsCount);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // In a real app, you would fetch fresh data here
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  const handleMeterSelect = (meter) => {
    navigation.navigate('Recharge', { 
      meterId: meter.id,
      meterNumber: meter.meterNumber,
      nickname: meter.nickname || '',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Welcome Card */}
        <LinearGradient
          colors={['#4f46e5', '#1e40af']}
          style={styles.welcomeCard}
        >
          <View style={styles.welcomeCardOverlay}>
            <View style={styles.welcomeCardContent}>
              <Text style={styles.welcomeTitle}>
                Welcome{userProfile?.fullName ? `, ${userProfile.fullName.split(' ')[0]}` : ''}!
              </Text>
              <Text style={styles.welcomeSubtitle}>
                What would you like to do today?
              </Text>
              
              <View style={styles.quickButtonsRow}>
                <TouchableOpacity 
                  style={styles.quickButton}
                  onPress={() => navigation.navigate('Recharge')}
                >
                  <Ionicons name="flash" size={16} color="white" style={styles.buttonIcon} />
                  <Text style={styles.buttonText}>Quick Recharge</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.quickButton}
                  onPress={() => navigation.navigate('Wallet')}
                >
                  <Ionicons name="wallet" size={16} color="white" style={styles.buttonIcon} />
                  <Text style={styles.buttonText}>View Wallet</Text>
                </TouchableOpacity>
                {pendingDebtsCount > 0 && (
                  <TouchableOpacity 
                    style={[styles.quickButton, styles.warningButton]}
                    onPress={() => navigation.navigate('Debts')}
                  >
                    <Ionicons name="alert-triangle" size={16} color="white" style={styles.buttonIcon} />
                    <Text style={styles.buttonText}>Pay Debts ({pendingDebtsCount})</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Quick Actions & Stats */}
        <View style={styles.cardsRow}>
          {/* Wallet Balance Card */}
          <View style={styles.statCard}>
            <LinearGradient
              colors={['#10b981', '#059669']}
              style={styles.cardHeader}
            />
            <View style={styles.cardContent}>
              <View style={styles.cardTitleRow}>
                <Ionicons name="wallet" size={16} color="#059669" />
                <Text style={styles.cardTitle}>Wallet Balance</Text>
              </View>
              <Text style={styles.balanceText}>{formatCurrency(walletBalance)}</Text>
              <TouchableOpacity 
                style={styles.cardButton}
                onPress={() => navigation.navigate('Wallet')}
              >
                <Ionicons name="add-circle" size={16} color="white" style={styles.buttonIcon} />
                <Text style={styles.buttonText}>Top Up</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Pending Debts Card */}
          <View style={styles.statCard}>
            <LinearGradient
              colors={['#f59e0b', '#d97706']}
              style={styles.cardHeader}
            />
            <View style={styles.cardContent}>
              <View style={styles.cardTitleRow}>
                <Ionicons name="alert-circle" size={16} color="#d97706" />
                <Text style={styles.cardTitle}>Pending Debts</Text>
              </View>
              <Text style={pendingDebtsCount > 0 ? styles.pendingText : styles.noPendingText}>
                {pendingDebtsCount}
              </Text>
              <TouchableOpacity 
                style={pendingDebtsCount > 0 ? styles.warningCardButton : styles.disabledButton}
                onPress={() => navigation.navigate('Debts')}
              >
                {pendingDebtsCount > 0 ? (
                  <>
                    <Ionicons name="card" size={16} color="white" style={styles.buttonIcon} />
                    <Text style={styles.buttonText}>Pay Now</Text>
                  </>
                ) : (
                  <>
                    <Ionicons name="checkmark-circle" size={16} color="white" style={styles.buttonIcon} />
                    <Text style={styles.buttonText}>No Debts</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActions}>
          <QuickActionButton
            icon="flash"
            title="Buy Electricity"
            description="Recharge your prepaid meter"
            onPress={() => navigation.navigate('Recharge')}
            color={['#4f46e5', '#3730a3']}
          />
          
          <QuickActionButton
            icon="alert-triangle"
            title="Pay Debts"
            description="Clear your pending bills"
            onPress={() => navigation.navigate('Debts')}
            color={['#f59e0b', '#d97706']}
          />
          
          <QuickActionButton
            icon="wallet"
            title="Manage Wallet"
            description="Add funds to your wallet"
            onPress={() => navigation.navigate('Wallet')}
            color={['#10b981', '#059669']}
          />
          
          <QuickActionButton
            icon="receipt"
            title="Transaction History"
            description="View your past transactions"
            onPress={() => navigation.navigate('History')}
            color={['#3b82f6', '#2563eb']}
          />
        </View>

        {/* My Meters */}
        <View style={styles.section}>
          <LinearGradient
            colors={['#6366f1', '#4f46e5']}
            style={styles.sectionHeader}
          />
          <View style={styles.sectionContent}>
            <View style={styles.sectionTitleRow}>
              <Text style={styles.sectionTitle}>My Meters</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Meters')}>
                <Text style={styles.viewAllLink}>View All</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.sectionSubtitle}>Select a meter to recharge</Text>
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.metersScroll}
            >
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#4f46e5" />
                  <Text style={styles.loadingText}>Loading your meters...</Text>
                </View>
              ) : recentMeters && recentMeters.length > 0 ? (
                recentMeters.map((meter) => (
                  <MeterCard 
                    key={meter.id} 
                    meter={meter} 
                    onSelect={() => handleMeterSelect(meter)}
                  />
                ))
              ) : (
                <View style={styles.emptyContainer}>
                  <Ionicons name="add-circle" size={40} color="#d1d5db" />
                  <Text style={styles.emptyText}>No meters have been added yet</Text>
                  <TouchableOpacity 
                    style={styles.addButton}
                    onPress={() => navigation.navigate('Meters')}
                  >
                    <Ionicons name="add-circle" size={16} color="white" style={styles.buttonIcon} />
                    <Text style={styles.buttonText}>Add Your First Meter</Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          </View>
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <LinearGradient
            colors={['#0ea5e9', '#0284c7']}
            style={styles.sectionHeader}
          />
          <View style={styles.sectionContent}>
            <View style={styles.sectionTitleRow}>
              <Text style={styles.sectionTitle}>Recent Transactions</Text>
              <TouchableOpacity onPress={() => navigation.navigate('History')}>
                <Text style={[styles.viewAllLink, { color: '#0ea5e9' }]}>View All</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.sectionSubtitle}>Your recent electricity purchases</Text>
            
            <View style={styles.transactionsList}>
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#0ea5e9" />
                  <Text style={styles.loadingText}>Loading your transactions...</Text>
                </View>
              ) : recentTransactions && recentTransactions.length > 0 ? (
                recentTransactions.map((transaction) => (
                  <TransactionCard 
                    key={transaction.id} 
                    transaction={transaction}
                  />
                ))
              ) : (
                <View style={styles.emptyContainer}>
                  <Ionicons name="receipt" size={40} color="#d1d5db" />
                  <Text style={styles.emptyText}>No transactions have been made yet</Text>
                  <TouchableOpacity 
                    style={styles.addButton}
                    onPress={() => navigation.navigate('Recharge')}
                  >
                    <Ionicons name="flash" size={16} color="white" style={styles.buttonIcon} />
                    <Text style={styles.buttonText}>Make First Purchase</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
            
            {recentTransactions && recentTransactions.length > 0 && (
              <TouchableOpacity 
                style={styles.viewAllButton}
                onPress={() => navigation.navigate('History')}
              >
                <Text style={styles.viewAllButtonText}>View All Transactions</Text>
                <Ionicons name="arrow-forward" size={16} color="#3b82f6" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Client Information */}
        <View style={styles.section}>
          <LinearGradient
            colors={['#f97316', '#ea580c']}
            style={styles.sectionHeader}
          />
          <View style={styles.sectionContent}>
            <View style={styles.sectionTitleRow}>
              <Text style={styles.sectionTitle}>Client Information</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                <Text style={[styles.viewAllLink, { color: '#f97316' }]}>Edit Profile</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.sectionSubtitle}>Your personal account details</Text>
            
            <View style={styles.profileContainer}>
              <View style={styles.profileCard}>
                <View style={styles.profileAvatarContainer}>
                  <LinearGradient
                    colors={['#4f46e5', '#1e40af']}
                    style={styles.avatarGradient}
                  >
                    <Text style={styles.avatarText}>
                      {userProfile?.fullName ? userProfile.fullName.charAt(0).toUpperCase() : 'U'}
                    </Text>
                  </LinearGradient>
                </View>
                <View style={styles.profileInfo}>
                  <Text style={styles.profileName}>
                    {userProfile?.fullName || 'Update your profile'}
                  </Text>
                  <Text style={styles.profileContact}>
                    {userProfile?.email || userProfile?.username || 'No contact information'}
                  </Text>
                </View>
              </View>
              
              {userProfile?.address && (
                <View style={styles.contactCard}>
                  <View style={styles.contactRow}>
                    <Ionicons name="location" size={16} color="#4f46e5" />
                    <Text style={styles.contactLabel}>Address</Text>
                  </View>
                  <Text style={styles.contactValue}>{userProfile.address}</Text>
                </View>
              )}
              
              {userProfile?.phone && (
                <View style={styles.contactCard}>
                  <View style={styles.contactRow}>
                    <Ionicons name="call" size={16} color="#4f46e5" />
                    <Text style={styles.contactLabel}>Phone Number</Text>
                  </View>
                  <Text style={styles.contactValue}>{userProfile.phone}</Text>
                </View>
              )}
              
              {!userProfile?.fullName && !userProfile?.address && !userProfile?.phone && (
                <View style={styles.completeProfileCard}>
                  <Ionicons name="person" size={24} color="#4f46e5" style={styles.completeProfileIcon} />
                  <Text style={styles.completeProfileText}>Complete your profile to access all features</Text>
                  <TouchableOpacity 
                    style={styles.completeProfileButton}
                    onPress={() => navigation.navigate('Profile')}
                  >
                    <Text style={styles.completeProfileButtonText}>Complete Your Profile</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Monthly Stats */}
        <View style={styles.section}>
          <LinearGradient
            colors={['#ec4899', '#db2777']}
            style={styles.sectionHeader}
          />
          <View style={styles.sectionContent}>
            <Text style={[styles.sectionTitle, { color: '#ec4899' }]}>Monthly Statistics</Text>
            <Text style={styles.sectionSubtitle}>Your electricity consumption overview</Text>
            
            <View style={styles.statsRow}>
              <View style={styles.statBlock}>
                <View style={styles.statIconRow}>
                  <Ionicons name="card" size={16} color="#ec4899" />
                  <Text style={styles.statLabel}>Total Spent</Text>
                </View>
                <Text style={styles.statValue}>
                  {isLoading ? (
                    <Text style={styles.loadingStats}>Loading...</Text>
                  ) : stats ? (
                    formatCurrency(stats.totalSpent)
                  ) : (
                    "$0.00"
                  )}
                </Text>
              </View>
              
              <View style={styles.statBlock}>
                <View style={styles.statIconRow}>
                  <Ionicons name="receipt" size={16} color="#ec4899" />
                  <Text style={styles.statLabel}>Transactions</Text>
                </View>
                <Text style={styles.statValue}>
                  {isLoading ? (
                    <Text style={styles.loadingStats}>Loading...</Text>
                  ) : stats ? (
                    stats.transactionCount
                  ) : (
                    "0"
                  )}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  scrollContent: {
    padding: 16,
  },
  welcomeCard: {
    borderRadius: 12,
    marginBottom: 20,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  welcomeCardOverlay: {
    padding: 20,
  },
  welcomeCardContent: {
    position: 'relative',
    zIndex: 1,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 16,
  },
  quickButtonsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  warningButton: {
    backgroundColor: 'rgba(245, 158, 11, 0.8)',
  },
  buttonIcon: {
    marginRight: 6,
  },
  buttonText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '500',
  },
  cardsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  cardHeader: {
    height: 6,
    width: '100%',
  },
  cardContent: {
    padding: 12,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: '#4b5563',
  },
  balanceText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#10b981',
    marginBottom: 10,
  },
  pendingText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f59e0b',
    marginBottom: 10,
  },
  noPendingText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6b7280',
    marginBottom: 10,
  },
  cardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#10b981',
    borderRadius: 6,
    paddingVertical: 8,
  },
  warningCardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f59e0b',
    borderRadius: 6,
    paddingVertical: 8,
  },
  disabledButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#d1d5db',
    borderRadius: 6,
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 12,
  },
  quickActions: {
    marginBottom: 20,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  sectionHeader: {
    height: 6,
    width: '100%',
  },
  sectionContent: {
    padding: 16,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  viewAllLink: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4f46e5',
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 12,
  },
  metersScroll: {
    paddingBottom: 8,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    width: '100%',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6b7280',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: 'rgba(243, 244, 246, 0.5)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    width: '100%',
  },
  emptyText: {
    marginTop: 12,
    marginBottom: 16,
    fontSize: 14,
    color: '#6b7280',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4f46e5',
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  transactionsList: {
    gap: 12,
    marginBottom: 12,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 6,
  },
  viewAllButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#3b82f6',
  },
  profileContainer: {
    gap: 12,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  profileAvatarContainer: {
    marginRight: 16,
  },
  avatarGradient: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1f2937',
    marginBottom: 2,
  },
  profileContact: {
    fontSize: 13,
    color: '#6b7280',
  },
  contactCard: {
    padding: 16,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  contactLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4b5563',
  },
  contactValue: {
    fontSize: 13,
    color: '#6b7280',
    paddingLeft: 24,
  },
  completeProfileCard: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'rgba(79, 70, 229, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(79, 70, 229, 0.1)',
  },
  completeProfileIcon: {
    marginBottom: 12,
    opacity: 0.6,
  },
  completeProfileText: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 12,
    textAlign: 'center',
  },
  completeProfileButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(79, 70, 229, 0.2)',
    borderRadius: 6,
  },
  completeProfileButtonText: {
    fontSize: 13,
    color: '#4f46e5',
    fontWeight: '500',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statBlock: {
    flex: 1,
    padding: 16,
    backgroundColor: 'rgba(236, 72, 153, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(236, 72, 153, 0.1)',
  },
  statIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    fontWeight: '500',
    color: '#4b5563',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ec4899',
  },
  loadingStats: {
    fontSize: 16,
    color: '#9ca3af',
  },
});

export default DashboardScreen;