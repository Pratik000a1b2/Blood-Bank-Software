import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Role, User } from '../../types';
import { bloodBankService } from '../../services/bloodBankService';
import { Lock, Mail, Shield, UserCheck, AlertCircle, CheckCircle2 } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  onOpenRegister: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  onOpenRegister,
}) => {
  const [role, setRole] = useState<Role>('USER');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [forgotMsg, setForgotMsg] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setForgotMsg(false);

    if (!identifier.trim()) {
      setError('Please enter your email or 10-digit mobile number.');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your account password.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = bloodBankService.login(identifier, password, role);
      setLoading(false);

      if (res.success && res.user) {
        onLoginSuccess(res.user);
        onClose();
      } else {
        setError(res.message);
      }
    }, 400);
  };

  const handleFillDemo = (targetRole: Role) => {
    setRole(targetRole);
    setError(null);
    setForgotMsg(false);
    if (targetRole === 'ADMIN') {
      setIdentifier('admin@bloodbank.org');
      setPassword('admin123');
    } else if (targetRole === 'STAFF') {
      setIdentifier('staff@bloodbank.org');
      setPassword('staff123');
    } else {
      setIdentifier('donor@gmail.com');
      setPassword('donor123');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Sign In to Blood Bank System"
      subtitle="Select your designated role and enter your healthcare account credentials"
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        {/* Role Selector Tabs */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Designated User Role
          </label>
          <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-lg">
            {(['USER', 'STAFF', 'ADMIN'] as Role[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                  role === r
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {r === 'USER' ? 'Donor / User' : r === 'STAFF' ? 'Staff' : 'Admin'}
              </button>
            ))}
          </div>
        </div>

        {/* Demo Fast-fill Buttons */}
        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200">
          <p className="text-[11px] text-slate-500 mb-1.5 font-medium">Quick 1-Click Demo Login:</p>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleFillDemo('USER')}
              className="text-[11px] px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded text-slate-700 font-medium cursor-pointer"
            >
              Demo Donor
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('STAFF')}
              className="text-[11px] px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded text-slate-700 font-medium cursor-pointer"
            >
              Demo Staff
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo('ADMIN')}
              className="text-[11px] px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded text-slate-700 font-medium cursor-pointer"
            >
              Demo Admin
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-2 text-xs text-rose-700">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {forgotMsg && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-700">
            A password reset link or SMS OTP has been simulated for your email/mobile.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address or Mobile Number
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="e.g. donor@gmail.com or 9876543210"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">Password</label>
              <button
                type="button"
                onClick={() => setForgotMsg(true)}
                className="text-xs text-rose-600 hover:text-rose-700 cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                required
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
              <span>Sign In as {role === 'USER' ? 'Donor / User' : role === 'STAFF' ? 'Staff' : 'Administrator'}</span>
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100">
          <p className="text-xs text-slate-500">
            Don't have an account yet?{' '}
            <button
              onClick={() => {
                onClose();
                onOpenRegister();
              }}
              className="text-rose-600 font-semibold hover:underline cursor-pointer"
            >
              Create Account
            </button>
          </p>
        </div>
      </div>
    </Modal>
  );
};
