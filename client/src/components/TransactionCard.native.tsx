import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, FontSize, FontWeight, Spacing } from '../styles/Theme';

// Helper functions
const formatCurrency = (amount: number | string | null | undefined) => {
  if (amount === null || amount === undefined) return '$0.00';
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  return `$${numAmount.toFixed(2)}`;
};

const formatDate = (dateString: string | Date) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Date unavailable';
  }
};

// Placeholder for icons until we implement actual vector icons
const CheckCircleIcon = ({ color }: { color: string }) => (
  <View style={[styles.iconPlaceholder, { backgroundColor: color, borderRadius: 12 }]} />
);

const XCircleIcon = ({ color }: { color: string }) => (
  <View style={[styles.iconPlaceholder, { backgroundColor: color, borderRadius: 12 }]} />
);

const ZapIcon = ({ color }: { color: string }) => (
  <View style={[styles.iconPlaceholder, { backgroundColor: color }]} />
);

// Extended transaction interface to accommodate both DB and mock data
interface ExtendedTransaction {
  id: number;
  type?: string;
  amount: number | string;
  status: string;
  meterNumber?: string;
  timestamp?: string;
  createdAt?: string | Date;
  reference?: string;
  transactionType?: string;
  total?: number | string;
  units?: number | string | null;
  paymentMethod?: string;
  token?: string | null;
  receiptUrl?: string | null;
  userId?: number | null;
}

interface TransactionCardProps {
  transaction: ExtendedTransaction;
  style?: ViewStyle;
}

const TransactionCard = ({ transaction, style }: TransactionCardProps) => {
  // Handle both DB and mock data format
  const isSuccess = transaction.status === "success" || transaction.status === "completed";
  const isRecharge = (transaction.transactionType === "recharge") || (transaction.type === "recharge");
  const isDebtPayment = (transaction.transactionType === "debt_payment") || (transaction.type === "debt_payment");
  
  // Get appropriate styling based on transaction type
  const getTransactionTypeInfo = () => {
    if (isRecharge) {
      return {
        label: "Recharge",
        icon: <ZapIcon color={Colors.primary} />,
        labelStyle: styles.rechargeLabel,
        containerStyle: styles.rechargeContainer
      };
    } else if (isDebtPayment) {
      return {
        label: "Debt Payment",
        icon: <CheckCircleIcon color={Colors.secondary} />,
        labelStyle: styles.debtPaymentLabel,
        containerStyle: styles.debtPaymentContainer
      };
    } else {
      return {
        label: "Transaction",
        icon: <ZapIcon color={Colors.gray600} />,
        labelStyle: styles.defaultLabel,
        containerStyle: styles.defaultContainer
      };
    }
  };
  
  // Safely format the date
  const getFormattedDate = () => {
    try {
      // Use timestamp from mock data or createdAt from DB
      const dateString = transaction.timestamp || transaction.createdAt;
      if (!dateString) return "Date unavailable";
      return formatDate(dateString);
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Date unavailable";
    }
  };
  
  const typeInfo = getTransactionTypeInfo();
  
  return (
    <View style={[styles.container, style]}>
      <View style={styles.cardContent}>
        <View style={[
          styles.iconContainer,
          isSuccess ? styles.successIconContainer : styles.errorIconContainer
        ]}>
          {isSuccess ? (
            <CheckCircleIcon color={Colors.success} />
          ) : (
            <XCircleIcon color={Colors.danger} />
          )}
        </View>
        
        <View style={styles.detailsContainer}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.meterLabel}>
                Meter: {transaction.meterNumber || "N/A"}
              </Text>
              <View style={[styles.typeContainer, typeInfo.containerStyle]}>
                {typeInfo.icon}
                <Text style={[styles.typeLabel, typeInfo.labelStyle]}>
                  {typeInfo.label}
                </Text>
              </View>
            </View>
            <Text style={styles.amountText}>
              {formatCurrency(transaction.amount)}
            </Text>
          </View>
          
          <View style={styles.footerRow}>
            <Text style={styles.dateText}>{getFormattedDate()}</Text>
            <Text style={[
              styles.statusText,
              isSuccess ? styles.successText : styles.errorText
            ]}>
              {isSuccess ? "Success" : "Failed"}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing[4],
    borderRadius: Spacing[3],
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing[4],
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  successIconContainer: {
    backgroundColor: '#ECFDF5', // green-50 to green-100 gradient
  },
  errorIconContainer: {
    backgroundColor: '#FEF2F2', // red-50 to red-100 gradient
  },
  detailsContainer: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing[1],
  },
  meterLabel: {
    fontWeight: FontWeight.medium,
    fontSize: FontSize.base,
    color: Colors.gray900,
  },
  amountText: {
    fontWeight: FontWeight.semibold,
    fontSize: FontSize.lg,
    color: Colors.gray900,
  },
  typeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing[2],
    paddingVertical: Spacing[0.5],
    borderRadius: 9999, // Full rounded
    marginTop: Spacing[1],
  },
  typeLabel: {
    fontSize: FontSize.xs,
    marginLeft: Spacing[1],
  },
  iconPlaceholder: {
    width: 16,
    height: 16,
    marginRight: Spacing[1],
  },
  rechargeContainer: {
    backgroundColor: Colors.primary + '10', // 10% opacity
  },
  rechargeLabel: {
    color: Colors.primary,
  },
  debtPaymentContainer: {
    backgroundColor: Colors.secondary + '10', // 10% opacity
  },
  debtPaymentLabel: {
    color: Colors.secondary,
  },
  defaultContainer: {
    backgroundColor: Colors.gray200,
  },
  defaultLabel: {
    color: Colors.gray600,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing[1],
  },
  dateText: {
    fontSize: FontSize.sm,
    color: Colors.gray500,
  },
  statusText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },
  successText: {
    color: Colors.success,
  },
  errorText: {
    color: Colors.danger,
  },
});

export default TransactionCard;