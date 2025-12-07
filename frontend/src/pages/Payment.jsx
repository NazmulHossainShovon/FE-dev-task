import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate, Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { ArrowLeft } from 'lucide-react';
import OrderSummary from '@/components/payment/OrderSummary';
import PaymentForm from '@/components/payment/PaymentForm';

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
          <OrderSummary
            plan={plan}
            currency={currency}
            appliedDiscount={appliedDiscount}
            discountCode={discountCode}
            setDiscountCode={setDiscountCode}
            handleApplyDiscount={handleApplyDiscount}
            handleRemoveDiscount={handleRemoveDiscount}
            isApplyingDiscount={isApplyingDiscount}
          />

          {/* Right Side - Payment Form */}
          <PaymentForm
            formData={formData}
            setFormData={setFormData}
            handleSubmit={handleSubmit}
            isProcessing={isProcessing}
            currency={currency}
            total={(() => {
              const selectedPlan = {
                core: { name: 'Core', basePrice: 495, basePrompts: 100 },
                pro: { name: 'Pro', basePrice: 995, basePrompts: 500 },
                elite: { name: 'Elite', basePrice: 1995, basePrompts: 1000 }
              }[plan];

              const convertPrice = (usdPrice) => {
                if (currency === 'GBP') return Math.round(usdPrice * 0.75);
                if (currency === 'EUR') return Math.round(usdPrice * 0.85);
                return usdPrice;
              };

              const basePrice = convertPrice(selectedPlan.basePrice);
              const subtotal = basePrice;
              const discountAmount = appliedDiscount ? Math.round(subtotal * (appliedDiscount.percentage / 100)) : 0;
              return subtotal - discountAmount;
            })()}
          />
        </div>
      </div>
    </div>
  );
}