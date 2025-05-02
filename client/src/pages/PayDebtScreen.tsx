import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { AlertTriangleIcon, CheckCircleIcon, CreditCardIcon, WalletIcon } from "lucide-react";
import { z } from "zod";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  RadioGroup,
  RadioGroupItem
} from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Debt } from "@shared/schema";

const PayDebtScreen = () => {
  const [, navigate] = useLocation();
  const [location] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [paymentMethod, setPaymentMethod] = useState<string>("card");
  
  // Get debt ID from URL
  const debtId = location.split('/').pop();
  
  const { data: debt, isLoading: isDebtLoading } = useQuery<Debt>({
    queryKey: [`/api/debts/${debtId}`],
    queryFn: async () => {
      const response = await apiRequest("GET", `/api/debts/${debtId}`);
      return response.json();
    }
  });
  
  const { data: walletData, isLoading: isWalletLoading } = useQuery<{ balance: number }>({
    queryKey: ['/api/wallet'],
  });
  
  // Payment mutation
  const paymentMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/debts/${debtId}/pay`, {
        paymentMethod
      });
      return response.json();
    },
    onSuccess: () => {
      // Invalidate queries to update UI
      queryClient.invalidateQueries({ queryKey: ['/api/debts'] });
      queryClient.invalidateQueries({ queryKey: ['/api/wallet'] });
      queryClient.invalidateQueries({ queryKey: ['/api/transactions/recent'] });
      
      // Show success message
      toast({
        title: "Payment Successful",
        description: "Your debt has been paid successfully",
      });
      
      // Navigate to success page
      navigate('/success?type=debt');
    },
    onError: (error: any) => {
      // Show error message
      toast({
        title: "Payment Failed",
        description: error.message || "There was an error processing your payment",
        variant: "destructive",
      });
    }
  });
  
  const handlePayNow = () => {
    // If wallet method is selected but balance is insufficient
    if (paymentMethod === 'wallet' && 
        walletData && 
        debt && 
        walletData.balance < parseFloat(debt.amount.toString())) {
      toast({
        title: "Insufficient Wallet Balance",
        description: "Please top up your wallet or choose a different payment method",
        variant: "destructive",
      });
      return;
    }
    
    // Process payment
    paymentMutation.mutate();
  };
  
  // Check if wallet has sufficient balance
  const hasSufficientBalance = walletData && debt && 
    walletData.balance >= parseFloat(debt.amount.toString());
  
  if (isDebtLoading) {
    return (
      <div className="slide-in px-4 pt-6 flex flex-col items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
        <p className="text-gray-600">Loading debt details...</p>
      </div>
    );
  }
  
  if (!debt) {
    return (
      <div className="slide-in px-4 pt-6">
        <Card>
          <CardContent className="p-8 text-center">
            <AlertTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Debt Not Found</h2>
            <p className="text-gray-600 mb-6">We couldn't find the debt you're looking for.</p>
            <Button onClick={() => navigate('/debts')}>
              Go Back to Debts
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="slide-in px-4 pt-4 pb-8">
      <h2 className="text-xl font-semibold mb-4">Pay Electricity Debt</h2>
      
      {/* Debt Details */}
      <Card className="mb-6 bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200">
        <CardContent className="p-5">
          <div className="flex items-start gap-4">
            <div className="bg-amber-200/60 rounded-full p-3">
              <AlertTriangleIcon className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <h3 className="font-medium mb-1">Outstanding Balance</h3>
              <p className="text-2xl font-bold mb-1">{formatCurrency(debt.amount)}</p>
              <p className="text-sm text-gray-600">Due by {formatDate(debt.dueDate)}</p>
              <p className="text-sm text-gray-600 mt-2">Meter: {debt.meterNumber}</p>
              {debt.description && (
                <p className="text-sm mt-2 text-gray-700">{debt.description}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Payment Method */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Payment Method</CardTitle>
          <CardDescription>Select how you'd like to pay</CardDescription>
        </CardHeader>
        
        <CardContent>
          <RadioGroup 
            value={paymentMethod} 
            onValueChange={setPaymentMethod} 
            className="space-y-3"
          >
            <div className="flex items-center space-x-2 border p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
              <RadioGroupItem value="card" id="card" />
              <Label htmlFor="card" className="flex-1 cursor-pointer">
                <div className="flex items-center">
                  <CreditCardIcon className="h-5 w-5 text-gray-600 mr-3" />
                  <div>
                    <p className="font-medium">Credit/Debit Card</p>
                    <p className="text-sm text-gray-500">Pay using your card</p>
                  </div>
                </div>
              </Label>
            </div>
            
            <div className={`flex items-center space-x-2 border p-3 rounded-lg hover:bg-gray-50 cursor-pointer ${!hasSufficientBalance ? 'opacity-60' : ''}`}>
              <RadioGroupItem value="wallet" id="wallet" disabled={!hasSufficientBalance} />
              <Label htmlFor="wallet" className="flex-1 cursor-pointer">
                <div className="flex items-center">
                  <WalletIcon className="h-5 w-5 text-gray-600 mr-3" />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">Wallet Balance</p>
                      {!isWalletLoading && walletData && (
                        <span className="text-sm bg-gray-100 px-2 py-1 rounded">
                          {formatCurrency(walletData.balance)}
                        </span>
                      )}
                    </div>
                    {hasSufficientBalance ? (
                      <p className="text-sm text-gray-500">Pay using your wallet balance</p>
                    ) : (
                      <p className="text-sm text-red-500">Insufficient balance</p>
                    )}
                  </div>
                </div>
              </Label>
            </div>
          </RadioGroup>
        </CardContent>
        
        <CardFooter className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => navigate('/debts')}>
            Cancel
          </Button>
          <Button 
            onClick={handlePayNow}
            disabled={paymentMutation.isPending}
          >
            {paymentMutation.isPending ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Processing...
              </>
            ) : (
              <>Pay Now {formatCurrency(debt.amount)}</>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PayDebtScreen;