import React from 'react';
import { Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function ProgressBar({ currentStep, totalSteps, onboardingId }) {
  const navigate = useNavigate();

  const getPageForStep = (step) => {
    const pages = {
      1: 'Onboarding',
      2: 'OnboardingOwnBrand',
      3: 'OnboardingCompetitors'
    };
    return pages[step];
  };

  const handleStepClick = (step) => {
    if (step <= currentStep && onboardingId) {
      const pageName = getPageForStep(step);
      if (step === 1) {
        navigate(createPageUrl(pageName));
      } else {
        navigate(createPageUrl(pageName) + `?id=${onboardingId}`);
      }
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto mb-12">
      <div className="flex items-center justify-between">
        {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
          <React.Fragment key={step}>
            <div className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                  step < currentStep
                    ? 'text-white cursor-pointer hover:scale-110'
                    : step === currentStep
                    ? 'text-white ring-4 ring-opacity-20'
                    : 'bg-gray-200 text-gray-400'
                } ${step <= currentStep ? 'cursor-pointer' : ''}`}
                style={
                  step <= currentStep
                    ? {
                        background: 'linear-gradient(to right, #1E8B8B, #C6DE41)',
                        ...(step === currentStep && { boxShadow: '0 0 0 4px rgba(30, 139, 139, 0.2)' })
                      }
                    : {}
                }
                onClick={() => handleStepClick(step)}
              >
                {step < currentStep ? (
                  <Check className="w-6 h-6" />
                ) : (
                  <span className="font-semibold">{step}</span>
                )}
              </div>
              <span className="text-xs mt-2 text-gray-600">
                {step === 1 && 'Details'}
                {step === 2 && 'Your Brand'}
                {step === 3 && 'Competitors'}
              </span>
            </div>
            {step < totalSteps && (
              <div
                className={`flex-1 h-1 mx-2 transition-all duration-300`}
                style={
                  step < currentStep
                    ? { background: 'linear-gradient(to right, #1E8B8B, #C6DE41)' }
                    : { background: '#E5E7EB' }
                }
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}