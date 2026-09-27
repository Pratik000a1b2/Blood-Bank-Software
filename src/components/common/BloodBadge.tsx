import React from 'react';
import { BloodGroup } from '../../types';

interface BloodBadgeProps {
  group: BloodGroup;
  size?: 'sm' | 'md' | 'lg';
}

export const BloodBadge: React.FC<BloodBadgeProps> = ({ group, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-7 h-7 text-xs font-bold',
    md: 'w-10 h-10 text-sm font-bold',
    lg: 'w-14 h-14 text-xl font-extrabold',
  };

  return (
    <div
      className={`inline-flex items-center justify-center rounded-lg bg-rose-50 text-rose-700 border border-rose-200/80 font-mono ${sizeClasses[size]}`}
      aria-label={`Blood group ${group}`}
    >
      {group}
    </div>
  );
};

export const StatusIndicator: React.FC<{
  status: 'Pending' | 'Approved' | 'Rejected' | 'Processing' | 'Completed' | 'Available' | 'Low Stock' | 'Not Available';
}> = ({ status }) => {
  const getStyle = () => {
    switch (status) {
      case 'Available':
      case 'Approved':
      case 'Completed':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'Pending':
      case 'Processing':
      case 'Low Stock':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'Rejected':
      case 'Not Available':
        return 'text-rose-700 bg-rose-50 border-rose-200';
      default:
        return 'text-slate-600 bg-slate-100 border-slate-200';
    }
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-md border ${getStyle()}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
};
