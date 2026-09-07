import { Banner, City, Product, User, Vendor } from '../types';

export const INITIAL_CITIES: City[] = [
  { id: 'c-mum', name: 'Mumbai', state: 'Maharashtra', isActive: true, popularLocations: ['Bandra', 'Andheri', 'South Mumbai', 'Thane'] },
  { id: 'c-del', name: 'Delhi NCR', state: 'Delhi', isActive: true, popularLocations: ['Connaught Place', 'South Extension', 'Gurgaon DLF', 'Noida'] },
  { id: 'c-blr', name: 'Bangalore', state: 'Karnataka', isActive: true, popularLocations: ['Indiranagar', 'Koramangala', 'Whitefield', 'Jayanagar'] },
  { id: 'c-pun', name: 'Pune', state: 'Maharashtra', isActive: true, popularLocations: ['Koregaon Park', 'Viman Nagar', 'Baner', 'Kothrud'] },
  { id: 'c-hyd', name: 'Hyderabad', state: 'Telangana', isActive: true, popularLocations: ['Banjara Hills', 'Jubilee Hills', 'Gachibowli', 'Madhapur'] },
  { id: 'c-kol', name: 'Kolkata', state: 'West Bengal', isActive: true, popularLocations: ['Park Street', 'Salt Lake', 'Ballygunge', 'New Town'] },
  { id: 'c-chn', name: 'Chennai', state: 'Tamil Nadu', isActive: false, popularLocations: ['T Nagar', 'Adyar', 'Anna Nagar', 'Velachery'] },
  { id: 'c-jpr', name: 'Jaipur', state: 'Rajasthan', isActive: true, popularLocations: ['C-Scheme', 'Malviya Nagar', 'Vaishali Nagar'] },
  { id: 'c-amd', name: 'Ahmedabad', state: 'Gujarat', isActive: true, popularLocations: ['SG Highway', 'Navrangpura', 'Bodakdev'] }
];

