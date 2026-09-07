import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { useCity } from '../../context/CityContext';
import { Star, Store, Clock, ArrowRight } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { selectedCity } = useCity();

  // Find lowest price among city offerings
  const offerings = product.offerings || [];
  const vendorCount = offerings.length;

  const minPrice = offerings.length > 0
    ? Math.min(...offerings.map((o) => o.price))
    : 0;

  // Average vendor rating
  const avgRating = offerings.length > 0
    ? (offerings.reduce((sum, o) => sum + o.rating, 0) / offerings.length).toFixed(1)
    : '4.8';

  // Fastest delivery time
  const fastestDelivery = offerings.length > 0
    ? offerings[0].deliveryTime
    : 'Today in 2 hrs';

  return (
    <div
      id={`product-card-${product.id}`}
      className="group bg-white rounded-3xl border border-rose-100 p-3.5 shadow-sm hover:shadow-md hover:border-rose-300 transition-all duration-300 flex flex-col h-full"
    >
      {/* Product Image & Badges */}
      <Link to={`/product/${product.id}`} className="relative h-48 rounded-2xl overflow-hidden block bg-rose-50 mb-3">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Veg / Eggless green dot indicator */}
        {product.isEggless && (
          <div
            className="absolute top-2.5 left-2.5 bg-white/95 backdrop-blur-md px-2 py-0.5 rounded-lg shadow-xs border border-emerald-500/40 flex items-center gap-1 text-[11px] font-bold text-emerald-800"
            title="100% Pure Vegetarian / Eggless"
          >
            <span className="w-3.5 h-3.5 border border-emerald-600 flex items-center justify-center p-0.5">
              <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />
            </span>
            <span className="text-[10px]">Eggless</span>
          </div>
        )}

        {/* Occasion pill */}
        {product.occasions && product.occasions.length > 0 && (
          <span className="absolute top-2.5 right-2.5 bg-rose-500/90 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
            {product.occasions[0]}
          </span>
        )}

        {/* Fastest Delivery Badge */}
        <div className="absolute bottom-2 left-2 right-2 bg-stone-900/75 backdrop-blur-md text-white text-[11px] px-2.5 py-1 rounded-xl flex items-center justify-between font-medium">
          <span className="flex items-center gap-1 text-stone-200">
            <Clock className="w-3 h-3 text-orange-400" /> {fastestDelivery}
          </span>
          <span className="flex items-center gap-1 text-amber-300 font-bold">
            <Star className="w-3 h-3 fill-amber-300 text-amber-300" /> {avgRating}
          </span>
        </div>
      </Link>

      {/* Product Info */}
      <div className="flex flex-col flex-1 justify-between px-1">
        <div>
          <Link to={`/product/${product.id}`} className="block">
            <h3 className="font-bold text-stone-800 text-base leading-snug group-hover:text-rose-600 transition-colors line-clamp-1">
              {product.name}
            </h3>
          </Link>
          <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="mt-3 pt-2.5 border-t border-rose-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-stone-400 uppercase tracking-wider block font-bold">
              Starting from
            </span>
            <span className="text-lg font-black text-rose-600">
              ₹{minPrice}
            </span>
          </div>

          <div className="text-right">
            {/* Vendors Count Pill */}
            <div className="flex items-center gap-1 text-[11px] font-bold text-orange-500 uppercase">
              <Store className="w-3 h-3 text-orange-500" />
              <span>{vendorCount} {vendorCount === 1 ? 'Vendor' : 'Vendors'}</span>
            </div>
            <span className="text-[10px] text-stone-400 block mt-0.5">
              Serving {selectedCity || 'your city'}
            </span>
          </div>
        </div>

        {/* View Vendors Button */}
        <Link
          to={`/product/${product.id}`}
          id={`btn-view-product-${product.id}`}
          className="mt-3 w-full py-2 px-3 bg-rose-50 hover:bg-rose-500 hover:text-white text-rose-700 text-xs font-bold rounded-2xl border border-rose-200 hover:border-rose-500 transition-all flex items-center justify-center gap-1.5 shadow-xs"
        >
          <span>Pick Vendor & Customize</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
