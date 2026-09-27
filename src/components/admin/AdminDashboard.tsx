import React from 'react';
import {
  BloodAvailabilitySummary,
  BloodBank,
  BloodGroup,
  BloodInventoryItem,
  BloodRequest,
  Donor,
  User,
} from '../../types';
import { BloodBadge, StatusIndicator } from '../common/BloodBadge';
import {
  Users,
  Heart,
  Droplet,
  Clock,
  CheckCircle2,
  Building2,
  Package,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  FileText,
  Shield,
  Activity,
} from 'lucide-react';

interface AdminDashboardProps {
  stats: {
    totalUsers: number;
    totalDonors: number;
    totalRequests: number;
    pendingRequests: number;
    completedRequests: number;
    approvedRequests: number;
    totalBloodUnits: number;
    availableBanks: number;
  };
  availability: BloodAvailabilitySummary[];
  recentRequests: BloodRequest[];
  recentDonors: Donor[];
  onNavigateTab: (tab: string) => void;
  onOpenApproveRequest: (requestId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  stats,
  availability,
  recentRequests,
  recentDonors,
  onNavigateTab,
  onOpenApproveRequest,
}) => {
  // Max units for chart scaling
  const maxUnits = Math.max(...availability.map((a) => a.totalUnits), 40);

  return (
    <div className="space-y-8">
      {/* Admin Title & Quick Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Shield className="w-6 h-6 text-rose-600" />
            Executive Administration Dashboard
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            System-wide oversight of blood inventory, hospital requisitions, donor registries, and facility network
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('admin-reports')}
            className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>Generate Reports</span>
          </button>

          <button
            onClick={() => onNavigateTab('admin-requests')}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Review Pending ({stats.pendingRequests})</span>
          </button>
        </div>
      </div>

      {/* 7 Key Admin Statistics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {/* 1. Total Users */}
        <div
          onClick={() => onNavigateTab('admin-donors')}
          className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Users</span>
            <Users className="w-3.5 h-3.5 text-blue-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {stats.totalUsers}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Registered accounts</div>
        </div>

        {/* 2. Total Donors */}
        <div
          onClick={() => onNavigateTab('admin-donors')}
          className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Donors</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {stats.totalDonors}
          </div>
          <div className="text-[10px] text-emerald-600 mt-0.5">Active voluntary pool</div>
        </div>

        {/* 3. Total Blood Requests */}
        <div
          onClick={() => onNavigateTab('admin-requests')}
          className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Total Requests</span>
            <Droplet className="w-3.5 h-3.5 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {stats.totalRequests}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Clinical requisitions</div>
        </div>

        {/* 4. Pending Requests */}
        <div
          onClick={() => onNavigateTab('admin-requests')}
          className="bg-white p-3.5 rounded-xl border border-amber-200 bg-amber-50/20 shadow-xs hover:border-amber-400 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-amber-700 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Pending</span>
            <Clock className="w-3.5 h-3.5" />
          </div>
          <div className="text-2xl font-bold font-mono text-amber-800 tabular-nums">
            {stats.pendingRequests}
          </div>
          <div className="text-[10px] text-amber-700 mt-0.5">Awaiting staff action</div>
        </div>

        {/* 5. Completed Requests */}
        <div
          onClick={() => onNavigateTab('admin-requests')}
          className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Completed</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {stats.completedRequests}
          </div>
          <div className="text-[10px] text-emerald-600 mt-0.5">Fulfilled & dispensed</div>
        </div>

        {/* 6. Total Blood Units */}
        <div
          onClick={() => onNavigateTab('admin-inventory')}
          className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Stock Units</span>
            <Package className="w-3.5 h-3.5 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {stats.totalBloodUnits}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Across all facilities</div>
        </div>

        {/* 7. Available Blood Banks */}
        <div
          onClick={() => onNavigateTab('admin-banks')}
          className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-colors cursor-pointer"
        >
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider">Facilities</span>
            <Building2 className="w-3.5 h-3.5 text-slate-700" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-900 tabular-nums">
            {stats.availableBanks}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Accredited blood banks</div>
        </div>
      </div>

      {/* Blood Stock Chart (Visual Interactive Bar Distribution) */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-rose-600" />
              <span>Blood Group Stock Distribution Chart</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Available live units categorized by ABO and Rh factor
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('admin-inventory')}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 cursor-pointer"
          >
            Manage Inventory
          </button>
        </div>

        {/* Bar Visualizer */}
        <div className="pt-2">
          <div className="grid grid-cols-8 gap-2 sm:gap-4 items-end h-44 border-b border-slate-200 pb-2">
            {availability.map((item) => {
              const heightPct = Math.round((item.totalUnits / maxUnits) * 100);
              const isLow = item.totalUnits < 15;
              const isOut = item.totalUnits === 0;

              return (
                <div key={item.bloodGroup} className="flex flex-col items-center h-full justify-end group">
                  <div className="text-[11px] font-mono font-bold text-slate-700 mb-1 tabular-nums">
                    {item.totalUnits}
                  </div>
                  <div className="w-full max-w-[42px] bg-slate-100 rounded-t-md overflow-hidden flex items-end h-full">
                    <div
                      style={{ height: `${Math.max(6, heightPct)}%` }}
                      className={`w-full rounded-t-md transition-all duration-500 ${
                        isOut
                          ? 'bg-slate-300'
                          : isLow
                          ? 'bg-amber-500 group-hover:bg-amber-600'
                          : 'bg-rose-600 group-hover:bg-rose-700'
                      }`}
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-900 mt-2 font-mono">
                    {item.bloodGroup}
                  </span>
                  <span
                    className={`text-[9px] font-semibold mt-0.5 ${
                      isOut ? 'text-slate-400' : isLow ? 'text-amber-600' : 'text-emerald-600'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 font-mono">
            <span>Critical Reserve Threshold: &lt; 15 units</span>
            <span>Total Stock Monitored: {stats.totalBloodUnits} Units</span>
          </div>
        </div>
      </div>

      {/* Two Column Section: Recent Requests & Recent Donors */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Blood Requests */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-600" />
              <span>Recent Blood Requests</span>
            </h3>
            <button
              onClick={() => onNavigateTab('admin-requests')}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 cursor-pointer"
            >
              View All ({stats.totalRequests})
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {recentRequests.slice(0, 4).map((req) => (
              <div key={req.requestId} className="py-3 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-rose-600">{req.requestId}</span>
                    <StatusIndicator status={req.status} />
                    {req.emergencyLevel === 'Critical' && (
                      <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded">
                        Critical
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-800 font-medium">
                    {req.patientName} ({req.patientAge}y) · {req.hospitalName}
                  </p>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Needed: {req.requiredDate} · Attendant: {req.attendantMobile}
                  </p>
                </div>

                <div className="text-right shrink-0 space-y-1">
                  <BloodBadge group={req.bloodGroup} size="sm" />
                  <div className="text-[11px] font-mono font-bold text-slate-700">
                    {req.requiredUnits} Units
                  </div>
                  {req.status === 'Pending' && (
                    <button
                      onClick={() => onOpenApproveRequest(req.requestId)}
                      className="text-[11px] font-semibold text-emerald-600 hover:text-emerald-700 block cursor-pointer"
                    >
                      Approve
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Donors Registered */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              <span>Recent Voluntary Donors</span>
            </h3>
            <button
              onClick={() => onNavigateTab('admin-donors')}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 cursor-pointer"
            >
              Manage Donors ({stats.totalDonors})
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {recentDonors.slice(0, 4).map((d) => (
              <div key={d.donorId} className="py-3 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-800">{d.donorId}</span>
                    <StatusIndicator status={d.status} />
                  </div>
                  <p className="text-xs text-slate-800 font-semibold">{d.fullName}</p>
                  <p className="text-[11px] text-slate-400">
                    {d.city} · Age {d.age}y · Weight {d.weight}kg · {d.mobile}
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <BloodBadge group={d.bloodGroup} size="sm" />
                  <div className="text-[10px] text-slate-400 mt-1 font-mono">
                    Pref: {d.preferredDonationDate}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