export const INITIAL_VENDORS: Vendor[] = [
  {
    id: 'v-mum-1',
    name: 'Artisan Pastry Works Bandra',
    city: 'Mumbai',
    rating: 4.8,
    reviewCount: 342,
    isVerified: true,
    address: 'Hill Road, Bandra West, Mumbai',
    servicingAreas: ['Bandra', 'Khar', 'Santacruz', 'Juhu']
  },
  {
    id: 'v-mum-2',
    name: 'Royal Truffle & Bakes',
    city: 'Mumbai',
    rating: 4.6,
    reviewCount: 198,
    isVerified: true,
    address: 'Colaba Causeway, South Mumbai',
    servicingAreas: ['South Mumbai', 'Worli', 'Lower Parel']
  },
  {
    id: 'v-mum-3',
    name: 'Flora Blooms & Chocolates',
    city: 'Mumbai',
    rating: 4.9,
    reviewCount: 512,
    isVerified: true,
    address: 'Linking Road, Mumbai',
    servicingAreas: ['Bandra', 'Andheri', 'Powai']
  },
  {
    id: 'v-del-1',
    name: 'The French Whisk Patisserie',
    city: 'Delhi NCR',
    rating: 4.9,
    reviewCount: 420,
    isVerified: true,
    address: 'Khan Market, New Delhi',
    servicingAreas: ['Connaught Place', 'South Delhi', 'Golf Links']
  },
  {
    id: 'v-del-2',
    name: 'Cacao Bloom Florist & Confiserie',
    city: 'Delhi NCR',
    rating: 4.7,
    reviewCount: 289,
    isVerified: true,
    address: 'Sector 29, Gurgaon',
    servicingAreas: ['DLF Phase 1-5', 'Cyber City', 'Sohna Road']
  },
  {
    id: 'v-blr-1',
    name: 'Lavelle Oven & Cakes',
    city: 'Bangalore',
    rating: 4.8,
    reviewCount: 380,
    isVerified: true,
    address: '100ft Road, Indiranagar, Bangalore',
    servicingAreas: ['Indiranagar', 'Domlur', 'HAL', 'MG Road']
  },
  {
    id: 'v-blr-2',
    name: 'Saffron & Petals Boutique',
    city: 'Bangalore',
    rating: 4.7,
    reviewCount: 215,
    isVerified: true,
    address: '5th Block, Koramangala, Bangalore',
    servicingAreas: ['Koramangala', 'HSR Layout', 'BTM Layout']
  },
  {
    id: 'v-pun-1',
    name: 'Koregaon Sweet Studio',
    city: 'Pune',
    rating: 4.7,
    reviewCount: 175,
    isVerified: true,
    address: 'Lane 7, Koregaon Park, Pune',
    servicingAreas: ['Koregaon Park', 'Kalyani Nagar', 'Viman Nagar']
  },
  {
    id: 'v-hyd-1',
    name: 'Jubilee Royal Bakers',
    city: 'Hyderabad',
    rating: 4.8,
    reviewCount: 260,
    isVerified: true,
    address: 'Road No. 36, Jubilee Hills, Hyderabad',
    servicingAreas: ['Jubilee Hills', 'Banjara Hills', 'Madhapur']
  },
  {
    id: 'v-kol-1',
    name: 'Park Street Flury Treats',
    city: 'Kolkata',
    rating: 4.8,
    reviewCount: 310,
    isVerified: true,
    address: 'Park Street, Kolkata',
    servicingAreas: ['Park Street', 'Ballygunge', 'Alipore']
  },
  {
    id: 'v-jpr-1',
    name: 'Pink City Cake House',
    city: 'Jaipur',
    rating: 4.6,
    reviewCount: 140,
    isVerified: true,
    address: 'C-Scheme, Jaipur',
    servicingAreas: ['C-Scheme', 'Civil Lines', 'Raja Park']
  },
  {
    id: 'v-amd-1',
    name: 'Heritage Bakes & Florals',
    city: 'Ahmedabad',
    rating: 4.7,
    reviewCount: 195,
    isVerified: true,
    address: 'Bodakdev, Ahmedabad',
    servicingAreas: ['SG Highway', 'Bodakdev', 'Vastrapur']
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'p-1',
    name: 'Belgian Dark Chocolate Ganache Cake',
    description: 'Silky, decadent 70% dark Belgian cocoa ganache layered between moist sponge cake. Hand-finished with cocoa nibs and gold dust leafing.',
    category: 'Cakes',
    occasions: ['Birthday', 'Anniversary', "Valentine's Day", 'Diwali'],
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
    isEggless: true,
    flavor: 'Dark Chocolate',
    weightOptions: [
      { label: '0.5 kg (Serves 4-6)', multiplier: 1 },
      { label: '1.0 kg (Serves 8-12)', multiplier: 1.85 },
      { label: '2.0 kg (Serves 16-24)', multiplier: 3.5 }
    ],
    offerings: [
      { vendorId: 'v-mum-1', vendorName: 'Artisan Pastry Works Bandra', city: 'Mumbai', price: 699, rating: 4.8, deliveryTime: 'Today in 2 hrs', available: true },
      { vendorId: 'v-mum-2', vendorName: 'Royal Truffle & Bakes', city: 'Mumbai', price: 649, rating: 4.6, deliveryTime: 'Today in 3 hrs', available: true },
      { vendorId: 'v-del-1', vendorName: 'The French Whisk Patisserie', city: 'Delhi NCR', price: 749, rating: 4.9, deliveryTime: 'Today in 90 mins', available: true },
      { vendorId: 'v-blr-1', vendorName: 'Lavelle Oven & Cakes', city: 'Bangalore', price: 699, rating: 4.8, deliveryTime: 'Today in 2 hrs', available: true },
      { vendorId: 'v-pun-1', vendorName: 'Koregaon Sweet Studio', city: 'Pune', price: 599, rating: 4.7, deliveryTime: 'Tomorrow by 10 AM', available: true },
      { vendorId: 'v-hyd-1', vendorName: 'Jubilee Royal Bakers', city: 'Hyderabad', price: 679, rating: 4.8, deliveryTime: 'Today in 2.5 hrs', available: true },
      { vendorId: 'v-kol-1', vendorName: 'Park Street Flury Treats', city: 'Kolkata', price: 620, rating: 4.8, deliveryTime: 'Today in 3 hrs', available: true },
      { vendorId: 'v-jpr-1', vendorName: 'Pink City Cake House', city: 'Jaipur', price: 580, rating: 4.6, deliveryTime: 'Today in 2 hrs', available: true },
      { vendorId: 'v-amd-1', vendorName: 'Heritage Bakes & Florals', city: 'Ahmedabad', price: 610, rating: 4.7, deliveryTime: 'Today in 2 hrs', available: true }
    ]
  },
  {
    id: 'p-2',
    name: 'Red Velvet Cream Cheese Heart Cake',
    description: 'Vibrant crimson velvety crumb layered with Madagascar vanilla infused rich cream cheese frosting. An all-time favorite for celebrations of love.',
    category: 'Cakes',
    occasions: ['Anniversary', "Valentine's Day", 'Birthday', 'Wedding'],
    imageUrl: 'https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?auto=format&fit=crop&w=800&q=80',
    isEggless: true,
    flavor: 'Red Velvet',
    weightOptions: [
      { label: '0.5 kg (Heart Shape)', multiplier: 1 },
      { label: '1.0 kg (Heart Shape)', multiplier: 1.9 },
      { label: '1.5 kg (Celebration)', multiplier: 2.7 }
    ],
    offerings: [
      { vendorId: 'v-mum-1', vendorName: 'Artisan Pastry Works Bandra', city: 'Mumbai', price: 799, rating: 4.8, deliveryTime: 'Today in 2 hrs', available: true },
      { vendorId: 'v-mum-3', vendorName: 'Flora Blooms & Chocolates', city: 'Mumbai', price: 749, rating: 4.9, deliveryTime: 'Today in 3 hrs', available: true },
      { vendorId: 'v-del-1', vendorName: 'The French Whisk Patisserie', city: 'Delhi NCR', price: 820, rating: 4.9, deliveryTime: 'Today in 2 hrs', available: true },
      { vendorId: 'v-del-2', vendorName: 'Cacao Bloom Florist & Confiserie', city: 'Delhi NCR', price: 780, rating: 4.7, deliveryTime: 'Tomorrow 11 AM', available: true },
      { vendorId: 'v-blr-1', vendorName: 'Lavelle Oven & Cakes', city: 'Bangalore', price: 750, rating: 4.8, deliveryTime: 'Today in 90 mins', available: true },
      { vendorId: 'v-hyd-1', vendorName: 'Jubilee Royal Bakers', city: 'Hyderabad', price: 720, rating: 4.8, deliveryTime: 'Today in 3 hrs', available: true }
    ]
  },
  {
    id: 'p-3',
    name: 'Royal Rasmalai Saffron Fusion Cake',
    description: 'Traditional Indian delicacy transformed into a modern masterpiece. Sponges infused with saffron cardamom milk and loaded with tender rasmalai pieces and pistachio slivers.',
    category: 'Cakes',
    occasions: ['Diwali', 'Rakhi', 'Wedding', 'Anniversary', 'Birthday'],
    imageUrl: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=800&q=80',
    isEggless: true,
    flavor: 'Rasmalai & Saffron',
    weightOptions: [
      { label: '0.5 kg (Festive Treat)', multiplier: 1 },
      { label: '1.0 kg (Grand Feast)', multiplier: 1.8 }
    ],
    offerings: [
      { vendorId: 'v-mum-1', vendorName: 'Artisan Pastry Works Bandra', city: 'Mumbai', price: 849, rating: 4.8, deliveryTime: 'Today in 2.5 hrs', available: true },
      { vendorId: 'v-del-1', vendorName: 'The French Whisk Patisserie', city: 'Delhi NCR', price: 899, rating: 4.9, deliveryTime: 'Today in 2 hrs', available: true },
      { vendorId: 'v-blr-1', vendorName: 'Lavelle Oven & Cakes', city: 'Bangalore', price: 799, rating: 4.8, deliveryTime: 'Today in 2 hrs', available: true },
      { vendorId: 'v-pun-1', vendorName: 'Koregaon Sweet Studio', city: 'Pune', price: 749, rating: 4.7, deliveryTime: 'Today in 3 hrs', available: true },
      { vendorId: 'v-jpr-1', vendorName: 'Pink City Cake House', city: 'Jaipur', price: 699, rating: 4.6, deliveryTime: 'Today in 2.5 hrs', available: true },
      { vendorId: 'v-amd-1', vendorName: 'Heritage Bakes & Florals', city: 'Ahmedabad', price: 720, rating: 4.7, deliveryTime: 'Today in 2 hrs', available: true }
    ]
  },
  {
    id: 'p-4',
    name: 'Fresh Mango Alphonso Gateau (Seasonal)',
    description: 'Hand-picked Ratnagiri Alphonso mango slices over fresh dairy cream and light sponge with white chocolate curl accents.',
    category: 'Cakes',
    occasions: ['Birthday', 'Anniversary', 'Congratulations', 'Mother\'s Day'],
    imageUrl: 'https://images.unsplash.com/photo-1562440499-64c9a111f713?auto=format&fit=crop&w=800&q=80',
    isEggless: true,
    flavor: 'Alphonso Mango',
    weightOptions: [
      { label: '0.5 kg', multiplier: 1 },
      { label: '1.0 kg', multiplier: 1.8 }
    ],
    offerings: [
      { vendorId: 'v-mum-1', vendorName: 'Artisan Pastry Works Bandra', city: 'Mumbai', price: 750, rating: 4.8, deliveryTime: 'Today in 3 hrs', available: true },
      { vendorId: 'v-mum-2', vendorName: 'Royal Truffle & Bakes', city: 'Mumbai', price: 699, rating: 4.6, deliveryTime: 'Today in 2 hrs', available: true },
      { vendorId: 'v-blr-1', vendorName: 'Lavelle Oven & Cakes', city: 'Bangalore', price: 780, rating: 4.8, deliveryTime: 'Today in 2 hrs', available: true }
    ]
  },
  {
    id: 'p-5',
    name: 'Handcrafted Truffle & Praline Gift Box',
    description: 'A luxurious 16-piece collection of artisanal truffles: Roasted Hazelnut, Salted Caramel, Kashmiri Kahwa Spice, and Dark Orange.',
    category: 'Chocolates',
    occasions: ['Diwali', 'Rakhi', "Valentine's Day", 'Anniversary', 'Congratulations'],
    imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=800&q=80',
    isEggless: true,
    flavor: 'Assorted Gourmet',
    weightOptions: [
      { label: '16 Pcs Deluxe Box', multiplier: 1 },
      { label: '24 Pcs Royal Box', multiplier: 1.45 }
    ],
    offerings: [
      { vendorId: 'v-mum-3', vendorName: 'Flora Blooms & Chocolates', city: 'Mumbai', price: 549, rating: 4.9, deliveryTime: 'Today in 2 hrs', available: true },
      { vendorId: 'v-del-2', vendorName: 'Cacao Bloom Florist & Confiserie', city: 'Delhi NCR', price: 599, rating: 4.7, deliveryTime: 'Today in 3 hrs', available: true },
      { vendorId: 'v-blr-2', vendorName: 'Saffron & Petals Boutique', city: 'Bangalore', price: 520, rating: 4.7, deliveryTime: 'Today in 2.5 hrs', available: true },
      { vendorId: 'v-kol-1', vendorName: 'Park Street Flury Treats', city: 'Kolkata', price: 499, rating: 4.8, deliveryTime: 'Today in 4 hrs', available: true },
      { vendorId: 'v-pun-1', vendorName: 'Koregaon Sweet Studio', city: 'Pune', price: 480, rating: 4.7, deliveryTime: 'Today in 2 hrs', available: true }
    ]
  },
  {
    id: 'p-6',
    name: 'Artisan Dark Chocolate Hazelnut Rocks',
    description: 'Slow-roasted Turkish hazelnuts enrobed in single-origin 64% cocoa chocolate, lightly dusted with fleur de sel sea salt.',
    category: 'Chocolates',
    occasions: ['Birthday', 'Rakhi', 'New Year', 'Congratulations'],
    imageUrl: 'https://images.unsplash.com/photo-1511381939415-e44015466834?auto=format&fit=crop&w=800&q=80',
    isEggless: true,
    flavor: 'Hazelnut Dark',
    weightOptions: [
      { label: '250g Tin Canister', multiplier: 1 },
      { label: '500g Gift Box', multiplier: 1.8 }
    ],
    offerings: [
      { vendorId: 'v-mum-3', vendorName: 'Flora Blooms & Chocolates', city: 'Mumbai', price: 449, rating: 4.9, deliveryTime: 'Today in 2 hrs', available: true },
      { vendorId: 'v-del-2', vendorName: 'Cacao Bloom Florist & Confiserie', city: 'Delhi NCR', price: 480, rating: 4.7, deliveryTime: 'Today in 3 hrs', available: true },
      { vendorId: 'v-blr-2', vendorName: 'Saffron & Petals Boutique', city: 'Bangalore', price: 430, rating: 4.7, deliveryTime: 'Today in 2 hrs', available: true },
      { vendorId: 'v-hyd-1', vendorName: 'Jubilee Royal Bakers', city: 'Hyderabad', price: 460, rating: 4.8, deliveryTime: 'Today in 3 hrs', available: true }
    ]
  },
  {
    id: 'p-7',
    name: 'Royal Velvet Red Roses Bouquet',
    description: 'A breathtaking arrangement of 15 long-stem Dutch red roses wrapped in eco-friendly kraft paper and tied with a satin ribbon.',
    category: 'Flowers',
    occasions: ['Anniversary', "Valentine's Day", 'Birthday', 'Wedding', 'Mother\'s Day'],
    imageUrl: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=800&q=80',
    isEggless: true,
    weightOptions: [
      { label: '15 Roses Bouquet', multiplier: 1 },
      { label: '25 Roses Deluxe Bunch', multiplier: 1.6 },
      { label: '50 Roses Grand Heart', multiplier: 3.1 }
    ],
    offerings: [
      { vendorId: 'v-mum-3', vendorName: 'Flora Blooms & Chocolates', city: 'Mumbai', price: 649, rating: 4.9, deliveryTime: 'Today in 90 mins', available: true },
      { vendorId: 'v-del-2', vendorName: 'Cacao Bloom Florist & Confiserie', city: 'Delhi NCR', price: 699, rating: 4.7, deliveryTime: 'Today in 2 hrs', available: true },
      { vendorId: 'v-blr-2', vendorName: 'Saffron & Petals Boutique', city: 'Bangalore', price: 599, rating: 4.7, deliveryTime: 'Today in 2 hrs', available: true },
      { vendorId: 'v-kol-1', vendorName: 'Park Street Flury Treats', city: 'Kolkata', price: 549, rating: 4.8, deliveryTime: 'Today in 3 hrs', available: true },
      { vendorId: 'v-jpr-1', vendorName: 'Pink City Cake House', city: 'Jaipur', price: 499, rating: 4.6, deliveryTime: 'Today in 2 hrs', available: true }
    ]
  },
  {
    id: 'p-8',
    name: 'Diwali Golden Marigold & Carnation Basket',
    description: 'Festive bloom basket featuring fresh orange marigolds, golden carnations, exotic gypsophila, and 2 designer earthen diyas.',
    category: 'Flowers',
    occasions: ['Diwali', 'Wedding', 'Congratulations', 'New Year'],
    imageUrl: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=800&q=80',
    isEggless: true,
    weightOptions: [
      { label: 'Traditional Cane Basket', multiplier: 1 },
      { label: 'Premium Brass Urli Finish', multiplier: 1.7 }
    ],
    offerings: [
      { vendorId: 'v-mum-3', vendorName: 'Flora Blooms & Chocolates', city: 'Mumbai', price: 599, rating: 4.9, deliveryTime: 'Today in 2 hrs', available: true },
      { vendorId: 'v-del-2', vendorName: 'Cacao Bloom Florist & Confiserie', city: 'Delhi NCR', price: 650, rating: 4.7, deliveryTime: 'Today in 3 hrs', available: true },
      { vendorId: 'v-blr-2', vendorName: 'Saffron & Petals Boutique', city: 'Bangalore', price: 580, rating: 4.7, deliveryTime: 'Today in 2.5 hrs', available: true },
      { vendorId: 'v-amd-1', vendorName: 'Heritage Bakes & Florals', city: 'Ahmedabad', price: 520, rating: 4.7, deliveryTime: 'Today in 2 hrs', available: true }
    ]
  },
  {
    id: 'p-9',
    name: 'Rakhi Sweets & Floral Hamper Combo',
    description: 'Specially curated Raksha Bandhan ensemble featuring a mini butterscotch crunch cake, handcrafted seed rakhi, and 6 assorted truffles.',
    category: 'Cakes',
    occasions: ['Rakhi', 'Diwali'],
    imageUrl: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=800&q=80',
    isEggless: true,
    flavor: 'Butterscotch & Praline',
    weightOptions: [
      { label: 'Rakhi Classic Box', multiplier: 1 },
      { label: 'Rakhi Royal Hamper', multiplier: 1.5 }
    ],
    offerings: [
      { vendorId: 'v-mum-1', vendorName: 'Artisan Pastry Works Bandra', city: 'Mumbai', price: 899, rating: 4.8, deliveryTime: 'Today in 2.5 hrs', available: true },
      { vendorId: 'v-del-1', vendorName: 'The French Whisk Patisserie', city: 'Delhi NCR', price: 950, rating: 4.9, deliveryTime: 'Today in 2 hrs', available: true },
      { vendorId: 'v-blr-1', vendorName: 'Lavelle Oven & Cakes', city: 'Bangalore', price: 870, rating: 4.8, deliveryTime: 'Today in 3 hrs', available: true },
      { vendorId: 'v-pun-1', vendorName: 'Koregaon Sweet Studio', city: 'Pune', price: 799, rating: 4.7, deliveryTime: 'Today in 2.5 hrs', available: true }
    ]
  }
];

