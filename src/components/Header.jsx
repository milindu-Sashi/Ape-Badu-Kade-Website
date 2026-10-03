import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  ShoppingBag, 
  Search, 
  Truck, 
  Menu, 
  X,
  PhoneCall
} from 'lucide-react';

export const Header = () => {
  const { 
    cartCount, 
    cartTotal,
    setIsCartOpen, 
    searchQuery, 
    setSearchQuery, 
    setIsTrackModalOpen,
    formatLKR 
  } = useShop();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-sm border-b border-orange-100 transition-all">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white text-xs sm:text-sm py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2 flex-wrap">
        <span className="flex items-center gap-1">
          <Truck className="w-3.5 h-3.5 inline animate-bounce" /> 
          <strong>දිවයින පුරා බෙදාහැරීම</strong> (Islandwide Delivery)
        </span>
        <span className="hidden md:inline">•</span>
        <span className="hidden sm:inline bg-orange-800/60 px-2 py-0.5 rounded-full text-[11px]">
          කේතය: <strong>APE10</strong> යොදා 10% වට්ටමක් ලබාගන්න!
        </span>
        <span className="hidden md:inline">•</span>
        <span className="flex items-center gap-1 text-amber-200">
          <PhoneCall className="w-3 h-3" /> Hotline: 011 234 5678
        </span>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo / Brand Name */}
          <div 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} 
            className="flex items-center gap-3 cursor-pointer group select-none flex-shrink-0"
          >
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:scale-105 transition-transform">
              <ShoppingBag className="w-6 h-6 text-white stroke-[2.5]" />
            </div>
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black tracking-tight text-slate-900 group-hover:text-orange-600 transition-colors">
                  Ape
                </span>
                <span className="text-2xl font-black tracking-normal text-orange-600">
                  බඩු කඩේ
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-500 hidden sm:block -mt-1">
                ඔබේ විශ්වාසවන්ත ඔන්ලයින් සාප්පුව
              </p>
            </div>
          </div>

          {/* Search Bar (Storefront) */}
          <div className="hidden md:flex flex-1 max-w-lg mx-4">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="භාණ්ඩ සොයන්න... (Search Ceylon tea, spices, electronics...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-10 py-2.5 bg-slate-100 hover:bg-slate-50 focus:bg-white text-slate-800 text-sm rounded-full border border-slate-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/15 outline-none transition-all"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons for Customer */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Track Order Button */}
            <button
              onClick={() => setIsTrackModalOpen(true)}
              className="hidden lg:flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-orange-600 bg-slate-100 hover:bg-orange-50 rounded-xl transition-colors"
              title="Track Order Status"
            >
              <Truck className="w-4 h-4 text-orange-600" />
              <span>Track Order</span>
            </button>

            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white rounded-xl shadow-md shadow-orange-500/25 active:scale-95 transition-all"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2.5 bg-red-600 text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white animate-pulse">
                    {cartCount}
                  </span>
                )}
              </div>
              <div className="hidden sm:flex flex-col text-left leading-none">
                <span className="text-[10px] text-orange-100 uppercase tracking-wider font-semibold">මගේ බඩු</span>
                <span className="text-xs font-bold">{formatLKR(cartTotal)}</span>
              </div>
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-orange-600 rounded-lg hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-2.5 md:hidden">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="භාණ්ඩ සොයන්න... (Search products)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2 bg-slate-100 text-slate-800 text-sm rounded-xl border border-slate-200 focus:border-orange-500 outline-none"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-3 pb-2 border-t border-slate-100 mt-2 space-y-2">
            <button
              onClick={() => {
                setIsTrackModalOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-orange-50 rounded-lg"
            >
              <Truck className="w-4 h-4 text-orange-600" />
              <span>Track My Order (ඇණවුම් තත්ත්වය)</span>
            </button>
            <div className="px-3 py-2 text-xs text-slate-500 bg-slate-50 rounded-lg flex items-center justify-between">
              <span>Customer Care Hotline</span>
              <span className="font-bold text-slate-800">011 234 5678</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
