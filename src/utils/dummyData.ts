import {
  User,
  UserRole,
  Service,
  Category,
  ServiceOrder,
  ServiceOrderStatus,
  Proposal,
  ProposalStatus,
  Review,
  Testimonial,
  ChartDataPoint,
  Contract,
  ContractStatus,
  ChatMessage,
  ChatConversation,
  Profile,
  AssetType,
} from '../types';

const USER_NAMES = ['Alice Smith', 'Bob Johnson', 'Carol Williams', 'David Brown', 'Eve Jones', 'Frank Garcia', 'Grace Miller', 'Henry Davis', 'Ivy Rodriguez', 'Jack Wilson'];

const CATEGORY_DATA = [
  { name: 'Automotive', description: 'Car repair, mechanics, and detailing.' },
  { name: 'Beauty & Wellness', description: 'Hairdressing, makeup, nails, and massage.' },
  { name: 'Catering', description: 'Event catering and personal chefs.' },
  { name: 'Cleaning', description: 'Home and office cleaning services.' },
  { name: 'Cooking', description: 'Personal cooks and meal preparation.' },
  { name: 'Electrical', description: 'Electrical installation and repairs.' },
  { name: 'Event Planning', description: 'Wedding, party, and corporate event planning.' },
  { name: 'Farming & Gardening', description: 'Landscaping and farm assistance.' },
  { name: 'Handyman', description: 'General home repairs and installations.' },
  { name: 'Home Repair', description: 'Specialized home repair services.' },
  { name: 'Laundry', description: 'Laundry and ironing services.' },
  { name: 'Moving', description: 'Moving and relocation services.' },
  { name: 'Painting', description: 'Interior and exterior painting.' },
  { name: 'Photography', description: 'Event and portrait photography.' },
  { name: 'Plumbing', description: 'Plumbing installation and repairs.' },
  { name: 'Private Tutoring', description: 'Academic and skill-based tutoring.' },
  { name: 'Tailoring', description: 'Custom clothing and alterations.' },
  { name: 'Tech Support', description: 'Computer and phone repair.' },
  { name: 'Transportation', description: 'Personal drivers and delivery services.' },
];

const LOREM_IPSUM_SHORT = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
const LOREM_IPSUM_LONG = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

const getRandomElement = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomNumber = (min: number, max: number, decimals: number = 0): number => parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
const getRandomDate = (start: Date, end: Date): string => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();

const categoryImageMap: { [key: string]: string[] } = {
  Automotive: ['https://images.unsplash.com/photo-1565311365152-12b7c1328b4d?q=60&w=800'],
  'Beauty & Wellness': ['https://images.unsplash.com/photo-1521590832167-7ce6b830fe58?q=60&w=800'],
  Catering: ['https://images.unsplash.com/photo-1606131731446-5568d87113aa?q=60&w=800'],
  Cleaning: ['https://images.unsplash.com/photo-1562886838-633576437123?q=60&w=800'],
  Cooking: ['https://images.unsplash.com/photo-1585523994348-0d109a3788d4?q=60&w=800'],
  Electrical: ['https://images.unsplash.com/photo-1489278353717-7a694ee90179?q=60&w=800'],
  'Event Planning': ['https://images.unsplash.com/photo-1615792500211-669339ce9a82?q=60&w=800'],
  'Farming & Gardening': ['https://images.unsplash.com/photo-1599842055734-3d4a683a3ba3?q=60&w=800'],
  Handyman: ['https://images.unsplash.com/photo-1618123277203-936b85375554?q=60&w=800'],
  'Home Repair': ['https://images.unsplash.com/photo-1558611848-73f7eb4001a1?q=60&w=800'],
  Laundry: ['https://images.unsplash.com/photo-1620992389895-7a8b353a436a?q=60&w=800'],
  Moving: ['https://images.unsplash.com/photo-1605795449554-13d810672749?q=60&w=800'],
  Painting: ['https://images.unsplash.com/photo-1528627220361-ec157533531b?q=60&w=800'],
  Photography: ['https://images.unsplash.com/photo-1505238680356-667803448bb6?q=60&w=800'],
  Plumbing: ['https://images.unsplash.com/photo-1580531595269-03a088386b89?q=60&w=800'],
  'Private Tutoring': ['https://images.unsplash.com/photo-1571260899304-425eee4c7efc?q=60&w=800'],
  Tailoring: ['https://images.unsplash.com/photo-1553106657-14411699add1?q=60&w=800'],
  'Tech Support': ['https://images.unsplash.com/photo-1610465299993-e667abc1e4e4?q=60&w=800'],
  Transportation: ['https://images.unsplash.com/photo-1559237937-07c42ac44439?q=60&w=800'],
};

