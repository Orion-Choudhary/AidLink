import { useState, useEffect } from "react";
import usePageTitle from "../hooks/usePageTitle";

export default function AdminDashboard() {
  usePageTitle("Platform Administration");
  const [pendingNgos, setPendingNgos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPendingNgos = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/admin/ngos/pending");
      if (!res.ok) throw new Error("Failed to fetch pending NGOs");
      const data = await res.json();
      setPendingNgos(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingNgos();
  }, []);

  const handleStatusUpdate = async (ngoId, newStatus) => {
    try {
      const res = await fetch("http://localhost:5000/api/auth/admin/ngo-status", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ngoId, status: newStatus }),
      });
      
      if (!res.ok) throw new Error("Failed to update status");
      
      setPendingNgos((prev) => prev.filter((ngo) => ngo.id !== ngoId));
    } catch (err) {
      alert(err.message);
    }
  };

  if (isLoading) return <div className="p-10 text-center">Loading pending approvals...</div>;
  if (error) return <div className="p-10 text-center text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-6">Admin Dashboard</h1>
        <h2 className="text-xl font-semibold text-slate-700 mb-4">Pending NGO Verifications</h2>

        {pendingNgos.length === 0 ? (
          <p className="text-slate-500 bg-white p-6 rounded-xl border border-slate-200">No NGOs are currently awaiting verification.</p>
        ) : (
          <div className="grid gap-6">
            {pendingNgos.map((ngo) => (
              <div key={ngo.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-900">{ngo.org_name}</h3>
                  <p className="text-sm text-slate-600">Contact: {ngo.contact_name} | {ngo.email}</p>
                  <p className="text-sm text-slate-600 font-mono">Darpan ID: {ngo.darpan_id}</p>
                  
                  <div className="flex gap-4 pt-2">
                    <a 
                      href={`http://localhost:5000/${ngo.registration_cert_path}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      📄 View Certificate
                    </a>
                    <a 
                      href={`http://localhost:5000/${ngo.supporting_doc_path}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      📄 View Supporting Doc
                    </a>
                  </div>
                </div>

                <div className="flex gap-3 w-full md:w-auto">
                  <button 
                    onClick={() => handleStatusUpdate(ngo.id, 'APPROVED')}
                    className="flex-1 md:flex-none px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition"
                  >
                    Approve
                  </button>
                  <button 
                    onClick={() => handleStatusUpdate(ngo.id, 'REJECTED')}
                    className="flex-1 md:flex-none px-4 py-2 bg-red-100 text-red-700 text-sm font-medium rounded-lg hover:bg-red-200 transition"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}