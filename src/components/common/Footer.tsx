import React from 'react';
import { Link } from 'react-router-dom';
import { useCity } from '../../context/CityContext';
import { Heart, ShieldCheck, Clock, Award, Phone } from 'lucide-react';

export const Footer: React.FC = () => {
  const { activeCities, selectCity } = useCity();

  return (
    <footer className="bg-white text-stone-600 pt-12 pb-8 border-t border-rose-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Props Strip */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-10 border-b border-rose-100 text-stone-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0 border border-rose-200">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-stone-900 text-sm">2-Hour Express Delivery</h4>
              <p className="text-xs text-stone-500 mt-0.5">Freshly baked upon order confirmation</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0 border border-orange-200">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-stone-900 text-sm">Verified Master Bakers</h4>
              <p className="text-xs text-stone-500 mt-0.5">Top-rated patisseries & chocolatiers</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200">
              <span className="font-black text-sm">Ⓥ</span>
            </div>
            <div>
              <h4 className="font-bold text-stone-900 text-sm">100% Eggless Options</h4>
              <p className="text-xs text-stone-500 mt-0.5">Wide selection of vegetarian bakes</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0 border border-rose-200">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-stone-900 text-sm">Chilled Transport</h4>
              <p className="text-xs text-stone-500 mt-0.5">Insulated vehicles prevent damage</p>
            </div>
          </div>
        </div>

        {/* Main Footer Links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 py-10">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-rose-500 text-white flex items-center justify-center font-black text-base">
                iB
              </div>
              <span className="text-2xl font-black tracking-tighter text-rose-500">iBake</span>
            </div>
            <p className="text-sm text-stone-500 leading-relaxed max-w-sm">
              India&apos;s premier multi-vendor artisanal confectionery marketplace. Handcrafted gourmet cakes, chocolates, and floral bouquets celebrating life&apos;s sweetest moments.
            </p>
            <div className="mt-4 flex items-center gap-2 text-xs text-stone-600">
              <Phone className="w-4 h-4 text-rose-500" />
              <span>Helpline: +91 1800-IBAKE-IN (9 AM – 11 PM IST)</span>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-stone-900 text-xs mb-3 uppercase tracking-wider">
              Categories
            </h4>
            <ul className="space-y-2 text-sm text-stone-500">
              <li><Link to="/category/Cakes" className="hover:text-rose-500 font-medium">Designer Cakes</Link></li>
              <li><Link to="/category/Cakes?occasion=Diwali" className="hover:text-rose-500 font-medium">Festive Fusion Cakes</Link></li>
              <li><Link to="/category/Chocolates" className="hover:text-rose-500 font-medium">Artisan Pralines & Truffles</Link></li>
              <li><Link to="/category/Flowers" className="hover:text-rose-500 font-medium">Exotic Bouquets</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-stone-900 text-xs mb-3 uppercase tracking-wider">
              Indian Occasions
            </h4>
            <ul className="space-y-2 text-sm text-stone-500">
              <li><Link to="/category/Cakes?occasion=Birthday" className="hover:text-rose-500 font-medium">Birthdays</Link></li>
              <li><Link to="/category/Cakes?occasion=Anniversary" className="hover:text-rose-500 font-medium">Anniversaries</Link></li>
              <li><Link to="/category/Cakes?occasion=Diwali" className="hover:text-rose-500 font-medium">Diwali Hampers</Link></li>
              <li><Link to="/category/Cakes?occasion=Rakhi" className="hover:text-rose-500 font-medium">Raksha Bandhan</Link></li>
              <li><Link to="/category/Flowers?occasion=Wedding" className="hover:text-rose-500 font-medium">Weddings</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-stone-900 text-xs mb-3 uppercase tracking-wider">
              Deliver In Cities
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {activeCities.map((city) => (
                <button
                  key={city.id}
                  onClick={() => selectCity(city.name)}
                  className="px-2.5 py-1 text-xs rounded-full bg-rose-50 hover:bg-rose-500 hover:text-white text-rose-700 font-medium border border-rose-200 transition-colors"
                >
                  {city.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-rose-100 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4">
          <p>© {new Date().getFullYear()} iBake India Private Limited. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-stone-600">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span>Multi-vendor live delivery network</span>
            </div>
            <span>•</span>
            <span className="flex items-center gap-1 text-rose-500 font-medium">
              Made with <Heart className="w-3 h-3 text-rose-500 fill-current" /> for Celebrations
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
