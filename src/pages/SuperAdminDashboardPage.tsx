import React, { useEffect, useState } from 'react';
import { adminApi } from '../api/adminApi';
import { cityApi } from '../api/cityApi';
import { City, User } from '../types';
import {
  Crown,
  MapPin,
  Users,
  Plus,
  Trash2,
  Check,
  X,
  ShieldCheck,
  Power,
  AlertCircle
} from 'lucide-react';

export const SuperAdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'cities' | 'admins'>('cities');
  const [cities, setCities] = useState<City[]>([]);
  const [admins, setAdmins] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Modals
  const [isCityModalOpen, setCityModalOpen] = useState(false);
  const [isAdminModalOpen, setAdminModalOpen] = useState(false);

  // City form
  const [cityForm, setCityForm] = useState({
    name: '',
    state: '',
    tier: 'Tier 1' as 'Tier 1' | 'Tier 2' | 'Tier 3',
  });

  // Admin form
  const [adminForm, setAdminForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'admin' as 'admin' | 'super_admin',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [cits, adms] = await Promise.all([
        cityApi.getCities(false),
        adminApi.getAdminUsers(),
      ]);
      setCities(cits);
      setAdmins(adms);
    } catch (err) {
      console.error('Error loading super admin data:', err);
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

  // Toggle city active status
  const handleToggleCity = async (city: City) => {
    try {
      await adminApi.toggleCityActive(city.id, !city.isActive);
      notify(`Service in ${city.name} ${!city.isActive ? 'enabled' : 'disabled'}`);
      loadData();
    } catch (err: any) {
      notify(err.message, 'error');
    }
  };

  const handleAddCity = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminApi.createCity({
        name: cityForm.name.trim(),
        state: cityForm.state.trim(),
        tier: cityForm.tier,
        isActive: true,
      });
      notify(`City ${cityForm.name} added to IBake delivery network`);
      setCityModalOpen(false);
      setCityForm({ name: '', state: '', tier: 'Tier 1' });
      loadData();
    } catch (err: any) {
      notify(err.message, 'error');
    }
  };

  const handleDeleteCity = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to remove ${name} from the platform?`)) return;
    try {
      await adminApi.deleteCity(id);
      notify(`City ${name} removed`);
      loadData();
    } catch (err: any) {
      notify(err.message, 'error');
    }
  };

  const handleInviteAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminApi.inviteAdminUser(adminForm);
      notify(`Privileged account created for ${adminForm.email}`);
      setAdminModalOpen(false);
      setAdminForm({ name: '', email: '', phone: '', role: 'admin' });
      loadData();
    } catch (err: any) {
      notify(err.message, 'error');
    }
  };

  const handleToggleAdminActive = async (admin: User) => {
    try {
      await adminApi.toggleAdminActive(admin.id, !admin.isActive);
      notify(`Admin account ${admin.name} ${!admin.isActive ? 'activated' : 'deactivated'}`);
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
          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider flex items-center gap-1.5 mb-1">
            <Crown className="w-4 h-4 text-amber-600" />
            <span>Super Administrator Suite</span>
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-stone-900">
            Platform Governance & Urban Expansion
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Enable or gate cities across India and manage administrative permissions.
          </p>
        </div>

        {/* Action Button */}
        <div>
          {activeTab === 'cities' ? (
            <button
              id="btn-add-city"
              onClick={() => setCityModalOpen(true)}
              className="py-2.5 px-4 bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" /> Add Delivery City
            </button>
          ) : (
            <button
              id="btn-invite-admin"
              onClick={() => setAdminModalOpen(true)}
              className="py-2.5 px-4 bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-4 h-4" /> Invite Admin User
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

      {/* Tabs */}
      <div className="flex border-b border-stone-200 gap-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('cities')}
          className={`pb-3 flex items-center gap-2 transition-colors relative ${
            activeTab === 'cities'
              ? 'text-amber-900 border-b-2 border-amber-800'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>City Network Coverage ({cities.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('admins')}
          className={`pb-3 flex items-center gap-2 transition-colors relative ${
            activeTab === 'admins'
              ? 'text-amber-900 border-b-2 border-amber-800'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Staff & Admin Credentials ({admins.length})</span>
        </button>
      </div>

      {/* ==================== TAB 1: CITIES ==================== */}
      {activeTab === 'cities' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF4ED] text-stone-700 font-bold uppercase tracking-wider border-b border-stone-200">
                  <tr>
                    <th className="p-4">City Name</th>
                    <th className="p-4">State</th>
                    <th className="p-4">Urban Tier</th>
                    <th className="p-4">Market Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {cities.map((city) => (
                    <tr key={city.id} className="hover:bg-stone-50/70">
                      <td className="p-4 font-bold text-stone-900 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-amber-700" />
                          <span>{city.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-stone-600 font-medium">
                        {city.state}
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-stone-100 text-stone-700">
                          {city.tier}
                        </span>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => handleToggleCity(city)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                            city.isActive
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 hover:bg-emerald-200'
                              : 'bg-stone-100 text-stone-500 border border-stone-300 hover:bg-stone-200'
                          }`}
                        >
                          <Power className="w-3 h-3" />
                          <span>{city.isActive ? 'Active & Ordering' : 'Disabled (Paused)'}</span>
                        </button>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDeleteCity(city.id, city.name)}
                          className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-stone-100 rounded-lg"
                          title="Delete City"
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

      {/* ==================== TAB 2: ADMINS ==================== */}
      {activeTab === 'admins' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF4ED] text-stone-700 font-bold uppercase tracking-wider border-b border-stone-200">
                  <tr>
                    <th className="p-4">Admin Name</th>
                    <th className="p-4">Email Address</th>
                    <th className="p-4">Assigned Role</th>
                    <th className="p-4">Account Status</th>
                    <th className="p-4 text-right">Access Controls</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {admins.map((adm) => (
                    <tr key={adm.id} className="hover:bg-stone-50/70">
                      <td className="p-4 font-bold text-stone-900 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
                            {adm.name.charAt(0)}
                          </div>
                          <span>{adm.name}</span>
                        </div>
                      </td>
                      <td className="p-4 font-mono text-stone-600">
                        {adm.email}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            adm.role === 'super_admin'
                              ? 'bg-amber-100 text-amber-900 border border-amber-300'
                              : 'bg-blue-50 text-blue-800 border border-blue-200'
                          }`}
                        >
                          {adm.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-semibold ${
                            adm.isActive ? 'text-emerald-700' : 'text-stone-400'
                          }`}
                        >
                          <span
                            className={`w-2 h-2 rounded-full ${
                              adm.isActive ? 'bg-emerald-600' : 'bg-stone-300'
                            }`}
                          />
                          {adm.isActive ? 'Active' : 'Deactivated'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        {adm.role !== 'super_admin' && (
                          <button
                            onClick={() => handleToggleAdminActive(adm)}
                            className={`px-3 py-1 rounded-lg text-[11px] font-bold border transition-colors ${
                              adm.isActive
                                ? 'text-red-700 border-red-200 hover:bg-red-50'
                                : 'text-emerald-700 border-emerald-200 hover:bg-emerald-50'
                            }`}
                          >
                            {adm.isActive ? 'Deactivate' : 'Reactivate'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MODAL: ADD CITY ==================== */}
      {isCityModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden">
            <div className="p-5 border-b border-stone-100 bg-[#FAF4ED] flex items-center justify-between">
              <h2 className="font-bold text-stone-900 text-lg font-display">
                Add New Delivery City
              </h2>
              <button onClick={() => setCityModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCity} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">City Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ahmedabad"
                  value={cityForm.name}
                  onChange={(e) => setCityForm({ ...cityForm, name: e.target.value })}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">State *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Gujarat"
                  value={cityForm.state}
                  onChange={(e) => setCityForm({ ...cityForm, state: e.target.value })}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Urban Market Tier</label>
                <select
                  value={cityForm.tier}
                  onChange={(e) => setCityForm({ ...cityForm, tier: e.target.value as any })}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                >
                  <option value="Tier 1">Tier 1 (Metro / High Volume)</option>
                  <option value="Tier 2">Tier 2 (Emerging Market)</option>
                  <option value="Tier 3">Tier 3 (Regional Express)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCityModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 text-stone-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-800 text-white font-bold rounded-xl"
                >
                  Add City
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== MODAL: INVITE ADMIN ==================== */}
      {isAdminModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-stone-200 overflow-hidden">
            <div className="p-5 border-b border-stone-100 bg-[#FAF4ED] flex items-center justify-between">
              <h2 className="font-bold text-stone-900 text-lg font-display">
                Create Admin Credentials
              </h2>
              <button onClick={() => setAdminModalOpen(false)} className="text-stone-400 hover:text-stone-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleInviteAdmin} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Admin Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Neha Kapoor"
                  value={adminForm.name}
                  onChange={(e) => setAdminForm({ ...adminForm, name: e.target.value })}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Work Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="neha@ibake.in"
                  value={adminForm.email}
                  onChange={(e) => setAdminForm({ ...adminForm, email: e.target.value })}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Contact Phone</label>
                <input
                  type="tel"
                  placeholder="+91 98765 00000"
                  value={adminForm.phone}
                  onChange={(e) => setAdminForm({ ...adminForm, phone: e.target.value })}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-700 mb-1">Role & Clearance</label>
                <select
                  value={adminForm.role}
                  onChange={(e) => setAdminForm({ ...adminForm, role: e.target.value as any })}
                  className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl"
                >
                  <option value="admin">Admin (Catalog, Vendors, Banners)</option>
                  <option value="super_admin">Super Admin (Full Governance)</option>
                </select>
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAdminModalOpen(false)}
                  className="px-4 py-2 bg-stone-100 text-stone-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-800 text-white font-bold rounded-xl"
                >
                  Create Admin
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
