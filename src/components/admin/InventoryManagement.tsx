import React, { useState } from 'react';
import { BloodInventoryItem, BloodBank, BloodGroup } from '../../types';
import { bloodBankService } from '../../services/bloodBankService';
import { BloodBadge, StatusIndicator } from '../common/BloodBadge';
import { Modal } from '../common/Modal';
import { Package, PlusCircle, Trash2, Edit2, Search, AlertCircle, CheckCircle2 } from 'lucide-react';

interface InventoryManagementProps {
  inventory: BloodInventoryItem[];
  banks: BloodBank[];
}

export const InventoryManagement: React.FC<InventoryManagementProps> = ({
  inventory,
  banks,
}) => {
  const [filterBank, setFilterBank] = useState<string>('');
  const [filterGroup, setFilterGroup] = useState<string>('');
  const [editingItem, setEditingItem] = useState<BloodInventoryItem | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [newStock, setNewStock] = useState({
    bloodBankId: banks[0]?.bloodBankId || '',
    bloodGroup: 'O+' as BloodGroup,
    availableUnits: 10,
    reservedUnits: 0,
    expiryDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const filtered = inventory.filter((item) => {
    if (filterBank && item.bloodBankId !== filterBank) return false;
    if (filterGroup && item.bloodGroup !== filterGroup) return false;
    return true;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
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
    setIsAddOpen(false);
    setMsg({ type: 'success', text: res.message });
    setTimeout(() => setMsg(null), 3500);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    const res = bloodBankService.updateInventoryStock(editingItem.inventoryId, {
      availableUnits: editingItem.availableUnits,
      reservedUnits: editingItem.reservedUnits,
      expiryDate: editingItem.expiryDate,
    });
    setEditingItem(null);
    setMsg({ type: res.success ? 'success' : 'error', text: res.message });
    setTimeout(() => setMsg(null), 3500);
  };

  const handlePurgeExpired = () => {
    const res = bloodBankService.removeExpiredStock();
    setMsg({ type: res.count > 0 ? 'success' : 'error', text: res.message });
    setTimeout(() => setMsg(null), 3500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Blood Inventory Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor available units, reserved requisitions, batch expiration, and stock replenishments
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePurgeExpired}
            className="px-3 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Purge Expired</span>
          </button>
          <button
            onClick={() => setIsAddOpen(true)}
            className="px-3.5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Stock Units</span>
          </button>
        </div>
      </div>

      {msg && (
        <div
          className={`p-3.5 rounded-xl border flex items-center gap-2 text-xs font-medium ${
            msg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{msg.text}</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <select
            value={filterBank}
            onChange={(e) => setFilterBank(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-white"
          >
            <option value="">All Blood Banks</option>
            {banks.map((b) => (
              <option key={b.bloodBankId} value={b.bloodBankId}>
                {b.name} ({b.city})
              </option>
            ))}
          </select>

          <select
            value={filterGroup}
            onChange={(e) => setFilterGroup(e.target.value)}
            className="px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-white"
          >
            <option value="">All Blood Groups</option>
            {bloodGroups.map((bg) => (
              <option key={bg} value={bg}>
                {bg}
              </option>
            ))}
          </select>
        </div>

        <span className="text-xs text-slate-500">
          Showing <strong>{filtered.length}</strong> inventory records
        </span>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase text-[11px]">
              <tr>
                <th className="py-3 px-4">Group</th>
                <th className="py-3 px-4">Blood Bank Facility</th>
                <th className="py-3 px-4">Available Units</th>
                <th className="py-3 px-4">Reserved Units</th>
                <th className="py-3 px-4">Batch Expiry</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filtered.map((item) => {
                const isOut = item.availableUnits === 0;
                const isLow = item.availableUnits < 15 && item.availableUnits > 0;
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
                        Edit Units
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add Stock */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add Blood Stock"
        subtitle="Replenish facility reserves"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Blood Bank</label>
            <select
              value={newStock.bloodBankId}
              onChange={(e) => setNewStock({ ...newStock, bloodBankId: e.target.value })}
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
              onChange={(e) => setNewStock({ ...newStock, bloodGroup: e.target.value as BloodGroup })}
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
            <label className="block font-semibold text-slate-700 mb-1">Units (Positive Integer)</label>
            <input
              type="number"
              min={1}
              max={100}
              value={newStock.availableUnits}
              onChange={(e) => setNewStock({ ...newStock, availableUnits: Number(e.target.value) })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Expiry Date</label>
            <input
              type="date"
              value={newStock.expiryDate}
              onChange={(e) => setNewStock({ ...newStock, expiryDate: e.target.value })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              required
            />
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddOpen(false)}
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

      {/* Modal: Edit Item */}
      {editingItem && (
        <Modal
          isOpen={true}
          onClose={() => setEditingItem(null)}
          title={`Edit Stock - ${editingItem.bloodGroup}`}
          subtitle={editingItem.bloodBankName}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
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
              <label className="block font-semibold text-slate-700 mb-1">Reserved Units</label>
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
              <label className="block font-semibold text-slate-700 mb-1">Batch Expiry</label>
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
                Save
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
