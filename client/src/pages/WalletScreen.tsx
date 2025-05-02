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
  
  // Calculate stats from transactions
  const totalDeposits = walletTransactions 
    ? walletTransactions
        .filter(t => t.type === 'deposit')
        .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0)
    : 0;
    
  const totalSpent = walletTransactions 
    ? walletTransactions
        .filter(t => t.type === 'payment')
        .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0)
    : 0;
  
  return (
    <div className="slide-in px-4 pt-4 pb-8">
      <h2 className="text-xl font-semibold mb-5 text-gradient">My Wallet</h2>
      
      {/* Wallet Balance Card */}
      <Card className="overflow-hidden mb-6 border-0 card-shadow-lg">
        <div className="bg-gradient-to-r from-primary to-indigo-600 px-6 pt-6 pb-12 text-white relative bg-pattern-dots">
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full"></div>
          <div className="absolute -bottom-5 -left-10 w-24 h-24 bg-white/5 rounded-full"></div>
          <div className="absolute top-2 right-2 w-16 h-16 rounded-full bg-white/10"></div>
          <div className="absolute top-10 right-10 w-8 h-8 rounded-full bg-white/10"></div>
          
          <div className="relative z-10">
            <h3 className="text-lg font-medium text-white/90 mb-1">Available Balance</h3>
            <div className="text-4xl font-bold mb-2">
              {isWalletLoading ? (
                <div className="h-10 w-32 bg-white/20 animate-pulse rounded-md"></div>
              ) : (
                formatCurrency(walletData?.balance || 0)
              )}
            </div>
            
            <div className="flex text-white/80 text-sm">
              <span>PowerPay Wallet</span>
              <span className="mx-2">•</span>
              <span>Updated just now</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white px-6 py-4 flex justify-between -mt-4 rounded-t-2xl relative z-10 shadow-sm">
          <Button 
            onClick={() => setIsTopUpOpen(true)} 
            className="gap-1 btn-gradient"
          >
            <PlusIcon className="h-4 w-4" />
            Add Money
          </Button>
          
          {!isWalletLoading && (
            <div className="flex gap-6">
              <div className="text-center">
                <p className="text-xs text-gray-500 font-medium mb-1">Total Added</p>
                <p className="font-semibold text-green-600">{formatCurrency(totalDeposits)}</p>
              </div>
              
              <div className="text-center">
                <p className="text-xs text-gray-500 font-medium mb-1">Total Spent</p>
                <p className="font-semibold text-red-600">{formatCurrency(totalSpent)}</p>
              </div>
            </div>
          )}
        </div>
      </Card>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <Card className="text-center cursor-pointer hover:border-primary/50 transition-colors">
          <CardContent className="p-3">
            <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
              <ArrowUpIcon className="h-5 w-5 text-primary" />
            </div>
            <p className="text-xs font-medium">Send</p>
          </CardContent>
        </Card>
        
        <Card className="text-center cursor-pointer hover:border-primary/50 transition-colors">
          <CardContent className="p-3">
            <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
              <ArrowDownIcon className="h-5 w-5 text-primary" />
            </div>
            <p className="text-xs font-medium">Receive</p>
          </CardContent>
        </Card>
        
        <Card className="text-center cursor-pointer hover:border-primary/50 transition-colors"
          onClick={() => setIsTopUpOpen(true)}>
          <CardContent className="p-3">
            <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
              <PlusIcon className="h-5 w-5 text-primary" />
            </div>
            <p className="text-xs font-medium">Top Up</p>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Transactions */}
      <Card className="border-0 shadow-md">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-semibold bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
              Recent Transactions
            </CardTitle>
            <Button variant="ghost" size="sm" className="flex items-center gap-1 text-primary">
              <HistoryIcon className="h-4 w-4" />
              View All
            </Button>
          </div>
          <CardDescription>Your recent wallet activity</CardDescription>
        </CardHeader>
        
        <CardContent className="pb-2">
          {isTransactionsLoading ? (
            <div className="py-8 flex flex-col items-center justify-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mb-2"></div>
              <p className="text-sm text-gray-500">Loading transactions...</p>
            </div>
          ) : walletTransactions && walletTransactions.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {walletTransactions.slice(0, 5).map((transaction) => (
                <WalletTransactionItem key={transaction.id} transaction={transaction} />
              ))}
            </div>
          ) : (
            <div className="py-10 text-center">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                <HistoryIcon className="h-8 w-8 text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium mb-1">No Transactions Yet</p>
              <p className="text-gray-500 text-sm mb-4">Add funds to your wallet to get started</p>
              <Button 
                onClick={() => setIsTopUpOpen(true)} 
                variant="outline"
                size="sm"
              >
                <PlusIcon className="h-4 w-4 mr-2" />
                Top Up Now
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Top Up Dialog */}
      <Dialog open={isTopUpOpen} onOpenChange={setIsTopUpOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader className="text-center">
            <DialogTitle className="text-xl bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">
              Add Money to Wallet
            </DialogTitle>
            <DialogDescription>
              Top up your wallet for seamless electricity payments
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={form.handleSubmit(handleTopUp)}>
            <div className="py-4">
              <div className="mb-6">
                <div className="relative">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 pl-3 text-gray-500 text-xl font-bold">$</div>
                  <Input
                    {...form.register("amount")}
                    className="pl-10 h-14 text-2xl font-bold text-center bg-gray-50 border-2 focus-visible:ring-primary"
                    placeholder="0.00"
                    type="number"
                    step="0.01"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <Button
                      size="sm"
                      variant="ghost"
                      type="button"
                      className="h-8 px-2 text-primary"
                      onClick={() => form.setValue("amount", "")}
                    >
                      Clear
                    </Button>
                  </div>
                </div>
                {form.formState.errors.amount && (
                  <p className="text-sm text-red-500 mt-1 text-center">
                    {form.formState.errors.amount.message}
                  </p>
                )}
              </div>
              
              <div className="space-y-5">
                <p className="text-sm font-medium text-gray-500 text-center mb-2">Quick amounts</p>
                
                <div className="grid grid-cols-3 gap-3">
                  {[10, 20, 50].map((amount) => (
                    <Button
                      key={amount}
                      type="button"
                      variant="outline"
                      size="lg"
                      className={`h-16 text-lg font-medium rounded-xl ${
                        form.watch("amount") === amount.toString()
                          ? "border-primary bg-primary/5 text-primary"
                          : ""
                      }`}
                      onClick={() => form.setValue("amount", amount.toString())}
                    >
                      ${amount}
                    </Button>
                  ))}
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  {[100, 200, 500].map((amount) => (
                    <Button
                      key={amount}
                      type="button"
                      variant="outline"
                      size="lg"
                      className={`h-16 text-lg font-medium rounded-xl ${
                        form.watch("amount") === amount.toString()
                          ? "border-primary bg-primary/5 text-primary"
                          : ""
                      }`}
                      onClick={() => form.setValue("amount", amount.toString())}
                    >
                      ${amount}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="bg-primary/5 rounded-xl p-3 my-5 flex items-center">
                <div className="bg-primary/10 rounded-full p-2 mr-3">
                  <PlusIcon className="h-5 w-5 text-primary" />
                </div>
                <div className="text-sm">
                  <p className="font-medium">Instant Credit</p>
                  <p className="text-gray-500">Funds are available immediately after top-up</p>
                </div>
              </div>
            </div>
            
            <DialogFooter className="flex-col gap-2">
              <Button 
                type="submit" 
                size="lg"
                disabled={topUpMutation.isPending}
                className="w-full bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-700 text-white border-0"
              >
                {topUpMutation.isPending ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Processing...
                  </div>
                ) : (
                  `Add ${form.watch("amount") ? "$" + form.watch("amount") : "Money"} to Wallet`
                )}
              </Button>
              
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsTopUpOpen(false)}
                size="sm"
                className="w-full text-gray-500"
              >
                Cancel
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WalletScreen;