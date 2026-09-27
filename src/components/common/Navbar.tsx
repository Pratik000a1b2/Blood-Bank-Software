import React from 'react';
import { Shield, Droplet, User as UserIcon, LogOut, Code, AlertCircle } from 'lucide-react';
import { Role, User, AppNotification } from '../../types';
import { NotificationDropdown } from './NotificationDropdown';
import { INITIAL_USERS } from '../../data/initialData';
import { bloodBankService } from '../../services/bloodBankService';

interface NavbarProps {
  currentUser: User;
  currentRole: Role;
  onRoleChange: (role: Role) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  notifications: AppNotification[];
  onOpenLogin: () => void;
  onOpenEmergencyRequest: () => void;
  onOpenProfile: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  currentRole,
  onRoleChange,
  activeTab,
  onTabChange,
  notifications,
  onOpenLogin,
  onOpenEmergencyRequest,
  onOpenProfile,
}) => {
  const getNavLinks = () => {
    switch (currentRole) {
      case 'ADMIN':
        return [
          { id: 'admin-dashboard', label: 'Dashboard' },
          { id: 'admin-donors', label: 'Donors' },
          { id: 'admin-requests', label: 'Requests' },
          { id: 'admin-inventory', label: 'Inventory' },
          { id: 'admin-banks', label: 'Blood Banks' },
          { id: 'admin-reports', label: 'Reports' },
          { id: 'source-code', label: 'Architecture & Code' },
        ];
      case 'STAFF':
        return [
          { id: 'staff-dashboard', label: 'Staff Console' },
          { id: 'staff-inventory', label: 'Inventory Stock' },
          { id: 'staff-requests', label: 'Blood Requests' },
          { id: 'staff-donors', label: 'Donors List' },
          { id: 'source-code', label: 'Architecture & Code' },
        ];
      default: // USER
        return [
          { id: 'user-dashboard', label: 'Home' },
          { id: 'search-blood', label: 'Search Blood' },
          { id: 'donate-blood', label: 'Donate' },
          { id: 'my-requests', label: 'My Requests' },
          { id: 'blood-education', label: 'Guidelines' },
          { id: 'source-code', label: 'Architecture & Code' },
        ];
    }
  };

  const navLinks = getNavLinks();

  const handleRoleQuickSwitch = (role: Role) => {
    // If switching role, also switch to corresponding demo user account
    if (role === 'ADMIN') {
      const admin = INITIAL_USERS.find((u) => u.role === 'ADMIN') || INITIAL_USERS[0];
      bloodBankService.setCurrentUser(admin);
      onTabChange('admin-dashboard');
    } else if (role === 'STAFF') {
      const staff = INITIAL_USERS.find((u) => u.role === 'STAFF') || INITIAL_USERS[1];
      bloodBankService.setCurrentUser(staff);
      onTabChange('staff-dashboard');
    } else {
      const donor = INITIAL_USERS.find((u) => u.role === 'USER') || INITIAL_USERS[2];
      bloodBankService.setCurrentUser(donor);
      onTabChange('user-dashboard');
    }
    onRoleChange(role);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Banner for Demo Simulation Roles */}
      <div className="bg-slate-900 text-white text-xs px-4 py-1.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium">Active Simulation Role:</span>
          <div className="inline-flex rounded-md p-0.5 bg-slate-800 border border-slate-700">
            {(['USER', 'STAFF', 'ADMIN'] as Role[]).map((r) => (
              <button
                key={r}
                onClick={() => handleRoleQuickSwitch(r)}
                className={`px-2.5 py-0.5 text-[11px] font-medium rounded transition-colors cursor-pointer ${
                  currentRole === r
                    ? 'bg-rose-600 text-white shadow-xs font-semibold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {r === 'USER' ? 'Donor / User' : r === 'STAFF' ? 'Blood Bank Staff' : 'System Admin'}
              </button>
            ))}
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-4 text-[11px] text-slate-300">
          <span>Logged in as: <strong className="text-white">{currentUser.fullName}</strong> ({currentUser.city})</span>
          <button
            onClick={() => onTabChange('source-code')}
            className="inline-flex items-center gap-1 text-rose-400 hover:text-rose-300 cursor-pointer"
          >
            <Code className="w-3 h-3" />
            <span>Spring Boot + MySQL + Android Code</span>
          </button>
        </div>
      </div>

      {/* Main Top Bar Contract: Zone 1 (Wordmark), Zone 2 (Nav links), Zone 3 (Actions) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onTabChange(currentRole === 'ADMIN' ? 'admin-dashboard' : currentRole === 'STAFF' ? 'staff-dashboard' : 'user-dashboard')}
          className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 hover:opacity-90 flex items-center gap-2 cursor-pointer text-left"
        >
          <div className="w-8 h-8 rounded-lg bg-rose-600 flex items-center justify-center text-white shadow-sm shrink-0">
            <Droplet className="w-5 h-5 fill-current" />
          </div>
          <span className="whitespace-nowrap">Blood Bank Management</span>
        </button>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-600">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => onTabChange(link.id)}
              className={`transition-colors hover:text-slate-900 cursor-pointer whitespace-nowrap ${
                activeTab === link.id
                  ? 'text-rose-600 font-semibold border-b-2 border-rose-600 py-1'
                  : 'text-slate-600 py-1'
              }`}
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: Primary actions & profile */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenEmergencyRequest}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-lg shadow-sm transition-colors cursor-pointer whitespace-nowrap"
          >
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>Emergency Request</span>
          </button>

          <NotificationDropdown
            notifications={notifications}
            currentUserId={currentUser.id}
          />

          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-slate-700 cursor-pointer text-xs font-medium"
            title="User Profile"
          >
            <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs uppercase">
              {currentUser.fullName ? currentUser.fullName[0] : 'U'}
            </div>
            <span className="hidden md:inline font-medium max-w-[100px] truncate">{currentUser.fullName}</span>
          </button>

          <button
            onClick={onOpenLogin}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Switch Account / Sign In"
            aria-label="Switch Account"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Secondary Navigation Row */}
      <div className="lg:hidden flex items-center overflow-x-auto px-4 py-2 border-t border-slate-100 bg-slate-50/70 gap-2 no-scrollbar">
        {navLinks.map((link) => (
          <button
            key={link.id}
            onClick={() => onTabChange(link.id)}
            className={`px-3 py-1 text-xs font-medium rounded-md whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === link.id
                ? 'bg-rose-600 text-white'
                : 'text-slate-600 hover:bg-slate-200/60'
            }`}
          >
            {link.label}
          </button>
        ))}
      </div>
    </header>
  );
};
