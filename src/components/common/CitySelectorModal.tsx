import React, { useState } from 'react';
import { useCity } from '../../context/CityContext';
import { MapPin, Check, Search, AlertCircle } from 'lucide-react';

export const CitySelectorModal: React.FC = () => {
  const {
    selectedCity,
    activeCities,
    cities,
    isCityModalOpen,
    setCityModalOpen,
    selectCity,
  } = useCity();

  const [searchTerm, setSearchTerm] = useState('');

  if (!isCityModalOpen) return null;

  // Filter cities by search term
  const filteredActive = activeCities.filter((city) =>
    city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    city.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const inactiveCities = cities.filter((c) =>
    !c.isActive &&
    (c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     c.state.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const canDismiss = Boolean(selectedCity);

  return (
    <div
      id="city-selector-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs"
    >
      <div
        id="city-selector-modal"
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-rose-100 overflow-hidden"
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-rose-100 bg-rose-50/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-md shadow-rose-500/20">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-black text-stone-900">
                  Select Delivery City
                </h2>
                <p className="text-xs text-stone-600 mt-0.5 font-medium">
                  {canDismiss
                    ? 'Discover verified local bakeries & chocolatiers serving you'
                    : 'Choose your city to browse available artisanal bakes'}
                </p>
              </div>
            </div>
            {canDismiss && (
              <button
                id="btn-close-city-modal"
                onClick={() => setCityModalOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-2 rounded-xl hover:bg-rose-100/50 transition-colors"
                aria-label="Close"
              >
                ✕
              </button>
            )}
          </div>

          {/* Search bar */}
          <div className="mt-4 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              id="input-city-search"
              type="text"
              placeholder="Search by city or state (e.g. Bengaluru, Mumbai)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 text-sm bg-stone-50 rounded-2xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-400 text-stone-800"
            />
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
          <div>
            <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-2.5">
              Serving In {filteredActive.length} Indian Cities
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              {filteredActive.map((city) => {
                const isSelected = selectedCity.toLowerCase() === city.name.toLowerCase();
                return (
                  <button
                    key={city.id}
                    id={`btn-select-city-${city.id}`}
                    onClick={() => selectCity(city.name)}
                    className={`flex items-start justify-between p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-rose-500 bg-rose-50/80 shadow-xs'
                        : 'border-stone-200 bg-white hover:border-rose-300 hover:bg-rose-50/30'
                    }`}
                  >
                    <div>
                      <span className="font-bold text-sm text-stone-900 block">
                        {city.name}
                      </span>
                      <span className="text-xs text-stone-500 block mt-0.5">
                        {city.state}
                      </span>
                      {city.popularLocations && city.popularLocations.length > 0 && (
                        <span className="text-[10px] text-rose-700/80 font-medium block mt-1 line-clamp-1">
                          {city.popularLocations.slice(0, 2).join(', ')}
                        </span>
                      )}
                    </div>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            {filteredActive.length === 0 && (
              <p className="text-sm text-stone-500 text-center py-4">
                No active delivery cities found matching &quot;{searchTerm}&quot;.
              </p>
            )}
          </div>

          {/* Coming soon cities */}
          {inactiveCities.length > 0 && (
            <div className="pt-2 border-t border-rose-100">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5 text-orange-400" /> Expanding Soon
              </span>
              <div className="grid grid-cols-2 gap-2 opacity-70">
                {inactiveCities.map((city) => (
                  <div
                    key={city.id}
                    className="p-3 rounded-2xl border border-stone-200 bg-stone-50 text-stone-500 text-xs"
                  >
                    <span className="font-semibold text-stone-700 block">{city.name}</span>
                    <span className="text-[11px] block mt-0.5">{city.state} • Launching Soon</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-rose-50/40 border-t border-rose-100 flex items-center justify-between text-xs text-stone-500 font-medium">
          <span>🍰 Handcrafted & delivered locally</span>
          <span>⚡ 2-Hour Express Delivery</span>
        </div>
      </div>
    </div>
  );
};