export const INITIAL_BANNERS: Banner[] = [
  {
    id: 'b-1',
    title: 'Celebrate with Handcrafted Delights',
    subtitle: 'Fresh artisanal cakes delivered in 2 hours across your city',
    imageUrl: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?auto=format&fit=crop&w=1200&q=80',
    link: '/category/Cakes',
    city: 'All',
    occasion: 'Birthday',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    isActive: true
  },
  {
    id: 'b-2',
    title: 'Diwali Sweetness & Floral Splendor',
    subtitle: 'Special curated hampers, rasmalai cakes & marigold bouquets',
    imageUrl: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=1200&q=80',
    link: '/category/Cakes?occasion=Diwali',
    city: 'All',
    occasion: 'Diwali',
    startDate: '2026-09-01',
    endDate: '2026-11-30',
    isActive: true
  },
  {
    id: 'b-3',
    title: 'Express 90-Min Cake Delivery in Mumbai',
    subtitle: 'From premier Bandra and South Mumbai master bakers',
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80',
    link: '/category/Cakes',
    city: 'Mumbai',
    occasion: 'Birthday',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    isActive: true
  },
  {
    id: 'b-4',
    title: 'Valentine & Anniversary Love Ensembles',
    subtitle: 'Red velvet heart cakes, Dutch roses and silk pralines',
    imageUrl: 'https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?auto=format&fit=crop&w=1200&q=80',
    link: '/category/Flowers?occasion=Anniversary',
    city: 'All',
    occasion: 'Anniversary',
    startDate: '2026-01-01',
    endDate: '2026-12-31',
    isActive: true
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'u-cust-1',
    name: 'Ananya Sharma',
    email: 'customer@ibake.in',
    role: 'customer',
    phone: '+91 98765 43210'
  },
  {
    id: 'u-admin-1',
    name: 'Rajesh Bakshi',
    email: 'admin@ibake.in',
    role: 'admin',
    phone: '+91 98220 11223'
  },
  {
    id: 'u-super-1',
    name: 'Pooja Narang',
    email: 'superadmin@ibake.in',
    role: 'super_admin',
    phone: '+91 99990 00001'
  }
];
