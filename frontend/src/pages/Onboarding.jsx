import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  createPageUrl,
  getLocalStorageWithExpiry,
  setLocalStorageWithExpiry,
} from "@/utils";

import OTPVerification from "@/components/onboarding/OTPVerification";
import OnboardingHeader from "@/components/onboarding/OnboardingHeader";
import OnboardingBusinessForm from "@/components/onboarding/OnboardingBusinessForm";
import OnboardingPersonalForm from "@/components/onboarding/OnboardingPersonalForm";
import OnboardingSidebar from "@/components/onboarding/OnboardingSidebar";
import OnboardingFooter from "@/components/onboarding/OnboardingFooter";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export default function Onboarding() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(
    () =>
      getLocalStorageWithExpiry("onboardingFormData") ?? {
        first_name: "",
        last_name: "",
        email: "",
        password: "",
        website: "",
        business_description: "",
        country: "",
      }
  );

  const [keywordFile, setKeywordFile] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [onboardingId, setOnboardingId] = useState(() =>
    getLocalStorageWithExpiry("onboardingId")
  );

  const saveOnboardingId = (value) => {
    setOnboardingId(value);
    // 30 minutes expiry
    setLocalStorageWithExpiry("onboardingId", value, 30);
  };

  const saveFormData = (data) => {
    setFormData(data);
    // 30 minutes expiry
    setLocalStorageWithExpiry(
      "onboardingFormData",
      { ...data, password: "" },
      30
    );
  };

  useEffect(() => {
    console.log(onboardingId);

    if (onboardingId) {
      return;
    }
    const startSession = () => {
      fetch(`${BACKEND_URL}/api/v1/session/start`, {
        method: "GET",
        credentials: "include",
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Session started:", data);
          saveOnboardingId(data.onboardingId);
        })
        .catch((error) => {
          console.error("Error starting session:", error);
        });
    };
    startSession();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Work email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.first_name.trim())
      newErrors.first_name = "First name is required";
    if (!formData.last_name.trim())
      newErrors.last_name = "Last name is required";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (!formData.website.trim()) newErrors.website = "Website is required";
    else if (!/^https?:\/\/.+/.test(formData.website))
      newErrors.website =
        "Please enter a valid URL (include http:// or https://)";
    if (!formData.country) newErrors.country = "Country is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = [
        "text/csv",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ];
      if (validTypes.includes(file.type) || file.name.endsWith(".csv")) {
        setKeywordFile(file);
        setErrors((prevErrors) => {
          const newErrors = { ...prevErrors };
          delete newErrors.file;
          return newErrors;
        });
      } else {
        setErrors({ ...errors, file: "Please upload a CSV" });
      }
    }
  };

  const uploadKeywordFile = async () => {
    if (!keywordFile) {
      return null;
    }

    if (!onboardingId) {
      throw new Error(
        "Session not initialized. Please refresh the page and try again."
      );
    }

    try {
      const formData = new FormData();
      formData.append("file", keywordFile);

      console.log("Uploading file with onboardingId:", onboardingId);

      const response = await fetch(
        `${BACKEND_URL}/api/v1/business-logic/csv-upload?onboardingId=${onboardingId}`,
        {
          method: "PUT",
          credentials: "include",
          body: formData,
        }
      );

      const data = await response.json();
      console.log("CSV Upload Result:", data);

      if (!response.ok) {
        throw new Error(data.detail || "Failed to upload file");
      }

      return data;
    } catch (error) {
      console.error("Error uploading CSV file:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Saving data to localStorage for next screen (including the file for later upload)
      setLocalStorageWithExpiry(
        "getStartedRequest",
        {
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
          },
        },
        30
      ); // 30 minutes expiry

      // Save file info separately (we'll upload it after OTP verification)
      if (keywordFile) {
        // Store file name as a flag that file needs to be uploaded
        setLocalStorageWithExpiry(
          "pendingFileUpload",
          {
            fileName: keywordFile.name,
            fileSize: keywordFile.size,
          },
          30
        );
      }

      // User verification - send OTP
      const response = await fetch(
        `${BACKEND_URL}/api/v1/user-verification/send-otp?onboardingId=${onboardingId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ email: formData.email }),
        }
      );

      const data = await response.json();
      if (response.status === 401) {
        console.log("Session expired. Starting a new session.");
        localStorage.removeItem("onboardingId");
        window.location.reload();
        return;
      }

      if (response.status === 400) {
        throw new Error("Email already in use. Please use a different email.");
      }

      if (!response.ok) {
        throw new Error(data.detail || "Failed to send OTP. Please try again.");
      }

      console.log("OTP sent successfully");

      setShowOTP(true);
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error sending OTP:", error);
      setErrors({ ...errors, submit: error.message });
      setIsSubmitting(false);
    }
  };

  const handleOTPVerify = async (code) => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/api/v1/user-verification/verify-otp?onboardingId=${onboardingId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ email: formData.email, otp: code }),
        }
      );

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "OTP verification failed");
      }

      console.log("OTP verified successfully");

      await new Promise((resolve) => setTimeout(resolve, 200));

      // Now that we have auth token, upload the CSV file if present
      if (keywordFile) {
        try {
          const uploadResult = await uploadKeywordFile();
          console.log(
            "File uploaded successfully after OTP verification:",
            uploadResult
          );

          const existingData =
            getLocalStorageWithExpiry("getStartedRequest") || {};
          setLocalStorageWithExpiry(
            "getStartedRequest",
            {
              ...existingData,
              csvUploadResult: uploadResult,
            },
            30
          );

          // Clear the pending upload flag
          localStorage.removeItem("pendingFileUpload");
        } catch (uploadError) {
          console.error(
            "Error uploading file after OTP verification:",
            uploadError
          );
        }
      }

      proceedToNextStep();
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setErrors({
        ...errors,
        submit: "OTP verification failed. Please try again.",
      });
    }
  };

  const proceedToNextStep = () => {
    navigate(createPageUrl("OnboardingAnalyze"));
  };

  const handleCloseOTP = () => {
    setShowOTP(false);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex">
      <div className="w-full lg:w-1/2 flex flex-col bg-white">
        <OnboardingHeader />

        <div className="flex-1 flex items-center justify-center px-8 py-12 overflow-y-auto">
          <div className="w-full max-w-md">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Start tracking your brand
            </h1>
            <p className="text-gray-600 mb-10">
              This will be the first brand you&apos;ll track on elelem — you can
              add more later.
            </p>

            <form onSubmit={handleSubmit} className="space-y-7">
              <OnboardingBusinessForm
                formData={formData}
                saveFormData={saveFormData}
                errors={errors}
                keywordFile={keywordFile}
                setKeywordFile={setKeywordFile}
                handleFileChange={handleFileChange}
              />

              <OnboardingPersonalForm
                formData={formData}
                saveFormData={saveFormData}
                errors={errors}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
              />

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
                {isSubmitting ? "Starting..." : "Continue"}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <a
                href="https://geo.elelem.ai"
                className="text-sm text-gray-500 hover:text-gray-700 underline"
              >
                Already have an account?
              </a>
            </div>
          </div>
        </div>

        <OnboardingFooter />
      </div>

      <OnboardingSidebar />

      <OTPVerification
        isOpen={showOTP}
        onClose={handleCloseOTP}
        onVerify={handleOTPVerify}
        email={formData.email}
      />
    </div>
  );
}
