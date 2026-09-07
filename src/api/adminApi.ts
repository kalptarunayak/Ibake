import { apiClient, hasLiveBackend } from './client';
import { storageRepo } from './storageRepo';
import { User, UserRole, City } from '../types';

export const adminApi = {
  async getUsers(): Promise<User[]> {
    if (hasLiveBackend) {
      try {
        const res = await apiClient.get<User[]>('/api/super-admin/users');
        return res.data;
      } catch (err) {
        console.warn('Backend getUsers failed, using local repository:', err);
      }
    }
    return storageRepo.getUsers();
  },

  async updateUserRole(userId: string, newRole: UserRole): Promise<User> {
    if (hasLiveBackend) {
      try {
        const res = await apiClient.patch<User>(`/api/super-admin/users/${userId}/role`, { role: newRole });
        return res.data;
      } catch (err) {
        console.warn('Backend updateUserRole failed, using local update:', err);
      }
    }

    const users = storageRepo.getUsers();
    const index = users.findIndex((u) => u.id === userId);
    if (index === -1) throw new Error('User not found');

    users[index].role = newRole;
    storageRepo.saveUsers(users);
    return users[index];
  },

  async createAdmin(name: string, email: string, role: UserRole = 'admin', phone?: string): Promise<User> {
    if (hasLiveBackend) {
      try {
        const res = await apiClient.post<User>('/api/super-admin/admins', { name, email, role, phone });
        return res.data;
      } catch (err) {
        console.warn('Backend createAdmin failed, using local addition:', err);
      }
    }

    const users = storageRepo.getUsers();
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      throw new Error('User with this email already exists.');
    }

    const newAdmin: User = {
      id: `u-adm-${Date.now()}`,
      name,
      email,
      role,
      phone: phone || '+91 98000 11111',
    };

    users.push(newAdmin);
    storageRepo.saveUsers(users);
    return newAdmin;
  },

  async getAdminUsers(): Promise<User[]> {
    const users = await this.getUsers();
    return users.map(u => ({ ...u, isActive: u.isActive !== false }));
  },

  async inviteAdminUser(data: { name: string; email: string; phone?: string; role?: UserRole }): Promise<User> {
    return this.createAdmin(data.name, data.email, data.role || 'admin', data.phone);
  },

  async toggleAdminActive(userId: string, isActive: boolean): Promise<User> {
    if (hasLiveBackend) {
      try {
        const res = await apiClient.patch<User>(`/api/super-admin/users/${userId}/status`, { isActive });
        return res.data;
      } catch (err) {
        console.warn('Backend toggleAdminActive failed, using local fallback:', err);
      }
    }
    const users = storageRepo.getUsers();
    const index = users.findIndex(u => u.id === userId);
    if (index === -1) throw new Error('Admin not found');
    users[index].isActive = isActive;
    storageRepo.saveUsers(users);
    return users[index];
  },

  async toggleCityActive(cityId: string, isActive: boolean): Promise<City> {
    const { cityApi } = await import('./cityApi');
    return cityApi.toggleCity(cityId, isActive);
  },

  async createCity(data: { name: string; state: string; tier?: string; isActive?: boolean }): Promise<City> {
    const { cityApi } = await import('./cityApi');
    return cityApi.addCity(data.name, data.state);
  },

  async deleteCity(cityId: string): Promise<boolean> {
    if (hasLiveBackend) {
      try {
        await apiClient.delete(`/api/super-admin/cities/${cityId}`);
        return true;
      } catch (err) {
        console.warn('Backend deleteCity failed, using local deletion:', err);
      }
    }
    const cities = storageRepo.getCities();
    const filtered = cities.filter(c => c.id !== cityId);
    storageRepo.saveCities(filtered);
    return true;
  }
};
