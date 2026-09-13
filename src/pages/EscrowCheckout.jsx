import React, { useState } from 'react';

export default function EscrowCheckout({ 
  cartItems = [], 
  onCancel, 
  onConfirmPayment,
  onNavigate 
}) {
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState('transfer');
  const [isProcessing, setIsProcessing] = useState(false);

  // Delivery State
  const [deliveryInfo, setDeliveryInfo] = useState({
    fullName: '',
    phone: '',
    address: '',
    hub: 'Lagos Hub (Ikeja / Lekki Inspection Center)'
  });

  // Bank Transfer Proof State
  const [paymentProof, setPaymentProof] = useState({
    senderBank: '',
    senderAccountName: '',
    transactionReference: ''
  });

  // Robust Price & Quantity Parsers (Handles strings with commas, ₦ symbols, and alternative keys)
  const parsePrice = (val) => {
    if (typeof val === 'number') return val;
    if (!val) return 0;
    const cleanStr = String(val).replace(/[₦$,\s]/g, '');
    const parsed = parseFloat(cleanStr);
    return isNaN(parsed) ? 0 : parsed;
  };

  const parseQty = (val) => {
    const parsed = parseInt(val, 10);
    return isNaN(parsed) || parsed < 1 ? 1 : parsed;
  };

  // Safe Cart Items Normalization (Handles arrays, single items, or wrapped objects like { items: [...] })
  let rawItems = cartItems;
  if (cartItems && !Array.isArray(cartItems)) {
    if (Array.isArray(cartItems.items)) rawItems = cartItems.items;
    else if (Array.isArray(cartItems.cart)) rawItems = cartItems.cart;
    else rawItems = [cartItems];
  }
  const safeCartItems = Array.isArray(rawItems) ? rawItems.filter(Boolean) : [rawItems].filter(Boolean);
  
  const itemsSubtotal = safeCartItems.reduce(
    (acc, item) => {
      const p = parsePrice(item?.price ?? item?.amount ?? item?.cost ?? item?.unitPrice ?? 0);
      const q = parseQty(item?.quantity ?? item?.qty ?? 1);
      return acc + (p * q);
    },
    0
  );

  const escrowFee = itemsSubtotal > 0 ? Math.round(itemsSubtotal * 0.015) : 0; 
  const deliveryFee = itemsSubtotal > 0 ? 3500 : 0; 
  const grandTotal = itemsSubtotal + escrowFee + deliveryFee;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDeliveryInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleProofChange = (e) => {
    const { name, value } = e.target;
    setPaymentProof((prev) => ({ ...prev, [name]: value }));
  };

  const handleProceedToPayment = (e) => {
    e.preventDefault();
    if (!deliveryInfo.fullName || !deliveryInfo.phone || !deliveryInfo.address) {
      alert('Please fill in all delivery details to proceed.');
      return;
    }
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinalPaymentSubmit = () => {
    if (grandTotal <= 0) {
      alert('Error: Cart is empty or item price is invalid.');
      return;
    }

    if (paymentMethod === 'transfer' && !paymentProof.transactionReference) {
      alert('Please enter your Bank Transfer Reference or Teller Number as proof of payment.');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onConfirmPayment();
    }, 2000);
  };

  // Guard clause if cart is completely empty or subtotal is 0
  if (safeCartItems.length === 0 || itemsSubtotal <= 0) {
    return (
      <div className="max-w-md mx-auto mt-20 p-8 bg-[#16223F] rounded-2xl border border-slate-800 text-center space-y-4">
        <div className="text-4xl">🛒</div>
        <h2 className="text-lg font-bold text-white">Your Cart is Empty or Price Missing</h2>
        <p className="text-xs text-slate-400">Please select an item with a valid price or add products to your cart before proceeding to the Secure Escrow Checkout.</p>
        <button
          type="button"
          onClick={onCancel}
          className="w-full bg-[#FF5A00] text-white text-xs font-black uppercase py-3 rounded-xl cursor-pointer border-none"
        >
          Return to Marketplace
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 font-sans pb-32">
      
      {/* Header Banner */}
      <div className="bg-[#16223F] p-6 rounded-2xl border border-slate-800 shadow-xl mb-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#FF5A00] text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-md tracking-wider">
              🛡️ Secure Escrow Vault
            </span>
            <span className="text-xs font-mono text-slate-400">Ref: #BOLD-{Math.floor(100000 + Math.random() * 900000)}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
            {step === 1 ? 'Step 1: Delivery & Inspection Hub' : 'Step 2: Secure Escrow Payment & Verification'}
          </h1>
        </div>

        {/* Step Indicator & Exit */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${step === 1 ? 'bg-[#FF5A00] text-white shadow-[0_0_10px_rgba(255,90,0,0.4)]' : 'bg-slate-800 text-slate-400'}`}>
              1
            </div>
            <div className="w-8 h-1 bg-slate-800">
              <div className={`h-full bg-[#FF5A00] transition-all ${step === 2 ? 'w-full' : 'w-0'}`}></div>
            </div>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${step === 2 ? 'bg-[#FF5A00] text-white shadow-[0_0_10px_rgba(255,90,0,0.4)]' : 'bg-slate-800 text-slate-400'}`}>
              2
            </div>
          </div>

          <button
            type="button"
            onClick={onCancel}
            className="bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 text-red-300 text-xs font-bold px-3 py-2 rounded-xl transition-colors cursor-pointer"
          >
            ✕ Exit Checkout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Form Section */}
        <div className="lg:col-span-2 space-y-6">
          {step === 1 ? (
            <form onSubmit={handleProceedToPayment} className="bg-[#16223F] p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
              <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
                📦 Buyer Delivery & Hub Inspection Information
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wide">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="e.g., Chukwuemeka Ebigbo"
                  value={deliveryInfo.fullName}
                  onChange={handleInputChange}
                  className="w-full bg-[#0B132B] text-white px-4 py-3 rounded-xl border border-slate-700 focus:outline-none focus:border-[#FF5A00] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wide">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="e.g., 08012345678"
                  value={deliveryInfo.phone}
                  onChange={handleInputChange}
                  className="w-full bg-[#0B132B] text-white px-4 py-3 rounded-xl border border-slate-700 focus:outline-none focus:border-[#FF5A00] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wide">Delivery Address or Landmark</label>
                <textarea
                  name="address"
                  required
                  rows="3"
                  placeholder="Enter your street address or landmark..."
                  value={deliveryInfo.address}
                  onChange={handleInputChange}
                  className="w-full bg-[#0B132B] text-white px-4 py-3 rounded-xl border border-slate-700 focus:outline-none focus:border-[#FF5A00] text-sm resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5 uppercase tracking-wide">Select Inspection Hub</label>
                <select
                  name="hub"
                  value={deliveryInfo.hub}
                  onChange={handleInputChange}
                  className="w-full bg-[#0B132B] text-white px-4 py-3 rounded-xl border border-slate-700 focus:outline-none focus:border-[#FF5A00] text-sm cursor-pointer"
                >
                  <option value="Lagos Hub">Lagos Hub (Ikeja / Lekki Inspection Center)</option>
                  <option value="Abuja Hub">Abuja Hub (Wuse II Verification Center)</option>
                  <option value="Port Harcourt Hub">Port Harcourt Hub (GRA Logistics Node)</option>
                </select>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={onCancel}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold px-5 py-3 rounded-xl transition-colors cursor-pointer border-none"
                >
                  ← Return to Cart
                </button>
                <button
                  type="submit"
                  className="bg-[#FF5A00] hover:bg-[#e04f00] text-white text-xs font-black uppercase tracking-wider px-6 py-3 rounded-xl transition-all shadow-lg shadow-[#FF5A00]/30 cursor-pointer border-none"
                >
                  Proceed to Payment →
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-[#16223F] p-6 rounded-2xl border border-slate-800 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white">💳 Select Payment & Escrow Method</h3>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-xs text-[#FF5A00] font-bold hover:underline bg-transparent border-none cursor-pointer"
                >
                  ← Edit Delivery Info
                </button>
              </div>

              {/* Payment Tabs */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('transfer')}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    paymentMethod === 'transfer'
                      ? 'bg-[#0B132B] border-[#FF5A00] shadow-[0_0_15px_rgba(255,90,0,0.2)]'
                      : 'bg-[#0B132B]/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="text-lg mb-1">🏦</div>
                  <div className="text-xs font-bold text-white">Direct Bank Transfer</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Verified by Bold Operations</div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'bg-[#0B132B] border-[#FF5A00] shadow-[0_0_15px_rgba(255,90,0,0.2)]'
                      : 'bg-[#0B132B]/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="text-lg mb-1">💳</div>
                  <div className="text-xs font-bold text-white">Instant Card / USSD</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Automated Gateway Lock</div>
                </button>
              </div>

              {paymentMethod === 'transfer' ? (
                <div className="space-y-4">
                  <div className="bg-[#0B132B] p-5 rounded-xl border border-slate-800 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Escrow Bank:</span>
                      <span className="font-bold text-white">Providus Bank / Wema Escrow</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Account Number:</span>
                      <span className="font-mono font-black text-[#FF5A00] text-sm tracking-widest">9948271039</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-400">Account Name:</span>
                      <span className="font-bold text-white">BOLD.NG ESCROW VAULT</span>
                    </div>
                    <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-800">
                      <span className="text-slate-400">Exact Amount to Transfer:</span>
                      <span className="font-mono font-black text-white text-base">₦{grandTotal.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="bg-[#0B132B] p-5 rounded-xl border border-slate-800 space-y-3">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">📝 Submit Transfer Reference for Verification</h4>
                    <p className="text-[11px] text-slate-400">Enter your transfer transaction reference below so the admin team can confirm your payment.</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-300 mb-1 uppercase">Your Bank Name</label>
                        <input
                          type="text"
                          name="senderBank"
                          placeholder="e.g., GTBank"
                          value={paymentProof.senderBank}
                          onChange={handleProofChange}
                          className="w-full bg-[#16223F] text-white px-3 py-2.5 rounded-lg border border-slate-700 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-300 mb-1 uppercase">Transaction Ref / Teller ID</label>
                        <input
                          type="text"
                          name="transactionReference"
                          required
                          placeholder="e.g., Ref 9948201..."
                          value={paymentProof.transactionReference}
                          onChange={handleProofChange}
                          className="w-full bg-[#16223F] text-white px-3 py-2.5 rounded-lg border border-slate-700 text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-[#0B132B] p-5 rounded-xl border border-slate-800 space-y-3">
                  <p className="text-xs text-slate-300">Clicking authorize below will launch the secure gateway to lock funds instantly in escrow.</p>
                </div>
              )}

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold px-5 py-3 rounded-xl transition-colors cursor-pointer border-none"
                >
                  ← Back
                </button>

                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleFinalPaymentSubmit}
                  className="bg-[#FF5A00] hover:bg-[#e04f00] text-white text-xs font-black uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all shadow-lg shadow-[#FF5A00]/30 cursor-pointer border-none flex items-center gap-2 active:scale-95 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Verifying & Locking in Vault...</span>
                    </>
                  ) : (
                    <>
                      <span>🔒 Authorize Escrow Deposit (₦{grandTotal.toLocaleString()})</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className="space-y-4">
          <div className="bg-[#16223F] p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white border-b border-slate-800 pb-3">
              📋 Order Summary ({safeCartItems.length} {safeCartItems.length === 1 ? 'Item' : 'Items'})
            </h3>

            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {safeCartItems.map((item, idx) => {
                const p = parsePrice(item?.price ?? item?.amount ?? item?.cost ?? item?.unitPrice ?? 0);
                const q = parseQty(item?.quantity ?? item?.qty ?? 1);
                return (
                  <div key={item.id || idx} className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5 truncate">
                      <span className="w-8 h-8 rounded-lg bg-[#0B132B] flex items-center justify-center text-sm shrink-0">📦</span>
                      <div className="truncate">
                        <p className="font-bold text-white truncate">{item.title || item.name || 'Marketplace Item'}</p>
                        <p className="text-[10px] text-slate-400">Qty: {q}</p>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-white shrink-0">
                      ₦{(p * q).toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="pt-3 border-t border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Items Subtotal:</span>
                <span className="font-mono text-white">₦{itemsSubtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Escrow Protection (1.5%):</span>
                <span className="font-mono text-white">₦{escrowFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Hub Logistics:</span>
                <span className="font-mono text-white">₦{deliveryFee.toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Total Escrow Allocation:</span>
              <span className="text-lg font-black font-mono text-[#FF5A00]">
                ₦{grandTotal.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}