import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { Tag, ShieldCheck, Check, Sparkles } from 'lucide-react';

interface OrderSummaryProps {
  showCouponInput?: boolean;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({ showCouponInput = true }) => {
  const {
    subtotal,
    deliveryFee,
    tax,
    discount,
    couponCode,
    totalAmount,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [inputCode, setInputCode] = useState('');
  const [feedback, setFeedback] = useState<{ message: string; isError: boolean } | null>(null);

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    const res = applyCoupon(inputCode);
    setFeedback({
      message: res.message,
      isError: !res.success,
    });
    if (res.success) {
      setInputCode('');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-5 sm:p-6 shadow-xs space-y-5">
      <h3 className="font-bold text-stone-900 text-lg font-display">
        Order Bill Breakdown
      </h3>

      {/* Price Details */}
      <div className="space-y-2.5 text-sm text-stone-600">
        <div className="flex justify-between">
          <span>Items Subtotal</span>
          <span className="font-medium text-stone-900">₹{subtotal}</span>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <span>Express Delivery Fee</span>
            {subtotal >= 799 && (
              <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded ml-1.5 font-semibold">
                Free &gt; ₹799
              </span>
            )}
          </div>
          <span className="font-medium text-stone-900">
            {deliveryFee === 0 ? (
              <span className="text-emerald-700 font-bold">FREE</span>
            ) : (
              `₹${deliveryFee}`
            )}
          </span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-emerald-700">
            <span className="flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" /> Coupon Discount ({couponCode})
            </span>
            <span className="font-semibold">-₹{discount}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span>Applicable Bakery GST (5%)</span>
          <span className="font-medium text-stone-900">₹{tax}</span>
        </div>

        <div className="pt-3 border-t border-stone-200 flex justify-between items-baseline">
          <div>
            <span className="text-base font-bold text-stone-900 block">
              To Pay Amount
            </span>
            <span className="text-[11px] text-stone-400">Inclusive of all local taxes</span>
          </div>
          <span className="text-2xl font-extrabold text-amber-900 font-display">
            ₹{totalAmount}
          </span>
        </div>
      </div>

      {/* Coupon code input */}
      {showCouponInput && (
        <div className="pt-3 border-t border-stone-100">
          {couponCode ? (
            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>
                  Code <strong className="font-bold">{couponCode}</strong> applied successfully!
                </span>
              </div>
              <button
                onClick={removeCoupon}
                className="text-stone-500 hover:text-stone-800 font-semibold underline"
              >
                Remove
              </button>
            </div>
          ) : (
            <div>
              <form onSubmit={handleApply} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter coupon (e.g. WELCOME50)"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs uppercase font-medium bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-stone-900 hover:bg-black text-white text-xs font-semibold rounded-xl transition-colors"
                >
                  Apply
                </button>
              </form>

              {/* Quick coupons hint chips */}
              <div className="flex items-center gap-1.5 mt-2 flex-wrap text-[11px] text-stone-500">
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>Try:</span>
                <button
                  type="button"
                  onClick={() => applyCoupon('WELCOME50')}
                  className="font-mono text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 hover:bg-amber-100"
                >
                  WELCOME50
                </button>
                <button
                  type="button"
                  onClick={() => applyCoupon('FESTIVE15')}
                  className="font-mono text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200 hover:bg-amber-100"
                >
                  FESTIVE15
                </button>
              </div>

              {feedback && (
                <p
                  className={`text-xs mt-2 ${
                    feedback.isError ? 'text-red-600' : 'text-emerald-700'
                  }`}
                >
                  {feedback.message}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Trust Badge */}
      <div className="pt-3 border-t border-stone-100 flex items-center gap-2 text-xs text-stone-500">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>100% Satisfaction & On-Time Arrival Guarantee</span>
      </div>
    </div>
  );
};
