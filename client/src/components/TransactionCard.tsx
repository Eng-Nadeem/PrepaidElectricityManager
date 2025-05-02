import { CheckCircleIcon, XCircleIcon, ZapIcon } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Transaction } from "@shared/schema";

interface TransactionCardProps {
  transaction: Transaction;
  className?: string;
}

const TransactionCard = ({ transaction, className = "" }: TransactionCardProps) => {
  const isSuccess = transaction.status === "success";
  const isRecharge = transaction.transactionType === "recharge";
  const isDebtPayment = transaction.transactionType === "debt_payment";
  
  // Get appropriate icon and styling based on transaction type
  const getTransactionTypeInfo = () => {
    if (isRecharge) {
      return {
        label: "Recharge",
        icon: <ZapIcon className="h-4 w-4 mr-1" />,
        className: "text-blue-600 bg-blue-50"
      };
    } else if (isDebtPayment) {
      return {
        label: "Debt Payment",
        icon: <CheckCircleIcon className="h-4 w-4 mr-1" />,
        className: "text-indigo-600 bg-indigo-50"
      };
    } else {
      return {
        label: "Transaction",
        icon: <ZapIcon className="h-4 w-4 mr-1" />,
        className: "text-gray-600 bg-gray-50"
      };
    }
  };
  
  const typeInfo = getTransactionTypeInfo();
  
  return (
    <div className={`p-4 rounded-lg ${className}`}>
      <div className="flex items-start">
        <div className={`w-12 h-12 rounded-full ${isSuccess ? 'bg-gradient-to-br from-green-100 to-green-200' : 'bg-gradient-to-br from-red-100 to-red-200'} flex items-center justify-center mr-4 shadow-sm`}>
          {isSuccess ? (
            <CheckCircleIcon className="h-6 w-6 text-success" />
          ) : (
            <XCircleIcon className="h-6 w-6 text-error" />
          )}
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start mb-1">
            <div>
              <span className="font-medium text-gray-900 block">
                Meter: {transaction.meterNumber}
              </span>
              <span className={`inline-flex items-center text-xs px-2 py-0.5 mt-1 rounded-full ${typeInfo.className}`}>
                {typeInfo.icon}
                {typeInfo.label}
              </span>
            </div>
            <span className="font-semibold text-lg">
              {formatCurrency(transaction.amount)}
            </span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span className="text-gray-500">{formatDate(transaction.createdAt)}</span>
            <span className={`font-medium ${isSuccess ? "text-success" : "text-error"}`}>
              {isSuccess ? "Success" : "Failed"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;
