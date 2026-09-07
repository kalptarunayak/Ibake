import { apiClient, hasLiveBackend, TOKEN_STORAGE_KEY, USER_STORAGE_KEY } from './client';
import { storageRepo } from './storageRepo';
import { AuthResponse, User, UserRole } from '../types';

export const authApi = {
  async login(email: string, password: string):Promise<AuthResponse> {
    if (hasLiveBackend) {
      try {
        const res = await apiClient.post<AuthResponse>('/api/auth/login', { email, password });
        localStorage.setItem(TOKEN_STORAGE_KEY, res.data.token);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(res.data.user));
        return res.data;
      } catch (err) {
        console.warn('Backend login failed, checking fallback users:', err);
      }
    }

    // Local / offline fallback authentication
    const users = storageRepo.getUsers();
    let matched = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!matched) {
      // Auto-register demo guest or customer
      matched = {
        id: `u-${Date.now()}`,
        name: email.split('@')[0],
        email,
        role: email.includes('superadmin') ? 'super_admin' : email.includes('admin') ? 'admin' : 'customer',
        phone: '+91 98000 00000',
      };
      users.push(matched);
      storageRepo.saveUsers(users);
    }

    const mockToken = `mock-jwt-token-${matched.id}-${Date.now()}`;
    localStorage.setItem(TOKEN_STORAGE_KEY, mockToken);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(matched));

    return { token: mockToken, user: matched };
  },

  async register(name: string, email: string, role: UserRole = 'customer', phone?: string): Promise<AuthResponse> {
    if (hasLiveBackend) {
      try {
        const res = await apiClient.post<AuthResponse>('/api/auth/register', { name, email, role, phone });
        localStorage.setItem(TOKEN_STORAGE_KEY, res.data.token);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(res.data.user));
        return res.data;
      } catch (err) {
        console.warn('Backend register failed, using local registration:', err);
      }
    }

    const users = storageRepo.getUsers();
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      throw new Error('An account with this email address already exists.');
    }

    const newUser: User = {
      id: `u-${Date.now()}`,
      name,
      email,
      role,
      phone: phone || '+91 98765 00000',
    };

    users.push(newUser);
    storageRepo.saveUsers(users);

    const mockToken = `mock-jwt-token-${newUser.id}-${Date.now()}`;
    localStorage.setItem(TOKEN_STORAGE_KEY, mockToken);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));

    return { token: mockToken, user: newUser };
  },

  getCurrentUser(): User | null {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  },

  logout(): void {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
  },
};
