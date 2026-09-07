import React from 'react';
import { VendorProductOffering } from '../../types';
import { Store, Star, Clock, Check, ShieldCheck } from 'lucide-react';

interface VendorSelectorProps {
  offerings: VendorProductOffering[];
  selectedVendorId: string | null;
  onSelectVendor: (offering: VendorProductOffering) => void;
  priceMultiplier?: number;
  cityName: string;
}

export const VendorSelector: React.FC<VendorSelectorProps> = ({
  offerings,
  selectedVendorId,
  onSelectVendor,
  priceMultiplier = 1,
  cityName,
}) => {
  if (offerings.length === 0) {
    return (
      <div className="p-5 rounded-3xl bg-rose-50/70 border border-rose-200 text-stone-700 text-sm">
        <p className="font-bold text-rose-900">
          No verified bakers currently offering this item in {cityName}.
        </p>
        <p className="text-xs text-stone-600 mt-1">
          Try switching your delivery city or browse other popular artisanal bakes.
        </p>
      </div>
    );
  }

  // Find lowest price
  const minPrice = Math.min(...offerings.map((o) => Math.round(o.price * priceMultiplier)));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-1.5">
            <Store className="w-4 h-4 text-rose-500" />
            <span>Select a Verified Local Baker / Florist</span>
            <span className="text-rose-500">*</span>
          </h3>
          <p className="text-xs text-stone-500 mt-0.5 font-medium">
            Compare prices, baker ratings, and delivery times for {cityName}
          </p>
        </div>
        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
          {offerings.length} {offerings.length === 1 ? 'Baker' : 'Bakers'}
        </span>
      </div>

      <div className="space-y-2.5">
        {offerings.map((offering) => {
          const isSelected = selectedVendorId === offering.vendorId;
          const adjustedPrice = Math.round(offering.price * priceMultiplier);
          const isBestPrice = adjustedPrice === minPrice && offerings.length > 1;

          return (
            <div
              key={offering.vendorId}
              id={`vendor-option-${offering.vendorId}`}
              onClick={() => onSelectVendor(offering)}
              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${
                isSelected
                  ? 'border-rose-500 bg-rose-50/60 shadow-xs'
                  : 'border-stone-200 bg-white hover:border-rose-300 hover:bg-rose-50/30'
              }`}
            >
              {isBestPrice && (
                <span className="absolute -top-2.5 right-4 bg-orange-400 text-white text-[10px] font-black px-2.5 py-0.5 rounded-lg uppercase tracking-wider shadow-xs">
                  Best Value
                </span>
              )}

              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                      isSelected
                        ? 'border-rose-500 bg-rose-500 text-white'
                        : 'border-stone-300 bg-white'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-stone-900 text-sm sm:text-base">
                        {offering.vendorName}
                      </span>
                      <span className="inline-flex items-center gap-0.5 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        <ShieldCheck className="w-3 h-3" /> Verified
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-stone-600 mt-1.5 flex-wrap">
                      <span className="flex items-center gap-1 font-bold text-stone-800">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                        {offering.rating}
                      </span>
                      <span className="text-stone-300">•</span>
                      <span className="flex items-center gap-1 text-rose-700 font-bold">
                        <Clock className="w-3.5 h-3.5 text-rose-500" />
                        {offering.deliveryTime}
                      </span>
                      <span className="text-stone-300">•</span>
                      <span className="text-stone-500">{offering.city}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-lg sm:text-xl font-black text-rose-600">
                    ₹{adjustedPrice}
                  </span>
                  <span className="block text-[11px] text-stone-400 font-medium">incl. all taxes</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
