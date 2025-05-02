import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { 
  PlusCircleIcon, 
  WalletIcon, 
  AlertTriangleIcon, 
  LightbulbIcon,
  ReceiptIcon,
  ArrowRightCircleIcon
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import MeterCard from "@/components/MeterCard";
import TransactionCard from "@/components/TransactionCard";
import { formatCurrency } from "@/lib/utils";
import { Meter, Transaction, Debt, User } from "@shared/schema";

interface QuickActionButtonProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  color?: string;
}

const QuickActionButton = ({ 
  icon, 
  title, 
  description, 
  onClick, 
  color = "bg-primary/10" 
}: QuickActionButtonProps) => (
  <button 
    onClick={onClick}
    className="flex items-center p-3 rounded-lg border border-gray-100 hover:border-primary/30 hover:bg-primary/5 transition-colors"
  >
    <div className={`h-12 w-12 ${color} rounded-lg flex items-center justify-center mr-3`}>
      {icon}
    </div>
    <div className="text-left">
      <h3 className="font-medium text-sm">{title}</h3>
      <p className="text-xs text-gray-500">{description}</p>
    </div>
  </button>
);

const DashboardScreen = () => {
  const [, navigate] = useLocation();

  const { data: recentMeters, isLoading: isMetersLoading } = useQuery<Meter[]>({
    queryKey: ['/api/meters/recent'],
  });

  const { data: recentTransactions, isLoading: isTransactionsLoading } = useQuery<Transaction[]>({
    queryKey: ['/api/transactions/recent'],
  });

  const { data: stats, isLoading: isStatsLoading } = useQuery<{totalSpent: number, transactionCount: number}>({
    queryKey: ['/api/transactions/stats'],
  });
  
  const { data: walletData } = useQuery<{ balance: number }>({
    queryKey: ['/api/wallet'],
  });
  
  const { data: debts } = useQuery<Debt[]>({
    queryKey: ['/api/debts'],
  });
  
  const { data: userProfile } = useQuery<User>({
    queryKey: ['/api/user/profile'],
  });

  const handleMeterSelect = (meter: Meter) => {
    navigate(`/recharge?meterId=${meter.id}&meterNumber=${meter.meterNumber}&nickname=${meter.nickname || ''}`);
  };
  
  const pendingDebtsCount = debts?.filter(debt => !debt.isPaid)?.length || 0;
  const walletBalance = walletData?.balance || 0;

  return (
    <div className="slide-in px-4 pt-4 pb-8">
      {/* Welcome Card */}
      <Card className="mb-4 bg-gradient-to-br from-primary to-primary-dark text-white">
        <CardContent className="p-5">
          <h2 className="text-lg font-semibold mb-1">Welcome{userProfile?.fullName ? `, ${userProfile.fullName.split(' ')[0]}` : ''}</h2>
          <p className="text-sm text-white/80 mb-4">What would you like to do today?</p>
          
          <div className="flex flex-wrap gap-2">
            <Button 
              variant="secondary" 
              size="sm" 
              className="bg-white/20 hover:bg-white/30 text-white border-0"
              onClick={() => navigate('/recharge')}
            >
              Quick Recharge
            </Button>
            <Button 
              variant="secondary" 
              size="sm" 
              className="bg-white/20 hover:bg-white/30 text-white border-0"
              onClick={() => navigate('/wallet')}
            >
              View Wallet
            </Button>
            {pendingDebtsCount > 0 && (
              <Button 
                variant="secondary" 
                size="sm" 
                className="bg-white/20 hover:bg-white/30 text-white border-0"
                onClick={() => navigate('/debts')}
              >
                Pay Debts ({pendingDebtsCount})
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Quick Actions & Stats */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <Card className="col-span-1">
          <CardContent className="p-4">
            <p className="text-sm text-gray-500 mb-1">Wallet Balance</p>
            <p className="text-xl font-semibold">{formatCurrency(walletBalance)}</p>
            <div className="mt-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => navigate('/wallet')}
              >
                <WalletIcon className="h-4 w-4 mr-2" />
                Top Up
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardContent className="p-4">
            <p className="text-sm text-gray-500 mb-1">Pending Debts</p>
            <p className="text-xl font-semibold">{pendingDebtsCount}</p>
            <div className="mt-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => navigate('/debts')}
              >
                <AlertTriangleIcon className="h-4 w-4 mr-2" />
                View Debts
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Quick Actions */}
      <h2 className="text-lg font-semibold mb-3">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
        <QuickActionButton
          icon={<LightbulbIcon className="h-6 w-6 text-primary" />}
          title="Buy Electricity"
          description="Recharge your prepaid meter"
          onClick={() => navigate('/recharge')}
        />
        
        <QuickActionButton
          icon={<AlertTriangleIcon className="h-6 w-6 text-amber-500" />}
          title="Pay Debts"
          description="Clear your pending bills"
          onClick={() => navigate('/debts')}
          color="bg-amber-100"
        />
        
        <QuickActionButton
          icon={<WalletIcon className="h-6 w-6 text-green-600" />}
          title="Manage Wallet"
          description="Add funds to your wallet"
          onClick={() => navigate('/wallet')}
          color="bg-green-100"
        />
        
        <QuickActionButton
          icon={<ReceiptIcon className="h-6 w-6 text-blue-600" />}
          title="Transaction History"
          description="View your past transactions"
          onClick={() => navigate('/history')}
          color="bg-blue-100"
        />
      </div>
      
      {/* Quick Recharge */}
      <Card className="mb-4">
        <CardHeader className="pb-0">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">My Meters</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate('/meters')}>
              View All
            </Button>
          </div>
          <CardDescription>Select a meter to recharge</CardDescription>
        </CardHeader>
        
        <CardContent className="p-4">
          {/* Recent Meters */}
          <div className="flex overflow-x-auto pb-2 gap-2">
            {isMetersLoading ? (
              <div className="py-6 px-4 text-center w-full">
                <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                <p className="text-sm text-gray-500">Loading meters...</p>
              </div>
            ) : recentMeters && recentMeters.length > 0 ? (
              recentMeters.map((meter) => (
                <MeterCard 
                  key={meter.id} 
                  meter={meter} 
                  onSelect={handleMeterSelect}
                />
              ))
            ) : (
              <div className="py-6 px-4 text-center w-full">
                <p className="text-sm text-gray-500 mb-3">No meters found</p>
                <Button onClick={() => navigate('/meters')}>
                  <PlusCircleIcon className="mr-2 h-4 w-4" />
                  Add Meter
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Recent Transactions */}
      <Card className="mb-4">
        <CardHeader className="pb-0">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">Recent Transactions</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => navigate('/history')}>
              View All
            </Button>
          </div>
          <CardDescription>Your recent electricity purchases</CardDescription>
        </CardHeader>
        
        <CardContent className="p-4">
          <div className="space-y-3">
            {isTransactionsLoading ? (
              <div className="py-6 px-4 text-center">
                <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full mx-auto mb-2"></div>
                <p className="text-sm text-gray-500">Loading transactions...</p>
              </div>
            ) : recentTransactions && recentTransactions.length > 0 ? (
              recentTransactions.map((transaction) => (
                <TransactionCard key={transaction.id} transaction={transaction} />
              ))
            ) : (
              <div className="py-6 text-center text-gray-500">No transactions yet</div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="pt-0 pb-4 px-4">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => navigate('/history')}
          >
            View All Transactions
            <ArrowRightCircleIcon className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
      
      {/* Monthly Stats */}
      <Card className="mb-4">
        <CardHeader className="pb-0">
          <CardTitle className="text-lg">Monthly Stats</CardTitle>
          <CardDescription>Your electricity usage this month</CardDescription>
        </CardHeader>
        
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-gray-500 text-sm">Total Spent</p>
              <p className="text-xl font-semibold">
                {isStatsLoading ? (
                  "Loading..."
                ) : stats ? (
                  formatCurrency(stats.totalSpent)
                ) : (
                  "$0.00"
                )}
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-gray-500 text-sm">Transactions</p>
              <p className="text-xl font-semibold">
                {isStatsLoading ? (
                  "Loading..."
                ) : stats ? (
                  stats.transactionCount
                ) : (
                  "0"
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardScreen;
