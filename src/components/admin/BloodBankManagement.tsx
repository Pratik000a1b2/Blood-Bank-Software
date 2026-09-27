import React, { useState } from 'react';
import { BloodBank } from '../../types';
import { bloodBankService } from '../../services/bloodBankService';
import { Modal } from '../common/Modal';
import {
  Building2,
  PlusCircle,
  Edit2,
  Trash2,
  Eye,
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface BloodBankManagementProps {
  banks: BloodBank[];
}

export const BloodBankManagement: React.FC<BloodBankManagementProps> = ({ banks }) => {
  const [selectedBank, setSelectedBank] = useState<BloodBank | null>(null);
  const [editingBank, setEditingBank] = useState<BloodBank | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [alertMsg, setAlertMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form state for adding
  const [formData, setFormData] = useState({
    name: '',
    registrationNumber: '',
    contactNumber: '',
    email: '',
    address: '',
    city: 'Akola',
    state: 'Maharashtra',
    pincode: '444001',
    openingTime: '08:00 AM',
    closingTime: '08:00 PM',
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.registrationNumber.trim() || !formData.city.trim()) {
      setAlertMsg({ type: 'error', text: 'Name, registration number, and city are required.' });
      return;
    }

    const res = bloodBankService.addBloodBank(formData);
    setIsAddModalOpen(false);
    setFormData({
      name: '',
      registrationNumber: '',
      contactNumber: '',
      email: '',
      address: '',
      city: 'Akola',
      state: 'Maharashtra',
      pincode: '444001',
      openingTime: '08:00 AM',
      closingTime: '08:00 PM',
    });
    setAlertMsg({ type: 'success', text: res.message });
    setTimeout(() => setAlertMsg(null), 3500);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBank) return;
    const res = bloodBankService.updateBloodBank(editingBank.bloodBankId, editingBank);
    setEditingBank(null);
    setAlertMsg({ type: res.success ? 'success' : 'error', text: res.message });
    setTimeout(() => setAlertMsg(null), 3500);
  };

  const handleDelete = (bankId: string) => {
    if (confirm('Are you sure you want to remove this blood bank facility? Associated inventory records will also be updated.')) {
      const res = bloodBankService.deleteBloodBank(bankId);
      setAlertMsg({ type: 'success', text: res.message });
      setTimeout(() => setAlertMsg(null), 3500);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Blood Bank Facilities Management</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Maintain accreditation records, facility licenses, regional centers, and operating schedules
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-3.5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-lg shadow-sm transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Add New Blood Bank</span>
        </button>
      </div>

      {alertMsg && (
        <div
          className={`p-3.5 rounded-xl border flex items-center gap-2 text-xs font-medium ${
            alertMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{alertMsg.text}</span>
        </div>
      )}

      {/* Facilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {banks.map((bank) => (
          <div
            key={bank.bloodBankId}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{bank.name}</h3>
                    <span className="text-[11px] font-mono text-slate-400">Reg: {bank.registrationNumber}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setSelectedBank(bank)}
                    className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                    title="View Details"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setEditingBank(bank)}
                    className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                    title="Edit Facility"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(bank.bloodBankId)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                    title="Delete Facility"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
                <p className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{bank.address}, {bank.city}, {bank.state} - {bank.pincode}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{bank.contactNumber}</span>
                </p>
                <p className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{bank.email}</span>
                </p>
                <p className="flex items-center gap-2 font-mono text-[11px] text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Hours: {bank.openingTime} - {bank.closingTime}</span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Add New Blood Bank */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register New Blood Bank Facility"
        subtitle="Add an accredited blood bank center to the management network"
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Blood Bank Facility Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. LifeLine Regional Blood Centre"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Government License / Reg. No. *</label>
              <input
                type="text"
                value={formData.registrationNumber}
                onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                placeholder="e.g. MH-BB-2026-9901"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Contact Phone *</label>
              <input
                type="text"
                value={formData.contactNumber}
                onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                placeholder="+91 724 243 5590"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Official Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="bloodbank@domain.org"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Address *</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Street name, landmark, hospital campus"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">City *</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="Akola"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">State *</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="Maharashtra"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Pincode *</label>
              <input
                type="text"
                value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                placeholder="444001"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Opening Time</label>
              <input
                type="text"
                value={formData.openingTime}
                onChange={(e) => setFormData({ ...formData, openingTime: e.target.value })}
                placeholder="08:00 AM"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Closing Time</label>
              <input
                type="text"
                value={formData.closingTime}
                onChange={(e) => setFormData({ ...formData, closingTime: e.target.value })}
                placeholder="08:00 PM (24x7 Emergency)"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-semibold cursor-pointer"
            >
              Register Facility
            </button>
          </div>
        </form>
      </Modal>

      {/* Modal: Edit Blood Bank */}
      {editingBank && (
        <Modal
          isOpen={true}
          onClose={() => setEditingBank(null)}
          title={`Edit Facility - ${editingBank.name}`}
          subtitle={`Reg No: ${editingBank.registrationNumber}`}
          maxWidth="max-w-xl"
        >
          <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Facility Name</label>
                <input
                  type="text"
                  value={editingBank.name}
                  onChange={(e) => setEditingBank({ ...editingBank, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Contact Phone</label>
                <input
                  type="text"
                  value={editingBank.contactNumber}
                  onChange={(e) => setEditingBank({ ...editingBank, contactNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email</label>
                <input
                  type="email"
                  value={editingBank.email}
                  onChange={(e) => setEditingBank({ ...editingBank, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-semibold text-slate-700 mb-1">Address</label>
                <input
                  type="text"
                  value={editingBank.address}
                  onChange={(e) => setEditingBank({ ...editingBank, address: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">City</label>
                <input
                  type="text"
                  value={editingBank.city}
                  onChange={(e) => setEditingBank({ ...editingBank, city: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Hours</label>
                <input
                  type="text"
                  value={editingBank.openingTime}
                  onChange={(e) => setEditingBank({ ...editingBank, openingTime: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingBank(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold cursor-pointer"
              >
                Save Updates
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Modal: View Details */}
      {selectedBank && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedBank(null)}
          title={selectedBank.name}
          subtitle={`Registration Number: ${selectedBank.registrationNumber}`}
          maxWidth="max-w-md"
        >
          <div className="space-y-3 text-xs">
            <p><strong>Address:</strong> {selectedBank.address}, {selectedBank.city}, {selectedBank.state} - {selectedBank.pincode}</p>
            <p><strong>Phone:</strong> {selectedBank.contactNumber}</p>
            <p><strong>Email:</strong> {selectedBank.email}</p>
            <p><strong>Hours:</strong> {selectedBank.openingTime} to {selectedBank.closingTime}</p>
            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedBank(null)}
                className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded font-semibold cursor-pointer"
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
