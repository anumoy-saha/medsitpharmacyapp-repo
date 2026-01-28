
export interface Medicine {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  popular: boolean;
  description?: string;
  dosage?: string;
  sideEffects?: string[];
}

export interface CartItem extends Medicine {
  quantity: number;
}

export interface User {
  name: string;
  phone: string;
  membershipType: 'Basic' | 'Silver' | 'Gold' | 'Platinum';
  profilePic?: string;
  walletBalance: number;
  address?: string;
}

export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  fee: number;
  rating: number;
  image: string;
}

export interface Consultation {
  id: string;
  doctorId: number;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  reason?: string;
  mode: 'Video' | 'In-Clinic';
  status: 'Completed' | 'Upcoming' | 'Cancelled';
  doctorImage: string;
}

export interface SavedPaymentMethod {
  id: string;
  type: 'Card' | 'UPI';
  label: string; 
  provider?: string; 
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: 'Processing' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  paymentMethod?: 'COD' | 'UPI' | 'Card' | 'Wallet';
  tip?: number;
  deliveryNote?: string;
  tracking?: {
    lat: number;
    lng: number;
    partnerName: string;
    partnerPhone: string;
    partnerRating: number;
    partnerImage?: string;
    eta: number; 
    situation?: string;
  };
}

export interface AmbulanceType {
  id: string;
  name: string;
  description: string;
  price: number;
  icon: any;
}

export interface Hospital {
  id: string;
  name: string;
  distance: string;
  address: string;
  type: 'Hospital' | 'Nursing Home';
}

export interface AmbulanceOrder {
  id: string;
  type: string;
  destination: string;
  driverName: string;
  driverPhone: string;
  driverRating: number;
  driverImage: string;
  eta: number; // in minutes
  status: 'Searching' | 'On the way' | 'Reached' | 'Cancelled';
}

export interface Reminder {
  id: string;
  medicineName: string;
  dosage: string;
  time: string; 
  frequency: 'Daily' | 'Twice a Day' | 'Thrice a Day';
  active: boolean;
}

export interface Address {
  id: string;
  label: string; // Home, Office, etc.
  fullAddress: string;
}

export interface Prescription {
  id: string;
  date: string;
  doctor: string;
  imageUrl: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
}

export type TabType = 'medicines' | 'doctors' | 'assistant' | 'ambulance' | 'orders' | 'profile' | 'reminders';
export type AuthMode = 'login' | 'signup';

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export type DispatchStep = 'idle' | 'confirming' | 'dispatched';
