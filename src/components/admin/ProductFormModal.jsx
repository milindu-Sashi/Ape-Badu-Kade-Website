import React, { useState, useEffect } from 'react';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  Sparkles, 
  Check, 
  AlertCircle, 
  Trash2, 
  Star,
  Plus,
  Percent
} from 'lucide-react';

const PRESET_IMAGES = [
  { label: 'Ceylon Tea', url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80' },
  { label: 'Cinnamon', url: 'https://images.unsplash.com/photo-1509358271058-acd22cc93898?auto=format&fit=crop&w=600&q=80' },
  { label: 'Clay Pot', url: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=600&q=80' },
  { label: 'Earbuds', url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=600&q=80' },
  { label: 'Cashews', url: 'https://images.unsplash.com/photo-1509912760195-4f6cfd9c2885?auto=format&fit=crop&w=600&q=80' },
  { label: 'Handloom', url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80' }
];

// Helper to compress local images selected from computer folder to lightweight Data URLs
const compressAndReadImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 1000;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
};

export const ProductFormModal = ({ isOpen, onClose, product, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: 'Spices & Tea',
    price: '',
    originalPrice: '',
    discountPercent: '',
    stock: '10',
    badge: 'New',
    images: [PRESET_IMAGES[0].url],
    description: '',
    featured: false
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (product) {
      const orig = Number(product.originalPrice) || Number(product.price) || 0;
      const sell = Number(product.price) || 0;
      let calculatedDiscount = '';
      if (orig > 0 && orig > sell) {
        calculatedDiscount = Math.round(((orig - sell) / orig) * 100).toString();
      }

      const initialImages = Array.isArray(product.images) && product.images.length > 0
        ? product.images
        : [product.image || PRESET_IMAGES[0].url];

      setFormData({
        name: product.name || '',
        category: product.category || 'Spices & Tea',
        price: product.price !== undefined ? product.price : '',
        originalPrice: product.originalPrice !== undefined ? product.originalPrice : '',
        discountPercent: calculatedDiscount,
        stock: product.stock !== undefined ? product.stock : 10,
        badge: product.badge || '',
        images: initialImages,
        description: product.description || '',
        featured: Boolean(product.featured)
      });
    } else {
      setFormData({
        name: '',
        category: 'Spices & Tea',
        price: '',
        originalPrice: '',
        discountPercent: '',
        stock: '10',
        badge: 'New',
        images: [PRESET_IMAGES[0].url],
        description: '',
        featured: false
      });
    }
    setUrlInput('');
    setError('');
  }, [product, isOpen]);

  if (!isOpen) return null;

  // Handler for Price / Original Price / Discount % recalculations
  const handlePriceChange = (field, value) => {
    setFormData(prev => {
      let newPrice = prev.price;
      let newOriginal = prev.originalPrice;
      let newDiscount = prev.discountPercent;

      if (field === 'price') {
        newPrice = value;
        const p = Number(value);
        const orig = Number(newOriginal);
        if (orig > 0 && p > 0 && orig >= p) {
          newDiscount = Math.round(((orig - p) / orig) * 100).toString();
        }
      } else if (field === 'originalPrice') {
        newOriginal = value;
        const orig = Number(value);
        const disc = Number(newDiscount);
        if (orig > 0 && disc > 0) {
          newPrice = Math.round(orig - (orig * disc) / 100).toString();
        } else {
          const p = Number(newPrice);
          if (orig > 0 && p > 0 && orig >= p) {
            newDiscount = Math.round(((orig - p) / orig) * 100).toString();
          }
        }
      } else if (field === 'discountPercent') {
        newDiscount = value;
        const disc = Number(value);
        const orig = Number(newOriginal);
        if (orig > 0 && disc >= 0 && disc <= 100) {
          newPrice = Math.round(orig - (orig * disc) / 100).toString();
        }
      }

      // Auto-set Badge if discount > 0 and badge is default or discount-based
      let newBadge = prev.badge;
      const numDisc = Number(newDiscount);
      if (numDisc > 0 && (!newBadge || newBadge.includes('% OFF') || newBadge === 'New')) {
        newBadge = `${numDisc}% OFF`;
      }

      return {
        ...prev,
        price: newPrice,
        originalPrice: newOriginal,
        discountPercent: newDiscount,
        badge: newBadge
      };
    });
  };

  // Multiple File Upload Handler (Selects photos directly from computer/laptop folder)
  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
    setError('');

    try {
      const dataUrls = await Promise.all(files.map(compressAndReadImage));
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...dataUrls]
      }));
    } catch (err) {
      console.error(err);
      setError('ඡායාරූප Upload කිරීමේදී දෝෂයක් සිදුවිය. කරුණාකර නැවත උත්සාහ කරන්න.');
    } finally {
      setIsUploading(false);
      e.target.value = ''; // reset file input
    }
  };

  // Add URL image
  const handleAddUrl = () => {
    if (!urlInput.trim()) return;
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, urlInput.trim()]
    }));
    setUrlInput('');
  };

  // Remove photo from gallery
  const handleRemoveImage = (indexToRemove) => {
    setFormData(prev => {
      const filtered = prev.images.filter((_, idx) => idx !== indexToRemove);
      return {
        ...prev,
        images: filtered.length > 0 ? filtered : [PRESET_IMAGES[0].url]
      };
    });
  };

  // Set photo as primary main photo
  const handleSetMainImage = (indexToMain) => {
    setFormData(prev => {
      const selected = prev.images[indexToMain];
      const rest = prev.images.filter((_, idx) => idx !== indexToMain);
      return {
        ...prev,
        images: [selected, ...rest]
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.price) {
      setError('කරුණාකර භාණ්ඩයේ නම සහ මිල ඇතුළත් කරන්න.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      const url = product ? `/api/products/${product.id}` : '/api/products';
      const method = product ? 'PUT' : 'POST';

      const payload = {
        ...formData,
        price: Number(formData.price),
        originalPrice: formData.originalPrice ? Number(formData.originalPrice) : Number(formData.price),
        stock: Number(formData.stock || 0),
        image: formData.images[0], // primary main image
        images: formData.images
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to save product');
      }

      const saved = await res.json();
      onSave(saved);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="font-bold text-slate-900 text-base">
              {product ? 'භාණ්ඩයේ තොරතුරු සංස්කරණය (Edit Product)' : 'නව භාණ්ඩයක් ඇතුළත් කිරීම (Add New Product)'}
            </h3>
            <p className="text-xs text-slate-500">
              {product ? `ID: ${product.id}` : 'Ape බඩු කඩේ Store Inventory'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="mx-6 mt-4 p-3 bg-red-50 text-red-600 text-xs rounded-xl flex items-center gap-2 border border-red-200">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[78vh] overflow-y-auto">
          
          {/* Product Name */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              භාණ්ඩයේ නම (Product Name) *
            </label>
            <input
              type="text"
              placeholder="e.g. Ceylon Cinnamon Sticks (කුරුඳු පොතු)"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3.5 py-2.5 text-xs font-medium rounded-xl border border-slate-200 focus:border-orange-500 outline-none"
            />
          </div>

          {/* Category & Badge */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                කාණ්ඩය (Category)
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                className="w-full px-3.5 py-2.5 text-xs font-medium rounded-xl border border-slate-200 focus:border-orange-500 outline-none bg-white"
              >
                <option value="Spices & Tea">Spices & Tea (තේ සහ කුළුබඩු)</option>
                <option value="Household & Kitchen">Household & Kitchen (ගෘහ උපකරණ)</option>
                <option value="Groceries & Sweets">Groceries & Sweets (රසකැවිලි & පැණි)</option>
                <option value="Electronics">Electronics (ඉලෙක්ට්‍රොනික්)</option>
                <option value="Fashion & Crafts">Fashion & Crafts (බතික් සහ අත්යන්ත්‍ර)</option>
                <option value="General">General / වෙනත්</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                ලේබලය / Badge (e.g. Best Seller, Organic, 15% OFF)
              </label>
              <input
                type="text"
                placeholder="e.g. Best Seller, Organic, 15% OFF"
                value={formData.badge}
                onChange={(e) => setFormData(prev => ({ ...prev, badge: e.target.value }))}
                className="w-full px-3.5 py-2.5 text-xs font-medium rounded-xl border border-slate-200 focus:border-orange-500 outline-none"
              />
            </div>
          </div>

          {/* Pricing Section with Per-Item Discount % Calculator */}
          <div className="p-4 bg-orange-50/50 border border-orange-200/80 rounded-2xl space-y-3">
            <h4 className="text-xs font-black text-orange-950 uppercase tracking-wider flex items-center gap-1.5">
              <Percent className="w-4 h-4 text-orange-600" />
              මිල ගණන් සහ වට්ටම් (Price & Item Discount)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  සාමාන්‍ය මිල (Regular Price)
                </label>
                <input
                  type="number"
                  placeholder="2000"
                  min="0"
                  value={formData.originalPrice}
                  onChange={(e) => handlePriceChange('originalPrice', e.target.value)}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 focus:border-orange-500 outline-none bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  වට්ටම් % (Discount %)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="15"
                    min="0"
                    max="100"
                    value={formData.discountPercent}
                    onChange={(e) => handlePriceChange('discountPercent', e.target.value)}
                    className="w-full px-3 py-2 pr-7 text-xs font-bold text-emerald-700 rounded-xl border border-emerald-300 focus:border-emerald-500 outline-none bg-emerald-50/50"
                  />
                  <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs font-bold text-emerald-600">%</span>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  විකුණුම් මිල (Selling Price) *
                </label>
                <input
                  type="number"
                  placeholder="1700"
                  required
                  min="1"
                  value={formData.price}
                  onChange={(e) => handlePriceChange('price', e.target.value)}
                  className="w-full px-3 py-2 text-xs font-black text-slate-900 rounded-xl border border-slate-300 focus:border-orange-500 outline-none bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  තොගය (Stock Units) *
                </label>
                <input
                  type="number"
                  placeholder="10"
                  required
                  min="0"
                  value={formData.stock}
                  onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                  className="w-full px-3 py-2 text-xs font-semibold rounded-xl border border-slate-200 focus:border-orange-500 outline-none bg-white"
                />
              </div>
            </div>

            {/* Discount Summary Banner */}
            {Number(formData.discountPercent) > 0 && Number(formData.originalPrice) > Number(formData.price) && (
              <div className="p-2.5 bg-emerald-100/70 border border-emerald-300 rounded-xl flex items-center justify-between text-xs text-emerald-950 font-bold">
                <span>🎉 මෙම භාණ්ඩයට {formData.discountPercent}% වට්ටමක් ලැබී ඇත!</span>
                <span className="text-emerald-800">
                  වට්ටම් මුදල: රු. {Number(formData.originalPrice) - Number(formData.price)} OFF
                </span>
              </div>
            )}
          </div>

          {/* Multiple File Upload Section */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-700">
              භාණ්ඩයේ ඡායාරූප (Product Photos - Local Upload & URLs)
            </label>

            {/* Local Laptop File Upload Box */}
            <div className="border-2 border-dashed border-orange-300 hover:border-orange-500 rounded-2xl p-4 bg-orange-50/30 text-center transition-colors">
              <input
                type="file"
                id="laptop-file-input"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label 
                htmlFor="laptop-file-input" 
                className="cursor-pointer flex flex-col items-center justify-center space-y-2 py-2"
              >
                <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center shadow-inner">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    {isUploading ? 'ඡායාරූප Upload වෙමින්...' : 'ලැප්ටොප්/පරිගණක ෆෝල්ඩරයෙන් ඡායාරූප එකතු කරන්න'}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Click here to select multiple photos from your device (JPG, PNG, WebP)
                  </p>
                </div>
                <span className="px-4 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all inline-flex items-center gap-1.5">
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Choose Photos from Computer</span>
                </span>
              </label>
            </div>

            {/* Optional URL Input Fallback */}
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="හෝ ඡායාරූප Link (Image URL) ඇතුළත් කරන්න..."
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="flex-1 px-3.5 py-2 text-xs font-medium rounded-xl border border-slate-200 focus:border-orange-500 outline-none"
              />
              <button
                type="button"
                onClick={handleAddUrl}
                className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl shadow-xs flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add URL</span>
              </button>
            </div>

            {/* Presets Quick Picker */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[10px] text-slate-400 font-semibold">නියැදි පින්තූර (Presets):</span>
              {PRESET_IMAGES.map((img) => (
                <button
                  key={img.label}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, images: [...prev.images, img.url] }))}
                  className="text-[10px] px-2 py-0.5 rounded-md border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-600"
                >
                  + {img.label}
                </button>
              ))}
            </div>

            {/* Gallery Thumbnails List */}
            {formData.images.length > 0 && (
              <div className="pt-2">
                <p className="text-[11px] font-bold text-slate-600 mb-2">
                  එකතු කළ ඡායාරූප ({formData.images.length}) • (පළමු පින්තූරය ප්‍රධාන ඡායාරූපය වේ):
                </p>
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5">
                  {formData.images.map((imgUrl, idx) => (
                    <div 
                      key={idx} 
                      className={`relative aspect-square rounded-xl overflow-hidden border-2 group ${
                        idx === 0 ? 'border-orange-500 shadow-md ring-2 ring-orange-500/20' : 'border-slate-200'
                      }`}
                    >
                      <img src={imgUrl} alt={`Product ${idx}`} className="w-full h-full object-cover" />
                      
                      {idx === 0 && (
                        <span className="absolute top-1 left-1 bg-orange-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded">
                          Main
                        </span>
                      )}

                      {/* Controls overlay */}
                      <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                        {idx !== 0 && (
                          <button
                            type="button"
                            onClick={() => handleSetMainImage(idx)}
                            className="p-1 bg-white text-slate-800 rounded-md text-[10px] font-bold hover:bg-orange-100"
                            title="Set as Main Image"
                          >
                            Main
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="p-1 bg-red-600 text-white rounded-md hover:bg-red-700"
                          title="Remove Image"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              විස්තරය (Description)
            </label>
            <textarea
              rows="3"
              placeholder="භාණ්ඩයේ විශේෂතා සහ විස්තරය සිංහලෙන් හෝ ඉංග්‍රීසියෙන්..."
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3.5 py-2 text-xs font-medium rounded-xl border border-slate-200 focus:border-orange-500 outline-none"
            />
          </div>

          {/* Featured Checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="featured-checkbox"
              checked={formData.featured}
              onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
              className="w-4 h-4 text-orange-600 rounded border-slate-300 focus:ring-orange-500"
            />
            <label htmlFor="featured-checkbox" className="text-xs font-bold text-slate-700 cursor-pointer">
              ප්‍රධාන පිටුවේ විශේෂ භාණ්ඩයක් ලෙස පෙන්වන්න (Featured on Homepage)
            </label>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
            >
              අවලංගු කරන්න (Cancel)
            </button>
            <button
              type="submit"
              disabled={saving || isUploading}
              className="px-6 py-2.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              {saving ? 'සුරකිමින්...' : (product ? 'යාවත්කාලීන කරන්න (Update Product)' : 'භාණ්ඩය ඇතුළත් කරන්න (Save Product)')}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
