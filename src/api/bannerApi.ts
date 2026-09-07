import { apiClient, hasLiveBackend } from './client';
import { storageRepo } from './storageRepo';
import { Banner } from '../types';

export const bannerApi = {
  async getBanners(city?: string): Promise<Banner[]> {
    if (hasLiveBackend) {
      try {
        const res = await apiClient.get<Banner[]>('/api/banners', { params: { city } });
        return res.data;
      } catch (err) {
        console.warn('Backend getBanners failed, using local fallback:', err);
      }
    }

    const banners = storageRepo.getBanners();
    const today = new Date().toISOString().split('T')[0];

    return banners.filter((b) => {
      if (!b.isActive) return false;
      // Date range check if applicable
      if (b.startDate && b.startDate > today) return false;
      if (b.endDate && b.endDate < today) return false;
      // City check
      if (city && b.city !== 'All' && b.city.toLowerCase() !== city.toLowerCase()) {
        return false;
      }
      return true;
    });
  },

  async getAllAdminBanners(): Promise<Banner[]> {
    if (hasLiveBackend) {
      try {
        const res = await apiClient.get<Banner[]>('/api/admin/banners');
        return res.data;
      } catch (err) {
        console.warn('Backend getAllAdminBanners failed, using local banners:', err);
      }
    }
    return storageRepo.getBanners();
  },

  async createBanner(banner: Omit<Banner, 'id'>): Promise<Banner> {
    if (hasLiveBackend) {
      try {
        const res = await apiClient.post<Banner>('/api/admin/banners', banner);
        return res.data;
      } catch (err) {
        console.warn('Backend createBanner failed, using local save:', err);
      }
    }

    const banners = storageRepo.getBanners();
    const newBanner: Banner = {
      ...banner,
      id: `b-${Date.now()}`
    };
    banners.unshift(newBanner);
    storageRepo.saveBanners(banners);
    return newBanner;
  },

  async updateBanner(id: string, updates: Partial<Banner>): Promise<Banner> {
    if (hasLiveBackend) {
      try {
        const res = await apiClient.put<Banner>(`/api/admin/banners/${id}`, updates);
        return res.data;
      } catch (err) {
        console.warn('Backend updateBanner failed, using local update:', err);
      }
    }

    const banners = storageRepo.getBanners();
    const index = banners.findIndex((b) => b.id === id);
    if (index === -1) throw new Error('Banner not found');

    banners[index] = { ...banners[index], ...updates };
    storageRepo.saveBanners(banners);
    return banners[index];
  },

  async deleteBanner(id: string): Promise<void> {
    if (hasLiveBackend) {
      try {
        await apiClient.delete(`/api/admin/banners/${id}`);
        return;
      } catch (err) {
        console.warn('Backend deleteBanner failed, using local delete:', err);
      }
    }

    const banners = storageRepo.getBanners().filter((b) => b.id !== id);
    storageRepo.saveBanners(banners);
  }
};
