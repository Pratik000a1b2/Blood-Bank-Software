import React from 'react';
import {
  BloodAvailabilitySummary,
  BloodGroup,
  BloodRequest,
  DonationRecord,
  User,
} from '../../types';
import { BloodStockCards } from '../blood/BloodStockCards';
import { BloodBadge, StatusIndicator } from '../common/BloodBadge';
import {
  Search,
  Heart,
  Droplet,
  AlertCircle,
  Clock,
  BookOpen,
  Calendar,
  Building,
  CheckCircle2,
  ArrowRight,
  UserCheck,
} from 'lucide-react';

interface UserDashboardProps {
  currentUser: User;
  availability: BloodAvailabilitySummary[];
  userRequests: BloodRequest[];
  userDonations: DonationRecord[];
  onOpenSearch: (group?: BloodGroup) => void;
  onOpenDonate: () => void;
  onOpenRequest: (group?: BloodGroup, emergency?: boolean) => void;
  onOpenMyRequests: () => void;
  onOpenEducation: () => void;
  onOpenProfile: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  currentUser,
  availability,
  userRequests,
  userDonations,
  onOpenSearch,
  onOpenDonate,
  onOpenRequest,
  onOpenMyRequests,
  onOpenEducation,
  onOpenProfile,
}) => {
  const pendingRequests = userRequests.filter((r) => r.status === 'Pending' || r.status === 'Processing');
  const approvedRequests = userRequests.filter((r) => r.status === 'Approved');

  return (
    <div className="space-y-8">
      {/* Hero Welcome Banner with Quick Actions */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-rose-900 via-rose-800 to-slate-900 text-white p-6 sm:p-8 shadow-sm">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-200 border border-rose-400/30 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
            Active Regional Blood Network · 24/7 Dispatch
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
            Welcome, {currentUser.fullName}
          </h1>

          <p className="text-sm text-rose-100/90 max-w-xl leading-relaxed">
            Registered donor from <strong>{currentUser.city}</strong> with blood group{' '}
            <strong className="text-white bg-rose-700/80 px-2 py-0.5 rounded font-mono">{currentUser.bloodGroup || 'O+'}</strong>. Your contribution sustains emergency trauma care and clinical transfusions.
          </p>

          <div className="pt-3 flex flex-wrap items-center gap-3">
            <button
              onClick={() => onOpenRequest(undefined, true)}
              className="px-4 py-2.5 bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white font-semibold text-xs rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>Emergency Blood Request</span>
            </button>

            <button
              onClick={onOpenDonate}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 active:bg-white/30 text-white font-semibold text-xs rounded-xl border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Heart className="w-4 h-4 text-rose-300 fill-rose-300" />
              <span>Register to Donate</span>
            </button>

            <button
              onClick={() => onOpenSearch()}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 active:bg-white/30 text-white font-semibold text-xs rounded-xl border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Search className="w-4 h-4 text-slate-200" />
              <span>Search Stock</span>
            </button>
          </div>
        </div>
      </div>

      {/* 8 Blood Groups Availability Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Droplet className="w-5 h-5 text-rose-600 fill-rose-600" />
              Real-Time Blood Availability
            </h2>
            <p className="text-xs text-slate-500">
              Aggregated stock across accredited medical blood centres in your region
            </p>
          </div>
          <button
            onClick={() => onOpenSearch()}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
          >
            <span>View All Facilities</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <BloodStockCards
          availability={availability}
          onSelectGroup={(bg) => onOpenSearch(bg)}
        />
      </div>

      {/* Main 8 Feature Action Tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* 1. Search Blood */}
        <div
          onClick={() => onOpenSearch()}
          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-rose-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Search className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">1. Search Blood</h3>
          <p className="text-slate-500 text-xs mt-1">Check hospital blood stock availability by group & city</p>
        </div>

        {/* 2. Donate Blood */}
        <div
          onClick={onOpenDonate}
          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-rose-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Heart className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">2. Donate Blood</h3>
          <p className="text-slate-500 text-xs mt-1">Register for voluntary donation or book donation camp</p>
        </div>

        {/* 3. Request Blood */}
        <div
          onClick={() => onOpenRequest()}
          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-rose-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Droplet className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">3. Request Blood</h3>
          <p className="text-slate-500 text-xs mt-1">Submit patient requisition form for hospital transfusion</p>
        </div>

        {/* 4. Blood Availability */}
        <div
          onClick={() => onOpenSearch()}
          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-rose-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Building className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">4. Blood Banks</h3>
          <p className="text-slate-500 text-xs mt-1">Locate nearby blood banks, contact hours, and inventory</p>
        </div>

        {/* 5. Donation History */}
        <div
          onClick={onOpenProfile}
          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-rose-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">5. Donation History</h3>
          <p className="text-slate-500 text-xs mt-1">Review your past life-saving donations and certificates</p>
        </div>

        {/* 6. My Requests */}
        <div
          onClick={onOpenMyRequests}
          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-rose-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">6. My Requests</h3>
          <p className="text-slate-500 text-xs mt-1">Track request status: Pending, Approved, or Completed</p>
        </div>

        {/* 7. Emergency Blood Request */}
        <div
          onClick={() => onOpenRequest(undefined, true)}
          className="p-4 bg-rose-50/80 rounded-xl border border-rose-200 hover:border-rose-400 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-lg bg-rose-600 text-white flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-xs">
            <AlertCircle className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-rose-900 text-sm">7. Emergency Request</h3>
          <p className="text-rose-700 text-xs mt-1">High-priority ICU/accident trauma fast-track broadcast</p>
        </div>

        {/* 8. Blood Donation Information */}
        <div
          onClick={onOpenEducation}
          className="p-4 bg-white rounded-xl border border-slate-200 hover:border-rose-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">8. Donation Info</h3>
          <p className="text-slate-500 text-xs mt-1">Eligibility, health benefits, precautions & protocols</p>
        </div>
      </div>

      {/* Active Requests Tracker Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Recent Blood Requests */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-500" />
              <span>My Blood Requests</span>
              {userRequests.length > 0 && (
                <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-mono">
                  {userRequests.length}
                </span>
              )}
            </h3>
            <button
              onClick={onOpenMyRequests}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 cursor-pointer"
            >
              View Full History
            </button>
          </div>

          {userRequests.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No blood requests placed yet.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {userRequests.slice(0, 3).map((req) => (
                <div key={req.requestId} className="py-3 flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-slate-900">{req.requestId}</span>
                      <StatusIndicator status={req.status} />
                    </div>
                    <p className="text-xs text-slate-600">
                      Patient: <strong>{req.patientName}</strong> · {req.hospitalName}
                    </p>
                    <p className="text-[10px] text-slate-400 font-mono">
                      Needed: {req.requiredDate} · Priority: {req.emergencyLevel}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <BloodBadge group={req.bloodGroup} size="sm" />
                    <div className="text-[11px] font-mono text-slate-600 font-bold mt-1">
                      {req.requiredUnits} Unit{req.requiredUnits > 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Personal Donation History */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              <span>My Donation Records</span>
            </h3>
            <button
              onClick={onOpenDonate}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 cursor-pointer"
            >
              + Schedule Next
            </button>
          </div>

          {userDonations.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No recorded blood donations yet. You can register anytime!
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {userDonations.map((don) => (
                <div key={don.donationId} className="py-3 flex items-center justify-between gap-3">
                  <div className="space-y-0.5">
                    <div className="font-semibold text-xs text-slate-900">{don.bloodBankName}</div>
                    <p className="text-xs text-slate-500 flex items-center gap-1.5 font-mono">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {don.donationDate}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      {don.status} ({don.units} Unit)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
