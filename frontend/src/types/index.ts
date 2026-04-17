export interface User {
  uid: string;
  email: string;
  role: 'attendee' | 'admin' | 'vendor';
  ticketId?: string;
  seatInfo?: SeatInfo;
  location?: GeoLocation;
  createdAt: Date;
  updatedAt: Date;
}

export interface SeatInfo {
  section: string;
  row: string;
  seat: string;
}

export interface GeoLocation {
  lat: number;
  lng: number;
  timestamp: Date;
}

export interface Ticket {
  ticketId: string;
  eventId: string;
  userId: string;
  qrCode: string;
  seatInfo: SeatInfo;
  status: 'valid' | 'used' | 'expired';
  purchaseDate: Date;
  eventDate: Date;
}

export interface Event {
  eventId: string;
  name: string;
  venue: string;
  date: Date;
  sections: VenueSection[];
  status: 'scheduled' | 'live' | 'completed';
}

export interface VenueSection {
  id: string;
  name: string;
  capacity: number;
  vendorZones: string[];
}

export interface Venue {
  venueId: string;
  name: string;
  address: string;
  coordinates: GeoLocation;
  zones: VenueZone[];
}

export interface VenueZone {
  zoneId: string;
  name: string;
  type: 'seating' | 'food' | 'vendor' | 'restroom' | 'exit';
  coordinates: GeoLocation;
}

export interface Vendor {
  vendorId: string;
  userId: string;
  name: string;
  location?: GeoLocation;
  status: 'available' | 'busy' | 'offline';
  currentOrder?: string;
  zone: string;
  metrics: VendorMetrics;
}

export interface VendorMetrics {
  ordersCompleted: number;
  averageDeliveryTime: number;
  rating: number;
}

export interface Order {
  orderId: string;
  userId: string;
  vendorId: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  deliveryType: 'seat' | 'pickup';
  seatInfo?: SeatInfo;
  payment: PaymentInfo;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
}

export type OrderStatus = 
  | 'pending' 
  | 'confirmed' 
  | 'preparing' 
  | 'ready' 
  | 'delivered' 
  | 'cancelled';

export interface PaymentInfo {
  method: 'googlepay' | 'card';
  transactionId: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface MenuItem {
  menuItemId: string;
  vendorId: string;
  category: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  available: boolean;
  preparationTime: number;
}

export interface CrowdData {
  dataId: string;
  eventId: string;
  zoneId: string;
  density: number;
  count: number;
  timestamp: Date;
}

export interface DemandData {
  dataId: string;
  eventId: string;
  zoneId: string;
  orders: number;
  revenue: number;
  predictedDemand: number;
  timestamp: Date;
}

export interface Prediction {
  zoneId: string;
  predictedDensity: number;
  predictedDemand: number;
  confidence: number;
  timestamp: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'crowd' | 'order' | 'emergency' | 'general';
  title: string;
  message: string;
  read: boolean;
  timestamp: Date;
}
