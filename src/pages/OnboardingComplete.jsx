import { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import { Button } from '@/components/ui/button';
import { getLocalStorageWithExpiry } from '@/utils';
import { CheckCircle2, Sparkles, TrendingUp, Eye, Target, Search, BarChart3, Clock } from 'lucide-react';


const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


export default function OnboardingComplete() {
  const [loading, setLoading] = useState(false);
  const onboardingId = getLocalStorageWithExpiry('onboardingId');
  const confettiFired = useRef(false);

  useEffect(() => {
    if (!onboardingId) {
      console.error('Onboarding ID not found in local storage.');
      return;
    }
    completeOnboarding();

    // Animation: fire confetti once on mount
    if (!confettiFired.current) {
      confettiFired.current = true;
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 }
      });
    }
  }, []);

  const completeOnboarding = () => {
    setLoading(true);
    fetch(`${BACKEND_URL}/api/v1/complete-onboarding?onboardingId=${onboardingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(
            'Failed to complete onboarding at /api/v1/complete-onboarding'
          );
        }
        return res.json();
      })
      .then((data) => {
        if (data.success === false) {
          throw new Error(data.message || 'Failed to confirm business logic');
        }
        console.log('Onboarding completed successfully');
      })
      .catch(error => {
        console.error('Error completing onboarding:', error);
      })
      .finally(() => {
        setLoading(false);
        // Session cleanup
        localStorage.clear();
      });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <div 
            className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 animate-bounce"
            style={{
              background: 'linear-gradient(135deg, #1E8B8B, #C6DE41)'
            }}
          >
            <CheckCircle2 className="w-12 h-12 text-white" />
          </div>
          
          <h1 className="text-6xl font-bold text-gray-900 mb-8">
            Welcome to elelem! 🎉
          </h1>
          
          <div 
            className="rounded-2xl p-8 text-white text-center mb-8"
            style={{
              background: 'linear-gradient(to right, #1E8B8B, #C6DE41)'
            }}
          >
            <h3 className="text-2xl font-bold mb-2">
              We're analyzing your data now
            </h3>
            <p className="text-white text-opacity-90 mb-4">
              Your first insights will be ready within 24 hours. We'll send you an email when your dashboard is populated with data and ready to roll!
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-10 mb-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-[#1E8B8B]" />
            What's Next?
          </h2>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: 'linear-gradient(135deg, rgba(30, 139, 139, 0.1), rgba(198, 222, 65, 0.1))'
                }}
              >
                <Search className="w-6 h-6 text-[#1E8B8B]" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-1">
                  Do LIVE Prompt research
                </h3>
                <p className="text-gray-600">
                  Track how often AI models mention your brand across different platforms and queries
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: 'linear-gradient(135deg, rgba(30, 139, 139, 0.1), rgba(198, 222, 65, 0.1))'
                }}
              >
                <BarChart3 className="w-6 h-6 text-[#1E8B8B]" />
              </div>
              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-1">
                  Benchmark vs Competitors for each Prompt
                </h3>
                <p className="text-gray-600">
                  See how you stack up against competitors in AI-generated responses
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
              <Clock className="w-6 h-6 text-[#1E8B8B]" />
              In just 24 hours
            </h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              We will email you to let you know elelem's Content Intelligence engine has finished analysis and then you can:
            </p>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, rgba(30, 139, 139, 0.1), rgba(198, 222, 65, 0.1))'
                  }}
                >
                  <Target className="w-6 h-6 text-[#1E8B8B]" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">
                    See which prompts to focus on
                  </h3>
                  <p className="text-gray-600">
                    elelem will rank prompts by popularity or identify gaps to fill to lay out next clear steps
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, rgba(30, 139, 139, 0.1), rgba(198, 222, 65, 0.1))'
                  }}
                >
                  <Eye className="w-6 h-6 text-[#1E8B8B]" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">
                    Get Actionable Insights
                  </h3>
                  <p className="text-gray-600">
                    Receive recommendations on how to improve your AI visibility as an actionable brief or 1st draft in your tone and style
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div 
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, rgba(30, 139, 139, 0.1), rgba(198, 222, 65, 0.1))'
                  }}
                >
                  <TrendingUp className="w-6 h-6 text-[#1E8B8B]" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-1">
                    Track Improvements
                  </h3>
                  <p className="text-gray-600">
                    Transparently see the impact your optimization is having on visibility, traffic and sales
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Button
            onClick={() => window.location.href = 'https://geo.elelem.ai'}
            style={{
              background: 'linear-gradient(to right, #1E8B8B, #C6DE41)'
            }}
            className="hover:opacity-90 text-white px-12 h-14 text-lg font-medium rounded-xl"
          >
            Go to Dashboard
          </Button>
          <p className="text-sm text-gray-500 mt-4">
            You can always adjust your settings from the dashboard
          </p>
        </div>

        {loading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-80">
            <div className="flex flex-col items-center">
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center mb-6 animate-spin-slow"
                style={{
                  background: 'linear-gradient(135deg, #1E8B8B, #C6DE41)',
                  boxShadow: '0 0 40px 10px #C6DE41, 0 0 80px 20px #1E8B8B'
                }}
              >
                <CheckCircle2 className="w-12 h-12 text-white drop-shadow-lg" />
              </div>
              <div className="text-2xl font-bold text-[#1E8B8B] mb-2">Completing onboarding...</div>
              <div className="text-gray-600">Hang tight while we complete your dashboard configuration!</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}