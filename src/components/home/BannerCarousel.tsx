import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCity } from '../../context/CityContext';
import { bannerApi } from '../../api/bannerApi';
import { Banner } from '../../types';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';

export const BannerCarousel: React.FC = () => {
  const { selectedCity } = useCity();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const loadBanners = async () => {
      setLoading(true);
      try {
        const data = await bannerApi.getBanners(selectedCity);
        if (isMounted) {
          setBanners(data);
          setCurrentIndex(0);
        }
      } catch (err) {
        console.error('Failed to load promotional banners:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    loadBanners();
    return () => {
      isMounted = false;
    };
  }, [selectedCity]);

  // Auto rotation
  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  if (loading) {
    return (
      <div className="w-full h-64 sm:h-80 md:h-96 rounded-3xl bg-amber-100/40 animate-pulse flex items-center justify-center">
        <span className="text-sm font-medium text-amber-900/60">Loading featured celebrations...</span>
      </div>
    );
  }

  if (banners.length === 0) {
    return null;
  }

  const current = banners[currentIndex];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const handleBannerClick = () => {
    if (current.link) {
      navigate(current.link);
    }
  };

  return (
    <div
      id="banner-carousel-container"
      className="relative w-full h-72 sm:h-88 md:h-[400px] rounded-3xl overflow-hidden shadow-lg border border-amber-900/10 group cursor-pointer"
      onClick={handleBannerClick}
    >
      {/* Background Image with Warm Overlay */}
      <img
        src={current.imageUrl}
        alt={current.title}
        className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent sm:bg-gradient-to-r sm:from-black/80 sm:via-black/50 sm:to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 p-6 sm:p-10 md:p-14 flex flex-col justify-end sm:justify-center max-w-xl text-white">
        <div className="flex items-center gap-2 mb-2 sm:mb-3">
          {current.occasion && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-500 text-white text-xs font-bold uppercase tracking-wider shadow-sm">
              <Sparkles className="w-3 h-3" /> {current.occasion}
            </span>
          )}
          <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/25 text-white text-xs font-bold backdrop-blur-md">
            {current.city === 'All' ? 'Pan-India Celebration' : `${current.city} Exclusive`}
          </span>
        </div>

        <h2 className="text-2xl sm:text-4xl md:text-5xl font-black leading-tight text-white mb-2 sm:mb-3 drop-shadow-sm">
          {current.title}
        </h2>

        <p className="text-sm sm:text-base text-rose-50 line-clamp-2 mb-4 drop-shadow-xs max-w-md font-medium">
          {current.subtitle}
        </p>

        <div>
          <span className="inline-flex items-center gap-2 bg-white text-rose-600 px-5 py-2.5 rounded-2xl font-bold text-sm shadow-md group-hover:bg-rose-50 transition-colors">
            <span>Order for {selectedCity || 'Your City'}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button
            id="btn-carousel-prev"
            onClick={handlePrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/40 hover:bg-white text-stone-900 flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all z-10 shadow-md"
            aria-label="Previous Slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            id="btn-carousel-next"
            onClick={handleNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/40 hover:bg-white text-stone-900 flex items-center justify-center backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all z-10 shadow-md"
            aria-label="Next Slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIndex(idx);
                }}
                className={`h-2.5 rounded-full transition-all ${
                  idx === currentIndex ? 'w-7 bg-rose-500' : 'w-2.5 bg-white/60 hover:bg-white'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
