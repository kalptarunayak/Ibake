import { apiClient, hasLiveBackend } from './client';
import { storageRepo } from './storageRepo';
import { Order } from '../types';

export const orderApi = {
  async createOrder(orderPayload: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>): Promise<Order> {
    if (hasLiveBackend) {
      try {
        const res = await apiClient.post<Order>('/api/orders', orderPayload);
        return res.data;
      } catch (err) {
        console.warn('Backend createOrder failed, placing order locally:', err);
      }
    }

    const orders = storageRepo.getOrders();
    const newOrder: Order = {
      ...orderPayload,
      id: `ord-${Date.now()}`,
      orderNumber: `IBK-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString(),
    };

    orders.unshift(newOrder);
    storageRepo.saveOrders(orders);
    return newOrder;
  },

  async getOrderById(orderId: string): Promise<Order | null> {
    if (hasLiveBackend) {
      try {
        const res = await apiClient.get<Order>(`/api/orders/${orderId}`);
        return res.data;
      } catch (err) {
        console.warn('Backend getOrderById failed, using local orders:', err);
      }
    }

    const orders = storageRepo.getOrders();
    return orders.find((o) => o.id === orderId || o.orderNumber === orderId) || null;
  },

  async getOrders(): Promise<Order[]> {
    if (hasLiveBackend) {
      try {
        const res = await apiClient.get<Order[]>('/api/orders');
        return res.data;
      } catch (err) {
        console.warn('Backend getOrders failed, using local orders:', err);
      }
    }
    return storageRepo.getOrders();
  }
};
