import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  MapPin,
  Building2,
  ShieldCheck,
  Award,
  Users,
  Calendar,
  ExternalLink,
  Mail,
  Layers,
  ArrowRight,
  X,
  Clock,
  TrendingUp,
  ChevronRight
} from 'lucide-react';
import usePageTitle from '../hooks/usePageTitle';

export default function NgoDirectoryPage() {
  usePageTitle('Verified NGO Directory');
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('ALL');
  const [selectedRegion, setSelectedRegion] = useState('ALL');
  const [sortBy, setSortBy] = useState('MOST_ACTIVE');

  // Modal state
  const [selectedNgo, setSelectedNgo] = useState(null);

  useEffect(() => {
    fetchNgos();
  }, []);

  const fetchNgos = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/ngos/directory');
      if (!res.ok) throw new Error('Failed to fetch NGO directory data');
      const data = await res.json();
      setNgos(data);
    } catch (err) {
      console.error('Error fetching NGO directory:', err);
      setError('Unable to load NGO directory at this time. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Derive unique sectors & regions across all NGOs
  const allSectors = useMemo(() => {
    const sectorsSet = new Set();
    ngos.forEach((ngo) => {
      if (Array.isArray(ngo.sectors)) {
        ngo.sectors.forEach((s) => sectorsSet.add(s));
      }
    });
    return Array.from(sectorsSet).sort();
  }, [ngos]);

  const allRegions = useMemo(() => {
    const regionsSet = new Set();
    ngos.forEach((ngo) => {
      if (ngo.hq) regionsSet.add(ngo.hq);
      if (Array.isArray(ngo.regions)) {
        ngo.regions.forEach((r) => regionsSet.add(r));
      }
    });
    return Array.from(regionsSet).sort();
  }, [ngos]);

  // Platform Aggregates
  const totalActiveMissions = useMemo(
    () => ngos.reduce((acc, ngo) => acc + (ngo.campaignsCount || 0), 0),
    [ngos]
  );
  const totalHouseholdsReached = useMemo(
    () => ngos.reduce((acc, ngo) => acc + (ngo.totalHouseholdsReached || 0), 0),
    [ngos]
  );

  // Filter and sort logic
  const filteredNgos = useMemo(() => {
    return ngos
      .filter((ngo) => {
        // Search filter
        const query = searchQuery.toLowerCase().trim();
        const matchesQuery =
          !query ||
          ngo.name?.toLowerCase().includes(query) ||
          ngo.shortName?.toLowerCase().includes(query) ||
          ngo.tagline?.toLowerCase().includes(query) ||
          ngo.darpanId?.toLowerCase().includes(query) ||
          ngo.hq?.toLowerCase().includes(query) ||
          ngo.sectors?.some((s) => s.toLowerCase().includes(query)) ||
          ngo.regions?.some((r) => r.toLowerCase().includes(query));

        // Sector filter
        const matchesSector =
          selectedSector === 'ALL' ||
          (Array.isArray(ngo.sectors) && ngo.sectors.includes(selectedSector));

        // Region filter
        const matchesRegion =
          selectedRegion === 'ALL' ||
          ngo.hq === selectedRegion ||
          (Array.isArray(ngo.regions) && ngo.regions.includes(selectedRegion));

        return matchesQuery && matchesSector && matchesRegion;
      })
      .sort((a, b) => {
        if (sortBy === 'MOST_ACTIVE') {
          return (b.campaignsCount || 0) - (a.campaignsCount || 0);
        }
        if (sortBy === 'MOST_IMPACT') {
          return (b.totalHouseholdsReached || 0) - (a.totalHouseholdsReached || 0);
        }
        if (sortBy === 'ALPHABETICAL') {
          return a.name.localeCompare(b.name);
        }
        if (sortBy === 'ESTABLISHED') {
          return (a.founded || 9999) - (b.founded || 9999);
        }
        return 0;
      });
  }, [ngos, searchQuery, selectedSector, selectedRegion, sortBy]);

  const hasActiveFilters =
    searchQuery.trim() !== '' || selectedSector !== 'ALL' || selectedRegion !== 'ALL';

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedSector('ALL');
    setSelectedRegion('ALL');
    setSortBy('MOST_ACTIVE');
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans flex flex-col pt-16">
      {/* Hero Section - White Background with Platform Green Accents */}
      <section className="bg-gradient-to-b from-green-50/80 via-white to-white border-b border-gray-100 py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 py-1 px-3.5 rounded-full bg-green-100 text-green-700 text-xs font-bold tracking-wider uppercase mb-4">
                <ShieldCheck className="w-4 h-4 text-green-600" />
                Vetted & Accredited Organizations
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight">
                Verified NGO Directory
              </h1>
              <p className="mt-3 text-base sm:text-lg text-gray-600 leading-relaxed">
                Discover registered non-profit partners powering verified disaster relief,
                emergency healthcare, and community rehabilitation missions across India.
              </p>
            </div>

            {/* Platform Quick Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white border border-green-100 p-4 rounded-2xl shadow-sm">
              <div className="text-center px-3 py-1">
                <div className="text-2xl font-extrabold text-green-600">{ngos.length}</div>
                <div className="text-xs text-gray-500 font-medium flex items-center justify-center gap-1 mt-1">
                  <Building2 className="w-3.5 h-3.5 text-green-600" />
                  Verified NGOs
                </div>
              </div>

              <div className="text-center px-3 py-1 border-l border-gray-100">
                <div className="text-2xl font-extrabold text-green-600">{totalActiveMissions}</div>
                <div className="text-xs text-gray-500 font-medium flex items-center justify-center gap-1 mt-1">
                  <TrendingUp className="w-3.5 h-3.5 text-green-600" />
                  Active Missions
                </div>
              </div>

              <div className="text-center px-3 py-1 border-l border-gray-100">
                <div className="text-2xl font-extrabold text-green-600">
                  {totalHouseholdsReached.toLocaleString('en-IN')}
                </div>
                <div className="text-xs text-gray-500 font-medium flex items-center justify-center gap-1 mt-1">
                  <Users className="w-3.5 h-3.5 text-green-600" />
                  Households Aided
                </div>
              </div>

              <div className="text-center px-3 py-1 border-l border-gray-100">
                <div className="text-2xl font-extrabold text-green-600">{allRegions.length}</div>
                <div className="text-xs text-gray-500 font-medium flex items-center justify-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-green-600" />
                  Active Hubs
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content & Discovery Area */}
      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10">
        {/* Streamlined Search & Filter Controls */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-5 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
            {/* Search Input */}
            <div className="md:col-span-6 relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by NGO name, DARPAN ID, mission keyword or city..."
                className="w-full pl-10 pr-10 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition text-gray-800"
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

            {/* Location / Region Dropdown */}
            <div className="md:col-span-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-4 w-4 text-gray-400" />
                </div>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full pl-9 pr-8 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition text-gray-700 font-medium"
                >
                  <option value="ALL">All Operational Regions</option>
                  {allRegions.map((region) => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="md:col-span-3">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition text-gray-700 font-medium"
              >
                <option value="MOST_ACTIVE">Sort: Most Active Missions</option>
                <option value="MOST_IMPACT">Sort: Highest Households Aided</option>
                <option value="ALPHABETICAL">Sort: Alphabetical (A-Z)</option>
                <option value="ESTABLISHED">Sort: Oldest Established</option>
              </select>
            </div>
          </div>

          {/* Sector / Cause Filter Pills */}
          <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider mr-1 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5 text-gray-400" />
              Focus Areas:
            </span>

            <button
              onClick={() => setSelectedSector('ALL')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                selectedSector === 'ALL'
                  ? 'bg-green-600 text-white shadow-sm font-semibold'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              All Sectors
            </button>

            {allSectors.map((sector) => (
              <button
                key={sector}
                onClick={() => setSelectedSector(sector)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  selectedSector === sector
                    ? 'bg-green-600 text-white shadow-sm font-semibold'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {sector}
              </button>
            ))}

            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="ml-auto inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
              >
                <X className="w-3.5 h-3.5" />
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Results Header & Counter */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm font-medium text-gray-600">
            Showing <span className="font-bold text-gray-900">{filteredNgos.length}</span> verified{' '}
            {filteredNgos.length === 1 ? 'organization' : 'organizations'}
            {selectedSector !== 'ALL' && (
              <span>
                {' '}
                in <span className="text-green-700 font-semibold">{selectedSector}</span>
              </span>
            )}
            {selectedRegion !== 'ALL' && (
              <span>
                {' '}
                located in <span className="text-green-700 font-semibold">{selectedRegion}</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-200">
            <ShieldCheck className="w-4 h-4 text-green-600" />
            100% NITI Aayog DARPAN Verified
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div
                key={n}
                className="bg-white border border-gray-200 rounded-2xl p-6 animate-pulse space-y-4 shadow-sm"
              >
                <div className="h-6 bg-gray-200 rounded w-2/3" />
                <div className="h-4 bg-gray-100 rounded w-1/3" />
                <div className="h-16 bg-gray-100 rounded" />
                <div className="h-10 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-8 text-center text-rose-700 my-8">
            <p className="font-semibold text-base">{error}</p>
            <button
              onClick={fetchNgos}
              className="mt-4 px-4 py-2 bg-rose-600 text-white rounded-xl text-sm font-medium hover:bg-rose-700 transition"
            >
              Retry Loading Directory
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredNgos.length === 0 && (
          <div className="bg-white border border-gray-200 rounded-2xl p-12 text-center my-8 shadow-sm">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">No NGOs Match Your Filters</h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
              Try adjusting your search keywords, sector focus areas, or regional filter to discover
              partner organizations.
            </p>
            <button
              onClick={resetFilters}
              className="px-5 py-2.5 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition shadow-sm"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* NGO Directory Grid */}
        {!loading && !error && filteredNgos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredNgos.map((ngo) => (
              <div
                key={ngo.id}
                className="bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md hover:border-green-400 transition-all duration-200 flex flex-col overflow-hidden"
              >
                {/* NGO Card Header */}
                <div className="p-6 border-b border-gray-100 flex-grow">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h2 className="text-xl font-bold text-gray-900 leading-snug">
                          {ngo.name}
                        </h2>
                        {ngo.shortName && (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-700 rounded text-xs font-semibold">
                            {ngo.shortName}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                        <span>HQ: {ngo.hq || 'India'}</span>
                        {ngo.founded && <span>• Est. {ngo.founded}</span>}
                      </p>
                    </div>

                    {/* Verified DARPAN Pill */}
                    <div className="flex-shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 border border-green-200 rounded-full text-green-700 text-xs font-semibold">
                      <ShieldCheck className="w-4 h-4 text-green-600" />
                      Verified
                    </div>
                  </div>

                  {/* Mission / Tagline */}
                  <p className="text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed">
                    {ngo.tagline ||
                      'Dedicated to rapid humanitarian logistics, emergency relief, and community welfare across India.'}
                  </p>

                  {/* Sector Tags */}
                  {Array.isArray(ngo.sectors) && ngo.sectors.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {ngo.sectors.slice(0, 4).map((s) => (
                        <span
                          key={s}
                          className="px-2.5 py-0.5 bg-green-50 text-green-700 border border-green-200 rounded-md text-xs font-medium"
                        >
                          {s}
                        </span>
                      ))}
                      {ngo.sectors.length > 4 && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">
                          +{ngo.sectors.length - 4} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Active Campaigns Teaser */}
                  {Array.isArray(ngo.activeCampaigns) && ngo.activeCampaigns.length > 0 && (
                    <div className="bg-gray-50 border border-gray-100 rounded-xl p-3 mb-2">
                      <div className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center justify-between">
                        <span className="flex items-center gap-1.5">
                          <TrendingUp className="w-3.5 h-3.5 text-green-600" />
                          Featured Relief Missions
                        </span>
                        <span className="text-green-700 font-semibold lowercase text-xs">
                          {ngo.campaignsCount} active
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        {ngo.activeCampaigns.slice(0, 2).map((camp) => (
                          <div
                            key={camp.id}
                            className="text-xs text-gray-700 flex items-center justify-between gap-2"
                          >
                            <span className="truncate font-medium">{camp.name}</span>
                            <span className="flex-shrink-0 text-gray-500 font-mono text-[11px]">
                              {camp.progress}% funded
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Key Metrics Bar */}
                <div className="bg-gray-50 px-6 py-3 border-b border-gray-100 grid grid-cols-3 gap-2 text-center text-xs">
                  <div>
                    <span className="text-gray-400 block text-[11px]">DARPAN ID</span>
                    <span className="font-mono font-semibold text-gray-800 text-[11px] truncate block">
                      {ngo.darpanId || 'Verified'}
                    </span>
                  </div>
                  <div className="border-l border-gray-200 pl-2">
                    <span className="text-gray-400 block text-[11px]">Households Aided</span>
                    <span className="font-bold text-green-700 text-xs">
                      {(ngo.totalHouseholdsReached || 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div className="border-l border-gray-200 pl-2">
                    <span className="text-gray-400 block text-[11px]">Workshops</span>
                    <span className="font-bold text-gray-800 text-xs">
                      {ngo.workshopsCount || 0} scheduled
                    </span>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-4 bg-white flex items-center gap-3">
                  <button
                    onClick={() => setSelectedNgo(ngo)}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-semibold transition-all shadow-sm"
                  >
                    <span>View Profile & Missions</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {ngo.email && (
                    <a
                      href={`mailto:${ngo.email}`}
                      title={`Email ${ngo.name}`}
                      className="p-2.5 text-gray-500 hover:text-green-600 hover:bg-green-50 border border-gray-200 rounded-xl transition"
                    >
                      <Mail className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Verified NGO Detail Modal */}
      {selectedNgo && (
        <NgoDirectoryDetailModal
          ngo={selectedNgo}
          onClose={() => setSelectedNgo(null)}
        />
      )}
    </div>
  );
}

// Modal for in-depth profile exploration - Clean White Theme
function NgoDirectoryDetailModal({ ngo, onClose }) {
  if (!ngo) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity"
      />

      {/* Modal Card */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden border border-gray-200 z-10 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-6 sm:p-8 bg-gradient-to-b from-green-50/80 via-white to-white border-b border-gray-100 text-gray-900 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 transition"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-100 border border-green-200 text-green-800 text-xs font-semibold">
              <ShieldCheck className="w-4 h-4 text-green-600" />
              Verified & Accredited Non-Profit
            </span>
            {ngo.founded && (
              <span className="text-xs text-gray-500 font-medium">Est. {ngo.founded}</span>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">{ngo.name}</h2>
          <p className="text-sm text-gray-600 mt-2 leading-relaxed">
            {ngo.tagline || 'Leading dedicated emergency response and social impact missions across India.'}
          </p>

          <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-100 text-xs text-gray-600 font-medium">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-green-600" />
              HQ: {ngo.hq || 'India'}
            </span>
            {ngo.darpanId && (
              <span className="flex items-center gap-1.5 font-mono">
                <Award className="w-4 h-4 text-green-600" />
                DARPAN: {ngo.darpanId}
              </span>
            )}
            {ngo.status80g && (
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-green-600" />
                {ngo.status80g}
              </span>
            )}
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {/* Key Accreditation & Legal Status */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-50 p-4 rounded-2xl border border-gray-200 text-xs">
            <div>
              <span className="text-gray-400 block font-medium">Legal Entity</span>
              <span className="font-semibold text-gray-800">{ngo.regType || 'Registered Trust'}</span>
            </div>
            <div>
              <span className="text-gray-400 block font-medium">FCRA Clearance</span>
              <span className="font-semibold text-gray-800">{ngo.fcra || 'Approved / In-Order'}</span>
            </div>
            <div>
              <span className="text-gray-400 block font-medium">PAN</span>
              <span className="font-semibold font-mono text-gray-800">{ngo.pan || 'Verified'}</span>
            </div>
            <div>
              <span className="text-gray-400 block font-medium">Total Reached</span>
              <span className="font-bold text-green-700">
                {(ngo.totalHouseholdsReached || 0).toLocaleString('en-IN')} Households
              </span>
            </div>
          </div>

          {/* Focus Areas */}
          {Array.isArray(ngo.sectors) && ngo.sectors.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-green-600" />
                Key Focus Areas & Causes
              </h4>
              <div className="flex flex-wrap gap-2">
                {ngo.sectors.map((s) => (
                  <span
                    key={s}
                    className="px-3 py-1 bg-green-50 text-green-800 border border-green-200 rounded-lg text-xs font-semibold"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Active Campaigns */}
          <div>
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-green-600" />
                Active Disaster Relief & Welfare Campaigns ({ngo.activeCampaigns?.length || 0})
              </span>
            </h4>

            {Array.isArray(ngo.activeCampaigns) && ngo.activeCampaigns.length > 0 ? (
              <div className="space-y-3">
                {ngo.activeCampaigns.map((camp) => (
                  <div
                    key={camp.id}
                    className="p-4 rounded-xl border border-gray-200 bg-white hover:border-green-400 transition shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h5 className="font-bold text-gray-900 text-sm">{camp.name}</h5>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" />
                          {camp.region}
                        </p>
                      </div>
                      {camp.isUrgent && (
                        <span className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded text-[11px] font-bold uppercase">
                          Urgent Mission
                        </span>
                      )}
                    </div>

                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Progress: {camp.progress}%</span>
                        <span className="font-semibold text-green-700">
                          {camp.householdsReached?.toLocaleString('en-IN')} / {camp.targetHouseholds?.toLocaleString('en-IN')} households
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-green-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(camp.progress || 0, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500 italic bg-gray-50 p-4 rounded-xl">
                No active relief campaigns at this exact moment.
              </p>
            )}
          </div>

          {/* Community Workshops */}
          {Array.isArray(ngo.workshops) && ngo.workshops.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-green-600" />
                Community Preparedness Workshops ({ngo.workshops.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ngo.workshops.map((w) => (
                  <div
                    key={w.id}
                    className="p-3.5 rounded-xl border border-gray-200 bg-gray-50 text-xs"
                  >
                    <h5 className="font-bold text-gray-900 mb-1">{w.title}</h5>
                    <p className="text-gray-500 flex items-center gap-1 mb-1">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      {w.date} • {w.time}
                    </p>
                    <p className="text-gray-500 flex items-center gap-1 mb-2">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      {w.location || w.city}
                    </p>
                    <div className="flex items-center justify-between pt-2 border-t border-gray-200 text-[11px]">
                      <span className="text-gray-500">
                        Capacity: {w.registeredCount || 0} / {w.targetCapacity || 50}
                      </span>
                      {w.formUrl ? (
                        <a
                          href={w.formUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-green-700 font-semibold hover:underline inline-flex items-center gap-1"
                        >
                          Register Link <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <span className="text-gray-400 italic">Registration on spot</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Team Leadership */}
          {Array.isArray(ngo.team) && ngo.team.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Users className="w-4 h-4 text-green-600" />
                Key Leadership & Coordinators
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {ngo.team.map((member, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50"
                  >
                    <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                      {member.name ? member.name.charAt(0) : 'U'}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 text-xs">{member.name}</div>
                      <div className="text-[11px] text-gray-500">{member.role}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-4">
          <div className="text-xs text-gray-500">
            Official Contact: <span className="font-semibold text-gray-800">{ngo.email}</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-xl transition"
            >
              Close
            </button>
            <Link
              to="/#campaigns"
              onClick={onClose}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-xl transition shadow-sm inline-flex items-center gap-1.5"
            >
              <span>Support Missions</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
