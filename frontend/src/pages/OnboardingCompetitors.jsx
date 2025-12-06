import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createPageUrl, getLocalStorageWithExpiry } from '@/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import ProgressBar from '../components/onboarding/ProgressBar';
import { ArrowRight, Plus, Building2, ArrowLeft } from 'lucide-react';
import CompetitorCard from '../components/onboarding/CompetitorCard';


const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


export default function OnboardingCompetitors() {
  const navigate = useNavigate();
  const [ownBrand, setOwnBrand] = useState(null);
  const [competitors, setCompetitors] = useState([]);
  const [originalCompetitors, setOriginalCompetitors] = useState([]);
  const [newCompetitorId, setNewCompetitorId] = useState(0);
  const [newCompetitorName, setNewCompetitorName] = useState('');
  const [newCompetitorWebsite, setNewCompetitorWebsite] = useState('');
  const [newCompetitorProducts, setNewCompetitorProducts] = useState('');
  const [loading, setLoading] = useState(false);

  const onboardingId = getLocalStorageWithExpiry('onboardingId');
  const businessLogic = getLocalStorageWithExpiry('businessLogic') ?? {};
  const { own_brand, competitor_brands } = businessLogic;
  const indexedCompetitors = competitor_brands?.map((competitor, id) => ({...competitor, id})) ?? [];

  useEffect(() => {
    if (!onboardingId || competitor_brands.length === 0) {
      console.error('Missing onboardingId or businessLogic, redirecting to Onboarding');
      navigate(createPageUrl('Onboarding'));
      return;
    }
    setNewCompetitorId(competitor_brands.length);
    setOwnBrand(own_brand);  
    setCompetitors(indexedCompetitors);
    setOriginalCompetitors(indexedCompetitors);
  }, []);


  const handleUpdate = (updatedCompetitor) => {
    setCompetitors((prevCompetitors) =>
      prevCompetitors.map((competitor) =>
        competitor.id === updatedCompetitor.id ? updatedCompetitor : competitor
      )
    );
  };

  const handleRemove = (competitorId) => {
    setCompetitors((prevCompetitors) =>
      prevCompetitors.filter((competitor) => competitor.id !== competitorId)
    );
  };

  const handleAdd = async () => {
    if (!newCompetitorName.trim()) return;
    
    try {
      const productNames = newCompetitorProducts.trim() 
        ? newCompetitorProducts.split(',').map(p => p.trim()).filter(p => p)
        : [];
      const newCompetitor = {
        id: newCompetitorId,
        name: newCompetitorName.trim(),
        domain: newCompetitorWebsite.trim(),
        brand_name_variations: productNames,
      };
      
      setCompetitors([...competitors, newCompetitor]);
      setNewCompetitorName('');
      setNewCompetitorWebsite('');
      setNewCompetitorProducts('');
      setNewCompetitorId(newCompetitorId + 1);
    } catch (error) {
      console.error('Error creating competitor:', error);
    }
  };

  const handleContinue = () => {
    confirmBusinessLogicUpdate();
    navigate(createPageUrl('OnboardingComplete'));
  };

  const confirmBusinessLogicUpdate = () => {
    setLoading(true);
    fetch(`${BACKEND_URL}/api/v1/business-logic/confirm?onboardingId=${onboardingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ own_brand: ownBrand, competitor_brands: competitors }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(
            'Failed to confirm business logic at /api/v1/business-logic/confirm'
          );
        }
        return res.json();
      })
      .then((data) => {
        if (data.success === false) {
          throw new Error(data.message || 'Failed to confirm business logic');
        }
        console.log('Business logic confirmed successfully');
      })
      .catch(error => {
        console.error('Error fetching business logic:', error);
      })
      .finally(() => setLoading(false));
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
            <Link to={createPageUrl('Home')}>
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
              onClick={() => navigate(createPageUrl('OnboardingOwnBrand'))}
              className="text-gray-600 hover:text-gray-900 mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <ProgressBar currentStep={3} totalSteps={3} onboardingId={onboardingId} />
          </div>
        </div>

        <div className="flex-1 flex items-start justify-center px-8 py-12 overflow-y-auto">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Review Competitors</h2>
            <p className="text-gray-600 mb-8">
              We identified these competitors. Adjust the list to match your needs.
            </p>

            <div className="space-y-3 mb-8 max-h-96 overflow-y-auto">
              {competitors.map((competitor) => (
                <CompetitorCard
                  key={competitor.id}
                  competitor={competitor}
                  originalData={originalCompetitors.find(c => c.id === competitor.id)}
                  onUpdate={handleUpdate}
                  onRemove={handleRemove}
                />
              ))}
              
              {competitors.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <Building2 className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No competitors added yet</p>
                </div>
              )}
            </div>

            {/* Add New */}
            <div className="border-t pt-6 mb-8">
              <h3 className="text-sm font-medium text-gray-700 mb-4">Add Competitor</h3>
              <div className="space-y-3">
                <Input
                  value={newCompetitorName}
                  onChange={(e) => setNewCompetitorName(e.target.value)}
                  placeholder="Competitor name"
                  className="w-full"
                />
                <Input
                  value={newCompetitorProducts}
                  onChange={(e) => setNewCompetitorProducts(e.target.value)}
                  placeholder="Product names, comma separated (optional)"
                  onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
                  className="flex-1"
                />
                <div className="flex gap-2">
                  <Input
                    value={newCompetitorWebsite}
                    onChange={(e) => setNewCompetitorWebsite(e.target.value)}
                    placeholder="Website"
                    onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleAdd}
                    style={{
                      background: 'linear-gradient(to right, #1E8B8B, #C6DE41)'
                    }}
                    className="hover:opacity-90"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
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
            <h3 className="text-2xl font-bold mb-6">Did you know?</h3>
            
            <p className="text-white text-opacity-90 text-lg leading-relaxed mb-8">
              elelem is built on 10 years AI content R&D, and by a multi-award-winning team that has built AI Content Intelligence solutions for the likes of:
            </p>

            <div className="grid grid-cols-2 gap-6">
              <div className="rounded-xl p-4 flex items-center justify-center h-20">
                <img
                  src="https://cdn.geo.elelem.ai/onboarding/18b6e1300_image.png"
                  alt="S&P Global"
                  className="max-h-10 max-w-full object-contain"
                  style={{ filter: 'brightness(0) invert(1)' }}
                />
              </div>

              <div className="rounded-xl p-4 flex items-center justify-center h-20">
                <img
                  src="https://cdn.geo.elelem.ai/onboarding/1a0c2f19a_image.png"
                  alt="BBC"
                  className="max-h-10 max-w-full object-contain"
                  style={{ filter: 'brightness(0) invert(1)' }}
                />
              </div>

              <div className="rounded-xl p-4 flex items-center justify-center h-20">
                <img
                  src="https://cdn.geo.elelem.ai/onboarding/35a9b2eea_image.png"
                  alt="Samsung"
                  className="max-h-10 max-w-full object-contain"
                  style={{ filter: 'brightness(0) invert(1)' }}
                />
              </div>

              <div className="rounded-xl p-4 flex items-center justify-center h-20">
                <img
                  src="https://cdn.geo.elelem.ai/onboarding/7905f7b3c_image.png"
                  alt="Hewlett Packard Enterprise"
                  className="max-h-10 max-w-full object-contain"
                  style={{ filter: 'brightness(0) invert(1)' }}
                />
              </div>

              <div className="rounded-xl p-4 flex items-center justify-center h-20">
                <img
                  src="https://cdn.geo.elelem.ai/onboarding/c4881c9b8_image.png"
                  alt="Reckitt"
                  className="max-h-10 max-w-full object-contain"
                  style={{ filter: 'brightness(0) invert(1)' }}
                />
              </div>

              <div className="rounded-xl p-4 flex items-center justify-center h-20">
                <img
                  src="https://cdn.geo.elelem.ai/onboarding/bed7bd0e9_image.png"
                  alt="Outbrain"
                  className="max-h-10 max-w-full object-contain"
                  style={{ filter: 'brightness(0) invert(1)' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}