// ── Categories ───────────────────────────────────────────────────────────
export const generateCategories = (): Category[] =>
  CATEGORY_DATA.map((cat, index) => ({
    id: index + 1,
    name: cat.name,
    description: cat.description,
  }));
export const DUMMY_CATEGORIES = generateCategories();

// ── Users ────────────────────────────────────────────────────────────────
let nextUserId = 1;
export const generateUsers = (count: number): User[] => {
  const users: User[] = [];
  for (let i = 0; i < count; i++) {
    const name = getRandomElement(USER_NAMES);
    const role = getRandomElement([UserRole.CLIENT, UserRole.PROVIDER, UserRole.ADMIN]);
    const id = nextUserId++;
    const createdAt = getRandomDate(new Date(2022, 0, 1), new Date());

    let profile: Profile | undefined;
    if (role === UserRole.PROVIDER) {
      profile = {
        id: nextUserId++,
        userId: id,
        bio: LOREM_IPSUM_LONG,
        location: getRandomElement(['Douala', 'Yaoundé', 'Bamenda', 'Buea', 'Limbe']),
        createdAt,
      };
    }

    users.push({
      id,
      name,
      email: `${name.toLowerCase().replace(' ', '.')}@example.com`,
      phoneNumber: `+2376${String(10000000 + i).slice(0, 8)}`,
      role,
      profile,
      createdAt,
    });
  }
  return users;
};
export const DUMMY_USERS = generateUsers(20);

// ── Services ─────────────────────────────────────────────────────────────
const SERVICE_TITLES_BY_CATEGORY: Record<string, string[]> = {
  Automotive: ['Full Car Service', 'Oil Change & Checkup', 'Brake Repair', 'Tire Replacement'],
  'Beauty & Wellness': ['Haircut & Styling', 'Manicure & Pedicure', 'Professional Makeup', 'Relaxing Massage'],
  Catering: ['Wedding Catering', 'Corporate Event Catering', 'Private Party Food Service'],
  Cleaning: ['Deep House Cleaning', 'Weekly Office Cleaning', 'Window & Gutter Cleaning'],
  Cooking: ['Weekly Meal Prep', 'Personal Chef for Dinner Party', 'Baking Lessons'],
  Electrical: ['Light Fixture Installation', 'Fixing Power Outages', 'Wiring for New Room'],
  'Event Planning': ['Birthday Party Planning', 'Wedding Coordination', 'Corporate Event Management'],
  'Farming & Gardening': ['Garden Design & Landscaping', 'Regular Lawn Mowing', 'Crop Tending Help'],
  Handyman: ['Fix Leaky Faucet', 'Assemble Flat-Pack Furniture', 'Hang Pictures & Shelves'],
  'Home Repair': ['Roof Leak Repair', 'Fix Broken Tiles', 'Water Damage Restoration'],
  Laundry: ['Wash, Dry, and Fold Service', 'Ironing for Shirts and Trousers'],
  Moving: ['Apartment Moving Help', 'Office Relocation Service', 'Man with a Van'],
  Painting: ['Interior Room Painting', 'Exterior Wall Painting', 'Fence & Deck Staining'],
  Photography: ['Wedding Photography', 'Family Portrait Session', 'Event Videography'],
  Plumbing: ['Unclog Drains', 'Install New Toilet', 'Fix Leaking Pipes'],
  'Private Tutoring': ['Maths & Science Tutoring', 'English Language Lessons', 'Guitar for Beginners'],
  Tailoring: ['Custom Dress Making', 'Suit Alterations', 'Repair Ripped Clothing'],
  'Tech Support': ['Cracked Screen Repair', 'Laptop Virus Removal', 'Software Installation Help'],
  Transportation: ['Airport Pickup/Drop-off', 'Personal Driver for a Day', 'Package Delivery Service'],
};

let nextServiceId = 1;
export const generateServices = (count: number, providers: User[]): Service[] => {
  const services: Service[] = [];
  const actualProviders = providers.filter(p => p.role === UserRole.PROVIDER);
  if (actualProviders.length === 0 || DUMMY_CATEGORIES.length === 0) return [];

  const servicesPerCategory = Math.ceil(count / DUMMY_CATEGORIES.length);

  DUMMY_CATEGORIES.forEach(category => {
    const catImages = categoryImageMap[category.name] || ['https://via.placeholder.com/300'];
    for (let i = 0; i < servicesPerCategory; i++) {
      if (services.length >= count) return;
      const provider = getRandomElement(actualProviders);
      const id = nextServiceId++;
      const imageUrl = catImages[i % catImages.length];

      services.push({
        id,
        title: getRandomElement(SERVICE_TITLES_BY_CATEGORY[category.name] || ['General Service']),
        description: LOREM_IPSUM_LONG,
        price: getRandomNumber(1000, 25000),
        status: 'available',
        featured: Math.random() > 0.8,
        provider,
        providerId: provider.id,
        category,
        categoryId: category.id,
        assets: [
          { id: nextServiceId++, serviceId: id, type: AssetType.IMAGE, imageUrl, createdAt: new Date().toISOString() },
        ],
        views: getRandomNumber(0, 500),
        createdAt: getRandomDate(new Date(2022, 6, 1), new Date()),
      });
    }
  });

  return services;
};

