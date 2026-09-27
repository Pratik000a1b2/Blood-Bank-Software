import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { BloodGroup, User, Donor } from '../../types';
import { bloodBankService } from '../../services/bloodBankService';
import { Heart, CheckCircle2, AlertCircle, Info, ShieldCheck } from 'lucide-react';

interface DonateBloodModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User;
  onDonorRegistered?: (donor: Donor) => void;
}

export const DonateBloodModal: React.FC<DonateBloodModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onDonorRegistered,
}) => {
  const [formData, setFormData] = useState({
    fullName: currentUser.fullName || '',
    bloodGroup: (currentUser.bloodGroup || 'O+') as BloodGroup,
    age: 26,
    gender: (currentUser.gender || 'Male') as 'Male' | 'Female' | 'Other',
    weight: 65,
    mobile: currentUser.mobile || '',
    city: currentUser.city || 'Akola',
    address: currentUser.address || '',
    lastDonationDate: '',
    preferredDonationDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const bloodGroups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Eligibility validations
    if (!formData.fullName.trim()) {
      setError('Please provide the donor full name.');
      return;
    }
    if (Number(formData.age) < 18 || Number(formData.age) > 65) {
      setError('Donors must be between 18 and 65 years of age according to health criteria.');
      return;
    }
    if (Number(formData.weight) < 45) {
      setError('Donor body weight must be at least 45 kg.');
      return;
    }
    if (!/^\d{10}$/.test(formData.mobile.trim())) {
      setError('Please provide a valid 10-digit mobile number.');
      return;
    }
    if (!formData.city.trim()) {
      setError('City is required.');
      return;
    }
    if (!formData.preferredDonationDate) {
      setError('Preferred donation date is required.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = bloodBankService.registerDonor({
        userId: currentUser.id,
        fullName: formData.fullName.trim(),
        bloodGroup: formData.bloodGroup,
        age: Number(formData.age),
        gender: formData.gender,
        weight: Number(formData.weight),
        mobile: formData.mobile.trim(),
        city: formData.city.trim(),
        address: formData.address.trim(),
        lastDonationDate: formData.lastDonationDate || undefined,
        preferredDonationDate: formData.preferredDonationDate,
      });

      setLoading(false);
      if (res.success && res.donor) {
        setSuccessMsg(res.message);
        onDonorRegistered?.(res.donor);
        setTimeout(() => {
          setSuccessMsg(null);
          onClose();
        }, 1800);
      } else {
        setError(res.message);
      }
    }, 450);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Register for Blood Donation"
      subtitle="Join our voluntary donor registry to save lives in emergency hospital cases"
      maxWidth="max-w-2xl"
    >
      <div className="space-y-4">
        {/* Eligibility Criteria Notice */}
        <div className="p-3.5 bg-rose-50/60 border border-rose-200/80 rounded-xl">
          <div className="flex items-center gap-2 text-xs font-bold text-rose-800 mb-1">
            <ShieldCheck className="w-4 h-4 text-rose-600" />
            Standard Donor Eligibility Criteria
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-rose-900/80">
            <div>• Age: <strong>18 to 65 years</strong></div>
            <div>• Weight: <strong>$\ge$ 45 kg</strong></div>
            <div>• Interval: <strong>3+ months</strong> since last donation</div>
          </div>
          <p className="text-[10px] text-rose-700 mt-1">
            *Final eligibility will be confirmed through physical vitals & hemoglobin test at the blood centre.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-2 text-xs text-rose-700">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-3 text-sm text-emerald-800">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="font-semibold">{successMsg}</p>
              <p className="text-xs text-emerald-700">An SMS reminder and appointment slot confirmation has been issued.</p>
            </div>
          </div>
        )}

        {!successMsg && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Donor Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Donor Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  required
                />
              </div>

              {/* Blood Group */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Blood Group *
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

              {/* Age */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Age (18 - 65) *
                </label>
                <input
                  type="number"
                  name="age"
                  min={18}
                  max={65}
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  required
                />
              </div>

              {/* Gender */}
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

              {/* Weight */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Weight (in kg, minimum 45) *
                </label>
                <input
                  type="number"
                  name="weight"
                  min={45}
                  max={150}
                  value={formData.weight}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  required
                />
              </div>

              {/* Mobile */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  name="mobile"
                  maxLength={10}
                  value={formData.mobile}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  required
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

              {/* Preferred Date */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Preferred Donation Date *
                </label>
                <input
                  type="date"
                  name="preferredDonationDate"
                  value={formData.preferredDonationDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  required
                />
              </div>

              {/* Last Donation Date */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Last Blood Donation Date (Leave blank if first time donor)
                </label>
                <input
                  type="date"
                  name="lastDonationDate"
                  value={formData.lastDonationDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>

              {/* Address */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Address / Locality
                </label>
                <textarea
                  name="address"
                  rows={2}
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Street name, landmark, nearby hospital"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white font-semibold text-sm rounded-lg shadow-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Heart className="w-4 h-4 fill-current" />
                  <span>Register for Blood Donation</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </Modal>
  );
};
