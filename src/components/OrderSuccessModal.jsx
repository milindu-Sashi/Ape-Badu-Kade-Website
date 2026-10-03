import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { 
  CheckCircle, 
  Copy, 
  Check, 
  Printer, 
  ShoppingBag, 
  Truck, 
  ArrowRight,
  Package,
  Calendar
} from 'lucide-react';

export const OrderSuccessModal = () => {
  const { 
    lastOrder, 
    isOrderSuccessOpen, 
    setIsOrderSuccessOpen, 
    setIsTrackModalOpen, 
    formatLKR 
  } = useShop();

  const [copied, setCopied] = useState(false);

  if (!isOrderSuccessOpen || !lastOrder) return null;

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(lastOrder.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTrackClick = () => {
    setIsOrderSuccessOpen(false);
    setIsTrackModalOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-100 overflow-hidden relative print:border-none print:shadow-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Success Banner */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white p-6 text-center relative overflow-hidden">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto mb-3 border-2 border-white/40">
            <CheckCircle className="w-9 h-9 text-white" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black">
            ස්තූතියි! ඔබගේ ඇණවුම ලැබිණි!
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1">
            Your order has been placed successfully at <strong>Ape බඩු කඩේ</strong>
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          
          {/* Order ID Badge with Copy */}
          <div className="p-4 bg-orange-50/60 border border-orange-200/80 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[11px] text-orange-800 font-medium block">
                ඇණවුම් අංකය (Order Reference ID):
              </span>
              <span className="text-lg font-mono font-black text-slate-900">
                {lastOrder.id}
              </span>
            </div>

            <button
              onClick={handleCopyOrderId}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-orange-100 text-orange-700 text-xs font-bold rounded-xl border border-orange-200 shadow-xs transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy ID'}</span>
            </button>
          </div>

          {/* Delivery & Payment Info */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">භාරදෙන්නේ කාටද</span>
              <p className="font-bold text-slate-800 mt-0.5">{lastOrder.customer.name}</p>
              <p className="text-slate-600 text-[11px]">{lastOrder.customer.phone}</p>
              <p className="text-slate-500 text-[11px] line-clamp-1">{lastOrder.customer.address}, {lastOrder.customer.city}</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 block text-[10px] uppercase font-bold">ගෙවීම් තොරතුරු</span>
              <p className="font-bold text-slate-800 mt-0.5 capitalize">
                {lastOrder.paymentMethod === 'card' ? 'Visa/Mastercard Card' : 'Cash on Delivery (COD)'}
              </p>
              <p className="text-[11px] font-semibold text-emerald-600">
                Status: {lastOrder.paymentDetails?.status || 'Confirmed'}
              </p>
              <p className="text-[10px] font-mono text-slate-400">
                {lastOrder.paymentDetails?.transactionId}
              </p>
            </div>
          </div>

          {/* Items Summary */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              ඇණවුම් කළ භාණ්ඩ ({lastOrder.items.length})
            </h4>
            <div className="space-y-2 border border-slate-100 rounded-2xl p-3 bg-slate-50/50">
              {lastOrder.items.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-1 border-b border-slate-100 last:border-none">
                  <div className="flex items-center gap-2">
                    <img src={item.image} alt={item.name} className="w-8 h-8 rounded-lg object-cover" />
                    <div>
                      <p className="font-semibold text-slate-800 line-clamp-1">{item.name}</p>
                      <p className="text-[10px] text-slate-500">Qty: {item.quantity} × {formatLKR(item.price)}</p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-800">
                    {formatLKR(item.price * item.quantity)}
                  </span>
                </div>
              ))}

              <div className="pt-2 space-y-1 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-medium">{formatLKR(lastOrder.subtotal)}</span>
                </div>
                {lastOrder.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount:</span>
                    <span>-{formatLKR(lastOrder.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery:</span>
                  <span className="font-medium">{lastOrder.deliveryFee === 0 ? 'Free' : formatLKR(lastOrder.deliveryFee)}</span>
                </div>
                <div className="flex justify-between pt-1 font-bold text-slate-900 border-t border-slate-200">
                  <span>Total Paid:</span>
                  <span className="text-orange-600 font-black">{formatLKR(lastOrder.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="space-y-2 pt-2 print:hidden">
            <button
              onClick={handleTrackClick}
              className="w-full py-3 px-4 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
            >
              <Truck className="w-4 h-4" />
              <span>ඇණවුමේ තත්ත්වය පරීක්ෂා කරන්න (Track Order)</span>
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => window.print()}
                className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Receipt</span>
              </button>

              <button
                onClick={() => setIsOrderSuccessOpen(false)}
                className="py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>සාප්පු සවාරි (Shop More)</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
