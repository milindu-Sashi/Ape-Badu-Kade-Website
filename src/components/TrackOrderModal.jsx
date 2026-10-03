import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useShop } from '../context/ShopContext';
import {
  X,
  Search,
  Truck,
  CheckCircle2,
  Clock,
  Package,
  MapPin,
  AlertCircle,
  PhoneCall,
  RefreshCw,
  Navigation,
  Zap,
  Timer,
  ChevronRight
} from 'lucide-react';

// ─── Countdown Timer Hook ──────────────────────────────────────────────────────
function useCountdown(targetIso) {
  const [remaining, setRemaining] = useState(null);

  useEffect(() => {
    if (!targetIso) { setRemaining(null); return; }

    const tick = () => {
      const diff = Math.max(0, new Date(targetIso) - Date.now());
      setRemaining(diff);
    };

    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, [targetIso]);

  if (remaining === null) return null;
  const totalSecs = Math.floor(remaining / 1000);
  const hours = Math.floor(totalSecs / 3600);
  const mins = Math.floor((totalSecs % 3600) / 60);
  const secs = totalSecs % 60;
  return { hours, mins, secs, totalMs: remaining, done: remaining === 0 };
}

// ─── Status config ─────────────────────────────────────────────────────────────
const STATUS_STEPS = [
  {
    key: 'Placed',
    label: 'ඇණවුම ලැබිණි',
    en: 'Order Placed',
    icon: Package,
    color: 'emerald'
  },
  {
    key: 'Confirmed',
    label: 'තහවුරු විය',
    en: 'Confirmed',
    icon: CheckCircle2,
    color: 'blue'
  },
  {
    key: 'Processing',
    label: 'ඇසුරුම් කෙරේ',
    en: 'Packing',
    icon: Package,
    color: 'amber'
  },
  {
    key: 'Shipped',
    label: 'ගෙදරට එනවා!',
    en: 'Out for Delivery',
    icon: Truck,
    color: 'orange'
  },
  {
    key: 'Delivered',
    label: 'භාරදෙන ලදී',
    en: 'Delivered ✓',
    icon: CheckCircle2,
    color: 'emerald'
  }
];

const STATUS_COLOR = {
  Placed:     { badge: 'bg-slate-100 text-slate-700',   dot: 'bg-slate-500' },
  Confirmed:  { badge: 'bg-blue-100 text-blue-700',     dot: 'bg-blue-500' },
  Processing: { badge: 'bg-amber-100 text-amber-700',   dot: 'bg-amber-500' },
  Shipped:    { badge: 'bg-orange-100 text-orange-700', dot: 'bg-orange-500' },
  Delivered:  { badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  Pending:    { badge: 'bg-slate-100 text-slate-500',   dot: 'bg-slate-400' },
  Cancelled:  { badge: 'bg-red-100 text-red-700',       dot: 'bg-red-500' }
};

// ─── Animated Delivery Bar (when Shipped) ──────────────────────────────────────
function DeliveryCountdownBanner({ estimatedDeliveryAt, city }) {
  const countdown = useCountdown(estimatedDeliveryAt);

  if (!estimatedDeliveryAt) return null;

  const isDone = countdown?.done;
  const hours = countdown?.hours ?? 0;
  const mins = countdown?.mins ?? '--';
  const secs = countdown?.secs ?? '--';

  // Format real-time ETA message
  let etaSinhalaText = '';
  if (hours > 0) {
    etaSinhalaText = `තව පැය ${hours} මිනිත්තු ${mins} කින් ලැබෙනවා!`;
  } else {
    etaSinhalaText = `තව මිනිත්තු ${mins} කින් ලැබෙනවා!`;
  }

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-500 p-4 text-white shadow-lg shadow-orange-500/30">
      {/* Animated shimmer */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_2.5s_infinite] -translate-x-full" 
           style={{ animation: 'shimmer 2.5s infinite' }} />

      {/* Truck road animation */}
      <div className="flex items-start gap-3 mb-3 relative z-10">
        <div className="flex-shrink-0">
          {isDone ? (
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
              <CheckCircle2 className="w-7 h-7 text-white" />
            </div>
          ) : (
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
              <Truck className="w-7 h-7 text-white animate-[bounce_1.2s_ease-in-out_infinite]" />
            </div>
          )}
        </div>
        <div>
          <p className="font-black text-base leading-tight">
            {isDone ? '🎉 ඇණවුම ළඟා වෙලා!' : `🚚 ${etaSinhalaText}`}
          </p>
          <p className="text-xs text-white/90 mt-0.5">
            {isDone
              ? 'Your order should be arriving any moment now!'
              : `Delivering to ${city || 'your doorstep'} (${hours > 0 ? `${hours} hrs ${mins} mins` : `${mins} mins`} remaining)`}
          </p>
        </div>
      </div>

      {!isDone && (
        <>
          {/* ETA countdown blocks */}
          <div className="flex items-center gap-2 relative z-10">
            <div className="flex items-center gap-1.5 bg-white/20 rounded-xl px-3 py-2">
              <Timer className="w-4 h-4 text-white" />
              <span className="text-xs font-bold text-white">ETA:</span>
            </div>

            <div className="flex items-center gap-1">
              {hours > 0 && (
                <>
                  <div className="bg-white/25 rounded-xl px-3 py-2 text-center min-w-[2.8rem]">
                    <p className="text-xl font-black leading-none">{String(hours).padStart(2, '0')}</p>
                    <p className="text-[10px] text-white/80 font-semibold">hr</p>
                  </div>
                  <span className="text-xl font-black">:</span>
                </>
              )}
              <div className="bg-white/25 rounded-xl px-3 py-2 text-center min-w-[2.8rem]">
                <p className="text-xl font-black leading-none">{String(mins).padStart(2, '0')}</p>
                <p className="text-[10px] text-white/80 font-semibold">min</p>
              </div>
              <span className="text-xl font-black">:</span>
              <div className="bg-white/25 rounded-xl px-3 py-2 text-center min-w-[2.8rem]">
                <p className="text-xl font-black leading-none">{String(secs).padStart(2, '0')}</p>
                <p className="text-[10px] text-white/80 font-semibold">sec</p>
              </div>
            </div>

            <span className="text-xs text-white/90 font-bold ml-auto bg-black/10 px-2.5 py-1 rounded-lg">
              {city} Region
            </span>
          </div>

          {/* Progress road */}
          <div className="mt-3 relative z-10">
            <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white/80 rounded-full transition-all duration-1000"
                style={{
                  width: `${Math.max(5, 100 - (countdown?.totalMs / (180 * 60 * 1000)) * 100)}%`
                }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-white/80 mt-1 font-semibold">
              <span>🏪 Store Dispatch</span>
              <span>🏠 {city || 'Customer Address'}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Live Status Badge ─────────────────────────────────────────────────────────
function LiveBadge() {
  return (
    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 border border-red-200 text-red-600 text-[10px] font-bold">
      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping absolute" />
      <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
      LIVE
    </span>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────────
export const TrackOrderModal = () => {
  const { isTrackModalOpen, setIsTrackModalOpen, lastOrder, formatLKR } = useShop();

  const [searchId, setSearchId]     = useState(lastOrder?.id || '');
  const [orderData, setOrderData]   = useState(null);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');
  const [isLive, setIsLive]         = useState(false);
  const [lastRefresh, setLastRefresh] = useState(null);

  const sseRef       = useRef(null);
  const trackedIdRef = useRef(null);

  // ── SSE connection ─────────────────────────────────────────────────────────
  const connectSSE = useCallback((orderId) => {
    // Close previous connection
    if (sseRef.current) { sseRef.current.close(); sseRef.current = null; }

    const source = new EventSource(`/api/orders/${encodeURIComponent(orderId)}/live`);
    sseRef.current = source;

    source.onmessage = (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.error) {
          setError('ඇණවුම සොයාගත නොහැක.');
          setOrderData(null);
          setIsLive(false);
        } else {
          setOrderData(data);
          setIsLive(true);
          setError('');
          setLastRefresh(new Date());
        }
      } catch (_) {}
    };

    source.onerror = () => {
      setIsLive(false);
      // SSE failed — fall back to 30s polling
      source.close();
      sseRef.current = null;
    };
  }, []);

  // ── Manual search ──────────────────────────────────────────────────────────
  const handleSearch = async (e) => {
    e?.preventDefault();
    const id = searchId.trim();
    if (!id) return;

    setLoading(true);
    setError('');
    setOrderData(null);
    setIsLive(false);

    try {
      const res = await fetch(`/api/orders/${id}`);
      if (!res.ok) throw new Error('ඇණවුම සොයාගත නොහැක. Order ID නිවැරදිදැයි බලන්න.');
      const data = await res.json();
      setOrderData(data);
      setLastRefresh(new Date());
      trackedIdRef.current = data.id;
      // Connect SSE for live updates
      connectSSE(data.id);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Auto-load last order ───────────────────────────────────────────────────
  useEffect(() => {
    if (isTrackModalOpen && lastOrder?.id && !orderData) {
      setSearchId(lastOrder.id);
      setOrderData(lastOrder);
      trackedIdRef.current = lastOrder.id;
      connectSSE(lastOrder.id);
    }
  }, [isTrackModalOpen]);

  // ── 30s polling fallback (when SSE is not live) ────────────────────────────
  useEffect(() => {
    if (!isTrackModalOpen || !orderData || isLive) return;
    const poll = setInterval(async () => {
      try {
        const res = await fetch(`/api/orders/${orderData.id}`);
        if (res.ok) { setOrderData(await res.json()); setLastRefresh(new Date()); }
      } catch (_) {}
    }, 30000);
    return () => clearInterval(poll);
  }, [isTrackModalOpen, orderData?.id, isLive]);

  // ── Cleanup SSE on close ───────────────────────────────────────────────────
  useEffect(() => {
    if (!isTrackModalOpen) {
      sseRef.current?.close();
      sseRef.current = null;
      setIsLive(false);
    }
  }, [isTrackModalOpen]);

  if (!isTrackModalOpen) return null;

  const currentStepIdx = orderData
    ? STATUS_STEPS.findIndex(s => s.key === orderData.status)
    : -1;

  const badgeStyle = orderData ? (STATUS_COLOR[orderData.status] || STATUS_COLOR.Pending) : null;
  const isShipped  = orderData?.status === 'Shipped';
  const isDelivered = orderData?.status === 'Delivered';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-100 overflow-hidden relative"
        onClick={e => e.stopPropagation()}
      >

        {/* ── Header ── */}
        <div className={`p-5 border-b border-slate-100 flex items-center justify-between transition-colors duration-500 ${
          isShipped ? 'bg-gradient-to-r from-orange-50 to-amber-50' :
          isDelivered ? 'bg-gradient-to-r from-emerald-50 to-teal-50' : 'bg-slate-50'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
              isShipped ? 'bg-orange-100 text-orange-600' :
              isDelivered ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'
            }`}>
              {isShipped
                ? <Truck className="w-5 h-5 animate-[bounce_1s_ease-in-out_infinite]" />
                : isDelivered
                ? <CheckCircle2 className="w-5 h-5" />
                : <Truck className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-black text-slate-800 text-base">ඇණවුම් Tracking</h3>
              <p className="text-[11px] text-slate-500 flex items-center gap-1">
                Real-time order status
                {isLive && (
                  <span className="relative flex items-center gap-1 ml-1">
                    <LiveBadge />
                  </span>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Manual refresh */}
            {orderData && (
              <button
                onClick={handleSearch}
                disabled={loading}
                title="Refresh"
                className="p-2 text-slate-400 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            )}
            <button
              onClick={() => setIsTrackModalOpen(false)}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ── Search Box ── */}
        <div className="p-5 border-b border-slate-100 bg-white">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Order ID (e.g. ORD-7821) හෝ Phone Number"
                value={searchId}
                onChange={e => setSearchId(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:border-orange-500 focus:ring-2 focus:ring-orange-500/10 outline-none uppercase transition"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 disabled:bg-orange-300 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5" />}
              {loading ? 'සොයමින්...' : 'Track'}
            </button>
          </form>

          {/* Quick chip for last order */}
          {lastOrder && (
            <div className="mt-2 flex items-center gap-2 text-xs">
              <span className="text-slate-400">ඔබගේ ඇණවුම:</span>
              <button
                type="button"
                onClick={() => {
                  setSearchId(lastOrder.id);
                  handleSearch();
                }}
                className="font-mono font-bold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-2.5 py-1 rounded-lg border border-orange-100 transition-colors flex items-center gap-1"
              >
                {lastOrder.id}
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>

        {/* ── Body ── */}
        <div className="p-5 max-h-[62vh] overflow-y-auto space-y-5">

          {/* Error */}
          {error && (
            <div className="p-4 bg-red-50 text-red-600 text-xs rounded-2xl flex items-center gap-2 border border-red-200">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {orderData ? (
            <div className="space-y-5">

              {/* ── Order summary card ── */}
              <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
                isShipped
                  ? 'bg-orange-50/80 border-orange-200'
                  : isDelivered
                  ? 'bg-emerald-50/80 border-emerald-200'
                  : 'bg-slate-50 border-slate-200'
              }`}>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                    Order #{orderData.id}
                  </span>
                  <h4 className="text-sm font-black text-slate-900 mt-0.5">
                    {orderData.customer?.name}
                  </h4>
                  <div className="flex items-center gap-1 mt-0.5 text-[11px] text-slate-500">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span>{orderData.customer?.city}</span>
                    <span className="text-slate-300">•</span>
                    <span>{orderData.customer?.phone}</span>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${badgeStyle?.badge}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${badgeStyle?.dot} ${isShipped ? 'animate-ping' : ''}`} />
                    {orderData.status}
                  </span>
                  <p className="text-xs font-black text-slate-800 mt-1.5">
                    {formatLKR(orderData.total)}
                  </p>
                  {lastRefresh && (
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Updated {lastRefresh.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </p>
                  )}
                </div>
              </div>

              {/* ── Live Delivery Countdown Banner ── */}
              {isShipped && (
                <DeliveryCountdownBanner
                  estimatedDeliveryAt={orderData.estimatedDeliveryAt}
                  city={orderData.customer?.city}
                />
              )}

              {/* ── Delivered celebration ── */}
              {isDelivered && (
                <div className="rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-4 text-white text-center shadow-lg shadow-emerald-500/25">
                  <div className="text-3xl mb-1">🎉</div>
                  <p className="font-black text-base">ඇණවුම ලැබිලා!  (Delivered!)</p>
                  <p className="text-xs text-white/80 mt-0.5">Thank you for shopping at Ape බඩු කඩේ</p>
                </div>
              )}

              {/* ── Step tracker ── */}
              <div>
                <h4 className="text-xs font-black text-slate-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-orange-500" />
                  ප්‍රගතිය (Live Steps)
                  {isLive && (
                    <span className="ml-auto text-[10px] text-emerald-600 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                      Auto-updating
                    </span>
                  )}
                </h4>

                <div className="space-y-0">
                  {STATUS_STEPS.map((step, idx) => {
                    const isDone    = idx <= currentStepIdx;
                    const isCurrent = idx === currentStepIdx;
                    const Icon      = step.icon;
                    const isLast    = idx === STATUS_STEPS.length - 1;

                    return (
                      <div key={step.key} className="flex items-stretch gap-3">
                        {/* Left: connector + dot */}
                        <div className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 ${
                            isDone
                              ? isCurrent && isShipped
                                ? 'bg-orange-500 text-white ring-4 ring-orange-200'
                                : isCurrent
                                ? 'bg-emerald-500 text-white ring-4 ring-emerald-200'
                                : 'bg-emerald-500 text-white'
                              : 'bg-slate-100 text-slate-400'
                          } ${isCurrent ? 'animate-pulse' : ''}`}>
                            {isDone
                              ? isCurrent
                                ? <Icon className="w-4 h-4" />
                                : <CheckCircle2 className="w-4 h-4" />
                              : <span className="text-[11px] font-bold">{idx + 1}</span>
                            }
                          </div>
                          {!isLast && (
                            <div className={`w-0.5 flex-1 my-1 min-h-[1.5rem] transition-colors duration-500 ${
                              idx < currentStepIdx ? 'bg-emerald-400' : 'bg-slate-200'
                            }`} />
                          )}
                        </div>

                        {/* Right: text */}
                        <div className={`pb-4 ${isLast ? 'pb-0' : ''}`}>
                          <p className={`text-xs font-bold transition-colors ${isDone ? 'text-slate-900' : 'text-slate-400'}`}>
                            {step.label}
                            <span className="ml-1 font-normal text-slate-400">({step.en})</span>
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            {orderData.timeline?.[idx]?.time || (isDone ? '—' : 'Pending')}
                          </p>
                          {isCurrent && isShipped && orderData.estimatedDeliveryAt && (
                            <span className="mt-1 inline-block px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 text-[10px] font-bold">
                              🚚 On the way!
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* ── Items list ── */}
              <div className="border border-slate-100 rounded-2xl overflow-hidden">
                <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-100">
                  <h5 className="text-[11px] font-black text-slate-600 uppercase tracking-wider">
                    ඇණවුම් කළ භාණ්ඩ ({orderData.items?.length})
                  </h5>
                </div>
                <div className="divide-y divide-slate-50">
                  {orderData.items?.map((item, i) => (
                    <div key={i} className="px-4 py-2.5 flex justify-between items-center text-xs text-slate-700">
                      <span className="font-medium">{item.name} <span className="text-slate-400">× {item.quantity}</span></span>
                      <span className="font-bold">{formatLKR(item.price * item.quantity)}</span>
                    </div>
                  ))}
                  <div className="px-4 py-2.5 flex justify-between items-center text-xs bg-slate-50 font-black text-slate-900">
                    <span>Total</span>
                    <span className="text-orange-600">{formatLKR(orderData.total)}</span>
                  </div>
                </div>
              </div>

              {/* ── Support Banner ── */}
              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between text-xs text-slate-600 border border-slate-200">
                <span className="flex items-center gap-1.5">
                  <PhoneCall className="w-3.5 h-3.5 text-orange-600" />
                  ගැටලුවක්ද? අමතන්න:
                </span>
                <a href="tel:+94112345678" className="font-bold text-slate-900 hover:text-orange-600 transition-colors">
                  011 234 5678
                </a>
              </div>

            </div>
          ) : !error && (
            <div className="py-14 text-center text-slate-400 space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-orange-50 flex items-center justify-center mx-auto">
                <Truck className="w-8 h-8 stroke-[1.2] text-orange-300" />
              </div>
              <p className="text-sm font-semibold text-slate-600">ඔබගේ ඇණවුම Tracking කරන්න</p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Order ID හෝ Phone Number ඇතුළත් කර <strong>Track</strong> button click කරන්න. 
                Status update වෙද්දී <span className="text-red-500 font-bold">LIVE</span> ලෙස දිස්වෙනවා!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Shimmer keyframes injected globally */}
      <style>{`
        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
};
