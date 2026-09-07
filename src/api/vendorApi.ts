import { apiClient, hasLiveBackend } from './client';
import { storageRepo } from './storageRepo';
import { Vendor } from '../types';

export const vendorApi = {
  async getVendors(city?: string): Promise<Vendor[]> {
    if (hasLiveBackend) {
      try {
        const res = await apiClient.get<Vendor[]>('/api/vendors', { params: { city } });
        return res.data;
      } catch (err) {
        console.warn('Backend getVendors failed, using local vendors:', err);
      }
    }

    const vendors = storageRepo.getVendors();
    if (city && city !== 'All') {
      return vendors.filter((v) => v.city.toLowerCase() === city.toLowerCase());
    }
    return vendors;
  },

  async createVendor(vendor: Omit<Vendor, 'id'>): Promise<Vendor> {
    if (hasLiveBackend) {
      try {
        const res = await apiClient.post<Vendor>('/api/admin/vendors', vendor);
        return res.data;
      } catch (err) {
        console.warn('Backend createVendor failed, using local create:', err);
      }
    }

    const vendors = storageRepo.getVendors();
    const newVendor: Vendor = {
      ...vendor,
      id: `v-${Date.now()}`
    };
    vendors.push(newVendor);
    storageRepo.saveVendors(vendors);
    return newVendor;
  },

  async updateVendor(id: string, updates: Partial<Vendor>): Promise<Vendor> {
    if (hasLiveBackend) {
      try {
        const res = await apiClient.put<Vendor>(`/api/admin/vendors/${id}`, updates);
        return res.data;
      } catch (err) {
        console.warn('Backend updateVendor failed, using local update:', err);
      }
    }

    const vendors = storageRepo.getVendors();
    const index = vendors.findIndex((v) => v.id === id);
    if (index === -1) throw new Error('Vendor not found');

    vendors[index] = { ...vendors[index], ...updates };
    storageRepo.saveVendors(vendors);
    return vendors[index];
  },

  async deleteVendor(id: string): Promise<void> {
    if (hasLiveBackend) {
      try {
        await apiClient.delete(`/api/admin/vendors/${id}`);
        return;
      } catch (err) {
        console.warn('Backend deleteVendor failed, using local delete:', err);
      }
    }

    const vendors = storageRepo.getVendors().filter((v) => v.id !== id);
    storageRepo.saveVendors(vendors);

    // Also remove offerings of this vendor from products
    const products = storageRepo.getProducts();
    products.forEach((p) => {
      p.offerings = p.offerings.filter((o) => o.vendorId !== id);
    });
    storageRepo.saveProducts(products);
  }
};
