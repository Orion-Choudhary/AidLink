import { Link } from "react-router-dom";
import usePageTitle from "../hooks/usePageTitle";

export default function NgoPendingVerification() {
  usePageTitle("Verification Pending");
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">

        {/* Status Icon */}
        <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-amber-100 flex items-center justify-center">
          <span className="text-amber-600 text-3xl">⏳</span>
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-semibold text-slate-900 mb-2">
          Application Submitted
        </h1>

        <p className="text-sm text-slate-600 mb-6">
          Your NGO registration application has been successfully submitted
          for verification.
        </p>

        {/* Status Box */}
        <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-4 mb-6">
          <p className="text-sm font-medium text-amber-800">
            Verification Status
          </p>

          <p className="mt-1 text-lg font-semibold text-amber-700">
            Pending
          </p>
        </div>

        {/* Explanation */}
        <p className="text-sm text-slate-600 mb-6">
          Our administrators will review your Government Darpan ID and
          submitted documents. You will be able to access your NGO dashboard
          once your organization has been approved.
        </p>

        {/* Important Notice */}
        <div className="rounded-lg bg-slate-50 border border-slate-200 px-4 py-3 mb-6 text-left">
          <p className="text-xs text-slate-500">
            <span className="font-semibold text-slate-700">
              What happens next?
            </span>
            <br />
            Your application will be reviewed by an administrator. Once your
            NGO is approved, you can log in and access campaign management
            tools.
          </p>
        </div>

        <Link
          to="/login"
          className="inline-block w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 transition-colors"
        >
          Return to Login
        </Link>
      </div>
    </div>
  );
}