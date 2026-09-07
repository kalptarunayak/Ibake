import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 space-y-4">
      <span className="text-6xl font-extrabold text-amber-900/20 font-serif">404</span>
      <h1 className="text-2xl sm:text-3xl font-bold font-display text-stone-900">
        Page Not Found
      </h1>
      <p className="text-xs text-stone-500 max-w-sm">
        The pastry or page you are looking for has been moved, eaten, or does not exist.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 py-2.5 px-5 bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold rounded-xl"
      >
        <ArrowLeft className="w-4 h-4" /> Return to Storefront
      </Link>
    </div>
  );
};
