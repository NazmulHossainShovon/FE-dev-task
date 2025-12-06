import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createPageUrl, getLocalStorageWithExpiry, setLocalStorageWithExpiry } from '@/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ProgressBar from '../components/onboarding/ProgressBar';
import { ArrowRight, Plus, Trash2, Tag, Package, TrendingUp, Link2, MessageSquare, Eye, ArrowLeft, Pencil, Check, X } from 'lucide-react';


export default function OnboardingOwnBrand() {
  const navigate = useNavigate();
  const [brand, setBrand] = useState(null);
  const [newVariantName, setNewVariantName] = useState('');
  const [loading, setLoading] = useState(true);
  const [toEditBrand, setToEditBrand] = useState(false);
  const [newBrandName, setNewBrandName] = useState('');

  const onboardingId = getLocalStorageWithExpiry('onboardingId');
  const businessLogic = getLocalStorageWithExpiry('businessLogic') ?? {};
  const { own_brand } = businessLogic;

  useEffect(() => {
    setLoading(true);
    if (!onboardingId || !own_brand) {
      console.error('Missing onboardingId or businessLogic, redirecting to Onboarding');
      navigate(createPageUrl('Onboarding'));
      return;
    }
    setBrand(own_brand);
    setNewBrandName(own_brand.name);
    setLoading(false);
  }, []);

  const handleSaveEdit = () => {
    setBrand((prevBrand) => ({
      ...prevBrand,
      name: newBrandName.trim(),
    }));
    setToEditBrand(false);
  }

  const handleContinue = () => {
    setLocalStorageWithExpiry('businessLogic', { ...businessLogic, own_brand: brand }, 30); // 30 minutes expiry
    navigate(createPageUrl('OnboardingCompetitors'));
  };

  const handleCancelEdit = () => {
    setToEditBrand(false);
    setNewBrandName(brand.name);
  };

  const handleRemoveVariant = (variantToRemove) => {
    setBrand((prevBrand) => ({
      ...prevBrand,
      brand_name_variations: prevBrand.brand_name_variations.filter(
        (variant) => variant !== variantToRemove
      ),
    }));
  };

  const handleAddVariant = () => {
    if (newVariantName.trim() === '') return;
    setBrand((prevBrand) => ({
      ...prevBrand,
      brand_name_variations: [...prevBrand.brand_name_variations, newVariantName.trim()],
    }));
    setNewVariantName('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00D5C0]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side */}
      <div className="w-full lg:w-1/2 flex flex-col bg-white">
        <div className="px-8 py-6 flex justify-center">
          <div className="w-full max-w-md">
            <Link to="https://elelem.ai">
              <img
                src="https://cdn.geo.elelem.ai/onboarding/91638358f_elelem2025logoPrimary.png"
                alt="elelem"
                className="h-8 cursor-pointer hover:opacity-80 transition-opacity"
              />
            </Link>
          </div>
        </div>

        <div className="px-8 mb-8 flex justify-center">
          <div className="w-full max-w-md">
            <Button
              variant="ghost"
              onClick={() => navigate(createPageUrl('OnboardingAnalyze'))}
              className="text-gray-600 hover:text-gray-900 mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <ProgressBar currentStep={2} totalSteps={3} onboardingId={onboardingId} />
          </div>
        </div>

        <div className="flex-1 flex items-start justify-center px-8 py-12 overflow-y-auto">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Review Your Brand</h2>
            <p className="text-gray-600 mb-8">
              We found your brand name and product names. Add or remove as needed.
            </p>

            {/* Brand Name */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Tag className="w-5 h-5 text-[#00D5C0]" />
                <h3 className="text-lg font-semibold text-gray-900">Brand Name</h3>
              </div>
              <div className="space-y-2">
                <div
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  {toEditBrand ? (
                    <div className="flex items-center gap-2 flex-1 mr-2">
                      <Input
                        value={newBrandName}
                        onChange={(e) => setNewBrandName(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                        className="flex-1"
                        autoFocus
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSaveEdit}
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                      >
                        <Check className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCancelEdit}
                        className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    ) : (
                    <>
                      <span className="font-medium text-gray-900">{brand.name}</span>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setToEditBrand(true)}
                          className="text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Product Names */}
            {brand.brand_name_variations.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Package className="w-5 h-5 text-[#00D5C0]" />
                  <h3 className="text-lg font-semibold text-gray-900">Brand Product Name</h3>
                </div>
                <div className="space-y-2">
                  {brand.brand_name_variations.map((variant, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                      <span className="font-medium text-gray-900">{variant}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveVariant(variant)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Add New Product Name */}
            <div className="border-t pt-6 mb-8">
              <h3 className="text-sm font-medium text-gray-700 mb-4">Add Brand Product Name</h3>
              <div className="flex gap-2">
                <Input
                  value={newVariantName}
                  onChange={(e) => setNewVariantName(e.target.value)}
                  placeholder="Enter product name"
                  onKeyPress={(e) => e.key === 'Enter' && handleAddVariant()}
                  className="flex-1"
                />
                <Button
                  onClick={handleAddVariant}
                  style={{
                    background: 'linear-gradient(to right, #1E8B8B, #C6DE41)'
                  }}
                  className="hover:opacity-90"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <Button
              onClick={handleContinue}
              style={{
                background: 'linear-gradient(to right, #1E8B8B, #C6DE41)'
              }}
              className="w-full hover:opacity-90 text-white h-12 text-lg font-medium rounded-xl"
            >
              Continue
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      {/* Right Side */}
      <div 
        className="hidden lg:flex w-1/2 items-center justify-center p-12"
        style={{
          backgroundImage: 'url(https://cdn.geo.elelem.ai/onboarding/95909b4b7_elelembackground.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="max-w-xl relative z-10">
          <div 
            className="rounded-2xl p-8 text-white"
            style={{
              background: 'linear-gradient(135deg, #1E8B8B 0%, #C6DE41 100%)'
            }}
          >
            <h3 className="text-2xl font-bold mb-6">Proven Results</h3>
            
            <div className="bg-white rounded-xl p-6 mb-6">
              <img
                src="https://cdn.geo.elelem.ai/onboarding/b2e564b03_Sisu-Logo_Black.png"
                alt="Sisu Clinic"
                className="h-12 mb-4"
              />
              <p className="text-gray-700 text-sm leading-relaxed">
                Sisu Clinic is a doctor-led aesthetic medicine destination offering a comprehensive range of the world's most advanced beauty treatments.
              </p>
            </div>

            <h4 className="text-white text-lg font-semibold mb-4">
              In just 6 weeks elelem helped achieve:
            </h4>

            <div className="space-y-4">
              <div className="bg-white bg-opacity-10 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-[#1E8B8B]" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-white">37.5%</div>
                    <div className="text-white text-opacity-90 text-sm">Share of Voice (Brand Mentions)</div>
                  </div>
                </div>
              </div>

              <div className="bg-white bg-opacity-10 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                    <Link2 className="w-5 h-5 text-[#1E8B8B]" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-white">33%</div>
                    <div className="text-white text-opacity-90 text-sm">Increase in AI Search Links</div>
                  </div>
                </div>
              </div>

              <div className="bg-white bg-opacity-10 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-[#1E8B8B]" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-white">50%</div>
                    <div className="text-white text-opacity-90 text-sm">Increase in Brand Mentions</div>
                  </div>
                </div>
              </div>

              <div className="bg-white bg-opacity-10 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                    <Eye className="w-5 h-5 text-[#1E8B8B]" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-white">Now Visible</div>
                    <div className="text-white text-opacity-90 text-sm">in Gemini & Perplexity</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}