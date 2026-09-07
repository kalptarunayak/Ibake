import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Occasion } from '../../types';

interface OccasionBarProps {
  selectedOccasion?: string;
  onSelectOccasion?: (occasion: string) => void;
  navigateOnClick?: boolean;
}

const OCCASIONS: { label: Occasion; icon: string; highlight?: boolean }[] = [
  { label: 'Birthday', icon: '🎂' },
  { label: 'Anniversary', icon: '💍' },
  { label: 'Diwali', icon: '🪔', highlight: true },
  { label: 'Rakhi', icon: '🧵', highlight: true },
  { label: 'Wedding', icon: '💐' },
  { label: "Valentine's Day", icon: '❤️' },
  { label: "Mother's Day", icon: '🌸' },
  { label: 'New Year', icon: '✨' },
  { label: 'Congratulations', icon: '🎉' },
];

export const OccasionBar: React.FC<OccasionBarProps> = ({
  selectedOccasion,
  onSelectOccasion,
  navigateOnClick = true,
}) => {
  const navigate = useNavigate();

  const handleOccasionClick = (occ: string) => {
    if (onSelectOccasion) {
      onSelectOccasion(occ);
    } else if (navigateOnClick) {
      navigate(`/category/Cakes?occasion=${encodeURIComponent(occ)}`);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base sm:text-lg font-bold text-stone-900 font-display">
          Curated For Indian Celebrations
        </h3>
        <span className="text-xs text-stone-500 font-medium hidden sm:inline">
          Filter bakes by occasion
        </span>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
        {onSelectOccasion && (
          <button
            onClick={() => handleOccasionClick('All')}
            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
              !selectedOccasion || selectedOccasion === 'All'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 hover:border-rose-200'
            }`}
          >
            All Occasions
          </button>
        )}

        {OCCASIONS.map(({ label, icon, highlight }) => {
          const isSelected = selectedOccasion?.toLowerCase() === label.toLowerCase();
          return (
            <button
              key={label}
              id={`btn-occasion-${label.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
              onClick={() => handleOccasionClick(label)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                isSelected
                  ? 'bg-rose-500 text-white shadow-sm scale-102'
                  : highlight
                  ? 'bg-orange-50 border border-orange-200 text-orange-700 hover:bg-orange-100'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600'
              }`}
            >
              <span>{icon}</span>
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
