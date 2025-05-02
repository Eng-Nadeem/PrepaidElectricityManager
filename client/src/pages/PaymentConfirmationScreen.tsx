import { useEffect } from "react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCardIcon } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const SERVICE_FEE = 0.5;

const PaymentConfirmationScreen = () => {
  const [, navigate] = useLocation();
  
  // Get query parameters
  const params = new URLSearchParams(window.location.search);
  const meterNumber = params.get('meterNumber') || '';
  const nickname = params.get('nickname') || 'Not specified';
  const amountParam = params.get('amount') || '0';
  const amount = parseFloat(amountParam);
  const total = amount + SERVICE_FEE;
  const paymentMethod = params.get('paymentMethod') || 'card';
  
  // Validate required parameters are present
  useEffect(() => {
    if (!meterNumber || isNaN(amount) || amount <= 0) {
      navigate('/recharge');
    }
  }, [meterNumber, amount, navigate]);
  
  const handleBack = () => {
    navigate(`/recharge?meterNumber=${meterNumber}&nickname=${nickname}&amount=${amount}&paymentMethod=${paymentMethod}`);
  };
  
  const handleConfirmPayment = () => {
    // Pass all payment details as query params
    navigate(`/processing?meterNumber=${meterNumber}&nickname=${nickname}&amount=${amount}&total=${total}&paymentMethod=${paymentMethod}`);
  };
  
  return (
    <div className="slide-in px-4 pt-4">
      <Card>
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-4">Confirm Payment</h2>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-5">
            <div className="flex justify-between mb-2">
              <span className="text-gray-500">Meter Number:</span>
              <span className="font-medium">{meterNumber}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-500">Nickname:</span>
              <span className="font-medium">{nickname}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-500">Amount:</span>
              <span className="font-medium">{formatCurrency(amount)}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-gray-500">Service Fee:</span>
              <span className="font-medium">{formatCurrency(SERVICE_FEE)}</span>
            </div>
            <div className="border-t border-gray-200 my-2"></div>
            <div className="flex justify-between font-semibold">
              <span>Total:</span>
              <span>{formatCurrency(total)}</span>
            </div>
          </div>
          
          <div className="mb-5">
            <p className="text-sm text-gray-500 mb-2">Payment Method</p>
            <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex items-center justify-between">
              <div className="flex items-center">
                <CreditCardIcon className="h-4 w-4 mr-2 text-gray-700" />
                <span>
                  {paymentMethod === 'card' 
                    ? 'Credit Card (****1234)' 
                    : 'Mobile Money'}
                </span>
              </div>
              <button 
                className="text-primary text-sm"
                onClick={handleBack}
              >
                Change
              </button>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={handleBack}
            >
              Back
            </Button>
            <Button 
              className="flex-1"
              onClick={handleConfirmPayment}
            >
              Pay Now
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentConfirmationScreen;
