import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { 
  AlertTriangleIcon, 
  ArrowRightIcon, 
  CheckCircleIcon, 
  ClockIcon, 
  RefreshCcwIcon,
  SearchIcon
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Debt } from "@shared/schema";

// Debt card component
const DebtCard = ({ debt, onPayNow }: { debt: Debt, onPayNow: (debt: Debt) => void }) => {
  return (
    <Card className="mb-3 overflow-hidden">
      <div className={`h-1 ${debt.isPaid ? 'bg-green-500' : 'bg-amber-500'}`} />
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              {debt.isPaid ? (
                <span className="flex items-center text-green-600 text-xs font-medium bg-green-50 px-2 py-0.5 rounded-full">
                  <CheckCircleIcon className="h-3 w-3 mr-1" />
                  Paid
                </span>
              ) : (
                <span className="flex items-center text-amber-600 text-xs font-medium bg-amber-50 px-2 py-0.5 rounded-full">
                  <ClockIcon className="h-3 w-3 mr-1" />
                  {new Date(debt.dueDate) < new Date() ? 'Overdue' : 'Pending'}
                </span>
              )}
              <span className="text-sm text-gray-500">
                Due: {formatDate(debt.dueDate)}
              </span>
            </div>
            <p className="text-sm mb-1">Meter: {debt.meterNumber}</p>
            <p className="font-semibold mb-2">{formatCurrency(debt.amount)}</p>
            <p className="text-sm text-gray-600">{debt.description}</p>
          </div>
          
          {!debt.isPaid && (
            <Button 
              size="sm" 
              className="flex items-center"
              onClick={() => onPayNow(debt)}
            >
              Pay Now
              <ArrowRightIcon className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const DebtsScreen = () => {
  const [, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("pending");
  
  // Fetch debts
  const { data: debts, isLoading, refetch } = useQuery<Debt[]>({
    queryKey: ['/api/debts'],
  });
  
  // Handle pay now button
  const handlePayNow = (debt: Debt) => {
    navigate(`/pay-debt/${debt.id}`);
  };
  
  // Filter and sort debts
  const filteredDebts = debts ? debts.filter(debt => {
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        debt.meterNumber.toLowerCase().includes(query) ||
        debt.description?.toLowerCase().includes(query) ||
        formatCurrency(debt.amount).toLowerCase().includes(query)
      );
    }
    
    // Filter by tab
    if (activeTab === "pending") {
      return !debt.isPaid;
    } else if (activeTab === "paid") {
      return debt.isPaid;
    }
    
    return true; // "all" tab
  }) : [];
  
  // Group debts by meter number
  const groupedDebts: { [key: string]: Debt[] } = {};
  filteredDebts.forEach(debt => {
    if (!groupedDebts[debt.meterNumber]) {
      groupedDebts[debt.meterNumber] = [];
    }
    groupedDebts[debt.meterNumber].push(debt);
  });
  
  // Calculate totals
  const pendingTotal = debts
    ? debts
        .filter(debt => !debt.isPaid)
        .reduce((sum, debt) => sum + parseFloat(debt.amount.toString()), 0)
    : 0;
  
  const paidTotal = debts
    ? debts
        .filter(debt => debt.isPaid)
        .reduce((sum, debt) => sum + parseFloat(debt.amount.toString()), 0)
    : 0;
  
  return (
    <div className="slide-in px-4 pt-4 pb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Electricity Debts</h2>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => refetch()}
          className="h-8 w-8"
        >
          <RefreshCcwIcon className="h-4 w-4" />
        </Button>
      </div>
      
      {/* Search and filters */}
      <div className="mb-4 relative">
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
        <Input
          type="text"
          placeholder="Search by meter or description..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <Card className={`${activeTab === 'pending' ? 'border-amber-200 bg-amber-50' : ''}`}>
          <CardContent className="p-3">
            <p className="text-sm text-gray-500">Pending</p>
            <p className="text-xl font-semibold">{formatCurrency(pendingTotal)}</p>
            <p className="text-xs text-gray-500 mt-1">
              {debts?.filter(debt => !debt.isPaid).length || 0} debts
            </p>
          </CardContent>
        </Card>
        <Card className={`${activeTab === 'paid' ? 'border-green-200 bg-green-50' : ''}`}>
          <CardContent className="p-3">
            <p className="text-sm text-gray-500">Paid</p>
            <p className="text-xl font-semibold">{formatCurrency(paidTotal)}</p>
            <p className="text-xs text-gray-500 mt-1">
              {debts?.filter(debt => debt.isPaid).length || 0} debts
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Tabs */}
      <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab} className="mb-2">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="paid">Paid</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>
      </Tabs>
      
      {/* Debts list */}
      {isLoading ? (
        <div className="py-12 flex flex-col items-center">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mb-4"></div>
          <p className="text-gray-500">Loading debts...</p>
        </div>
      ) : filteredDebts.length === 0 ? (
        <div className="py-12 text-center">
          {searchQuery ? (
            <>
              <SearchIcon className="h-10 w-10 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500 mb-2">No debts match your search</p>
              <Button variant="outline" onClick={() => setSearchQuery("")}>
                Clear Search
              </Button>
            </>
          ) : activeTab === "pending" ? (
            <>
              <div className="bg-green-100 mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-3">
                <CheckCircleIcon className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-gray-800 font-medium mb-1">No Pending Debts</p>
              <p className="text-gray-500 mb-5">You don't have any pending electricity debts</p>
            </>
          ) : activeTab === "paid" ? (
            <>
              <AlertTriangleIcon className="h-10 w-10 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No paid debts found</p>
            </>
          ) : (
            <>
              <AlertTriangleIcon className="h-10 w-10 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No debts found</p>
            </>
          )}
        </div>
      ) : (
        <div>
          {Object.entries(groupedDebts).map(([meterNumber, meterDebts]) => (
            <div key={meterNumber} className="mb-4">
              <h3 className="text-sm font-medium text-gray-500 mb-2">
                Meter: {meterNumber}
              </h3>
              <div>
                {meterDebts.map((debt) => (
                  <DebtCard
                    key={debt.id}
                    debt={debt}
                    onPayNow={handlePayNow}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DebtsScreen;