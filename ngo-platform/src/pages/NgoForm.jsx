import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import usePageTitle from "../hooks/usePageTitle";

const INITIAL_FORM = {
  orgName: "",
  contactName: "",
  email: "",
  password: "",
  darpanId: "",
  registrationCertificate: null,
  supportingDocument: null,
  confirmation: false,
};

export default function NgoForm() {
  usePageTitle("Register Your NGO");
  const navigate = useNavigate();

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [fieldErrors, setFieldErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

 const handleChange = (e) => {
  const { name, value, type, checked } = e.target;

  setFormData((prev) => ({
    ...prev,
    [name]: type === "checkbox" ? checked : value,
  }));
};
  const handleFileChange = (e) => {
  const { name, files } = e.target;
  const file = files[0];

  if (!file) return;

  const allowedTypes = [
    "application/pdf",
    "image/jpeg",
    "image/png",
  ];

  const maxSize = 5 * 1024 * 1024; // 5 MB

  if (!allowedTypes.includes(file.type)) {
    setFieldErrors((prev) => ({
      ...prev,
      [name]: "Only PDF, JPG, and PNG files are allowed.",
    }));
    return;
  }

  if (file.size > maxSize) {
    setFieldErrors((prev) => ({
      ...prev,
      [name]: "File size must be less than 5 MB.",
    }));
    return;
  }

  setFieldErrors((prev) => {
    const updated = { ...prev };
    delete updated[name];
    return updated;
  });

  setFormData((prev) => ({
    ...prev,
    [name]: file,
  }));
};

  const validate = () => {
  const errors = {};

  if (!formData.orgName.trim()) {
    errors.orgName = "Organization name is required.";
  }

  if (!formData.contactName.trim()) {
    errors.contactName = "Point of contact name is required.";
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

  if (!formData.darpanId.trim()) {
    errors.darpanId = "Government Darpan ID is required.";
  }

  if (!formData.registrationCertificate) {
    errors.registrationCertificate =
      "NGO registration certificate is required.";
  }

  if (!formData.supportingDocument) {
    errors.supportingDocument = "Supporting document is required.";
  }

  if (!formData.confirmation) {
    errors.confirmation =
      "Please confirm that the information provided is accurate.";
  }

  setFieldErrors(errors);
  return Object.keys(errors).length === 0;
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");

    if (!validate()) return;
    setIsLoading(true);

    // Create FormData object to handle text + file uploads
    const submitData = new FormData();
    submitData.append("orgName", formData.orgName);
    submitData.append("contactName", formData.contactName);
    submitData.append("email", formData.email.toLowerCase().trim());
    submitData.append("password", formData.password);
    submitData.append("darpanId", formData.darpanId);
    submitData.append("registrationCertificate", formData.registrationCertificate);
    submitData.append("supportingDocument", formData.supportingDocument);
    // Note: 'confirmation' is usually just frontend validation, but you can send it if needed

    try {
      const res = await fetch("http://localhost:5000/api/auth/register-ngo", {
        method: "POST",
        // Do NOT set "Content-Type" here; the browser automatically sets it 
        // to "multipart/form-data" with the correct boundary when using FormData.
        body: submitData,
      });

      const data = await res.json();

      if (!res.ok) {
        setApiError(data.message || "Failed to register NGO. Please try again.");
        setIsLoading(false);
        return;
      }

      // Route to pending verification on success
      navigate("/ngo-pending-verification");
      
    } catch (err) {
      setApiError("Unable to reach the server. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <h1 className="text-2xl font-semibold text-slate-900 mb-1">
          Register your NGO
        </h1>
        <p className="text-sm text-slate-500 mb-6">
          Certified organizations get access to campaign tools after
          verification.
        </p>

        {apiError && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-3.5 py-2.5 text-sm text-red-700 flex items-start gap-2 animate-shake">
            <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
            <span>{apiError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label
              htmlFor="orgName"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Organization name
            </label>
            <input
              id="orgName"
              name="orgName"
              type="text"
              value={formData.orgName}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            {fieldErrors.orgName && (
              <p className="mt-1 text-xs text-red-600">
                {fieldErrors.orgName}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="contactName"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Point of contact name
            </label>
            <input
              id="contactName"
              name="contactName"
              type="text"
              value={formData.contactName}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
            />
            {fieldErrors.contactName && (
              <p className="mt-1 text-xs text-red-600">
                {fieldErrors.contactName}
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
    htmlFor="darpanId"
    className="block text-sm font-medium text-slate-700 mb-1"
  >
    Government Darpan ID
  </label>

  <input
    id="darpanId"
    name="darpanId"
    type="text"
    value={formData.darpanId}
    onChange={handleChange}
    placeholder="Enter your NGO Darpan ID"
    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
  />

  <p className="mt-1 text-xs text-slate-400">
    Your Darpan ID will be used during NGO verification.
  </p>

  {fieldErrors.darpanId && (
    <p className="mt-1 text-xs text-red-600">
      {fieldErrors.darpanId}
    </p>
  )}
</div>
<div>
  <label
    htmlFor="registrationCertificate"
    className="block text-sm font-medium text-slate-700 mb-1"
  >
    NGO Registration Certificate
  </label>

  <input
    id="registrationCertificate"
    name="registrationCertificate"
    type="file"
    accept=".pdf,.jpg,.jpeg,.png"
    onChange={handleFileChange}
    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
  />

  <p className="mt-1 text-xs text-slate-400">
    Upload PDF, JPG, or PNG. Maximum size: 5 MB.
  </p>

  {fieldErrors.registrationCertificate && (
    <p className="mt-1 text-xs text-red-600">
      {fieldErrors.registrationCertificate}
    </p>
  )}
</div>

<div>
  <label
    htmlFor="supportingDocument"
    className="block text-sm font-medium text-slate-700 mb-1"
  >
    Supporting Document
  </label>

  <input
    id="supportingDocument"
    name="supportingDocument"
    type="file"
    accept=".pdf,.jpg,.jpeg,.png"
    onChange={handleFileChange}
    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
  />

  <p className="mt-1 text-xs text-slate-400">
    Upload PDF, JPG, or PNG. Maximum size: 5 MB.
  </p>

  {fieldErrors.supportingDocument && (
    <p className="mt-1 text-xs text-red-600">
      {fieldErrors.supportingDocument}
    </p>
  )}
</div>
<div className="flex items-start gap-2">
  <input
    id="confirmation"
    name="confirmation"
    type="checkbox"
    checked={formData.confirmation}
    onChange={handleChange}
    className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
  />

  <label
    htmlFor="confirmation"
    className="text-sm text-slate-600"
  >
    I confirm that the information and documents provided are
    accurate and belong to the registered organization.
  </label>
</div>

{fieldErrors.confirmation && (
  <p className="text-xs text-red-600">
    {fieldErrors.confirmation}
  </p>
)}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading && (
              <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            )}
            {isLoading ? "Submitting..." : "Submit for Verification"}
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
