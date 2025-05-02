import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PlusIcon, ArrowDownIcon, ArrowUpIcon, HistoryIcon } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { formatCurrency, formatDate } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import { WalletTransaction } from "@shared/schema";

// Schema for the top-up form
const topUpSchema = z.object({
  amount: z.string()
    .min(1, "Amount is required")
    .refine((val) => parseFloat(val) >= 5, {
      message: "Minimum amount is $5",
    })
    .refine((val) => parseFloat(val) <= 1000, {
      message: "Maximum amount is $1,000",
    }),
});

type TopUpFormData = z.infer<typeof topUpSchema>;

const WalletTransactionItem = ({ transaction }: { transaction: WalletTransaction }) => {
  // Determine if it's a deposit or payment
  const isDeposit = transaction.type === "deposit";
  
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div className="flex items-center">
        <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${
          isDeposit ? "bg-green-100" : "bg-primary-100"
        }`}>
          {isDeposit ? (
            <ArrowDownIcon className="h-4 w-4 text-green-600" />
          ) : (
            <ArrowUpIcon className="h-4 w-4 text-primary" />
          )}
        </div>
        <div>
          <p className="font-medium text-sm">
            {transaction.description || (isDeposit ? "Deposit" : "Payment")}
          </p>
          <p className="text-xs text-gray-500">{formatDate(transaction.createdAt)}</p>
        </div>
      </div>
      <div className={`font-semibold ${isDeposit ? "text-green-600" : ""}`}>
        {isDeposit ? "+" : "-"}{formatCurrency(transaction.amount)}
      </div>
    </div>
  );
};

const WalletScreen = () => {
  const [isTopUpOpen, setIsTopUpOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch wallet balance
  const { data: walletData, isLoading: isWalletLoading } = useQuery<{ balance: number }>({
    queryKey: ['/api/wallet'],
  });
  
  // Fetch wallet transactions
  const { data: walletTransactions, isLoading: isTransactionsLoading } = useQuery<WalletTransaction[]>({
    queryKey: ['/api/wallet/transactions'],
  });
  
  // Form setup
  const form = useForm<TopUpFormData>({
    resolver: zodResolver(topUpSchema),
    defaultValues: {
      amount: "",
    },
  });
  
  // Mutation for wallet top-up
  const topUpMutation = useMutation({
    mutationFn: async (data: TopUpFormData) => {
      const response = await apiRequest("POST", "/api/wallet/add-funds", {
        amount: data.amount
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/wallet'] });
      queryClient.invalidateQueries({ queryKey: ['/api/wallet/transactions'] });
      toast({
        title: "Wallet topped up successfully",
        description: "Your wallet balance has been updated",
      });
      setIsTopUpOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Failed to top up wallet",
        description: "Please try again later",
        variant: "destructive",
      });
    },
  });
  
  const handleTopUp = (data: TopUpFormData) => {
    topUpMutation.mutate(data);
  };
  
  return (
    <div className="slide-in px-4 pt-4 pb-8">
      <h2 className="text-xl font-semibold mb-4">My Wallet</h2>
      
      {/* Wallet Balance Card */}
      <Card className="bg-gradient-to-r from-primary-50 to-blue-50 border-primary/20 mb-6">
        <CardContent className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">Available Balance</p>
              <h3 className="text-3xl font-bold mb-1">
                {isWalletLoading ? (
                  "Loading..."
                ) : (
                  formatCurrency(walletData?.balance || 0)
                )}
              </h3>
              <p className="text-xs text-gray-500">Updated just now</p>
            </div>
            <Button 
              onClick={() => setIsTopUpOpen(true)} 
              className="flex items-center gap-1"
            >
              <PlusIcon className="h-4 w-4" />
              Top Up
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Recent Transactions */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Recent Transactions</CardTitle>
            <Button variant="ghost" size="sm" className="flex items-center gap-1">
              <HistoryIcon className="h-4 w-4" />
              View All
            </Button>
          </div>
          <CardDescription>Your recent wallet activity</CardDescription>
        </CardHeader>
        
        <CardContent className="pb-2">
          {isTransactionsLoading ? (
            <div className="py-8 text-center">Loading transactions...</div>
          ) : walletTransactions && walletTransactions.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {walletTransactions.slice(0, 5).map((transaction) => (
                <WalletTransactionItem key={transaction.id} transaction={transaction} />
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500">
              No transactions yet
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Top Up Dialog */}
      <Dialog open={isTopUpOpen} onOpenChange={setIsTopUpOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Top Up Wallet</DialogTitle>
            <DialogDescription>
              Add funds to your wallet for quick and easy electricity payments.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={form.handleSubmit(handleTopUp)}>
            <div className="py-4">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Amount
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    {...form.register("amount")}
                    className="pl-8"
                    placeholder="0.00"
                    type="number"
                    step="0.01"
                  />
                </div>
                {form.formState.errors.amount && (
                  <p className="text-sm text-red-500 mt-1">
                    {form.formState.errors.amount.message}
                  </p>
                )}
              </div>
              
              <div className="text-sm text-gray-500">
                <p className="mb-1">Quick amounts:</p>
                <div className="grid grid-cols-3 gap-2">
                  {[10, 20, 50, 100, 200, 500].map((amount) => (
                    <Button
                      key={amount}
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => form.setValue("amount", amount.toString())}
                    >
                      ${amount}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsTopUpOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={topUpMutation.isPending}
              >
                {topUpMutation.isPending ? "Processing..." : "Top Up"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WalletScreen;