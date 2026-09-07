import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { orderApi } from '../api/orderApi';
import { Order } from '../types';
import { CheckCircle2, Clock, MapPin, Store, ArrowRight, Package } from 'lucide-react';

export const OrderSuccessPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchOrder = async () => {
      if (!orderId) return;
      setLoading(true);
      try {
        const data = await orderApi.getOrderById(orderId);
        if (isMounted) setOrder(data);
      } catch (err) {
        console.error('Failed to load order receipt:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchOrder();
    return () => {
      isMounted = false;
    };
  }, [orderId]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-800" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold font-display text-stone-900">Order Confirmed!</h2>
        <p className="text-xs text-stone-600">Your bakery celebration order was received.</p>
        <Link to="/" className="inline-block py-2 px-4 bg-amber-800 text-white rounded-xl text-xs font-semibold">
          Return to Storefront
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      {/* Celebration Header Banner */}
      <div className="bg-[#FAF4ED] border border-amber-200/80 rounded-3xl p-6 sm:p-8 text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
          <CheckCircle2 className="w-10 h-10 stroke-[2]" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold font-display text-stone-900">
          Celebration Order Confirmed!
        </h1>
        <p className="text-sm text-stone-600 max-w-md mx-auto">
          Your order has been transmitted directly to the master baker kitchen in <strong className="text-amber-900 font-bold">{order.city}</strong>.
        </p>

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-stone-200 text-xs font-mono font-semibold text-stone-800 shadow-xs">
          <span>Order Reference:</span>
          <strong className="text-amber-900">{order.orderNumber}</strong>
        </div>
      </div>

      {/* Delivery Status & Timing */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-stone-400 uppercase tracking-wider block font-semibold">
                Scheduled Delivery
              </span>
              <p className="text-sm font-bold text-stone-900 mt-0.5">
                {order.deliverySlot}
              </p>
              <span className="text-xs text-stone-500">Date: {order.deliveryDate}</span>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] text-stone-400 uppercase tracking-wider block font-semibold">
                Deliver To
              </span>
              <p className="text-sm font-bold text-stone-900 mt-0.5">
                {order.deliveryAddress.fullName} (+91 {order.deliveryAddress.phone})
              </p>
              <p className="text-xs text-stone-500 line-clamp-2">
                {order.deliveryAddress.addressLine}, {order.deliveryAddress.pincode}, {order.city}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Items Summary */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs space-y-4">
        <h3 className="font-bold text-stone-900 text-base font-display flex items-center gap-2">
          <Package className="w-4 h-4 text-amber-700" />
          <span>Items Ordered ({order.items.length})</span>
        </h3>

        <div className="divide-y divide-stone-100">
          {order.items.map((item) => (
            <div key={item.cartItemId} className="py-3 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={item.imageUrl}
                  alt={item.productName}
                  className="w-14 h-14 rounded-lg object-cover bg-stone-100 shrink-0"
                />
                <div>
                  <h4 className="font-bold text-stone-900 text-sm">{item.productName}</h4>
                  <span className="text-xs text-amber-900 font-medium flex items-center gap-1">
                    <Store className="w-3 h-3 text-amber-700" /> {item.vendorName}
                  </span>
                  <span className="text-[11px] text-stone-400 block">
                    Qty: {item.quantity} {item.selectedWeight ? `• ${item.selectedWeight}` : ''}
                  </span>
                </div>
              </div>
              <span className="font-bold text-stone-900 text-sm">
                ₹{item.unitPrice * item.quantity}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-3 border-t border-stone-200 flex justify-between items-center text-sm">
          <span className="font-semibold text-stone-600">Total Paid ({order.paymentMethod})</span>
          <span className="text-xl font-bold text-amber-900 font-display">₹{order.totalAmount}</span>
        </div>
      </div>

      {/* Return to home button */}
      <div className="text-center pt-2">
        <Link
          to="/"
          className="inline-flex items-center gap-2 py-3 px-6 bg-amber-800 hover:bg-amber-900 text-white font-semibold rounded-xl text-sm transition-colors shadow-xs"
        >
          <span>Explore More Bakes in {order.city}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
