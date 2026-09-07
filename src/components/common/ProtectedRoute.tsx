import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { user, isAuthenticated, loading, loginAsDemo } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-stone-200 shadow-sm text-center">
          <div className="w-14 h-14 mx-auto mb-4 bg-red-50 text-red-600 rounded-full flex items-center justify-center">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-bold text-stone-900 mb-2 font-display">
            Access Restricted
          </h2>
          <p className="text-sm text-stone-600 mb-6">
            This area requires <span className="font-semibold text-stone-800 uppercase">{allowedRoles.join(' or ')}</span> privileges.
            Your current role is <span className="font-semibold text-amber-700 uppercase">{user.role}</span>.
          </p>

          <div className="space-y-3">
            {allowedRoles.includes('admin') && (
              <button
                id="btn-demo-switch-admin"
                onClick={() => loginAsDemo('admin')}
                className="w-full py-2.5 px-4 bg-amber-800 hover:bg-amber-900 text-white font-medium rounded-xl text-sm transition-colors"
              >
                Switch to Demo Admin Account
              </button>
            )}
            {allowedRoles.includes('super_admin') && (
              <button
                id="btn-demo-switch-superadmin"
                onClick={() => loginAsDemo('super_admin')}
                className="w-full py-2.5 px-4 bg-stone-900 hover:bg-black text-white font-medium rounded-xl text-sm transition-colors"
              >
                Switch to Demo Super Admin Account
              </button>
            )}
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-1.5 text-sm text-stone-500 hover:text-stone-800 mt-2 font-medium"
            >
              <ArrowLeft className="w-4 h-4" /> Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
