import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { metersApi, debtsApi, walletApi, transactionsApi, userApi } from '../api/api';
import type { Meter, Debt, Transaction, WalletTransaction, User } from '../api/api';

// Context type definition
interface ApiContextType {
  // Data
  meters: Meter[];
  debts: Debt[];
  transactions: Transaction[];
  walletTransactions: WalletTransaction[];
  walletBalance: number;
  userProfile: User | null;
  
  // Loading states
  isLoadingMeters: boolean;
  isLoadingDebts: boolean;
  isLoadingTransactions: boolean;
  isLoadingWallet: boolean;
  isLoadingProfile: boolean;
  
  // Error states
  metersError: string | null;
  debtsError: string | null;
  transactionsError: string | null;
  walletError: string | null;
  profileError: string | null;
  
  // Actions
  refreshMeters: () => Promise<void>;
  refreshDebts: () => Promise<void>;
  refreshTransactions: () => Promise<void>;
  refreshWallet: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  refreshAll: () => Promise<void>;
}

// Create context with default values
const ApiContext = createContext<ApiContextType>({
  // Default data
  meters: [],
  debts: [],
  transactions: [],
  walletTransactions: [],
  walletBalance: 0,
  userProfile: null,
  
  // Default loading states
  isLoadingMeters: false,
  isLoadingDebts: false,
  isLoadingTransactions: false,
  isLoadingWallet: false,
  isLoadingProfile: false,
  
  // Default error states
  metersError: null,
  debtsError: null,
  transactionsError: null,
  walletError: null,
  profileError: null,
  
  // Default actions (empty functions)
  refreshMeters: async () => {},
  refreshDebts: async () => {},
  refreshTransactions: async () => {},
  refreshWallet: async () => {},
  refreshProfile: async () => {},
  refreshAll: async () => {},
});

// Provider props
interface ApiProviderProps {
  children: ReactNode;
}

// Provider component
export const ApiProvider: React.FC<ApiProviderProps> = ({ children }) => {
  // Data states
  const [meters, setMeters] = useState<Meter[]>([]);
  const [debts, setDebts] = useState<Debt[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [walletTransactions, setWalletTransactions] = useState<WalletTransaction[]>([]);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  
  // Loading states
  const [isLoadingMeters, setIsLoadingMeters] = useState<boolean>(false);
  const [isLoadingDebts, setIsLoadingDebts] = useState<boolean>(false);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState<boolean>(false);
  const [isLoadingWallet, setIsLoadingWallet] = useState<boolean>(false);
  const [isLoadingProfile, setIsLoadingProfile] = useState<boolean>(false);
  
  // Error states
  const [metersError, setMetersError] = useState<string | null>(null);
  const [debtsError, setDebtsError] = useState<string | null>(null);
  const [transactionsError, setTransactionsError] = useState<string | null>(null);
  const [walletError, setWalletError] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  
  // Fetch meters
  const refreshMeters = async () => {
    setIsLoadingMeters(true);
    setMetersError(null);
    
    try {
      const response = await metersApi.getMeters();
      if (response.data) {
        setMeters(response.data);
      } else if (response.error) {
        setMetersError(response.error);
      }
    } catch (error) {
      setMetersError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsLoadingMeters(false);
    }
  };
  
  // Fetch debts
  const refreshDebts = async () => {
    setIsLoadingDebts(true);
    setDebtsError(null);
    
    try {
      const response = await debtsApi.getDebts();
      if (response.data) {
        setDebts(response.data);
      } else if (response.error) {
        setDebtsError(response.error);
      }
    } catch (error) {
      setDebtsError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsLoadingDebts(false);
    }
  };
  
  // Fetch transactions
  const refreshTransactions = async () => {
    setIsLoadingTransactions(true);
    setTransactionsError(null);
    
    try {
      const response = await transactionsApi.getTransactions();
      if (response.data) {
        setTransactions(response.data);
      } else if (response.error) {
        setTransactionsError(response.error);
      }
    } catch (error) {
      setTransactionsError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsLoadingTransactions(false);
    }
  };
  
  // Fetch wallet data
  const refreshWallet = async () => {
    setIsLoadingWallet(true);
    setWalletError(null);
    
    try {
      // Fetch wallet balance
      const balanceResponse = await walletApi.getBalance();
      if (balanceResponse.data) {
        setWalletBalance(balanceResponse.data.balance);
      }
      
      // Fetch wallet transactions
      const transactionsResponse = await walletApi.getTransactions();
      if (transactionsResponse.data) {
        setWalletTransactions(transactionsResponse.data);
      }
      
      if (balanceResponse.error || transactionsResponse.error) {
        setWalletError(balanceResponse.error || transactionsResponse.error || 'Unknown error');
      }
    } catch (error) {
      setWalletError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsLoadingWallet(false);
    }
  };
  
  // Fetch user profile
  const refreshProfile = async () => {
    setIsLoadingProfile(true);
    setProfileError(null);
    
    try {
      const response = await userApi.getProfile();
      if (response.data) {
        setUserProfile(response.data);
      } else if (response.error) {
        setProfileError(response.error);
      }
    } catch (error) {
      setProfileError(error instanceof Error ? error.message : 'Unknown error');
    } finally {
      setIsLoadingProfile(false);
    }
  };
  
  // Refresh all data
  const refreshAll = async () => {
    await Promise.all([
      refreshMeters(),
      refreshDebts(),
      refreshTransactions(),
      refreshWallet(),
      refreshProfile(),
    ]);
  };
  
  // Load initial data
  useEffect(() => {
    refreshAll();
  }, []);
  
  // Context value
  const value: ApiContextType = {
    // Data
    meters,
    debts,
    transactions,
    walletTransactions,
    walletBalance,
    userProfile,
    
    // Loading states
    isLoadingMeters,
    isLoadingDebts,
    isLoadingTransactions,
    isLoadingWallet,
    isLoadingProfile,
    
    // Error states
    metersError,
    debtsError,
    transactionsError,
    walletError,
    profileError,
    
    // Actions
    refreshMeters,
    refreshDebts,
    refreshTransactions,
    refreshWallet,
    refreshProfile,
    refreshAll,
  };
  
  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
};

// Custom hook to use the API context
export const useApi = () => useContext(ApiContext);

export default ApiContext;