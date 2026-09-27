export type Role = 'USER' | 'STAFF' | 'ADMIN';

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type RequestStatus = 'Pending' | 'Approved' | 'Rejected' | 'Processing' | 'Completed';

export type EmergencyLevel = 'Normal' | 'Urgent' | 'Critical';

export type DonorStatus = 'Pending' | 'Approved' | 'Rejected';

export interface User {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  role: Role;
  dateOfBirth?: string;
  gender?: 'Male' | 'Female' | 'Other';
  bloodGroup?: BloodGroup;
  address?: string;
  city: string;
  state?: string;
  pincode?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface Donor {
  donorId: string;
  userId: string;
  fullName: string;
  bloodGroup: BloodGroup;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  weight: number;
  mobile: string;
  city: string;
  address: string;
  lastDonationDate?: string;
  preferredDonationDate: string;
  status: DonorStatus;
  createdAt: string;
}

export interface BloodInventoryItem {
  inventoryId: string;
  bloodBankId: string;
  bloodBankName: string;
  bloodGroup: BloodGroup;
  availableUnits: number;
  reservedUnits: number;
  expiryDate: string;
  updatedAt: string;
}

export interface BloodRequest {
  requestId: string; // e.g. BBR-2026-000123
  userId: string;
  patientName: string;
  patientAge: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: BloodGroup;
  requiredUnits: number;
  hospitalName: string;
  hospitalAddress: string;
  city: string;
  attendantName: string;
  attendantMobile: string;
  requiredDate: string;
  emergencyLevel: EmergencyLevel;
  additionalInformation?: string;
  status: RequestStatus;
  bloodBankId?: string;
  bloodBankName?: string;
  createdAt: string;
  approvedAt?: string;
  rejectedReason?: string;
}

export interface BloodBank {
  bloodBankId: string;
  name: string;
  registrationNumber: string;
  contactNumber: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  openingTime: string;
  closingTime: string;
}

export interface DonationRecord {
  donationId: string;
  donorId: string;
  donorName: string;
  bloodBankId: string;
  bloodBankName: string;
  bloodGroup: BloodGroup;
  donationDate: string;
  units: number;
  status: 'Completed' | 'Scheduled' | 'Cancelled';
}

export interface AppNotification {
  notificationId: string;
  userId: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  type: 'info' | 'success' | 'warning' | 'alert';
}

export interface BloodAvailabilitySummary {
  bloodGroup: BloodGroup;
  totalUnits: number;
  reservedUnits: number;
  availableBanksCount: number;
  status: 'Available' | 'Low Stock' | 'Not Available';
}
