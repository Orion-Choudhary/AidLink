import React from 'react';
import Skeleton from '../../../components/common/Skeleton';

/**
 * SupporterDashboardSkeleton
 * Shimmer skeleton UI matching the exact layout of the Supporter Dashboard Overview.
 */
export default function SupporterDashboardSkeleton() {
  return (
    <div className="w-full" aria-busy="true" aria-label="Loading Supporter Dashboard">
      
      {/* Header Greeting Skeleton */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <Skeleton width="260px" height="34px" rounded="rounded-md" className="mb-2" />
          <Skeleton width="420px" height="14px" rounded="rounded" className="max-w-full" />
        </div>
      </div>

      {/* Verification & Status Badges Strip Skeleton */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        <Skeleton width="145px" height="32px" rounded="rounded-md" />
        <Skeleton width="130px" height="32px" rounded="rounded-md" />
        <Skeleton width="125px" height="32px" rounded="rounded-md" />
        <Skeleton width="155px" height="32px" rounded="rounded-md" />
      </div>

      {/* Stat Ledger Strip Skeleton (3-Column border strip) */}
      <div className="flex flex-col sm:flex-row border-y border-slate-200/80 mb-10 divide-y sm:divide-y-0 sm:divide-x divide-slate-200/80 bg-white/50 rounded-lg">
        <div className="flex-1 px-6 py-5">
          <Skeleton width="60px" height="36px" rounded="rounded-md" className="mb-1.5" />
          <Skeleton width="130px" height="13px" rounded="rounded" />
        </div>
        <div className="flex-1 px-6 py-5">
          <Skeleton width="60px" height="36px" rounded="rounded-md" className="mb-1.5" />
          <Skeleton width="140px" height="13px" rounded="rounded" />
        </div>
        <div className="flex-1 px-6 py-5">
          <Skeleton width="90px" height="36px" rounded="rounded-md" className="mb-1.5" />
          <Skeleton width="100px" height="13px" rounded="rounded" />
        </div>
      </div>

      {/* Split Grid: Volunteer Commitments & Recent Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        
        {/* Left: Volunteer Commitments (3 cols) */}
        <section className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <Skeleton width="210px" height="20px" rounded="rounded" />
            <Skeleton width="50px" height="12px" rounded="rounded" />
          </div>

          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex gap-4 border-l-4 border-emerald-600 pl-4 py-3 bg-white/70 rounded-r-lg border-y border-r border-slate-200/70 shadow-xs"
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1.5">
                    <Skeleton width="60%" height="16px" rounded="rounded" />
                    <Skeleton width="75px" height="20px" rounded="rounded" />
                  </div>
                  <Skeleton width="40%" height="12px" rounded="rounded" className="mb-3" />
                  <div className="flex items-center gap-4">
                    <Skeleton width="85px" height="12px" rounded="rounded" />
                    <Skeleton width="95px" height="12px" rounded="rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Right: Recent Unified Feed (2 cols) */}
        <section className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <Skeleton width="150px" height="20px" rounded="rounded" />
            <Skeleton width="60px" height="12px" rounded="rounded" />
          </div>

          <div className="divide-y divide-slate-100 border border-slate-200/80 rounded-xl bg-white/80 overflow-hidden shadow-xs">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 space-y-2.5">
                <div className="flex items-center justify-between">
                  <Skeleton width="70px" height="18px" rounded="rounded-full" />
                  <Skeleton width="55px" height="11px" rounded="rounded" />
                </div>
                <Skeleton width="85%" height="15px" rounded="rounded" />
                <Skeleton width="100%" height="6px" rounded="rounded-full" className="my-2" />
                <div className="flex items-center justify-between pt-1">
                  <Skeleton width="90px" height="12px" rounded="rounded" />
                  <Skeleton width="80px" height="26px" rounded="rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>

    </div>
  );
}
