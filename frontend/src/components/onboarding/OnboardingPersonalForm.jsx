import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";

export default function OnboardingPersonalForm({
  formData,
  saveFormData,
  errors,
  showPassword,
  setShowPassword,
}) {
  return (
    <>
      <div className="space-y-2">
        <Label
          htmlFor="email"
          className="text-base font-semibold text-gray-900"
        >
          Work email
        </Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => saveFormData({ ...formData, email: e.target.value })}
          placeholder="john@company.com"
          className={`h-14 text-base px-4 ${
            errors.email ? "border-red-500" : "border-gray-300"
          }`}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label
            htmlFor="first_name"
            className="text-base font-semibold text-gray-900"
          >
            First name
          </Label>
          <Input
            id="first_name"
            value={formData.first_name}
            onChange={(e) =>
              saveFormData({ ...formData, first_name: e.target.value })
            }
            placeholder="First name"
            className={`h-14 text-base px-4 ${
              errors.first_name ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.first_name && (
            <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="last_name"
            className="text-base font-semibold text-gray-900"
          >
            Last name
          </Label>
          <Input
            id="last_name"
            value={formData.last_name}
            onChange={(e) =>
              saveFormData({ ...formData, last_name: e.target.value })
            }
            placeholder="Last name"
            className={`h-14 text-base px-4 ${
              errors.last_name ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.last_name && (
            <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="password"
          className="text-base font-semibold text-gray-900"
        >
          Password
        </Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) =>
              saveFormData({ ...formData, password: e.target.value })
            }
            placeholder="Enter password"
            className={`h-14 text-base px-4 pr-12 ${
              errors.password ? "border-red-500" : "border-gray-300"
            }`}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        {errors.password ? (
          <p className="text-red-500 text-sm mt-1">{errors.password}</p>
        ) : (
          <p className="text-gray-400 text-sm mt-1">
            Password must be at least 8 characters
          </p>
        )}
      </div>
    </>
  );
}
