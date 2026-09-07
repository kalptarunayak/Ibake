import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CityProvider } from './context/CityContext';
import { CartProvider } from './context/CartContext';

// Common Components
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { CitySelectorModal } from './components/common/CitySelectorModal';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { CartDrawer } from './components/cart/CartDrawer';

// Pages
import { HomePage } from './pages/HomePage';
import { CategoryPage } from './pages/CategoryPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { SuperAdminDashboardPage } from './pages/SuperAdminDashboardPage';
import { NotFoundPage } from './pages/NotFoundPage';

export default function App() {
  const baseUrl = import.meta.env.BASE_URL || '/';

  return (
    <BrowserRouter basename={baseUrl}>
      <AuthProvider>
        <CityProvider>
          <CartProvider>
            <div className="min-h-screen flex flex-col bg-rose-50 text-stone-800 selection:bg-rose-200 selection:text-rose-900 font-sans">
              {/* Main Navigation Header */}
              <Navbar />

              {/* Global City Selector Modal (gates city selection) */}
              <CitySelectorModal />

              {/* Slide-over Cart Drawer */}
              <CartDrawer />

              {/* Main View Router */}
              <main className="flex-1">
                <Routes>
                  {/* Public Storefront Routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/category/:categoryName" element={<CategoryPage />} />
                  <Route path="/product/:productId" element={<ProductDetailPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />

                  {/* Auth Routes */}
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />

                  {/* Role-Gated Admin Dashboard */}
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute allowedRoles={['admin', 'super_admin']}>
                        <AdminDashboardPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* Role-Gated Super Admin Dashboard */}
                  <Route
                    path="/super-admin"
                    element={
                      <ProtectedRoute allowedRoles={['super_admin']}>
                        <SuperAdminDashboardPage />
                      </ProtectedRoute>
                    }
                  />

                  {/* 404 Catch-All */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </main>

              {/* Global Site Footer */}
              <Footer />
            </div>
          </CartProvider>
        </CityProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
