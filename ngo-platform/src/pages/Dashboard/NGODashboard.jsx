import React, { useState, useEffect } from 'react';
import usePageTitle from '../../hooks/usePageTitle';
import { API_BASE } from '../../config/api';

const API_ROOT = `${API_BASE}/api`;
import Sidebar from '../../components/Dashboard/Sidebar';
import Topbar from '../../components/Dashboard/Topbar';
import Toast from '../../components/Dashboard/Toast';
import {
  NewCampaignModal,
  NewWorkshopModal,
  EditWorkshopModal,
  ConfirmDiscardWorkshopModal,
  NewActivityModal,
  NewExpenseModal,
  NewEvidenceModal,
  NewUpdateModal,
  ViewImpactReportModal,
  NewResourceModal,
  UpdateBeneficiariesModal,
  UpdateResourceModal
} from '../../components/Dashboard/Modals';

import Overview from './views/Overview';
import CampaignsList from './views/CampaignsList';
import CampaignDetail from './views/CampaignDetail';
import ActivitiesPage from './views/ActivitiesPage';
import WorkshopsPage from './views/WorkshopsPage';
import VolunteersPage from './views/VolunteersPage';
import ResourcesPage from './views/ResourcesPage';
import DonationsPage from './views/DonationsPage';
import ExpensesPage from './views/ExpensesPage';
import EvidencePage from './views/EvidencePage';
import ReportsPage from './views/ReportsPage';
import FeedbackPage from './views/FeedbackPage';
import TransparencyPage from './views/TransparencyPage';
import OrgProfilePage from './views/OrgProfilePage';
import './NGODashboard.css';
import NgoDashboardSkeleton from './skeletons/NgoDashboardSkeleton';

import {
  INITIAL_ORG,
  INITIAL_CAMPAIGNS,
  INITIAL_FEEDBACK,
  INITIAL_NOTIFICATIONS,
  nextId,
  fmtINR
} from '../../data/mockData';

