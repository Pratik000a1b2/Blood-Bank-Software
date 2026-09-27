import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { BloodGroup, EmergencyLevel, User } from '../../types';
import { bloodBankService } from '../../services/bloodBankService';
import { AlertCircle, AlertTriangle, CheckCircle2, Copy } from 'lucide-react';

interface RequestBloodModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  initialGroup?: BloodGroup;
  initialEmergency?: boolean;
  onRequestCreated?: (requestId: string) => void;
}

export const RequestBloodModal: React.FC<RequestBloodModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  initialGroup = 'O+',
  initialEmergency = false,
  onRequestCreated,
}) => {
  const [formData, setFormData] = useState({
    patientName: '',
    patientAge: 35,
    gender: 'Male' as 'Male' | 'Female' | 'Other',
    bloodGroup: initialGroup as BloodGroup,
    requiredUnits: 1,
    hospitalName: '',
    hospitalAddress: '',
    city: currentUser.city || 'Akola',
    attendantName: currentUser.fullName || '',
    attendantMobile: currentUser.mobile || '',
    requiredDate: new Date(Date.now() + (initialEmergency ? 0 : 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
    emergencyLevel: (initialEmergency ? 'Critical' : 'Normal') as EmergencyLevel,
    additionalInformation: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{ requestId: string; message: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const banks = bloodBankService.getBloodBanks();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.patientName.trim()) {
      setError('Patient name is required.');
      return;
    }
    if (Number(formData.patientAge) <= 0) {
      setError('Patient age must be greater than zero.');
      return;
    }
    if (Number(formData.requiredUnits) <= 0) {
      setError('Required blood units must be at least 1.');
      return;
    }
    if (!formData.hospitalName.trim()) {
      setError('Hospital name is required.');
      return;
    }
    if (!formData.city.trim()) {
      setError('City is required.');
      return;
    }
    if (!formData.attendantName.trim()) {
      setError('Attendant or relative name is required.');
      return;
    }
    if (!/^\d{10}$/.test(formData.attendantMobile.trim())) {
      setError('Attendant contact must be a valid 10-digit mobile number.');
      return;
    }
    if (!formData.requiredDate) {
      setError('Required date cannot be empty.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = bloodBankService.createBloodRequest({
        userId: currentUser.id,
        patientName: formData.patientName.trim(),
        patientAge: Number(formData.patientAge),
        gender: formData.gender,
        bloodGroup: formData.bloodGroup,
        requiredUnits: Number(formData.requiredUnits),
        hospitalName: formData.hospitalName.trim(),
        hospitalAddress: formData.hospitalAddress.trim(),
        city: formData.city.trim(),
        attendantName: formData.attendantName.trim(),
        attendantMobile: formData.attendantMobile.trim(),
        requiredDate: formData.requiredDate,
        emergencyLevel: formData.emergencyLevel,
        additionalInformation: formData.additionalInformation.trim(),
      });

      setLoading(false);
      if (res.success) {
        setSuccessData({
          requestId: res.requestId,
          message: res.message,
        });
        onRequestCreated?.(res.requestId);
      } else {
        setError(res.message);
      }
    }, 450);
  };

  const handleCopyId = () => {
    if (successData?.requestId) {
      navigator.clipboard.writeText(successData.requestId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleResetAndClose = () => {
    setSuccessData(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleResetAndClose}
      title={formData.emergencyLevel === 'Critical' ? '🚨 Emergency Blood Request' : 'Submit Blood Request'}
      subtitle="Complete requisition form to verify stock and dispatch units from nearest accredited blood bank"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4">
        {/* Emergency Alert Banner */}
        {formData.emergencyLevel === 'Critical' && (
          <div className="p-3 bg-rose-50 border border-rose-300 rounded-lg flex items-center gap-2.5 text-xs text-rose-800 font-medium">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>Critical Priority: Emergency requisition will instantly ping active staff on call.</span>
          </div>
        )}

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-2 text-xs text-rose-700">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {successData ? (
          <div className="py-4 space-y-4 text-center">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h4 className="text-lg font-bold text-slate-900">Blood Request Submitted Successfully</h4>
              <p className="text-xs text-slate-500">
                Your request has been prioritized and routed to medical authorities in {formData.city}.
              </p>
            </div>

            {/* Generated Unique ID Card */}
            <div className="max-w-xs mx-auto p-4 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[11px] text-slate-400 font-medium uppercase tracking-wider block">
                Unique Request ID
              </span>
              <div className="flex items-center justify-center gap-2 mt-1">
                <span className="text-xl font-bold font-mono text-rose-600 tracking-wider">
                  {successData.requestId}
                </span>
                <button
                  type="button"
                  onClick={handleCopyId}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded transition-colors cursor-pointer"
                  title="Copy Request ID"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              {copied && <span className="text-[10px] text-emerald-600 block mt-1">Copied to clipboard!</span>}
            </div>

            <p className="text-xs text-slate-600">
              Patient: <strong>{formData.patientName}</strong> · Group: <strong>{formData.bloodGroup}</strong> ({formData.requiredUnits} Units) · Hospital: <strong>{formData.hospitalName}</strong>
            </p>

            <div className="pt-2 flex justify-center gap-3">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                Track Status in "My Requests"
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Priority / Emergency Level Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Emergency Priority Level *
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Normal', 'Urgent', 'Critical'] as EmergencyLevel[]).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, emergencyLevel: lvl }))}
                    className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                      formData.emergencyLevel === lvl
                        ? lvl === 'Critical'
                          ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                          : lvl === 'Urgent'
                          ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                          : 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Patient Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Patient Full Name *
                </label>
                <input
                  type="text"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleChange}
                  placeholder="e.g. Rameshwar Panzade"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  required
                />
              </div>

              {/* Blood Group Required */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Blood Group Required *
                </label>
                <select
                  name="bloodGroup"
                  value={formData.bloodGroup}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-white"
                >
                  {bloodGroups.map((bg) => (
                    <option key={bg} value={bg}>
                      {bg}
                    </option>
                  ))}
                </select>
              </div>

              {/* Patient Age */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Patient Age *
                </label>
                <input
                  type="number"
                  name="patientAge"
                  min={1}
                  max={120}
                  value={formData.patientAge}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  required
                />
              </div>

              {/* Patient Gender */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Gender *
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 bg-white"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Required Units */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Required Units (Pints / Bags) *
                </label>
                <input
                  type="number"
                  name="requiredUnits"
                  min={1}
                  max={10}
                  value={formData.requiredUnits}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  required
                />
              </div>

              {/* Required Date */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Date Needed By *
                </label>
                <input
                  type="date"
                  name="requiredDate"
                  value={formData.requiredDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  required
                />
              </div>

              {/* Hospital Name */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Hospital Name *
                </label>
                <input
                  type="text"
                  name="hospitalName"
                  value={formData.hospitalName}
                  onChange={handleChange}
                  placeholder="e.g. Akola Civil Hospital / Ruby Hall Clinic"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  required
                />
              </div>

              {/* Hospital Address */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Hospital Address / Ward No.
                </label>
                <input
                  type="text"
                  name="hospitalAddress"
                  value={formData.hospitalAddress}
                  onChange={handleChange}
                  placeholder="Ward 4, ICU Building"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Akola"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  required
                />
              </div>

              {/* Attendant Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Attendant / Relative Name *
                </label>
                <input
                  type="text"
                  name="attendantName"
                  value={formData.attendantName}
                  onChange={handleChange}
                  placeholder="Contact person at hospital"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  required
                />
              </div>

              {/* Attendant Mobile */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Attendant Mobile (10 Digits) *
                </label>
                <input
                  type="tel"
                  name="attendantMobile"
                  maxLength={10}
                  value={formData.attendantMobile}
                  onChange={handleChange}
                  placeholder="9876543210"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  required
                />
              </div>

              {/* Additional Information */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Clinical Diagnosis / Additional Information
                </label>
                <textarea
                  name="additionalInformation"
                  rows={2}
                  value={formData.additionalInformation}
                  onChange={handleChange}
                  placeholder="Reason for requisition (e.g., bypass surgery, severe anemia, trauma)"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {loading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>Submit Blood Request</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};
