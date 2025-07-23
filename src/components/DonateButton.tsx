import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const DonateButton: React.FC = () => {
  const [showDonateModal, setShowDonateModal] = useState(false);
  const [donationAmount, setDonationAmount] = useState('');
  const [donationCurrency, setDonationCurrency] = useState('USD');

  const handleDonate = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would integrate with a payment processor
    alert(`Thank you for your ${donationCurrency}${donationAmount} donation!`);
    setShowDonateModal(false);
    setDonationAmount('');
  };

  return (
    <>
      <Button 
        onClick={() => setShowDonateModal(true)}
        className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-md shadow-md flex items-center gap-2"
      >
        <Heart className="h-5 w-5" />
        Donate Now
      </Button>

      {showDonateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-2xl font-bold mb-4 text-black">Support Our Cause</h2>
            <p className="text-gray-700 mb-4">
              Your donation helps support local artisans and sustainable practices in Africa.
            </p>
            
            <form onSubmit={handleDonate} className="space-y-4">
              <div>
                <Label htmlFor="amount">Donation Amount</Label>
                <div className="flex gap-2">
                  <Select 
                    value={donationCurrency} 
                    onValueChange={setDonationCurrency}
                  >
                 
                    <SelectTrigger className="w-24 text-black">
                      <SelectValue placeholder="Currency" />
                    </SelectTrigger>
                    <SelectContent>
                    
                      <SelectItem value="USD" className="text-black">USD</SelectItem>
                      <SelectItem value="EUR" className="text-black">EUR</SelectItem>
                      <SelectItem value="GBP" className="text-black">GBP</SelectItem>
                      <SelectItem value="MWK" className="text-black">MWK</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Amount"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                    required
                    min="1"
                
                    className="flex-1 text-black"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button 
                className = "text-black"
                  type="button" 
                  variant="outline"
                  onClick={() => setShowDonateModal(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="bg-red-500 hover:bg-red-600"
                >
                  Donate
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default DonateButton;