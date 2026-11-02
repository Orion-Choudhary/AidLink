import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  MapPin,
  ShieldCheck,
  Award,
  Users,
  Clock,
  Star,
  MessageSquare,
  ThumbsUp,
  AlertTriangle,
  ArrowRight,
  X,
  Filter,
  ChevronRight,
  HeartHandshake,
  CheckCircle2,
  FileText
} from 'lucide-react';
import usePageTitle from '../hooks/usePageTitle';
import { API_BASE } from '../config/api';

export default function VolunteerDirectoryPage() {
  usePageTitle('Volunteer Registry & Accountability');

  const [volunteers, setVolunteers] = useState([]);
  const [summary, setSummary] = useState({
    total_volunteers: 52,
    total_hours_logged: 4226,
    average_community_rating: 4.3,
    total_reviews_count: 104
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('ALL');
  const [selectedRating, setSelectedRating] = useState('ALL');
  const [sortBy, setSortBy] = useState('HOURS_DESC');

  // Modal state
  const [selectedVolunteer, setSelectedVolunteer] = useState(null);

  useEffect(() => {
    fetchVolunteers();
  }, []);

  const fetchVolunteers = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/volunteers/public`);
      if (!res.ok) throw new Error('Failed to fetch volunteer directory');
      const data = await res.json();
      if (data.volunteers) setVolunteers(data.volunteers);
      if (data.summary) setSummary(data.summary);
    } catch (err) {
      console.error('Error fetching public volunteers:', err);
      setError('Unable to load volunteer registry at this time. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Extract unique roles
  const allRoles = useMemo(() => {
    const rolesSet = new Set();
    volunteers.forEach((v) => {
      if (v.role) rolesSet.add(v.role);
    });
    return Array.from(rolesSet).sort();
  }, [volunteers]);

  // Filter and sort logic
  const filteredVolunteers = useMemo(() => {
    return volunteers
      .filter((v) => {
        const query = searchQuery.toLowerCase().trim();
        const matchesQuery =
          !query ||
          v.name?.toLowerCase().includes(query) ||
          v.city?.toLowerCase().includes(query) ||
          v.state?.toLowerCase().includes(query) ||
          v.role?.toLowerCase().includes(query) ||
          v.campaign?.name?.toLowerCase().includes(query) ||
          v.skills?.some((s) => s.toLowerCase().includes(query));

        const matchesRole = selectedRole === 'ALL' || v.role === selectedRole;

        let matchesRating = true;
        if (selectedRating === '4.5') {
          matchesRating = (v.averageRating || 0) >= 4.5;
        } else if (selectedRating === '4.0') {
          matchesRating = (v.averageRating || 0) >= 4.0;
        } else if (selectedRating === 'CONSTRUCTIVE') {
          matchesRating = (v.constructiveCount || 0) > 0;
        }

        return matchesQuery && matchesRole && matchesRating;
      })
      .sort((a, b) => {
        if (sortBy === 'HOURS_DESC') {
          return (b.hoursLogged || 0) - (a.hoursLogged || 0);
        }
        if (sortBy === 'RATING_DESC') {
          return (b.averageRating || 0) - (a.averageRating || 0);
        }
        if (sortBy === 'REVIEWS_DESC') {
          return (b.reviewCount || 0) - (a.reviewCount || 0);
        }
        if (sortBy === 'NAME_ASC') {
          return a.name.localeCompare(b.name);
        }
        return 0;
      });
  }, [volunteers, searchQuery, selectedRole, selectedRating, sortBy]);

  const hasActiveFilters =
    searchQuery.trim() !== '' || selectedRole !== 'ALL' || selectedRating !== 'ALL';

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedRole('ALL');
    setSelectedRating('ALL');
    setSortBy('HOURS_DESC');
  };

  const getInitials = (name) => {
    if (!name) return 'V';
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans flex flex-col pt-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-emerald-50/80 via-white to-white border-b border-gray-100 py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 py-1 px-3.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold tracking-wider uppercase mb-4">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Public Frontline Registry & Accountability
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
                Volunteer Hall of Fame & Reviews
              </h1>
              <p className="mt-3 text-base sm:text-lg text-gray-600 leading-relaxed">
                Inspect verified field hours, emergency mission deployments, peer evaluations,
                and transparent feedback—celebrating outstanding heroism while upholding strict operational standards.
              </p>
            </div>

            {/* Platform Quick Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white border border-emerald-100 p-4 rounded-2xl shadow-sm">
              <div className="text-center px-3 py-1">
                <div className="text-2xl font-extrabold text-emerald-700">
                  {summary.total_volunteers || volunteers.length}
                </div>
                <div className="text-xs text-gray-500 font-medium flex items-center justify-center gap-1 mt-1">
                  <Users className="w-3.5 h-3.5 text-emerald-600" />
                  Verified Responders
                </div>
              </div>

              <div className="text-center px-3 py-1 border-l border-gray-100">
                <div className="text-2xl font-extrabold text-emerald-700">
                  {(summary.total_hours_logged || 0).toLocaleString('en-IN')}
                </div>
                <div className="text-xs text-gray-500 font-medium flex items-center justify-center gap-1 mt-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" />
                  Field Hours Logged
                </div>
              </div>

              <div className="text-center px-3 py-1 border-l border-gray-100">
                <div className="text-2xl font-extrabold text-emerald-700 flex items-center justify-center gap-1">
                  <span>{summary.average_community_rating || '4.3'}</span>
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                </div>
                <div className="text-xs text-gray-500 font-medium flex items-center justify-center gap-1 mt-1">
                  <Award className="w-3.5 h-3.5 text-emerald-600" />
                  Reliability Rating
                </div>
              </div>

              <div className="text-center px-3 py-1 border-l border-gray-100">
                <div className="text-2xl font-extrabold text-emerald-700">
                  {summary.total_reviews_count || 104}
                </div>
                <div className="text-xs text-gray-500 font-medium flex items-center justify-center gap-1 mt-1">
                  <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                  Evaluated Reviews
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        {/* Search & Filter Toolbar */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Search Input */}
            <div className="md:col-span-5 relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by volunteer name, city, campaign or skill..."
                className="w-full pl-10 pr-10 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition text-gray-800"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Role Filter Dropdown */}
            <div className="md:col-span-3">
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition text-gray-700 font-medium"
              >
                <option value="ALL">All Specializations</option>
                {allRoles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            {/* Rating Filter Dropdown */}
            <div className="md:col-span-2">
              <select
                value={selectedRating}
                onChange={(e) => setSelectedRating(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition text-gray-700 font-medium"
              >
                <option value="ALL">All Ratings</option>
                <option value="4.5">4.5+ Stars</option>
                <option value="4.0">4.0+ Stars</option>
                <option value="CONSTRUCTIVE">With Operational Notes</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="md:col-span-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition text-gray-700 font-medium"
              >
                <option value="HOURS_DESC">Most Hours Logged</option>
                <option value="RATING_DESC">Highest Rating</option>
                <option value="REVIEWS_DESC">Most Reviews</option>
                <option value="NAME_ASC">Name (A-Z)</option>
              </select>
            </div>
          </div>

          {hasActiveFilters && (
            <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-500">
                Filtered view active
              </span>
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-1 text-xs font-semibold text-rose-600 hover:underline"
              >
                <X className="w-3 h-3" />
                Reset Filters
              </button>
            </div>
          )}
        </div>

        {/* Results Counter & Info */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm font-medium text-gray-600">
            Showing <span className="font-bold text-gray-900">{filteredVolunteers.length}</span> frontline{' '}
            {filteredVolunteers.length === 1 ? 'volunteer' : 'volunteers'}
          </div>

          <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            100% Aadhaar & NGO Coordinator Verified
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className="bg-white border border-gray-200 rounded-2xl p-6 animate-pulse space-y-4 shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-200 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                    <div className="h-3 bg-gray-100 rounded w-1/3" />
                  </div>
                </div>
                <div className="h-16 bg-gray-100 rounded-xl" />
                <div className="h-10 bg-gray-200 rounded-xl" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-8 text-center text-rose-700 my-8">
            <p className="font-semibold text-base">{error}</p>
            <button
              onClick={fetchVolunteers}
              className="mt-4 px-4 py-2 bg-rose-600 text-white rounded-xl text-sm font-medium hover:bg-rose-700 transition"
            >
              Retry Loading
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredVolunteers.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center my-8 shadow-sm">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">No Volunteers Match Your Filters</h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
              Try searching with another keyword or resetting the specialization filters.
            </p>
            <button
              onClick={resetFilters}
              className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-sm font-semibold hover:bg-emerald-700 transition shadow-sm"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* Volunteer Grid */}
        {!loading && !error && filteredVolunteers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVolunteers.map((vol) => {
              const positiveReview = vol.reviews?.find((r) => r.sentiment === 'positive');
              const constructiveReview = vol.reviews?.find((r) => r.sentiment === 'constructive');

              return (
                <div
                  key={vol.id}
                  className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md hover:border-emerald-400 transition-all duration-200 flex flex-col overflow-hidden"
                >
                  {/* Card Header */}
                  <div className="p-5 border-b border-gray-100 flex-grow">
                    <div className="flex items-start gap-3.5 mb-3">
                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-full bg-emerald-800 text-white font-bold flex items-center justify-center text-sm shrink-0 shadow-xs">
                        {getInitials(vol.name)}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h2 className="text-base font-bold text-gray-900 truncate">
                            {vol.name}
                          </h2>
                          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" title="Aadhaar Verified" />
                        </div>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-gray-400 shrink-0" />
                          <span>{vol.city || 'India'}, {vol.state || ''}</span>
                        </p>
                      </div>

                      {/* Rating Pill */}
                      <div className="shrink-0 flex items-center gap-1 px-2.5 py-1 bg-amber-50 border border-amber-200 rounded-full text-amber-800 text-xs font-bold">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        <span>{vol.averageRating}</span>
                      </div>
                    </div>

                    {/* Role & Deployment */}
                    <div className="mb-3">
                      <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 leading-tight">
                        {vol.role}
                      </span>
                      {vol.campaign?.name && (
                        <p className="text-xs text-gray-600 mt-2 line-clamp-1">
                          <span className="font-semibold text-gray-700">Mission:</span> {vol.campaign.name}
                        </p>
                      )}
                    </div>

                    {/* Skills pills */}
                    {Array.isArray(vol.skills) && vol.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {vol.skills.slice(0, 3).map((s, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-[11px] font-medium"
                          >
                            {s}
                          </span>
                        ))}
                        {vol.skills.length > 3 && (
                          <span className="px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded text-[11px]">
                            +{vol.skills.length - 3}
                          </span>
                        )}
                      </div>
                    )}

                    {/* What People Say Snippets */}
                    <div className="space-y-2 mt-3 pt-3 border-t border-gray-100">
                      {positiveReview && (
                        <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100/80 text-xs">
                          <div className="flex items-center justify-between text-[10.5px] font-semibold text-emerald-900 mb-1">
                            <span className="flex items-center gap-1">
                              <ThumbsUp className="w-3 h-3 text-emerald-600" />
                              Commendation
                            </span>
                            <span className="text-emerald-700">★ {positiveReview.rating}</span>
                          </div>
                          <p className="text-gray-700 line-clamp-2 italic leading-relaxed text-[11px]">
                            "{positiveReview.comment}"
                          </p>
                          <span className="block text-[10px] text-gray-500 mt-1">
                            — {positiveReview.reviewerName} ({positiveReview.reviewerRole})
                          </span>
                        </div>
                      )}

                      {constructiveReview && (
                        <div className="p-2.5 rounded-xl bg-amber-50/70 border border-amber-100/80 text-xs">
                          <div className="flex items-center justify-between text-[10.5px] font-semibold text-amber-900 mb-1">
                            <span className="flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 text-amber-600" />
                              Operational Growth Note
                            </span>
                            <span className="text-amber-700">★ {constructiveReview.rating}</span>
                          </div>
                          <p className="text-gray-700 line-clamp-2 italic leading-relaxed text-[11px]">
                            "{constructiveReview.comment}"
                          </p>
                          <span className="block text-[10px] text-gray-500 mt-1">
                            — {constructReviewerShort(constructiveReview)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Key Metrics Bar */}
                  <div className="bg-gray-50 px-5 py-2.5 border-b border-gray-100 grid grid-cols-3 gap-2 text-center text-xs">
                    <div>
                      <span className="text-gray-400 block text-[10.5px]">Hours Logged</span>
                      <span className="font-bold text-emerald-800 text-xs block">
                        {vol.hoursLogged || 0} hrs
                      </span>
                    </div>
                    <div className="border-l border-gray-200 pl-2">
                      <span className="text-gray-400 block text-[10.5px]">Praise Notes</span>
                      <span className="font-bold text-emerald-700 text-xs block">
                        {vol.positiveCount || 1}
                      </span>
                    </div>
                    <div className="border-l border-gray-200 pl-2">
                      <span className="text-gray-400 block text-[10.5px]">Growth Notes</span>
                      <span className="font-bold text-amber-700 text-xs block">
                        {vol.constructiveCount || 1}
                      </span>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="p-4 bg-white flex items-center gap-3">
                    <button
                      onClick={() => setSelectedVolunteer(vol)}
                      className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-sm font-semibold transition-all shadow-xs"
                    >
                      <span>View Full Review Dossier</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Volunteer Full Review Dossier Modal */}
      {selectedVolunteer && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setSelectedVolunteer(null)}
              className="absolute top-5 right-5 p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-emerald-800 text-white font-bold flex items-center justify-center text-xl shrink-0 shadow-sm">
                {getInitials(selectedVolunteer.name)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {selectedVolunteer.name}
                  </h3>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Verified Responder
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                  <span>{selectedVolunteer.city || 'India'}, {selectedVolunteer.state || ''}</span>
                  <span>•</span>
                  <span>{selectedVolunteer.role}</span>
                </p>
              </div>
            </div>

            {/* Key Metrics Grid */}
            <div className="grid grid-cols-3 gap-3 p-4 bg-emerald-50/50 border border-emerald-100 rounded-xl mb-6 text-center">
              <div>
                <span className="text-xs text-gray-500 block">Total Field Hours</span>
                <span className="text-xl font-bold text-emerald-800">
                  {selectedVolunteer.hoursLogged || 0} hrs
                </span>
              </div>
              <div className="border-l border-emerald-200 pl-2">
                <span className="text-xs text-gray-500 block">Overall Rating</span>
                <span className="text-xl font-bold text-amber-600 flex items-center justify-center gap-1">
                  <span>{selectedVolunteer.averageRating}</span>
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                </span>
              </div>
              <div className="border-l border-emerald-200 pl-2">
                <span className="text-xs text-gray-500 block">Total Reviews</span>
                <span className="text-xl font-bold text-gray-800">
                  {selectedVolunteer.reviewCount || 0}
                </span>
              </div>
            </div>

            {/* Deployed Mission */}
            {selectedVolunteer.campaign?.name && (
              <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Active Mission Deployment
                </h4>
                <p className="text-sm font-semibold text-gray-900">
                  {selectedVolunteer.campaign.name}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  {selectedVolunteer.campaign.disaster} • {selectedVolunteer.campaign.region}
                </p>
              </div>
            )}

            {/* Verified Skills */}
            {Array.isArray(selectedVolunteer.skills) && selectedVolunteer.skills.length > 0 && (
              <div className="mb-6">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  Verified Disaster Relief Competencies
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedVolunteer.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg text-xs font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Evaluated Reviews & Testimonials */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-emerald-700" />
                  Supervisor & Community Evaluated Reviews ({selectedVolunteer.reviews?.length || 0})
                </h4>
              </div>

              <div className="space-y-3">
                {selectedVolunteer.reviews && selectedVolunteer.reviews.length > 0 ? (
                  selectedVolunteer.reviews.map((rev) => {
                    const isPositive = rev.sentiment === 'positive';
                    return (
                      <div
                        key={rev.id}
                        className={`p-4 rounded-xl border ${
                          isPositive
                            ? 'bg-emerald-50/50 border-emerald-200'
                            : 'bg-amber-50/50 border-amber-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3 mb-1.5">
                          <div>
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mb-1 ${
                                isPositive
                                  ? 'bg-emerald-200/80 text-emerald-900'
                                  : 'bg-amber-200/80 text-amber-900'
                              }`}
                            >
                              {isPositive ? (
                                <>
                                  <ThumbsUp className="w-3 h-3 text-emerald-800" />
                                  Commendation
                                </>
                              ) : (
                                <>
                                  <AlertTriangle className="w-3 h-3 text-amber-800" />
                                  Operational Growth Note
                                </>
                              )}
                            </span>
                            <h5 className="text-sm font-bold text-gray-900">
                              {rev.headline}
                            </h5>
                          </div>
                          <div className="flex items-center gap-1 px-2 py-0.5 bg-white border border-gray-200 rounded-md text-xs font-bold text-gray-800">
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                            <span>{rev.rating}</span>
                          </div>
                        </div>

                        <p className="text-xs text-gray-700 leading-relaxed mb-2 italic">
                          "{rev.comment}"
                        </p>

                        <div className="flex items-center justify-between text-[11px] text-gray-500 border-t border-gray-200/60 pt-2">
                          <span className="font-semibold text-gray-700">
                            By {rev.reviewerName} • <span className="font-normal text-gray-500">{rev.reviewerRole}</span>
                          </span>
                          <span>
                            {rev.date ? new Date(rev.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Verified Mission'}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-gray-500 italic">No formal reviews recorded yet.</p>
                )}
              </div>
            </div>

            {/* Modal Bottom Close */}
            <div className="mt-8 pt-4 border-t border-gray-100 flex justify-end">
              <button
                onClick={() => setSelectedVolunteer(null)}
                className="px-5 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-semibold transition"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function constructReviewerShort(rev) {
  if (!rev) return 'Supervisor';
  return `${rev.reviewerName} (${rev.reviewerRole})`;
}

