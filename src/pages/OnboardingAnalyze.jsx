import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createPageUrl, getLocalStorageWithExpiry, setLocalStorageWithExpiry } from '@/utils';
import { Brain, ArrowLeft } from 'lucide-react';
import ProgressBar from '../components/onboarding/ProgressBar';
import { Button } from '@/components/ui/button';


const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


export default function OnboardingAnalyze() {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);
  const [currentTask, setCurrentTask] = useState('Analyzing your website...');
  
  const onboardingId = getLocalStorageWithExpiry('onboardingId');
  const getStartedRequest = getLocalStorageWithExpiry('getStartedRequest');

  useEffect(() => {  
    if (!onboardingId || !getStartedRequest) {
      navigate(createPageUrl('Onboarding'));
      return;
    }
    getBusinessLogic();
  }, []);

  const getBusinessLogic = () => {
    const progressSteps = [
      { value: 20, task: 'Analyzing your website...' },
      { value: 30, task: 'Discovering competitors...' },
      { value: 60, task: 'Identifying brands and products...' },
    ];
    // Start a timer to simulate progress
    let step = 0;
    const interval = setInterval(() => {
      if (step < progressSteps.length) {
        setProgress(progressSteps[step].value);
        setCurrentTask(progressSteps[step].task);
        step++;
      }
    }, 1500); // Update every 1.5 seconds

    // Start the fetch in parallel
    fetch(`${BACKEND_URL}/api/v1/business-logic/get-started?onboardingId=${onboardingId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(getStartedRequest),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(
            'Failed to fetch business logic from /api/v1/business-logic/get-started'
          );
        }
        return res.json();
      })
      .then((data) => {
        setLocalStorageWithExpiry('businessLogic', data, 30); // 30 minutes expiry
        clearInterval(interval);
        setProgress(100);
        setCurrentTask('Analysis complete!');
        proceedToNextStep();
      })
      .catch(error => {
        clearInterval(interval);
        setProgress(0);
        setCurrentTask('Error loading business logic');
        console.error('Error fetching business logic:', error);
      });
  }

  const proceedToNextStep = () => {
    navigate(createPageUrl('OnboardingOwnBrand'));
  };

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
              onClick={() => navigate(createPageUrl('Onboarding') + `?id=${onboardingId}`)}
              className="text-gray-600 hover:text-gray-900 mb-6"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <ProgressBar currentStep={1} totalSteps={3} onboardingId={onboardingId} />
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center px-8 py-12">
          <div className="w-full max-w-md text-center">
            <div 
              className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse"
              style={{
                background: 'linear-gradient(135deg, #1E8B8B, #C6DE41)'
              }}
            >
              <Brain className="w-12 h-12 text-white" />
            </div>
            
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Analyzing Your Brand
            </h2>
            
            <p className="text-gray-600 mb-8 text-lg">{currentTask}</p>

            <div className="w-full max-w-sm mx-auto">
              <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
                <div
                  className="h-full transition-all duration-500 ease-out"
                  style={{ 
                    width: `${progress}%`,
                    background: 'linear-gradient(to right, #1E8B8B, #C6DE41)'
                  }}
                />
              </div>
              <p className="text-center text-sm text-gray-500 mt-3">{progress}% complete</p>
            </div>
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
        <div className="max-w-xl relative z-10 space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              "I have used a number of AEO tools and kept hitting a brick wall. With elelem we were optimizing our content and seeing visibility in AI search platforms within just 2 weeks"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-white font-semibold">
                MW
              </div>
              <div>
                <p className="font-semibold text-gray-900">Mark Wood</p>
                <p className="text-sm text-gray-600">Former Editor in Chief at Reuters</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              "elelem's process and ease of going from clueless to seeing results was impressive"
            </p>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-white font-semibold">
                EW
              </div>
              <div>
                <p className="font-semibold text-gray-900">Eric Wilkinson</p>
                <p className="text-sm text-gray-600">Co-Founder of TopGolf</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
