import React, { useState } from 'react';
import { 
  CreditCard, 
  ShieldCheck, 
  Lock, 
  CheckCircle, 
  Banknote, 
  QrCode, 
  Building,
  Sparkles,
  HelpCircle
} from 'lucide-react';

export const PaymentGateway = ({
  paymentMethod,
  setPaymentMethod,
  cardData,
  setCardData,
  isProcessing,
  totalAmount,
  formatLKR,
  bankDetails
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [copiedAcc, setCopiedAcc] = useState(false);

  // Format card number with spaces (#### #### #### ####)
  const handleCardNumberChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 16);
    let formatted = val.match(/.{1,4}/g)?.join(' ') || val;
    setCardData(prev => ({ ...prev, cardNumber: formatted }));
  };

  // Format Expiry MM/YY
  const handleExpiryChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 4);
    if (val.length >= 3) {
      val = `${val.substring(0, 2)}/${val.substring(2, 4)}`;
    }
    setCardData(prev => ({ ...prev, expiry: val }));
  };

  // Format CVV
  const handleCvvChange = (e) => {
    let val = e.target.value.replace(/\D/g, '').substring(0, 4);
    setCardData(prev => ({ ...prev, cvv: val }));
  };

  // Quick autofill demo cards
  const fillDemoCard = (type = 'visa') => {
    if (type === 'visa') {
      setCardData({
        cardNumber: '4242 4242 4242 4242',
        cardName: 'SUNIL PERERA',
        expiry: '12/28',
        cvv: '891'
      });
    } else {
      setCardData({
        cardNumber: '5555 4444 3333 2222',
        cardName: 'ANURA SILVA',
        expiry: '09/27',
        cvv: '456'
      });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Payment Method Selector Tabs */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2.5">
          ගෙවීම් ක්‍රමය තෝරන්න (Select Payment Method)
        </label>
        <div className="grid grid-cols-3 gap-2.5">
          
          {/* Card Option */}
          <button
            type="button"
            onClick={() => setPaymentMethod('card')}
            className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
              paymentMethod === 'card'
                ? 'bg-orange-50 border-orange-500 text-orange-700 shadow-md ring-2 ring-orange-500/20'
                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            <CreditCard className="w-5 h-5" />
            <span className="text-xs font-bold">Credit/Debit Card</span>
            <span className="text-[10px] text-slate-400">Visa / Mastercard</span>
          </button>

          {/* Cash on Delivery Option */}
          <button
            type="button"
            onClick={() => setPaymentMethod('cod')}
            className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
              paymentMethod === 'cod'
                ? 'bg-orange-50 border-orange-500 text-orange-700 shadow-md ring-2 ring-orange-500/20'
                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            <Banknote className="w-5 h-5 text-emerald-600" />
            <span className="text-xs font-bold">Cash on Delivery</span>
            <span className="text-[10px] text-slate-400">භාණ්ඩ ලැබුණු පසු</span>
          </button>

          {/* Bank Transfer / QR */}
          <button
            type="button"
            onClick={() => setPaymentMethod('bank')}
            className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
              paymentMethod === 'bank'
                ? 'bg-orange-50 border-orange-500 text-orange-700 shadow-md ring-2 ring-orange-500/20'
                : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            <QrCode className="w-5 h-5 text-blue-600" />
            <span className="text-xs font-bold">Bank Transfer / QR</span>
            <span className="text-[10px] text-slate-400">Direct Deposit</span>
          </button>

        </div>
      </div>

      {/* CARD PAYMENT DETAILS FORM */}
      {paymentMethod === 'card' && (
        <div className="space-y-4">
          
          {/* Interactive Card Preview */}
          <div className="perspective-1000 w-full max-w-sm mx-auto">
            <div 
              className={`relative h-48 w-full rounded-2xl shadow-xl transition-all duration-500 preserve-3d p-6 text-white overflow-hidden ${
                isFlipped ? 'rotate-y-180' : ''
              } bg-gradient-to-tr from-slate-900 via-orange-950 to-orange-700 border border-white/20`}
            >
              {/* Background ambient pattern */}
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-orange-500/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-amber-500/20 rounded-full blur-xl" />

              {!isFlipped ? (
                /* Card Front */
                <div className="flex flex-col justify-between h-full relative z-10">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-7 rounded-md bg-amber-300/80 border border-amber-200/50 flex items-center justify-center shadow-inner">
                        <div className="w-7 h-5 border-y border-amber-600/30 flex justify-around">
                          <div className="w-px h-full bg-amber-600/30" />
                          <div className="w-px h-full bg-amber-600/30" />
                        </div>
                      </div>
                      <span className="text-[11px] font-mono tracking-widest text-slate-300">DEBIT / CREDIT</span>
                    </div>
                    <div className="text-right">
                      <span className="font-black italic text-lg tracking-wider bg-gradient-to-r from-white to-amber-200 bg-clip-text text-transparent">
                        Ape Pay
                      </span>
                    </div>
                  </div>

                  {/* Card Number */}
                  <div className="my-2">
                    <div className="font-mono text-lg sm:text-xl tracking-[0.2em] font-bold text-white drop-shadow">
                      {cardData.cardNumber || '•••• •••• •••• ••••'}
                    </div>
                  </div>

                  {/* Cardholder & Expiry */}
                  <div className="flex justify-between items-end">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-slate-300 block">CARDHOLDER</span>
                      <span className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                        {cardData.cardName || 'YOUR NAME'}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] uppercase tracking-wider text-slate-300 block">EXPIRES</span>
                      <span className="font-mono text-xs font-bold text-white">
                        {cardData.expiry || 'MM/YY'}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Card Back (CVV) */
                <div className="flex flex-col justify-between h-full relative z-10 rotate-y-180">
                  <div className="h-9 bg-slate-800 -mx-6 -mt-2" />
                  <div className="my-2">
                    <span className="text-[9px] text-slate-300 block mb-1">CVV / CVC</span>
                    <div className="h-8 bg-white rounded flex items-center justify-end px-3">
                      <span className="font-mono text-slate-900 font-bold tracking-widest">
                        {cardData.cvv || '•••'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[9px] text-slate-300">
                    <span>Authorized Signature</span>
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Demo Fill Buttons */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-500">Demo Card ඉක්මනින් පිරවීමට:</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => fillDemoCard('visa')}
                className="text-[11px] font-semibold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-2.5 py-1 rounded-md transition-colors"
              >
                + Fill Demo Visa
              </button>
            </div>
          </div>

          {/* Input Fields following modern-web autofill guidelines */}
          <div className="space-y-3">
            <div>
              <label htmlFor="cc-name" className="block text-xs font-semibold text-slate-700 mb-1">
                කාඩ්පතේ නම (Name on Card)
              </label>
              <input
                id="cc-name"
                name="cc-name"
                type="text"
                autoComplete="cc-name"
                placeholder="e.g. SUNIL PERERA"
                value={cardData.cardName}
                onFocus={() => setIsFlipped(false)}
                onChange={(e) => setCardData(prev => ({ ...prev, cardName: e.target.value.toUpperCase() }))}
                className="w-full px-3.5 py-2.5 text-xs font-medium rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none"
                required
              />
            </div>

            <div>
              <label htmlFor="cc-number" className="block text-xs font-semibold text-slate-700 mb-1">
                කාඩ්පත් අංකය (Card Number)
              </label>
              <input
                id="cc-number"
                name="cc-number"
                type="text"
                autoComplete="cc-number"
                inputMode="numeric"
                maxLength="19"
                placeholder="4242 4242 4242 4242"
                value={cardData.cardNumber}
                onFocus={() => setIsFlipped(false)}
                onChange={handleCardNumberChange}
                className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none tracking-wider"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="cc-exp" className="block text-xs font-semibold text-slate-700 mb-1">
                  කල් ඉකුත්වීම (Expiry MM/YY)
                </label>
                <input
                  id="cc-exp"
                  name="cc-exp"
                  type="text"
                  autoComplete="cc-exp"
                  maxLength="5"
                  placeholder="MM/YY"
                  value={cardData.expiry}
                  onFocus={() => setIsFlipped(false)}
                  onChange={handleExpiryChange}
                  className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none"
                  required
                />
              </div>

              <div>
                <label htmlFor="cc-csc" className="block text-xs font-semibold text-slate-700 mb-1">
                  CVV / CVC (රහස් අංකය)
                </label>
                <input
                  id="cc-csc"
                  name="cc-csc"
                  type="text"
                  autoComplete="cc-csc"
                  inputMode="numeric"
                  maxLength="4"
                  placeholder="123"
                  value={cardData.cvv}
                  onFocus={() => setIsFlipped(true)}
                  onBlur={() => setIsFlipped(false)}
                  onChange={handleCvvChange}
                  className="w-full px-3.5 py-2.5 text-xs font-mono rounded-xl border border-slate-200 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none"
                  required
                />
              </div>
            </div>
          </div>

          {/* Security Guarantee */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2.5 text-[11px] text-slate-600">
            <Lock className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>
              256-bit SSL End-to-End Encryption මගින් ඔබේ ගෙවීම් ආරක්ෂිතව සිදු කෙරේ.
            </span>
          </div>

        </div>
      )}

      {/* CASH ON DELIVERY DETAILS */}
      {paymentMethod === 'cod' && (
        <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
              <Banknote className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-emerald-950 text-sm">Cash on Delivery (භාණ්ඩ ලැබුණු පසු)</h4>
              <p className="text-xs text-emerald-800">
                ඇණවුම ඔබේ දොරකඩට ලැබුණු පසු Delivery නියෝජිතයාට මුදල් ගෙවන්න.
              </p>
            </div>
          </div>
          <div className="p-3 bg-white/80 rounded-xl text-xs text-slate-700 space-y-1">
            <p className="flex items-center gap-1.5 font-semibold text-emerald-900">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              අමතර කිසිදු ගාස්තුවක් අය නොකෙරේ.
            </p>
            <p className="text-[11px] text-slate-500">
              කරුණාකර ගෙවීමට අවශ්‍ය මුළු මුදල ({formatLKR(totalAmount)}) සූදානම් කර තබාගන්න.
            </p>
          </div>
        </div>
      )}

      {/* BANK TRANSFER / QR */}
      {paymentMethod === 'bank' && (
        <div className="p-4 bg-blue-50/80 border border-blue-200 rounded-2xl space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-blue-950 text-sm">බැංකු තැන්පතු / Online Banking Transfer / LANKAQR</h4>
              <p className="text-xs text-blue-800">
                පහත බැංකු ගිණුමට {formatLKR(totalAmount)} මුදල තැන්පත් කර රිසිට්පත ළඟ තබාගන්න.
              </p>
            </div>
          </div>

          <div className="p-3.5 bg-white rounded-xl text-xs space-y-2 border border-blue-100 font-mono shadow-2xs">
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Bank Name:</span>
              <span className="font-bold text-slate-800">{bankDetails?.bankName || 'Commercial Bank PLC'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Account Name:</span>
              <span className="font-bold text-slate-800">{bankDetails?.accountName || 'APE BADU KADE (PVT) LTD'}</span>
            </div>
            <div className="flex justify-between items-center py-1 bg-orange-50/50 px-2 rounded-lg border border-orange-100">
              <span className="text-slate-600 font-bold">Account Number:</span>
              <div className="flex items-center gap-2">
                <span className="font-black text-orange-600 text-sm">{bankDetails?.accountNo || '8012 3456 7890'}</span>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(bankDetails?.accountNo || '8012 3456 7890');
                    setCopiedAcc(true);
                    setTimeout(() => setCopiedAcc(false), 2000);
                  }}
                  className="px-2 py-0.5 text-[10px] font-bold bg-white text-orange-700 rounded border border-orange-200 hover:bg-orange-100 transition"
                >
                  {copiedAcc ? 'Copied! ✓' : 'Copy'}
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-500">Branch:</span>
              <span className="font-bold text-slate-800">{bankDetails?.branch || 'Colombo City Branch'}</span>
            </div>
            {bankDetails?.swiftCode && (
              <div className="flex justify-between items-center">
                <span className="text-slate-500">SWIFT Code:</span>
                <span className="font-bold text-slate-700">{bankDetails.swiftCode}</span>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
