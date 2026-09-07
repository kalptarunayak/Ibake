import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useCity } from '../context/CityContext';
import { OrderSummary } from '../components/cart/OrderSummary';
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Store, ArrowLeft } from 'lucide-react';

export const CartPage: React.FC = () => {
  const { items, removeItem, updateQuantity, clearCart } = useCart();
  const { selectedCity } = useCity();
  const navigate = useNavigate();

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-amber-50 text-amber-800 flex items-center justify-center mx-auto">
          <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
        </div>
        <h1 className="text-3xl font-bold font-display text-stone-900">
          Your Cart is Empty
        </h1>
        <p className="text-sm text-stone-600 max-w-md mx-auto">
          Explore gourmet bakes, artisan chocolates, and fresh flowers delivered right in {selectedCity || 'your city'}.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Link
            to="/category/Cakes"
            className="py-2.5 px-5 bg-amber-800 hover:bg-amber-900 text-white text-sm font-semibold rounded-xl"
          >
            Explore Cakes
          </Link>
          <Link
            to="/category/Chocolates"
            className="py-2.5 px-5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-sm font-semibold rounded-xl"
          >
            Explore Chocolates
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link
            to="/category/Cakes"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-800 mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Continue Shopping
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-stone-900">
            Celebration Cart ({items.length})
          </h1>
        </div>

        <button
          onClick={clearCart}
          className="text-xs font-semibold text-stone-400 hover:text-red-600 underline"
        >
          Clear All Items
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Items List (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {items.map((item) => (
            <div
              key={item.cartItemId}
              className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row gap-4 justify-between"
            >
              <div className="flex gap-4">
                <img
                  src={item.imageUrl}
                  alt={item.productName}
                  className="w-22 h-22 rounded-xl object-cover bg-stone-100 shrink-0"
                />

                <div className="space-y-1 min-w-0">
                  <h3 className="font-bold text-stone-900 text-base leading-snug">
                    {item.productName}
                  </h3>

                  {/* Vendor details */}
                  <div className="flex items-center gap-1.5 text-xs text-amber-900 font-semibold">
                    <Store className="w-3.5 h-3.5 text-amber-700" />
                    <span>Baker: {item.vendorName}</span>
                  </div>

                  {item.selectedWeight && (
                    <span className="text-xs text-stone-500 block">
                      Size: {item.selectedWeight}
                    </span>
                  )}

                  <span className="text-xs text-stone-500 block">
                    ⚡ {item.deliveryTime} ({item.city})
                  </span>

                  {item.cakeMessage && (
                    <div className="text-xs italic text-stone-700 bg-amber-50 p-1.5 rounded-lg mt-1 border border-amber-100">
                      Message: &ldquo;{item.cakeMessage}&rdquo;
                    </div>
                  )}

                  {item.candleAndKnife && (
                    <span className="text-[11px] text-emerald-700 font-medium block">
                      ✓ Free party knife & candle included
                    </span>
                  )}
                </div>
              </div>

              {/* Quantity and Price */}
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-between border-t sm:border-t-0 pt-3 sm:pt-0 border-stone-100">
                <div className="text-right">
                  <span className="text-lg font-bold text-stone-900">
                    ₹{item.unitPrice * item.quantity}
                  </span>
                  <span className="block text-[11px] text-stone-400">
                    (₹{item.unitPrice} each)
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center border border-stone-200 rounded-xl bg-stone-50">
                    <button
                      onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                      className="p-1.5 text-stone-600 hover:bg-stone-200 rounded-l-xl"
                      aria-label="Reduce quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-stone-800">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                      className="p-1.5 text-stone-600 hover:bg-stone-200 rounded-r-xl"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.cartItemId)}
                    className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary & Checkout Trigger (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <OrderSummary />

          <button
            id="btn-proceed-checkout"
            onClick={() => navigate('/checkout')}
            className="w-full py-3.5 px-6 bg-amber-800 hover:bg-amber-900 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
