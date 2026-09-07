import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useCity } from '../context/CityContext';
import { useAuth } from '../context/AuthContext';
import { orderApi } from '../api/orderApi';
import { OrderSummary } from '../components/cart/OrderSummary';
import {
  MapPin,
  Calendar,
  Clock,
  CreditCard,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  Lock
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const {
    items,
    subtotal,
    deliveryFee,
    tax,
    discount,
    totalAmount,
    clearCart,
  } = useCart();
  const { selectedCity } = useCity();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if cart is empty
  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-stone-900 font-display">Your Cart is Empty</h2>
        <p className="text-xs text-stone-600">Please add items to your cart before proceeding to checkout.</p>
        <Link to="/category/Cakes" className="inline-block py-2 px-4 bg-amber-800 text-white rounded-xl text-xs font-semibold">
          Browse Bakes
        </Link>
      </div>
    );
  }

  // Address Form State
  const [formData, setFormData] = useState({
    fullName: user ? user.name : '',
    phone: user?.phone || '',
    addressLine: '',
    landmark: '',
    pincode: '',
    city: selectedCity || 'Mumbai',
    deliveryDate: new Date().toISOString().split('T')[0],
    deliverySlot: 'Express 2-Hour Delivery (Immediate Fresh Bake)',
    paymentMethod: 'UPI / Google Pay / PhonePe',
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Form validation
    if (!formData.fullName.trim()) {
      setErrorMessage('Please enter recipient full name');
      return;
    }
    if (!formData.phone.trim() || formData.phone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!formData.addressLine.trim()) {
      setErrorMessage('Please enter delivery address details');
      return;
    }
    if (!formData.pincode.trim() || formData.pincode.length < 6) {
      setErrorMessage('Please enter a valid 6-digit Indian pincode');
      return;
    }

    setLoading(true);

    try {
      // Call backend order API (Spring Boot / apiClient)
      const newOrder = await orderApi.createOrder({
        userId: user ? user.id : 'guest-user',
        userEmail: user ? user.email : 'guest@ibake.in',
        items,
        city: selectedCity || formData.city,
        deliveryAddress: {
          fullName: formData.fullName,
          phone: formData.phone,
          addressLine: formData.addressLine,
          landmark: formData.landmark || undefined,
          pincode: formData.pincode,
          city: selectedCity || formData.city,
        },
        deliverySlot: formData.deliverySlot,
        deliveryDate: formData.deliveryDate,
        subtotal,
        deliveryFee,
        discount,
        tax,
        totalAmount,
        paymentMethod: formData.paymentMethod,
        status: 'CONFIRMED',
      });

      clearCart();
      navigate(`/order-success/${newOrder.id}`);
    } catch (err: any) {
      console.error('Order placement error:', err);
      setErrorMessage(err?.message || 'Failed to process order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <Link
          to="/cart"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-800 mb-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Cart
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-stone-900">
          Delivery Address & Checkout
        </h1>
        <p className="text-xs text-stone-500 mt-0.5">
          Delivery verified for <strong className="text-amber-900 font-semibold">{selectedCity}</strong>
        </p>
      </div>

      <form onSubmit={handlePlaceOrder}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Form: Details (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Recipient Details */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-stone-900 font-display flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-700" />
                <span>Recipient & Delivery Address</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Recipient Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    placeholder="e.g. Vikram Malhotra"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Contact Phone Number *
                  </label>
                  <div className="flex">
                    <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-stone-200 bg-stone-100 text-stone-500 text-xs font-medium">
                      +91
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      required
                      placeholder="98765 43210"
                      maxLength={10}
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-200 rounded-r-xl focus:outline-none focus:ring-1 focus:ring-amber-600"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Complete Flat / House No., Society / Street Address *
                  </label>
                  <input
                    type="text"
                    name="addressLine"
                    required
                    placeholder="e.g. Flat 402, Royal Palms, Sector 14"
                    value={formData.addressLine}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    name="landmark"
                    placeholder="Near Apollo Pharmacy"
                    value={formData.landmark}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Postal Pincode *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    required
                    maxLength={6}
                    placeholder="400050"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-600"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Date & Time Slot */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-stone-900 font-display flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-700" />
                <span>Select Delivery Slot for {selectedCity}</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Delivery Date
                  </label>
                  <input
                    type="date"
                    name="deliveryDate"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={formData.deliveryDate}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Preferred Time Slot
                  </label>
                  <select
                    name="deliverySlot"
                    value={formData.deliverySlot}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-600"
                  >
                    <option value="Express 2-Hour Delivery (Immediate Fresh Bake)">
                      ⚡ Express 2-Hour Slot (Today)
                    </option>
                    <option value="Morning Slot (9:00 AM - 12:00 PM)">
                      🌅 Morning Slot (9:00 AM - 12:00 PM)
                    </option>
                    <option value="Afternoon Slot (1:00 PM - 5:00 PM)">
                      ☀️ Afternoon Slot (1:00 PM - 5:00 PM)
                    </option>
                    <option value="Evening Celebration (6:00 PM - 9:00 PM)">
                      🌆 Evening Slot (6:00 PM - 9:00 PM)
                    </option>
                    <option value="Midnight Surprise (11:15 PM - 12:00 AM)">
                      🌙 Midnight Surprise (11:15 PM - 12:00 AM)
                    </option>
                  </select>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-stone-900 font-display flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-amber-700" />
                <span>Payment Preference</span>
              </h2>

              <div className="space-y-2">
                {[
                  { id: 'pay-upi', label: 'UPI / Google Pay / PhonePe / Paytm', desc: 'Instant bank transfer via QR or UPI ID' },
                  { id: 'pay-cards', label: 'Credit / Debit Card', desc: 'Visa, MasterCard, RuPay, Amex accepted' },
                  { id: 'pay-netbanking', label: 'Net Banking', desc: 'All Indian major banks supported' },
                  { id: 'pay-cod', label: 'Cash on Delivery (COD)', desc: 'Pay upon refrigerated delivery inspection' }
                ].map((m) => (
                  <label
                    key={m.id}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                      formData.paymentMethod === m.label
                        ? 'border-amber-700 bg-amber-50/40 shadow-xs'
                        : 'border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={m.label}
                      checked={formData.paymentMethod === m.label}
                      onChange={handleInputChange}
                      className="mt-1 text-amber-700 focus:ring-amber-600"
                    />
                    <div>
                      <span className="font-semibold text-sm text-stone-900 block">
                        {m.label}
                      </span>
                      <span className="text-xs text-stone-500 block mt-0.5">
                        {m.desc}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>

          {/* Right Summary & Place Order Action (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <OrderSummary showCouponInput={false} />

            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1">
              <div className="flex items-center gap-1.5 font-bold">
                <Lock className="w-3.5 h-3.5 text-amber-800" />
                <span>256-Bit Encrypted Spring Boot API Checkout</span>
              </div>
              <p className="text-stone-600">
                Your order is routed directly to the selected vendor kitchen in {selectedCity} with SMS & tracking.
              </p>
            </div>

            <button
              id="btn-place-order"
              type="submit"
              disabled={loading}
              className="w-full py-4 px-6 bg-amber-800 hover:bg-amber-900 text-white font-bold rounded-xl text-base transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50"
            >
              {loading ? (
                <span>Confirming Order with Kitchen...</span>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Place Order • ₹{totalAmount}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
