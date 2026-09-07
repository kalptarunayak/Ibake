import { apiClient, hasLiveBackend } from './client';
import { storageRepo } from './storageRepo';
import { City } from '../types';

export const cityApi = {
  async getCities(onlyActive: boolean = false): Promise<City[]> {
    if (hasLiveBackend) {
      try {
        const res = await apiClient.get<City[]>('/api/cities', { params: { onlyActive } });
        return res.data;
      } catch (err) {
        console.warn('Backend getCities failed, falling back to local storage:', err);
      }
    }

    const cities = storageRepo.getCities();
    return onlyActive ? cities.filter((c) => c.isActive) : cities;
  },

  async toggleCity(cityId: string, isActive: boolean): Promise<City> {
    if (hasLiveBackend) {
      try {
        const res = await apiClient.patch<City>(`/api/super-admin/cities/${cityId}`, { isActive });
        return res.data;
      } catch (err) {
        console.warn('Backend toggleCity failed, using local update:', err);
      }
    }

    const cities = storageRepo.getCities();
    const index = cities.findIndex((c) => c.id === cityId);
    if (index === -1) throw new Error('City not found');

    cities[index].isActive = isActive;
    storageRepo.saveCities(cities);
    return cities[index];
  },

  async addCity(name: string, state: string, popularLocations: string[] = []): Promise<City> {
    if (hasLiveBackend) {
      try {
        const res = await apiClient.post<City>('/api/super-admin/cities', { name, state, popularLocations, isActive: true });
        return res.data;
      } catch (err) {
        console.warn('Backend addCity failed, using local addition:', err);
      }
    }

    const cities = storageRepo.getCities();
    const newCity: City = {
      id: `c-${name.toLowerCase().replace(/\s+/g, '-').slice(0, 5)}-${Date.now().toString().slice(-4)}`,
      name,
      state,
      isActive: true,
      popularLocations: popularLocations.length > 0 ? popularLocations : ['Central Area', 'Airport Road']
    };

    cities.push(newCity);
    storageRepo.saveCities(cities);
    return newCity;
  }
};
