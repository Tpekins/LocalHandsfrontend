import { 
  User, 
  Role, 
  Service, 
  Category, 
  ServiceOrder, 
  ServiceOrderStatus, 
  Proposal, 
  Review, 
  Testimonial, 
  ChartDataPoint, 
  Contract, 
  ChatMessage, 
  ChatConversation 
} from '../types';

import { 
  UserGroupIcon, 
  HomeIcon, 
  BriefcaseIcon, 
  CogIcon, 
  BuildingStorefrontIcon 
} from '../components/icons/Icons'; // Assuming these are defined

const USER_NAMES = ['Alice Smith', 'Bob Johnson', 'Carol Williams', 'David Brown', 'Eve Jones', 'Frank Garcia', 'Grace Miller', 'Henry Davis', 'Ivy Rodriguez', 'Jack Wilson'];
const SERVICE_TITLES_BY_CATEGORY: { [key: string]: string[] } = {
    'cat-1': ['Full Car Service', 'Oil Change & Checkup', 'Brake Repair', 'Tire Replacement'],
    'cat-2': ['Haircut & Styling', 'Manicure & Pedicure', 'Professional Makeup', 'Relaxing Massage'],
    'cat-3': ['Wedding Catering', 'Corporate Event Catering', 'Private Party Food Service'],
    'cat-4': ['Deep House Cleaning', 'Weekly Office Cleaning', 'Window & Gutter Cleaning'],
    'cat-5': ['Weekly Meal Prep', 'Personal Chef for Dinner Party', 'Baking Lessons'],
    'cat-6': ['Light Fixture Installation', 'Fixing Power Outages', 'Wiring for New Room'],
    'cat-7': ['Birthday Party Planning', 'Wedding Coordination', 'Corporate Event Management'],
    'cat-8': ['Garden Design & Landscaping', 'Regular Lawn Mowing', 'Crop Tending Help'],
    'cat-9': ['Fix Leaky Faucet', 'Assemble Flat-Pack Furniture', 'Hang Pictures & Shelves'],
    'cat-10': ['Roof Leak Repair', 'Fix Broken Tiles', 'Water Damage Restoration'],
    'cat-11': ['Wash, Dry, and Fold Service', 'Ironing for Shirts and Trousers'],
    'cat-12': ['Apartment Moving Help', 'Office Relocation Service', 'Man with a Van'],
    'cat-13': ['Interior Room Painting', 'Exterior Wall Painting', 'Fence & Deck Staining'],
    'cat-14': ['Wedding Photography', 'Family Portrait Session', 'Event Videography'],
    'cat-15': ['Unclog Drains', 'Install New Toilet', 'Fix Leaking Pipes'],
    'cat-16': ['Maths & Science Tutoring', 'English Language Lessons', 'Guitar for Beginners'],
    'cat-17': ['Custom Dress Making', 'Suit Alterations', 'Repair Ripped Clothing'],
    'cat-18': ['Cracked Screen Repair', 'Laptop Virus Removal', 'Software Installation Help'],
    'cat-19': ['Airport Pickup/Drop-off', 'Personal Driver for a Day', 'Package Delivery Service'],
};
const ALL_SERVICE_TITLES = Object.values(SERVICE_TITLES_BY_CATEGORY).flat();
const CATEGORY_NAMES_DESCRIPTIONS = [
    { name: 'Automotive', description: 'Car repair, mechanics, and detailing.', icon: CogIcon },
    { name: 'Beauty & Wellness', description: 'Hairdressing, makeup, nails, and massage.', icon: UserGroupIcon },
    { name: 'Catering', description: 'Event catering and personal chefs.', icon: BuildingStorefrontIcon },
    { name: 'Cleaning', description: 'Home and office cleaning services.', icon: HomeIcon },
    { name: 'Cooking', description: 'Personal cooks and meal preparation.', icon: BuildingStorefrontIcon },
    { name: 'Electrical', description: 'Electrical installation and repairs.', icon: HomeIcon },
    { name: 'Event Planning', description: 'Wedding, party, and corporate event planning.', icon: BuildingStorefrontIcon },
    { name: 'Farming & Gardening', description: 'Landscaping and farm assistance.', icon: HomeIcon },
    { name: 'Handyman', description: 'General home repairs and installations.', icon: HomeIcon },
    { name: 'Home Repair', description: 'Specialized home repair services.', icon: HomeIcon },
    { name: 'Laundry', description: 'Laundry and ironing services.', icon: HomeIcon },
    { name: 'Moving', description: 'Moving and relocation services.', icon: BriefcaseIcon },
    { name: 'Painting', description: 'Interior and exterior painting.', icon: HomeIcon },
    { name: 'Photography', description: 'Event and portrait photography.', icon: BuildingStorefrontIcon },
    { name: 'Plumbing', description: 'Plumbing installation and repairs.', icon: HomeIcon },
    { name: 'Private Tutoring', description: 'Academic and skill-based tutoring.', icon: UserGroupIcon },
    { name: 'Tailoring', description: 'Custom clothing and alterations.', icon: BuildingStorefrontIcon },
    { name: 'Tech Support', description: 'Computer and phone repair.', icon: CogIcon },
    { name: 'Transportation', description: 'Personal drivers and delivery services.', icon: BriefcaseIcon },
];

