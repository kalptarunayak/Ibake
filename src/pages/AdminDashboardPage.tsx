import React, { useEffect, useState } from 'react';
import { productApi } from '../api/productApi';
import { vendorApi } from '../api/vendorApi';
import { bannerApi } from '../api/bannerApi';
import { cityApi } from '../api/cityApi';
import { Product, Vendor, Banner, City, ProductCategory, VendorProductOffering } from '../types';
import {
  Package,
  Store,
  Image,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  Sparkles,
  MapPin,
  Check,
  X,
  AlertCircle
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'products' | 'vendors' | 'banners'>('products');

  const [products, setProducts] = useState<Product[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Modals state
  const [isProductModalOpen, setProductModalOpen] = useState(false);
  const [isVendorModalOpen, setVendorModalOpen] = useState(false);
  const [isBannerModalOpen, setBannerModalOpen] = useState(false);

  // Product Form State
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState<{
    name: string;
    description: string;
    category: ProductCategory;
    occasions: string[];
    imageUrl: string;
    isEggless: boolean;
    flavor: string;
    offerings: VendorProductOffering[];
  }>({
    name: '',
    description: '',
    category: 'Cakes',
    occasions: ['Birthday'],
    imageUrl: '',
    isEggless: true,
    flavor: '',
    offerings: [],
  });

  // Vendor Form State
  const [vendorForm, setVendorForm] = useState<{
    name: string;
    city: string;
    rating: number;
    phone: string;
    address: string;
  }>({
    name: '',
    city: 'Mumbai',
    rating: 4.8,
    phone: '',
    address: '',
  });

  // Banner Form State
  const [bannerForm, setBannerForm] = useState<{
    title: string;
    subtitle: string;
    imageUrl: string;
    link: string;
    city: string;
    occasion: string;
    startDate: string;
    endDate: string;
    isActive: boolean;
  }>({
    title: '',
    subtitle: '',
    imageUrl: '',
    link: '/category/Cakes',
    city: 'All',
    occasion: 'Diwali',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '2026-12-31',
    isActive: true,
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [prods, vends, bans, cits] = await Promise.all([
        productApi.getAllProductsRaw(),
        vendorApi.getVendors(),
        bannerApi.getAllAdminBanners(),
        cityApi.getCities(false),
      ]);
      setProducts(prods);
      setVendors(vends);
      setBanners(bans);
      setCities(cits);
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const notify = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // ==================== PRODUCT HANDLERS ====================
  const handleOpenNewProduct = () => {
    setEditingProductId(null);
    setProductForm({
      name: '',
      description: '',
      category: 'Cakes',
      occasions: ['Birthday'],
      imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80',
      isEggless: true,
      flavor: 'Belgian Cocoa',
      offerings: vendors.slice(0, 2).map((v) => ({
        vendorId: v.id,
        vendorName: v.name,
        city: v.city,
        price: 699,
        rating: v.rating,
        deliveryTime: 'Today in 2 hrs',
        available: true,
      })),
    });
    setProductModalOpen(true);
  };

  const handleEditProduct = (prod: Product) => {
    setEditingProductId(prod.id);
    setProductForm({
      name: prod.name,
      description: prod.description,
      category: prod.category,
      occasions: prod.occasions,
      imageUrl: prod.imageUrl,
      isEggless: prod.isEggless || false,
      flavor: prod.flavor || '',
      offerings: [...prod.offerings],
    });
    setProductModalOpen(true);
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to remove this product?')) return;
    try {
      await productApi.deleteProduct(id);
      notify('Product deleted successfully');
      loadData();
    } catch (err: any) {
      notify(err.message, 'error');
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProductId) {
        await productApi.updateProduct(editingProductId, productForm);
        notify('Product updated successfully');
      } else {
        await productApi.createProduct({
          ...productForm,
          weightOptions: [
            { label: '0.5 kg Standard', multiplier: 1 },
            { label: '1.0 kg Grand', multiplier: 1.85 },
          ],
        });
        notify('New product created and assigned to vendors');
      }
      setProductModalOpen(false);
      loadData();
    } catch (err: any) {
      notify(err.message, 'error');
    }
  };

  const handleAddOfferingToProduct = (vendorId: string) => {
    const v = vendors.find((vend) => vend.id === vendorId);
    if (!v) return;
    if (productForm.offerings.some((o) => o.vendorId === vendorId)) return;

    setProductForm((prev) => ({
      ...prev,
      offerings: [
        ...prev.offerings,
        {
          vendorId: v.id,
          vendorName: v.name,
          city: v.city,
          price: 649,
          rating: v.rating,
          deliveryTime: 'Today in 2 hrs',
          available: true,
        },
      ],
    }));
  };

  const handleRemoveOfferingFromProduct = (vendorId: string) => {
    setProductForm((prev) => ({
      ...prev,
      offerings: prev.offerings.filter((o) => o.vendorId !== vendorId),
    }));
  };

  // ==================== VENDOR HANDLERS ====================
  const handleSaveVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await vendorApi.createVendor({
        name: vendorForm.name,
        city: vendorForm.city,
        rating: Number(vendorForm.rating) || 4.8,
        reviewCount: 25,
        isVerified: true,
        phone: vendorForm.phone,
        address: vendorForm.address,
      });
      notify(`Vendor ${vendorForm.name} registered for ${vendorForm.city}`);
      setVendorModalOpen(false);
      setVendorForm({ name: '', city: 'Mumbai', rating: 4.8, phone: '', address: '' });
      loadData();
    } catch (err: any) {
      notify(err.message, 'error');
    }
  };

  const handleDeleteVendor = async (id: string) => {
    if (!confirm('Delete this vendor and revoke their city offerings?')) return;
    try {
      await vendorApi.deleteVendor(id);
      notify('Vendor removed');
      loadData();
    } catch (err: any) {
      notify(err.message, 'error');
    }
  };

  // ==================== BANNER HANDLERS ====================
  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await bannerApi.createBanner(bannerForm);
      notify('Promotional banner scheduled successfully');
      setBannerModalOpen(false);
      setBannerForm({
        title: '',
        subtitle: '',
        imageUrl: '',
        link: '/category/Cakes',
        city: 'All',
        occasion: 'Diwali',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '2026-12-31',
        isActive: true,
      });
      loadData();
    } catch (err: any) {
      notify(err.message, 'error');
    }
  };

  const handleDeleteBanner = async (id: string) => {
    if (!confirm('Remove this promotional banner?')) return;
    try {
      await bannerApi.deleteBanner(id);
      notify('Banner removed');
      loadData();
    } catch (err: any) {
      notify(err.message, 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-1">
            Admin Management Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-stone-900">
            IBake Catalog & Merchant Control
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Manage products, configure vendor city offerings, and schedule occasion banners.
          </p>
        </div>

        {/* Action Button */}
        <div>
          {activeTab === 'products' && (
            <button
              id="btn-admin-add-product"
              onClick={handleOpenNewProduct}
              className="py-2.5 px-4 bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" /> Add New Product
            </button>
          )}
          {activeTab === 'vendors' && (
            <button
              id="btn-admin-add-vendor"
              onClick={() => setVendorModalOpen(true)}
              className="py-2.5 px-4 bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" /> Register New Vendor
            </button>
          )}
          {activeTab === 'banners' && (
            <button
              id="btn-admin-add-banner"
              onClick={() => setBannerModalOpen(true)}
              className="py-2.5 px-4 bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" /> Publish Promotion Banner
            </button>
          )}
        </div>
      </div>

      {/* Notifications */}
      {notification && (
        <div
          className={`p-3.5 rounded-xl text-xs font-semibold flex items-center gap-2 ${
            notification.type === 'error'
              ? 'bg-red-50 text-red-700 border border-red-200'
              : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
          }`}
        >
          {notification.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <Check className="w-4 h-4" />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex border-b border-stone-200 gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 flex items-center gap-2 transition-colors relative ${
            activeTab === 'products'
              ? 'text-amber-900 border-b-2 border-amber-800'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Products Catalog ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('vendors')}
          className={`pb-3 flex items-center gap-2 transition-colors relative ${
            activeTab === 'vendors'
              ? 'text-amber-900 border-b-2 border-amber-800'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Store className="w-4 h-4" />
          <span>Bakers & Florists ({vendors.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('banners')}
          className={`pb-3 flex items-center gap-2 transition-colors relative ${
            activeTab === 'banners'
              ? 'text-amber-900 border-b-2 border-amber-800'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Image className="w-4 h-4" />
          <span>Promotional Banners ({banners.length})</span>
        </button>
      </div>

      {/* ==================== TAB 1: PRODUCTS ==================== */}
      {activeTab === 'products' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF4ED] text-stone-700 font-bold uppercase tracking-wider border-b border-stone-200">
                  <tr>
                    <th className="p-4">Product Details</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Occasions</th>
                    <th className="p-4">Assigned Vendors & City Coverage</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-stone-50/70">
                      <td className="p-4 flex items-center gap-3">
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="w-14 h-14 rounded-lg object-cover bg-stone-100 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-stone-900 text-sm">{p.name}</p>
                          <span className="text-[11px] text-stone-500 line-clamp-1">{p.description}</span>
                          {p.isEggless && (
                            <span className="text-[10px] text-emerald-700 font-semibold mt-0.5 inline-block">
                              ✓ Eggless
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-md bg-stone-100 font-semibold text-stone-700">
                          {p.category}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {p.occasions.map((o) => (
                            <span key={o} className="px-2 py-0.5 rounded bg-amber-50 text-amber-900 text-[10px] font-medium border border-amber-200/50">
                              {o}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <span className="font-bold text-stone-800">
                            {p.offerings.length} {p.offerings.length === 1 ? 'Vendor' : 'Vendors'}
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {p.offerings.map((o) => (
                              <span key={o.vendorId} className="text-[10px] bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded">
                                {o.vendorName.split(' ')[0]} ({o.city}): ₹{o.price}
                              </span>
                            ))}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEditProduct(p)}
                            className="p-1.5 text-stone-500 hover:text-amber-800 hover:bg-stone-100 rounded-lg"
                            title="Edit Product & Vendors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-stone-100 rounded-lg"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 2: VENDORS ==================== */}
      {activeTab === 'vendors' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF4ED] text-stone-700 font-bold uppercase tracking-wider border-b border-stone-200">
                  <tr>
                    <th className="p-4">Baker / Florist Name</th>
                    <th className="p-4">Service City</th>
                    <th className="p-4">Rating & Reviews</th>
                    <th className="p-4">Contact / Address</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {vendors.map((v) => (
                    <tr key={v.id} className="hover:bg-stone-50/70">
                      <td className="p-4 font-bold text-stone-900 text-sm">
                        <div className="flex items-center gap-2">
                          <Store className="w-4 h-4 text-amber-700" />
                          <span>{v.name}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 font-semibold border border-amber-200">
                          {v.city}
                        </span>
                      </td>
                      <td className="p-4 font-medium text-stone-700">
                        ⭐ {v.rating} ({v.reviewCount} customer reviews)
                      </td>
                      <td className="p-4 text-stone-500">
                        {v.address || 'Central City Kitchen'}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDeleteVendor(v.id)}
                          className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-stone-100 rounded-lg"
                          title="Delete Vendor"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 3: BANNERS ==================== */}
      {activeTab === 'banners' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {banners.map((b) => (
              <div key={b.id} className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs flex flex-col">
                <div className="relative h-40 bg-stone-100">
                  <img src={b.imageUrl} alt={b.title} className="w-full h-full object-cover" />
                  <span className={`absolute top-2 right-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    b.isActive ? 'bg-emerald-600 text-white' : 'bg-stone-600 text-white'
                  }`}>
                    {b.isActive ? 'Active' : 'Draft'}
                  </span>
                </div>
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="text-[11px] font-semibold text-amber-800 uppercase block">
                      Target City: {b.city} • {b.occasion || 'General'}
                    </span>
                    <h3 className="font-bold text-stone-900 text-base mt-0.5">{b.title}</h3>
                    <p className="text-xs text-stone-500 mt-1 line-clamp-2">{b.subtitle}</p>
                    <span className="text-[11px] text-stone-400 block mt-2 font-mono">
                      Schedule: {b.startDate} to {b.endDate}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-xs text-stone-400 truncate max-w-[150px]">Link: {b.link}</span>
                    <button
                      onClick={() => handleDeleteBanner(b.id)}
                      className="text-xs text-red-600 hover:text-red-800 font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================== MODAL: ADD/EDIT PRODUCT ==================== */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden my-8">
            <div className="p-5 border-b border-stone-100 bg-[#FAF4ED] flex items-center justify-between">
              <h2 className="font-bold text-stone-900 text-lg font-display">
                {editingProductId ? 'Edit Product & Vendor Offerings' : 'Add New Artisanal Product'}
              </h2>
              <button onClick={() => setProductModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Product Title *</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Description *</label>
                  <textarea
                    required
                    rows={2}
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value as ProductCategory })}
                    className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl"
                  >
                    <option value="Cakes">Cakes</option>
                    <option value="Chocolates">Chocolates</option>
                    <option value="Flowers">Flowers</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Primary Flavor / Notes</label>
                  <input
                    type="text"
                    value={productForm.flavor}
                    onChange={(e) => setProductForm({ ...productForm, flavor: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Image URL</label>
                  <input
                    type="url"
                    required
                    value={productForm.imageUrl}
                    onChange={(e) => setProductForm({ ...productForm, imageUrl: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="chk-modal-eggless"
                    checked={productForm.isEggless}
                    onChange={(e) => setProductForm({ ...productForm, isEggless: e.target.checked })}
                    className="rounded text-amber-800"
                  />
                  <label htmlFor="chk-modal-eggless" className="text-xs font-medium text-stone-700">
                    100% Eggless Vegetarian
                  </label>
                </div>
              </div>

              {/* Vendor Offerings Assignment */}
              <div className="pt-4 border-t border-stone-200 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-stone-900 text-sm">
                    Assign Vendors & Set City Pricing ({productForm.offerings.length})
                  </h3>
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        handleAddOfferingToProduct(e.target.value);
                        e.target.value = '';
                      }
                    }}
                    className="text-xs bg-amber-50 border border-amber-200 text-amber-900 rounded-lg px-2.5 py-1 font-semibold"
                  >
                    <option value="">+ Assign Baker / Vendor</option>
                    {vendors.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name} ({v.city})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {productForm.offerings.map((off, idx) => (
                    <div key={off.vendorId} className="flex items-center gap-2 p-2.5 rounded-xl border border-stone-200 bg-stone-50 text-xs">
                      <div className="flex-1">
                        <span className="font-bold text-stone-800 block">{off.vendorName}</span>
                        <span className="text-stone-400 text-[10px]">{off.city}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <span className="text-stone-500">₹</span>
                          <input
                            type="number"
                            value={off.price}
                            onChange={(e) => {
                              const newOff = [...productForm.offerings];
                              newOff[idx].price = Number(e.target.value) || 0;
                              setProductForm({ ...productForm, offerings: newOff });
                            }}
                            className="w-18 px-2 py-1 bg-white border border-stone-200 rounded font-bold"
                          />
                        </div>

                        <input
                          type="text"
                          value={off.deliveryTime}
                          onChange={(e) => {
                            const newOff = [...productForm.offerings];
                            newOff[idx].deliveryTime = e.target.value;
                            setProductForm({ ...productForm, offerings: newOff });
                          }}
                          placeholder="e.g. 2 hrs"
                          className="w-24 px-2 py-1 bg-white border border-stone-200 rounded text-[11px]"
                        />

                        <button
                          type="button"
                          onClick={() => handleRemoveOfferingFromProduct(off.vendorId)}
                          className="text-stone-400 hover:text-red-600 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 text-stone-700 text-xs font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-800 text-white text-xs font-bold rounded-xl"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MODAL: ADD VENDOR ==================== */}
      {isVendorModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden">
            <div className="p-5 border-b border-stone-100 bg-[#FAF4ED] flex items-center justify-between">
              <h2 className="font-bold text-stone-900 text-lg font-display">
                Register New Merchant / Baker
              </h2>
              <button onClick={() => setVendorModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVendor} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Bakery / Confectioner Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bandra Artisan Oven"
                  value={vendorForm.name}
                  onChange={(e) => setVendorForm({ ...vendorForm, name: e.target.value })}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Serving City *</label>
                <select
                  value={vendorForm.city}
                  onChange={(e) => setVendorForm({ ...vendorForm, city: e.target.value })}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                >
                  {cities.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name} ({c.state})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Initial Baker Rating</label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="5"
                  value={vendorForm.rating}
                  onChange={(e) => setVendorForm({ ...vendorForm, rating: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Kitchen Address / Hub</label>
                <input
                  type="text"
                  placeholder="e.g. Hill Road, Bandra West"
                  value={vendorForm.address}
                  onChange={(e) => setVendorForm({ ...vendorForm, address: e.target.value })}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setVendorModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 text-stone-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-800 text-white font-bold rounded-xl"
                >
                  Register Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MODAL: ADD BANNER ==================== */}
      {isBannerModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden">
            <div className="p-5 border-b border-stone-100 bg-[#FAF4ED] flex items-center justify-between">
              <h2 className="font-bold text-stone-900 text-lg font-display">
                Publish Promotional Banner
              </h2>
              <button onClick={() => setBannerModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBanner} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Banner Headline *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Diwali Sweets & Hampers"
                  value={bannerForm.title}
                  onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Subtitle / Callout</label>
                <input
                  type="text"
                  placeholder="e.g. 2-Hour Express Delivery in Mumbai"
                  value={bannerForm.subtitle}
                  onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Image URL *</label>
                <input
                  type="url"
                  required
                  value={bannerForm.imageUrl}
                  onChange={(e) => setBannerForm({ ...bannerForm, imageUrl: e.target.value })}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Target City</label>
                  <select
                    value={bannerForm.city}
                    onChange={(e) => setBannerForm({ ...bannerForm, city: e.target.value })}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  >
                    <option value="All">All Cities (Pan-India)</option>
                    {cities.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Occasion Tag</label>
                  <select
                    value={bannerForm.occasion}
                    onChange={(e) => setBannerForm({ ...bannerForm, occasion: e.target.value })}
                    className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                  >
                    <option value="Diwali">Diwali</option>
                    <option value="Birthday">Birthday</option>
                    <option value="Anniversary">Anniversary</option>
                    <option value="Rakhi">Rakhi</option>
                    <option value="Wedding">Wedding</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={bannerForm.startDate}
                    onChange={(e) => setBannerForm({ ...bannerForm, startDate: e.target.value })}
                    className="w-full px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={bannerForm.endDate}
                    onChange={(e) => setBannerForm({ ...bannerForm, endDate: e.target.value })}
                    className="w-full px-3 py-1.5 bg-stone-50 border border-stone-200 rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setBannerModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 text-stone-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-800 text-white font-bold rounded-xl"
                >
                  Publish Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
