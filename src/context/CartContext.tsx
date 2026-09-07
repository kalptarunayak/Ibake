import React, { createContext, useContext, useEffect, useState } from 'react';
import { CartItem } from '../types';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  discount: number;
  couponCode: string;
  totalAmount: number;
  isCartDrawerOpen: boolean;
  setCartDrawerOpen: (open: boolean) => void;
  addItem: (item: Omit<CartItem, 'cartItemId'>) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  clearCart: () => void;
}

const CART_STORAGE_KEY = 'ibake_cart_items';
const COUPON_STORAGE_KEY = 'ibake_coupon_code';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [couponCode, setCouponCode] = useState<string>(() => {
    return localStorage.getItem(COUPON_STORAGE_KEY) || '';
  });

  const [isCartDrawerOpen, setCartDrawerOpen] = useState<boolean>(false);

  useEffect(() => {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem(COUPON_STORAGE_KEY, couponCode);
  }, [couponCode]);

  const addItem = (newItemData: Omit<CartItem, 'cartItemId'>) => {
    setItems((prevItems) => {
      // Check if matching item already exists (same product, same vendor, same weight)
      const existingIdx = prevItems.findIndex(
        (i) =>
          i.productId === newItemData.productId &&
          i.vendorId === newItemData.vendorId &&
          i.selectedWeight === newItemData.selectedWeight
      );

      if (existingIdx > -1) {
        const updated = [...prevItems];
        updated[existingIdx].quantity += newItemData.quantity;
        if (newItemData.cakeMessage) {
          updated[existingIdx].cakeMessage = newItemData.cakeMessage;
        }
        return updated;
      }

      const cartItemId = `ci-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      return [...prevItems, { ...newItemData, cartItemId }];
    });
    setCartDrawerOpen(true);
  };

  const removeItem = (cartItemId: string) => {
    setItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(cartItemId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.cartItemId === cartItemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setCouponCode('');
  };

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'IBAKE50' || clean === 'WELCOME50') {
      setCouponCode(clean);
      return { success: true, message: '₹50 discount applied!' };
    }
    if (clean === 'FESTIVE15') {
      setCouponCode(clean);
      return { success: true, message: '15% festive discount applied!' };
    }
    if (clean === 'FREEDEL') {
      setCouponCode(clean);
      return { success: true, message: 'Free express delivery unlocked!' };
    }
    return { success: false, message: 'Invalid coupon code. Try WELCOME50 or FESTIVE15' };
  };

  const removeCoupon = () => {
    setCouponCode('');
  };

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

  // Delivery fee logic
  let deliveryFee = subtotal > 0 ? (subtotal >= 799 ? 0 : 49) : 0;
  if (couponCode === 'FREEDEL') {
    deliveryFee = 0;
  }

  // Discount calculation
  let discount = 0;
  if (couponCode === 'IBAKE50' || couponCode === 'WELCOME50') {
    discount = Math.min(50, subtotal);
  } else if (couponCode === 'FESTIVE15') {
    discount = Math.round(subtotal * 0.15);
  }

  // 5% GST on bakery goods
  const tax = Math.round((subtotal - discount) * 0.05);
  const totalAmount = Math.max(0, subtotal - discount + deliveryFee + tax);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        deliveryFee,
        tax,
        discount,
        couponCode,
        totalAmount,
        isCartDrawerOpen,
        setCartDrawerOpen,
        addItem,
        removeItem,
        updateQuantity,
        applyCoupon,
        removeCoupon,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
