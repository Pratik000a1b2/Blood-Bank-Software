import {
  BloodAvailabilitySummary,
  BloodBank,
  BloodGroup,
  BloodInventoryItem,
  BloodRequest,
  Donor,
  DonationRecord,
  AppNotification,
  Role,
  User,
} from '../types';
import {
  INITIAL_BLOOD_BANKS,
  INITIAL_DONORS,
  INITIAL_DONATIONS,
  INITIAL_INVENTORY,
  INITIAL_NOTIFICATIONS,
  INITIAL_REQUESTS,
  INITIAL_USERS,
} from '../data/initialData';

const STORAGE_KEYS = {
  USERS: 'bbs_users_v1',
  CURRENT_USER: 'bbs_current_user_v1',
  DONORS: 'bbs_donors_v1',
  INVENTORY: 'bbs_inventory_v1',
  REQUESTS: 'bbs_requests_v1',
  BANKS: 'bbs_banks_v1',
  DONATIONS: 'bbs_donations_v1',
  NOTIFICATIONS: 'bbs_notifications_v1',
  REQUEST_SEQ: 'bbs_req_seq_v1',
};

class BloodBankService {
  constructor() {
    this.initStorage();
  }

  private initStorage() {
    if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CURRENT_USER)) {
      // Default to User/Donor for initial view
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(INITIAL_USERS[2]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.DONORS)) {
      localStorage.setItem(STORAGE_KEYS.DONORS, JSON.stringify(INITIAL_DONORS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.INVENTORY)) {
      localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(INITIAL_INVENTORY));
    }
    if (!localStorage.getItem(STORAGE_KEYS.REQUESTS)) {
      localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(INITIAL_REQUESTS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.BANKS)) {
      localStorage.setItem(STORAGE_KEYS.BANKS, JSON.stringify(INITIAL_BLOOD_BANKS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.DONATIONS)) {
      localStorage.setItem(STORAGE_KEYS.DONATIONS, JSON.stringify(INITIAL_DONATIONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS)) {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.REQUEST_SEQ)) {
      localStorage.setItem(STORAGE_KEYS.REQUEST_SEQ, '105');
    }
  }

  public resetAllToDemo() {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(INITIAL_USERS[2]));
    localStorage.setItem(STORAGE_KEYS.DONORS, JSON.stringify(INITIAL_DONORS));
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(INITIAL_INVENTORY));
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(INITIAL_REQUESTS));
    localStorage.setItem(STORAGE_KEYS.BANKS, JSON.stringify(INITIAL_BLOOD_BANKS));
    localStorage.setItem(STORAGE_KEYS.DONATIONS, JSON.stringify(INITIAL_DONATIONS));
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(INITIAL_NOTIFICATIONS));
    localStorage.setItem(STORAGE_KEYS.REQUEST_SEQ, '105');
    this.notifyListeners();
  }

  private listeners: Array<() => void> = [];

  public subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((l) => l());
  }

  // --- Auth & Users ---
  public getCurrentUser(): User {
    const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_USERS[2];
  }

  public setCurrentUser(user: User) {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
    this.notifyListeners();
  }

  public getUsers(): User[] {
    const raw = localStorage.getItem(STORAGE_KEYS.USERS);
    return raw ? JSON.parse(raw) : INITIAL_USERS;
  }

  public login(identifier: string, pass: string, requestedRole?: Role): { success: boolean; message: string; user?: User } {
    const cleanId = identifier.trim().toLowerCase();
    const users = this.getUsers();
    
    // Find matching user by email or mobile
    const user = users.find(
      (u) =>
        (u.email.toLowerCase() === cleanId || u.mobile === cleanId) &&
        (!requestedRole || u.role === requestedRole)
    );

    if (!user) {
      // In demo mode, if entering demo role credentials
      if (requestedRole === 'ADMIN' && (cleanId.includes('admin') || cleanId === 'admin@bloodbank.org')) {
        const adminUser = users.find((u) => u.role === 'ADMIN') || INITIAL_USERS[0];
        this.setCurrentUser(adminUser);
        return { success: true, message: 'Welcome Admin!', user: adminUser };
      }
      if (requestedRole === 'STAFF' && (cleanId.includes('staff') || cleanId === 'staff@bloodbank.org')) {
        const staffUser = users.find((u) => u.role === 'STAFF') || INITIAL_USERS[1];
        this.setCurrentUser(staffUser);
        return { success: true, message: 'Welcome Staff Member!', user: staffUser };
      }
      return { success: false, message: 'Invalid credentials or user not found with specified role.' };
    }

    this.setCurrentUser(user);
    return { success: true, message: `Welcome back, ${user.fullName}!`, user };
  }

  public register(userData: Omit<User, 'id' | 'createdAt'>): { success: boolean; message: string; user?: User } {
    const users = this.getUsers();
    const existing = users.find(
      (u) => u.email.toLowerCase() === userData.email.trim().toLowerCase() || u.mobile === userData.mobile.trim()
    );

    if (existing) {
      return { success: false, message: 'User with this email or mobile number already exists.' };
    }

    const newUser: User = {
      ...userData,
      id: `usr-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString(),
    };

    const updated = [newUser, ...users];
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(updated));
    this.setCurrentUser(newUser);

    this.addNotification({
      userId: newUser.id,
      title: 'Registration Successful',
      message: `Welcome to Blood Bank Management System, ${newUser.fullName}. Your account is ready!`,
      type: 'success',
    });

    return { success: true, message: 'Registration successful! Logged in automatically.', user: newUser };
  }

  public updateProfile(userId: string, data: Partial<User>): { success: boolean; message: string } {
    const users = this.getUsers();
    const index = users.findIndex((u) => u.id === userId);
    if (index === -1) return { success: false, message: 'User not found.' };

    users[index] = { ...users[index], ...data };
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));

    const currentUser = this.getCurrentUser();
    if (currentUser.id === userId) {
      this.setCurrentUser(users[index]);
    } else {
      this.notifyListeners();
    }

    return { success: true, message: 'Profile updated successfully.' };
  }

  // --- Blood Availability Summary (8 Groups) ---
  public getBloodAvailability(): BloodAvailabilitySummary[] {
    const inventory = this.getInventory();
    const groups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

    return groups.map((bg) => {
      const items = inventory.filter((item) => item.bloodGroup === bg);
      const totalUnits = items.reduce((sum, item) => sum + item.availableUnits, 0);
      const reservedUnits = items.reduce((sum, item) => sum + item.reservedUnits, 0);
      const banksWithStock = new Set(items.filter((i) => i.availableUnits > 0).map((i) => i.bloodBankId)).size;

      let status: 'Available' | 'Low Stock' | 'Not Available' = 'Available';
      if (totalUnits === 0) {
        status = 'Not Available';
      } else if (totalUnits < 15) {
        status = 'Low Stock';
      }

      return {
        bloodGroup: bg,
        totalUnits,
        reservedUnits,
        availableBanksCount: banksWithStock,
        status,
      };
    });
  }

  // --- Inventory Management ---
  public getInventory(): BloodInventoryItem[] {
    const raw = localStorage.getItem(STORAGE_KEYS.INVENTORY);
    return raw ? JSON.parse(raw) : INITIAL_INVENTORY;
  }

  public addInventoryStock(item: Omit<BloodInventoryItem, 'inventoryId' | 'updatedAt'>): { success: boolean; message: string } {
    const inventory = this.getInventory();
    // Check if an entry for same blood bank and blood group already exists
    const existing = inventory.find(
      (i) => i.bloodBankId === item.bloodBankId && i.bloodGroup === item.bloodGroup
    );

    if (existing) {
      existing.availableUnits += Number(item.availableUnits);
      existing.expiryDate = item.expiryDate || existing.expiryDate;
      existing.updatedAt = new Date().toISOString();
    } else {
      const newItem: BloodInventoryItem = {
        ...item,
        inventoryId: `inv-${Date.now().toString(36)}`,
        availableUnits: Number(item.availableUnits),
        reservedUnits: Number(item.reservedUnits || 0),
        updatedAt: new Date().toISOString(),
      };
      inventory.push(newItem);
    }

    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
    this.notifyListeners();
    return { success: true, message: `Stock for ${item.bloodGroup} added successfully.` };
  }

  public updateInventoryStock(
    inventoryId: string,
    updates: Partial<Pick<BloodInventoryItem, 'availableUnits' | 'reservedUnits' | 'expiryDate'>>
  ): { success: boolean; message: string } {
    const inventory = this.getInventory();
    const item = inventory.find((i) => i.inventoryId === inventoryId);
    if (!item) return { success: false, message: 'Inventory item not found.' };

    if (updates.availableUnits !== undefined) {
      if (updates.availableUnits < 0) {
        return { success: false, message: 'Stock cannot be negative.' };
      }
      item.availableUnits = Number(updates.availableUnits);
    }
    if (updates.reservedUnits !== undefined) {
      if (updates.reservedUnits < 0) {
        return { success: false, message: 'Reserved units cannot be negative.' };
      }
      item.reservedUnits = Number(updates.reservedUnits);
    }
    if (updates.expiryDate) {
      item.expiryDate = updates.expiryDate;
    }

    item.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
    this.notifyListeners();
    return { success: true, message: 'Inventory stock updated successfully.' };
  }

  public removeExpiredStock(): { success: boolean; count: number; message: string } {
    const inventory = this.getInventory();
    const today = new Date().toISOString().split('T')[0];
    let removedUnits = 0;

    inventory.forEach((item) => {
      if (item.expiryDate < today && item.availableUnits > 0) {
        removedUnits += item.availableUnits;
        item.availableUnits = 0;
        item.updatedAt = new Date().toISOString();
      }
    });

    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
    this.notifyListeners();
    return {
      success: true,
      count: removedUnits,
      message: removedUnits > 0 ? `Removed ${removedUnits} expired units.` : 'No expired blood units found.',
    };
  }

  // --- Donor Management ---
  public getDonors(): Donor[] {
    const raw = localStorage.getItem(STORAGE_KEYS.DONORS);
    return raw ? JSON.parse(raw) : INITIAL_DONORS;
  }

  public registerDonor(donorData: Omit<Donor, 'donorId' | 'status' | 'createdAt'>): { success: boolean; message: string; donor?: Donor } {
    const donors = this.getDonors();
    const existing = donors.find((d) => d.userId === donorData.userId);

    const newDonor: Donor = {
      ...donorData,
      donorId: existing ? existing.donorId : `dnr-${(donors.length + 1).toString().padStart(3, '0')}`,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };

    let updatedDonors: Donor[];
    if (existing) {
      updatedDonors = donors.map((d) => (d.userId === donorData.userId ? newDonor : d));
    } else {
      updatedDonors = [newDonor, ...donors];
    }

    localStorage.setItem(STORAGE_KEYS.DONORS, JSON.stringify(updatedDonors));

    // Notify user & Admin
    this.addNotification({
      userId: donorData.userId,
      title: 'Donor Registration Submitted',
      message: 'Your blood donation registration has been submitted successfully and is awaiting staff/admin verification.',
      type: 'info',
    });

    this.notifyAdmin(
      'New Donor Registration',
      `${donorData.fullName} (${donorData.bloodGroup}, Age ${donorData.age}) registered to donate in ${donorData.city}.`,
      'info'
    );

    this.notifyListeners();
    return { success: true, message: 'Your blood donation registration has been submitted successfully.', donor: newDonor };
  }

  public updateDonorStatus(donorId: string, status: 'Approved' | 'Rejected'): { success: boolean; message: string } {
    const donors = this.getDonors();
    const donor = donors.find((d) => d.donorId === donorId);
    if (!donor) return { success: false, message: 'Donor not found.' };

    donor.status = status;
    localStorage.setItem(STORAGE_KEYS.DONORS, JSON.stringify(donors));

    this.addNotification({
      userId: donor.userId,
      title: `Donor Registration ${status}`,
      message:
        status === 'Approved'
          ? 'Your donor registration has been approved. Thank you for being a lifesaving hero!'
          : 'Your donor registration could not be approved due to medical criteria guidelines.',
      type: status === 'Approved' ? 'success' : 'warning',
    });

    this.notifyListeners();
    return { success: true, message: `Donor status updated to ${status}.` };
  }

  public deleteDonor(donorId: string): { success: boolean; message: string } {
    let donors = this.getDonors();
    donors = donors.filter((d) => d.donorId !== donorId);
    localStorage.setItem(STORAGE_KEYS.DONORS, JSON.stringify(donors));
    this.notifyListeners();
    return { success: true, message: 'Donor record deleted.' };
  }

  // --- Blood Requests ---
  public getRequests(userId?: string): BloodRequest[] {
    const raw = localStorage.getItem(STORAGE_KEYS.REQUESTS);
    const all: BloodRequest[] = raw ? JSON.parse(raw) : INITIAL_REQUESTS;
    if (userId) {
      return all.filter((r) => r.userId === userId);
    }
    return all;
  }

  public createBloodRequest(
    data: Omit<BloodRequest, 'requestId' | 'status' | 'createdAt'>
  ): { success: boolean; message: string; requestId: string } {
    const requests = this.getRequests();
    const currentSeq = Number(localStorage.getItem(STORAGE_KEYS.REQUEST_SEQ) || '105');
    const newSeq = currentSeq + 1;
    localStorage.setItem(STORAGE_KEYS.REQUEST_SEQ, newSeq.toString());

    const generatedId = `BBR-2026-${newSeq.toString().padStart(6, '0')}`;

    // Select suitable blood bank if not explicitly provided
    let bankId = data.bloodBankId;
    let bankName = data.bloodBankName;
    if (!bankId) {
      const banks = this.getBloodBanks();
      const match = banks.find((b) => b.city.toLowerCase() === data.city.toLowerCase()) || banks[0];
      bankId = match.bloodBankId;
      bankName = match.name;
    }

    const newRequest: BloodRequest = {
      ...data,
      requestId: generatedId,
      bloodBankId: bankId,
      bloodBankName: bankName,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };

    const updated = [newRequest, ...requests];
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(updated));

    // User notification
    this.addNotification({
      userId: data.userId,
      title: 'Blood Request Submitted',
      message: `Your request ${generatedId} for ${data.requiredUnits} Unit(s) of ${data.bloodGroup} at ${data.hospitalName} has been submitted.`,
      type: 'info',
    });

    // Notify admins / staff
    this.notifyAdmin(
      `${data.emergencyLevel === 'Critical' ? '🚨 CRITICAL ' : ''}Blood Request: ${data.bloodGroup}`,
      `Request ${generatedId} received for ${data.patientName} (${data.bloodGroup}, ${data.requiredUnits} units) at ${data.hospitalName}, ${data.city}.`,
      data.emergencyLevel === 'Critical' ? 'alert' : 'info'
    );

    this.notifyListeners();
    return {
      success: true,
      message: `Blood request submitted successfully. Request ID: ${generatedId}`,
      requestId: generatedId,
    };
  }

  public updateRequestStatus(
    requestId: string,
    status: BloodRequest['status'],
    reason?: string
  ): { success: boolean; message: string } {
    const requests = this.getRequests();
    const request = requests.find((r) => r.requestId === requestId);
    if (!request) return { success: false, message: 'Request not found.' };

    const prevStatus = request.status;

    // INVENTORY DEDUCTION LOGIC
    // When approving a request for the first time:
    if (status === 'Approved' && prevStatus !== 'Approved' && prevStatus !== 'Completed') {
      const inventory = this.getInventory();
      // Locate stock for matching blood bank and blood group
      const stockItem = inventory.find(
        (i) =>
          (i.bloodBankId === request.bloodBankId || !request.bloodBankId) &&
          i.bloodGroup === request.bloodGroup
      ) || inventory.find((i) => i.bloodGroup === request.bloodGroup && i.availableUnits >= request.requiredUnits);

      if (!stockItem || stockItem.availableUnits < request.requiredUnits) {
        return {
          success: false,
          message: `Cannot approve request: Insufficient stock for ${request.bloodGroup}. Available: ${
            stockItem ? stockItem.availableUnits : 0
          } Units, Required: ${request.requiredUnits} Units. Please replenish inventory first.`,
        };
      }

      // Deduct available units safely and prevent negative stock
      stockItem.availableUnits -= request.requiredUnits;
      stockItem.reservedUnits += request.requiredUnits;
      stockItem.updatedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
      request.approvedAt = new Date().toISOString();
    }

    // When moving from Approved to Completed (units dispensed)
    if (status === 'Completed' && prevStatus === 'Approved') {
      const inventory = this.getInventory();
      const stockItem = inventory.find(
        (i) => i.bloodBankId === request.bloodBankId && i.bloodGroup === request.bloodGroup
      );
      if (stockItem && stockItem.reservedUnits >= request.requiredUnits) {
        stockItem.reservedUnits -= request.requiredUnits;
        stockItem.updatedAt = new Date().toISOString();
        localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
      }
    }

    // When rejected after approval (restore stock)
    if (status === 'Rejected' && prevStatus === 'Approved') {
      const inventory = this.getInventory();
      const stockItem = inventory.find(
        (i) => i.bloodBankId === request.bloodBankId && i.bloodGroup === request.bloodGroup
      );
      if (stockItem) {
        stockItem.availableUnits += request.requiredUnits;
        stockItem.reservedUnits = Math.max(0, stockItem.reservedUnits - request.requiredUnits);
        stockItem.updatedAt = new Date().toISOString();
        localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
      }
      request.rejectedReason = reason || 'Declined by blood bank medical authority.';
    }

    request.status = status;
    localStorage.setItem(STORAGE_KEYS.REQUESTS, JSON.stringify(requests));

    // Notify user of status update
    this.addNotification({
      userId: request.userId,
      title: `Blood Request ${status}`,
      message: `Your blood request ${requestId} for ${request.bloodGroup} has been marked as ${status}.${
        reason ? ` Note: ${reason}` : ''
      }`,
      type: status === 'Approved' || status === 'Completed' ? 'success' : status === 'Rejected' ? 'warning' : 'info',
    });

    this.notifyListeners();
    return { success: true, message: `Request status updated to ${status}.` };
  }

  // --- Blood Banks ---
  public getBloodBanks(): BloodBank[] {
    const raw = localStorage.getItem(STORAGE_KEYS.BANKS);
    return raw ? JSON.parse(raw) : INITIAL_BLOOD_BANKS;
  }

  public addBloodBank(bankData: Omit<BloodBank, 'bloodBankId'>): { success: boolean; message: string; bank?: BloodBank } {
    const banks = this.getBloodBanks();
    const newBank: BloodBank = {
      ...bankData,
      bloodBankId: `bb-${Date.now().toString(36)}`,
    };

    const updated = [...banks, newBank];
    localStorage.setItem(STORAGE_KEYS.BANKS, JSON.stringify(updated));

    // Initialize basic inventory items for all 8 blood groups for new bank
    const inventory = this.getInventory();
    const groups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    const expiry = new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    groups.forEach((bg) => {
      inventory.push({
        inventoryId: `inv-${Date.now().toString(36)}-${bg}`,
        bloodBankId: newBank.bloodBankId,
        bloodBankName: newBank.name,
        bloodGroup: bg,
        availableUnits: 10,
        reservedUnits: 0,
        expiryDate: expiry,
        updatedAt: new Date().toISOString(),
      });
    });

    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));
    this.notifyListeners();
    return { success: true, message: 'Blood bank added successfully.', bank: newBank };
  }

  public updateBloodBank(bankId: string, updates: Partial<BloodBank>): { success: boolean; message: string } {
    const banks = this.getBloodBanks();
    const index = banks.findIndex((b) => b.bloodBankId === bankId);
    if (index === -1) return { success: false, message: 'Blood bank not found.' };

    banks[index] = { ...banks[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.BANKS, JSON.stringify(banks));
    this.notifyListeners();
    return { success: true, message: 'Blood bank details updated.' };
  }

  public deleteBloodBank(bankId: string): { success: boolean; message: string } {
    let banks = this.getBloodBanks();
    banks = banks.filter((b) => b.bloodBankId !== bankId);
    localStorage.setItem(STORAGE_KEYS.BANKS, JSON.stringify(banks));

    // Also cleanup inventory
    let inventory = this.getInventory();
    inventory = inventory.filter((i) => i.bloodBankId !== bankId);
    localStorage.setItem(STORAGE_KEYS.INVENTORY, JSON.stringify(inventory));

    this.notifyListeners();
    return { success: true, message: 'Blood bank removed.' };
  }

  // --- Donations ---
  public getDonations(): DonationRecord[] {
    const raw = localStorage.getItem(STORAGE_KEYS.DONATIONS);
    return raw ? JSON.parse(raw) : INITIAL_DONATIONS;
  }

  public recordDonation(donation: Omit<DonationRecord, 'donationId'>): { success: boolean; message: string } {
    const donations = this.getDonations();
    const newDonation: DonationRecord = {
      ...donation,
      donationId: `DON-2026-${(donations.length + 904).toString()}`,
    };

    const updated = [newDonation, ...donations];
    localStorage.setItem(STORAGE_KEYS.DONATIONS, JSON.stringify(updated));

    // Automatically increase inventory units
    if (donation.status === 'Completed') {
      this.addInventoryStock({
        bloodBankId: donation.bloodBankId,
        bloodBankName: donation.bloodBankName,
        bloodGroup: donation.bloodGroup,
        availableUnits: donation.units,
        reservedUnits: 0,
        expiryDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      });
    }

    this.notifyListeners();
    return { success: true, message: 'Donation recorded and blood inventory updated!' };
  }

  // --- Notifications ---
  public getNotifications(userId?: string): AppNotification[] {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    const notifs: AppNotification[] = raw ? JSON.parse(raw) : INITIAL_NOTIFICATIONS;
    if (userId) {
      return notifs.filter((n) => n.userId === userId || n.userId === 'all');
    }
    return notifs;
  }

  public addNotification(notif: Omit<AppNotification, 'notificationId' | 'createdAt' | 'isRead'>) {
    const notifs = this.getNotifications();
    const newNotif: AppNotification = {
      ...notif,
      notificationId: `notif-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString(),
      isRead: false,
    };
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify([newNotif, ...notifs]));
    this.notifyListeners();
  }

  private notifyAdmin(title: string, message: string, type: AppNotification['type']) {
    const users = this.getUsers();
    const admin = users.find((u) => u.role === 'ADMIN') || INITIAL_USERS[0];
    this.addNotification({
      userId: admin.id,
      title,
      message,
      type,
    });
  }

  public markNotificationAsRead(notifId: string) {
    const notifs = this.getNotifications();
    const target = notifs.find((n) => n.notificationId === notifId);
    if (target) {
      target.isRead = true;
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
      this.notifyListeners();
    }
  }

  public markAllNotificationsAsRead(userId: string) {
    const notifs = this.getNotifications();
    notifs.forEach((n) => {
      if (n.userId === userId || n.userId === 'all') {
        n.isRead = true;
      }
    });
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifs));
    this.notifyListeners();
  }

  // --- Admin Stats & Reports ---
  public getAdminStats() {
    const users = this.getUsers();
    const donors = this.getDonors();
    const requests = this.getRequests();
    const inventory = this.getInventory();
    const banks = this.getBloodBanks();

    const totalUsers = users.length;
    const totalDonors = donors.length;
    const totalRequests = requests.length;
    const pendingRequests = requests.filter((r) => r.status === 'Pending').length;
    const completedRequests = requests.filter((r) => r.status === 'Completed').length;
    const approvedRequests = requests.filter((r) => r.status === 'Approved').length;
    const totalBloodUnits = inventory.reduce((sum, i) => sum + i.availableUnits, 0);
    const availableBanks = banks.length;

    return {
      totalUsers,
      totalDonors,
      totalRequests,
      pendingRequests,
      completedRequests,
      approvedRequests,
      totalBloodUnits,
      availableBanks,
    };
  }

  public getReportsData() {
    const inventory = this.getInventory();
    const donations = this.getDonations();
    const requests = this.getRequests();

    const groups: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

    const stockByGroup = groups.map((bg) => {
      const units = inventory
        .filter((i) => i.bloodGroup === bg)
        .reduce((sum, i) => sum + i.availableUnits, 0);
      return { bloodGroup: bg, units };
    });

    const donationsByGroup = groups.map((bg) => {
      const units = donations
        .filter((d) => d.bloodGroup === bg && d.status === 'Completed')
        .reduce((sum, d) => sum + d.units, 0);
      return { bloodGroup: bg, units };
    });

    const requestsByStatus = {
      Pending: requests.filter((r) => r.status === 'Pending').length,
      Approved: requests.filter((r) => r.status === 'Approved').length,
      Processing: requests.filter((r) => r.status === 'Processing').length,
      Completed: requests.filter((r) => r.status === 'Completed').length,
      Rejected: requests.filter((r) => r.status === 'Rejected').length,
    };

    return {
      stockByGroup,
      donationsByGroup,
      requestsByStatus,
      totalDonations: donations.length,
      totalRequests: requests.length,
    };
  }
}

export const bloodBankService = new BloodBankService();