export default function NGODashboard({ initialCampaignId }) {
  usePageTitle('NGO Management Dashboard');
  // State
  const [org, setOrg] = useState(null);
  const [campaigns, setCampaigns] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const [ngoDonations, setNgoDonations] = useState([]);
  const [feedbackList, setFeedbackList] = useState(INITIAL_FEEDBACK);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const [route, setRoute] = useState({
    view: initialCampaignId ? "campaign-detail" : "overview",
    campaignId: initialCampaignId || null,
    tab: "chain"
  });

  const [campaignFilters, setCampaignFilters] = useState({ status: "all", q: "" });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Active Modals state
  const [activeModal, setActiveModal] = useState(null); // 'new-campaign' | 'new-workshop' | 'edit-workshop' | 'discard-workshop' | 'new-activity' | 'new-expense' | 'new-evidence' | 'new-update' | 'view-report'
  const [selectedReportInfo, setSelectedReportInfo] = useState(null);
  const [selectedResource, setSelectedResource] = useState(null);
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);

  // Fetch Logged-in NGO Profile
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${API_ROOT}/ngos/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setOrg(data);
      }
    } catch (error) {
      console.error("Error fetching NGO profile:", error);
    }
  };

  // Helper functions
  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage("");
    }, 2600);
  };

  // Fetch Nested Campaigns strictly for this NGO
  const fetchCampaigns = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${API_ROOT}/campaigns`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        setCampaigns(data);
      }
    } catch (error) {
      console.error("Database connection error:", error);
      showToast("Failed to load campaigns.");
    }
  };

  // Fetch All NGO Donations (both Campaign and Direct)
  const fetchDonations = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${API_ROOT}/ngos/donations`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setNgoDonations(data);
      }
    } catch (error) {
      console.error("Error fetching NGO donations:", error);
    }
  };

  // Fetch NGO Workshops
  const fetchWorkshops = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${API_ROOT}/workshops/my`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setWorkshops(data);
      }
    } catch (error) {
      console.error("Error fetching NGO workshops:", error);
    }
  };

  // Coordinated Initial Load with Smooth Skeleton Shimmer Transition
  useEffect(() => {
    let isMounted = true;
    const loadAll = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          fetchProfile(),
          fetchCampaigns(),
          fetchDonations(),
          fetchWorkshops()
        ]);
      } catch (err) {
        console.error("Error loading NGO dashboard data:", err);
      } finally {
        if (isMounted) {
          setTimeout(() => {
            if (isMounted) setIsLoading(false);
          }, 1000);
        }
      }
    };
    loadAll();
    return () => { isMounted = false; };
  }, []);

  const handleNav = (view, campaignId = null, tab = "chain") => {
    setRoute({ view, campaignId, tab });
    window.scrollTo({ top: 0, behavior: "instant" });
    setIsSidebarOpen(false);
  };

  const handleNavCampaign = (id, tab = "chain") => {
    handleNav("campaign-detail", id, tab);
  };

  const handleSearch = (q) => {
    if (!q) return;
    setCampaignFilters({ status: "all", q });
    handleNav("campaigns");
  };

  // State Mutation Handlers
  const handleCreateCampaign = async ({ name, disaster, target, region, objective, coverImage, isUrgent }) => {
    if (!name || !region) {
      showToast("Please add a campaign name and region.");
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      
      const formData = new FormData();
      formData.append('ngo_id', org?.id || '');
      formData.append('name', name);
      formData.append('disaster', disaster);
      formData.append('region', region);
      formData.append('objective', objective);
      formData.append('target_households', target);
      formData.append('is_urgent', isUrgent ? 'true' : 'false');
      if (coverImage) {
        formData.append('coverImage', coverImage);
      }

      const response = await fetch(`${API_ROOT}/campaigns`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const newCamp = await response.json();
        setActiveModal(null);
        showToast("Draft campaign created.");
        await fetchCampaigns();
        handleNavCampaign(newCamp.id);
      } else {
        showToast("Failed to create campaign.");
      }
    } catch (err) {
      console.error(err);
      showToast("An error occurred while creating campaign.");
    }
  };

  const handleToggleUrgent = async (cid, currentUrgent) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_ROOT}/campaigns/${cid}/urgent`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ is_urgent: !currentUrgent })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.emailBroadcastTriggered) {
          showToast("🚨 Marked URGENT! Emergency alerts dispatched to registered volunteers via Resend.");
        } else {
          showToast(data.isUrgent ? "Campaign marked as URGENT priority." : "Urgent priority removed.");
        }
        await fetchCampaigns();
      } else {
        showToast("Failed to update campaign urgency.");
      }
    } catch (err) {
      console.error(err);
      showToast("An error occurred while updating urgency.");
    }
  };

  const handleCreateWorkshop = async (workshopData) => {
    if (!workshopData.title) {
      showToast("Please add a workshop title.");
      return;
    }
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_ROOT}/workshops`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(workshopData)
      });

      if (response.ok) {
        setActiveModal(null);
        showToast("Community workshop organized and published!");
        await fetchWorkshops();
      } else {
        showToast("Failed to create workshop.");
      }
    } catch (err) {
      console.error(err);
      showToast("An error occurred while creating workshop.");
    }
  };

  const handleUpdateWorkshop = async (workshopData) => {
    if (!selectedWorkshop) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_ROOT}/workshops/${selectedWorkshop.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(workshopData)
      });

      if (response.ok) {
        setActiveModal(null);
        setSelectedWorkshop(null);
        showToast("Workshop details and registration link updated.");
        await fetchWorkshops();
      } else {
        showToast("Failed to update workshop.");
      }
    } catch (err) {
      console.error(err);
      showToast("An error occurred while updating workshop.");
    }
  };

  const handleDiscardWorkshop = async () => {
    if (!selectedWorkshop) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_ROOT}/workshops/${selectedWorkshop.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setActiveModal(null);
        setSelectedWorkshop(null);
        showToast("Workshop discarded.");
        await fetchWorkshops();
      } else {
        showToast("Failed to discard workshop.");
      }
    } catch (err) {
      console.error(err);
      showToast("An error occurred while discarding workshop.");
    }
  };

  const handlePublishCampaign = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_ROOT}/campaigns/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: "active" })
      });

      if (response.ok) {
        const data = await response.json();
        if (data.emailBroadcastTriggered) {
          showToast("🚨 Urgent campaign published! Emergency alerts dispatched to volunteers via Resend.");
        } else {
          showToast("Campaign published and now active.");
        }
        await fetchCampaigns();
      } else {
        showToast("Failed to publish campaign.");
      }
    } catch (err) {
      console.error(err);
      showToast("An error occurred while publishing campaign.");
    }
  };

  const handleScheduleActivity = async ({ title, type, date, location, volunteersAssigned }) => {
    if (!title) {
      showToast("Please add an activity title.");
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_ROOT}/campaigns/${route.campaignId}/activities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          type,
          date,
          location: location.trim() || "—",
          volunteers_assigned: Number(volunteersAssigned) || 0
        })
      });

      if (response.ok) {
        setActiveModal(null);
        showToast("Activity scheduled.");
        await fetchCampaigns();
      } else {
        showToast("Failed to schedule activity.");
      }
    } catch (err) {
      console.error(err);
      showToast("An error occurred while scheduling activity.");
    }
  };

  const handleDeclareExpense = async ({ category, amount, vendor, date, note }) => {
    const amt = Number(amount) || 0;
    if (!category || !amt) {
      showToast("Please add a category and amount.");
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_ROOT}/campaigns/${route.campaignId}/expenses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          category,
          vendor: vendor.trim() || "—",
          amount: amt,
          expense_date: date,
          note: note.trim()
        })
      });

      if (response.ok) {
        setActiveModal(null);
        showToast("Expense declared. Attach evidence to complete the record.");
        await fetchCampaigns();
      } else {
        showToast("Failed to declare expense.");
      }
    } catch (err) {
      console.error(err);
      showToast("An error occurred while declaring expense.");
    }
  };

  const handleUploadEvidence = async ({ title, type, linkedTo, file }) => {
    if (!title || !file) {
      showToast("Please add a title and select a file for this evidence item.");
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      const formData = new FormData();
      formData.append('title', title);
      formData.append('document_type', type);
      formData.append('linked_to', linkedTo);
      formData.append('evidenceFile', file);

      const response = await fetch(`${API_ROOT}/campaigns/${route.campaignId}/evidence`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        setActiveModal(null);
        showToast("Evidence uploaded.");
        await fetchCampaigns();
      } else {
        showToast("Failed to upload evidence.");
      }
    } catch (err) {
      console.error(err);
      showToast("An error occurred while uploading evidence.");
    }
  };

  const handlePublishUpdate = async ({ title, body }) => {
    if (!title || !body) {
      showToast("Please add both a title and body.");
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_ROOT}/campaigns/${route.campaignId}/updates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, body })
      });

      if (response.ok) {
        setActiveModal(null);
        showToast("Progress update published.");
        await fetchCampaigns();
      } else {
        showToast("Failed to publish update.");
      }
    } catch (err) {
      console.error(err);
      showToast("An error occurred while publishing update.");
    }
  };

  const handleGenerateImpactReport = async (cid) => {
    const campaign = campaigns.find(c => c.id === cid);
    if (!campaign) return;
    
    const title = `${campaign.name} — Impact Summary`;
    const period = `${campaign.start_date || 'Start'} – Present`;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_ROOT}/campaigns/${cid}/impact-reports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, period })
      });

      if (response.ok) {
        showToast("Impact report generated and published.");
        await fetchCampaigns();
      } else {
        showToast("Failed to generate impact report.");
      }
    } catch (err) {
      console.error(err);
      showToast("An error occurred while generating impact report.");
    }
  };

  const handleDecideVolunteer = async (cid, vid, decision) => {
    // Optimistically update local state so changes reflect instantly
    setCampaigns(prev => prev.map(c => {
      if (c.id !== cid) return c;
      return {
        ...c,
        volunteers: (c.volunteers || []).map(v => v.id === vid ? { ...v, status: decision } : v)
      };
    }));

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_ROOT}/volunteers/${vid}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: decision })
      });

      if (response.ok) {
        showToast(decision === "active" ? "Volunteer approved." : "Application declined.");
        await fetchCampaigns();
      } else {
        showToast(decision === "active" ? "Volunteer approved." : "Application declined.");
      }
    } catch (err) {
      console.error(err);
      showToast(decision === "active" ? "Volunteer approved." : "Application declined.");
    }
  };

  const handleAllocateResource = async (resourceData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_ROOT}/campaigns/${route.campaignId}/resources`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(resourceData)
      });

      if (response.ok) {
        setActiveModal(null);
        showToast("Resource allocated.");
        await fetchCampaigns();
      } else {
        showToast("Failed to allocate resource.");
      }
    } catch (err) {
      console.error(err);
      showToast("An error occurred while allocating resource.");
    }
  };

  const handleUpdateResource = async (updateData) => {
    if (!selectedResource) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_ROOT}/campaigns/${route.campaignId}/resources/${selectedResource.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updateData)
      });

      if (response.ok) {
        setActiveModal(null);
        setSelectedResource(null);
        showToast("Resource deployment updated.");
        await fetchCampaigns();
      } else {
        showToast("Failed to update resource.");
      }
    } catch (err) {
      console.error(err);
      showToast("An error occurred while updating resource.");
    }
  };

  const handleUpdateBeneficiaries = async (beneficiariesData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_ROOT}/campaigns/${route.campaignId}/beneficiaries`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ beneficiaries: beneficiariesData })
      });

      if (response.ok) {
        setActiveModal(null);
        showToast("Beneficiary data updated.");
        await fetchCampaigns();
      } else {
        showToast("Failed to update beneficiaries.");
      }
    } catch (err) {
      console.error(err);
      showToast("An error occurred while updating beneficiaries.");
    }
  };

  const handleViewImpactReport = (cid, rid) => {
    const c = campaigns.find(x => x.id === cid);
    const r = c?.impactReports.find(x => x.id === rid);
    setSelectedReportInfo({ campaign: c, report: r });
    setActiveModal("view-report");
  };

  // Derived counts
  const allVolunteers = campaigns.flatMap(c => c.volunteers);
  const pendingVolCount = allVolunteers.filter(v => v.status === "pending").length;
  const allExpenses = campaigns.flatMap(c => c.expenses);
  const missingEvidenceCount = allExpenses.filter(e => e.status === "missing_evidence").length;

  const currentCampaign = campaigns.find(c => c.id === route.campaignId);
  const displayOrg = org || { name: 'AidLink NGO', id: null };

  const handleDismissNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    showToast("Notification dismissed.");
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications([]);
    showToast("All notifications cleared.");
  };

  return (
    <div id="appshell">
      <Sidebar 
        currentView={route.view}
        onNav={handleNav}
        pendingVolCount={pendingVolCount}
        missingEvidenceCount={missingEvidenceCount}
        orgName={displayOrg.name}
        isSidebarOpen={isSidebarOpen}
        onCloseSidebar={() => setIsSidebarOpen(false)}
      />

      <div id="main">
        <Topbar 
          org={displayOrg}
          notifications={notifications}
          onDismissNotification={handleDismissNotification}
          onMarkAllNotificationsRead={handleMarkAllNotificationsRead}
          onToggleSidebar={() => setIsSidebarOpen(prev => !prev)}
          onOpenNewCampaignModal={() => setActiveModal('new-campaign')}
          onOpenNewWorkshopModal={() => setActiveModal('new-workshop')}
          onNav={handleNav}
          onNavCampaign={handleNavCampaign}
          onSearch={handleSearch}
        />

        <main id="content">
          {isLoading || !org ? (
            <NgoDashboardSkeleton />
          ) : (
            <>
              {route.view === "overview" && (
                <Overview 
                  campaigns={campaigns}
                  volunteers={allVolunteers}
                  expenses={allExpenses}
                  notifications={notifications}
                  onNav={handleNav}
                  onNavCampaign={handleNavCampaign}
                  onShowToast={showToast}
                />
              )}

          {route.view === "campaigns" && (
            <CampaignsList 
              campaigns={campaigns}
              initialFilter={campaignFilters}
              onNavCampaign={handleNavCampaign}
              onOpenNewCampaignModal={() => setActiveModal('new-campaign')}
            />
          )}

          {route.view === "campaign-detail" && (
            <CampaignDetail 
              campaign={currentCampaign}
              activeTab={route.tab}
              onTabChange={(tab) => setRoute(prev => ({ ...prev, tab }))}
              onNav={handleNav}
              onPublishCampaign={handlePublishCampaign}
              onToggleUrgent={handleToggleUrgent}
              onOpenNewActivityModal={() => setActiveModal('new-activity')}
              onOpenNewExpenseModal={() => setActiveModal('new-expense')}
              onOpenNewEvidenceModal={() => setActiveModal('new-evidence')}
              onOpenNewUpdateModal={() => setActiveModal('new-update')}
              onOpenNewResourceModal={() => setActiveModal('new-resource')}
              onOpenUpdateResourceModal={(res) => { setSelectedResource(res); setActiveModal('update-resource'); }}
              onOpenUpdateBeneficiariesModal={() => setActiveModal('update-beneficiaries')}
              onGenerateImpactReport={handleGenerateImpactReport}
              onViewImpactReport={handleViewImpactReport}
              onDecideVolunteer={handleDecideVolunteer}
              onShowToast={showToast}
            />
          )}

          {route.view === "workshops" && (
            <WorkshopsPage 
              workshops={workshops}
              onOpenNewWorkshopModal={() => setActiveModal('new-workshop')}
              onOpenEditWorkshopModal={(w) => {
                setSelectedWorkshop(w);
                setActiveModal('edit-workshop');
              }}
              onOpenDiscardWorkshopModal={(w) => {
                setSelectedWorkshop(w);
                setActiveModal('discard-workshop');
              }}
            />
          )}

          {route.view === "activities" && (
            <ActivitiesPage 
              campaigns={campaigns}
              onNavCampaign={handleNavCampaign}
            />
          )}

          {route.view === "volunteers" && (
            <VolunteersPage 
              campaigns={campaigns}
              onNavCampaign={handleNavCampaign}
              onDecideVolunteer={handleDecideVolunteer}
            />
          )}

          {route.view === "resources" && (
            <ResourcesPage 
              campaigns={campaigns}
              onNavCampaign={handleNavCampaign}
            />
          )}

          {route.view === "donations" && (
            <DonationsPage 
              campaigns={campaigns}
              donations={ngoDonations}
              onNavCampaign={handleNavCampaign}
            />
          )}

          {route.view === "expenses" && (
            <ExpensesPage 
              campaigns={campaigns}
              onNavCampaign={handleNavCampaign}
            />
          )}

          {route.view === "evidence" && (
            <EvidencePage 
              campaigns={campaigns}
              onNavCampaign={handleNavCampaign}
            />
          )}

          {route.view === "reports" && (
            <ReportsPage 
              campaigns={campaigns}
              onViewImpactReport={handleViewImpactReport}
              onNavCampaign={handleNavCampaign}
            />
          )}

          {route.view === "feedback" && (
            <FeedbackPage 
              feedbackList={feedbackList}
              campaigns={campaigns}
            />
          )}

          {route.view === "transparency" && (
            <TransparencyPage 
              campaigns={campaigns}
              org={org}
              onNav={handleNav}
            />
          )}

              {route.view === "org-profile" && (
                <OrgProfilePage 
                  org={org}
                  onShowToast={showToast}
                />
              )}
            </>
          )}
        </main>
      </div>

      <Toast message={toastMessage} />

      {/* Render Active Modal */}
      {activeModal === 'new-campaign' && (
        <NewCampaignModal 
          onClose={() => setActiveModal(null)}
          onSubmit={handleCreateCampaign}
        />
      )}

      {activeModal === 'new-workshop' && (
        <NewWorkshopModal
          onClose={() => setActiveModal(null)}
          onSubmit={handleCreateWorkshop}
        />
      )}

      {activeModal === 'edit-workshop' && selectedWorkshop && (
        <EditWorkshopModal
          workshop={selectedWorkshop}
          onClose={() => {
            setActiveModal(null);
            setSelectedWorkshop(null);
          }}
          onSubmit={handleUpdateWorkshop}
        />
      )}

      {activeModal === 'discard-workshop' && selectedWorkshop && (
        <ConfirmDiscardWorkshopModal
          workshop={selectedWorkshop}
          onClose={() => {
            setActiveModal(null);
            setSelectedWorkshop(null);
          }}
          onConfirm={handleDiscardWorkshop}
        />
      )}

      {activeModal === 'new-activity' && (
        <NewActivityModal 
          onClose={() => setActiveModal(null)}
          onSubmit={handleScheduleActivity}
        />
      )}

      {activeModal === 'new-expense' && (
        <NewExpenseModal 
          onClose={() => setActiveModal(null)}
          onSubmit={handleDeclareExpense}
        />
      )}

      {activeModal === 'new-evidence' && (
        <NewEvidenceModal 
          campaign={currentCampaign}
          onClose={() => setActiveModal(null)}
          onSubmit={handleUploadEvidence}
        />
      )}

      {activeModal === 'new-update' && (
        <NewUpdateModal 
          onClose={() => setActiveModal(null)}
          onSubmit={handlePublishUpdate}
        />
      )}

      {activeModal === 'view-report' && selectedReportInfo && (
        <ViewImpactReportModal 
          report={selectedReportInfo.report}
          campaign={selectedReportInfo.campaign}
          org={org}
          onClose={() => {
            setActiveModal(null);
            setSelectedReportInfo(null);
          }}
        />
      )}

      {activeModal === 'new-resource' && (
        <NewResourceModal
          onClose={() => setActiveModal(null)}
          onSubmit={handleAllocateResource}
        />
      )}

      {activeModal === 'update-beneficiaries' && currentCampaign && (
        <UpdateBeneficiariesModal
          campaign={currentCampaign}
          onClose={() => setActiveModal(null)}
          onSubmit={handleUpdateBeneficiaries}
        />
      )}

      {activeModal === 'update-resource' && selectedResource && (
        <UpdateResourceModal
          resource={selectedResource}
          onClose={() => {
            setActiveModal(null);
            setSelectedResource(null);
          }}
          onSubmit={handleUpdateResource}
        />
      )}
    </div>
  );
}
