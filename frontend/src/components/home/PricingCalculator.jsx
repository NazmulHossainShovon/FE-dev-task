import { Button } from "@/components/ui/button";
import { createPageUrl } from "@/utils";
import { Calculator, ArrowRight } from "lucide-react";
import PropTypes from "prop-types";

const PricingCalculator = ({
  selectedTierData,
  currency,
  calculatePrice,
  getCurrencySymbol,
  navigate,
}) => {
  const handleGetStarted = (tier) => {
    if (tier.id === "elite") {
      window.location.href =
        "mailto:sales@elelem.com?subject=Elite Plan Inquiry";
    } else {
      const params = new URLSearchParams({
        plan: tier.id,
        currency: currency,
      });

      navigate(`${createPageUrl("Payment")}?${params.toString()}`);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 mb-12 border border-gray-100 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Calculator className="w-6 h-6 text-[#1E8B8B]" />
        <h2 className="text-2xl font-bold text-gray-900">Your Plan Summary</h2>
      </div>

      <div
        className="p-6 rounded-2xl text-white text-center"
        style={{
          background: "linear-gradient(to right, #1E8B8B, #C6DE41)",
        }}
      >
        <p className="text-sm mb-2 opacity-90">Your total pricing</p>
        <div className="text-4xl font-bold mb-1">
          {getCurrencySymbol()}
          {calculatePrice()}
          <span className="text-lg font-normal opacity-90">/month</span>
        </div>
        <p className="text-sm opacity-90">
          {selectedTierData.name} Plan • {selectedTierData.basePrompts} Prompts
          • Up to 20 Competitors
        </p>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 space-y-3">
        {selectedTierData.id !== "elite" ? (
          <>
            <Button
              onClick={() => navigate(createPageUrl("Onboarding"))}
              style={{
                background: "linear-gradient(to right, #1E8B8B, #C6DE41)",
              }}
              className="w-full h-14 text-lg font-medium rounded-xl text-white hover:opacity-90"
            >
              Start Free Trial (7 Days)
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              onClick={() => handleGetStarted(selectedTierData)}
              variant="outline"
              className="w-full h-14 text-lg font-medium rounded-xl border-2 border-[#1E8B8B] text-[#1E8B8B] hover:bg-[#1E8B8B] hover:text-white"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </>
        ) : (
          <Button
            onClick={() => handleGetStarted(selectedTierData)}
            style={{
              background: "linear-gradient(to right, #1E8B8B, #C6DE41)",
            }}
            className="w-full h-14 text-lg font-medium rounded-xl text-white hover:opacity-90"
          >
            Contact Us
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
};

PricingCalculator.propTypes = {
  selectedTierData: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    basePrompts: PropTypes.number.isRequired,
    basePrice: PropTypes.number.isRequired,
  }).isRequired,
  currency: PropTypes.string.isRequired,
  calculatePrice: PropTypes.func.isRequired,
  getCurrencySymbol: PropTypes.func.isRequired,
  navigate: PropTypes.func.isRequired,
};

export default PricingCalculator;
