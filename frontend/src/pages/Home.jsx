import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Check, Calculator, ArrowRight, Crown } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();
  const [selectedTier, setSelectedTier] = useState('pro');
  const [currency, setCurrency] = useState('USD');

  const calculatePrice = () => {
    const tier = tiers.find(t => t.id === selectedTier);
    if (!tier) return 0;
    
    let basePrice = tier.basePrice;
    
    if (currency === 'GBP') return Math.round(basePrice * 0.75);
    if (currency === 'EUR') return Math.round(basePrice * 0.85);
    return basePrice;
  };

  const getCurrencySymbol = () => {
    if (currency === 'GBP') return '£';
    if (currency === 'EUR') return '€';
    return '$';
  };

  const getBasePriceForCurrency = (usdPrice) => {
    if (currency === 'GBP') return Math.round(usdPrice * 0.75);
    if (currency === 'EUR') return Math.round(usdPrice * 0.85);
    return usdPrice;
  };

  const tiers = [
    {
      id: 'core',
      name: 'Core',
      description: 'For those getting started in AI Search Optimization',
      basePrice: 495,
      basePrompts: 100,
      prompts: 'Up to 100 Prompts/Questions Tracked',
      features: [
        'GEO Dashboard',
        'Total Citations',
        'Brand Citation Share',
        'Total Brand Mentions',
        'Brand Mention Share',
        'Citation Insights',
        'Top Cited Pages',
        'Mention Insights',
        'Query Research',
        'Top Performing Competitors & Topics',
        'Query Input',
        'Share of Voice Insights',
        'Top Cited Pages',
        'Brand Mentions',
        'Optimize',
        'GenAI Queries',
        'Closest URLs',
        'Content Brief Generation',
        'Content Description and References',
        'Track up to 20 Competitors'
      ],
      popular: false
    },
    {
      id: 'pro',
      name: 'Pro',
      description: 'For those looking for ultimate control, scale, full attribution, real prompt capture and multiple languages',
      basePrice: 995,
      basePrompts: 500,
      prompts: 'Up to 500 Prompts/Questions Tracked',
      features: [
        'Everything in Core, plus:',
        'AI Search Intelligence',
        'Real GenAI Query Capture',
        'AI Search Attribution Tracking',
        'Click-Through Rate (CTR) Analysis',
        'Deep Topic Analysis',
        'Subtopics & Segment Insights',
        'Blocking Recommendations',
        'Track up to 20 Competitors'
      ],
      popular: true
    },
    {
      id: 'elite',
      name: 'Elite',
      description: 'Everything in the Pro licence with more scale and a dedicated AEO Strategist',
      basePrice: 1995,
      basePrompts: 1000,
      prompts: 'Up to 1000 Prompts/Questions Tracked',
      features: [
        'Everything in Pro, plus:',
        'Dedicated AEO Strategist',
        'Priority Support',
        'Custom Integrations',
        'Advanced Reporting',
        'Quarterly Strategy Sessions',
        'White-label Options',
        'Track up to 20 Competitors'
      ],
      popular: false
    }
  ];

  const handleGetStarted = (tier) => {
    if (tier.id === 'elite') {
      window.location.href = 'mailto:sales@elelem.com?subject=Elite Plan Inquiry';
    } else {
      navigate(createPageUrl('Onboarding'));
    }
  };

  const selectedTierData = tiers.find(t => t.id === selectedTier);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <img
              src="https://cdn.geo.elelem.ai/onboarding/91638358f_elelem2025logoPrimary.png"
              alt="elelem"
              className="h-10"
            />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Get started with AI Search Optimization and win in the age of AI
          </p>
          
          {/* Currency Selector */}
          <div className="flex items-center justify-center gap-2">
            <Button
              variant={currency === 'USD' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrency('USD')}
              className={currency === 'USD' ? 'bg-[#1E8B8B] hover:bg-[#1E8B8B]' : ''}
            >
              USD ($)
            </Button>
            <Button
              variant={currency === 'GBP' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrency('GBP')}
              className={currency === 'GBP' ? 'bg-[#1E8B8B] hover:bg-[#1E8B8B]' : ''}
            >
              GBP (£)
            </Button>
            <Button
              variant={currency === 'EUR' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setCurrency('EUR')}
              className={currency === 'EUR' ? 'bg-[#1E8B8B] hover:bg-[#1E8B8B]' : ''}
            >
              EUR (€)
            </Button>
          </div>
        </div>

        {/* Pricing Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              onClick={() => setSelectedTier(tier.id)}
              className={`bg-white rounded-3xl shadow-xl p-8 border-2 transition-all hover:shadow-2xl relative cursor-pointer ${
                tier.popular ? 'scale-105' : ''
              } ${
                selectedTier === tier.id ? 'border-[#1E8B8B] ring-4 ring-[#1E8B8B] ring-opacity-20' : 'border-gray-100'
              }`}
            >
              {tier.popular && (
                <div 
                  className="absolute -top-4 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full text-white text-sm font-semibold"
                  style={{
                    background: 'linear-gradient(to right, #1E8B8B, #C6DE41)'
                  }}
                >
                  Most Popular
                </div>
              )}

              <div className="text-center mb-6">
                {tier.id === 'elite' && (
                  <Crown className="w-8 h-8 text-[#C6DE41] mx-auto mb-2" />
                )}
                <h3 className="text-3xl font-bold text-gray-900 mb-2">
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
                    {getCurrencySymbol()}{getBasePriceForCurrency(tier.basePrice)}
                  </span>
                </div>
                <div className="text-gray-500 text-sm mb-4">per month</div>
                
                <div 
                  className="inline-block px-4 py-2 rounded-lg text-sm font-medium"
                  style={{
                    background: 'linear-gradient(to right, rgba(30, 139, 139, 0.1), rgba(198, 222, 65, 0.1))',
                    color: '#1E8B8B'
                  }}
                >
                  {tier.prompts}
                </div>
              </div>

              <div className="space-y-3 mb-8 min-h-[300px]">
                {tier.features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-[#1E8B8B] flex-shrink-0 mt-0.5" />
                    <span className={`text-gray-700 text-sm ${feature.includes('Everything in') || feature.includes('GEO Dashboard') || feature.includes('Query Research') || feature.includes('Optimize') || feature.includes('AI Search Intelligence') ? 'font-semibold' : ''}`}>
                      {feature}
                    </span>
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

        {/* Pricing Calculator */}
        {selectedTierData && (
          <div className="bg-white rounded-3xl shadow-xl p-8 mb-12 border border-gray-100 max-w-4xl mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <Calculator className="w-6 h-6 text-[#1E8B8B]" />
              <h2 className="text-2xl font-bold text-gray-900">Your Plan Summary</h2>
            </div>

            <div 
              className="p-6 rounded-2xl text-white text-center"
              style={{
                background: 'linear-gradient(to right, #1E8B8B, #C6DE41)'
              }}
            >
              <p className="text-sm mb-2 opacity-90">Your total pricing</p>
              <div className="text-4xl font-bold mb-1">
                {getCurrencySymbol()}{calculatePrice()}
                <span className="text-lg font-normal opacity-90">/month</span>
              </div>
              <p className="text-sm opacity-90">
                {selectedTierData.name} Plan • {selectedTierData.basePrompts} Prompts • Up to 20 Competitors
              </p>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 space-y-3">
              {selectedTierData.id !== 'elite' ? (
                <>
                  <Button
                    onClick={() => handleGetStarted(selectedTierData)}
                    style={{
                      background: 'linear-gradient(to right, #1E8B8B, #C6DE41)'
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
                    background: 'linear-gradient(to right, #1E8B8B, #C6DE41)'
                  }}
                  className="w-full h-14 text-lg font-medium rounded-xl text-white hover:opacity-90"
                >
                  Contact Us
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              )}
            </div>
          </div>
        )}

        {/* FAQ or Additional Info */}
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            All plans include a 7-day free trial. No credit card required for trial.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-[#1E8B8B]">Contact Sales</a>
            <span>•</span>
            <a href="#" className="hover:text-[#1E8B8B]">View Full Feature Comparison</a>
            <span>•</span>
            <a href="#" className="hover:text-[#1E8B8B]">FAQ</a>
          </div>
        </div>
      </div>
    </div>
  );
}