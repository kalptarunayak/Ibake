import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, ArrowRight, ShieldCheck, Crown, User as UserIcon, AlertCircle } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, loginAsDemo } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (role: 'customer' | 'admin' | 'super_admin') => {
    setError('');
    setLoading(true);
    try {
      await loginAsDemo(role);
      if (role === 'super_admin') navigate('/super-admin');
      else if (role === 'admin') navigate('/admin');
      else navigate(from, { replace: true });
    } catch (err: any) {
      setError('Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-3 font-serif font-bold text-xl">
            iB
          </div>
          <h1 className="text-2xl font-bold font-display text-stone-900">
            Welcome Back to IBake
          </h1>
          <p className="text-xs text-stone-500">
            Sign in to access your orders, saved addresses, and baker favorites
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-600/30 focus:border-amber-600"
              />
            </div>
          </div>

          <button
            id="btn-submit-login"
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-amber-800 hover:bg-amber-900 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
          >
            {loading ? 'Authenticating...' : 'Sign In with JWT'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Reviewer Demo Login Buttons */}
        <div className="pt-4 border-t border-stone-100 space-y-2.5">
          <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block text-center">
            One-Click Test Accounts
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              id="btn-demo-customer"
              onClick={() => handleDemoLogin('customer')}
              className="p-2 rounded-xl border border-stone-200 hover:border-amber-400 bg-stone-50 hover:bg-amber-50 text-center transition-colors text-xs font-medium text-stone-700"
            >
              <UserIcon className="w-4 h-4 text-amber-700 mx-auto mb-1" />
              <span>Customer</span>
            </button>
            <button
              type="button"
              id="btn-demo-admin"
              onClick={() => handleDemoLogin('admin')}
              className="p-2 rounded-xl border border-stone-200 hover:border-amber-400 bg-stone-50 hover:bg-amber-50 text-center transition-colors text-xs font-medium text-stone-700"
            >
              <ShieldCheck className="w-4 h-4 text-blue-600 mx-auto mb-1" />
              <span>Admin</span>
            </button>
            <button
              type="button"
              id="btn-demo-superadmin"
              onClick={() => handleDemoLogin('super_admin')}
              className="p-2 rounded-xl border border-stone-200 hover:border-amber-400 bg-stone-50 hover:bg-amber-50 text-center transition-colors text-xs font-medium text-stone-700"
            >
              <Crown className="w-4 h-4 text-amber-600 mx-auto mb-1" />
              <span>Super Admin</span>
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-stone-500">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-semibold text-amber-800 hover:underline">
            Register for Free
          </Link>
        </p>
      </div>
    </div>
  );
};
