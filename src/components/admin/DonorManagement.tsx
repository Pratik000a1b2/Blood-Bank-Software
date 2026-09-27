import React, { useState } from 'react';
import { Donor, BloodGroup } from '../../types';
import { bloodBankService } from '../../services/bloodBankService';
import { BloodBadge, StatusIndicator } from '../common/BloodBadge';
import { Modal } from '../common/Modal';
import {
  Search,
  CheckCircle2,
  XCircle,
  Trash2,
  Eye,
  Filter,
  UserCheck,
  AlertCircle,
  Calendar,
  Phone,
  MapPin,
} from 'lucide-react';

interface DonorManagementProps {
  donors: Donor[];
}

export const DonorManagement: React.FC<DonorManagementProps> = ({ donors }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGroup, setFilterGroup] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [selectedDonor, setSelectedDonor] = useState<Donor | null>(null);
  const [editingDonor, setEditingDonor] = useState<Donor | null>(null);
  const [alertMsg, setAlertMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const filteredDonors = donors.filter((d) => {
    const q = searchTerm.toLowerCase();
    const matchSearch =
      d.fullName.toLowerCase().includes(q) ||
      d.donorId.toLowerCase().includes(q) ||
      d.city.toLowerCase().includes(q) ||
      d.mobile.includes(q);
    const matchGroup = !filterGroup || d.bloodGroup === filterGroup;
    const matchStatus = !filterStatus || d.status === filterStatus;
    return matchSearch && matchGroup && matchStatus;
  });

  const handleStatusChange = (donorId: string, status: 'Approved' | 'Rejected') => {
    const res = bloodBankService.updateDonorStatus(donorId, status);
    setAlertMsg({ type: 'success', text: res.message });
    setTimeout(() => setAlertMsg(null), 3500);
  };

  const handleDelete = (donorId: string) => {
    if (confirm('Are you sure you want to remove this donor record from the system?')) {
      const res = bloodBankService.deleteDonor(donorId);
      setAlertMsg({ type: 'success', text: res.message });
      setTimeout(() => setAlertMsg(null), 3500);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Voluntary Donor Registry</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage donor verification, eligibility screening, and active donor pools
          </p>
        </div>
      </div>

      {alertMsg && (
        <div
          className={`p-3 rounded-lg border text-xs font-medium flex items-center gap-2 ${
            alertMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{alertMsg.text}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search donor name, ID, mobile, city..."
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
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-white"
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending Verification</option>
              <option value="Approved">Approved Donors</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
          <span>Found <strong>{filteredDonors.length}</strong> matching donors</span>
          {(searchTerm || filterGroup || filterStatus) && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterGroup('');
                setFilterStatus('');
              }}
              className="text-rose-600 hover:underline cursor-pointer"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Donors Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Donor ID</th>
                <th className="py-3 px-4">Full Name</th>
                <th className="py-3 px-4">Group</th>
                <th className="py-3 px-4">Age / Gender</th>
                <th className="py-3 px-4">Weight</th>
                <th className="py-3 px-4">Mobile</th>
                <th className="py-3 px-4">City</th>
                <th className="py-3 px-4">Last Donated</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredDonors.map((d) => (
                <tr key={d.donorId} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-slate-800 whitespace-nowrap">
                    {d.donorId}
                  </td>
                  <td className="py-3 px-4 text-slate-900 font-semibold whitespace-nowrap">
                    {d.fullName}
                  </td>
                  <td className="py-3 px-4">
                    <BloodBadge group={d.bloodGroup} size="sm" />
                  </td>
                  <td className="py-3 px-4 text-slate-700 whitespace-nowrap">
                    {d.age} yrs · {d.gender}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-700 tabular-nums">
                    {d.weight} kg
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-700 whitespace-nowrap">
                    {d.mobile}
                  </td>
                  <td className="py-3 px-4 text-slate-700 whitespace-nowrap">
                    {d.city}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap">
                    {d.lastDonationDate || 'First Time'}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <StatusIndicator status={d.status} />
                  </td>
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedDonor(d)}
                        className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                        title="View Full Profile"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      {d.status === 'Pending' ? (
                        <>
                          <button
                            onClick={() => handleStatusChange(d.donorId, 'Approved')}
                            className="px-2 py-0.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded transition-colors cursor-pointer"
                            title="Approve Donor"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusChange(d.donorId, 'Rejected')}
                            className="px-2 py-0.5 text-[11px] font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded transition-colors cursor-pointer"
                            title="Reject Donor"
                          >
                            Reject
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleStatusChange(d.donorId, d.status === 'Approved' ? 'Rejected' : 'Approved')}
                          className="text-[11px] text-slate-500 hover:text-slate-800 hover:underline cursor-pointer"
                        >
                          Change Status
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(d.donorId)}
                        className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                        title="Delete Donor"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Details Modal */}
      {selectedDonor && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedDonor(null)}
          title={`Donor Profile: ${selectedDonor.fullName}`}
          subtitle={`Donor ID: ${selectedDonor.donorId}`}
          maxWidth="max-w-md"
        >
          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Blood Group</span>
                <div className="mt-1">
                  <BloodBadge group={selectedDonor.bloodGroup} size="sm" />
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-semibold uppercase block">Verification Status</span>
                <div className="mt-1">
                  <StatusIndicator status={selectedDonor.status} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-slate-400 block">Age & Gender:</span>
                <span className="font-semibold text-slate-900">{selectedDonor.age} yrs, {selectedDonor.gender}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Weight:</span>
                <span className="font-semibold text-slate-900">{selectedDonor.weight} kg</span>
              </div>
              <div>
                <span className="text-slate-400 block">Contact Mobile:</span>
                <span className="font-semibold text-slate-900">{selectedDonor.mobile}</span>
              </div>
              <div>
                <span className="text-slate-400 block">City:</span>
                <span className="font-semibold text-slate-900">{selectedDonor.city}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Last Donation:</span>
                <span className="font-semibold text-slate-900">{selectedDonor.lastDonationDate || 'None recorded'}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Preferred Date:</span>
                <span className="font-semibold text-slate-900">{selectedDonor.preferredDonationDate}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <span className="text-slate-400 block">Residential Address:</span>
              <p className="text-slate-700 mt-0.5">{selectedDonor.address || 'Address on file'}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-between">
              <button
                onClick={() => handleStatusChange(selectedDonor.donorId, selectedDonor.status === 'Approved' ? 'Rejected' : 'Approved')}
                className="px-3 py-1.5 text-xs font-semibold rounded bg-slate-100 hover:bg-slate-200 text-slate-800 cursor-pointer"
              >
                Toggle {selectedDonor.status === 'Approved' ? 'Reject' : 'Approve'}
              </button>
              <button
                onClick={() => setSelectedDonor(null)}
                className="px-4 py-1.5 text-xs font-semibold rounded bg-slate-900 hover:bg-slate-800 text-white cursor-pointer"
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
