import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { CheckCircle2, AlertCircle } from "lucide-react";
import usePageTitle from "../hooks/usePageTitle";
import { API_BASE } from "../config/api";

const HELP_OPTIONS = [
  { id: "goods", label: "Donating physical goods" },
  { id: "volunteering", label: "On-ground volunteering" },
  { id: "logistics", label: "Logistics & transport" },
];

const INITIAL_FORM = {
  fullName: "",
  email: "",
  password: "",
  aadhaarId: "",
  city: "",
  state: "",
  helpTypes: [],
};

export default function SupporterForm() {
  usePageTitle("Join as a Supporter");
  const navigate = useNavigate();

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleHelpType = (id) => {
    setFormData((prev) => {
      const isSelected = prev.helpTypes.includes(id);
      return {
        ...prev,
        helpTypes: isSelected
          ? prev.helpTypes.filter((h) => h !== id)
          : [...prev.helpTypes, id],
      };
    });
  };

  const validate = () => {
  const errors = {};

  if (!formData.fullName.trim()) {
    errors.fullName = "Full name is required.";
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (formData.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  } else if (
    !/[A-Z]/.test(formData.password) ||
    !/[a-z]/.test(formData.password) ||
    !/[0-9]/.test(formData.password)
  ) {
    errors.password =
      "Password must contain uppercase, lowercase, and a number.";
  }
  if (!/^\d{12}$/.test(formData.aadhaarId)) {
  errors.aadhaarId = "Enter a valid 12-digit Aadhaar ID.";
}

  if (!formData.city.trim() || !formData.state.trim()) {
    errors.location = "City and state are required.";
  }

  if (formData.helpTypes.length === 0) {
    errors.helpTypes = "Please select at least one way you can help.";
  }

  setFieldErrors(errors);
  return Object.keys(errors).length === 0;
};

 const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    if (!validate()) return;

    setIsLoading(true);
    try {
      // ADDED // TO FIX SYNTAX ERROR
      // Placeholder endpoint — backend wiring handled separately.
      
      const res = await fetch(`${API_BASE}/api/auth/register/individual`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          aadhaarId: formData.aadhaarId, // MAKE SURE TO ADD THIS SO IT SENDS TO BACKEND!
          city: formData.city, 
          state: formData.state,
          helpTypes: formData.helpTypes,
        }),
      });

      const data = await res.json(); // Get the response from our backend

      if (res.status === 409) {
        setApiError(data.message || "This email or ID is already registered.");
        return;
      }

      if (!res.ok) {
        setApiError(data.message || "Something went wrong. Please check your information and try again.");
        return;
      }

      setSuccessMessage("Registration successful! Redirecting you to login...");
      
      // Delay navigation so user can see positive confirmation
      setTimeout(() => {
        navigate("/login");
      }, 1500);
      
    } catch (err) {
      setApiError("Unable to reach the server. Please verify the backend service is running.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <h1 className="text-2xl font-semibold text-slate-900 mb-1">
          Join as a supporter
        </h1>
        <p className="text-sm text-slate-500 mb-6">
          Volunteer, donate, or help however you can.
        </p>

        {apiError && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-3 py-2.5 text-sm text-red-700 flex items-start gap-2 animate-shake">
            <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
            <span>{apiError}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2.5 text-sm text-emerald-800 flex items-center gap-2 animate-fade-in">
            <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
            <span className="font-medium">{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Full name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            {fieldErrors.fullName && (
              <p className="mt-1 text-xs text-red-600">
                {fieldErrors.fullName}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            {fieldErrors.email && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              value={formData.password}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            {fieldErrors.password && (
              <p className="mt-1 text-xs text-red-600">
                {fieldErrors.password}
              </p>
            )}
          </div>
          <div>
  <label
    htmlFor="aadhaarId"
    className="block text-sm font-medium text-slate-700 mb-1"
  >
    Aadhaar ID
  </label>

  <input
    id="aadhaarId"
    name="aadhaarId"
    type="text"
    inputMode="numeric"
    maxLength={12}
    value={formData.aadhaarId}
    onChange={handleChange}
    placeholder="Enter your 12-digit Aadhaar ID"
    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
  />

  <p className="mt-1 text-xs text-slate-400">
    Your Aadhaar ID will be used for identity verification.
  </p>

  {fieldErrors.aadhaarId && (
    <p className="mt-1 text-xs text-red-600">
      {fieldErrors.aadhaarId}
    </p>
  )}
</div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                City
              </label>
              <input
                id="city"
                name="city"
                type="text"
                value={formData.city}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
            <div>
              <label
                htmlFor="state"
                className="block text-sm font-medium text-slate-700 mb-1"
              >
                State
              </label>
              <input
                id="state"
                name="state"
                type="text"
                value={formData.state}
                onChange={handleChange}
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>
          </div>
          {fieldErrors.location && (
            <p className="-mt-2 text-xs text-red-600">
              {fieldErrors.location}
            </p>
          )}

          <fieldset>
            <legend className="block text-sm font-medium text-slate-700 mb-2">
              How I can help
            </legend>
            <div className="space-y-2">
              {HELP_OPTIONS.map((option) => (
                <label
                  key={option.id}
                  className="flex items-center gap-2 text-sm text-slate-700"
                >
                  <input
                    type="checkbox"
                    checked={formData.helpTypes.includes(option.id)}
                    onChange={() => toggleHelpType(option.id)}
                    className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  {option.label}
                </label>
              ))}
            </div>
            {fieldErrors.helpTypes && (
  <p className="mt-1 text-xs text-red-600">
    {fieldErrors.helpTypes}
  </p>
)}
          </fieldset>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading && (
              <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            )}
            {isLoading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link to="/login" className="text-emerald-700 font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
