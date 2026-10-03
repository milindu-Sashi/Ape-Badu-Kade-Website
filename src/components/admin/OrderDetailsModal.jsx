import React, { useState } from 'react';
import { X, CheckCircle, Clock, Truck, Package, Printer, AlertTriangle } from 'lucide-react';

export const OrderDetailsModal = ({ order, isOpen, onClose, onStatusUpdate, formatLKR }) => {
  const [updating, setUpdating] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(order?.status || 'Pending');

  if (!isOpen || !order) return null;

  const handleStatusChange = async (newStatus) => {
    setUpdating(true);
    try {
      const res = await fetch(`/api/orders/${order.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (!res.ok) throw new Error('Status update failed');
      const data = await res.json();
      setSelectedStatus(newStatus);
      onStatusUpdate(data.order);
    } catch (err) {
      alert('Error updating status: ' + err.message);
    } finally {
      setUpdating(false);
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
            <div className="flex items-center gap-2">
              <span className="font-mono text-base font-black text-slate-900">{order.id}</span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-800">
                {order.status}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              ඇණවුම් දිනය: {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-xl"
              title="Print Order"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 rounded-xl">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Status Change Bar */}
          <div className="p-4 bg-orange-50/70 border border-orange-200 rounded-2xl">
            <label className="block text-xs font-bold text-orange-950 uppercase tracking-wider mb-2">
              ඇණවුම් තත්ත්වය වෙනස් කරන්න (Update Order Status):
            </label>
            <div className="flex flex-wrap gap-2">
              {['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'].map((status) => (
                <button
                  key={status}
                  disabled={updating}
                  onClick={() => handleStatusChange(status)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    order.status === status
                      ? 'bg-orange-600 text-white shadow-md'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-orange-100'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Customer & Shipping info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1 text-xs">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-2">
                පාරිභෝගික තොරතුරු (Customer Details)
              </h4>
              <p><strong className="text-slate-700">නම:</strong> {order.customer?.name}</p>
              <p><strong className="text-slate-700">දුරකථන:</strong> <span className="font-mono text-orange-600 font-bold">{order.customer?.phone}</span></p>
              <p><strong className="text-slate-700">ඊමේල්:</strong> {order.customer?.email || 'N/A'}</p>
              <p><strong className="text-slate-700">ලිපිනය:</strong> {order.customer?.address}, {order.customer?.city}</p>
              {order.customer?.notes && (
                <p className="pt-1 text-amber-700"><strong className="text-slate-700">සටහන්:</strong> "{order.customer?.notes}"</p>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1 text-xs">
              <h4 className="font-bold text-slate-800 uppercase tracking-wider text-[11px] mb-2">
                ගෙවීම් තොරතුරු (Payment Details)
              </h4>
              <p><strong className="text-slate-700">ක්‍රමය:</strong> <span className="capitalize">{order.paymentMethod}</span></p>
              <p><strong className="text-slate-700">තත්ත්වය:</strong> <span className="font-bold text-emerald-600">{order.paymentDetails?.status || 'Confirmed'}</span></p>
              <p><strong className="text-slate-700">Transaction ID:</strong> <span className="font-mono">{order.paymentDetails?.transactionId}</span></p>
              {order.paymentDetails?.cardLast4 && (
                <p><strong className="text-slate-700">Card ending:</strong> **** {order.paymentDetails.cardLast4}</p>
              )}
            </div>
          </div>

          {/* Items Table */}
          <div>
            <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">
              ඇණවුම් කළ භාණ්ඩ (Items Ordered)
            </h4>
            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                  <tr>
                    <th className="p-3">භාණ්ඩය (Product)</th>
                    <th className="p-3 text-center">ප්‍රමාණය</th>
                    <th className="p-3 text-right">මිල</th>
                    <th className="p-3 text-right">එකතුව</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {order.items?.map((item, i) => (
                    <tr key={i} className="hover:bg-slate-50/50">
                      <td className="p-3 flex items-center gap-2.5">
                        <img src={item.image} alt={item.name} className="w-9 h-9 rounded-lg object-cover" />
                        <span className="font-semibold text-slate-800">{item.name}</span>
                      </td>
                      <td className="p-3 text-center font-bold text-slate-700">{item.quantity}</td>
                      <td className="p-3 text-right text-slate-600">{formatLKR(item.price)}</td>
                      <td className="p-3 text-right font-bold text-slate-900">{formatLKR(item.price * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Total calculations */}
              <div className="p-3.5 bg-slate-50/80 border-t border-slate-200 text-xs space-y-1">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal:</span>
                  <span>{formatLKR(order.subtotal)}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount:</span>
                    <span>-{formatLKR(order.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>Delivery:</span>
                  <span>{order.deliveryFee === 0 ? 'Free' : formatLKR(order.deliveryFee)}</span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200 text-sm font-black text-slate-900">
                  <span>Total (මුළු මුදල):</span>
                  <span className="text-orange-600">{formatLKR(order.total)}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
