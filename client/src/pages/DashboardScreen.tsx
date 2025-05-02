import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { 
  PlusCircleIcon, 
  WalletIcon, 
  AlertTriangleIcon, 
  LightbulbIcon,
  ReceiptIcon,
  ArrowRightCircleIcon,
  MapPinIcon,
  PhoneIcon,
  UserCogIcon,
  CreditCardIcon,
  BellIcon,
  BadgeCheckIcon
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
    className="flex items-center p-4 rounded-xl border border-gray-100 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300 card-shadow hover:shadow-md"
  >
    <div className={`h-14 w-14 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center mr-4 shadow-sm`}>
      {icon}
    </div>
    <div className="text-left">
      <h3 className="font-medium text-sm mb-1">{title}</h3>
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
      <Card className="mb-5 overflow-hidden card-shadow border-0">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-blue-600"></div>
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] bg-[length:20px_20px]"></div>
          <CardContent className="p-6 relative text-white">
            <h2 className="text-xl font-semibold mb-1">Welcome{userProfile?.fullName ? `, ${userProfile.fullName.split(' ')[0]}` : ''}!</h2>
            <p className="text-sm text-white/90 mb-5">What would you like to do today?</p>
            
            <div className="flex flex-wrap gap-2">
              <Button 
                variant="secondary" 
                size="sm" 
                className="bg-white/20 hover:bg-white/30 text-white border-0 shadow-sm hover:shadow-md transition-all"
                onClick={() => navigate('/recharge')}
              >
                <LightbulbIcon className="h-4 w-4 mr-2" />
                Quick Recharge
              </Button>
              <Button 
                variant="secondary" 
                size="sm" 
                className="bg-white/20 hover:bg-white/30 text-white border-0 shadow-sm hover:shadow-md transition-all"
                onClick={() => navigate('/wallet')}
              >
                <WalletIcon className="h-4 w-4 mr-2" />
                View Wallet
              </Button>
              {pendingDebtsCount > 0 && (
                <Button 
                  variant="secondary" 
                  size="sm" 
                  className="bg-white/20 hover:bg-white/30 text-white border-0 shadow-sm hover:shadow-md transition-all"
                  onClick={() => navigate('/debts')}
                >
                  <AlertTriangleIcon className="h-4 w-4 mr-2" />
                  Pay Debts ({pendingDebtsCount})
                </Button>
              )}
            </div>
          </CardContent>
        </div>
      </Card>
      
      {/* Quick Actions & Stats */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        <Card className="col-span-1 border-0 card-shadow overflow-hidden">
          <div className="h-1 bg-green-500"></div>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <WalletIcon className="h-4 w-4 text-green-600" />
              <p className="text-sm font-medium text-gray-700">Wallet Balance</p>
            </div>
            <p className="text-2xl font-semibold text-gradient mb-1">{formatCurrency(walletBalance)}</p>
            <div className="mt-3">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full border-green-100 text-green-600 hover:bg-green-50"
                onClick={() => navigate('/wallet')}
              >
                <PlusCircleIcon className="h-4 w-4 mr-2" />
                Top Up
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1 border-0 card-shadow overflow-hidden">
          <div className="h-1 bg-amber-500"></div>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangleIcon className="h-4 w-4 text-amber-600" />
              <p className="text-sm font-medium text-gray-700">Pending Debts</p>
            </div>
            <p className="text-2xl font-semibold mb-1">
              <span className={pendingDebtsCount > 0 ? "text-amber-600" : "text-gray-600"}>
                {pendingDebtsCount}
              </span>
            </p>
            <div className="mt-3">
              <Button 
                variant="outline" 
                size="sm" 
                className={`w-full ${pendingDebtsCount > 0 ? "border-amber-100 text-amber-600 hover:bg-amber-50" : "border-gray-200"}`}
                onClick={() => navigate('/debts')}
              >
                {pendingDebtsCount > 0 ? (
                  <>
                    <CreditCardIcon className="h-4 w-4 mr-2" />
                    Pay Now
                  </>
                ) : (
                  <>
                    <BadgeCheckIcon className="h-4 w-4 mr-2" />
                    No Debts
                  </>
                )}
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
      
      {/* Client Information */}
      <Card className="mb-4 border-0 card-shadow overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-blue-600 to-primary"></div>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg text-gradient">Client Information</CardTitle>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/profile')}
              className="text-primary hover:text-primary/90 hover:bg-primary/5"
            >
              <UserCogIcon className="h-4 w-4 mr-1" />
              Edit Profile
            </Button>
          </div>
          <CardDescription>Your personal account details</CardDescription>
        </CardHeader>
        
        <CardContent className="p-5">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center p-4 bg-gray-50 rounded-xl border border-gray-100 card-shadow">
              <Avatar className="h-12 w-12 mr-4 border-2 border-primary/10">
                <AvatarFallback className="bg-gradient-to-r from-primary to-blue-600 text-white font-medium">
                  {userProfile?.fullName ? userProfile.fullName.charAt(0).toUpperCase() : 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-medium text-gray-800">
                  {userProfile?.fullName || 'Update your profile'}
                </h3>
                <p className="text-sm text-gray-500">
                  {userProfile?.email || userProfile?.username || 'No contact information'}
                </p>
              </div>
            </div>
            
            {userProfile?.address && (
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 card-shadow">
                <div className="flex gap-2 items-center mb-2">
                  <MapPinIcon className="h-4 w-4 text-primary/80"/>
                  <p className="text-sm font-medium text-gray-700">Address</p>
                </div>
                <p className="text-sm pl-6">{userProfile.address}</p>
              </div>
            )}
            
            {userProfile?.phone && (
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 card-shadow">
                <div className="flex gap-2 items-center mb-2">
                  <PhoneIcon className="h-4 w-4 text-primary/80"/>
                  <p className="text-sm font-medium text-gray-700">Phone Number</p>
                </div>
                <p className="text-sm pl-6">{userProfile.phone}</p>
              </div>
            )}
            
            {!userProfile?.fullName && !userProfile?.address && !userProfile?.phone && (
              <div className="text-center p-4 bg-primary/5 rounded-xl border border-primary/10">
                <UserCogIcon className="h-6 w-6 text-primary/60 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-3">Complete your profile to access all features</p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/profile')}
                  className="border-primary/20 text-primary hover:bg-primary/5"
                >
                  Complete Your Profile
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Monthly Stats */}
      <Card className="mb-4 border-0 card-shadow overflow-hidden">
        <div className="h-1 bg-gradient-to-r from-primary to-blue-600"></div>
        <CardHeader className="pb-0">
          <CardTitle className="text-lg text-gradient">Monthly Statistics</CardTitle>
          <CardDescription>Your electricity consumption overview</CardDescription>
        </CardHeader>
        
        <CardContent className="p-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 card-shadow">
              <div className="flex items-center gap-2 mb-1">
                <CreditCardIcon className="h-4 w-4 text-primary" />
                <p className="text-gray-600 text-sm font-medium">Total Spent</p>
              </div>
              <p className="text-2xl font-semibold text-gradient">
                {isStatsLoading ? (
                  <span className="text-gray-400 text-lg">Loading...</span>
                ) : stats ? (
                  formatCurrency(stats.totalSpent)
                ) : (
                  "$0.00"
                )}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 card-shadow">
              <div className="flex items-center gap-2 mb-1">
                <ReceiptIcon className="h-4 w-4 text-primary" />
                <p className="text-gray-600 text-sm font-medium">Transactions</p>
              </div>
              <p className="text-2xl font-semibold text-gradient">
                {isStatsLoading ? (
                  <span className="text-gray-400 text-lg">Loading...</span>
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