const LOREM_IPSUM_SHORT = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
const LOREM_IPSUM_LONG = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

const getRandomElement = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const getRandomNumber = (min: number, max: number, decimals: number = 0): number => parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
const getRandomDate = (start: Date, end: Date): string => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();

const categoryImageMap: { [key: string]: string[] } = {
    'Automotive': [
        'https://images.unsplash.com/photo-1565311365152-12b7c1328b4d?q=60&w=800',
        'https://images.unsplash.com/photo-1618283993222-5a3a14603955?q=60&w=800',
        'https://images.unsplash.com/photo-1599493347249-7c183c5a6e87?q=60&w=800'
    ],
    'Beauty & Wellness': [
        'https://images.unsplash.com/photo-1521590832167-7ce6b830fe58?q=60&w=800',
        'https://images.unsplash.com/photo-1560066984-1383b145942d?q=60&w=800',
        'https://images.unsplash.com/photo-1600965953321-738585a8505c?q=60&w=800'
    ],
    'Catering': [
        'https://images.unsplash.com/photo-1606131731446-5568d87113aa?q=60&w=800',
        'https://images.unsplash.com/photo-1505253716362-afb542c9792d?q=60&w=800',
        'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=60&w=800'
    ],
    'Cleaning': [
        'https://images.unsplash.com/photo-1562886838-633576437123?q=60&w=800',
        'https://images.unsplash.com/photo-1585421992080-71822895a438?q=60&w=800',
        'https://images.unsplash.com/photo-1545166394-06d1658019a4?q=60&w=800'
    ],
    'Cooking': [
        'https://images.unsplash.com/photo-1585523994348-0d109a3788d4?q=60&w=800',
        'https://images.unsplash.com/photo-1593980628202-7a18847158b6?q=60&w=800',
        'https://images.unsplash.com/photo-1490645935967-10de6ba1a506?q=60&w=800'
    ],
    'Electrical': [
        'https://images.unsplash.com/photo-1489278353717-7a694ee90179?q=60&w=800',
        'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=60&w=800',
        'https://images.unsplash.com/photo-1617521128249-44c1611c57a4?q=60&w=800'
    ],
    'Event Planning': [
        'https://images.unsplash.com/photo-1615792500211-669339ce9a82?q=60&w=800',
        'https://images.unsplash.com/photo-1523580494863-6f3031224c94?q=60&w=800',
        'https://images.unsplash.com/photo-1519167758481-83f550bb49b6?q=60&w=800'
    ],
    'Farming & Gardening': [
        'https://images.unsplash.com/photo-1599842055734-3d4a683a3ba3?q=60&w=800',
        'https://images.unsplash.com/photo-1620200374528-82539a7a6a5e?q=60&w=800',
        'https://images.unsplash.com/photo-1587024614830-53841e95186b?q=60&w=800'
    ],
    'Handyman': [
        'https://images.unsplash.com/photo-1618123277203-936b85375554?q=60&w=800',
        'https://images.unsplash.com/photo-1593962299849-5931a1900a99?q=60&w=800',
        'https://images.unsplash.com/photo-1581888224138-e1e788323f4c?q=60&w=800'
    ],
    'Home Repair': [
        'https://images.unsplash.com/photo-1558611848-73f7eb4001a1?q=60&w=800',
        'https://images.unsplash.com/photo-1512412109327-ac71b260551a?q=60&w=800',
        'https://images.unsplash.com/photo-1600585152225-358b5c1fac95?q=60&w=800'
    ],
    'Laundry': [
        'https://images.unsplash.com/photo-1620992389895-7a8b353a436a?q=60&w=800',
        'https://images.unsplash.com/photo-1505022764356-8a658b098a5a?q=60&w=800',
        'https://images.unsplash.com/photo-1595503803118-84235a9b6a4a?q=60&w=800'
    ],
    'Moving': [
        'https://images.unsplash.com/photo-1605795449554-13d810672749?q=60&w=800',
        'https://images.unsplash.com/photo-1549499239-a887319b165b?q=60&w=800',
        'https://images.unsplash.com/photo-1576794662994-02d2551415de?q=60&w=800'
    ],
    'Painting': [
        'https://images.unsplash.com/photo-1528627220361-ec157533531b?q=60&w=800',
        'https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?q=60&w=800',
        'https://images.unsplash.com/photo-1558611848-73f7eb4001a1?q=60&w=800'
    ],
    'Photography': [
        'https://images.unsplash.com/photo-1604226162129-d59393154f29?q=60&w=800',
        'https://images.unsplash.com/photo-1505238680356-667803448bb6?q=60&w=800',
        'https://images.unsplash.com/photo-1510127034890-ba27de04bf5b?q=60&w=800'
    ],
    'Plumbing': [
        'https://images.unsplash.com/photo-1580531595269-03a088386b89?q=60&w=800',
        'https://images.unsplash.com/photo-1599011712216-179a653a2a88?q=60&w=800',
        'https://images.unsplash.com/photo-1505798577917-6d2094cf3d8d?q=60&w=800'
    ],
    'Private Tutoring': [
        'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?q=60&w=800',
        'https://images.unsplash.com/photo-1543269865-cbf427effbad?q=60&w=800',
        'https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=60&w=800'
    ],
    'Tailoring': [
        'https://images.unsplash.com/photo-1553106657-14411699add1?q=60&w=800',
        'https://images.unsplash.com/photo-1603291358142-6ac879591a2c?q=60&w=800',
        'https://images.unsplash.com/photo-1517694493024-8a799a7a9235?q=60&w=800'
    ],
    'Tech Support': [
        'https://images.unsplash.com/photo-1610465299993-e667abc1e4e4?q=60&w=800',
        'https://images.unsplash.com/photo-1591435579993-84a0b236b25a?q=60&w=800',
        'https://images.unsplash.com/photo-1550745165-9bc0b252726a?q=60&w=800'
    ],
    'Transportation': [
        'https://images.unsplash.com/photo-1559237937-07c42ac44439?q=60&w=800',
        'https://images.unsplash.com/photo-1606584225097-c73d61460453?q=60&w=800',
        'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=60&w=800'
    ],
};

