import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useCity } from '../../context/CityContext';
import { X, Trash2, Plus, Minus, ArrowRight, ShoppingBag, Store } from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const {
    items,
    itemCount,
    subtotal,
    deliveryFee,
    tax,
    discount,
    totalAmount,
    isCartDrawerOpen,
    setCartDrawerOpen,
    removeItem,
    updateQuantity,
  } = useCart();

  const { selectedCity } = useCity();
  const navigate = useNavigate();

  if (!isCartDrawerOpen) return null;

  const handleCheckout = () => {
    setCartDrawerOpen(false);
    navigate('/checkout');
  };

  return (
    <div
      id="cart-drawer-backdrop"
      className="fixed inset-0 z-50 overflow-hidden bg-stone-900/60 backdrop-blur-xs flex justify-end"
    >
      <div
        id="cart-drawer-panel"
        className="w-full max-w-md bg-[#FFFDF9] h-full shadow-2xl flex flex-col justify-between"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 bg-[#FAF4ED] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-800 text-white flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-stone-900 text-base sm:text-lg font-display">
                Your Celebration Cart
              </h2>
              <span className="text-xs text-stone-500">
                {itemCount} {itemCount === 1 ? 'item' : 'items'} • Delivering in {selectedCity || 'Selected City'}
              </span>
            </div>
          </div>
          <button
            id="btn-close-cart-drawer"
            onClick={() => setCartDrawerOpen(false)}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/50"
            aria-label="Close Cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
              <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center">
                <ShoppingBag className="w-8 h-8 stroke-[1.5]" />
              </div>
              <h3 className="font-bold text-stone-800 text-lg font-display">
                Your cart is empty
              </h3>
              <p className="text-xs text-stone-500 max-w-xs leading-relaxed">
                Explore hand-crafted cakes, fresh flowers, and artisan chocolates prepared by master local bakers.
              </p>
              <button
                onClick={() => {
                  setCartDrawerOpen(false);
                  navigate('/category/Cakes');
                }}
                className="mt-2 py-2 px-4 bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold rounded-xl"
              >
                Browse Cakes
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.cartItemId}
                className="flex gap-3 p-3.5 rounded-xl border border-stone-200 bg-white shadow-xs"
              >
                <img
                  src={item.imageUrl}
                  alt={item.productName}
                  className="w-18 h-18 rounded-lg object-cover bg-stone-100 shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <h4 className="font-semibold text-stone-900 text-sm truncate">
                      {item.productName}
                    </h4>
                    <button
                      onClick={() => removeItem(item.cartItemId)}
                      className="text-stone-400 hover:text-red-600 p-0.5"
                      title="Remove Item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Vendor Details */}
                  <div className="flex items-center gap-1 text-xs text-amber-900 font-medium mt-0.5">
                    <Store className="w-3 h-3 text-amber-700" />
                    <span className="truncate">{item.vendorName}</span>
                  </div>

                  {item.selectedWeight && (
                    <span className="text-[11px] text-stone-500 block">
                      Size: {item.selectedWeight}
                    </span>
                  )}

                  {item.cakeMessage && (
                    <p className="text-[11px] italic text-stone-600 truncate bg-amber-50/70 px-1.5 py-0.5 rounded mt-1">
                      &ldquo;{item.cakeMessage}&rdquo;
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-100">
                    <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50">
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                        className="p-1 text-stone-600 hover:bg-stone-200 rounded-l-lg"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-bold text-stone-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                        className="p-1 text-stone-600 hover:bg-stone-200 rounded-r-lg"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="font-bold text-stone-900 text-sm">
                      ₹{item.unitPrice * item.quantity}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with summary & checkout button */}
        {items.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-stone-200 bg-[#FAF4ED] space-y-3">
            <div className="space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-stone-800">₹{subtotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee ({selectedCity || 'City'})</span>
                <span className="font-semibold text-stone-800">
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-700 font-bold">FREE</span>
                  ) : (
                    `₹${deliveryFee}`
                  )}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Coupon Savings</span>
                  <span className="font-semibold">-₹{discount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Taxes & GST (5%)</span>
                <span className="font-semibold text-stone-800">₹{tax}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-200">
                <span>Grand Total</span>
                <span className="text-amber-900 text-base">₹{totalAmount}</span>
              </div>
            </div>

            <button
              id="btn-drawer-checkout"
              onClick={handleCheckout}
              className="w-full py-3 px-4 bg-amber-800 hover:bg-amber-900 text-white font-bold rounded-xl text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <span>Proceed to Delivery & Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <Link
              to="/cart"
              onClick={() => setCartDrawerOpen(false)}
              className="block text-center text-xs font-semibold text-stone-600 hover:text-amber-900"
            >
              View Full Cart & Apply Coupons
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
