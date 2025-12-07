import PropTypes from "prop-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Check, Tag } from "lucide-react";

const OrderSummary = ({
  plan,
  currency,
  appliedDiscount,
  discountCode,
  setDiscountCode,
  handleApplyDiscount,
  handleRemoveDiscount,
  isApplyingDiscount,
}) => {
  const plans = {
    core: { name: "Core", basePrice: 495, basePrompts: 100 },
    pro: { name: "Pro", basePrice: 995, basePrompts: 500 },
    elite: { name: "Elite", basePrice: 1995, basePrompts: 1000 },
  };

  const selectedPlan = plans[plan];

  const getCurrencySymbol = () => {
    if (currency === "GBP") return "£";
    if (currency === "EUR") return "€";
    return "$";
  };

  const convertPrice = (usdPrice) => {
    if (currency === "GBP") return Math.round(usdPrice * 0.75);
    if (currency === "EUR") return Math.round(usdPrice * 0.85);
    return usdPrice;
  };

  const basePrice = convertPrice(selectedPlan.basePrice);
  const subtotal = basePrice;
  const discountAmount = appliedDiscount
    ? Math.round(subtotal * (appliedDiscount.percentage / 100))
    : 0;
  const total = subtotal - discountAmount;

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100 h-fit">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Order Summary</h2>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">
            {selectedPlan.name} Plan
          </h3>
          <Badge
            style={{
              background:
                "linear-gradient(to right, rgba(30, 139, 139, 0.1), rgba(198, 222, 65, 0.1))",
              color: "#1E8B8B",
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
            {getCurrencySymbol()}
            {basePrice}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium text-gray-900">
            {getCurrencySymbol()}
            {subtotal}
          </span>
        </div>

        {appliedDiscount && (
          <div className="flex items-center justify-between text-green-600">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4" />
              <span>Discount ({appliedDiscount.code})</span>
            </div>
            <span className="font-medium">
              -{getCurrencySymbol()}
              {discountAmount}
            </span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between mb-6">
        <span className="text-xl font-bold text-gray-900">Total</span>
        <div className="text-right">
          <div className="text-3xl font-bold text-gray-900">
            {getCurrencySymbol()}
            {total}
          </div>
          <div className="text-sm text-gray-500">per month</div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-4 mb-6">
        <div className="flex items-start gap-3 mb-3">
          <Check className="w-5 h-5 text-[#1E8B8B] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-900">
              7-day money back guarantee
            </p>
            <p className="text-xs text-gray-600">
              Cancel anytime, no questions asked
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Check className="w-5 h-5 text-[#1E8B8B] flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-gray-900">Secure payment</p>
            <p className="text-xs text-gray-600">
              Your payment information is encrypted
            </p>
          </div>
        </div>
      </div>

      {/* Discount Code Section */}
      <div className="pt-6 border-t border-gray-200">
        <label className="text-sm font-medium text-gray-900 mb-2 block">
          Have a discount code?
        </label>
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
                background: "linear-gradient(to right, #1E8B8B, #C6DE41)",
              }}
              className="text-white hover:opacity-90"
            >
              {isApplyingDiscount ? "Applying..." : "Apply"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

OrderSummary.propTypes = {
  plan: PropTypes.string.isRequired,
  currency: PropTypes.string.isRequired,
  appliedDiscount: PropTypes.object,
  discountCode: PropTypes.string.isRequired,
  setDiscountCode: PropTypes.func.isRequired,
  handleApplyDiscount: PropTypes.func.isRequired,
  handleRemoveDiscount: PropTypes.func.isRequired,
  isApplyingDiscount: PropTypes.bool.isRequired,
};

export default OrderSummary;