export const generateCategories = (): Category[] => {
    return CATEGORY_NAMES_DESCRIPTIONS.map((cat, index) => ({
        id: `cat-${index + 1}`,
        name: cat.name,
        description: cat.description,
        icon: cat.icon,
        imageUrl: (categoryImageMap[cat.name] && categoryImageMap[cat.name][0]) || 'https://via.placeholder.com/300',
    }));
};

export const DUMMY_CATEGORIES = generateCategories();

export const generateUsers = (count: number): User[] => {
    const users: User[] = [];
    for (let i = 0; i < count; i++) {
        const name = getRandomElement(USER_NAMES);
        const role = getRandomElement([Role.CLIENT, Role.PROVIDER, Role.ADMIN]);
        const user: User = {
            id: `user-${i + 1}`,
            name: name,
            email: `${name.toLowerCase().replace(' ', '.')}@example.com`,
            role: role,
            avatar: `https://picsum.photos/seed/avatar${i}/100/100`,
            registeredAt: getRandomDate(new Date(2022, 0, 1), new Date()),
            status: getRandomElement(['Active', 'Suspended', 'Pending']),
        };

        if (role === Role.PROVIDER) {
            user.profileHeadline = `Expert in ${getRandomElement(ALL_SERVICE_TITLES)}`;
            user.profileBio = LOREM_IPSUM_LONG;
            user.location = getRandomElement(['Douala', 'Yaoundé', 'Bamenda', 'Buea', 'Limbe']);
            user.portfolioImages = [
                `https://source.unsplash.com/random/600x400?sig=${i}a&work,craft,local,africa`,
                `https://source.unsplash.com/random/600x400?sig=${i}b&work,craft,local,africa`,
                `https://source.unsplash.com/random/600x400?sig=${i}c&work,craft,local,africa`,
            ];
            user.rating = getRandomNumber(4, 5, 1);
            user.reviewsCount = getRandomNumber(10, 150);
        }

        users.push(user);
    }
    return users;
};
export const DUMMY_USERS = generateUsers(20);

