import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { createPageUrl, getLocalStorageWithExpiry, setLocalStorageWithExpiry } from '@/utils';
import { Upload, X, Eye, EyeOff, Search, TrendingUp, Target, Lightbulb } from 'lucide-react';
import OTPVerification from '@/components/onboarding/OTPVerification';
import { Textarea } from '@/components/ui/textarea';


const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;


export default function Onboarding() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(() => getLocalStorageWithExpiry('onboardingFormData') ?? {
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    website: '',
    business_description: '',
    country: ''
  });

  const [keywordFile, setKeywordFile] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [onboardingId, setOnboardingId] = useState(() => getLocalStorageWithExpiry('onboardingId'));

  const saveOnboardingId = (value) => {
    setOnboardingId(value);
    // 30 minutes expiry
    setLocalStorageWithExpiry('onboardingId', value, 30);
  }

  const saveFormData = (data) => {
    setFormData(data);
    // 30 minutes expiry
    setLocalStorageWithExpiry('onboardingFormData', {...data, password: ''}, 30);
  }

  useEffect(() => {
    if (!!onboardingId) {
      return
    }
    const startSession = () => {
      fetch(`${BACKEND_URL}/api/v1/session/start`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(response => response.json())
      .then(data => {
        console.log('Session started:', data);
        saveOnboardingId(data.onboarding_id);
      })
      .catch((error) => {
        console.error('Error starting session:', error);
      });
    }
    startSession();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = 'Work email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.first_name.trim()) newErrors.first_name = 'First name is required';
    if (!formData.last_name.trim()) newErrors.last_name = 'Last name is required';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (!formData.website.trim()) newErrors.website = 'Website is required';
    else if (!/^https?:\/\/.+/.test(formData.website)) newErrors.website = 'Please enter a valid URL (include http:// or https://)';
    if (!formData.country) newErrors.country = 'Country is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = [
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];
      if (validTypes.includes(file.type) || file.name.endsWith('.csv')) {
        setKeywordFile(file);
        setErrors(prevErrors => {
          const newErrors = { ...prevErrors };
          delete newErrors.file;
          return newErrors;
        });
      } else {
        setErrors({ ...errors, file: 'Please upload a CSV' });
      }
    }
  };

  const uploadKeywordFile = async () => {
    if (!keywordFile) {
      return null;
    }

    if (!onboardingId) {
      throw new Error('Session not initialized. Please refresh the page and try again.');
    }

    try {
      const formData = new FormData();
      formData.append('file', keywordFile);

      console.log('Uploading file with onboardingId:', onboardingId);

      const response = await fetch(`${BACKEND_URL}/api/v1/business-logic/csv-upload?onboardingId=${onboardingId}`, {
        method: 'PUT',
        credentials: 'include',
        body: formData,
      });

      const data = await response.json();
      console.log('CSV Upload Result:', data);

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to upload file');
      }

      return data;
    } catch (error) {
      console.error('Error uploading CSV file:', error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Saving data to localStorage for next screen (including the file for later upload)
      setLocalStorageWithExpiry('getStartedRequest', {
        client: {
          about: formData.business_description.trim(),
          country: formData.country.trim(),
          website: formData.website.trim(),
        },
        user: {
          email: formData.email.trim(),
          firstname: formData.first_name.trim(),
          lastname: formData.last_name.trim(),
          password: formData.password.trim(),
        }
      }, 30); // 30 minutes expiry

      // Save file info separately (we'll upload it after OTP verification)
      if (keywordFile) {
        // Store file name as a flag that file needs to be uploaded
        setLocalStorageWithExpiry('pendingFileUpload', {
          fileName: keywordFile.name,
          fileSize: keywordFile.size
        }, 30);
      }

      // User verification - send OTP
      const response = await fetch(`${BACKEND_URL}/api/v1/user-verification/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await response.json();
      if (response.status === 401) {
        console.log("Session expired. Starting a new session.");
        localStorage.removeItem('onboardingId');
        window.location.reload();
        return;
      }

      if (response.status === 400) {
        throw new Error("Email already in use. Please use a different email.");
      }

      if (!response.ok) {
        throw new Error(data.detail || 'Failed to send OTP. Please try again.');
      }

      console.log('OTP sent successfully');

      setShowOTP(true);
      setIsSubmitting(false);
    } catch (error) {
      console.error('Error sending OTP:', error);
      setErrors({ ...errors, submit: error.message});
      setIsSubmitting(false);
    }
  };

  const handleOTPVerify = async (code) => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/v1/user-verification/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email: formData.email, otp: code }),
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.message || 'OTP verification failed');
      }
      
      console.log('OTP verified successfully');

      // Now that we have auth token, upload the CSV file if present
      if (keywordFile) {
        try {
          const uploadResult = await uploadKeywordFile();
          console.log('File uploaded successfully after OTP verification:', uploadResult);
          
          const existingData = getLocalStorageWithExpiry('getStartedRequest') || {};
          setLocalStorageWithExpiry('getStartedRequest', {
            ...existingData,
            csvUploadResult: uploadResult
          }, 30);
          
          // Clear the pending upload flag
          localStorage.removeItem('pendingFileUpload');
        } catch (uploadError) {
          console.error('Error uploading file after OTP verification:', uploadError);
        }
      }

      proceedToNextStep();
    } catch (error) {
      console.error('Error verifying OTP:', error);
      setErrors({ ...errors, submit: 'OTP verification failed. Please try again.' });
    }
  };

  const proceedToNextStep = () => {
    navigate(createPageUrl('OnboardingAnalyze'));
  };

  const handleCloseOTP = () => {
    setShowOTP(false);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex">
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

        <div className="flex-1 flex items-center justify-center px-8 py-12 overflow-y-auto">
          <div className="w-full max-w-md">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Start tracking your brand
            </h1>
            <p className="text-gray-600 mb-10">
              This will be the first brand you'll track on elelem — you can add more later.
            </p>

            <form onSubmit={handleSubmit} className="space-y-7">
              <div className="space-y-3">
                <Label htmlFor="website" className="text-base font-semibold text-gray-900">
                  Website
                </Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => saveFormData({ ...formData, website: e.target.value })}
                  placeholder="https://yourbrand.com"
                  className={`h-14 text-base px-4 ${errors.website ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.website && <p className="text-red-500 text-sm">{errors.website}</p>}
              </div>

              <div className="space-y-3">
                <Label htmlFor="country" className="text-base font-semibold text-gray-900">
                  Country
                </Label>
                <select
                  id="country"
                  value={formData.country}
                  onChange={(e) => saveFormData({ ...formData, country: e.target.value })}
                  className={`w-full h-14 text-base px-4 border rounded-lg bg-white ${errors.country ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900`}
                >
                  <option value="">Select your country</option>
                  <option value="United States">United States</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                  <option value="Spain">Spain</option>
                  <option value="Italy">Italy</option>
                  <option value="Netherlands">Netherlands</option>
                  <option value="Belgium">Belgium</option>
                  <option value="Switzerland">Switzerland</option>
                  <option value="Austria">Austria</option>
                  <option value="Sweden">Sweden</option>
                  <option value="Norway">Norway</option>
                  <option value="Denmark">Denmark</option>
                  <option value="Finland">Finland</option>
                  <option value="Ireland">Ireland</option>
                  <option value="Poland">Poland</option>
                  <option value="Czech Republic">Czech Republic</option>
                  <option value="Portugal">Portugal</option>
                  <option value="Greece">Greece</option>
                  <option value="Japan">Japan</option>
                  <option value="South Korea">South Korea</option>
                  <option value="Singapore">Singapore</option>
                  <option value="Hong Kong">Hong Kong</option>
                  <option value="Bangladesh">Bangladesh</option>
                  <option value="India">India</option>
                  <option value="China">China</option>
                  <option value="Brazil">Brazil</option>
                  <option value="Mexico">Mexico</option>
                  <option value="Argentina">Argentina</option>
                  <option value="Chile">Chile</option>
                  <option value="South Africa">South Africa</option>
                  <option value="Israel">Israel</option>
                  <option value="United Arab Emirates">United Arab Emirates</option>
                  <option value="Saudi Arabia">Saudi Arabia</option>
                  <option value="New Zealand">New Zealand</option>
                  <option value="Other">Other</option>
                </select>
                {errors.country && <p className="text-red-500 text-sm">{errors.country}</p>}
              </div>

              <div className="space-y-3">
                <Label htmlFor="business_description" className="text-base font-semibold text-gray-900">
                  Tell us about your business{' '}
                  <span className="text-gray-500 font-normal text-sm">(recommended but optional)</span>
                </Label>
                <Textarea
                  id="business_description"
                  value={formData.business_description || ''}
                  onChange={(e) => saveFormData({ ...formData, business_description: e.target.value })}
                  placeholder="e.g. We provide cloud-based HR software for small businesses. Our ideal customers are companies with 10-100 employees looking to streamline their HR processes..."
                  className="min-h-32 text-base px-4 py-3 resize-none"
                />
              </div>

              <div className="space-y-3">
                <Label className="text-base font-semibold text-gray-900">
                  Upload an export of your Google Search Console or SEO keyword list{' '}
                  <span className="text-gray-500 font-normal text-sm">(recommended but optional)</span>
                </Label>
                
                <div className="relative">
                  <input
                    type="file"
                    id="keyword-file"
                    accept=".csv"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {!keywordFile ? (
                    <label
                      htmlFor="keyword-file"
                      className="flex items-center justify-center gap-2 w-full h-14 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 cursor-pointer transition-colors"
                    >
                      <Upload className="w-5 h-5 text-gray-500" />
                      <span className="text-base text-gray-600">Choose file</span>
                    </label>
                  ) : (
                    <div className="flex items-center justify-between p-4 border border-gray-300 rounded-lg bg-gray-50">
                      <div className="flex items-center gap-2">
                        <Upload className="w-5 h-5 text-green-600" />
                        <span className="text-base text-gray-700">{keywordFile.name}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setKeywordFile(null)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>
                {errors.file && <p className="text-red-500 text-sm">{errors.file}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-base font-semibold text-gray-900">
                  Work email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => saveFormData({ ...formData, email: e.target.value })}
                  placeholder="john@company.com"
                  className={`h-14 text-base px-4 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name" className="text-base font-semibold text-gray-900">
                    First name
                  </Label>
                  <Input
                    id="first_name"
                    value={formData.first_name}
                    onChange={(e) => saveFormData({ ...formData, first_name: e.target.value })}
                    placeholder="First name"
                    className={`h-14 text-base px-4 ${errors.first_name ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.first_name && <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="last_name" className="text-base font-semibold text-gray-900">
                    Last name
                  </Label>
                  <Input
                    id="last_name"
                    value={formData.last_name}
                    onChange={(e) => saveFormData({ ...formData, last_name: e.target.value })}
                    placeholder="Last name"
                    className={`h-14 text-base px-4 ${errors.last_name ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-base font-semibold text-gray-900">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => saveFormData({ ...formData, password: e.target.value })}
                    placeholder="Enter password"
                    className={`h-14 text-base px-4 pr-12 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password ? (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                ) : (
                  <p className="text-gray-400 text-sm mt-1">Password must be at least 8 characters</p>
                )}
              </div>

              {errors.submit && (
                <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
                  {errors.submit}
                </div>
              )}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gray-900 hover:bg-gray-800 text-white h-14 text-base font-medium rounded-lg"
              >
                {isSubmitting ? 'Starting...' : 'Continue'}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <a href="https://geo.elelem.ai" className="text-sm text-gray-500 hover:text-gray-700 underline">
                Already have an account?
              </a>
            </div>
          </div>
        </div>

        <div className="p-8 flex justify-between text-sm text-gray-500">
          <a href="#" className="hover:text-gray-700">Contact us</a>
          <div className="flex gap-4">
            <a href="#" className="hover:text-gray-700">Privacy Policy</a>
            <span>© 2025 elelem</span>
          </div>
        </div>
      </div>

      <div 
        className="hidden lg:flex w-1/2 items-start justify-center p-12 pt-32 relative overflow-hidden"
        style={{
          backgroundImage: 'url(https://cdn.geo.elelem.ai/onboarding/95909b4b7_elelembackground.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="max-w-xl relative z-10">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              The elelem 4-step route to winning<br />in AI Search
            </h3>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#1E8B8B] bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Search className="w-5 h-5 text-[#1E8B8B]" />
                </div>
                <p>Find the questions your audience is asking</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#1E8B8B] bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-[#1E8B8B]" />
                </div>
                <p>See your brand's AI Search visibility vs Competitors</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#1E8B8B] bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Target className="w-5 h-5 text-[#1E8B8B]" />
                </div>
                <p>Identify high-value, high-intent questions</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#1E8B8B] bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="w-5 h-5 text-[#1E8B8B]" />
                </div>
                <p>How to optimize your content to boost visibility</p>
              </div>
              <p className="mt-6">
                Then simply publish and expose your content to LLMs and transparently track the results.
              </p>
            </div>
          </div>
        </div>
      </div>

      <OTPVerification
        isOpen={showOTP}
        onClose={handleCloseOTP}
        onVerify={handleOTPVerify}
        email={formData.email}
      />
    </div>
  );
}