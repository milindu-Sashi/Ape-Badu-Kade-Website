import React from 'react';
import { useShop } from '../context/ShopContext';
import { ShoppingCart, Eye, Star, Zap } from 'lucide-react';

export const ProductCard = ({ product }) => {
  const { addToCart, setIsCartOpen, setIsCheckoutOpen, setActiveProductModal, formatLKR } = useShop();

  const handleBuyNow = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
    setIsCheckoutOpen(true);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product, 1);
    setIsCartOpen(true);
  };

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const discountPercent = product.originalPrice && product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div 
      onClick={() => setActiveProductModal(product)}
      className="group bg-white rounded-2xl border border-slate-200/80 hover:border-orange-300 hover:shadow-xl hover:shadow-orange-500/10 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer relative"
    >
      {/* Top Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
        {discountPercent > 0 && (
          <span className="bg-red-500 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full shadow-sm">
            -{discountPercent}% OFF
          </span>
        )}
        {product.badge && (
          <span className="bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
            {product.badge}
          </span>
        )}
        {Array.isArray(product.images) && product.images.length > 1 && (
          <span className="bg-slate-900/80 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded-md shadow-sm flex items-center gap-1">
            📷 {product.images.length} Photos
          </span>
        )}
      </div>

      {/* Quick View Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setActiveProductModal(product);
        }}
        className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-orange-600 hover:text-white text-slate-600 shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform group-hover:scale-105"
        title="Quick View"
      >
        <Eye className="w-4 h-4" />
      </button>

      {/* Product Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center">
            <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              Out of Stock (අවසන් වී ඇත)
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-orange-600 font-semibold tracking-wide uppercase text-[10px]">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating || '4.9'}</span>
              <span className="text-slate-400 text-[10px]">({product.reviewsCount || 24})</span>
            </div>
          </div>

          {/* Name */}
          <h3 className="font-bold text-slate-800 text-sm sm:text-base line-clamp-2 group-hover:text-orange-600 transition-colors">
            {product.name}
          </h3>

          {/* Description Snippet */}
          <p className="text-slate-500 text-xs mt-1 line-clamp-1">
            {product.description}
          </p>
        </div>

        {/* Pricing & Stock */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-black text-slate-900">
              {formatLKR(product.price)}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-slate-400 line-through">
                {formatLKR(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Stock Indicator */}
          <div className="mt-1 flex items-center justify-between text-[11px]">
            {isOutOfStock ? (
              <span className="text-red-500 font-semibold">අවසන් වී ඇත</span>
            ) : isLowStock ? (
              <span className="text-amber-600 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping inline-block" />
                ඉතිරිව ඇත්තේ {product.stock} යි!
              </span>
            ) : (
              <span className="text-emerald-600 font-medium">In Stock ({product.stock} available)</span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2 mt-3">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
                isOutOfStock
                  ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                  : 'bg-orange-50 text-orange-700 border-orange-200 hover:bg-orange-100 hover:border-orange-300 active:scale-95'
              }`}
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Add to Cart</span>
            </button>

            <button
              onClick={handleBuyNow}
              disabled={isOutOfStock}
              className={`py-2 px-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1 text-white shadow-sm transition-all ${
                isOutOfStock
                  ? 'bg-slate-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 shadow-orange-500/20 active:scale-95'
              }`}
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Buy Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