export const generateServices = (count: number, providers: User[]): Service[] => {
    const services: Service[] = [];
    const actualProviders = providers.filter(p => p.role === Role.PROVIDER);
    if (actualProviders.length === 0 || DUMMY_CATEGORIES.length === 0) return [];

    const servicesPerCategory = Math.ceil(count / DUMMY_CATEGORIES.length);

    DUMMY_CATEGORIES.forEach(category => {
        const categoryImages = [...(categoryImageMap[category.name] || ['https://via.placeholder.com/300'])];
        // Shuffle images for variety
        for (let i = categoryImages.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [categoryImages[i], categoryImages[j]] = [categoryImages[j], categoryImages[i]];
        }

        for (let i = 0; i < servicesPerCategory; i++) {
            if (services.length >= count) break;

            const provider = getRandomElement(actualProviders);
            const title = getRandomElement(SERVICE_TITLES_BY_CATEGORY[category.id] || ['General Service']);
            
            // Cycle through shuffled images
            const image = categoryImages[i % categoryImages.length];

            services.push({
                id: `service-${services.length + 1}`,
                providerId: provider.id,
                providerName: provider.name,
                title: title,
                description: LOREM_IPSUM_LONG,
                category: category,
                price: getRandomNumber(1000, 25000),
                priceType: getRandomElement(['fixed', 'hourly']),
                location: getRandomElement(['Douala', 'Yaoundé', 'Bamenda', 'Buea', 'Limbe']),
                images: [image], // Use the selected image
                rating: getRandomNumber(3.5, 5, 1),
                reviewsCount: getRandomNumber(5, 100),
            });
        }
    });

    return services;
};
const manualProvider = DUMMY_USERS.find(u => u.role === Role.PROVIDER);
export const DUMMY_SERVICES = [
  ...generateServices(200, DUMMY_USERS),
  ...(manualProvider ? [{
    id: 'manual-service-1',
    providerId: manualProvider.id,
    providerName: manualProvider.name,
    title: 'Talk Service (Manual)',
    description: 'A manually added talk service with full details and messaging enabled.',
    category: DUMMY_CATEGORIES[0], // Use the first category for simplicity
    price: 5000,
    priceType: 'fixed' as 'fixed',
    location: 'Douala',
    images: ['https://via.placeholder.com/400x225?text=Manual+Service'],
    rating: 5,
    reviewsCount: 0,
    isManual: true
  }] : [])
];

export const generateServiceOrders = (count: number, clients: User[]): ServiceOrder[] => {
    const orders: ServiceOrder[] = [];
    const actualClients = clients.filter(c => c.role === Role.CLIENT);
    if (actualClients.length === 0) return [];

    for (let i = 0; i < count; i++) {
        const client = getRandomElement(actualClients);
        orders.push({
            id: `order-${i + 1}`,
            clientId: client.id,
            clientName: client.name,
            title: `Looking for ${getRandomElement(ALL_SERVICE_TITLES).toLowerCase()}`,
            description: LOREM_IPSUM_LONG,
            category: getRandomElement(DUMMY_CATEGORIES),
            budget: getRandomElement([undefined, getRandomNumber(2000, 50000)]), // Lowered budget range for local context
            deadline: getRandomDate(new Date(), new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)), // Next 30 days
            postedDate: getRandomDate(new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), new Date()), // Past 15 days
            status: getRandomElement(Object.values(ServiceOrderStatus)),
            proposalsCount: getRandomNumber(0, 10),
        });
    }
    return orders;
};
export const DUMMY_SERVICE_ORDERS = generateServiceOrders(40, DUMMY_USERS);

