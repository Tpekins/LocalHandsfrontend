export enum Role {
  ADMIN = 'ADMIN',
  CLIENT = 'CLIENT',
  PROVIDER = 'PROVIDER',
  GUEST = 'GUEST',
}

export enum ServiceOrderStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  DISPUTED = 'disputed',
  OPEN = "OPEN",
}

export interface NavItem {
  label: string;
  path: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  children?: NavItem[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  password?: string; // This should be handled securely and not stored in plain text in a real app
  role: Role;
  avatar: string;
  registeredAt: string;
  status: string;
  profileHeadline?: string;
  profileBio?: string;
  location?: string;
  portfolioImages?: string[];
  rating?: number;
  reviewsCount?: number;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  imageUrl: string;
}

export interface Service {
  id: string;
  providerId: string;
  providerName: string;
  title: string;
  description: string;
  category: Category;
  price: number;
  priceType: 'fixed' | 'hourly' | 'negotiable';
  location: string;
  images: string[];
  rating: number;
  reviewsCount: number;
}

export interface ServiceOrder {
    id: string;
    clientId: string;
    clientName: string;
    title: string;
    description: string;
    category: Category;
    budget?: number;
    deadline: string;
    postedDate: string;
    status: ServiceOrderStatus;
    proposalsCount: number;
}

export interface Proposal {
    id: string;
    serviceOrderId: string;
    providerId: string;
    providerName: string;
    providerAvatar: string;
    coverLetter: string;
    proposedPrice?: number;
    estimatedDuration: string;
    submittedDate: string;
    status: 'Pending' | 'Accepted' | 'Rejected';
}

export interface Contract {
    id: string;
    clientId: string;
    provider: {
        id: string;
        name: string;
        phone?: string;
    };
    title: string;
    price: number;
    status: 'active' | 'completed' | 'cancelled';
    startDate: Date;
    completionDate?: Date;
}


export interface Review {
    id: string;
    serviceId: string;
    reviewerId: string;
    reviewerName: string;
    reviewedId: string;
    rating: 1 | 2 | 3 | 4 | 5;
    comment: string;
    date: string;
}

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
    participants: Pick<User, 'id' | 'name' | 'avatar'>[];
    messages: ChatMessage[];
    lastMessage: ChatMessage;
    unreadCount: number;
}

export enum NotificationType {
  PROPOSAL_ACCEPTED = 'proposal_accepted',
  NEW_MESSAGE = 'new_message',
  JOB_INVITE = 'job_invite',
  PROPOSAL_REJECTED = 'proposal_rejected',
  PAYMENT_RECEIVED = 'payment_received',
}

export interface Notification {
  id: string;
  userId: string; 
  type: NotificationType;
  titleKey: string;
  descriptionKey: string;
  titleParams?: { [key: string]: any };
  descriptionParams?: { [key: string]: any };
  entityId: string; // e.g., jobId, proposalId, messageThreadId
  isRead: boolean;
  timestamp: string;
}
