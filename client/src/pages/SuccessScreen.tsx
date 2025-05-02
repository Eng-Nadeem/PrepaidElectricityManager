import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { CheckCircleIcon, DownloadIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Transaction } from "@shared/schema";

const SuccessScreen = () => {
  const [, navigate] = useLocation();
  
  // Get query parameters
  const params = new URLSearchParams(window.location.search);
  const transactionId = params.get('transactionId');
  const meterNumber = params.get('meterNumber');
  const amountParam = params.get('amount');
  const amount = amountParam ? parseFloat(amountParam) : 0;
  const token = params.get('token') || '';
  
  // Fetch transaction details
  const { data: transaction, isLoading } = useQuery<Transaction>({
    queryKey: ['/api/transactions', transactionId],
    enabled: !!transactionId,
  });
  
  // We'll use transaction data when available, otherwise we'll use the URL params as fallback
  const displayData = transaction || {
    id: transactionId || 0,
    meterNumber: meterNumber || '',
    amount: amount,
    status: 'success',
    createdAt: new Date().toISOString(),
    token: token
  };
  
  const handleDownloadReceipt = () => {
    // In a real app, you would implement actual receipt download functionality
    alert('Receipt download functionality would be implemented here');
  };
  
  const handleDone = () => {
    navigate('/');
  };
  
  // Estimate units based on amount (for display purposes)
  // In a real app, this would come from the API
  const estimatedUnits = (displayData.amount / 0.45).toFixed(1);
  
  return (
    <div className="slide-in h-full flex items-center justify-center">
      <div className="text-center px-4">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircleIcon className="h-10 w-10 text-success" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Payment Successful!</h2>
        <p className="text-gray-500 mb-6">Your meter has been recharged successfully</p>
        
        <Card className="mb-6 mx-auto max-w-xs">
          <CardContent className="p-4">
            <div className="flex justify-between mb-2">
              <span className="text-gray-500">Transaction ID:</span>
              <span className="font-medium">TX{displayData.id}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-500">Meter Number:</span>
              <span className="font-medium">{displayData.meterNumber}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-500">Amount:</span>
              <span className="font-medium">{formatCurrency(displayData.amount)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-500">Units:</span>
              <span className="font-medium">{estimatedUnits} kWh</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Date & Time:</span>
              <span className="font-medium">{formatDate(displayData.createdAt)}</span>
            </div>
          </CardContent>
        </Card>
        
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 text-left">
          <h3 className="font-semibold mb-2">Token Information</h3>
          <p className="text-2xl font-mono text-center bg-white border border-gray-300 rounded py-2 mb-2">
            {displayData.token}
          </p>
          <p className="text-sm text-gray-500">Enter this token into your prepaid meter to complete the recharge</p>
        </div>
        
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="flex-1 flex items-center justify-center"
            onClick={handleDownloadReceipt}
          >
            <DownloadIcon className="h-4 w-4 mr-2" />
            Download Receipt
          </Button>
          <Button 
            className="flex-1"
            onClick={handleDone}
          >
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SuccessScreen;