export const generateProposals = (count: number, orders: ServiceOrder[], providers: User[]): Proposal[] => {
    const proposals: Proposal[] = [];
    const actualProviders = providers.filter(p => p.role === Role.PROVIDER);
    if (orders.length === 0 || actualProviders.length === 0) return [];
    
    for (let i = 0; i < count; i++) {
        const order = getRandomElement(orders);
        const provider = getRandomElement(actualProviders);
        proposals.push({
            id: `proposal-${i + 1}`,
            serviceOrderId: order.id,
            providerId: provider.id,
            providerName: provider.name,
            providerAvatar: provider.avatar,
            coverLetter: LOREM_IPSUM_SHORT,
            proposedPrice: order.budget ? getRandomNumber(order.budget * 0.8, order.budget * 1.2) : getRandomNumber(10000, 150000),
            estimatedDuration: `${getRandomNumber(1, 4)} weeks`,
            submittedDate: getRandomDate(new Date(order.postedDate), new Date()),
            status: getRandomElement(['Pending', 'Accepted', 'Rejected']),
        });
    }
    return proposals;
};
export const DUMMY_PROPOSALS = generateProposals(20, DUMMY_SERVICE_ORDERS, DUMMY_USERS);

export const generateReviews = (count: number, services: Service[], users: User[]): Review[] => {
    const reviews: Review[] = [];
    if (services.length === 0 || users.length === 0) return [];

    for (let i = 0; i < count; i++) {
        const service = getRandomElement(services);
        const reviewer = getRandomElement(users);
        reviews.push({
            id: `review-${i + 1}`,
            serviceId: service.id,
            reviewerId: reviewer.id,
            reviewerName: reviewer.name,
            reviewedId: service.providerId, // Reviewing the provider of the service
            rating: getRandomElement([1, 2, 3, 4, 5]) as 1 | 2 | 3 | 4 | 5,
            comment: LOREM_IPSUM_SHORT,
            date: getRandomDate(new Date(2023, 0, 1), new Date()),
        });
    }
    return reviews;
};
export const DUMMY_REVIEWS = generateReviews(30, DUMMY_SERVICES, DUMMY_USERS);

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

export const generateContracts = (count: number, clients: User[], providers: User[]): Contract[] => {
    const contracts: Contract[] = [];
    const actualClients = clients.filter(c => c.role === Role.CLIENT);
    const actualProviders = providers.filter(p => p.role === Role.PROVIDER);

    if (actualClients.length === 0 || actualProviders.length === 0) return [];

    for (let i = 0; i < count; i++) {
        const client = getRandomElement(actualClients);
        const provider = getRandomElement(actualProviders);
        const startDate = new Date(getRandomDate(new Date(2023, 0, 1), new Date()));
        const status = getRandomElement(['active', 'completed', 'cancelled']) as 'active' | 'completed' | 'cancelled';
        
        let completionDate: Date | undefined = undefined;
        if (status === 'completed') {
            completionDate = new Date(getRandomDate(startDate, new Date()));
        }

        contracts.push({
            id: `contract-${i + 1}`,
            clientId: client.id,
            provider: {
                id: provider.id,
                name: provider.name,
            },
            title: `Contract for ${getRandomElement(ALL_SERVICE_TITLES)}`,
            price: getRandomNumber(50000, 500000),
            status,
            startDate,
            completionDate,
        });
    }
    return contracts;
};

export const DUMMY_CONTRACTS = generateContracts(15, DUMMY_USERS, DUMMY_USERS);

