/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  BloodAvailabilitySummary,
  BloodBank,
  BloodGroup,
  BloodInventoryItem,
  BloodRequest,
  Donor,
  DonationRecord,
  Role,
  User,
} from './types';
import { bloodBankService } from './services/bloodBankService';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { LoginModal } from './components/auth/LoginModal';
import { RegisterModal } from './components/auth/RegisterModal';
import { UserDashboard } from './components/donor/UserDashboard';
import { DonateBloodModal } from './components/donor/DonateBloodModal';
import { RequestBloodModal } from './components/donor/RequestBloodModal';
import { MyRequestsView } from './components/donor/MyRequestsView';
import { UserProfileModal } from './components/donor/UserProfileModal';
import { BloodEducationView } from './components/donor/BloodEducationView';
import { BloodSearchView } from './components/blood/BloodSearchView';
import { StaffDashboard } from './components/staff/StaffDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { DonorManagement } from './components/admin/DonorManagement';
import { RequestManagement } from './components/admin/RequestManagement';
import { InventoryManagement } from './components/admin/InventoryManagement';
import { BloodBankManagement } from './components/admin/BloodBankManagement';
import { ReportsAnalytics } from './components/admin/ReportsAnalytics';
import { SourceCodeHub } from './components/sourceViewer/SourceCodeHub';
import { AlertCircle, RotateCcw } from 'lucide-react';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User>(() => bloodBankService.getCurrentUser());
  const [currentRole, setCurrentRole] = useState<Role>(currentUser.role);
  const [activeTab, setActiveTab] = useState<string>('user-dashboard');

  // Modals
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isDonateOpen, setIsDonateOpen] = useState(false);
  const [isRequestOpen, setIsRequestOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Request modal config
  const [reqModalGroup, setReqModalGroup] = useState<BloodGroup>('O+');
  const [reqModalEmergency, setReqModalEmergency] = useState(false);

  // Reactive data from service
  const [availability, setAvailability] = useState<BloodAvailabilitySummary[]>(() =>
    bloodBankService.getBloodAvailability()
  );
  const [inventory, setInventory] = useState<BloodInventoryItem[]>(() =>
    bloodBankService.getInventory()
  );
  const [requests, setRequests] = useState<BloodRequest[]>(() =>
    bloodBankService.getRequests()
  );
  const [donors, setDonors] = useState<Donor[]>(() => bloodBankService.getDonors());
  const [banks, setBanks] = useState<BloodBank[]>(() => bloodBankService.getBloodBanks());
  const [donations, setDonations] = useState<DonationRecord[]>(() =>
    bloodBankService.getDonations()
  );
  const [notifications, setNotifications] = useState(() =>
    bloodBankService.getNotifications()
  );
  const [adminStats, setAdminStats] = useState(() => bloodBankService.getAdminStats());

  // Subscribe to service updates
  useEffect(() => {
    const unsubscribe = bloodBankService.subscribe(() => {
      const user = bloodBankService.getCurrentUser();
      setCurrentUser(user);
      setAvailability(bloodBankService.getBloodAvailability());
      setInventory(bloodBankService.getInventory());
      setRequests(bloodBankService.getRequests());
      setDonors(bloodBankService.getDonors());
      setBanks(bloodBankService.getBloodBanks());
      setDonations(bloodBankService.getDonations());
      setNotifications(bloodBankService.getNotifications());
      setAdminStats(bloodBankService.getAdminStats());
    });
    return unsubscribe;
  }, []);

  // Sync role when user changes
  useEffect(() => {
    setCurrentRole(currentUser.role);
  }, [currentUser]);

  const handleRoleChange = (role: Role) => {
    setCurrentRole(role);
  };

  const handleOpenRequest = (group?: BloodGroup, emergency: boolean = false) => {
    if (group) setReqModalGroup(group);
    setReqModalEmergency(emergency);
    setIsRequestOpen(true);
  };

  const handleResetDemoData = () => {
    if (confirm('Reset all databases (inventory, requests, donors, users) to initial demo state?')) {
      bloodBankService.resetAllToDemo();
      setActiveTab('user-dashboard');
    }
  };

  // Render view depending on active tab
  const renderContent = () => {
    switch (activeTab) {
      // User / Donor views
      case 'user-dashboard':
        return (
          <UserDashboard
            currentUser={currentUser}
            availability={availability}
            userRequests={requests.filter((r) => r.userId === currentUser.id)}
            userDonations={donations.filter((d) => d.donorName === currentUser.fullName)}
            onOpenSearch={(group) => {
              if (group) setReqModalGroup(group);
              setActiveTab('search-blood');
            }}
            onOpenDonate={() => setIsDonateOpen(true)}
            onOpenRequest={(group, emergency) => handleOpenRequest(group, emergency)}
            onOpenMyRequests={() => setActiveTab('my-requests')}
            onOpenEducation={() => setActiveTab('blood-education')}
            onOpenProfile={() => setIsProfileOpen(true)}
          />
        );

      case 'search-blood':
        return (
          <BloodSearchView
            initialGroup={reqModalGroup}
            onRequestBlood={(group) => handleOpenRequest(group, false)}
          />
        );

      case 'donate-blood':
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Voluntary Blood Donation</h2>
                <p className="text-xs text-slate-500 mt-1">Register as a donor or review eligibility requirements</p>
              </div>
              <button
                onClick={() => setIsDonateOpen(true)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Register to Donate
              </button>
            </div>
            <BloodEducationView />
          </div>
        );

      case 'my-requests':
        return (
          <MyRequestsView
            requests={requests}
            currentUser={currentUser}
            onOpenNewRequest={() => handleOpenRequest(undefined, false)}
          />
        );

      case 'blood-education':
        return <BloodEducationView />;

      // Staff views
      case 'staff-dashboard':
      case 'staff-inventory':
      case 'staff-requests':
      case 'staff-donors':
        return (
          <StaffDashboard
            currentUser={currentUser}
            inventory={inventory}
            requests={requests}
            donors={donors}
            banks={banks}
          />
        );

      // Admin views
      case 'admin-dashboard':
        return (
          <AdminDashboard
            stats={adminStats}
            availability={availability}
            recentRequests={requests}
            recentDonors={donors}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onOpenApproveRequest={(reqId) => {
              bloodBankService.updateRequestStatus(reqId, 'Approved');
            }}
          />
        );

      case 'admin-donors':
        return <DonorManagement donors={donors} />;

      case 'admin-requests':
        return <RequestManagement requests={requests} />;

      case 'admin-inventory':
        return <InventoryManagement inventory={inventory} banks={banks} />;

      case 'admin-banks':
        return <BloodBankManagement banks={banks} />;

      case 'admin-reports':
        return <ReportsAnalytics />;

      // Architecture & Source Code Hub
      case 'source-code':
        return <SourceCodeHub />;

      default:
        return (
          <UserDashboard
            currentUser={currentUser}
            availability={availability}
            userRequests={requests.filter((r) => r.userId === currentUser.id)}
            userDonations={donations.filter((d) => d.donorName === currentUser.fullName)}
            onOpenSearch={() => setActiveTab('search-blood')}
            onOpenDonate={() => setIsDonateOpen(true)}
            onOpenRequest={(group, emergency) => handleOpenRequest(group, emergency)}
            onOpenMyRequests={() => setActiveTab('my-requests')}
            onOpenEducation={() => setActiveTab('blood-education')}
            onOpenProfile={() => setIsProfileOpen(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-rose-500 selection:text-white">
      {/* Top Navbar adhering to Top Bar Contract */}
      <Navbar
        currentUser={currentUser}
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        notifications={notifications}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenEmergencyRequest={() => handleOpenRequest(undefined, true)}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {renderContent()}
      </main>

      {/* Floating Demo Reset Button (Bottom Left) */}
      <div className="fixed bottom-4 left-4 z-30">
        <button
          onClick={handleResetDemoData}
          className="p-2 rounded-full bg-slate-900/90 text-white/80 hover:text-white hover:bg-slate-900 shadow-md border border-slate-700 text-xs transition-colors cursor-pointer flex items-center gap-1.5 px-3"
          title="Reset database to initial demo values"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline text-[11px] font-medium">Reset Demo DB</span>
        </button>
      </div>

      {/* Footer */}
      <Footer onTabChange={(tab) => setActiveTab(tab)} />

      {/* Auth Modals */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setCurrentRole(user.role);
          if (user.role === 'ADMIN') setActiveTab('admin-dashboard');
          else if (user.role === 'STAFF') setActiveTab('staff-dashboard');
          else setActiveTab('user-dashboard');
        }}
        onOpenRegister={() => setIsRegisterOpen(true)}
      />

      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onRegisterSuccess={(user) => {
          setCurrentUser(user);
          setCurrentRole(user.role);
          setActiveTab('user-dashboard');
        }}
        onOpenLogin={() => setIsLoginOpen(true)}
      />

      {/* Donor Registration Modal */}
      <DonateBloodModal
        isOpen={isDonateOpen}
        onClose={() => setIsDonateOpen(false)}
        currentUser={currentUser}
        onDonorRegistered={() => {
          // Handled via service subscriber
        }}
      />

      {/* Blood Request Modal */}
      <RequestBloodModal
        isOpen={isRequestOpen}
        onClose={() => setIsRequestOpen(false)}
        currentUser={currentUser}
        initialGroup={reqModalGroup}
        initialEmergency={reqModalEmergency}
        onRequestCreated={() => {
          // Handled via service subscriber
        }}
      />

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        currentUser={currentUser}
        onProfileUpdated={(updated) => setCurrentUser(updated)}
      />
    </div>
  );
}
