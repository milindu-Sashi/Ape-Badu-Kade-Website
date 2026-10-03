import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { X, Star, ShoppingCart, Zap, Check, Truck, ShieldCheck, Heart } from 'lucide-react';

export const ProductModal = () => {
  const { 
    activeProductModal, 
    setActiveProductModal, 
    addToCart, 
    setIsCheckoutOpen, 
    formatLKR,
    selectedCity,
    setSelectedCity,
    CITY_DELIVERY_FEES
  } = useShop();
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!activeProductModal) return null;

  const product = activeProductModal;
  const isOutOfStock = product.stock <= 0;

  // Product images gallery list
  const productImages = Array.isArray(product.images) && product.images.length > 0 
    ? product.images 
    : [product.image];

  const activeImage = productImages[selectedImageIndex] || productImages[0] || product.image;

  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handlePrevImage = () => {
    setSelectedImageIndex(prev => (prev === 0 ? productImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setSelectedImageIndex(prev => (prev === productImages.length - 1 ? 0 : prev + 1));
  };

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    setActiveProductModal(null);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-100 relative max-h-[92vh] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setActiveProductModal(null)}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/90 hover:bg-slate-100 text-slate-500 hover:text-slate-800 shadow-md flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Product Image Gallery Side */}
        <div className="md:w-1/2 relative bg-slate-100 flex flex-col justify-between">
          <div className="relative aspect-square md:h-full w-full overflow-hidden">
            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-all duration-300"
            />

            {/* Badge */}
            {(product.badge || discountPercent > 0) && (
              <span className="absolute top-4 left-4 bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md z-10">
                {product.badge || `${discountPercent}% OFF`}
              </span>
            )}

            {/* Carousel Navigation Arrows if multiple photos */}
            {productImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-slate-800 shadow-md flex items-center justify-center transition-all"
                  title="Previous image"
                >
                  ‹
                </button>
                <button
                  type="button"
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-slate-800 shadow-md flex items-center justify-center transition-all"
                  title="Next image"
                >
                  ›
                </button>
              </>
            )}
          </div>

          {/* Thumbnails list if multiple photos */}
          {productImages.length > 1 && (
            <div className="p-3 bg-slate-50 border-t border-slate-200/60 flex items-center gap-2 overflow-x-auto">
              {productImages.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-12 h-12 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${
                    selectedImageIndex === idx
                      ? 'border-orange-500 ring-2 ring-orange-500/30 scale-105'
                      : 'border-slate-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info Side */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-orange-600 font-bold uppercase tracking-wider">
                {product.category}
              </span>
              <div className="flex items-center gap-1 text-amber-500 font-bold">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{product.rating || '4.9'}</span>
                <span className="text-slate-400 font-normal">({product.reviewsCount || 42} reviews)</span>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
              {product.name}
            </h2>

            {/* Price section */}
            <div className="flex items-baseline gap-3 my-3">
              <span className="text-3xl font-black text-slate-900">
                {formatLKR(product.price)}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <>
                  <span className="text-base text-slate-400 line-through">
                    {formatLKR(product.originalPrice)}
                  </span>
                  <span className="text-xs font-black text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                    {discountPercent}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-slate-600 text-sm leading-relaxed mt-2">
              {product.description}
            </p>

            {/* Stock indicator */}
            <div className="mt-4 py-2 px-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-medium">තොග ප්‍රමාණය (Availability):</span>
              {isOutOfStock ? (
                <span className="text-red-600 font-bold">අවසන් වී ඇත (Out of stock)</span>
              ) : (
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  {product.stock} Units Available in Store
                </span>
              )}
            </div>

            {/* Delivery highlights */}
            <div className="grid grid-cols-2 gap-2 mt-4 text-[11px] text-slate-600">
              <div className="flex items-center gap-1.5 p-2 bg-orange-50/50 rounded-lg text-orange-900">
                <Truck className="w-3.5 h-3.5 text-orange-600 flex-shrink-0" />
                <span>දින 2 කින් නිවසටම</span>
              </div>
              <div className="flex items-center gap-1.5 p-2 bg-amber-50/50 rounded-lg text-amber-900">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                <span>Cash on Delivery ඇත</span>
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
            {/* Quantity Picker & Dynamic Price Summary */}
            {!isOutOfStock && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">ප්‍රමාණය (Quantity):</span>
                  <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-8 h-8 flex items-center justify-center text-slate-700 hover:bg-slate-200 font-bold text-sm"
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-black text-sm text-slate-900">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="w-8 h-8 flex items-center justify-center text-slate-700 hover:bg-slate-200 font-bold text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Real-time Order Calculation Box */}
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>ගෙවිය යුතු මුදල ({quantity} × {formatLKR(product.price)}):</span>
                    <span className="font-bold text-slate-900">{formatLKR(product.price * quantity)}</span>
                  </div>

                  {/* City selector for delivery estimation */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                    <span className="flex items-center gap-1 text-slate-600">
                      <Truck className="w-3.5 h-3.5 text-orange-600" />
                      බෙදාහැරීමේ නගරය (Delivery City):
                    </span>
                    <select
                      value={selectedCity}
                      onChange={(e) => setSelectedCity(e.target.value)}
                      className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800 outline-none cursor-pointer"
                    >
                      {Object.keys(CITY_DELIVERY_FEES).map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span>ඩිලිවරි ගාස්තුව (Delivery Fee):</span>
                    <span className="font-bold text-slate-800">
                      {(product.price * quantity >= 15000) ? (
                        <span className="text-emerald-600 font-bold">Free (නොමිලේ)</span>
                      ) : (
                        formatLKR(CITY_DELIVERY_FEES[selectedCity] || 450)
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1.5 border-t border-slate-200 font-black text-slate-900 text-sm">
                    <span>එකතුව (Total Amount):</span>
                    <span className="text-orange-600 text-base">
                      {formatLKR(
                        (product.price * quantity) + 
                        ((product.price * quantity >= 15000) ? 0 : (CITY_DELIVERY_FEES[selectedCity] || 450))
                      )}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Added notice toast inside modal */}
            {addedNotice && (
              <div className="p-2 bg-emerald-50 text-emerald-800 text-xs font-bold rounded-lg text-center flex items-center justify-center gap-1.5 animate-fadeIn">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>සාර්ථකව කරත්තයට එකතු කරන ලදී! (Added to Cart)</span>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 border transition-all ${
                  isOutOfStock
                    ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                    : 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100 active:scale-95'
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className={`py-3 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 text-white shadow-lg transition-all ${
                  isOutOfStock
                    ? 'bg-slate-300 cursor-not-allowed'
                    : 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 shadow-orange-500/25 active:scale-95'
                }`}
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Buy Now</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
