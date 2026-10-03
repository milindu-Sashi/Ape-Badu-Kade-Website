import React, { useState } from 'react';
import { useShop } from '../../context/ShopContext';
import { Lock, Shield, X, AlertCircle, KeyRound, Sparkles } from 'lucide-react';

export const AdminLoginModal = () => {
  const { isAdminLoginModalOpen, setIsAdminLoginModalOpen, loginAdmin } = useShop();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isAdminLoginModalOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password) {
      setError('කරුණාකර පරිශීලක නම සහ මුරපදය ඇතුළත් කරන්න.');
      return;
    }

    setLoading(true);
    setError('');

    const res = await loginAdmin(username, password);
    setLoading(false);

    if (!res.success) {
      setError(res.error || 'වැරදි පරිශීලක නමක් හෝ මුරපදයකි.');
    }
  };

  const handleFillDemo = () => {
    setUsername('admin');
    setPassword('admin123');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fadeIn">
      <div 
        className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-100 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-slate-900 via-orange-950 to-slate-900 text-white p-6 text-center relative">
          <button
            onClick={() => setIsAdminLoginModalOpen(false)}
            className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-14 h-14 rounded-2xl bg-orange-600/30 border border-orange-500/40 text-orange-400 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <Shield className="w-7 h-7" />
          </div>

          <h3 className="text-lg font-black tracking-tight">
            Ape බඩු කඩේ - Admin Login
          </h3>
          <p className="text-xs text-slate-300 mt-1">
            පරිපාලක පාලක පුවරුව වෙත පිවිසීම (Authorized Personnel Only)
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              පරිපාලක නම (Username)
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full pl-3.5 pr-3 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              මුරපදය (Password)
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-3.5 pr-3 py-2.5 text-xs font-semibold rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none font-mono"
              />
            </div>
          </div>

          {/* Quick Demo Fill */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-400">Default Credentials:</span>
            <button
              type="button"
              onClick={handleFillDemo}
              className="text-[11px] font-bold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-2 py-1 rounded-md transition-colors"
            >
              + Fill admin / admin123
            </button>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-orange-500/25 flex items-center justify-center gap-2 transition-all"
            >
              <KeyRound className="w-4 h-4" />
              <span>{loading ? 'සත්‍යාපනය කරමින්...' : 'Login to Admin Panel'}</span>
            </button>
          </div>

          <p className="text-[11px] text-center text-slate-400">
            මෙම කොටස පාරිභෝගිකයින්ට දර්ශනය නොවන අතර, වෙළඳසැල් හිමිකරුට පමණක් වලංගු වේ.
          </p>
        </form>
      </div>
    </div>
  );
};
