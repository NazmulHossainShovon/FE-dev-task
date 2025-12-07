import { Check, Crown } from "lucide-react";
import PropTypes from "prop-types";

const PricingTiers = ({
  tiers,
  selectedTier,
  setSelectedTier,
  getBasePriceForCurrency,
  getCurrencySymbol,
}) => {
  const getFeatureClass = (feature) => {
    const baseClasses = "text-gray-700 text-sm";

    if (
      feature.includes("Everything in") ||
      feature.includes("GEO Dashboard") ||
      feature.includes("Query Research") ||
      feature.includes("Optimize") ||
      feature.includes("AI Search Intelligence")
    ) {
      return `${baseClasses} font-semibold`;
    }
    return baseClasses;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
      {tiers.map((tier) => (
        <div
          key={tier.id}
          data-testid={`plan-card-${tier.id}`}
          onClick={() => setSelectedTier(tier.id)}
          className={`bg-white rounded-3xl shadow-xl p-8 border-2 transition-all hover:shadow-2xl relative cursor-pointer ${
            tier.popular ? "scale-105" : ""
          } ${
            selectedTier === tier.id
              ? "border-[#1E8B8B] ring-4 ring-[#1E8B8B] ring-opacity-20"
              : "border-gray-100"
          }`}
        >
          {tier.popular && (
            <div
              className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-white text-sm font-semibold"
              style={{
                background: "linear-gradient(to right, #1E8B8B, #C6DE41)",
              }}
            >
              Most Popular
            </div>
          )}

          <div className="text-center mb-6">
            {tier.id === "elite" && (
              <Crown className="w-8 h-8 text-[#C6DE41] mx-auto mb-2" />
            )}
            <h3 data-testid={`plan-name-${tier.id}`} className="text-3xl font-bold text-gray-900 mb-2">
              {tier.name}
            </h3>
            <p className="text-gray-600 text-sm mb-6 min-h-[60px]">
              {tier.description}
            </p>

            <div className="mb-2">
              <span className="text-gray-500 text-sm">from</span>
            </div>
            <div className="mb-1">
              <span className="text-5xl font-bold text-gray-900">
                {getCurrencySymbol()}
                {getBasePriceForCurrency(tier.basePrice)}
              </span>
            </div>
            <div className="text-gray-500 text-sm mb-4">per month</div>

            <div
              className="inline-block px-4 py-2 rounded-lg text-sm font-medium"
              style={{
                background:
                  "linear-gradient(to right, rgba(30, 139, 139, 0.1), rgba(198, 222, 65, 0.1))",
                color: "#1E8B8B",
              }}
            >
              {tier.prompts}
            </div>
          </div>

          <div className="space-y-3 mb-8 min-h-[300px]">
            {tier.features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <Check className="w-5 h-5 text-[#1E8B8B] flex-shrink-0 mt-0.5" />
                <span className={getFeatureClass(feature)}>{feature}</span>
              </div>
            ))}
          </div>

          {selectedTier === tier.id && (
            <div className="absolute top-4 right-4">
              <div className="w-6 h-6 rounded-full bg-[#1E8B8B] flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

PricingTiers.propTypes = {
  tiers: PropTypes.array.isRequired,
  selectedTier: PropTypes.string.isRequired,
  setSelectedTier: PropTypes.func.isRequired,
  getBasePriceForCurrency: PropTypes.func.isRequired,
  getCurrencySymbol: PropTypes.func.isRequired,
};

export default PricingTiers;
