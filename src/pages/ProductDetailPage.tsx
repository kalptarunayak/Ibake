import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCity } from '../context/CityContext';
import { useCart } from '../context/CartContext';
import { productApi } from '../api/productApi';
import { Product, VendorProductOffering } from '../types';
import { VendorSelector } from '../components/product/VendorSelector';
import {
  ArrowLeft,
  Star,
  Clock,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  MapPin,
  AlertCircle
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const { selectedCity, setCityModalOpen } = useCity();
  const { addItem } = useCart();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVendor, setSelectedVendor] = useState<VendorProductOffering | null>(null);
  const [selectedWeight, setSelectedWeight] = useState<string>('');
  const [weightMultiplier, setWeightMultiplier] = useState<number>(1);
  const [cakeMessage, setCakeMessage] = useState<string>('');
  const [candleAndKnife, setCandleAndKnife] = useState<boolean>(true);
  const [validationError, setValidationError] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    const fetchProduct = async () => {
      if (!productId) return;
      setLoading(true);
      try {
        const data = await productApi.getProductById(productId, selectedCity);
        if (isMounted && data) {
          setProduct(data);
          // Set default weight if available
          if (data.weightOptions && data.weightOptions.length > 0) {
            setSelectedWeight(data.weightOptions[0].label);
            setWeightMultiplier(data.weightOptions[0].multiplier);
          }
          // If offerings exist, auto-select the best vendor or leave for user to choose
          if (data.offerings && data.offerings.length > 0) {
            // Pick lowest price offering as default selection
            const bestOffering = [...data.offerings].sort((a, b) => a.price - b.price)[0];
            setSelectedVendor(bestOffering);
          } else {
            setSelectedVendor(null);
          }
        }
      } catch (err) {
        console.error('Failed to fetch product details:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProduct();
    return () => {
      isMounted = false;
    };
  }, [productId, selectedCity]);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-800" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-stone-900 font-display">Product Not Found</h2>
        <p className="text-xs text-stone-600">The product you are looking for may have been updated or removed.</p>
        <Link to="/category/Cakes" className="inline-block py-2 px-4 bg-amber-800 text-white rounded-xl text-xs font-semibold">
          Return to Cakes
        </Link>
      </div>
    );
  }

  const handleWeightChange = (option: { label: string; multiplier: number }) => {
    setSelectedWeight(option.label);
    setWeightMultiplier(option.multiplier);
  };

  const handleAddToCart = () => {
    if (!selectedVendor) {
      setValidationError('Please select a verified baker from the vendor comparison list below.');
      return;
    }

    setValidationError('');

    const unitPrice = Math.round(selectedVendor.price * weightMultiplier);

    addItem({
      productId: product.id,
      productName: product.name,
      category: product.category,
      imageUrl: product.imageUrl,
      vendorId: selectedVendor.vendorId,
      vendorName: selectedVendor.vendorName,
      unitPrice,
      selectedWeight: selectedWeight || undefined,
      deliveryTime: selectedVendor.deliveryTime,
      city: selectedCity,
      quantity: 1,
      cakeMessage: cakeMessage.trim() || undefined,
      candleAndKnife,
    });
  };

  const currentPrice = selectedVendor
    ? Math.round(selectedVendor.price * weightMultiplier)
    : product.offerings.length > 0
    ? Math.round(product.offerings[0].price * weightMultiplier)
    : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <Link
        to={`/category/${product.category}`}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900"
      >
        <ArrowLeft className="w-4 h-4" /> Back to {product.category}
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Product Image & Overview (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative rounded-3xl overflow-hidden bg-stone-100 border border-stone-200 shadow-sm aspect-square">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.isEggless && (
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-xs px-2.5 py-1 rounded-lg shadow-xs border border-green-600/30 flex items-center gap-1.5 text-xs font-semibold text-green-800">
                <span className="w-3.5 h-3.5 border border-green-600 flex items-center justify-center p-0.5">
                  <span className="w-1.5 h-1.5 bg-green-600 rounded-full" />
                </span>
                <span>100% Eggless Vegetarian</span>
              </div>
            )}
          </div>

          {/* Occasion Tags */}
          <div className="p-4 rounded-2xl bg-[#FAF4ED] border border-amber-100/70 space-y-2">
            <span className="text-xs font-bold text-amber-900 uppercase tracking-wider block">
              Perfect For Celebrations:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {product.occasions.map((occ) => (
                <span
                  key={occ}
                  className="px-2.5 py-0.5 rounded-full bg-white border border-amber-200 text-stone-700 text-xs font-medium"
                >
                  🎉 {occ}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Customization & Vendor Comparison (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 uppercase tracking-wider mb-1">
              <span>{product.category}</span>
              <span>•</span>
              <button
                onClick={() => setCityModalOpen(true)}
                className="inline-flex items-center gap-1 hover:underline text-stone-700"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-700" />
                <span>{selectedCity || 'Select City'}</span>
              </button>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-stone-900 leading-tight">
              {product.name}
            </h1>
            <p className="text-sm text-stone-600 mt-2 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Weight / Size Selection */}
          {product.weightOptions && product.weightOptions.length > 0 && (
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-800">
                Select Size / Weight Option:
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {product.weightOptions.map((opt) => {
                  const isSelected = selectedWeight === opt.label;
                  return (
                    <button
                      key={opt.label}
                      onClick={() => handleWeightChange(opt)}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-left ${
                        isSelected
                          ? 'border-amber-800 bg-amber-800 text-white shadow-xs'
                          : 'border-stone-200 bg-white text-stone-700 hover:border-amber-400'
                      }`}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* CRITICAL: Vendor Comparison List */}
          <div className="pt-2 border-t border-stone-200">
            <VendorSelector
              offerings={product.offerings}
              selectedVendorId={selectedVendor ? selectedVendor.vendorId : null}
              onSelectVendor={(v) => {
                setSelectedVendor(v);
                setValidationError('');
              }}
              priceMultiplier={weightMultiplier}
              cityName={selectedCity || 'your city'}
            />
          </div>

          {/* Custom Message on Cake (if category is Cakes) */}
          {product.category === 'Cakes' && (
            <div className="space-y-2 pt-2 border-t border-stone-200">
              <label
                htmlFor="input-cake-msg"
                className="block text-xs font-bold uppercase tracking-wider text-stone-800"
              >
                Message on Cake (Complimentary Piping):
              </label>
              <input
                id="input-cake-msg"
                type="text"
                maxLength={35}
                placeholder="e.g. Happy 25th Birthday Rhea!"
                value={cakeMessage}
                onChange={(e) => setCakeMessage(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-white rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600"
              />
              <span className="text-[11px] text-stone-400 block text-right">
                {cakeMessage.length}/35 characters
              </span>
            </div>
          )}

          {/* Candle & Knife Checkbox */}
          <div className="flex items-center gap-2 text-xs text-stone-700">
            <input
              type="checkbox"
              id="chk-candle-knife"
              checked={candleAndKnife}
              onChange={(e) => setCandleAndKnife(e.target.checked)}
              className="w-4 h-4 rounded text-amber-800 focus:ring-amber-600"
            />
            <label htmlFor="chk-candle-knife" className="cursor-pointer">
              Include complimentary party knife and birthday candle set
            </label>
          </div>

          {/* Validation Error Notice */}
          {validationError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Add to Cart & Checkout Bar */}
          <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[11px] text-stone-400 uppercase tracking-wider block font-semibold">
                {selectedVendor ? `Price by ${selectedVendor.vendorName}` : 'Select a Vendor'}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-bold text-stone-900 font-display">
                  ₹{currentPrice}
                </span>
                {selectedVendor && (
                  <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {selectedVendor.deliveryTime}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                id="btn-add-to-cart-pdp"
                onClick={handleAddToCart}
                disabled={product.offerings.length === 0}
                className={`py-3.5 px-6 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-sm ${
                  product.offerings.length === 0
                    ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                    : 'bg-amber-800 hover:bg-amber-900 text-white'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Celebration Cart</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
