import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { AlertTriangleIcon, CheckCircleIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Debt } from "@shared/schema";

const DebtCard = ({ debt, onPayNow }: { debt: Debt, onPayNow: (debt: Debt) => void }) => {
  const daysUntilDue = Math.ceil(
    (new Date(debt.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );
  
  const isOverdue = daysUntilDue < 0;
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-4 mb-3">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold">{debt.meterNumber}</h3>
          <p className="text-sm text-gray-500">{debt.description}</p>
        </div>
        {isOverdue ? (
          <div className="flex items-center text-red-500 text-sm">
            <AlertTriangleIcon className="h-4 w-4 mr-1" />
            <span>Overdue</span>
          </div>
        ) : (
          <div className="text-sm text-gray-500">
            Due in {daysUntilDue} days
          </div>
        )}
      </div>
      
      <div className="border-t border-gray-100 pt-3 mt-2">
        <div className="flex justify-between mb-2">
          <span className="text-gray-500 text-sm">Amount Due:</span>
          <span className="font-semibold">{formatCurrency(debt.amount)}</span>
        </div>
        <div className="flex justify-between mb-3">
          <span className="text-gray-500 text-sm">Due Date:</span>
          <span>{formatDate(debt.dueDate)}</span>
        </div>
        
        <Button 
          className="w-full" 
          onClick={() => onPayNow(debt)}
          variant={isOverdue ? "destructive" : "default"}
        >
          Pay Now
        </Button>
      </div>
    </div>
  );
};

const DebtsScreen = () => {
  const [, navigate] = useLocation();
  const [filter, setFilter] = useState<string>("pending");
  
  const { data: debts, isLoading } = useQuery<Debt[]>({
    queryKey: ['/api/debts'],
  });
  
  const pendingDebts = debts?.filter(debt => !debt.isPaid) || [];
  const paidDebts = debts?.filter(debt => debt.isPaid) || [];
  
  const filteredDebts = filter === "pending" ? pendingDebts : paidDebts;
  
  const handlePayNow = (debt: Debt) => {
    navigate(`/pay-debt/${debt.id}`);
  };
  
  return (
    <div className="slide-in px-4 pt-4">
      <h2 className="text-xl font-semibold mb-4">Electricity Debts</h2>
      
      <Tabs defaultValue="pending" onValueChange={setFilter}>
        <TabsList className="w-full mb-4">
          <TabsTrigger value="pending" className="flex-1">
            Pending ({pendingDebts.length})
          </TabsTrigger>
          <TabsTrigger value="paid" className="flex-1">
            Paid ({paidDebts.length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value={filter}>
          <Card>
            <CardContent className="p-4">
              {isLoading ? (
                <div className="py-8 text-center">Loading debts...</div>
              ) : filteredDebts.length > 0 ? (
                <div>
                  {filteredDebts.map((debt) => (
                    <DebtCard 
                      key={debt.id} 
                      debt={debt} 
                      onPayNow={handlePayNow}
                    />
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center">
                  {filter === "pending" ? (
                    <div className="max-w-sm mx-auto">
                      <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <CheckCircleIcon className="h-8 w-8 text-green-500" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">No Pending Debts</h3>
                      <p className="text-gray-500 text-sm">
                        You don't have any unpaid electricity bills at the moment.
                      </p>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500">
                      No paid debts found
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DebtsScreen;