import React, { useState, useEffect, useRef } from "react";
import {
  ShieldCheck,
  Bell,
  MapPin,
  ArrowRight,
  CheckCircle2,
  FileCheck,
  ImagePlus,
  MessageCircle,
  HeartHandshake,
  Compass,
  GraduationCap,
  ClipboardList,
  ListChecks,
  Sparkles,
  Calendar,
  Clock,
  TrendingUp,
  Search,
  Filter,
  User,
  Settings as SettingsIcon,
  Check,
  ChevronRight,
  X,
  Share2,
  Award,
  Upload,
  FileText
} from "lucide-react";
import SupporterSidebar from "../../components/Dashboard/SupporterSidebar";
import "./NGODashboard.css";
import "./SupporterDashboard.css";
import SupporterDashboardSkeleton from "./skeletons/SupporterDashboardSkeleton";

const API_BASE = "http://localhost:5000/api";

const IndianRupee = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M6 3h12" />
    <path d="M6 8h12" />
    <path d="m6 13 8.5 8" />
    <path d="M6 13h3" />
    <path d="M9 13c6.667 0 6.667-10 0-10" />
  </svg>
);

export default function SupporterDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Supporter Profile State — REAL DATA ONLY (No mock defaults)
  const [supporter, setSupporter] = useState({
    id: null,
    name: "",
    email: "",
    city: "",
    state: "",
    helpTypes: [],
    resumePath: null,
    verifiedOn: "",
    status: "Active"
  });

  // Real Aggregated Metrics (No fake stats)
  const [stats, setStats] = useState({
    campaigns: 0,
    activities: 0,
    volunteerHours: 0,
    totalDonations: 0,
    totalDonatedAmount: 0
  });

  const [upcomingActivities, setUpcomingActivities] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [localCampaigns, setLocalCampaigns] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [workshopsList, setWorkshopsList] = useState([]);
  const [volunteeringList, setVolunteeringList] = useState([]);
  const [donationsList, setDonationsList] = useState([]);
  const [ngosList, setNgosList] = useState([]);
  const [selectedNgo, setSelectedNgo] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Modals state
  const [activeModal, setActiveModal] = useState(null); // 'volunteer' | 'donate' | 'log-hours' | 'workshop-info'
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [selectedVolunteerRecord, setSelectedVolunteerRecord] = useState(null);

  // Form states for modals
  const [volunteerForm, setVolunteerForm] = useState({ 
    role: "On-ground Volunteer", 
    skills: "Emergency Aid, Logistics" 
  });
  const [volunteerDocFile, setVolunteerDocFile] = useState(null);
  const [profileDocFile, setProfileDocFile] = useState(null);
  const [isUploadingProfileDoc, setIsUploadingProfileDoc] = useState(false);

  const [donationForm, setDonationForm] = useState({ amount: "1000", purpose: "Medical & Food Aid", method: "UPI" });

  const fileInputRef = useRef(null);
  const profileFileInputRef = useRef(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3200);
  };

  const getAuthToken = () => localStorage.getItem("token") || "";

  // 1. Fetch Supporter Profile & Dashboard Summary from Real Database
  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const token = getAuthToken();
      if (!token) return;

      const res = await fetch(`${API_BASE}/supporters/dashboard`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (res.ok) {
        const data = await res.json();
        if (data.supporter) setSupporter(data.supporter);
        if (data.stats) setStats(data.stats);
        if (Array.isArray(data.upcomingActivities)) setUpcomingActivities(data.upcomingActivities);
        if (Array.isArray(data.localCampaigns)) setLocalCampaigns(data.localCampaigns);
        if (Array.isArray(data.recentActivities)) {
          setRecentActivities(data.recentActivities);
        } else if (Array.isArray(data.localCampaigns)) {
          setRecentActivities(data.localCampaigns);
        }
        if (Array.isArray(data.recentActivity)) {
          setRecentActivity(
            data.recentActivity.map((a) => ({
              ...a,
              icon: a.type === "donation" ? HeartHandshake : CheckCircle2
            }))
          );
        }
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  };

  // 2. Fetch Discover Campaigns
  const loadCampaigns = async () => {
    try {
      const token = getAuthToken();
      const res = await fetch(`${API_BASE}/supporters/campaigns`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCampaigns(data);
      }
    } catch (err) {
      console.error("Error fetching discover campaigns:", err);
    }
  };

  // 3. Fetch Registered NGOs (for direct donations)
  const loadNgos = async () => {
    try {
      const token = getAuthToken();
      const res = await fetch(`${API_BASE}/supporters/ngos`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setNgosList(data);
      }
    } catch (err) {
      console.error("Error fetching registered NGOs:", err);
    }
  };

  // 4. Fetch Volunteer Applications & Commitments
  const loadVolunteering = async () => {
    try {
      const token = getAuthToken();
      const res = await fetch(`${API_BASE}/supporters/volunteering`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setVolunteeringList(data);
      }
    } catch (err) {
      console.error("Error fetching volunteering list:", err);
    }
  };

  // 5. Fetch Donations
  const loadDonations = async () => {
    try {
      const token = getAuthToken();
      const res = await fetch(`${API_BASE}/supporters/donations`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setDonationsList(data);
      }
    } catch (err) {
      console.error("Error fetching donations:", err);
    }
  };

  // 6. Fetch Open Community Workshops
  const loadWorkshops = async () => {
    try {
      const token = getAuthToken();
      const res = await fetch(`http://localhost:5000/api/workshops`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setWorkshopsList(data);
      }
    } catch (err) {
      console.error("Error fetching workshops:", err);
    }
  };

  useEffect(() => {
    loadDashboardData();
    loadCampaigns();
    loadWorkshops();
    loadNgos();
    loadVolunteering();
    loadDonations();
  }, []);

  // Handle Volunteer Application Submit (Enforcing Supporting Document Upload)
  const handleVolunteerSubmit = async (e) => {
    e.preventDefault();

    if (!volunteerDocFile && !supporter.resumePath) {
      showToast("Please upload a CV or supporting document to apply.");
      return;
    }

    try {
      const token = getAuthToken();
      const formData = new FormData();
      formData.append("campaignId", selectedCampaign?.id || "");
      formData.append("role", volunteerForm.role);
      formData.append("skills", volunteerForm.skills);
      if (volunteerDocFile) {
        formData.append("document", volunteerDocFile);
      }

      const res = await fetch(`${API_BASE}/supporters/volunteer`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();

      if (res.ok) {
        showToast("Application & document submitted for NGO review!");
        setActiveModal(null);
        setVolunteerDocFile(null);
        loadDashboardData();
        loadVolunteering();
      } else {
        showToast(data.error || "Error submitting application.");
      }
    } catch (err) {
      showToast("Unable to reach server. Please try again.");
    }
  };

  // Handle Profile Document Upload (CV / Resume in Profile Section)
  const handleProfileDocUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingProfileDoc(true);
    try {
      const token = getAuthToken();
      const formData = new FormData();
      formData.append("document", file);

      const res = await fetch(`${API_BASE}/supporters/profile/document`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();
      if (res.ok) {
        showToast("CV / Supporting document updated successfully!");
        setSupporter((prev) => ({ ...prev, resumePath: data.resumePath }));
      } else {
        showToast(data.error || "Failed to upload document.");
      }
    } catch (err) {
      showToast("Upload failed.");
    } finally {
      setIsUploadingProfileDoc(false);
    }
  };

  // Handle Donation Submit
  const handleDonationSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCampaign && !selectedNgo) {
      showToast("Please select a registered NGO or campaign to donate to.");
      return;
    }

    try {
      const token = getAuthToken();
      let campId = null;
      if (selectedCampaign) {
        if (selectedCampaign.rawId) {
          campId = selectedCampaign.rawId;
        } else if (selectedCampaign.id) {
          const digits = String(selectedCampaign.id).replace(/\D/g, '');
          if (digits) campId = parseInt(digits, 10);
        }
      }

      let ngoId = null;
      if (selectedCampaign?.ngo_id || selectedCampaign?.ngoId) {
        ngoId = selectedCampaign.ngo_id || selectedCampaign.ngoId;
      } else if (selectedNgo?.id) {
        ngoId = selectedNgo.id;
      }

      const res = await fetch(`${API_BASE}/supporters/donate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          campaignId: campId,
          ngoId: ngoId,
          amount: parseFloat(donationForm.amount) || 500,
          purpose: donationForm.purpose,
          method: donationForm.method
        })
      });

      if (res.ok) {
        const recipientName = selectedCampaign ? selectedCampaign.name : (selectedNgo?.org_name || "the NGO");
        showToast(`Thank you! ₹${donationForm.amount} donation recorded for ${recipientName}.`);
        setActiveModal(null);
        loadDashboardData();
        loadDonations();
      } else {
        showToast("Error processing donation.");
      }
    } catch (err) {
      showToast("Unable to reach server.");
    }
  };



  // Filtered campaigns for discovery
  const filteredCampaigns = campaigns.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      (c.name && c.name.toLowerCase().includes(q)) ||
      (c.disaster && c.disaster.toLowerCase().includes(q)) ||
      (c.region && c.region.toLowerCase().includes(q)) ||
      (c.org_name && c.org_name.toLowerCase().includes(q))
    );
  });

  return (
    <div id="appshell" className="supporter-dashboard-root min-h-screen">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-emerald-800 text-white px-5 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-fade-in">
          <Check size={18} className="text-emerald-300" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <SupporterSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        supporterName={supporter.name}
      />

      {/* Main Content Area */}
      <div id="main">
        {/* Top Navbar / Header matching NGO Topbar */}
        <header id="topbar">
          <div className="search-box">
            <Search size={15} />
            <input
              type="text"
              placeholder="Search campaigns, workshops, commitments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="topbar-right">
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setActiveTab("discover")}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
            >
              <Compass size={14} /> Discover
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setActiveTab("donations")}
            >
              <HeartHandshake size={14} /> Donate
            </button>
            <button
              className="icon-btn"
              aria-label="Notifications"
              onClick={() => setActiveTab("notifications")}
            >
              <Bell size={18} />
              {recentActivity.length > 0 && <span className="dot-badge"></span>}
            </button>
            <div
              className="topbar-org"
              style={{ cursor: 'pointer' }}
              onClick={() => setActiveTab("profile")}
            >
              <div className="org-avatar">
                {supporter.name ? supporter.name.charAt(0).toUpperCase() : "S"}
              </div>
              <div className="org-meta">
                <div className="n">{supporter.name || "Supporter"}</div>
                <div className="v">
                  <Check size={12} /> Active Supporter
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Views */}
        <div id="content" className="w-full">
          {isLoading ? (
            <SupporterDashboardSkeleton />
          ) : (
            <>
              {/* 1. OVERVIEW TAB */}
              {activeTab === "overview" && (
            <>
              {/* Header Greeting with Real Supporter Name */}
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="font-display text-3xl md:text-4xl text-ink font-semibold tracking-tight">
                    Welcome, {supporter.name || "Supporter"}
                  </h1>
                  <p className="text-ink-soft text-sm mt-1">
                    Here's where things stand with your volunteering and contributions.
                  </p>
                </div>
              </div>

              {/* Verification & Status Badges */}
              <div className="flex flex-wrap items-center gap-3 mb-8">
                <span className="inline-flex items-center gap-2 rounded-md bg-verified-soft text-verified px-3 py-1.5 text-sm font-medium">
                  <ShieldCheck size={16} strokeWidth={2} />
                  Identity verified
                  {supporter.verifiedOn && (
                    <span className="text-verified/60 font-normal">· {supporter.verifiedOn}</span>
                  )}
                </span>
                {(supporter.city || supporter.state) && (
                  <span className="inline-flex items-center gap-2 rounded-md border border-hairline px-3 py-1.5 text-sm text-ink-soft">
                    <MapPin size={14} />
                    {[supporter.city, supporter.state].filter(Boolean).join(", ")}
                  </span>
                )}
                <span className="inline-flex items-center gap-2 rounded-md border border-emerald-200 bg-emerald-50 text-emerald-800 px-3 py-1.5 text-sm font-medium">
                  {supporter.status || "Active"} Supporter
                </span>
                {supporter.resumePath && (
                  <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-300 bg-emerald-100 text-emerald-900 px-3 py-1.5 text-xs font-semibold">
                    <FileText size={13} />
                    CV / Resume Uploaded
                  </span>
                )}
              </div>

              {/* Stat Ledger Strip (REAL DATA) */}
              <div className="flex flex-col sm:flex-row border-y border-hairline mb-10 divide-y sm:divide-y-0 sm:divide-x divide-hairline">
                <div className="flex-1 px-6 py-5">
                  <div className="font-display text-3xl md:text-4xl text-ink font-semibold">
                    {stats.campaigns}
                  </div>
                  <div className="text-sm text-ink-soft mt-1">Available Campaigns</div>
                </div>
                <div className="flex-1 px-6 py-5">
                  <div className="font-display text-3xl md:text-4xl text-ink font-semibold">
                    {stats.activities}
                  </div>
                  <div className="text-sm text-ink-soft mt-1">Volunteer Applications</div>
                </div>
                <div className="flex-1 px-6 py-5">
                  <div className="font-display text-3xl md:text-4xl text-emerald-700 font-semibold">
                    ₹{stats.totalDonatedAmount ? stats.totalDonatedAmount.toLocaleString("en-IN") : "0"}
                  </div>
                  <div className="text-sm text-ink-soft mt-1">Total Donated</div>
                </div>
              </div>

              {/* Grid: Upcoming Activities + Recent Timeline */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
                {/* Upcoming Activities */}
                <section className="lg:col-span-3">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-display text-xl text-ink font-semibold">
                      Your Volunteer Commitments
                    </h2>
                    {upcomingActivities.length > 0 && (
                      <button
                        onClick={() => setActiveTab("applications")}
                        className="text-xs font-semibold text-verified hover:underline"
                      >
                        View all
                      </button>
                    )}
                  </div>

                  {upcomingActivities.length === 0 ? (
                    <div className="p-8 text-center border border-dashed border-hairline rounded-xl bg-white/40">
                      <p className="text-ink font-medium text-sm">No volunteer commitments yet</p>
                      <p className="text-xs text-ink-soft mt-1">
                        Browse active disaster relief campaigns and apply to participate on ground.
                      </p>
                      <button
                        onClick={() => setActiveTab("discover")}
                        className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 text-white"
                      >
                        <Compass size={13} /> Discover Campaigns
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {upcomingActivities.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex gap-4 border-l-3 border-verified pl-4 py-2 bg-white/40 rounded-r-md border-y border-r border-hairline/60"
                        >
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="text-ink font-medium text-sm md:text-base">
                                {activity.title}
                              </p>
                              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${
                                activity.status === 'active' || activity.status === 'ACCEPTED'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : activity.status === 'rejected'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}>
                                {activity.status === 'active' ? 'Approved' : activity.status === 'rejected' ? 'Declined' : 'Pending Review'}
                              </span>
                            </div>
                            <p className="text-xs md:text-sm text-ink-soft mt-0.5">
                              {activity.campaign}
                            </p>
                            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-ink-soft">
                              <span className="inline-flex items-center gap-1 font-medium text-ink">
                                <Calendar size={13} strokeWidth={1.75} />
                                {activity.date}
                              </span>
                              <span className="inline-flex items-center gap-1">
                                <MapPin size={13} strokeWidth={1.75} />
                                {activity.location}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>

                {/* Recent Activity (Unified Feed: Urgent Campaigns first, then Regular Campaigns & Workshops) */}
                <section className="lg:col-span-2">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-display text-xl text-ink font-semibold">
                      Recent Activity
                    </h2>
                    {recentActivities.length > 0 && (
                      <button
                        onClick={() => setActiveTab("discover")}
                        className="text-xs font-semibold text-verified hover:underline"
                      >
                        Explore all
                      </button>
                    )}
                  </div>

                  {recentActivities.length === 0 ? (
                    <div className="p-8 text-center border border-dashed border-hairline rounded-xl bg-white/40 text-xs text-ink-soft">
                      No active relief campaigns or workshops reported right now.
                    </div>
                  ) : (
                    <div className="divide-y divide-hairline border border-hairline rounded-xl bg-white/70 overflow-hidden shadow-xs">
                      {recentActivities.map((item) => {
                        const isWorkshop = item.type === "workshop";
                        const isUrgent = Boolean(item.isUrgent || item.is_urgent);

                        return (
                          <div
                            key={`${item.type || 'campaign'}-${item.id}`}
                            onClick={() => {
                              if (isWorkshop) {
                                setSelectedWorkshop(item);
                                setActiveModal("workshop-info");
                              } else {
                                setSelectedCampaign(item);
                                setActiveModal("campaign-info");
                              }
                            }}
                            className={`px-4 py-2.5 flex items-center justify-between gap-3 cursor-pointer transition-colors group ${
                              isUrgent 
                                ? 'bg-red-50/50 hover:bg-red-100/60' 
                                : isWorkshop 
                                ? 'hover:bg-purple-50/50' 
                                : 'hover:bg-emerald-50/50'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0 flex-1">
                              {/* Type / Status Badge */}
                              {isUrgent ? (
                                <span className="shrink-0 text-[10.5px] font-bold px-2 py-0.5 rounded bg-red-600 text-white animate-pulse">
                                  ⚡ URGENT
                                </span>
                              ) : isWorkshop ? (
                                <span className="shrink-0 text-[10.5px] font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                                  🎓 Workshop
                                </span>
                              ) : (
                                <span className="shrink-0 text-[10.5px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                                  🚨 {item.disaster || "Relief"}
                                </span>
                              )}

                              {/* Title & Location / NGO Metadata */}
                              <div className="min-w-0 flex-1 flex flex-col sm:flex-row sm:items-center sm:gap-3">
                                <span className="text-sm font-semibold text-ink group-hover:text-emerald-900 transition-colors truncate">
                                  {item.title || item.name}
                                </span>
                                <div className="flex items-center gap-1.5 text-xs text-ink-soft shrink-0">
                                  <MapPin size={11} className="text-ink-soft shrink-0" />
                                  <span>{item.city || item.region || item.location || "On-ground"}</span>
                                  {(item.orgName || item.org_name) && (
                                    <span className="hidden md:inline text-ink-soft/70">· {item.orgName || item.org_name}</span>
                                  )}
                                  {item.date && (
                                    <span className="hidden sm:inline text-ink-soft/70">· {item.date}</span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Click Hint / Chevron */}
                            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-700 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0">
                              <span className="hidden sm:inline">Details</span>
                              <ChevronRight size={15} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>
              </div>

              {/* Impact Summary Banner (REAL DATA ONLY) */}
              <section className="mt-10 border border-hairline rounded-xl p-6 bg-white/50 shadow-xs">
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles size={20} className="text-emerald-700" />
                  <h2 className="font-display text-xl text-ink font-semibold">My impact summary</h2>
                </div>
                {stats.activities === 0 && stats.totalDonations === 0 ? (
                  <p className="text-ink text-sm">
                    You have not participated in any campaigns yet. Apply for open campaigns or make a contribution to start making a tangible difference!
                  </p>
                ) : (
                  <p className="text-ink leading-relaxed text-sm md:text-base">
                    You have participated in <span className="font-semibold text-emerald-800">{stats.activities} relief initiatives</span> and contributed{" "}
                    <span className="font-semibold text-emerald-800">₹{stats.totalDonatedAmount.toLocaleString("en-IN")}</span> to disaster response operations.
                  </p>
                )}
              </section>

              {/* Quick Actions & Explore Campaigns Banner */}
              <section className="mt-8 mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 rounded-xl bg-verified text-paper px-6 py-6 shadow-sm">
                <div>
                  <p className="font-display text-xl font-medium">Ready for what's next?</p>
                  <p className="text-paper/85 text-sm mt-1">
                    Browse open emergency campaigns needing volunteers and relief supplies right now.
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => {
                      setSelectedCampaign(null);
                      setSelectedNgo(ngosList.length > 0 ? ngosList[0] : null);
                      setActiveModal("donate");
                    }}
                    className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 text-white px-4 py-2 text-sm font-semibold hover:bg-emerald-700 shadow-xs transition-colors"
                  >
                    <HeartHandshake size={16} />
                    Quick Donate
                  </button>
                  <button
                    onClick={() => setActiveTab("discover")}
                    className="inline-flex items-center gap-2 rounded-lg bg-paper text-verified px-4 py-2 text-sm font-semibold hover:bg-white transition-colors"
                  >
                    Explore campaigns
                    <ArrowRight size={16} strokeWidth={2} />
                  </button>
                </div>
              </section>
            </>
          )}

          {/* 2. DISCOVER CAMPAIGNS TAB */}
          {activeTab === "discover" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-display text-3xl font-bold text-ink">Discover Campaigns</h1>
                  <p className="text-sm text-ink-soft mt-1">
                    Find emergency response and disaster relief initiatives where your support is needed.
                  </p>
                </div>
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-3 text-ink-soft" />
                  <input
                    type="text"
                    placeholder="Search by disaster, region, NGO..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 text-sm border border-hairline rounded-lg w-full sm:w-72 bg-white focus:outline-emerald-600"
                  />
                </div>
              </div>

              {filteredCampaigns.length === 0 ? (
                <div className="p-12 text-center border border-dashed border-hairline rounded-xl bg-white/40">
                  <Compass size={32} className="mx-auto text-ink-soft mb-2 opacity-50" />
                  <p className="text-ink font-medium">No campaigns found</p>
                  <p className="text-sm text-ink-soft mt-1">Active relief campaigns published by NGOs will appear here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredCampaigns.map((camp) => (
                    <div
                      key={camp.id}
                      className="bg-white border border-hairline rounded-xl overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                    >
                      <div>
                        {camp.cover_image_path ? (
                          <img
                            src={`http://localhost:5000/${camp.cover_image_path}`}
                            alt={camp.name}
                            className="w-full h-44 object-cover"
                          />
                        ) : (
                          <div className="w-full h-32 bg-emerald-800/10 flex items-center justify-center text-emerald-800 font-semibold">
                            {camp.disaster || "Disaster Relief"}
                          </div>
                        )}

                        <div className="p-5">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                              {camp.disaster}
                            </span>
                            <span className="text-xs text-ink-soft flex items-center gap-1">
                              <MapPin size={13} />
                              {camp.region}
                            </span>
                          </div>

                          <h3 className="font-display text-lg font-semibold text-ink mb-1">
                            {camp.name}
                          </h3>
                          <p className="text-xs text-emerald-800 font-medium mb-2">
                            By {camp.org_name || "Verified NGO Partner"}
                          </p>
                          <p className="text-sm text-ink-soft line-clamp-2 mb-4">
                            {camp.objective || "Providing urgent relief kits, medical supplies, and shelter assistance."}
                          </p>

                          <div className="space-y-1.5">
                            <div className="flex justify-between text-xs font-medium text-ink-soft">
                              <span>Target: {camp.target_households || 100} households</span>
                              <span>{camp.progress || 0}% Complete</span>
                            </div>
                            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                              <div
                                className="bg-emerald-600 h-2 rounded-full"
                                style={{ width: `${Math.min(camp.progress || 10, 100)}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-5 pt-0 border-t border-hairline/60 flex items-center gap-3">
                        <button
                          onClick={() => {
                            setSelectedCampaign(camp);
                            setVolunteerDocFile(null);
                            setActiveModal("volunteer");
                          }}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 text-xs md:text-sm font-semibold rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 transition-colors"
                        >
                          <User size={15} />
                          Apply as Volunteer
                        </button>
                        <button
                          onClick={() => {
                            setSelectedCampaign(camp);
                            setSelectedNgo(null);
                            setActiveModal("donate");
                          }}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 text-xs md:text-sm font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-xs"
                        >
                          <HeartHandshake size={15} />
                          Donate
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* WORKSHOPS TAB */}
          {activeTab === "workshops" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-display text-3xl font-bold text-ink">Community Workshops</h1>
                  <p className="text-sm text-ink-soft mt-1">
                    Participate in emergency training, first aid certification, and crisis preparedness workshops organized by NGOs.
                  </p>
                </div>
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-3 text-ink-soft" />
                  <input
                    type="text"
                    placeholder="Search workshops by title, city, NGO..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 pr-4 py-2 text-sm border border-hairline rounded-lg w-full sm:w-72 bg-white focus:outline-emerald-600"
                  />
                </div>
              </div>

              {workshopsList.filter(w => {
                const q = searchQuery.toLowerCase();
                return (
                  (w.title && w.title.toLowerCase().includes(q)) ||
                  (w.city && w.city.toLowerCase().includes(q)) ||
                  (w.location && w.location.toLowerCase().includes(q)) ||
                  (w.org_name && w.org_name.toLowerCase().includes(q))
                );
              }).length === 0 ? (
                <div className="p-12 text-center border border-dashed border-hairline rounded-xl bg-white/40">
                  <GraduationCap size={32} className="mx-auto text-ink-soft mb-2 opacity-50" />
                  <p className="text-ink font-medium">No workshops found</p>
                  <p className="text-sm text-ink-soft mt-1">Upcoming community workshops organized by NGOs will appear here.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {workshopsList.filter(w => {
                    const q = searchQuery.toLowerCase();
                    return (
                      (w.title && w.title.toLowerCase().includes(q)) ||
                      (w.city && w.city.toLowerCase().includes(q)) ||
                      (w.location && w.location.toLowerCase().includes(q)) ||
                      (w.org_name && w.org_name.toLowerCase().includes(q))
                    );
                  }).map((ws) => (
                    <div
                      key={ws.id}
                      className="bg-white border border-hairline rounded-xl p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                            🎓 Open Workshop
                          </span>
                          <span className="text-xs text-ink-soft flex items-center gap-1 font-medium">
                            <MapPin size={13} className="text-purple-600" />
                            {ws.city || "Patiala"}
                          </span>
                        </div>

                        <h3 className="font-display text-lg font-semibold text-ink mb-1">
                          {ws.title}
                        </h3>
                        <p className="text-xs text-purple-800 font-semibold mb-2">
                          Organized by {ws.org_name || "Verified NGO Partner"}
                        </p>
                        <p className="text-sm text-ink-soft line-clamp-3 mb-4">
                          {ws.description || "Hands-on disaster preparedness, evacuation, and crisis response training."}
                        </p>

                        <div className="p-3 bg-gray-50 rounded-lg border border-hairline/60 mb-4 text-xs space-y-1">
                          <div className="flex items-center justify-between text-ink">
                            <span className="text-ink-soft">📅 Date & Time:</span>
                            <span className="font-semibold">{ws.date || "Upcoming"} ({ws.time || "Scheduled"})</span>
                          </div>
                          <div className="flex items-center justify-between text-ink">
                            <span className="text-ink-soft">📍 Venue:</span>
                            <span className="font-semibold truncate max-w-[200px]">{ws.location || "Venue details upon registration"}</span>
                          </div>
                          <div className="flex items-center justify-between text-ink">
                            <span className="text-ink-soft">👥 Target Capacity:</span>
                            <span className="font-semibold">{ws.target_capacity || 50} seats</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t border-hairline/60 flex items-center gap-3">
                        <button
                          onClick={() => {
                            setSelectedWorkshop(ws);
                            setActiveModal("workshop-info");
                          }}
                          className="flex-1 py-2 text-xs md:text-sm font-semibold rounded-lg bg-purple-50 text-purple-800 border border-purple-200 hover:bg-purple-100 transition-colors text-center"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => {
                            if (ws.form_url && ws.form_url.trim().startsWith("http")) {
                              window.open(ws.form_url.trim(), "_blank");
                            } else {
                              alert("No form attached for now.");
                            }
                          }}
                          className="flex-1 py-2 text-xs md:text-sm font-semibold rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors text-center shadow-xs"
                        >
                          Register
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. APPLICATIONS TAB */}
          {activeTab === "applications" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="font-display text-3xl font-bold text-ink">Volunteer Applications</h1>
                  <p className="text-sm text-ink-soft mt-1">
                    Track your volunteer applications and verification status with NGOs.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab("discover")}
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 text-white px-4 py-2 text-sm font-medium hover:bg-emerald-700"
                >
                  <Compass size={16} />
                  Apply for more
                </button>
              </div>

              {volunteeringList.length === 0 ? (
                <div className="p-12 text-center border border-dashed border-hairline rounded-xl bg-white/40">
                  <ClipboardList size={32} className="mx-auto text-ink-soft mb-2 opacity-50" />
                  <p className="text-ink font-medium">No volunteer applications submitted yet</p>
                  <p className="text-sm text-ink-soft mt-1">Browse active campaigns to apply as a volunteer.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {volunteeringList.map((vol) => (
                    <div
                      key={vol.id}
                      className="p-5 bg-white border border-hairline rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-display text-base font-semibold text-ink">
                            {vol.role || "Volunteer"}
                          </h3>
                          <span
                            className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                              vol.status === "active" || vol.status === "ACCEPTED"
                                ? "bg-emerald-100 text-emerald-800"
                                : vol.status === "rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {vol.status === "active" ? "Approved" : vol.status === "rejected" ? "Declined" : "Pending Review"}
                          </span>
                        </div>
                        <p className="text-sm text-ink-soft">
                          Campaign: <span className="font-medium text-ink">{vol.campaign_name || "Relief Mission"}</span> ({vol.region || "On-ground"})
                        </p>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-ink-soft pt-1">
                          <span>Applied on {vol.applied_on ? new Date(vol.applied_on).toLocaleDateString() : "Recently"}</span>
                          {vol.document_path && (
                            <a
                              href={`http://localhost:5000/${vol.document_path}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-emerald-700 hover:underline flex items-center gap-1 font-medium"
                            >
                              <FileText size={12} /> View Uploaded Supporting Document
                            </a>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                          vol.status === 'active' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : vol.status === 'rejected' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {vol.status === 'active' ? 'Approved & Assigned' : vol.status === 'rejected' ? 'Declined' : 'Pending Review'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 4. COMMITMENTS TAB */}
          {activeTab === "commitments" && (
            <div className="space-y-6">
              <div>
                <h1 className="font-display text-3xl font-bold text-ink">Active Commitments</h1>
                <p className="text-sm text-ink-soft mt-1">
                  Approved volunteer tasks and scheduled operations assigned to you.
                </p>
              </div>

              {volunteeringList.filter(v => v.status === 'active').length === 0 ? (
                <div className="p-12 text-center border border-dashed border-hairline rounded-xl bg-white/40">
                  <p className="text-ink font-medium">No approved commitments yet</p>
                  <p className="text-sm text-ink-soft mt-1">
                    Once an NGO approves your volunteer application, your scheduled mission will appear here.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {volunteeringList.filter(v => v.status === 'active').map((act) => (
                    <div
                      key={act.id}
                      className="p-6 bg-white border border-hairline rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                          <h3 className="font-display text-lg font-semibold text-ink">{act.role || "Volunteer Mission"}</h3>
                        </div>
                        <p className="text-sm text-ink-soft">
                          Campaign: <span className="font-medium text-ink">{act.campaign_name}</span> ({act.region || "On-ground"})
                        </p>
                        <p className="text-xs text-ink-faint mt-1">
                          Organized by {act.org_name || "Verified NGO Partner"}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-300">
                          Active Duty
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 5. DONATIONS TAB */}
          {activeTab === "donations" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="font-display text-3xl font-bold text-ink">Donations & Contributions</h1>
                  <p className="text-sm text-ink-soft mt-1">
                    Your financial contributions directly supporting relief supplies and rescue operations.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedCampaign(null);
                    setSelectedNgo(ngosList.length > 0 ? ngosList[0] : null);
                    setActiveModal("donate");
                  }}
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 text-white px-4 py-2 text-sm font-medium hover:bg-emerald-700 shadow-xs"
                >
                  <HeartHandshake size={16} />
                  Make a donation
                </button>
              </div>

              {/* Total Donated Card (REAL DATA) */}
              <div className="bg-emerald-900 text-white rounded-xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <p className="text-emerald-200 text-xs font-semibold tracking-wider uppercase">
                    Total Cumulative Donations
                  </p>
                  <p className="font-display text-3xl md:text-4xl font-bold mt-1">
                    ₹{stats.totalDonatedAmount ? stats.totalDonatedAmount.toLocaleString("en-IN") : "0"}
                  </p>
                  <p className="text-emerald-200 text-xs mt-1">
                    100% routed through 80G tax-exempt verified relief funds.
                  </p>
                </div>
                <div className="bg-white/10 px-4 py-3 rounded-lg border border-white/20 text-center">
                  <p className="text-2xl font-bold">{donationsList.length}</p>
                  <p className="text-xs text-emerald-200">Donations Made</p>
                </div>
              </div>

              {/* Donation History Table */}
              <div className="bg-white border border-hairline rounded-xl overflow-hidden shadow-xs">
                <div className="px-6 py-4 border-b border-hairline font-display text-base font-semibold text-ink">
                  Donation History
                </div>
                {donationsList.length === 0 ? (
                  <div className="p-8 text-center text-ink-soft text-sm">
                    No donation records found yet. Click "Make a donation" to contribute!
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-gray-50 border-b border-hairline text-xs font-semibold text-ink-soft">
                        <tr>
                          <th className="px-6 py-3">Cause / Recipient</th>
                          <th className="px-6 py-3">Type</th>
                          <th className="px-6 py-3">Amount</th>
                          <th className="px-6 py-3">Method</th>
                          <th className="px-6 py-3">Date</th>
                          <th className="px-6 py-3">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-hairline">
                        {donationsList.map((d) => (
                          <tr key={d.id} className="hover:bg-gray-50/50">
                            <td className="px-6 py-4 font-medium text-ink">
                              {d.campaign_name ? (
                                <div>
                                  <div className="font-semibold text-ink">{d.campaign_name}</div>
                                  <div className="text-xs text-ink-soft">{d.ngo_name ? `NGO: ${d.ngo_name}` : (d.purpose || "Relief Mission")}</div>
                                </div>
                              ) : (
                                <div>
                                  <div className="font-semibold text-ink">{d.ngo_name || "Registered NGO Partner"}</div>
                                  <div className="text-xs text-ink-soft">{d.purpose || "General NGO Support"}</div>
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4">
                              {d.campaign_name ? (
                                <span className="inline-flex items-center text-xs font-medium text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                                  Campaign Aid
                                </span>
                              ) : (
                                <span className="inline-flex items-center text-xs font-medium text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                                  Direct to NGO
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4 font-semibold text-emerald-700">
                              ₹{parseFloat(d.amount).toLocaleString("en-IN")}
                            </td>
                            <td className="px-6 py-4 text-xs uppercase text-ink-soft">{d.method || "UPI"}</td>
                            <td className="px-6 py-4 text-xs text-ink-soft">
                              {d.date ? new Date(d.date).toLocaleDateString() : "Recent"}
                            </td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                                <Check size={12} /> Confirmed
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 6. MY IMPACT TAB */}
          {activeTab === "impact" && (
            <div className="space-y-6">
              <div>
                <h1 className="font-display text-3xl font-bold text-ink">My Impact & Contributions</h1>
                <p className="text-sm text-ink-soft mt-1">
                  Transparent breakdown of the outcomes powered by your volunteer time and aid.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 bg-white border border-hairline rounded-xl shadow-xs">
                  <TrendingUp size={24} className="text-emerald-600 mb-2" />
                  <div className="font-display text-3xl font-bold text-ink">{stats.activities}</div>
                  <p className="text-xs text-ink-soft uppercase font-semibold mt-1">Campaigns Applied / Joined</p>
                  <p className="text-xs text-ink-soft mt-2">Active participation in emergency relief.</p>
                </div>

                <div className="p-6 bg-white border border-hairline rounded-xl shadow-xs">
                  <Award size={24} className="text-emerald-600 mb-2" />
                  <div className="font-display text-3xl font-bold text-ink">{stats.totalDonations}</div>
                  <p className="text-xs text-ink-soft uppercase font-semibold mt-1">Direct Contributions</p>
                  <p className="text-xs text-ink-soft mt-2">Donations made to relief initiatives.</p>
                </div>

                <div className="p-6 bg-white border border-hairline rounded-xl shadow-xs">
                  <IndianRupee size={24} className="text-emerald-600 mb-2" />
                  <div className="font-display text-3xl font-bold text-emerald-700">
                    ₹{stats.totalDonatedAmount ? stats.totalDonatedAmount.toLocaleString("en-IN") : "0"}
                  </div>
                  <p className="text-xs text-ink-soft uppercase font-semibold mt-1">Funds Contributed</p>
                  <p className="text-xs text-ink-soft mt-2">Verified transparent relief expenditures.</p>
                </div>
              </div>
            </div>
          )}

          {/* 7. FEEDBACK TAB */}
          {activeTab === "feedback" && (
            <div className="space-y-6">
              <div>
                <h1 className="font-display text-3xl font-bold text-ink">Feedback & NGO Reviews</h1>
                <p className="text-sm text-ink-soft mt-1">
                  Share your volunteering experience and read notes from NGO coordinators.
                </p>
              </div>

              <div className="p-6 bg-white border border-hairline rounded-xl shadow-xs space-y-4">
                <h3 className="font-display text-lg font-semibold text-ink">Submit Community Feedback</h3>
                <textarea
                  rows={4}
                  placeholder="Describe your experience on ground or provide recommendations to the team..."
                  className="w-full p-3 text-sm border border-hairline rounded-lg focus:outline-emerald-600 bg-gray-50/50"
                />
                <button
                  onClick={() => showToast("Feedback submitted to the coordination team!")}
                  className="px-4 py-2 text-sm font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  Send Feedback
                </button>
              </div>
            </div>
          )}

          {/* 8. PROFILE & SETTINGS TAB (Includes Supporting Document / CV Upload) */}
          {(activeTab === "profile" || activeTab === "settings") && (
            <div className="space-y-6">
              <div>
                <h1 className="font-display text-3xl font-bold text-ink">Supporter Profile</h1>
                <p className="text-sm text-ink-soft mt-1">
                  Your registered Supporter / Individual account details and credentials.
                </p>
              </div>

              <div className="bg-white border border-hairline rounded-xl p-6 shadow-xs space-y-6">
                <div className="flex items-center gap-4 pb-6 border-b border-hairline">
                  <div className="w-16 h-16 rounded-full bg-verified text-white flex items-center justify-center text-2xl font-bold">
                    {supporter.name ? supporter.name.charAt(0).toUpperCase() : "S"}
                  </div>
                  <div>
                    <h2 className="font-display text-xl font-bold text-ink">{supporter.name || "Supporter"}</h2>
                    <p className="text-sm text-ink-soft">{supporter.email}</p>
                    <span className="inline-block mt-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Supporter / Individual Role
                    </span>
                  </div>
                </div>

                {/* Supporting Document / CV Section */}
                <div className="p-5 rounded-xl border border-emerald-200 bg-emerald-50/60 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-display text-base font-semibold text-emerald-950 flex items-center gap-2">
                        <FileText size={18} className="text-emerald-700" />
                        Volunteer CV / Supporting Document
                      </h3>
                      <p className="text-xs text-emerald-800 mt-0.5">
                        Required for applying to volunteer. NGOs review this document when approving applications.
                      </p>
                    </div>
                    {supporter.resumePath && (
                      <a
                        href={`http://localhost:5000/${supporter.resumePath}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-emerald-300 text-emerald-900 hover:bg-emerald-100 transition-colors inline-flex items-center gap-1.5"
                      >
                        <FileText size={13} /> View Current Document
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <input
                      type="file"
                      ref={profileFileInputRef}
                      onChange={handleProfileDocUpload}
                      accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                      className="hidden"
                    />
                    <button
                      type="button"
                      disabled={isUploadingProfileDoc}
                      onClick={() => profileFileInputRef.current?.click()}
                      className="inline-flex items-center gap-2 px-4 py-2 text-xs md:text-sm font-semibold rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 transition-colors disabled:opacity-50"
                    >
                      <Upload size={15} />
                      {supporter.resumePath ? "Replace CV / Document" : "Upload CV / Resume (PDF / Doc / Image)"}
                    </button>
                    {isUploadingProfileDoc && (
                      <span className="text-xs text-emerald-800 animate-pulse font-medium">
                        Uploading document...
                      </span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                  <div>
                    <label className="text-xs font-semibold text-ink-soft uppercase">Full Name</label>
                    <p className="font-medium text-ink mt-0.5">{supporter.name || "—"}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-ink-soft uppercase">Email Address</label>
                    <p className="font-medium text-ink mt-0.5">{supporter.email || "—"}</p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-ink-soft uppercase">Location</label>
                    <p className="font-medium text-ink mt-0.5">
                      {[supporter.city, supporter.state].filter(Boolean).join(", ") || "—"}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-ink-soft uppercase">Identity Verification</label>
                    <p className="font-medium text-emerald-700 mt-0.5 flex items-center gap-1">
                      <ShieldCheck size={16} /> Aadhaar Verified
                    </p>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs font-semibold text-ink-soft uppercase">Preferred Ways to Help</label>
                    <div className="flex flex-wrap gap-2 mt-1.5">
                      {supporter.helpTypes && supporter.helpTypes.length > 0 ? (
                        supporter.helpTypes.map((ht) => (
                          <span
                            key={ht}
                            className="text-xs font-medium px-2.5 py-1 rounded-md bg-gray-100 text-gray-800 border border-gray-200 capitalize"
                          >
                            {ht.replace("_", " ")}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-ink-soft">Volunteering & Donations</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 9. NOTIFICATIONS & HISTORY TABS */}
          {(activeTab === "notifications" || activeTab === "history") && (
            <div className="space-y-6">
              <div>
                <h1 className="font-display text-3xl font-bold text-ink">
                  {activeTab === "notifications" ? "Notifications" : "Activity History"}
                </h1>
                <p className="text-sm text-ink-soft mt-1">
                  Chronological log of alerts, campaign applications, and confirmations.
                </p>
              </div>

              <div className="bg-white border border-hairline rounded-xl p-6 shadow-xs divide-y divide-hairline">
                {recentActivity.length === 0 ? (
                  <div className="p-6 text-center text-sm text-ink-soft">
                    No notifications or activity history found yet.
                  </div>
                ) : (
                  recentActivity.map((act) => (
                    <div key={act.id} className="py-4 first:pt-0 last:pb-0 flex items-start gap-4">
                      <div className="p-2 rounded-full bg-emerald-50 text-emerald-700 mt-0.5">
                        <Bell size={16} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-ink">{act.text}</p>
                        <p className="text-xs text-ink-soft mt-0.5">{act.time}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  </div>

      {/* =========================================================
         MODALS (Volunteer Application, Donation, Log Hours)
         ========================================================= */}

      {/* 1. VOLUNTEER APPLICATION MODAL (With Mandatory Document Upload) */}
      {activeModal === "volunteer" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 supporter-modal-overlay animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-hairline">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xl font-bold text-ink">Volunteer Application</h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 text-ink-soft hover:text-ink rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <p className="text-xs text-ink-soft mb-4">
              Applying for: <strong className="text-ink">{selectedCampaign?.name || "Emergency Relief Campaign"}</strong>
            </p>

            <form onSubmit={handleVolunteerSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-ink-soft uppercase mb-1">
                  Preferred Volunteer Role
                </label>
                <input
                  type="text"
                  required
                  value={volunteerForm.role}
                  onChange={(e) => setVolunteerForm({ ...volunteerForm, role: e.target.value })}
                  placeholder="e.g. Relief Distribution, First Aid, Logistics"
                  className="w-full text-sm p-2.5 border border-hairline rounded-lg focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-soft uppercase mb-1">
                  Key Skills &amp; Availability
                </label>
                <input
                  type="text"
                  required
                  value={volunteerForm.skills}
                  onChange={(e) => setVolunteerForm({ ...volunteerForm, skills: e.target.value })}
                  placeholder="e.g. CPR Certified, Truck Driver, Weekend Available"
                  className="w-full text-sm p-2.5 border border-hairline rounded-lg focus:outline-emerald-600"
                />
              </div>

              {/* MANDATORY CV / SUPPORTING DOCUMENT UPLOAD */}
              <div className="p-3.5 rounded-lg border border-amber-300 bg-amber-50/70 space-y-2">
                <label className="block text-xs font-semibold text-amber-900 uppercase">
                  Supporting Document / CV / Resume <span className="text-red-600 font-bold">*</span>
                </label>
                <p className="text-[11px] text-amber-800">
                  Upload a document (PDF, Word, or Image) highlighting your experience or willingness. The NGO will review this before accepting or declining your application.
                </p>

                {supporter.resumePath && !volunteerDocFile && (
                  <p className="text-xs text-emerald-800 font-medium">
                    ✓ Using document on file: <span className="underline">{supporter.resumePath.split('/').pop()}</span> (or upload a new file below)
                  </p>
                )}

                <input
                  type="file"
                  required={!supporter.resumePath}
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  onChange={(e) => setVolunteerDocFile(e.target.files?.[0] || null)}
                  className="w-full text-xs text-ink file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-emerald-700 file:text-white hover:file:bg-emerald-800 cursor-pointer"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 text-sm font-medium rounded-lg text-ink-soft hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. MAKE A DONATION MODAL */}
      {activeModal === "donate" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 supporter-modal-overlay animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-hairline max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-display text-xl font-bold text-ink">
                {selectedCampaign ? "Campaign Donation" : "Direct NGO Donation"}
              </h3>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 text-ink-soft hover:text-ink rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            {selectedCampaign ? (
              <div className="mb-4 p-3 rounded-lg bg-emerald-50/60 border border-emerald-200/80 text-xs flex items-center justify-between gap-2">
                <div>
                  <div className="font-medium text-emerald-900">Campaign: <strong className="font-bold">{selectedCampaign.name}</strong></div>
                  <div className="text-emerald-700 mt-0.5">Organized by {selectedCampaign.org_name || "Verified NGO Partner"} · {selectedCampaign.region}</div>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedCampaign(null)}
                  className="text-xs text-emerald-800 hover:text-emerald-950 font-semibold underline shrink-0"
                >
                  Change
                </button>
              </div>
            ) : (
              <div className="mb-4 p-3 rounded-lg bg-emerald-50/60 border border-emerald-200/80 text-xs text-emerald-900">
                AidLink is an integrating platform and does not accept donations directly. Please select a <strong>registered NGO</strong> below to support their relief mission directly or link to an active campaign.
              </div>
            )}

            <form onSubmit={handleDonationSubmit} className="space-y-4">
              {!selectedCampaign && (
                <div>
                  <label className="block text-xs font-semibold text-ink-soft uppercase mb-1">
                    Select Registered NGO <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={selectedNgo?.id || ""}
                    onChange={(e) => {
                      const ngoId = parseInt(e.target.value, 10);
                      const found = ngosList.find(n => n.id === ngoId);
                      setSelectedNgo(found || null);
                    }}
                    className="w-full text-sm p-2.5 border border-hairline rounded-lg focus:outline-emerald-600 bg-white font-medium text-ink"
                  >
                    <option value="">-- Choose an NGO to support --</option>
                    {ngosList.map((ngo) => (
                      <option key={ngo.id} value={ngo.id}>
                        {ngo.org_name} {ngo.hq ? `(${ngo.hq})` : ""}
                      </option>
                    ))}
                  </select>

                  {selectedNgo && (
                    <>
                      <div className="mt-3">
                        <label className="block text-xs font-semibold text-ink-soft uppercase mb-1">
                          Select Active Campaign (Optional)
                        </label>
                        <select
                          value={selectedCampaign?.rawId || selectedCampaign?.id || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            if (!val) {
                              setSelectedCampaign(null);
                            } else {
                              const cId = parseInt(val, 10);
                              const found = campaigns.find(c => (c.rawId || c.id) === cId);
                              setSelectedCampaign(found || { id: cId, rawId: cId, name: campaigns.find(c => (c.rawId || c.id) === cId)?.name || "Emergency Campaign", ngo_id: selectedNgo.id });
                            }
                          }}
                          className="w-full text-sm p-2.5 border border-hairline rounded-lg focus:outline-emerald-600 bg-white font-medium text-ink"
                        >
                          <option value="">General NGO Relief Fund (Direct Support)</option>
                          {campaigns
                            .filter(c => !selectedNgo || c.ngo_id === selectedNgo.id || c.ngoId === selectedNgo.id || c.org_name === selectedNgo.org_name || c.orgName === selectedNgo.org_name)
                            .map(c => (
                              <option key={c.id} value={c.rawId || c.id}>
                                Campaign: {c.name} ({c.region})
                              </option>
                            ))}
                        </select>
                      </div>

                      <div className="mt-2 p-2.5 rounded-lg bg-gray-50 border border-hairline text-xs text-ink-soft flex items-start gap-2">
                        <ShieldCheck size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-semibold text-ink">{selectedNgo.org_name}</div>
                          <div>{selectedNgo.tagline || (selectedNgo.hq ? `Location: ${selectedNgo.hq}` : 'Verified Relief Organisation')}</div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-ink-soft uppercase mb-1">
                  Donation Amount (₹)
                </label>
                <div className="flex gap-2 mb-2">
                  {["500", "1000", "2500", "5000"].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setDonationForm({ ...donationForm, amount: amt })}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border ${
                        donationForm.amount === amt
                          ? "bg-emerald-600 text-white border-emerald-600 font-bold"
                          : "border-hairline text-ink hover:bg-gray-50"
                      }`}
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  required
                  min="1"
                  value={donationForm.amount}
                  onChange={(e) => setDonationForm({ ...donationForm, amount: e.target.value })}
                  placeholder="Custom amount in INR"
                  className="w-full text-sm p-2.5 border border-hairline rounded-lg focus:outline-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-soft uppercase mb-1">
                  Purpose / Aid Allocation
                </label>
                <select
                  value={donationForm.purpose}
                  onChange={(e) => setDonationForm({ ...donationForm, purpose: e.target.value })}
                  className="w-full text-sm p-2.5 border border-hairline rounded-lg focus:outline-emerald-600 bg-white"
                >
                  <option value="Medical & Food Aid">Medical &amp; Emergency Food Aid</option>
                  <option value="Temporary Shelter">Temporary Shelter &amp; Tarpaulins</option>
                  <option value="Clean Drinking Water">Clean Drinking Water &amp; Sanitation</option>
                  <option value="General Relief Fund">General Emergency Response / NGO Fund</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink-soft uppercase mb-1">
                  Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["UPI", "Debit Card", "Net Banking"].map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setDonationForm({ ...donationForm, method })}
                      className={`py-2 text-xs font-semibold rounded-lg border text-center ${
                        donationForm.method === method
                          ? "bg-emerald-50 text-emerald-800 border-emerald-500 font-bold"
                          : "border-hairline text-ink-soft hover:bg-gray-50"
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 text-sm font-medium rounded-lg text-ink-soft hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs"
                >
                  Donate ₹{donationForm.amount}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}



      {/* 4. WORKSHOP INFO MODAL */}
      {activeModal === "workshop-info" && selectedWorkshop && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 supporter-modal-overlay animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-hairline">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-100 text-purple-800 uppercase tracking-wider">
                🎓 Community Workshop
              </span>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 text-ink-soft hover:text-ink rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <h3 className="font-display text-xl font-bold text-ink mb-1">
              {selectedWorkshop.title}
            </h3>
            <p className="text-xs text-purple-700 font-semibold mb-4">
              Organized by {selectedWorkshop.orgName || selectedWorkshop.org_name || "Verified NGO Partner"}
            </p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 bg-gray-50 rounded-xl border border-hairline/80">
                <p className="text-[11px] text-ink-soft font-medium uppercase">Date & Time</p>
                <p className="text-sm font-semibold text-ink mt-0.5">{selectedWorkshop.date || "Upcoming"}</p>
                <p className="text-xs text-ink-soft">{selectedWorkshop.time || "Scheduled"}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-hairline/80">
                <p className="text-[11px] text-ink-soft font-medium uppercase">Location</p>
                <p className="text-sm font-semibold text-ink mt-0.5">{selectedWorkshop.city || "On-ground"}</p>
                <p className="text-xs text-ink-soft truncate">{selectedWorkshop.location || "Venue details provided upon registration"}</p>
              </div>
            </div>

            <div className="mb-5">
              <p className="text-xs font-semibold text-ink uppercase mb-1">About this Workshop</p>
              <p className="text-sm text-ink-soft leading-relaxed">
                {selectedWorkshop.description || "Join hands-on skill training to aid emergency relief efforts and build community resilience."}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-xs text-purple-900 mb-5">
              💡 Workshop registration is managed directly by the NGO.
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-hairline">
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="px-4 py-2 text-sm font-medium rounded-lg text-ink-soft hover:bg-gray-100"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  if (selectedWorkshop.form_url && selectedWorkshop.form_url.trim().startsWith("http")) {
                    window.open(selectedWorkshop.form_url.trim(), "_blank");
                  } else {
                    alert("No form attached for now.");
                  }
                }}
                className="px-5 py-2 text-sm font-semibold rounded-lg bg-purple-600 text-white hover:bg-purple-700 shadow-xs"
              >
                Register for Workshop
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. CAMPAIGN INFO MODAL */}
      {activeModal === "campaign-info" && selectedCampaign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 supporter-modal-overlay animate-fade-in">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-hairline max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                {Boolean(selectedCampaign.isUrgent || selectedCampaign.is_urgent) && (
                  <span className="text-xs font-bold px-2.5 py-1 rounded bg-red-600 text-white animate-pulse">
                    ⚡ URGENT RELIEF
                  </span>
                )}
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                  {selectedCampaign.disaster || "Relief Mission"}
                </span>
              </div>
              <button
                onClick={() => setActiveModal(null)}
                className="p-1 text-ink-soft hover:text-ink rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <h3 className="font-display text-xl font-bold text-ink mb-1">
              {selectedCampaign.name || selectedCampaign.title}
            </h3>
            <p className="text-xs text-emerald-800 font-semibold mb-4">
              Organized by {selectedCampaign.orgName || selectedCampaign.org_name || "Verified NGO Partner"}
            </p>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 bg-gray-50 rounded-xl border border-hairline/80">
                <p className="text-[11px] text-ink-soft font-medium uppercase">Region / Location</p>
                <p className="text-sm font-semibold text-ink mt-0.5">{selectedCampaign.region || selectedCampaign.city || "On-ground"}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-xl border border-hairline/80">
                <p className="text-[11px] text-ink-soft font-medium uppercase">Target Households</p>
                <p className="text-sm font-semibold text-ink mt-0.5">{selectedCampaign.target_households || selectedCampaign.target || 100} Families</p>
              </div>
            </div>

            <div className="mb-5">
              <p className="text-xs font-semibold text-ink uppercase mb-1">Campaign Objective</p>
              <p className="text-sm text-ink-soft leading-relaxed">
                {selectedCampaign.objective || "Providing immediate emergency relief, rations, clean water, and shelter assistance to affected families."}
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-hairline">
              <button
                type="button"
                onClick={() => {
                  setVolunteerDocFile(null);
                  setActiveModal("volunteer");
                }}
                className="flex-1 py-2 text-sm font-semibold rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 transition-colors text-center"
              >
                Apply to Volunteer
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedNgo(null);
                  setActiveModal("donate");
                }}
                className="flex-1 py-2 text-sm font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition-colors text-center shadow-xs"
              >
                Donate Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
