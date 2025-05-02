import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { PlusCircleIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MeterCard from "@/components/MeterCard";
import TransactionCard from "@/components/TransactionCard";
import { formatCurrency } from "@/lib/utils";
import { Meter, Transaction } from "@shared/schema";

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

  const handleMeterSelect = (meter: Meter) => {
    navigate(`/recharge?meterId=${meter.id}&meterNumber=${meter.meterNumber}&nickname=${meter.nickname || ''}`);
  };

  return (
    <div className="slide-in px-4 pt-4">
      {/* Quick Recharge */}
      <Card className="mb-4">
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-3">Quick Recharge</h2>
          
          {/* Recent Meters */}
          <div className="mb-4">
            <p className="text-sm text-gray-500 mb-2">Recent Meters</p>
            <div className="flex overflow-x-auto pb-2 gap-2">
              {isMetersLoading ? (
                <div className="py-2 px-4">Loading meters...</div>
              ) : recentMeters && recentMeters.length > 0 ? (
                recentMeters.map((meter) => (
                  <MeterCard 
                    key={meter.id} 
                    meter={meter} 
                    onSelect={handleMeterSelect}
                  />
                ))
              ) : (
                <div className="py-2 px-4 text-sm text-gray-500">No recent meters found</div>
              )}
            </div>
          </div>
          
          <Link href="/recharge">
            <Button className="w-full">
              <PlusCircleIcon className="h-5 w-5 mr-2" />
              New Recharge
            </Button>
          </Link>
        </CardContent>
      </Card>
      
      {/* Recent Transactions */}
      <Card className="mb-4">
        <CardContent className="p-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold">Recent Transactions</h2>
            <Link href="/history">
              <a className="text-primary text-sm font-medium">See All</a>
            </Link>
          </div>
          
          <div className="space-y-3">
            {isTransactionsLoading ? (
              <div>Loading transactions...</div>
            ) : recentTransactions && recentTransactions.length > 0 ? (
              recentTransactions.map((transaction) => (
                <TransactionCard key={transaction.id} transaction={transaction} />
              ))
            ) : (
              <div className="py-4 text-center text-gray-500">No transactions yet</div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Monthly Stats */}
      <Card className="mb-4">
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-3">Monthly Stats</h2>
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
