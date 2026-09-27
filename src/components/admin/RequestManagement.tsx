import React, { useState } from 'react';
import { BloodRequest, BloodGroup, EmergencyLevel, RequestStatus } from '../../types';
import { bloodBankService } from '../../services/bloodBankService';
import { BloodBadge, StatusIndicator } from '../common/BloodBadge';
import { Modal } from '../common/Modal';
import {
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  Eye,
  Filter,
  Package,
} from 'lucide-react';

interface RequestManagementProps {
  requests: BloodRequest[];
}

export const RequestManagement: React.FC<RequestManagementProps> = ({ requests }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGroup, setFilterGroup] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterEmergency, setFilterEmergency] = useState<string>('');
  const [selectedRequest, setSelectedRequest] = useState<BloodRequest | null>(null);
  const [rejectingRequest, setRejectingRequest] = useState<BloodRequest | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [actionAlert, setActionAlert] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const filteredRequests = requests.filter((r) => {
    const q = searchTerm.toLowerCase();
    const matchSearch =
      r.requestId.toLowerCase().includes(q) ||
      r.patientName.toLowerCase().includes(q) ||
      r.hospitalName.toLowerCase().includes(q) ||
      r.city.toLowerCase().includes(q) ||
      r.attendantName.toLowerCase().includes(q);
    const matchGroup = !filterGroup || r.bloodGroup === filterGroup;
    const matchStatus = !filterStatus || r.status === filterStatus;
    const matchEmergency = !filterEmergency || r.emergencyLevel === filterEmergency;
    return matchSearch && matchGroup && matchStatus && matchEmergency;
  });

  const handleUpdateStatus = (requestId: string, status: RequestStatus) => {
    setActionAlert(null);
    const res = bloodBankService.updateRequestStatus(requestId, status);
    setActionAlert({
      type: res.success ? 'success' : 'error',
      text: res.message,
    });
    setTimeout(() => setActionAlert(null), 5000);
  };

  const handleConfirmReject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingRequest) return;
    const res = bloodBankService.updateRequestStatus(
      rejectingRequest.requestId,
      'Rejected',
      rejectReason || 'Unavailable or clinical conflict.'
    );
    setRejectingRequest(null);
    setRejectReason('');
    setActionAlert({
      type: res.success ? 'success' : 'error',
      text: res.message,
    });
    setTimeout(() => setActionAlert(null), 5000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Clinical Blood Request Queue</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Review emergency trauma calls and verify clinical cross-matching with automatic inventory deduction
          </p>
        </div>
      </div>

      {actionAlert && (
        <div
          className={`p-3.5 rounded-xl border flex items-center gap-2 text-xs font-medium ${
            actionAlert.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          {actionAlert.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
          )}
          <span>{actionAlert.text}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div className="relative sm:col-span-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search request ID, patient, hospital..."
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
            />
          </div>

          <div>
            <select
              value={filterGroup}
              onChange={(e) => setFilterGroup(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-white"
            >
              <option value="">All Blood Groups</option>
              {bloodGroups.map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={filterEmergency}
              onChange={(e) => setFilterEmergency(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-white"
            >
              <option value="">All Emergency Levels</option>
              <option value="Normal">Normal</option>
              <option value="Urgent">Urgent</option>
              <option value="Critical">Critical Priority</option>
            </select>
          </div>

          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-white"
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Approved">Approved</option>
              <option value="Completed">Completed</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
          <span>Found <strong>{filteredRequests.length}</strong> matching blood requests</span>
          {(searchTerm || filterGroup || filterEmergency || filterStatus) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterGroup('');
                setFilterEmergency('');
                setFilterStatus('');
              }}
              className="text-rose-600 hover:underline cursor-pointer"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Request ID</th>
                <th className="py-3 px-4">Patient Name</th>
                <th className="py-3 px-4">Group</th>
                <th className="py-3 px-4">Units</th>
                <th className="py-3 px-4">Hospital & City</th>
                <th className="py-3 px-4">Required Date</th>
                <th className="py-3 px-4">Emergency</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Workflow Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredRequests.map((req) => (
                <tr key={req.requestId} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-rose-600 whitespace-nowrap">
                    {req.requestId}
                  </td>
                  <td className="py-3 px-4 text-slate-900 whitespace-nowrap">
                    <div className="font-semibold">{req.patientName}</div>
                    <div className="text-[10px] text-slate-400">{req.gender}, {req.patientAge}y</div>
                  </td>
                  <td className="py-3 px-4">
                    <BloodBadge group={req.bloodGroup} size="sm" />
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-800 tabular-nums">
                    {req.requiredUnits} Unit(s)
                  </td>
                  <td className="py-3 px-4 text-slate-700">
                    <div className="font-medium truncate max-w-[180px]">{req.hospitalName}</div>
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
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedRequest(req)}
                        className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                        title="View Full Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {req.status === 'Pending' && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(req.requestId, 'Approved')}
                            className="px-2.5 py-1 text-[11px] font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded transition-colors cursor-pointer flex items-center gap-1"
                            title="Approve Requisition & Deduct Stock"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => setRejectingRequest(req)}
                            className="px-2.5 py-1 text-[11px] font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded transition-colors cursor-pointer flex items-center gap-1"
                            title="Reject"
                          >
                            <XCircle className="w-3 h-3" />
                            <span>Reject</span>
                          </button>
                        </>
                      )}

                      {req.status === 'Approved' && (
                        <button
                          onClick={() => handleUpdateStatus(req.requestId, 'Completed')}
                          className="px-2 py-1 text-[11px] font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded transition-colors cursor-pointer"
                        >
                          Dispense
                        </button>
                      )}

                      {req.status === 'Completed' && (
                        <span className="text-[11px] text-emerald-600 font-semibold">Done</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {selectedRequest && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedRequest(null)}
          title={`Requisition Details: ${selectedRequest.requestId}`}
          subtitle={`Hospital: ${selectedRequest.hospitalName}`}
          maxWidth="max-w-lg"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Workflow State</span>
                <div className="mt-1">
                  <StatusIndicator status={selectedRequest.status} />
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Group & Units</span>
                <div className="mt-1 flex items-center gap-2 justify-end">
                  <BloodBadge group={selectedRequest.bloodGroup} size="sm" />
                  <span className="font-mono font-bold text-slate-800 text-sm">
                    {selectedRequest.requiredUnits} Unit(s)
                  </span>
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
                <span className="font-semibold text-slate-900">{selectedRequest.patientAge}y, {selectedRequest.gender}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Date Needed:</span>
                <span className="font-semibold text-slate-900">{selectedRequest.requiredDate}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Emergency Level:</span>
                <span className="font-semibold text-rose-600">{selectedRequest.emergencyLevel}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Attendant Name:</span>
                <span className="font-semibold text-slate-900">{selectedRequest.attendantName}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Attendant Mobile:</span>
                <span className="font-semibold text-slate-900">{selectedRequest.attendantMobile}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <span className="text-slate-400 block">Hospital Address:</span>
              <p className="text-slate-700 mt-0.5">{selectedRequest.hospitalAddress}, {selectedRequest.city}</p>
            </div>

            {selectedRequest.additionalInformation && (
              <div className="pt-2 border-t border-slate-100">
                <span className="text-slate-400 block">Clinical Diagnostic Notes:</span>
                <p className="text-slate-800 italic bg-slate-50 p-2 rounded border border-slate-200 mt-0.5">
                  "{selectedRequest.additionalInformation}"
                </p>
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 flex justify-between">
              {selectedRequest.status === 'Pending' ? (
                <button
                  onClick={() => {
                    handleUpdateStatus(selectedRequest.requestId, 'Approved');
                    setSelectedRequest(null);
                  }}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded font-semibold text-xs cursor-pointer"
                >
                  Approve Requisition
                </button>
              ) : <div />}
              <button
                onClick={() => setSelectedRequest(null)}
                className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded font-semibold text-xs cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Reject Reason Modal */}
      {rejectingRequest && (
        <Modal
          isOpen={true}
          onClose={() => setRejectingRequest(null)}
          title={`Reject Request ${rejectingRequest.requestId}`}
          subtitle={`Patient: ${rejectingRequest.patientName}`}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleConfirmReject} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Reason for Rejection (Recorded in clinical audit log)
              </label>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. Crossmatch incompatibility, blood units not cleared, alternate facility assigned."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                required
              />
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setRejectingRequest(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold cursor-pointer"
              >
                Confirm Rejection
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
