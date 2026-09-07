import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCity } from '../../context/CityContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import {
  MapPin,
  ShoppingBag,
  User as UserIcon,
  ChevronDown,
  Shield,
  Crown,
  LogOut,
  Sparkles,
  Menu,
  X
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { selectedCity, setCityModalOpen } = useCity();
  const { itemCount, setCartDrawerOpen } = useCart();
  const { user, isAuthenticated, role, logout, loginAsDemo } = useAuth();
  const [isUserMenuOpen, setUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-rose-100 shadow-xs">
      {/* Top micro-announcement banner */}
      <div className="bg-gradient-to-r from-rose-500 to-orange-400 text-white text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2 shadow-xs">
        <Sparkles className="w-3.5 h-3.5 text-amber-200" />
        <span>Festive Specials: Flat ₹50 OFF with code <strong className="text-white tracking-wide underline font-black">WELCOME50</strong> on your celebration bake!</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & City Gate */}
          <div className="flex items-center gap-4 sm:gap-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-2xl bg-rose-500 text-white flex items-center justify-center shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform font-black text-xl tracking-tighter">
                iB
              </div>
              <div className="flex flex-col">
                <span className="text-2xl sm:text-3xl font-black tracking-tighter text-rose-500">
                  iBake
                </span>
                <span className="text-[10px] text-orange-500 tracking-wider uppercase font-black -mt-1">
                  Artisanal India
                </span>
              </div>
            </Link>

            {/* City Selector Button (Primary gating control) */}
            <button
              id="btn-navbar-city-selector"
              onClick={() => setCityModalOpen(true)}
              className="flex items-center gap-2 py-1.5 px-3.5 rounded-full border border-rose-200 bg-rose-50 hover:bg-rose-100/70 text-rose-700 transition-all text-xs sm:text-sm font-bold shadow-xs cursor-pointer"
              title="Change Delivery City"
            >
              <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
              <div className="flex items-center gap-1">
                <span className="text-rose-400 hidden sm:inline font-semibold">City:</span>
                <span className="font-bold text-rose-700">
                  {selectedCity || 'Select City'}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-rose-400" />
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <NavLink
              to="/category/Cakes"
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-xl text-sm font-bold transition-colors ${
                  isActive
                    ? 'text-rose-600 bg-rose-50 border border-rose-200'
                    : 'text-stone-600 hover:text-rose-600 hover:bg-rose-50/50'
                }`
              }
            >
              🎂 Cakes
            </NavLink>
            <NavLink
              to="/category/Chocolates"
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-xl text-sm font-bold transition-colors ${
                  isActive
                    ? 'text-rose-600 bg-rose-50 border border-rose-200'
                    : 'text-stone-600 hover:text-rose-600 hover:bg-rose-50/50'
                }`
              }
            >
              🍫 Chocolates
            </NavLink>
            <NavLink
              to="/category/Flowers"
              className={({ isActive }) =>
                `px-3.5 py-2 rounded-xl text-sm font-bold transition-colors ${
                  isActive
                    ? 'text-rose-600 bg-rose-50 border border-rose-200'
                    : 'text-stone-600 hover:text-rose-600 hover:bg-rose-50/50'
                }`
              }
            >
              💐 Flowers
            </NavLink>
          </nav>

          {/* Action Buttons: Cart & Auth */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Cart Trigger */}
            <button
              id="btn-navbar-cart"
              onClick={() => setCartDrawerOpen(true)}
              className="relative p-2.5 rounded-2xl text-stone-700 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              aria-label="View Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 text-stone-700 hover:text-rose-600" />
              {itemCount > 0 && (
                <span
                  id="navbar-cart-badge"
                  className="absolute -top-1 -right-1 bg-rose-500 text-white text-[11px] font-black h-5 w-5 rounded-full flex items-center justify-center shadow-xs"
                >
                  {itemCount}
                </span>
              )}
            </button>

            {/* Auth Dropdown / Buttons */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  id="btn-user-profile-menu"
                  onClick={() => setUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 py-1 px-2.5 rounded-full border border-rose-200 bg-white hover:border-rose-400 text-stone-800 text-xs sm:text-sm font-bold transition-colors shadow-xs"
                >
                  <div className="w-8 h-8 rounded-full bg-rose-500 text-white text-xs flex items-center justify-center font-black">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:inline max-w-[100px] truncate">{user.name}</span>
                  {role === 'super_admin' && (
                    <Crown className="w-3.5 h-3.5 text-amber-500" title="Super Admin" />
                  )}
                  {role === 'admin' && (
                    <Shield className="w-3.5 h-3.5 text-rose-500" title="Admin" />
                  )}
                  <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
                </button>

                {isUserMenuOpen && (
                  <div
                    id="user-dropdown-menu"
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-rose-100 py-2 z-50 text-sm"
                  >
                    <div className="px-4 py-2.5 border-b border-rose-100">
                      <p className="font-bold text-stone-900">{user.name}</p>
                      <p className="text-xs text-stone-500 truncate">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-rose-50 text-rose-700 border border-rose-200">
                        {user.role.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="py-1">
                      {role === 'super_admin' && (
                        <Link
                          to="/super-admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-stone-700 hover:bg-rose-50 hover:text-rose-700 font-bold"
                        >
                          <Crown className="w-4 h-4 text-amber-500" /> Super Admin Hub
                        </Link>
                      )}
                      {(role === 'admin' || role === 'super_admin') && (
                        <Link
                          to="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-stone-700 hover:bg-rose-50 hover:text-rose-700 font-bold"
                        >
                          <Shield className="w-4 h-4 text-rose-500" /> Admin Dashboard
                        </Link>
                      )}
                      <Link
                        to="/cart"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-stone-700 hover:bg-rose-50 hover:text-rose-700"
                      >
                        <ShoppingBag className="w-4 h-4 text-stone-500" /> My Cart & Orders
                      </Link>
                    </div>

                    <div className="pt-1 border-t border-rose-100">
                      <button
                        id="btn-user-logout"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2 px-4 py-2 text-left text-red-600 hover:bg-rose-50 text-sm font-semibold"
                      >
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  id="btn-navbar-login"
                  className="py-2 px-4 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs sm:text-sm font-bold transition-all shadow-xs"
                >
                  Sign In
                </Link>
                {/* Fast-switch demo logins for immediate tester preview */}
                <div className="hidden lg:flex items-center gap-1 border-l border-rose-200 pl-2">
                  <button
                    onClick={() => loginAsDemo('admin')}
                    className="text-[11px] px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg font-bold border border-rose-200 transition-colors"
                    title="Quick demo as Admin"
                  >
                    Demo Admin
                  </button>
                  <button
                    onClick={() => loginAsDemo('super_admin')}
                    className="text-[11px] px-2.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-bold transition-colors shadow-xs"
                    title="Quick demo as Super Admin"
                  >
                    Demo Super
                  </button>
                </div>
              </div>
            )}

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-stone-600 hover:text-rose-600"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-rose-100 space-y-2">
            <NavLink
              to="/category/Cakes"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3.5 py-2 rounded-xl text-sm font-bold text-stone-700 hover:bg-rose-50 hover:text-rose-600"
            >
              🎂 Cakes
            </NavLink>
            <NavLink
              to="/category/Chocolates"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3.5 py-2 rounded-xl text-sm font-bold text-stone-700 hover:bg-rose-50 hover:text-rose-600"
            >
              🍫 Chocolates
            </NavLink>
            <NavLink
              to="/category/Flowers"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3.5 py-2 rounded-xl text-sm font-bold text-stone-700 hover:bg-rose-50 hover:text-rose-600"
            >
              💐 Flowers
            </NavLink>

            <div className="pt-2 border-t border-rose-100 flex gap-2">
              <button
                onClick={() => {
                  loginAsDemo('admin');
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-2 text-xs font-bold bg-rose-50 text-rose-700 rounded-xl border border-rose-200"
              >
                Demo Admin
              </button>
              <button
                onClick={() => {
                  loginAsDemo('super_admin');
                  setMobileMenuOpen(false);
                }}
                className="flex-1 py-2 text-xs font-bold bg-orange-500 text-white rounded-xl shadow-xs"
              >
                Demo Super Admin
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
