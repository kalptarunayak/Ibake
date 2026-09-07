export type ProductCategory = 'Cakes' | 'Chocolates' | 'Flowers';

export type Occasion =
  | 'Birthday'
  | 'Anniversary'
  | 'Diwali'
  | 'Rakhi'
  | 'Wedding'
  | "Valentine's Day"
  | "Mother's Day"
  | 'New Year'
  | 'Congratulations';

export type UserRole = 'customer' | 'admin' | 'super_admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  isActive?: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface City {
  id: string;
  name: string;
  state: string;
  isActive: boolean;
  tier?: 'Tier 1' | 'Tier 2' | 'Tier 3';
  popularLocations?: string[];
}

export interface Vendor {
  id: string;
  name: string;
  city: string;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  phone?: string;
  address?: string;
  servicingAreas?: string[];
}

export interface VendorProductOffering {
  vendorId: string;
  vendorName: string;
  city: string;
  price: number; // in INR
  rating: number;
  deliveryTime: string; // e.g. "Today in 2 hrs", "Tomorrow 10 AM"
  available: boolean;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: ProductCategory;
  occasions: string[];
  imageUrl: string;
  isEggless?: boolean;
  flavor?: string;
  weightOptions?: { label: string; multiplier: number }[];
  offerings: VendorProductOffering[];
}

export interface CartItem {
  cartItemId: string;
  productId: string;
  productName: string;
  category: ProductCategory;
  imageUrl: string;
  vendorId: string;
  vendorName: string;
  unitPrice: number;
  selectedWeight?: string;
  deliveryTime: string;
  city: string;
  quantity: number;
  cakeMessage?: string;
  candleAndKnife?: boolean;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  link: string;
  city: string; // 'All' or specific city name like 'Mumbai'
  occasion?: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  isActive: boolean;
}

export interface DeliveryAddress {
  fullName: string;
  phone: string;
  addressLine: string;
  landmark?: string;
  pincode: string;
  city: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  userEmail: string;
  items: CartItem[];
  city: string;
  deliveryAddress: DeliveryAddress;
  deliverySlot: string;
  deliveryDate: string;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  tax: number;
  totalAmount: number;
  paymentMethod: string;
  status: 'CONFIRMED' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'DELIVERED';
  createdAt: string;
}
