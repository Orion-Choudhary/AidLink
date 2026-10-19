import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import usePageTitle from "../hooks/usePageTitle";

export default function LoginPage() {
  usePageTitle("Sign In");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [fieldErrors, setFieldErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));

  setFieldErrors((prev) => ({
    ...prev,
    [name]: "",
  }));

  setApiError("");
};

  const validate = () => {
  const errors = {};

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!formData.password) {
    errors.password = "Password is required.";
  }

  setFieldErrors(errors);
  return Object.keys(errors).length === 0;
};
const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError("");
    setSuccessMessage("");

    if (!validate()) return;

    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email.toLowerCase().trim(),
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setApiError(data.message || "Something went wrong during login.");
        setIsLoading(false);
        return;
      }

      setSuccessMessage("Login successful!");
      
      // Save the JWT token to local storage so the user stays logged in
      localStorage.setItem("token", data.token);
      localStorage.setItem("userRole", data.user.role);

      // Route them to the correct dashboard based on the database response
      setTimeout(() => {
        if (data.user.role === "NGO") {
          navigate("/ngo-dashboard");
        } else {
          navigate("/dashboard");
        }
      }, 500);

    } catch (err) {
      setApiError("Unable to reach the server. Please check your connection.");
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
        <h1 className="text-2xl font-semibold text-slate-900 mb-1">Log in</h1>
        <p className="text-sm text-slate-500 mb-6">
          Welcome back. Enter your details to continue.
        </p>

        {apiError && (
          <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-3.5 py-2.5 text-sm text-red-700 flex items-start gap-2 animate-shake">
            <AlertCircle size={18} className="text-red-500 shrink-0 mt-0.5" />
            <span>{apiError}</span>
          </div>
        )}
        {successMessage && (
          <div className="mb-4 rounded-lg bg-emerald-50 border border-emerald-200 px-3.5 py-2.5 text-sm text-emerald-800 flex items-center gap-2 animate-fade-in">
            <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
            <span className="font-medium">{successMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
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
              autoComplete="current-password"
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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading && (
              <span className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            )}
            {isLoading ? "Logging in..." : "Log in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          New here?{" "}
          <Link
            to="/register/individual"
            className="text-emerald-700 font-medium hover:underline"
          >
            Register as a supporter
          </Link>{" "}
          or{" "}
          <Link
            to="/register/ngo"
            className="text-emerald-700 font-medium hover:underline"
          >
            as an NGO
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