export const DUMMY_SERVICES = generateServices(200, DUMMY_USERS);

// ── ServiceOrders ────────────────────────────────────────────────────────
let nextOrderId = 1;
export const generateServiceOrders = (count: number, clients: User[]): ServiceOrder[] => {
  const orders: ServiceOrder[] = [];
  const actualClients = clients.filter(c => c.role === UserRole.CLIENT);
  if (actualClients.length === 0 || DUMMY_SERVICES.length === 0) return [];

  for (let i = 0; i < count; i++) {
    const client = getRandomElement(actualClients);
    const service = getRandomElement(DUMMY_SERVICES);
    orders.push({
      id: nextOrderId++,
      service,
      serviceId: service.id,
      client,
      clientId: client.id,
      description: `Looking for ${service.title.toLowerCase()}`,
      budget: getRandomElement([undefined, getRandomNumber(2000, 50000)]),
      status: getRandomElement(Object.values(ServiceOrderStatus)),
      createdAt: getRandomDate(new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), new Date()),
    });
  }
  return orders;
};
export const DUMMY_SERVICE_ORDERS = generateServiceOrders(40, DUMMY_USERS);

// ── Proposals ────────────────────────────────────────────────────────────
let nextProposalId = 1;
export const generateProposals = (count: number, orders: ServiceOrder[], providers: User[]): Proposal[] => {
  const proposals: Proposal[] = [];
  const actualProviders = providers.filter(p => p.role === UserRole.PROVIDER);
  if (orders.length === 0 || actualProviders.length === 0) return [];

  for (let i = 0; i < count; i++) {
    const order = getRandomElement(orders);
    const provider = getRandomElement(actualProviders);
    proposals.push({
      id: nextProposalId++,
      provider,
      providerId: provider.id,
      service: order.service,
      serviceId: order.service.id,
      coverLetter: LOREM_IPSUM_SHORT,
      bidAmount: order.budget ? getRandomNumber(order.budget * 0.8, order.budget * 1.2) : getRandomNumber(10000, 150000),
      status: getRandomElement(Object.values(ProposalStatus)),
      createdAt: getRandomDate(new Date(order.createdAt), new Date()),
    });
  }
  return proposals;
};
export const DUMMY_PROPOSALS = generateProposals(20, DUMMY_SERVICE_ORDERS, DUMMY_USERS);

// ── Reviews ──────────────────────────────────────────────────────────────
let nextReviewId = 1;
export const generateReviews = (count: number, services: Service[], users: User[]): Review[] => {
  const reviews: Review[] = [];
  if (services.length === 0 || users.length === 0) return [];

  for (let i = 0; i < count; i++) {
    const reviewer = getRandomElement(users);

    reviews.push({
      id: nextReviewId++,
      contractId: getRandomNumber(1, 100),
      reviewer,
      reviewerId: reviewer.id,
      rating: getRandomNumber(1, 5),
      comment: LOREM_IPSUM_SHORT,
      createdAt: getRandomDate(new Date(2023, 0, 1), new Date()),
    });
  }
  return reviews;
};
export const DUMMY_REVIEWS = generateReviews(30, DUMMY_SERVICES, DUMMY_USERS);

// ── Testimonials ─────────────────────────────────────────────────────────
export const generateTestimonials = (count: number): Testimonial[] => {
  const testimonials: Testimonial[] = [];
  for (let i = 0; i < count; i++) {
    testimonials.push({
      id: `testimonial-${i + 1}`,
      name: getRandomElement(USER_NAMES),
      role: getRandomElement(['Homeowner', 'Entrepreneur', 'Small Business Owner']),
      avatar: `https://picsum.photos/seed/testimonial${i}/100/100`,
      text: `"${LOREM_IPSUM_SHORT} LocalHands made it so easy!"`,
    });
  }
  return testimonials;
};
export const DUMMY_TESTIMONIALS = generateTestimonials(5);

// ── Contracts ────────────────────────────────────────────────────────────
let nextContractId = 1;
export const generateContracts = (): Contract[] =>
  DUMMY_SERVICE_ORDERS.filter(o => o.status === ServiceOrderStatus.ACCEPTED || o.status === ServiceOrderStatus.COMPLETED).slice(0, 15).map(order => ({
    id: nextContractId++,
    serviceOrder: order,
    serviceOrderId: order.id,
    escrowAmount: getRandomNumber(50000, 500000),
    status: getRandomElement(Object.values(ContractStatus)),
    payments: [],
    createdAt: new Date().toISOString(),
  }));
