import { CheckIcon, XIcon } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Transaction } from "@shared/schema";

interface TransactionCardProps {
  transaction: Transaction;
}

const TransactionCard = ({ transaction }: TransactionCardProps) => {
  const isSuccess = transaction.status === "success";
  
  return (
    <div className="flex items-center border-b border-gray-100 pb-3">
      <div className={`w-10 h-10 rounded-full ${isSuccess ? 'bg-green-100' : 'bg-red-100'} flex items-center justify-center mr-3`}>
        {isSuccess ? (
          <CheckIcon className="h-5 w-5 text-success" />
        ) : (
          <XIcon className="h-5 w-5 text-error" />
        )}
      </div>
      <div className="flex-1">
        <div className="flex justify-between">
          <span className="font-medium">Meter: {transaction.meterNumber}</span>
          <span className="font-semibold">{formatCurrency(transaction.amount)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-500">
          <span>{formatDate(transaction.createdAt)}</span>
          <span className={isSuccess ? "text-success" : "text-error"}>
            {isSuccess ? "Success" : "Failed"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TransactionCard;
