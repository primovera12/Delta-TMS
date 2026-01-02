// Enums
export type UserRole =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'OPERATIONS_MANAGER'
  | 'DISPATCHER'
  | 'DRIVER'
  | 'FACILITY_STAFF'
  | 'FAMILY_MEMBER'
  | 'PATIENT';

export type UserStatus =
  | 'ACTIVE'
  | 'INACTIVE'
  | 'SUSPENDED'
  | 'PENDING_VERIFICATION';

export type TripStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'ASSIGNED'
  | 'DRIVER_EN_ROUTE'
  | 'DRIVER_ARRIVED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'NO_SHOW';

export type TripType =
  | 'ONE_WAY'
  | 'ROUND_TRIP'
  | 'MULTI_STOP'
  | 'WILL_CALL';

export type StopType =
  | 'PICKUP'
  | 'DROPOFF'
  | 'PICKUP_DROPOFF'
  | 'APPOINTMENT';

export type VehicleType =
  | 'SEDAN'
  | 'WHEELCHAIR_ACCESSIBLE'
  | 'STRETCHER_VAN'
  | 'BARIATRIC_VEHICLE';

export type DriverStatus =
  | 'OFFLINE'
  | 'ONLINE'
  | 'AVAILABLE'
  | 'ASSIGNED'
  | 'EN_ROUTE'
  | 'ON_TRIP'
  | 'BREAK';

export type PaymentStatus =
  | 'PENDING'
  | 'AUTHORIZED'
  | 'CAPTURED'
  | 'FAILED'
  | 'REFUNDED'
  | 'PARTIALLY_REFUNDED'
  | 'INVOICED'
  | 'PAID';

// Base User type
export interface User {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: Date | string;
  role: UserRole;
  status: UserStatus;
  emailVerified: boolean;
  phoneVerified: boolean;
  elderMode: boolean;
  textSize: string;
  highContrast: boolean;
  createdAt: Date | string;
  updatedAt: Date | string;
  lastLoginAt?: Date | string;
}

// Address type
export interface Address {
  id?: string;
  label?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  latitude: number;
  longitude: number;
  contactName?: string;
  contactPhone?: string;
  pickupInstructions?: string;
  dropoffInstructions?: string;
}

// Trip Stop type
export interface TripStop {
  id: string;
  tripId: string;
  stopOrder: number;
  stopType: StopType;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  latitude: number;
  longitude: number;
  contactName?: string;
  contactPhone?: string;
  placeName?: string;
  scheduledTime?: Date | string;
  estimatedArrivalTime?: Date | string;
  actualArrivalTime?: Date | string;
  actualDepartureTime?: Date | string;
  expectedWaitMinutes: number;
  status: 'PENDING' | 'EN_ROUTE' | 'ARRIVED' | 'COMPLETED' | 'SKIPPED';
  instructions?: string;
}

// Trip type
export interface Trip {
  id: string;
  tripNumber: string;
  tripType: TripType;
  linkedTripId?: string;
  bookedById: string;
  facilityId?: string;
  driverId?: string;
  vehicleId?: string;
  firstPickupTime: Date | string;
  lastDropoffTime?: Date | string;
  totalStops: number;
  pickupAddressLine1: string;
  pickupCity: string;
  pickupState: string;
  pickupZipCode: string;
  pickupLatitude: number;
  pickupLongitude: number;
  dropoffAddressLine1: string;
  dropoffCity: string;
  dropoffState: string;
  dropoffZipCode: string;
  dropoffLatitude: number;
  dropoffLongitude: number;
  scheduledPickupTime: Date | string;
  appointmentTime?: Date | string;
  actualPickupTime?: Date | string;
  actualDropoffTime?: Date | string;
  isAsap: boolean;
  isWillCall: boolean;
  willCallActivatedAt?: Date | string;
  totalDistanceMiles: number;
  estimatedDurationMinutes: number;
  vehicleType: VehicleType;
  wheelchairRequired: boolean;
  stretcherRequired: boolean;
  oxygenRequired: boolean;
  bariatricRequired: boolean;
  baseFare: number;
  distanceFare: number;
  timeFare: number;
  accessibilitySurcharge: number;
  additionalStopsFee: number;
  waitTimeFee: number;
  subtotal: number;
  discountAmount: number;
  totalFare: number;
  tipAmount: number;
  status: TripStatus;
  currentStopIndex: number;
  paymentStatus: PaymentStatus;
  bookingNotes?: string;
  driverNotes?: string;
  dispatcherNotes?: string;
  passengerRating?: number;
  passengerFeedback?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  stops?: TripStop[];
  passengers?: TripPassenger[];
  driver?: DriverProfile;
  bookedBy?: User;
}