export const generateChatMessages = (count: number, senderId: string, receiverId: string): ChatMessage[] => {
    const messages: ChatMessage[] = [];
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

    for (let i = 0; i < count; i++) {
        const sender = getRandomElement([senderId, receiverId]);
        const text = getRandomElement(messageTemplates);
        const hasImage = Math.random() > 0.85; // 15% chance of having an image

        messages.push({
            id: `msg-${senderId}-${receiverId}-${i}`,
            senderId: sender,
            text: text,
            timestamp: new Date(Date.now() - (count - i) * 5 * 60 * 1000), // Messages spread over time
            imageUrl: hasImage ? `https://picsum.photos/seed/chatimg${i}${senderId}/400/300` : undefined,
        });
    }
    return messages.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
};

export const generateConversations = (currentUser: User, allUsers: User[]): ChatConversation[] => {
    const conversations: ChatConversation[] = [];
    const otherUsers = allUsers.filter(u => u.id !== currentUser.id).slice(0, 5); // Chat with 5 other users

    otherUsers.forEach((otherUser, index) => {
        const messages = generateChatMessages(getRandomNumber(20, 30), currentUser.id, otherUser.id);
        if (messages.length > 0) {
            conversations.push({
                id: `convo-${currentUser.id}-${otherUser.id}`,
                participants: [
                    { id: currentUser.id, name: currentUser.name, avatar: currentUser.avatar },
                    { id: otherUser.id, name: otherUser.name, avatar: otherUser.avatar },
                ],
                messages: messages,
                lastMessage: messages[messages.length - 1],
                unreadCount: index % 2 === 0 ? getRandomNumber(0, 3) : 0, // Some unread messages
            });
        }
    });
    return conversations;
};

// Assuming a logged-in user for generating dummy data
// In a real app, you would pass the actual current user.
const MOCK_CURRENT_USER = DUMMY_USERS.find(u => u.role === Role.CLIENT) || DUMMY_USERS[0];
export const DUMMY_CONVERSATIONS = generateConversations(MOCK_CURRENT_USER, DUMMY_USERS);

export const generateChartData_UsersOverTime = (users: User[]): ChartDataPoint[] => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const dataByMonth: { [key: string]: number } = {};
    
    users.forEach(user => {
        const date = new Date(user.registeredAt);
        const monthYear = `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
        dataByMonth[monthYear] = (dataByMonth[monthYear] || 0) + 1;
    });

    const sortedMonths = Object.keys(dataByMonth).sort((a, b) => {
        const [aMonth, aYear] = a.split(' ');
        const [bMonth, bYear] = b.split(' ');
        if (aYear !== bYear) return parseInt(aYear) - parseInt(bYear);
        return monthNames.indexOf(aMonth) - monthNames.indexOf(bMonth);
    });
    
    return sortedMonths.map(monthYear => ({
        name: monthYear,
        value: dataByMonth[monthYear],
    })).slice(-12); // Last 12 months
};

export const generateChartData_ServicesPerCategory = (services: Service[], categories: Category[]): ChartDataPoint[] => {
    const dataByCat: { [key: string]: number } = {};
    categories.forEach(cat => dataByCat[cat.name] = 0);
    services.forEach(service => {
        if (dataByCat[service.category.name] !== undefined) {
            dataByCat[service.category.name]++;
        }
    });
    return Object.entries(dataByCat).map(([name, value]) => ({ name, value }));
};

export const generateChartData_ContractStatuses = (orders: ServiceOrder[]): ChartDataPoint[] => {
    const dataByStatus: { [key: string]: number } = {};
    Object.values(ServiceOrderStatus).forEach(status => dataByStatus[status] = 0);
    orders.forEach(order => {
        dataByStatus[order.status]++;
    });
    return Object.entries(dataByStatus).map(([name, value]) => ({ name, value })).filter(d => d.value > 0);
};

// Example for admin dashboard
export const DUMMY_ADMIN_USER_DATA_CHART = generateChartData_UsersOverTime(DUMMY_USERS);
export const DUMMY_ADMIN_SERVICES_PER_CATEGORY_CHART = generateChartData_ServicesPerCategory(DUMMY_SERVICES, DUMMY_CATEGORIES);
export const DUMMY_ADMIN_CONTRACT_STATUS_CHART = generateChartData_ContractStatuses(DUMMY_SERVICE_ORDERS);

    