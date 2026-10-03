import React from 'react';
import { useShop } from '../context/ShopContext';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  ArrowRight, 
  Tag, 
  Truck, 
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const CartDrawer = () => {
  const {
    cart,
    cartCount,
    cartSubtotal,
    deliveryFee,
    discountAmount,
    autoDiscount,
    autoDiscountAmount,
    selectedCity,
    setSelectedCity,
    CITY_DELIVERY_FEES,
    cartTotal,
    isCartOpen,
    setIsCartOpen,
    setIsCheckoutOpen,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    couponCode,
    setCouponCode,
    appliedCoupon,
    couponError,
    applyCoupon,
    removeCoupon,
    formatLKR
  } = useShop();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Dark backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-base">මගේ කරත්තය</h3>
                <p className="text-xs text-slate-500">{cartCount} items in cart</p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-20 h-20 rounded-full bg-orange-50 flex items-center justify-center text-orange-400">
                  <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-lg">කරත්තය හිස්ව ඇත</h4>
                  <p className="text-slate-500 text-xs mt-1">ඔබ තවමත් කිසිදු භාණ්ඩයක් එකතු කර නැත.</p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-md transition-all"
                >
                  සාප්පු සවාරි යන්න (Start Shopping)
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div 
                  key={item.id}
                  className="flex gap-3.5 p-3 rounded-2xl border border-slate-100 bg-slate-50/40 hover:bg-slate-50 transition-colors"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl object-cover border border-slate-200 flex-shrink-0"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-1">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-slate-400 hover:text-red-500 p-1 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-xs text-orange-600 font-bold">
                        {formatLKR(item.price)}
                      </span>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden shadow-2xs">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-100 transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-black text-slate-800">
                        {formatLKR(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Area */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-100 bg-white space-y-4">
              
              {/* Promo Code Input */}
              <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-orange-600 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="කූපන් කේතය (e.g. APE10)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 bg-transparent text-xs font-semibold text-slate-800 outline-none uppercase placeholder:normal-case placeholder:text-slate-400"
                  />
                  <button
                    onClick={() => applyCoupon(couponCode)}
                    className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-lg shadow-sm transition-all"
                  >
                    Apply
                  </button>
                </div>

                {appliedCoupon && (
                  <div className="mt-2 flex items-center justify-between bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-lg text-[11px] font-bold">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      {appliedCoupon.label} (-{appliedCoupon.discountPercent}%)
                    </span>
                    <button onClick={removeCoupon} className="text-red-500 hover:underline">
                      ඉවත් කරන්න
                    </button>
                  </div>
                )}

                {couponError && (
                  <p className="mt-1.5 text-[11px] text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {couponError}
                  </p>
                )}
              </div>

              {/* Cost Summary */}
              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>භාණ්ඩ එකතුව (Subtotal):</span>
                  <span className="font-semibold text-slate-800">{formatLKR(cartSubtotal)}</span>
                </div>

                {/* Auto Tier Discount Badge */}
                {autoDiscount && autoDiscount.percent > 0 && (
                  <div className="flex justify-between text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-lg">
                    <span>🏷️ {autoDiscount.label}:</span>
                    <span>-{formatLKR(autoDiscountAmount)}</span>
                  </div>
                )}

                {/* Manual Coupon Discount */}
                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>🎟️ Coupon ({appliedCoupon.code}):</span>
                    <span>-{formatLKR(Math.round((cartSubtotal * appliedCoupon.discountPercent) / 100))}</span>
                  </div>
                )}

                {/* City Selector & Delivery Fee */}
                <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-orange-600" /> නගරය (Delivery City):
                  </span>
                  <select
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                    className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-800 outline-none"
                  >
                    {Object.keys(CITY_DELIVERY_FEES).map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-between">
                  <span>ඩිලිවරි ගාස්තුව (Delivery Fee):</span>
                  <span className="font-semibold text-slate-800">
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-600 font-bold uppercase">Free (නොමිලේ)</span>
                    ) : (
                      formatLKR(deliveryFee)
                    )}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-slate-900">මුළු එකතුව (Grand Total):</span>
                  <span className="text-xl font-black text-orange-600">{formatLKR(cartTotal)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-sm rounded-2xl shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-all transform active:scale-95"
              >
                <span>මුදල් ගෙවීමට ඉදිරියට (Proceed to Checkout)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
