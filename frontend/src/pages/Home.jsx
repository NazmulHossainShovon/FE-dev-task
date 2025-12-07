import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/home/Header";
import CurrencySelector from "@/components/home/CurrencySelector";
import PricingTiers from "@/components/home/PricingTiers";
import PricingCalculator from "@/components/home/PricingCalculator";
import Footer from "@/components/home/Footer";

export default function Home() {
  const navigate = useNavigate();
  const [selectedTier, setSelectedTier] = useState("pro");
  const [currency, setCurrency] = useState("USD");

  const calculatePrice = () => {
    const tier = tiers.find((t) => t.id === selectedTier);
    if (!tier) return 0;

    let basePrice = tier.basePrice;

    if (currency === "GBP") return Math.round(basePrice * 0.75);
    if (currency === "EUR") return Math.round(basePrice * 0.85);
    return basePrice;
  };

  const getCurrencySymbol = () => {
    if (currency === "GBP") return "£";
    if (currency === "EUR") return "€";
    return "$";
  };

  const getBasePriceForCurrency = (usdPrice) => {
    if (currency === "GBP") return Math.round(usdPrice * 0.75);
    if (currency === "EUR") return Math.round(usdPrice * 0.85);
    return usdPrice;
  };

  const tiers = [
    {
      id: "core",
      name: "Core",
      description: "For those getting started in AI Search Optimization",
      basePrice: 495,
      basePrompts: 100,
      prompts: "Up to 100 Prompts/Questions Tracked",
      features: [
        "GEO Dashboard",
        "Total Citations",
        "Brand Citation Share",
        "Total Brand Mentions",
        "Brand Mention Share",
        "Citation Insights",
        "Top Cited Pages",
        "Mention Insights",
        "Query Research",
        "Top Performing Competitors & Topics",
        "Query Input",
        "Share of Voice Insights",
        "Top Cited Pages",
        "Brand Mentions",
        "Optimize",
        "GenAI Queries",
        "Closest URLs",
        "Content Brief Generation",
        "Content Description and References",
        "Track up to 20 Competitors",
      ],
      popular: false,
    },
    {
      id: "pro",
      name: "Pro",
      description:
        "For those looking for ultimate control, scale, full attribution, real prompt capture and multiple languages",
      basePrice: 995,
      basePrompts: 500,
      prompts: "Up to 500 Prompts/Questions Tracked",
      features: [
        "Everything in Core, plus:",
        "AI Search Intelligence",
        "Real GenAI Query Capture",
        "AI Search Attribution Tracking",
        "Click-Through Rate (CTR) Analysis",
        "Deep Topic Analysis",
        "Subtopics & Segment Insights",
        "Blocking Recommendations",
        "Track up to 20 Competitors",
      ],
      popular: true,
    },
    {
      id: "elite",
      name: "Elite",
      description:
        "Everything in the Pro licence with more scale and a dedicated AEO Strategist",
      basePrice: 1995,
      basePrompts: 1000,
      prompts: "Up to 1000 Prompts/Questions Tracked",
      features: [
        "Everything in Pro, plus:",
        "Dedicated AEO Strategist",
        "Priority Support",
        "Custom Integrations",
        "Advanced Reporting",
        "Quarterly Strategy Sessions",
        "White-label Options",
        "Track up to 20 Competitors",
      ],
      popular: false,
    },
  ];

  const selectedTierData = tiers.find((t) => t.id === selectedTier);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <Header />

        <CurrencySelector currency={currency} setCurrency={setCurrency} />

        <PricingTiers
          tiers={tiers}
          selectedTier={selectedTier}
          setSelectedTier={setSelectedTier}
          getBasePriceForCurrency={getBasePriceForCurrency}
          getCurrencySymbol={getCurrencySymbol}
        />

        {selectedTierData && (
          <PricingCalculator
            selectedTierData={selectedTierData}
            currency={currency}
            calculatePrice={calculatePrice}
            getCurrencySymbol={getCurrencySymbol}
            navigate={navigate}
          />
        )}

        <Footer />
      </div>
    </div>
  );
}
