import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { PaymentGateway } from './PaymentGateway';
import confetti from 'canvas-confetti';
import { 
  X, 
  MapPin, 
  CreditCard, 
  ArrowLeft, 
  ShieldCheck, 
  Loader2, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

export const CheckoutModal = () => {
  const {
    cart,
    cartSubtotal,
    deliveryFee,
    discountAmount,
    autoDiscount,
    totalDiscountAmount,
    selectedCity,
    setSelectedCity,
    CITY_DELIVERY_FEES,
    cartTotal,
    isCheckoutOpen,
    setIsCheckoutOpen,
    setIsOrderSuccessOpen,
    setLastOrder,
    clearCart,
    formatLKR,
    fetchProducts
  } = useShop();

  const [step, setStep] = useState(1); // 1 = Details, 2 = Payment
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Structured Customer delivery details
  const [customer, setCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    houseNo: '',
    street: '',
    town: '',
    city: selectedCity || 'Colombo',
    postalCode: '',
    notes: ''
  });

  // Configurable Bank Details for direct deposit / QR
  const bankDetails = {
    bankName: 'Commercial Bank of Ceylon PLC',
    accountName: 'APE BADU KADE (PVT) LTD',
    accountNo: '8012 3456 7890',
    branch: 'Colombo City Main Branch',
    swiftCode: 'CCEYLKLX'
  };

  // Payment details
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardData, setCardData] = useState({
    cardNumber: '4242 4242 4242 4242',
    cardName: 'SUNIL PERERA',
    expiry: '12/28',
    cvv: '891'
  });

  if (!isCheckoutOpen) return null;

  const handleCityChange = (newCity) => {
    setCustomer(prev => ({ ...prev, city: newCity }));
    setSelectedCity(newCity);
  };

  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    if (!customer.name.trim() || !customer.phone.trim() || !customer.houseNo.trim() || !customer.street.trim() || !customer.town.trim()) {
      setErrorMsg('කරුණාකර නම, දුරකථන අංකය, නිවාස අංකය, පාර සහ නගරය/ප්‍රදේශය ඇතුළත් කරන්න.');
      return;
    }
    setErrorMsg('');
    setStep(2);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsProcessing(true);

    if (paymentMethod === 'card') {
      setProcessingStatus('ගෙවීම් දොරටුව හා සම්බන්ධ වෙමින්... (Connecting to Ape Pay Gateway)');
      await new Promise(r => setTimeout(r, 1200));
      setProcessingStatus('කාඩ්පත් තොරතුරු තහවුරු කරමින්... (Verifying Card & 3D Secure)');
      await new Promise(r => setTimeout(r, 1200));
      setProcessingStatus('ගෙවීම් සාර්ථකයි! ඇණවුම තහවුරු කෙරේ... (Payment Approved)');
      await new Promise(r => setTimeout(r, 800));
    } else {
      setProcessingStatus('ඇණවුම සටහන් කරමින්... (Placing your Order)');
      await new Promise(r => setTimeout(r, 1000));
    }

    try {
      const fullAddress = `${customer.houseNo}, ${customer.street}, ${customer.town}`;

      const payload = {
        customer: {
          ...customer,
          address: fullAddress
        },
        items: cart,
        subtotal: cartSubtotal,
        discount: totalDiscountAmount || discountAmount,
        deliveryFee,
        total: cartTotal,
        paymentMethod,
        paymentDetails: {
          method: paymentMethod,
          cardLast4: paymentMethod === 'card' ? cardData.cardNumber.slice(-4) : null,
          status: paymentMethod === 'card' ? 'Paid' : 'Pending',
          transactionId: `TXN-${Math.floor(100000 + Math.random() * 900000)}`
        }
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error('Failed to place order');
      }

      const data = await res.json();
      
      // Trigger festive confetti
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      setLastOrder(data.order);
      clearCart();
      setIsCheckoutOpen(false);
      setIsOrderSuccessOpen(true);
      fetchProducts(); // Refresh stock
    } catch (err) {
      console.error(err);
      setErrorMsg('ඇණවුම යැවීමේදී දෝෂයක් සිදුවිය. කරුණාකර නැවත උත්සාහ කරන්න.');
    } finally {
      setIsProcessing(false);
      setProcessingStatus('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Processing Overlay */}
        {isProcessing && (
          <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-4">
              <Loader2 className="w-8 h-8 text-orange-600 animate-spin" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">
              කරුණාකර රැඳී සිටින්න
            </h3>
            <p className="text-sm font-semibold text-orange-600 animate-pulse">
              {processingStatus}
            </p>
            <p className="text-xs text-slate-400 mt-3">
              ආරක්ෂිත ගෙවීම් පද්ධතිය මගින් ගනුදෙනුව තහවුරු කරනු ලැබේ.
            </p>
          </div>
        )}

        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            {step === 2 && (
              <button
                onClick={() => setStep(1)}
                className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition-colors mr-1"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <div>
              <h2 className="text-lg font-black text-slate-900">
                {step === 1 ? 'භාණ්ඩ ලබාගන්නා තොරතුරු (Delivery)' : 'මුදල් ගෙවීම (Payment Gateway)'}
              </h2>
              <p className="text-xs text-slate-500">
                පියවර {step} / 2 • Total: <strong className="text-orange-600">{formatLKR(cartTotal)}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-600">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Body */}
        <div className="p-4 sm:p-6 max-h-[75vh] overflow-y-auto">
          
          {/* STEP 1: Delivery Details */}
          {step === 1 && (
            <form onSubmit={handleDetailsSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  ඔබගේ සම්පූර්ණ නම (Full Name) *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Kamal Perera"
                  required
                  value={customer.name}
                  onChange={(e) => setCustomer(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3.5 py-2.5 text-xs font-medium rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    දුරකථන අංකය (Phone Number) *
                  </label>
                  <input
                    type="tel"
                    placeholder="077 123 4567"
                    required
                    value={customer.phone}
                    onChange={(e) => setCustomer(prev => ({ ...prev, phone: e.target.value }))}
                    className="w-full px-3.5 py-2.5 text-xs font-medium rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ඊමේල් ලිපිනය (Email - Optional)
                  </label>
                  <input
                    type="email"
                    placeholder="kamal@gmail.com"
                    value={customer.email}
                    onChange={(e) => setCustomer(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-3.5 py-2.5 text-xs font-medium rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none"
                  />
                </div>
              </div>

              {/* Structured Address Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    නිවාස / ගොඩනැගිලි අංකය (House / Building No.) *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. No. 45 / Flat 3B"
                    required
                    value={customer.houseNo}
                    onChange={(e) => setCustomer(prev => ({ ...prev, houseNo: e.target.value }))}
                    className="w-full px-3.5 py-2.5 text-xs font-medium rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    පාර / විථිය (Street Name) *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Temple Road"
                    required
                    value={customer.street}
                    onChange={(e) => setCustomer(prev => ({ ...prev, street: e.target.value }))}
                    className="w-full px-3.5 py-2.5 text-xs font-medium rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ප්‍රදේශය / ගම (Town / Area) *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Nugegoda / Kohuwala"
                    required
                    value={customer.town}
                    onChange={(e) => setCustomer(prev => ({ ...prev, town: e.target.value }))}
                    className="w-full px-3.5 py-2.5 text-xs font-medium rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    නගරය / දිස්ත්‍රික්කය (City / District) *
                  </label>
                  <select
                    value={customer.city}
                    onChange={(e) => handleCityChange(e.target.value)}
                    className="w-full px-3 py-2.5 text-xs font-bold rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none bg-white text-slate-800"
                  >
                    {Object.keys(CITY_DELIVERY_FEES).map(city => (
                      <option key={city} value={city}>
                        {city} (ඩිලිවරි: {CITY_DELIVERY_FEES[city] === 0 ? 'Free' : `රු. ${CITY_DELIVERY_FEES[city]}`})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  විශේෂ සටහන් (Delivery Notes - Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. උදෑසන 10 ට පෙර භාරදෙන්න."
                  value={customer.notes}
                  onChange={(e) => setCustomer(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-3.5 py-2 text-xs font-medium rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none"
                />
              </div>

              {/* Submit to Step 2 */}
              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-orange-500/25 transition-all"
                >
                  ගෙවීම් පියවර වෙත ඉදිරියට (Proceed to Payment)
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Payment Gateway */}
          {step === 2 && (
            <form onSubmit={handlePlaceOrder} className="space-y-6">
              <PaymentGateway
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                cardData={cardData}
                setCardData={setCardData}
                isProcessing={isProcessing}
                totalAmount={cartTotal}
                formatLKR={formatLKR}
                bankDetails={bankDetails}
              />

              {/* Order total confirmation bar */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-500 block">ගෙවිය යුතු මුළු මුදල:</span>
                  <span className="text-base font-black text-slate-900">{formatLKR(cartTotal)}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block">{cart.length} items</span>
                  <span className="text-xs font-bold text-emerald-600">
                    {deliveryFee === 0 ? 'Free Delivery' : `Delivery: ${formatLKR(deliveryFee)}`}
                  </span>
                </div>
              </div>

              {/* Final Confirm Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3.5 px-4 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-black text-sm rounded-2xl shadow-xl shadow-orange-500/30 flex items-center justify-center gap-2 transition-all transform active:scale-95"
              >
                <ShieldCheck className="w-5 h-5 text-amber-200" />
                <span>
                  {paymentMethod === 'card' 
                    ? `කාඩ්පතෙන් ගෙවන්න (${formatLKR(cartTotal)})`
                    : `ඇණවුම තහවුරු කරන්න (${formatLKR(cartTotal)})`}
                </span>
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
