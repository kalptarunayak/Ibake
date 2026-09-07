import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useCity } from '../../context/CityContext';

export const CategoryCards: React.FC = () => {
  const { selectedCity } = useCity();

  const categories = [
    {
      title: 'Artisanal Cakes',
      category: 'Cakes',
      tagline: 'Freshly baked Belgium truffle, Red velvet & Rasmalai fusion cakes',
      imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80',
      badge: 'Eggless Available',
      link: '/category/Cakes',
      accentColor: 'from-amber-950/80 to-amber-900/30'
    },
    {
      title: 'Gourmet Chocolates',
      category: 'Chocolates',
      tagline: 'Hand-rolled hazelnut truffles, salted caramel rocks & praline boxes',
      imageUrl: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&w=600&q=80',
      badge: 'Pure Cocoa Butter',
      link: '/category/Chocolates',
      accentColor: 'from-stone-950/85 to-stone-900/30'
    },
    {
      title: 'Fresh Floral Bouquets',
      category: 'Flowers',
      tagline: 'Dutch roses, festive marigold baskets & delicate lilies',
      imageUrl: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=600&q=80',
      badge: 'Farm Fresh Stems',
      link: '/category/Flowers',
      accentColor: 'from-rose-950/85 to-rose-900/30'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {categories.map((cat) => (
        <Link
          key={cat.category}
          to={cat.link}
          id={`card-category-${cat.category.toLowerCase()}`}
          className="group relative h-64 sm:h-72 rounded-3xl overflow-hidden shadow-sm border border-rose-100 hover:shadow-lg hover:border-rose-300 transition-all flex flex-col justify-end p-6"
        >
          {/* Image */}
          <img
            src={cat.imageUrl}
            alt={cat.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
          {/* Gradient Overlay */}
          <div className={`absolute inset-0 bg-gradient-to-t ${cat.accentColor} via-black/40`} />

          {/* Card Content */}
          <div className="relative z-10 text-white">
            <span className="inline-block px-3 py-1 rounded-full bg-white/30 backdrop-blur-md text-white text-[11px] font-bold mb-2 shadow-xs">
              {cat.badge}
            </span>
            <div className="flex items-center justify-between">
              <h3 className="text-xl sm:text-2xl font-black text-white">
                {cat.title}
              </h3>
              <div className="w-8 h-8 rounded-full bg-white/20 group-hover:bg-rose-500 text-white flex items-center justify-center transition-colors shadow-sm">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xs sm:text-sm text-stone-200 mt-1 line-clamp-2">
              {cat.tagline}
            </p>
            <span className="text-[11px] text-rose-200 font-bold block mt-2">
              Serving across {selectedCity || 'your city'}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
};
