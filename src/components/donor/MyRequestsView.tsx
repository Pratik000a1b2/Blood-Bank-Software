import React, { useState } from 'react';
import { BloodRequest, User } from '../../types';
import { BloodBadge, StatusIndicator } from '../common/BloodBadge';
import { Modal } from '../common/Modal';
import { Search, Eye, Calendar, Building, Phone, AlertCircle, Clock, ShieldCheck } from 'lucide-react';

interface MyRequestsViewProps {
  requests: BloodRequest[];
  currentUser: User;
  onOpenNewRequest: () => void;
}

export const MyRequestsView: React.FC<MyRequestsViewProps> = ({
  requests,
  currentUser,
  onOpenNewRequest,
}) => {
  const [search, setSearch] = useState('');
  const [selectedRequest, setSelectedRequest] = useState<BloodRequest | null>(null);

  // User's own requests
  const userRequests = requests.filter((r) => r.userId === currentUser.id);

  const filtered = userRequests.filter((r) => {
    const q = search.toLowerCase();
    return (
      r.requestId.toLowerCase().includes(q) ||
      r.patientName.toLowerCase().includes(q) ||
      r.bloodGroup.toLowerCase().includes(q) ||
      r.hospitalName.toLowerCase().includes(q) ||
      r.status.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Blood Request Tracking</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor the status, verification, and allocation of your clinical blood requisitions
          </p>
        </div>

        <button
          onClick={onOpenNewRequest}
          className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-lg shadow-sm transition-colors cursor-pointer whitespace-nowrap self-start sm:self-auto"
        >
          + Create Blood Request
        </button>
      </div>

      {/* Filter / Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by Request ID (e.g. BBR-2026), Patient, Blood Group, Hospital or Status..."
          className="w-full pl-9 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
        />
      </div>

      {/* Requests Table / Cards */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400 mb-3">
            <Clock className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-semibold text-slate-800">No Blood Requests Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {search ? 'No requests match your search criteria.' : "You haven't submitted any blood requests yet."}
          </p>
          {!search && (
            <button
              onClick={onOpenNewRequest}
              className="mt-4 px-4 py-2 text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
            >
              Request Blood Now
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Request ID</th>
                  <th className="py-3 px-4">Patient Name</th>
                  <th className="py-3 px-4">Blood Group</th>
                  <th className="py-3 px-4">Units</th>
                  <th className="py-3 px-4">Hospital & City</th>
                  <th className="py-3 px-4">Date Needed</th>
                  <th className="py-3 px-4">Emergency</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filtered.map((req) => (
                  <tr key={req.requestId} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-rose-600 whitespace-nowrap">
                      {req.requestId}
                    </td>
                    <td className="py-3 px-4 text-slate-900 whitespace-nowrap">
                      <div className="font-semibold">{req.patientName}</div>
                      <div className="text-[10px] text-slate-400">
                        {req.gender}, {req.patientAge} yrs
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <BloodBadge group={req.bloodGroup} size="sm" />
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-800 tabular-nums">
                      {req.requiredUnits} Unit{req.requiredUnits > 1 ? 's' : ''}
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      <div className="truncate max-w-[180px] font-medium">{req.hospitalName}</div>
                      <div className="text-[11px] text-slate-400">{req.city}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600 whitespace-nowrap">
                      {req.requiredDate}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-sm ${
                          req.emergencyLevel === 'Critical'
                            ? 'text-rose-700 bg-rose-50 border border-rose-200'
                            : req.emergencyLevel === 'Urgent'
                            ? 'text-amber-700 bg-amber-50 border border-amber-200'
                            : 'text-slate-700 bg-slate-100'
                        }`}
                      >
                        {req.emergencyLevel}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <StatusIndicator status={req.status} />
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => setSelectedRequest(req)}
                        className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded text-xs transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {selectedRequest && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedRequest(null)}
          title={`Request Details - ${selectedRequest.requestId}`}
          subtitle="Real-time clinical review and blood bank dispatch record"
          maxWidth="max-w-lg"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase text-slate-400 font-semibold block">Status</span>
                <div className="mt-1">
                  <StatusIndicator status={selectedRequest.status} />
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase text-slate-400 font-semibold block">Blood Group</span>
                <div className="mt-1">
                  <BloodBadge group={selectedRequest.bloodGroup} size="sm" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-slate-400 block">Patient Name:</span>
                <span className="font-semibold text-slate-900">{selectedRequest.patientName}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Age & Gender:</span>
                <span className="font-semibold text-slate-900">
                  {selectedRequest.patientAge} years, {selectedRequest.gender}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Required Units:</span>
                <span className="font-semibold text-slate-900">{selectedRequest.requiredUnits} Unit(s)</span>
              </div>
              <div>
                <span className="text-slate-400 block">Required Date:</span>
                <span className="font-semibold text-slate-900">{selectedRequest.requiredDate}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div>
                <span className="text-slate-400 block">Hospital:</span>
                <span className="font-semibold text-slate-900">{selectedRequest.hospitalName}</span>
                {selectedRequest.hospitalAddress && (
                  <p className="text-[11px] text-slate-500 mt-0.5">{selectedRequest.hospitalAddress}, {selectedRequest.city}</p>
                )}
              </div>
              <div>
                <span className="text-slate-400 block">Attendant Contact:</span>
                <span className="font-semibold text-slate-900">
                  {selectedRequest.attendantName} · {selectedRequest.attendantMobile}
                </span>
              </div>
              {selectedRequest.bloodBankName && (
                <div>
                  <span className="text-slate-400 block">Assigned Blood Bank:</span>
                  <span className="font-semibold text-rose-700">{selectedRequest.bloodBankName}</span>
                </div>
              )}
              {selectedRequest.additionalInformation && (
                <div>
                  <span className="text-slate-400 block">Clinical Information:</span>
                  <p className="text-slate-700 italic bg-slate-50 p-2 rounded border border-slate-200 mt-0.5">
                    "{selectedRequest.additionalInformation}"
                  </p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedRequest(null)}
                className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
