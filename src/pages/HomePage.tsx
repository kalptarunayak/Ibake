import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCity } from '../context/CityContext';
import { productApi } from '../api/productApi';
import { Product } from '../types';
import { BannerCarousel } from '../components/home/BannerCarousel';
import { OccasionBar } from '../components/home/OccasionBar';
import { CategoryCards } from '../components/home/CategoryCards';
import { ProductCard } from '../components/product/ProductCard';
import { Sparkles, MapPin, ArrowRight, Shield, Clock, Award } from 'lucide-react';

export const HomePage: React.FC = () => {
  const { selectedCity, setCityModalOpen } = useCity();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const loadFeatured = async () => {
      setLoading(true);
      try {
        const products = await productApi.getProducts({ city: selectedCity });
        if (isMounted) {
          setFeaturedProducts(products.slice(0, 6));
        }
      } catch (err) {
        console.error('Failed to load featured products:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadFeatured();
    return () => {
      isMounted = false;
    };
  }, [selectedCity]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-10">
      {/* City gating reminder banner if not yet selected */}
      {!selectedCity && (
        <div className="p-4 rounded-2xl bg-amber-500 text-white flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-base">Select your city for verified delivery</h3>
              <p className="text-xs text-amber-100">
                Products, baker pricing, and delivery slots vary by location across India.
              </p>
            </div>
          </div>
          <button
            onClick={() => setCityModalOpen(true)}
            className="px-5 py-2 bg-white text-amber-900 hover:bg-amber-50 rounded-xl text-xs font-bold transition-colors whitespace-nowrap"
          >
            Select City Now
          </button>
        </div>
      )}

      {/* Hero: Admin-Published Banner Carousel */}
      <section aria-label="Promotional Carousel">
        <BannerCarousel />
      </section>

      {/* Occasion Filter Bar */}
      <section className="bg-[#FAF4ED] p-4 sm:p-5 rounded-2xl border border-amber-100 shadow-xs">
        <OccasionBar />
      </section>

      {/* 3 Signature Categories */}
      <section className="space-y-4">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block mb-1">
              Handcrafted Specialities
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-display">
              Explore Our Signature Categories
            </h2>
          </div>
        </div>
        <CategoryCards />
      </section>

      {/* Best Sellers in Selected City */}
      <section className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Available in {selectedCity || 'Your City'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 font-display">
              Trending Celebrations & Bakes
            </h2>
          </div>
          <Link
            to="/category/Cakes"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-800 hover:text-amber-950 transition-colors"
          >
            <span>View All Bakes</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-80 rounded-2xl bg-amber-100/30 animate-pulse" />
            ))}
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="p-10 rounded-2xl bg-amber-50/50 border border-amber-200 text-center">
            <h3 className="text-lg font-bold text-stone-800">
              No products found currently for {selectedCity}
            </h3>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              Please select another active city like Mumbai, Delhi NCR, or Bangalore to explore bakes.
            </p>
            <button
              onClick={() => setCityModalOpen(true)}
              className="mt-4 px-4 py-2 bg-amber-800 text-white rounded-xl text-xs font-semibold"
            >
              Switch Delivery City
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Why IBake Trust & Quality Banner */}
      <section className="bg-gradient-to-br from-[#4A2810] to-[#2D1810] text-amber-100 rounded-3xl p-8 sm:p-12 shadow-xl border border-amber-900/30">
        <div className="max-w-3xl space-y-4">
          <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-500/30 inline-block">
            The IBake Difference
          </span>
          <h2 className="text-2xl sm:text-4xl font-bold font-display text-white">
            Where Master Bakers Meet Indian Hospitality
          </h2>
          <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
            Every cake on IBake is baked fresh upon your order by premier patisseries in {selectedCity || 'your city'}. Compare bakers transparently by price, rating, and express delivery slots before checkout.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-400" />
              <span>100% FSSAI Certified Kitchens</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Live Baker Slot Scheduling</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>Gourmet Ingredients Only</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
