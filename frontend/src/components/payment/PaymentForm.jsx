import PropTypes from 'prop-types';
import { CreditCard, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const PaymentForm = ({ formData, setFormData, handleSubmit, isProcessing, currency, total }) => {
  const getCurrencySymbol = () => {
    if (currency === 'GBP') return '£';
    if (currency === 'EUR') return '€';
    return '$';
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

  return (
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
            data-testid="billing-email-input"
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
                data-testid="card-number-input"
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
                data-testid="expiry-input"
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
                data-testid="cvv-input"
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
            data-testid="card-name-input"
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
          data-testid="submit-payment-button"
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
  );
};

PaymentForm.propTypes = {
  formData: PropTypes.shape({
    cardNumber: PropTypes.string.isRequired,
    cardName: PropTypes.string.isRequired,
    expiry: PropTypes.string.isRequired,
    cvv: PropTypes.string.isRequired,
    billingEmail: PropTypes.string.isRequired
  }).isRequired,
  setFormData: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  isProcessing: PropTypes.bool.isRequired,
  currency: PropTypes.string.isRequired,
  total: PropTypes.number.isRequired
};

export default PaymentForm;