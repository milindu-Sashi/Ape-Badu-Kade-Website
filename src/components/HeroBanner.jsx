import React from 'react';
import { 
  Sparkles, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  CreditCard, 
  Tag, 
  Flame,
  ArrowRight
} from 'lucide-react';

export const HeroBanner = () => {
  const scrollToProducts = () => {
    const el = document.getElementById('products-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-orange-950 via-slate-900 to-amber-950 text-white py-12 md:py-16 px-4 sm:px-6 lg:px-8">
      {/* Decorative background glow circles */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl -z-0 pointer-events-none" />
      <div className="absolute -bottom-10 left-10 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl -z-0 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Main Hero Text */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-300 text-xs sm:text-sm font-semibold tracking-wide">
              <Flame className="w-4 h-4 text-orange-400 animate-pulse" />
              <span>ශ්‍රී ලංකාවේ අංක 1 ඔන්ලයින් සාප්පුව</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15]">
              ලංකාවේ හොඳම බඩු <br />
              අඩුම මිලට <span className="bg-gradient-to-r from-orange-400 via-amber-300 to-yellow-400 bg-clip-text text-transparent">Ape බඩු කඩෙන්!</span>
            </h1>

            <p className="text-slate-300 text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed">
              100% උසස් ප්‍රමිතියේ සිලෝන් තේ, කුළුබඩු, ගෘහ උපකරණ සහ ඉලෙක්ට්‍රොනික් භාණ්ඩ සුරක්ෂිතව ඔබේ නිවසටම ගෙන්වා ගන්න.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={scrollToProducts}
                className="px-7 py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/30 flex items-center gap-2.5 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
              >
                <span>සාප්පු සවාරි යන්න (Shop Now)</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-xs text-amber-200">
                <Tag className="w-4 h-4 text-amber-400" />
                <span>වට්ටම් කේතය: <strong>APE10</strong> (10% OFF)</span>
              </div>
            </div>
          </div>

          {/* Quick Stats / Highlights Card */}
          <div className="lg:col-span-5">
            <div className="grid grid-cols-2 gap-3.5 sm:gap-4">
              
              <div className="p-4 sm:p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 hover:border-orange-500/40 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400 mb-3 group-hover:scale-110 transition-transform">
                  <Truck className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-white text-sm sm:text-base">දිවයින පුරා බෙදාහැරීම</h4>
                <p className="text-xs text-slate-300 mt-1">දින 1-3 ඇතුළත ආරක්ෂිතව නිවසටම</p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 hover:border-orange-500/40 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400 mb-3 group-hover:scale-110 transition-transform">
                  <CreditCard className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-white text-sm sm:text-base">Cash on Delivery</h4>
                <p className="text-xs text-slate-300 mt-1">භාණ්ඩ ලැබුණු පසු මුදල් ගෙවන්න</p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 hover:border-orange-500/40 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center text-green-400 mb-3 group-hover:scale-110 transition-transform">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-white text-sm sm:text-base">100% සුරක්ෂිත Card Gateway</h4>
                <p className="text-xs text-slate-300 mt-1">Visa & Mastercard සහතික කළ මුදල් ගෙවීම්</p>
              </div>

              <div className="p-4 sm:p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 hover:border-orange-500/40 transition-all group">
                <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center text-blue-400 mb-3 group-hover:scale-110 transition-transform">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-white text-sm sm:text-base">පහසු ආපසු ලබාදීම</h4>
                <p className="text-xs text-slate-300 mt-1">දින 7 ක Return සහතිකය</p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