export const DUMMY_CONTRACTS = generateContracts();

// ── Chat ─────────────────────────────────────────────────────────────────
export const generateChatMessages = (count: number, senderId: number, receiverId: number): ChatMessage[] => {
  const messageTemplates = [
    "Hey, how's it going?",
    "I'm interested in the service you're offering.",
    "Can you provide more details about the timeline?",
    "Yes, that works for me.",
    "I've attached the design brief.",
    "Let's schedule a call for tomorrow.",
    "Here is the progress update.",
    "Looks great! No changes from my side.",
    "Thanks for the quick response!",
    "Payment has been sent.",
    "Could you send over the invoice?",
    "I'll get back to you by the end of the day.",
    "Perfect!",
    "What are the next steps?",
    "Here's a photo of the issue I mentioned.",
  ];

  const messages: ChatMessage[] = [];
  for (let i = 0; i < count; i++) {
    const sender = getRandomElement([senderId, receiverId]).toString();
    const text = getRandomElement(messageTemplates);
    const hasImage = Math.random() > 0.85;

    messages.push({
      id: `msg-${senderId}-${receiverId}-${i}`,
      senderId: sender,
      text,
      timestamp: new Date(Date.now() - (count - i) * 5 * 60 * 1000).toISOString(),
      imageUrl: hasImage ? `https://picsum.photos/seed/chatimg${i}${sender}/400/300` : undefined,
    });
  }
  return messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
};

export const generateConversations = (currentUser: User, allUsers: User[]): ChatConversation[] => {
  const conversations: ChatConversation[] = [];
  const otherUsers = allUsers.filter(u => u.id !== currentUser.id).slice(0, 5);

  otherUsers.forEach((otherUser, index) => {
    const messages = generateChatMessages(getRandomNumber(20, 30), currentUser.id, otherUser.id);
    if (messages.length > 0) {
      conversations.push({
        id: `convo-${currentUser.id}-${otherUser.id}`,
        participants: [
          { id: currentUser.id, name: currentUser.name },
          { id: otherUser.id, name: otherUser.name },
        ],
        messages,
        lastMessage: messages[messages.length - 1],
        unreadCount: index % 2 === 0 ? getRandomNumber(0, 3) : 0,
      });
    }
  });
  return conversations;
};

const MOCK_CURRENT_USER = DUMMY_USERS.find(u => u.role === UserRole.CLIENT) || DUMMY_USERS[0];
export const DUMMY_CONVERSATIONS = generateConversations(MOCK_CURRENT_USER, DUMMY_USERS);

// ── Chart Data ───────────────────────────────────────────────────────────
export const generateChartData_UsersOverTime = (users: User[]): ChartDataPoint[] => {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const dataByMonth: { [key: string]: number } = {};

  users.forEach(user => {
    const date = new Date(user.createdAt);
    const monthYear = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
    dataByMonth[monthYear] = (dataByMonth[monthYear] || 0) + 1;
  });

  return Object.entries(dataByMonth)
    .sort(([a], [b]) => {
      const [aM, aY] = a.split(' ');
      const [bM, bY] = b.split(' ');
      if (aY !== bY) return parseInt(aY) - parseInt(bY);
      return monthNames.indexOf(aM) - monthNames.indexOf(bM);
    })
    .map(([name, value]) => ({ name, value }))
    .slice(-12);
};

export const generateChartData_ServicesPerCategory = (services: Service[], categories: Category[]): ChartDataPoint[] => {
  const dataByCat: { [key: string]: number } = {};
  categories.forEach(cat => { dataByCat[cat.name] = 0; });
  services.forEach(service => {
    if (service.category && dataByCat[service.category.name] !== undefined) {
      dataByCat[service.category.name]++;
    }
  });
  return Object.entries(dataByCat).map(([name, value]) => ({ name, value }));
};

export const generateChartData_ContractStatuses = (orders: ServiceOrder[]): ChartDataPoint[] => {
  const dataByStatus: { [key: string]: number } = {};
  Object.values(ServiceOrderStatus).forEach(status => { dataByStatus[status] = 0; });
  orders.forEach(order => { dataByStatus[order.status]++; });
  return Object.entries(dataByStatus).map(([name, value]) => ({ name, value })).filter(d => d.value > 0);
};

export const DUMMY_ADMIN_USER_DATA_CHART = generateChartData_UsersOverTime(DUMMY_USERS);
export const DUMMY_ADMIN_SERVICES_PER_CATEGORY_CHART = generateChartData_ServicesPerCategory(DUMMY_SERVICES, DUMMY_CATEGORIES);
export const DUMMY_ADMIN_CONTRACT_STATUS_CHART = generateChartData_ContractStatuses(DUMMY_SERVICE_ORDERS);
