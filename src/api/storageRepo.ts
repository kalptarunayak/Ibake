import {
  INITIAL_BANNERS,
  INITIAL_CITIES,
  INITIAL_PRODUCTS,
  INITIAL_USERS,
  INITIAL_VENDORS
} from '../data/initialData';
import { Banner, City, Order, Product, User, Vendor } from '../types';

const STORAGE_KEYS = {
  CITIES: 'ibake_cities_data',
  VENDORS: 'ibake_vendors_data',
  PRODUCTS: 'ibake_products_data',
  BANNERS: 'ibake_banners_data',
  USERS: 'ibake_users_data',
  ORDERS: 'ibake_orders_data',
};

// Initialize default data if not present in localStorage
export function initLocalStorageData() {
  if (!localStorage.getItem(STORAGE_KEYS.CITIES)) {
    localStorage.setItem(STORAGE_KEYS.CITIES, JSON.stringify(INITIAL_CITIES));
  }
  if (!localStorage.getItem(STORAGE_KEYS.VENDORS)) {
    localStorage.setItem(STORAGE_KEYS.VENDORS, JSON.stringify(INITIAL_VENDORS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PRODUCTS)) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.BANNERS)) {
    localStorage.setItem(STORAGE_KEYS.BANNERS, JSON.stringify(INITIAL_BANNERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(INITIAL_USERS));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([]));
  }
}

export const storageRepo = {
  getCities(): City[] {
    initLocalStorageData();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.CITIES) || '[]');
    } catch {
      return INITIAL_CITIES;
    }
  },
  saveCities(cities: City[]) {
    localStorage.setItem(STORAGE_KEYS.CITIES, JSON.stringify(cities));
  },

  getVendors(): Vendor[] {
    initLocalStorageData();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.VENDORS) || '[]');
    } catch {
      return INITIAL_VENDORS;
    }
  },
  saveVendors(vendors: Vendor[]) {
    localStorage.setItem(STORAGE_KEYS.VENDORS, JSON.stringify(vendors));
  },

  getProducts(): Product[] {
    initLocalStorageData();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.PRODUCTS) || '[]');
    } catch {
      return INITIAL_PRODUCTS;
    }
  },
  saveProducts(products: Product[]) {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  },

  getBanners(): Banner[] {
    initLocalStorageData();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.BANNERS) || '[]');
    } catch {
      return INITIAL_BANNERS;
    }
  },
  saveBanners(banners: Banner[]) {
    localStorage.setItem(STORAGE_KEYS.BANNERS, JSON.stringify(banners));
  },

  getUsers(): User[] {
    initLocalStorageData();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.USERS) || '[]');
    } catch {
      return INITIAL_USERS;
    }
  },
  saveUsers(users: User[]) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  },

  getOrders(): Order[] {
    initLocalStorageData();
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS) || '[]');
    } catch {
      return [];
    }
  },
  saveOrders(orders: Order[]) {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
  }
};
