import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useCity } from '../context/CityContext';
import { productApi } from '../api/productApi';
import { Product, ProductCategory } from '../types';
import { ProductCard } from '../components/product/ProductCard';
import { OccasionBar } from '../components/home/OccasionBar';
import { Filter, SlidersHorizontal, MapPin, Search } from 'lucide-react';

export const CategoryPage: React.FC = () => {
  const { categoryName } = useParams<{ categoryName: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const { selectedCity, setCityModalOpen } = useCity();

  // Normalize category
  const validCategory: ProductCategory =
    categoryName && ['cakes', 'chocolates', 'flowers'].includes(categoryName.toLowerCase())
      ? (categoryName.charAt(0).toUpperCase() + categoryName.slice(1).toLowerCase()) as ProductCategory
      : 'Cakes';

  const currentOccasion = searchParams.get('occasion') || 'All';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [onlyEggless, setOnlyEggless] = useState(false);
  const [sortBy, setSortBy] = useState<'recommended' | 'price-asc' | 'price-desc' | 'rating'>('recommended');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let isMounted = true;
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const data = await productApi.getProducts({
          city: selectedCity,
          category: validCategory,
          occasion: currentOccasion === 'All' ? undefined : currentOccasion,
          search: searchQuery,
        });

        if (isMounted) {
          setProducts(data);
        }
      } catch (err) {
        console.error('Failed to fetch category products:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProducts();
    return () => {
      isMounted = false;
    };
  }, [validCategory, currentOccasion, selectedCity, searchQuery]);

  const handleOccasionChange = (occ: string) => {
    if (occ === 'All') {
      searchParams.delete('occasion');
    } else {
      searchParams.set('occasion', occ);
    }
    setSearchParams(searchParams);
  };

  // Filter and sort products in memory
  let filtered = [...products];
  if (onlyEggless) {
    filtered = filtered.filter((p) => p.isEggless);
  }

  filtered.sort((a, b) => {
    const aMinPrice = a.offerings.length > 0 ? Math.min(...a.offerings.map((o) => o.price)) : 0;
    const bMinPrice = b.offerings.length > 0 ? Math.min(...b.offerings.map((o) => o.price)) : 0;

    if (sortBy === 'price-asc') return aMinPrice - bMinPrice;
    if (sortBy === 'price-desc') return bMinPrice - aMinPrice;
    if (sortBy === 'rating') {
      const aRating = a.offerings.reduce((s, o) => s + o.rating, 0) / (a.offerings.length || 1);
      const bRating = b.offerings.reduce((s, o) => s + o.rating, 0) / (b.offerings.length || 1);
      return bRating - aRating;
    }
    return 0; // recommended default
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Category Header */}
      <div className="bg-[#FAF4ED] rounded-3xl p-6 sm:p-8 border border-amber-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 uppercase tracking-wider mb-1">
            <span>Marketplace Catalog</span>
            <span>•</span>
            <button
              onClick={() => setCityModalOpen(true)}
              className="inline-flex items-center gap-1 hover:underline text-amber-900"
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Serving {selectedCity || 'Select City'}</span>
            </button>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-display text-stone-900">
            {validCategory === 'Cakes'
              ? 'Artisanal & Celebration Cakes'
              : validCategory === 'Chocolates'
              ? 'Handcrafted Gourmet Chocolates'
              : 'Fresh Floral Bouquets & Baskets'}
          </h1>
          <p className="text-sm text-stone-600 mt-1 max-w-xl">
            Compare verified local bakeries & confectioners in {selectedCity || 'your city'}. Every item is prepared fresh and delivered in express refrigerated slots.
          </p>
        </div>

        {/* Search within category */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={`Search ${validCategory.toLowerCase()}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600"
          />
        </div>
      </div>

      {/* Occasion Filter Chips */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
        <OccasionBar
          selectedOccasion={currentOccasion}
          onSelectOccasion={handleOccasionChange}
          navigateOnClick={false}
        />
      </div>

      {/* Secondary Controls Bar (Eggless switch & Price Sort) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
            Showing {filtered.length} {filtered.length === 1 ? 'item' : 'items'}
          </span>

          {/* Eggless toggle button */}
          <button
            onClick={() => setOnlyEggless(!onlyEggless)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              onlyEggless
                ? 'bg-green-700 text-white border-green-700'
                : 'bg-white text-stone-700 border-stone-200 hover:border-green-600'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full border border-current flex items-center justify-center">
              <span className="w-1 h-1 bg-current rounded-full" />
            </span>
            <span>100% Eggless Only</span>
          </button>
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-3.5 h-3.5 text-stone-500" />
          <span className="text-xs font-medium text-stone-600">Sort By:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs font-semibold bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-600 text-stone-800"
          >
            <option value="recommended">Recommended</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Baker Rating</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="h-88 rounded-2xl bg-amber-50/50 animate-pulse border border-stone-100" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-800 flex items-center justify-center mx-auto">
            <Filter className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold font-display text-stone-900">
            No bakes match your current criteria
          </h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            No items found under {validCategory} for {selectedCity || 'this city'} with &ldquo;{currentOccasion}&rdquo; occasion. Try clearing the occasion or switching delivery cities.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <button
              onClick={() => handleOccasionChange('All')}
              className="px-4 py-2 bg-stone-900 text-white rounded-xl text-xs font-semibold"
            >
              Clear Occasion Filter
            </button>
            <button
              onClick={() => setCityModalOpen(true)}
              className="px-4 py-2 bg-amber-800 text-white rounded-xl text-xs font-semibold"
            >
              Change City
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
