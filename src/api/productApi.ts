import { apiClient, hasLiveBackend } from './client';
import { storageRepo } from './storageRepo';
import { Product, ProductCategory } from '../types';

export interface ProductFilterParams {
  city?: string;
  category?: ProductCategory;
  occasion?: string;
  search?: string;
}

export const productApi = {
  async getProducts(params: ProductFilterParams = {}): Promise<Product[]> {
    if (hasLiveBackend) {
      try {
        const res = await apiClient.get<Product[]>('/api/products', { params });
        return res.data;
      } catch (err) {
        console.warn('Backend getProducts failed, using local repository:', err);
      }
    }

    let products = storageRepo.getProducts();

    // 1. If city is provided, filter to products that have active offerings in that city
    if (params.city && params.city !== 'All') {
      const cityLower = params.city.toLowerCase();
      products = products
        .map((p) => {
          const cityOfferings = p.offerings.filter(
            (o) => o.city.toLowerCase() === cityLower && o.available !== false
          );
          return {
            ...p,
            offerings: cityOfferings,
          };
        })
        .filter((p) => p.offerings.length > 0);
    }

    // 2. Category filter
    if (params.category) {
      products = products.filter((p) => p.category.toLowerCase() === params.category!.toLowerCase());
    }

    // 3. Occasion filter
    if (params.occasion && params.occasion !== 'All') {
      const occLower = params.occasion.toLowerCase();
      products = products.filter((p) =>
        p.occasions.some((o) => o.toLowerCase() === occLower)
      );
    }

    // 4. Search query
    if (params.search && params.search.trim()) {
      const query = params.search.toLowerCase().trim();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          (p.flavor && p.flavor.toLowerCase().includes(query))
      );
    }

    return products;
  },

  async getAllProductsRaw(): Promise<Product[]> {
    if (hasLiveBackend) {
      try {
        const res = await apiClient.get<Product[]>('/api/admin/products');
        return res.data;
      } catch (err) {
        console.warn('Backend getAllProductsRaw failed, using storageRepo:', err);
      }
    }
    return storageRepo.getProducts();
  },

  async getProductById(id: string, city?: string): Promise<Product | null> {
    if (hasLiveBackend) {
      try {
        const res = await apiClient.get<Product>(`/api/products/${id}`, { params: { city } });
        return res.data;
      } catch (err) {
        console.warn(`Backend getProductById ${id} failed, using local product:`, err);
      }
    }

    const all = storageRepo.getProducts();
    const found = all.find((p) => p.id === id);
    if (!found) return null;

    if (city && city !== 'All') {
      const cityLower = city.toLowerCase();
      const cityOfferings = found.offerings.filter(
        (o) => o.city.toLowerCase() === cityLower && o.available !== false
      );
      return {
        ...found,
        offerings: cityOfferings,
      };
    }

    return found;
  },

  async createProduct(product: Omit<Product, 'id'>): Promise<Product> {
    if (hasLiveBackend) {
      try {
        const res = await apiClient.post<Product>('/api/admin/products', product);
        return res.data;
      } catch (err) {
        console.warn('Backend createProduct failed, using local create:', err);
      }
    }

    const products = storageRepo.getProducts();
    const newProduct: Product = {
      ...product,
      id: `p-${Date.now()}`
    };
    products.unshift(newProduct);
    storageRepo.saveProducts(products);
    return newProduct;
  },

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    if (hasLiveBackend) {
      try {
        const res = await apiClient.put<Product>(`/api/admin/products/${id}`, updates);
        return res.data;
      } catch (err) {
        console.warn('Backend updateProduct failed, using local update:', err);
      }
    }

    const products = storageRepo.getProducts();
    const index = products.findIndex((p) => p.id === id);
    if (index === -1) throw new Error('Product not found');

    products[index] = { ...products[index], ...updates };
    storageRepo.saveProducts(products);
    return products[index];
  },

  async deleteProduct(id: string): Promise<void> {
    if (hasLiveBackend) {
      try {
        await apiClient.delete(`/api/admin/products/${id}`);
        return;
      } catch (err) {
        console.warn('Backend deleteProduct failed, using local delete:', err);
      }
    }

    const products = storageRepo.getProducts().filter((p) => p.id !== id);
    storageRepo.saveProducts(products);
  }
};