// Trip Passenger type
export interface TripPassenger {
  id: string;
  tripId: string;
  userId?: string;
  firstName: string;
  lastName: string;
  phone?: string;
  isPrimary: boolean;
  boardingStopId?: string;
  alightingStopId?: string;
  wheelchairRequired: boolean;
  stretcherRequired: boolean;
  oxygenRequired: boolean;
  isCompanion: boolean;
  specialNeeds?: string;
}

// Driver Profile type
export interface DriverProfile {
  id: string;
  userId: string;
  employeeId?: string;
  licenseNumber: string;
  licenseState: string;
  licenseExpiry: Date | string;
  backgroundCheckStatus: 'PENDING' | 'PASSED' | 'FAILED' | 'EXPIRED';
  drugTestStatus: 'PENDING' | 'PASSED' | 'FAILED' | 'EXPIRED';
  cprCertified: boolean;
  cprExpiry?: Date | string;
  firstAidCertified: boolean;
  rating: number;
  totalTrips: number;
  completedTrips: number;
  status: DriverStatus;
  currentLatitude?: number;
  currentLongitude?: number;
  currentHeading?: number;
  lastLocationUpdate?: Date | string;
  user?: User;
}

// Vehicle type
export interface Vehicle {
  id: string;
  driverId?: string;
  make: string;
  model: string;
  year: number;
  color: string;
  licensePlate: string;
  vin: string;
  vehicleType: VehicleType;
  seatingCapacity: number;
  wheelchairCapacity: number;
  stretcherCapacity: number;
  wheelchairAccessible: boolean;
  stretcherCapable: boolean;
  oxygenEquipped: boolean;
  hasLift: boolean;
  hasRamp: boolean;
  isActive: boolean;
  isInService: boolean;
  currentMileage?: number;
}

// Facility type
export interface Facility {
  id: string;
  name: string;
  type: string;
  phone: string;
  email?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;
  entranceInstructions?: string;
  parkingInstructions?: string;
  billingType: 'PAY_PER_RIDE' | 'MONTHLY_INVOICE' | 'CONTRACT_RATE';
  isActive: boolean;
}

// Medical Profile type
export interface MedicalProfile {
  id: string;
  userId: string;
  mobilityAids: string[];
  wheelchairType?: string;
  canTransferIndependently: boolean;
  requiresLiftAssistance: boolean;
  oxygenRequired: boolean;
  oxygenFlowRate?: string;
  weightLbs?: number;
  heightInches?: number;
  medicalConditions: string[];
  medications: string[];
  allergies: string[];
  hearingImpaired: boolean;
  visuallyImpaired: boolean;
  primaryLanguage: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  emergencyContactRelationship?: string;
  specialInstructions?: string;
  driverNotes?: string;
}

// Standing Order type
export interface StandingOrder {
  id: string;
  orderNumber: string;
  facilityId?: string;
  facilityPatientId?: string;
  patientUserId?: string;
  frequency: string;
  daysOfWeek: string[];
  pickupTime: string;
  appointmentTime?: string;
  pickupAddressLine1: string;
  pickupCity: string;
  pickupState: string;
  pickupZipCode: string;
  dropoffAddressLine1: string;
  dropoffCity: string;
  dropoffState: string;
  dropoffZipCode: string;
  includeReturn: boolean;
  returnTime?: string;
  isReturnWillCall: boolean;
  vehicleType: VehicleType;
  wheelchairRequired: boolean;
  stretcherRequired: boolean;
  oxygenRequired: boolean;
  isActive: boolean;
  startDate: Date | string;
  endDate?: Date | string;
}

// API Response types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  dateOfBirth?: string;
  acceptTerms: boolean;
}

export interface TripBookingForm {
  tripType: TripType;
  patientId?: string;
  isNewPatient: boolean;
  patient?: {
    firstName: string;
    lastName: string;
    phone: string;
    dateOfBirth?: string;
  };
  pickupAddress: Address;
  dropoffAddress: Address;
  additionalStops?: Address[];
  scheduledDate: string;
  scheduledTime: string;
  appointmentTime?: string;
  isAsap: boolean;
  vehicleType: VehicleType;
  wheelchairRequired: boolean;
  stretcherRequired: boolean;
  oxygenRequired: boolean;
  bariatricRequired: boolean;
  companions: number;
  bookingNotes?: string;
  specialRequirements?: string;
  isRoundTrip: boolean;
  returnTime?: string;
  isWillCallReturn: boolean;
}

// Dashboard Stats types
export interface DashboardStats {
  todayTrips: number;
  activeTrips: number;
  completedTrips: number;
  cancelledTrips: number;
  driversOnline: number;
  driversOnTrip: number;
  driversOffline: number;
  revenue: number;
  averageRating: number;
}

// Notification type
export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date | string;
  tripId?: string;
}
