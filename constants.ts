import { Role, NavItem } from './types';
import { HomeIcon, BriefcaseIcon, UserGroupIcon, CogIcon, ChartBarIcon, UsersIcon, ShieldCheckIcon, DocumentTextIcon, PlusCircleIcon, InboxIcon, PresentationChartLineIcon, BuildingStorefrontIcon, CalendarIcon, ChatBubbleLeftRightIcon } from './components/icons/Icons'; // Placeholder, create these

export const APP_NAME = "LocalHands";

export const USER_ROLES: Role[] = [Role.CLIENT, Role.PROVIDER, Role.ADMIN];
export const ACCOUNT_TYPES: Role[] = [Role.CLIENT, Role.PROVIDER];

export const PUBLIC_NAV_ITEMS: NavItem[] = [
  { label: 'Home', path: '/', icon: HomeIcon },
  { label: 'Browse Services', path: '/services', icon: BuildingStorefrontIcon },
  // { label: 'How It Works', path: '/how-it-works', icon: QuestionMarkCircleIcon },
  // { label: 'Become a Provider', path: '/register-provider', icon: UserPlusIcon },
];

export const CLIENT_NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: '/client/dashboard', icon: ChartBarIcon },
  { label: 'My Contracts', path: '/client/contracts', icon: DocumentTextIcon },
  { label: 'Post New Job', path: '/client/post-job', icon: PlusCircleIcon },
  { label: 'My Proposals', path: '/client/my-proposals', icon: InboxIcon },
  { label: 'Active Jobs', path: '/client/active-jobs', icon: BriefcaseIcon },
  { label: 'Bookings', path: '/client/bookings', icon: CalendarIcon },
  { label: 'Chat', path: '/client/chat', icon: InboxIcon },
  { label: 'Settings', path: '/client/settings', icon: CogIcon },
];

export const PROVIDER_NAV_ITEMS: NavItem[] = [
  { label: 'My Services', path: '/provider/service-management', icon: BuildingStorefrontIcon },
  { label: 'Dashboard', path: '/provider/dashboard', icon: PresentationChartLineIcon },
  { label: 'Browse Jobs', path: '/provider/browse-jobs', icon: BriefcaseIcon },
  { label: 'Proposals', path: '/provider/proposals', icon: DocumentTextIcon },
  { label: 'Earnings', path: '/provider/earnings', icon: ChartBarIcon }, 
  { label: 'Messages', path: '/provider/chat', icon: ChatBubbleLeftRightIcon },
  { label: 'Settings', path: '/provider/settings', icon: CogIcon }
];

export const ADMIN_NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: ChartBarIcon },
  { label: 'User Management', path: '/admin/user-management', icon: UsersIcon },
  { label: 'Service Management', path: '/admin/service-management', icon: BriefcaseIcon }, 
  { label: 'Category Management', path: '/admin/category-management', icon: UserGroupIcon }, 
  { label: 'System Settings', path: '/admin/settings', icon: CogIcon },
 { label: 'Transactions', path: '/admin/transactions', icon: DocumentTextIcon },
 { label: 'Reports', path: '/admin/reports', icon: DocumentTextIcon },
];

export const DEFAULT_AVATAR = 'https://picsum.photos/seed/avatar/100/100';

export const HOW_IT_WORKS_STEPS = [
  { id: 1, title: 'Find Your Pro', description: 'Browse services or post a job to find skilled local professionals.', icon: UsersIcon }, // Placeholder
  { id: 2, title: 'Hire with Confidence', description: 'Review proposals, chat with providers, and hire the best fit for your needs.', icon: ShieldCheckIcon }, // Placeholder
  { id: 3, title: 'Pay Securely', description: 'Once the job is done, pay securely through our platform.', icon: DocumentTextIcon } // Placeholder
];
    