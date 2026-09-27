import React, { useState } from 'react';
import {
  BloodBank,
  BloodGroup,
  BloodInventoryItem,
  BloodRequest,
  Donor,
  DonationRecord,
  User,
} from '../../types';
import { bloodBankService } from '../../services/bloodBankService';
import { BloodBadge, StatusIndicator } from '../common/BloodBadge';
import { Modal } from '../common/Modal';
import {
  Package,
  PlusCircle,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Trash2,
  Shield,
  Search,
  Droplet,
  Users,
  Activity,
} from 'lucide-react';

interface StaffDashboardProps {
  currentUser: User;
  inventory: BloodInventoryItem[];
  requests: BloodRequest[];
  donors: Donor[];
  banks: BloodBank[];
}

export const StaffDashboard: React.FC<StaffDashboardProps> = ({
  currentUser,
  inventory,
  requests,
  donors,
  banks,
}) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'requests' | 'donors'>('inventory');
  const [isAddStockOpen, setIsAddStockOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BloodInventoryItem | null>(null);
  const [rejectingRequest, setRejectingRequest] = useState<BloodRequest | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [actionMessage, setActionMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form state for adding stock
  const [newStock, setNewStock] = useState({
    bloodBankId: banks[0]?.bloodBankId || '',
    bloodGroup: 'O+' as BloodGroup,
    availableUnits: 10,
    reservedUnits: 0,
    expiryDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  // Key metrics
  const totalStockUnits = inventory.reduce((sum, i) => sum + i.availableUnits, 0);
  const pendingRequests = requests.filter((r) => r.status === 'Pending' || r.status === 'Processing');
  const criticalRequests = requests.filter((r) => r.emergencyLevel === 'Critical' && r.status === 'Pending');

  const handleApproveRequest = (requestId: string) => {
    setActionMessage(null);
    const res = bloodBankService.updateRequestStatus(requestId, 'Approved');
    if (res.success) {
      setActionMessage({ type: 'success', text: res.message });
    } else {
      setActionMessage({ type: 'error', text: res.message });
    }
    setTimeout(() => setActionMessage(null), 5000);
  };

  const handleRejectRequestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingRequest) return;
    const res = bloodBankService.updateRequestStatus(
      rejectingRequest.requestId,
      'Rejected',
      rejectReason || 'Unavailable or clinical mismatch.'
    );
    setRejectingRequest(null);
    setRejectReason('');
    if (res.success) {
      setActionMessage({ type: 'success', text: res.message });
    } else {
      setActionMessage({ type: 'error', text: res.message });
    }
    setTimeout(() => setActionMessage(null), 5000);
  };

  const handleRemoveExpired = () => {
    const res = bloodBankService.removeExpiredStock();
    setActionMessage({
      type: res.count > 0 ? 'success' : 'error',
      text: res.message,
    });
    setTimeout(() => setActionMessage(null), 4000);
  };

  const handleAddStockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const bank = banks.find((b) => b.bloodBankId === newStock.bloodBankId) || banks[0];
    const res = bloodBankService.addInventoryStock({
      bloodBankId: bank.bloodBankId,
      bloodBankName: bank.name,
      bloodGroup: newStock.bloodGroup,
      availableUnits: Number(newStock.availableUnits),
      reservedUnits: 0,
      expiryDate: newStock.expiryDate,
    });

    setIsAddStockOpen(false);
    setActionMessage({ type: 'success', text: res.message });
    setTimeout(() => setActionMessage(null), 4000);
  };

  const handleUpdateStockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    const res = bloodBankService.updateInventoryStock(editingItem.inventoryId, {
      availableUnits: editingItem.availableUnits,
      reservedUnits: editingItem.reservedUnits,
      expiryDate: editingItem.expiryDate,
    });
    setEditingItem(null);
    setActionMessage({ type: res.success ? 'success' : 'error', text: res.message });
    setTimeout(() => setActionMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header & Quick Metric Cards */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Shield className="w-5 h-5 text-rose-600" />
            Blood Bank Staff Operations Console
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Logged in as <strong>{currentUser.fullName}</strong> · Facility inventory & requisition management
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRemoveExpired}
            className="px-3 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Purge Expired Units</span>
          </button>

          <button
            onClick={() => setIsAddStockOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Stock Units</span>
          </button>
        </div>
      </div>

      {actionMessage && (
        <div
          className={`p-3.5 rounded-xl border flex items-center gap-2 text-xs ${
            actionMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          {actionMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          ) : (
            <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
          )}
          <span className="font-medium">{actionMessage.text}</span>
        </div>
      )}

      {/* Metric Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Available Stock</span>
            <div className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
              {totalStockUnits} <span className="text-xs font-normal text-slate-500">Units</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Package className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Pending Requisitions</span>
            <div className="text-2xl font-bold font-mono text-slate-900 mt-1 tabular-nums">
              {pendingRequests.length} <span className="text-xs font-normal text-slate-500">Queue</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Critical Emergency Calls</span>
            <div className="text-2xl font-bold font-mono text-rose-600 mt-1 tabular-nums">
              {criticalRequests.length} <span className="text-xs font-normal text-slate-500">Priority</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Segmented Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg max-w-md">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
            activeTab === 'inventory' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600'
          }`}
        >
          Blood Inventory ({inventory.length})
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
            activeTab === 'requests' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600'
          }`}
        >
          Requests Queue ({requests.length})
        </button>
        <button
          onClick={() => setActiveTab('donors')}
          className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
            activeTab === 'donors' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600'
          }`}
        >
          Donors ({donors.length})
        </button>
      </div>

      {/* 1. Inventory View */}
      {activeTab === 'inventory' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Blood Stock Inventory Table</h3>
            <span className="text-xs text-slate-400 font-mono">Real-time DB balance</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px]">
                <tr>
                  <th className="py-3 px-4">Group</th>
                  <th className="py-3 px-4">Facility Blood Bank</th>
                  <th className="py-3 px-4">Available Units</th>
                  <th className="py-3 px-4">Reserved Units</th>
                  <th className="py-3 px-4">Batch Expiry</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {inventory.map((item) => {
                  const isLow = item.availableUnits < 10;
                  const isOut = item.availableUnits === 0;
                  return (
                    <tr key={item.inventoryId} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <BloodBadge group={item.bloodGroup} size="sm" />
                      </td>
                      <td className="py-3 px-4 text-slate-900 font-semibold">
                        {item.bloodBankName}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900 text-sm tabular-nums">
                        {item.availableUnits}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500 tabular-nums">
                        {item.reservedUnits}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600 whitespace-nowrap">
                        {item.expiryDate}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <StatusIndicator status={isOut ? 'Not Available' : isLow ? 'Low Stock' : 'Available'} />
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          onClick={() => setEditingItem(item)}
                          className="px-2.5 py-1 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded text-xs transition-colors cursor-pointer"
                        >
                          Edit Stock
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. Requests View */}
      {activeTab === 'requests' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Blood Requests Verification Queue</h3>
            <span className="text-xs text-slate-400">Approval automatically checks stock and reserves units</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px]">
                <tr>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Patient</th>
                  <th className="py-3 px-4">Group</th>
                  <th className="py-3 px-4">Units</th>
                  <th className="py-3 px-4">Hospital & Attendant</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {requests.map((req) => (
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
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 tabular-nums">
                      {req.requiredUnits} Unit(s)
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      <div>{req.hospitalName} ({req.city})</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        Attendant: {req.attendantName} · {req.attendantMobile}
                      </div>
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
                      {req.status === 'Pending' || req.status === 'Processing' ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleApproveRequest(req.requestId)}
                            className="px-2.5 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded transition-colors cursor-pointer flex items-center gap-1"
                            title="Verify and Approve (Deducts stock)"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => setRejectingRequest(req)}
                            className="px-2.5 py-1 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded transition-colors cursor-pointer flex items-center gap-1"
                            title="Reject request"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </div>
                      ) : req.status === 'Approved' ? (
                        <button
                          onClick={() => bloodBankService.updateRequestStatus(req.requestId, 'Completed')}
                          className="px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded transition-colors cursor-pointer"
                        >
                          Mark Dispensed
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">Closed</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. Donors List View */}
      {activeTab === 'donors' && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">Registered Voluntary Donors</h3>
            <span className="text-xs text-slate-400">Total Donors in Registry: {donors.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px]">
                <tr>
                  <th className="py-3 px-4">Donor ID</th>
                  <th className="py-3 px-4">Name</th>
                  <th className="py-3 px-4">Blood Group</th>
                  <th className="py-3 px-4">Age / Weight</th>
                  <th className="py-3 px-4">Mobile</th>
                  <th className="py-3 px-4">City</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {donors.map((d) => (
                  <tr key={d.donorId} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                      {d.donorId}
                    </td>
                    <td className="py-3 px-4 text-slate-900 font-semibold">{d.fullName}</td>
                    <td className="py-3 px-4">
                      <BloodBadge group={d.bloodGroup} size="sm" />
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {d.age}y / {d.weight} kg
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700">{d.mobile}</td>
                    <td className="py-3 px-4 text-slate-700">{d.city}</td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <StatusIndicator status={d.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal: Add Stock */}
      <Modal
        isOpen={isAddStockOpen}
        onClose={() => setIsAddStockOpen(false)}
        title="Add Blood Stock to Facility Inventory"
        subtitle="Record tested and cleared units for available inventory"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleAddStockSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Blood Bank Facility</label>
            <select
              value={newStock.bloodBankId}
              onChange={(e) => setNewStock((prev) => ({ ...prev, bloodBankId: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-white"
            >
              {banks.map((b) => (
                <option key={b.bloodBankId} value={b.bloodBankId}>
                  {b.name} ({b.city})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Blood Group</label>
            <select
              value={newStock.bloodGroup}
              onChange={(e) => setNewStock((prev) => ({ ...prev, bloodGroup: e.target.value as BloodGroup }))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-white"
            >
              {bloodGroups.map((bg) => (
                <option key={bg} value={bg}>
                  {bg}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Units to Add (Positive Integer)</label>
            <input
              type="number"
              min={1}
              max={100}
              value={newStock.availableUnits}
              onChange={(e) => setNewStock((prev) => ({ ...prev, availableUnits: Number(e.target.value) }))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Batch Expiry Date (typically 35–42 days)</label>
            <input
              type="date"
              value={newStock.expiryDate}
              onChange={(e) => setNewStock((prev) => ({ ...prev, expiryDate: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              required
            />
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddStockOpen(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold cursor-pointer"
            >
              Add Stock
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Edit Inventory */}
      {editingItem && (
        <Modal
          isOpen={true}
          onClose={() => setEditingItem(null)}
          title={`Edit Stock - ${editingItem.bloodGroup}`}
          subtitle={`${editingItem.bloodBankName}`}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleUpdateStockSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Available Units</label>
              <input
                type="number"
                min={0}
                value={editingItem.availableUnits}
                onChange={(e) =>
                  setEditingItem({
                    ...editingItem,
                    availableUnits: Math.max(0, Number(e.target.value)),
                  })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Reserved Units (Allocated to approved requests)</label>
              <input
                type="number"
                min={0}
                value={editingItem.reservedUnits}
                onChange={(e) =>
                  setEditingItem({
                    ...editingItem,
                    reservedUnits: Math.max(0, Number(e.target.value)),
                  })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Expiry Date</label>
              <input
                type="date"
                value={editingItem.expiryDate}
                onChange={(e) =>
                  setEditingItem({
                    ...editingItem,
                    expiryDate: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                required
              />
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal: Reject Request Reason */}
      {rejectingRequest && (
        <Modal
          isOpen={true}
          onClose={() => setRejectingRequest(null)}
          title={`Reject Requisition ${rejectingRequest.requestId}`}
          subtitle={`Patient: ${rejectingRequest.patientName} (${rejectingRequest.bloodGroup})`}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleRejectRequestSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Reason for Rejection (Will be notified to the attendant)
              </label>
              <textarea
                rows={3}
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="e.g. Crossmatch incompatibility, hospital requested alternate arrangement, duplicate requisition."
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
