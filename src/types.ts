export enum UserRole {
  ADMIN = 'ADMIN',
  CLIENT = 'CLIENT',
  PROVIDER = 'PROVIDER',
}

export enum ServiceOrderStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED',
}

export enum ContractStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  DISPUTED = 'DISPUTED',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export enum PaymentMethod {
  MTN_MOBILE_MONEY = 'MTN_MOBILE_MONEY',
}

export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELED = 'CANCELED',
  COMPLETED = 'COMPLETED',
}

export enum ProposalStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

export enum VerificationStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
}

export enum AssetType {
  IMAGE = 'IMAGE',
  AREA = 'AREA',
}

export interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  children?: NavItem[];
}

export interface User {
  id: number;
  name: string;
  email: string;
  phoneNumber: string;
  role: UserRole;
  profile?: Profile;
  createdAt: string;
  lastLogin?: string;
}

export interface Profile {
  id: number;
  userId: number;
  bio?: string;
  mobileMoneyNumber?: string;
  bankAccountNumber?: string;
  nationalIdUrl?: string;
  verificationStatus?: VerificationStatus;
  location?: string;
  createdAt: string;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
}

export interface ServiceAsset {
  id: number;
  serviceId: number;
  type: AssetType;
  imageUrl?: string;
  caption?: string;
  areaName?: string;
  createdAt: string;
}

export interface Provider {
  id: number;
  userId: number;
  services: Service[];
  createdAt: string;
}

export interface Service {
  id: number;
  title: string;
  description: string;
  price: number;
  status: string;
  featured: boolean;
  provider: User;
  providerId: number;
  category?: Category;
  categoryId?: number;
  assets: ServiceAsset[];
  views: number;
  createdAt: string;
}

export interface ServiceOrder {
  id: number;
  service: Service;
  serviceId: number;
  client: User;
  clientId: number;
  description: string;
  budget?: number;
  status: ServiceOrderStatus;
  contract?: Contract;
  createdAt: string;
}

export interface Proposal {
  id: number;
  provider: User;
  providerId: number;
  service: Service;
  serviceId: number;
  coverLetter: string;
  bidAmount: number;
  status: ProposalStatus;
  contract?: Contract;
  contractId?: number;
  createdAt: string;
}

export interface Contract {
  id: number;
  serviceOrder: ServiceOrder;
  serviceOrderId: number;
  escrowAmount: number;
  status: ContractStatus;
  payments: Payment[];
  users?: User[];
  proposals?: Proposal[];
  createdAt: string;
}

export interface Payment {
  id: number;
  contractId: number;
  amount: number;
  paymentMethod: PaymentMethod;
  transactionId: string;
  status: PaymentStatus;
  createdAt: string;
}

export interface Review {
  id: number;
  contractId: number;
  reviewer: User;
  reviewerId: number;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface Booking {
  id: number;
  service: Service;
  serviceId: number;
  client: User;
  clientId: number;
  startTime: string;
  endTime: string;
  location?: string;
  status: BookingStatus;
  createdAt: string;
}

export interface Message {
  id: number;
  senderId: number;
  sender: User;
  receiverId: number;
  receiver: User;
  content: string;
  timestamp: string;
}

export interface ServicePackage {
  id: number;
  providerId: number;
  title: string;
  description?: string;
  price: number;
  createdAt: string;
}

export interface Notification {
  id: number;
  userId: number;
  type: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface Availability {
  id: number;
  providerId: number;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface SystemSettings {
  id: number;
  maintenanceMode: boolean;
  allowRegistration: boolean;
  reviewAutoApprove: boolean;
  paymentGateway: string;
  emailNotifications: boolean;
  maxFileSize: number;
  currency: string;
  currencySymbol: string;
  supportEmail?: string;
  createdAt: string;
  updatedAt: string;
}

// UI-only types (no backend counterpart)
export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatar: string;
  text: string;
}

export interface ChartDataPoint {
  name: string;
  value: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: Date;
  imageUrl?: string;
}

export interface ChatConversation {
  id: string;
  participants: Pick<User, 'id' | 'name'>[];
  messages: ChatMessage[];
  lastMessage: ChatMessage;
  unreadCount: number;
}
