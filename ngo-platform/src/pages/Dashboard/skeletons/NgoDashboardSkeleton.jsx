import React from 'react';
import Skeleton, { SkeletonText } from '../../../components/common/Skeleton';

/**
 * NgoDashboardSkeleton
 * Shimmer skeleton UI matching the exact layout of the NGO Dashboard Overview.
 */
export default function NgoDashboardSkeleton() {
  return (
    <div className="w-full" aria-busy="true" aria-label="Loading NGO Dashboard">
      
      {/* Header Skeleton */}
      <div className="page-head" style={{ marginBottom: '22px' }}>
        <div>
          <Skeleton width="160px" height="28px" rounded="rounded" className="mb-2" />
          <Skeleton width="380px" height="14px" rounded="rounded" className="max-w-full" />
        </div>
        <Skeleton width="160px" height="34px" rounded="rounded-md" />
      </div>

      {/* 4 Stat Cards Row */}
      <div className="grid grid-4" style={{ marginBottom: '18px' }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="card card-pad" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <Skeleton width="110px" height="12px" rounded="rounded" className="mb-2" />
            <Skeleton width="65px" height="32px" rounded="rounded-md" className="my-1.5" />
            <Skeleton width="90px" height="10px" rounded="rounded" />
          </div>
        ))}
      </div>

      {/* Top Split Grid: Attention Items & Campaign Health */}
      <div className="grid grid-2" style={{ alignItems: 'start', marginBottom: '18px' }}>
        
        {/* Needs Attention Column */}
        <div className="card card-pad" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div className="section-title-row" style={{ marginBottom: '14px' }}>
            <Skeleton width="140px" height="16px" rounded="rounded" />
          </div>
          
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div 
                key={i} 
                className="flex items-center gap-3 p-2.5 rounded border border-slate-100"
                style={{ background: 'var(--surface-sunken)' }}
              >
                <Skeleton variant="circular" width="34px" height="34px" className="shrink-0" />
                <div className="flex-1 min-w-0">
                  <Skeleton width="75%" height="13px" rounded="rounded" className="mb-1" />
                  <Skeleton width="45%" height="11px" rounded="rounded" />
                </div>
                <Skeleton width="60px" height="26px" rounded="rounded" className="shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* Active Campaign Health Column */}
        <div className="card card-pad" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div className="section-title-row" style={{ marginBottom: '14px', display: 'flex', justifyContent: 'space-between' }}>
            <Skeleton width="150px" height="16px" rounded="rounded" />
            <Skeleton width="50px" height="12px" rounded="rounded" />
          </div>

          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="pb-3 border-b border-slate-100 last:border-b-0">
                <div className="flex justify-between items-center mb-2">
                  <Skeleton width="55%" height="14px" rounded="rounded" />
                  <Skeleton width="64px" height="20px" rounded="rounded-full" />
                </div>
                <div className="flex items-center gap-3 my-1.5">
                  <Skeleton width="100%" height="8px" rounded="rounded-full" />
                  <Skeleton width="30px" height="12px" rounded="rounded" />
                </div>
                <Skeleton width="80px" height="10px" rounded="rounded" className="mt-1" />
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Split Grid: Scheduled Activities & System Activity Timeline */}
      <div className="grid grid-2" style={{ alignItems: 'start' }}>
        
        {/* Scheduled Activities Column */}
        <div className="card card-pad" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div className="section-title-row" style={{ marginBottom: '14px', display: 'flex', justifyContent: 'space-between' }}>
            <Skeleton width="180px" height="16px" rounded="rounded" />
            <Skeleton width="50px" height="12px" rounded="rounded" />
          </div>

          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-slate-100 last:border-b-0">
                <div className="flex-1 pr-4">
                  <Skeleton width="60%" height="13px" rounded="rounded" className="mb-1" />
                  <Skeleton width="40%" height="11px" rounded="rounded" />
                </div>
                <Skeleton width="70px" height="12px" rounded="rounded" className="mr-3 shrink-0" />
                <Skeleton width="60px" height="20px" rounded="rounded-full" className="shrink-0" />
              </div>
            ))}
          </div>
        </div>

        {/* System Activity Timeline Column */}
        <div className="card card-pad" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div className="section-title-row" style={{ marginBottom: '14px', display: 'flex', justifyContent: 'space-between' }}>
            <Skeleton width="140px" height="16px" rounded="rounded" />
            <Skeleton width="75px" height="12px" rounded="rounded" />
          </div>

          <div className="space-y-3.5 pl-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton variant="circular" width="10px" height="10px" className="mt-1.5 shrink-0" />
                <div className="flex-1">
                  <Skeleton width="30%" height="10px" rounded="rounded" className="mb-1" />
                  <Skeleton width="70%" height="13px" rounded="rounded" className="mb-1" />
                  <Skeleton width="50%" height="11px" rounded="rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
