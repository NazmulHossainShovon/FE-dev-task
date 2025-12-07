import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Upload, X } from "lucide-react";
import PropTypes from "prop-types";

export default function OnboardingBusinessForm({
  formData,
  saveFormData,
  errors,
  keywordFile,
  setKeywordFile,
  handleFileChange,
}) {
  return (
    <>
      <div className="space-y-3">
        <Label
          htmlFor="website"
          className="text-base font-semibold text-gray-900"
        >
          Website
        </Label>
        <Input
          id="website"
          value={formData.website}
          onChange={(e) =>
            saveFormData({ ...formData, website: e.target.value })
          }
          placeholder="https://yourbrand.com"
          className={`h-14 text-base px-4 ${
            errors.website ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.website && (
          <p className="text-red-500 text-sm">{errors.website}</p>
        )}
      </div>

      <div className="space-y-3">
        <Label
          htmlFor="country"
          className="text-base font-semibold text-gray-900"
        >
          Country
        </Label>
        <select
          id="country"
          value={formData.country}
          onChange={(e) =>
            saveFormData({ ...formData, country: e.target.value })
          }
          className={`w-full h-14 text-base px-4 border rounded-lg bg-white ${
            errors.country ? "border-red-500" : "border-gray-300"
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900`}
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
        {errors.country && (
          <p className="text-red-500 text-sm">{errors.country}</p>
        )}
      </div>

      <div className="space-y-3">
        <Label
          htmlFor="business_description"
          className="text-base font-semibold text-gray-900"
        >
          Tell us about your business{" "}
          <span className="text-gray-500 font-normal text-sm">
            (recommended but optional)
          </span>
        </Label>
        <Textarea
          id="business_description"
          value={formData.business_description || ""}
          onChange={(e) =>
            saveFormData({
              ...formData,
              business_description: e.target.value,
            })
          }
          placeholder="e.g. We provide cloud-based HR software for small businesses. Our ideal customers are companies with 10-100 employees looking to streamline their HR processes..."
          className="min-h-32 text-base px-4 py-3 resize-none"
        />
      </div>

      <div className="space-y-3">
        <Label className="text-base font-semibold text-gray-900">
          Upload an export of your Google Search Console or SEO keyword list{" "}
          <span className="text-gray-500 font-normal text-sm">
            (recommended but optional)
          </span>
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
                <span className="text-base text-gray-700">
                  {keywordFile.name}
                </span>
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
    </>
  );
}

OnboardingBusinessForm.propTypes = {
  formData: PropTypes.object.isRequired,
  saveFormData: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  keywordFile: PropTypes.object,
  setKeywordFile: PropTypes.func.isRequired,
  handleFileChange: PropTypes.func.isRequired,
};
