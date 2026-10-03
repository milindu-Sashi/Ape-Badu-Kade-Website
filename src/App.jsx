import React, { useState, useEffect } from 'react';
import { useShop } from './context/ShopContext';
import { Header } from './components/Header';
import { HeroBanner } from './components/HeroBanner';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { TrackOrderModal } from './components/TrackOrderModal';
import { Footer } from './components/Footer';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminLoginModal } from './components/admin/AdminLoginModal';
import { 
  Sparkles, 
  Search, 
  PackageOpen, 
  Flame, 
  ArrowUpDown,
  Coffee,
  Utensils,
  Smartphone,
  Candy,
  Shirt,
  Layers,
  Shield,
  KeyRound,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';

const CATEGORIES = [
  { id: 'All', label: 'සියලුම බඩු (All Items)', icon: Layers },
  { id: 'Spices & Tea', label: 'සිලෝන් තේ & කුළුබඩු', icon: Coffee },
  { id: 'Household & Kitchen', label: 'ගෘහ උපකරණ', icon: Utensils },
  { id: 'Groceries & Sweets', label: 'පැණි & රසකැවිලි', icon: Candy },
  { id: 'Electronics', label: 'ඉලෙක්ට්‍රොනික්', icon: Smartphone },
  { id: 'Fashion & Crafts', label: 'බතික් & අත්යන්ත්‍ර', icon: Shirt },
];

export function App() {
  const { 
    viewMode, 
    setViewMode,
    products, 
    loading, 
    selectedCategory, 
    setSelectedCategory, 
    searchQuery, 
    setSearchQuery,
    sortBy,
    setSortBy,
    adminUser,
    loginAdmin
  } = useShop();

  // Admin dedicated login form state (for /admin route)
  const [adminUsername, setAdminUsername] = useState('admin');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminLoginLoading, setAdminLoginLoading] = useState(false);
  const [adminLoginError, setAdminLoginError] = useState('');

  // Handle URL route /admin or /
  useEffect(() => {
    const handleLocation = () => {
      const path = window.location.pathname;
      if (path === '/admin') {
        setViewMode('admin');
      } else if (viewMode === 'admin' && path !== '/admin') {
        // keep viewMode in sync
      }
    };
    handleLocation();
    window.addEventListener('popstate', handleLocation);
    return () => window.removeEventListener('popstate', handleLocation);
  }, []);

  const handleAdminLoginSubmit = async (e) => {
    e.preventDefault();
    if (!adminUsername.trim() || !adminPassword) {
      setAdminLoginError('කරුණාකර පරිශීලක නම සහ මුරපදය ඇතුළත් කරන්න.');
      return;
    }
    setAdminLoginLoading(true);
    setAdminLoginError('');
    const res = await loginAdmin(adminUsername, adminPassword);
    setAdminLoginLoading(false);
    if (!res.success) {
      setAdminLoginError(res.error || 'වැරදි පරිශීලක නමක් හෝ මුරපදයකි.');
    }
  };

  // ================= ADMIN PORTAL VIEW ================= //
  if (viewMode === 'admin') {
    // If not logged in, show dedicated full-screen Admin Login Page
    if (!adminUser) {
      return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden select-none">
          <div className="absolute top-0 right-10 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl -z-0 pointer-events-none" />
          <div className="absolute -bottom-10 left-10 w-80 h-80 bg-amber-600/10 rounded-full blur-3xl -z-0 pointer-events-none" />

          {/* Back to Customer Store button */}
          <div className="absolute top-6 left-6 z-10">
            <button
              onClick={() => {
                window.history.pushState({}, '', '/');
                setViewMode('store');
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold hover:bg-slate-800 transition-all shadow-md"
            >
              <ArrowLeft className="w-4 h-4 text-orange-400" />
              <span>පාරිභෝගික සාප්පුව වෙත (Customer Store)</span>
            </button>
          </div>

          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl relative z-10 text-white space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 rounded-2xl bg-orange-600/20 border border-orange-500/30 text-orange-400 flex items-center justify-center mx-auto shadow-inner">
                <Shield className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-black tracking-tight">
                Ape <span className="text-orange-500">බඩු කඩේ</span>
              </h2>
              <p className="text-xs text-slate-400">
                පරිපාලක පිවිසුම (Dedicated Admin Portal)
              </p>
              <div className="inline-block px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-[11px] text-slate-400">
                🔒 පාරිභෝගිකයින්ට මෙම පිටුවට ප්‍රවේශ විය නොහැක
              </div>
            </div>

            {adminLoginError && (
              <div className="p-3.5 bg-red-950/60 border border-red-500/40 rounded-xl text-xs text-red-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
                <span>{adminLoginError}</span>
              </div>
            )}

            <form onSubmit={handleAdminLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  පරිපාලක නම (Username)
                </label>
                <input
                  type="text"
                  placeholder="admin"
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  required
                  className="w-full px-4 py-3 text-xs font-medium rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  මුරපදය (Password)
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 text-xs font-medium rounded-xl bg-slate-800/80 border border-slate-700 text-white placeholder-slate-500 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none font-mono"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-500">Default Access:</span>
                <button
                  type="button"
                  onClick={() => {
                    setAdminUsername('admin');
                    setAdminPassword('admin123');
                    setAdminLoginError('');
                  }}
                  className="text-[11px] font-bold text-orange-400 hover:text-orange-300 bg-orange-950/60 border border-orange-800/40 px-2.5 py-1 rounded-md"
                >
                  + Fill: admin / admin123
                </button>
              </div>

              <button
                type="submit"
                disabled={adminLoginLoading}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 transition-all transform active:scale-95"
              >
                <KeyRound className="w-4 h-4" />
                <span>{adminLoginLoading ? 'සත්‍යාපනය වෙමින්...' : 'Login to Admin Dashboard'}</span>
              </button>
            </form>

            <div className="pt-2 text-center text-[11px] text-slate-500">
              SQLite Database Active & Protected • Ape බඩු කඩේ v1.0
            </div>
          </div>
        </div>
      );
    }

    // Authenticated -> Show Admin Dashboard
    return <AdminDashboard />;
  }

  // ================= CUSTOMER STOREFRONT VIEW ================= //
  // Customer sees ONLY: items, categories, live track order, payment methods, cart, checkout

  let filtered = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || 
      product.category.toLowerCase() === selectedCategory.toLowerCase();

    const matchesSearch = !searchQuery || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (product.category && product.category.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  if (sortBy === 'price-asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else {
    filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-orange-500 selection:text-white">
      
      {/* 1. Customer Navigation Header */}
      <Header />

      {/* 2. Customer Main Content */}
      <main className="flex-1">
        
        {/* Promotional Hero Banner */}
        <HeroBanner />

        {/* Customer Products & Categories Section */}
        <section id="products-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 text-orange-600 text-xs font-black uppercase tracking-wider mb-1">
                <Flame className="w-4 h-4 fill-orange-500 text-orange-500" />
                <span>විශේෂිත භාණ්ඩ එකතුව</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                අපේ කඩේ අලුත්ම බඩු (Featured Products)
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                ඔබට අවශ්‍ය ඕනෑම භාණ්ඩයක් පහසුවෙන් තෝරාගෙන කරත්තයට එකතු කරන්න.
              </p>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 self-start md:self-auto">
              <ArrowUpDown className="w-4 h-4 text-slate-400" />
              <span className="text-xs text-slate-500 font-semibold">පිළිවෙල:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:border-orange-500 outline-none shadow-2xs cursor-pointer"
              >
                <option value="featured">විශේෂිත (Featured)</option>
                <option value="price-asc">මිල: අඩු සිට වැඩි (Price: Low to High)</option>
                <option value="price-desc">මිල: වැඩි සිට අඩු (Price: High to Low)</option>
                <option value="rating">ප්‍රසාද ලකුණු (Top Rated)</option>
              </select>
            </div>
          </div>

          {/* Categories Selector */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-8">
            {CATEGORIES.map(cat => {
              const Icon = cat.icon;
              const isSelected = selectedCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                    isSelected
                      ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-lg shadow-orange-500/25 scale-[1.02]'
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-orange-300 hover:text-orange-600 hover:bg-orange-50/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-orange-500'}`} />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          {/* Active Search */}
          {searchQuery && (
            <div className="mb-6 p-3 bg-orange-50 border border-orange-200 rounded-2xl flex items-center justify-between text-xs text-orange-950">
              <span>
                "<strong>{searchQuery}</strong>" සඳහා සෙවුම් ප්‍රතිඵල ({filtered.length})
              </span>
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs font-bold text-orange-600 hover:underline"
              >
                Clear Search
              </button>
            </div>
          )}

          {/* Products Grid */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                <div key={n} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm animate-pulse space-y-3">
                  <div className="aspect-square bg-slate-200 rounded-xl" />
                  <div className="h-4 bg-slate-200 rounded w-2/3" />
                  <div className="h-4 bg-slate-200 rounded w-1/3" />
                  <div className="h-8 bg-slate-200 rounded-xl mt-4" />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-xs max-w-lg mx-auto p-8 space-y-4">
              <div className="w-16 h-16 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center mx-auto">
                <PackageOpen className="w-8 h-8 stroke-[1.5]" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">
                කිසිදු භාණ්ඩයක් හමු නොවුණි
              </h3>
              <p className="text-xs text-slate-500">
                ඔබ සෙවූ නම හෝ කාණ්ඩයට අදාළ භාණ්ඩ මෙහි නොමැත.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                }}
                className="px-5 py-2.5 bg-orange-600 text-white text-xs font-bold rounded-xl shadow-md"
              >
                සියලුම භාණ්ඩ පෙන්වන්න (View All)
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
              {filtered.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

        </section>

      </main>

      {/* Customer Footer */}
      <Footer />

      {/* Customer Modals & Drawers */}
      <ProductModal />
      <CartDrawer />
      <CheckoutModal />
      <OrderSuccessModal />
      <TrackOrderModal />
      <AdminLoginModal />

    </div>
  );
}
export default App;
