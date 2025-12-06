import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Check, CreditCard, Lock, Tag, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function Payment() {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  
  const plan = urlParams.get('plan') || 'pro';
  const currency = urlParams.get('currency') || 'USD';
  
  const [discountCode, setDiscountCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(null);
  const [isApplyingDiscount, setIsApplyingDiscount] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
    billingEmail: ''
  });

  const plans = {
    core: { name: 'Core', basePrice: 495, basePrompts: 100 },
    pro: { name: 'Pro', basePrice: 995, basePrompts: 500 },
    elite: { name: 'Elite', basePrice: 1995, basePrompts: 1000 }
  };

  const selectedPlan = plans[plan];

  const getCurrencySymbol = () => {
    if (currency === 'GBP') return '£';
    if (currency === 'EUR') return '€';
    return '$';
  };

  const convertPrice = (usdPrice) => {
    if (currency === 'GBP') return Math.round(usdPrice * 0.75);
    if (currency === 'EUR') return Math.round(usdPrice * 0.85);
    return usdPrice;
  };

  const basePrice = convertPrice(selectedPlan.basePrice);
  const subtotal = basePrice;
  const discountAmount = appliedDiscount ? Math.round(subtotal * (appliedDiscount.percentage / 100)) : 0;
  const total = subtotal - discountAmount;

  const handleApplyDiscount = async () => {
    if (!discountCode.trim()) return;
    
    setIsApplyingDiscount(true);
    
    // Simulate API call to validate discount code
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Demo discount codes
    const discounts = {
      'SAVE10': { percentage: 10, code: 'SAVE10' },
      'SAVE20': { percentage: 20, code: 'SAVE20' },
      'FIRST50': { percentage: 50, code: 'FIRST50' }
    };
    
    if (discounts[discountCode.toUpperCase()]) {
      setAppliedDiscount(discounts[discountCode.toUpperCase()]);
    } else {
      setAppliedDiscount(null);
      alert('Invalid discount code');
    }
    
    setIsApplyingDiscount(false);
  };

  const handleRemoveDiscount = () => {
    setAppliedDiscount(null);
    setDiscountCode('');
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + '/' + v.slice(2, 4);
    }
    return v;
  };

  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.replace(/\s/g, '').length <= 16) {
      setFormData({ ...formData, cardNumber: formatted });
    }
  };

  const handleExpiryChange = (e) => {
    const formatted = formatExpiry(e.target.value);
    if (formatted.replace('/', '').length <= 4) {
      setFormData({ ...formData, expiry: formatted });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In production, this would integrate with Stripe's API
    // For now, redirect to onboarding
    navigate(createPageUrl('Onboarding'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(createPageUrl('Home'))}
            className="text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Pricing
          </Button>
          <Link to={createPageUrl('Home')}>
            <img
              src="https://cdn.geo.elelem.ai/onboarding/91638358f_elelem2025logoPrimary.png"
              alt="elelem"
              className="h-8 cursor-pointer hover:opacity-80 transition-opacity"
            />
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Left Side - Order Summary */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 h-fit sticky top-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>
            
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{selectedPlan.name} Plan</h3>
                <Badge 
                  style={{
                    background: 'linear-gradient(to right, rgba(30, 139, 139, 0.1), rgba(198, 222, 65, 0.1))',
                    color: '#1E8B8B'
                  }}
                >
                  Monthly
                </Badge>
              </div>
              <p className="text-sm text-gray-600">
                {selectedPlan.basePrompts} prompts • Up to 20 competitors
              </p>
            </div>

            <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">{selectedPlan.name} Plan Base</span>
                <span className="font-medium text-gray-900">
                  {getCurrencySymbol()}{basePrice}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium text-gray-900">
                  {getCurrencySymbol()}{subtotal}
                </span>
              </div>

              {appliedDiscount && (
                <div className="flex items-center justify-between text-green-600">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    <span>Discount ({appliedDiscount.code})</span>
                  </div>
                  <span className="font-medium">
                    -{getCurrencySymbol()}{discountAmount}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mb-6">
              <span className="text-xl font-bold text-gray-900">Total</span>
              <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">
                  {getCurrencySymbol()}{total}
                </div>
                <div className="text-sm text-gray-500">per month</div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3 mb-3">
                <Check className="w-5 h-5 text-[#1E8B8B] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">7-day money back guarantee</p>
                  <p className="text-xs text-gray-600">Cancel anytime, no questions asked</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-[#1E8B8B] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Secure payment</p>
                  <p className="text-xs text-gray-600">Your payment information is encrypted</p>
                </div>
              </div>
            </div>

            {/* Discount Code Section */}
            <div className="pt-6 border-t border-gray-200">
              <Label className="text-sm font-medium text-gray-900 mb-2 block">
                Have a discount code?
              </Label>
              <div className="flex gap-2">
                <Input
                  value={discountCode}
                  onChange={(e) => setDiscountCode(e.target.value.toUpperCase())}
                  placeholder="Enter code"
                  disabled={!!appliedDiscount}
                  className="flex-1"
                />
                {appliedDiscount ? (
                  <Button
                    onClick={handleRemoveDiscount}
                    variant="outline"
                    className="border-[#1E8B8B] text-[#1E8B8B]"
                  >
                    Remove
                  </Button>
                ) : (
                  <Button
                    onClick={handleApplyDiscount}
                    disabled={isApplyingDiscount || !discountCode}
                    style={{
                      background: 'linear-gradient(to right, #1E8B8B, #C6DE41)'
                    }}
                    className="text-white hover:opacity-90"
                  >
                    {isApplyingDiscount ? 'Applying...' : 'Apply'}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Right Side - Payment Form */}
          <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
            <div className="flex items-center gap-2 mb-6">
              <Lock className="w-5 h-5 text-[#1E8B8B]" />
              <h2 className="text-2xl font-bold text-gray-900">Secure Payment</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Billing Email */}
              <div>
                <Label htmlFor="billingEmail" className="text-sm font-medium text-gray-900 mb-2 block">
                  Billing Email
                </Label>
                <Input
                  id="billingEmail"
                  type="email"
                  value={formData.billingEmail}
                  onChange={(e) => setFormData({ ...formData, billingEmail: e.target.value })}
                  placeholder="john@company.com"
                  required
                  className="h-12"
                />
              </div>

              {/* Card Information */}
              <div>
                <Label className="text-sm font-medium text-gray-900 mb-2 block">
                  Card Information
                </Label>
                
                <div className="space-y-3">
                  {/* Card Number */}
                  <div className="relative">
                    <Input
                      value={formData.cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="1234 5678 9012 3456"
                      required
                      className="h-12 pr-12"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <CreditCard className="w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  {/* Expiry and CVV */}
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      value={formData.expiry}
                      onChange={handleExpiryChange}
                      placeholder="MM/YY"
                      required
                      className="h-12"
                    />
                    <Input
                      value={formData.cvv}
                      onChange={(e) => {
                        const v = e.target.value.replace(/[^0-9]/g, '');
                        if (v.length <= 4) {
                          setFormData({ ...formData, cvv: v });
                        }
                      }}
                      placeholder="CVV"
                      required
                      className="h-12"
                      type="password"
                      maxLength={4}
                    />
                  </div>
                </div>
              </div>

              {/* Cardholder Name */}
              <div>
                <Label htmlFor="cardName" className="text-sm font-medium text-gray-900 mb-2 block">
                  Cardholder Name
                </Label>
                <Input
                  id="cardName"
                  value={formData.cardName}
                  onChange={(e) => setFormData({ ...formData, cardName: e.target.value })}
                  placeholder="John Doe"
                  required
                  className="h-12"
                />
              </div>

              {/* Terms */}
              <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600">
                <p>
                  By confirming your subscription, you allow elelem to charge your card for this payment and future payments in accordance with their terms. You can cancel your subscription at any time.
                </p>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isProcessing}
                style={{
                  background: 'linear-gradient(to right, #1E8B8B, #C6DE41)'
                }}
                className="w-full h-14 text-lg font-medium text-white hover:opacity-90 disabled:opacity-50"
              >
                {isProcessing ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Processing...
                  </span>
                ) : (
                  `Pay ${getCurrencySymbol()}${total}/month`
                )}
              </Button>

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Lock className="w-4 h-4" />
                <span>Secured by Stripe</span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}