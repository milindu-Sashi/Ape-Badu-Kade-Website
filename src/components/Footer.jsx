import React from 'react';
import { useShop } from '../context/ShopContext';
import { 
  ShoppingBag, 
  MapPin, 
  Phone, 
  Mail, 
  CreditCard, 
  ShieldCheck, 
  Truck, 
  Heart,
  Lock
} from 'lucide-react';

export const Footer = () => {
  const { openAdminPortal, setIsTrackModalOpen, setSelectedCategory } = useShop();

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    const el = document.getElementById('products-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-slate-400 text-xs border-t border-slate-800">
      
      {/* Upper features bar */}
      <div className="border-b border-slate-800/80 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-400 flex items-center justify-center flex-shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h5 className="font-bold text-white text-sm">දිවයින පුරා බෙදාහැරීම</h5>
              <p className="text-[11px] text-slate-500">පැය 24 - 48 ඇතුළත ඔබේ නිවසටම</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h5 className="font-bold text-white text-sm">100% තත්ත්ව සහතිකය</h5>
              <p className="text-[11px] text-slate-500">සැබෑ ශ්‍රී ලාංකික නිෂ්පාදන</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h5 className="font-bold text-white text-sm">පහසු ගෙවීම් ක්‍රම</h5>
              <p className="text-[11px] text-slate-500">Card & Cash on Delivery පහසුකම්</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center flex-shrink-0">
              <Phone className="w-6 h-6" />
            </div>
            <div>
              <h5 className="font-bold text-white text-sm">පාරිභෝගික සහය</h5>
              <p className="text-[11px] text-slate-500">011 234 5678 (8 AM - 8 PM)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand details */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-orange-600 flex items-center justify-center text-white">
                <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="text-xl font-black text-white">
                Ape <span className="text-orange-500">බඩු කඩේ</span>
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              ශ්‍රී ලංකාවේ විශ්වාසවන්තම ඔන්ලයින් සාප්පුව. ඔබට අවශ්‍ය සියලුම සිලෝන් කුළුබඩු, ගෘහ උපකරණ, රසකැවිලි සහ ඉලෙක්ට්‍රොනික් භාණ්ඩ සාධාරණ මිලට ඔබේ නිවසටම.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-300">
                VISA
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-300">
                Mastercard
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-[10px] font-bold text-slate-300">
                Cash on Delivery
              </span>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              ප්‍රධාන කාණ්ඩ (Categories)
            </h4>
            <ul className="space-y-2 text-slate-400 text-xs">
              <li>
                <button onClick={() => handleCategoryClick('Spices & Tea')} className="hover:text-orange-400 transition-colors">
                  සිලෝන් තේ සහ කුළුබඩු (Spices & Tea)
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('Household & Kitchen')} className="hover:text-orange-400 transition-colors">
                  ගෘහ සහ මුළුතැන්ගෙයි උපකරණ
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('Electronics')} className="hover:text-orange-400 transition-colors">
                  ඉලෙක්ට්‍රොනික් උපාංග (Electronics)
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('Groceries & Sweets')} className="hover:text-orange-400 transition-colors">
                  පැණි සහ රසකැවිලි (Groceries & Sweets)
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick('Fashion & Crafts')} className="hover:text-orange-400 transition-colors">
                  බතික් සහ අත්යන්ත්‍ර රෙදි (Handloom)
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Quick Links */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              පහසු සබැඳි (Quick Links)
            </h4>
            <ul className="space-y-2 text-slate-400 text-xs">
              <li>
                <button onClick={() => setIsTrackModalOpen(true)} className="hover:text-orange-400 transition-colors">
                  ඇණවුමේ තත්ත්වය (Track Order)
                </button>
              </li>
              <li>
                <a href="#products-section" className="hover:text-orange-400 transition-colors">
                  සියලුම භාණ්ඩ (All Products)
                </a>
              </li>
              <li>
                <span className="text-slate-500">නිතර අසන ප්‍රශ්න (FAQs)</span>
              </li>
              <li>
                <span className="text-slate-500">ආපසු භාරදීමේ ප්‍රතිපත්තිය (Return Policy)</span>
              </li>
            </ul>
          </div>

          {/* Contact Details & Staff Access */}
          <div>
            <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
              අප අමතන්න (Contact Us)
            </h4>
            <ul className="space-y-2.5 text-slate-400 text-xs">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                <span>නො. 120, ගාලු පාර, කොළඹ 03, ශ්‍රී ලංකාව.</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-orange-500 flex-shrink-0" />
                <span>+94 11 234 5678 / +94 77 123 4567</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-orange-500 flex-shrink-0" />
                <span>info@apebadukade.lk</span>
              </li>
            </ul>

            {/* Discreet Admin Login Link in Footer */}
            <div className="pt-4 mt-4 border-t border-slate-900">
              <button
                onClick={openAdminPortal}
                className="flex items-center gap-1.5 text-[11px] text-slate-600 hover:text-orange-400 transition-colors"
                title="Staff / Admin Authentication"
              >
                <Lock className="w-3 h-3 text-slate-600 hover:text-orange-400" />
                <span>පරිපාලක පිවිසුම (Staff / Admin Login)</span>
              </button>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© 2026 Ape බඩු කඩේ (Ape Badu Kade). සියලුම හිමිකම් ඇවිරිණි.</p>
          <p className="flex items-center gap-1">
            ශ්‍රී ලංකාවේ ආදරයෙන් නිපදවන ලදී <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
          </p>
        </div>
      </div>
    </footer>
  );
};
