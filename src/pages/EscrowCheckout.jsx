import React, { useState, useMemo, useEffect } from 'react';

/**
 * BOLD.NG SECURE CHECKOUT & PAYMENT GATEWAY
 * File: src/components/EscrowCheckout.jsx
 */
export default function EscrowCheckout({ 
  item, 
  cartItems = [], 
  onCancel = () => {}, 
  onConfirmPayment = () => {}, 
  onNavigate = () => {} 
}) {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);

  // Safe Cart Items reference
  const safeCartItems = useMemo(() => {
    if (Array.isArray(cartItems) && cartItems.length > 0) return cartItems;
    if (item && typeof item === 'object') return [item];
    
    // Check local storage fallback if state was cleared prematurely
    try {
      const stored = localStorage.getItem('bold_cart');
      const parsed = stored ? JSON.parse(stored) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }, [cartItems, item]);

  // Delivery Details with persistent fallback
  const [shippingDetails, setShippingDetails] = useState(() => {
    try {
      const saved = localStorage.getItem('bold_shipping_info');
      return saved ? JSON.parse(saved) : { fullName: '', phone: '', address: '', state: 'Lagos' };
    } catch {
      return { fullName: '', phone: '', address: '', state: 'Lagos' };
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('bold_shipping_info', JSON.stringify(shippingDetails));
    } catch (e) {
      console.warn('Could not save shipping details to localStorage', e);
    }
  }, [shippingDetails]);

  // Financial Calculations
  const financialSummary = useMemo(() => {
    if (safeCartItems.length === 0) {
      return { itemSubtotal: 0, inspectionFee: 0, escrowProcessingFee: 0, totalPayout: 0, isPremium: false };
    }

    const itemSubtotal = safeCartItems.reduce((sum, i) => {
      const price = Number(i?.price) || 0;
      const qty = Number(i?.quantity) || 1;
      return sum + (price * qty);
    }, 0);

    const inspectionFee = 2500;
    const isPremium = itemSubtotal >= 1000000;
    const escrowFeeRate = isPremium ? 0.01 : 0.015;
    const escrowProcessingFee = Math.round(itemSubtotal * escrowFeeRate);
    const totalPayout = itemSubtotal + inspectionFee + escrowProcessingFee;

    return { itemSubtotal, inspectionFee, escrowProcessingFee, totalPayout, isPremium };
  }, [safeCartItems]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentExecution = () => {
    if (!shippingDetails.fullName || !shippingDetails.phone || !shippingDetails.address) {
      alert('Please complete your delivery details before proceeding.');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      
      const orderId = `BOLD-TX-${Math.floor(100000 + Math.random() * 900000)}`;
      const newOrder = {
        orderId,
        items: safeCartItems,
        total: financialSummary.totalPayout,
        paymentMethod: selectedPaymentMethod,
        shipping: shippingDetails,
        date: new Date().toISOString(),
        status: 'Escrow Vault Locked'
      };
      
      try {
        const recentOrders = JSON.parse(localStorage.getItem('bold_order_history') || '[]');
        localStorage.setItem('bold_order_history', JSON.stringify([newOrder, ...recentOrders]));
        localStorage.removeItem('bold_cart');
      } catch (e) {
        console.error('Error handling local storage order save:', e);
      }

      window.dispatchEvent(new Event('cartUpdated'));
      setCompletedOrder(newOrder);

      if (typeof onConfirmPayment === 'function') {
        onConfirmPayment(newOrder);
      }
    }, 1800);
  };

  // SUCCESS / TRANSACTION CONFIRMED VIEW
  if (completedOrder) {
    return (
      <div className="max-w-xl mx-auto my-10 p-8 bg-[#16223F] border border-emerald-500/30 rounded-3xl text-white shadow-2xl text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full flex items-center justify-center text-3xl mx-auto">
          🛡️
        </div>

        <div>
          <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-bold px-3 py-1 rounded-full border border-emerald-500/20 uppercase tracking-wider">
            Payment Locked in Escrow Vault
          </span>
          <h2 className="text-2xl font-black text-white mt-3">Transaction Confirmed</h2>
          <p className="text-xs text-slate-400 mt-1">
            Order Reference: <span className="font-mono text-white font-bold">{completedOrder.orderId}</span>
          </p>
        </div>

        <div className="bg-[#0B132B] border border-slate-800 rounded-2xl p-4 text-left space-y-2 text-xs font-mono">
          <div className="flex justify-between text-slate-400">
            <span>Amount Locked:</span>
            <span className="text-white font-bold">₦{(completedOrder?.total || 0).toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Payment Method:</span>
            <span className="text-white font-bold uppercase">{completedOrder?.paymentMethod}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Destination:</span>
            <span className="text-white font-bold truncate max-w-[200px]">{completedOrder?.shipping?.address}</span>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
          Your payment is held safely in the <strong>Bold Escrow Vault</strong>. Vendor dispatch has been triggered. Funds will only be released once you physically inspect and confirm delivery.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={() => typeof onNavigate === 'function' ? onNavigate('escrow-vault') : onCancel()}
            className="flex-1 py-3.5 bg-[#FF5A00] text-white font-bold text-xs rounded-xl hover:bg-[#e04f00] transition-all border-none cursor-pointer uppercase tracking-wider"
          >
            Go to Escrow Vault
          </button>
          <button
            type="button"
            onClick={() => typeof onNavigate === 'function' ? onNavigate('marketplace') : onCancel()}
            className="flex-1 py-3.5 bg-slate-800 text-slate-300 font-bold text-xs rounded-xl hover:text-white hover:bg-slate-700 transition-all border-none cursor-pointer uppercase tracking-wider"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  // EMPTY CHECKOUT BASKET VIEW
  if (safeCartItems.length === 0) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-[#16223F] border border-slate-800 rounded-3xl text-center text-white shadow-2xl space-y-4">
        <div className="w-14 h-14 mx-auto bg-[#0B132B] rounded-full flex items-center justify-center text-2xl">
          🛒
        </div>
        <p className="text-slate-400 text-sm font-medium">Your checkout basket is empty.</p>
        <button 
          type="button"
          onClick={onCancel} 
          className="bg-[#FF5A00] hover:bg-[#e04f00] text-white text-xs font-bold px-6 py-3 rounded-xl uppercase tracking-wider border-none cursor-pointer transition-all"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const { itemSubtotal, inspectionFee, escrowProcessingFee, totalPayout, isPremium } = financialSummary;

  return (
    <div className="max-w-4xl mx-auto my-6 px-4 text-white font-sans selection:bg-[#FF5A00]">
      
      {/* Header Navigation */}
      <header className="flex items-center justify-between mb-6">
        <button 
          type="button"
          onClick={onCancel}
          className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors bg-transparent border-none cursor-pointer"
        >
          ← Cancel & Return
        </button>
        <span className="text-[10px] bg-emerald-500/10 text-emerald-400 font-bold px-3 py-1 rounded-full border border-emerald-500/20 uppercase tracking-wider">
          🔒 Secure Escrow Checkout
        </span>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Delivery & Payment Options */}
        <main className="lg:col-span-7 space-y-6">
          
          {/* Section 1: Customer Delivery Details */}
          <section className="bg-[#16223F] border border-slate-800 rounded-2xl p-5 text-left space-y-4 shadow-lg">
            <div className="flex justify-between items-center border-b border-slate-800/80 pb-3">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <span>1.</span> Delivery Information
              </h3>
              <span className="text-[10px] text-slate-500">Auto-Saved</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="e.g. Chukwuebuka Dedon"
                  value={shippingDetails.fullName}
                  onChange={handleInputChange}
                  className="w-full bg-[#0B132B] border border-slate-700/80 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#FF5A00]"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="08012345678"
                  value={shippingDetails.phone}
                  onChange={handleInputChange}
                  className="w-full bg-[#0B132B] border border-slate-700/80 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#FF5A00]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-400 font-semibold mb-1">Delivery Address or Hub</label>
                <input
                  type="text"
                  name="address"
                  placeholder="Street Address, Building Name, or Destination Hub"
                  value={shippingDetails.address}
                  onChange={handleInputChange}
                  className="w-full bg-[#0B132B] border border-slate-700/80 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#FF5A00]"
                />
              </div>
            </div>
          </section>

          {/* Section 2: Payment Method Selection */}
          <section className="bg-[#16223F] border border-slate-800 rounded-2xl p-5 text-left space-y-4 shadow-lg">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 border-b border-slate-800/80 pb-3">
              2. Select Payment Method
            </h3>

            <div className="space-y-2.5">
              {[
                { id: 'card', label: 'Debit / Credit Card', sub: 'Paystack, Visa, Mastercard, Verve', icon: '💳' },
                { id: 'transfer', label: 'Instant Bank Transfer', sub: 'Virtual Bank Account Payment', icon: '🏦' },
                { id: 'ussd', label: 'USSD Code', sub: 'Quick dial code via phone', icon: '📱' },
              ].map((method) => (
                <label
                  key={method.id}
                  onClick={() => setSelectedPaymentMethod(method.id)}
                  className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${
                    selectedPaymentMethod === method.id
                      ? 'bg-[#0B132B] border-[#FF5A00] shadow-[0_0_10px_rgba(255,90,0,0.15)]'
                      : 'bg-[#16223F] border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{method.icon}</span>
                    <div>
                      <p className="text-xs font-bold text-white">{method.label}</p>
                      <p className="text-[10px] text-slate-400">{method.sub}</p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="payment_method"
                    checked={selectedPaymentMethod === method.id}
                    onChange={() => setSelectedPaymentMethod(method.id)}
                    className="accent-[#FF5A00] h-4 w-4"
                  />
                </label>
              ))}
            </div>
          </section>

        </main>

        {/* Right Column: Order Summary & Escrow Protection */}
        <aside className="lg:col-span-5 space-y-4">
          <div className="bg-[#16223F] border border-slate-800 rounded-2xl p-5 text-left space-y-5 shadow-2xl sticky top-20">
            
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-300 border-b border-slate-800/80 pb-3">
              Order Items ({safeCartItems.length})
            </h3>

            {/* Item List Preview */}
            <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
              {safeCartItems.map((cartItem, idx) => {
                const itemPrice = Number(cartItem?.price) || 0;
                const itemQty = Number(cartItem?.quantity) || 1;
                const key = cartItem?.id || cartItem?.docId || `checkout-item-${idx}`;

                return (
                  <div key={key} className="flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2 max-w-[70%]">
                      <span className="w-6 h-6 rounded bg-[#0B132B] flex items-center justify-center shrink-0 text-xs overflow-hidden">
                        {cartItem?.img && typeof cartItem.img === 'string' && cartItem.img.startsWith('http') ? (
                          <img src={cartItem.img} alt="" className="w-full h-full object-cover rounded" />
                        ) : '📦'}
                      </span>
                      <span className="truncate font-medium text-slate-200">{cartItem?.title || 'Product'}</span>
                    </div>
                    <span className="font-mono text-slate-400 shrink-0">
                      x{itemQty} — ₦{(itemPrice * itemQty).toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Fee Calculations */}
            <div className="border-t border-slate-800/80 pt-4 space-y-2.5 font-mono text-xs text-slate-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white font-bold">₦{itemSubtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Inspection & Delivery Fee</span>
                <span className="text-white font-bold">₦{inspectionFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Escrow Processing ({isPremium ? '1.0%' : '1.5%'})</span>
                <span className="text-white font-bold">₦{escrowProcessingFee.toLocaleString()}</span>
              </div>
              <div className="border-t border-slate-800/80 pt-3 flex justify-between items-baseline text-sm font-black text-white">
                <span className="font-sans text-xs uppercase tracking-wider text-[#FF5A00]">Total Payable</span>
                <span className="text-lg text-white">₦{totalPayout.toLocaleString()}</span>
              </div>
            </div>

            {/* Escrow Shield Notice */}
            <div className="bg-[#0B132B] border border-slate-800 p-3.5 rounded-xl text-[11px] leading-relaxed text-slate-400 space-y-1">
              <p className="text-white font-bold flex items-center gap-1.5">
                🛡️ Bold.ng Buyer Protection
              </p>
              <p className="text-slate-400">
                Funds are held in escrow and released to the vendor only when you inspect and confirm your package.
              </p>
            </div>

            {/* Terms Agreement & CTA */}
            <div className="space-y-3 pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input 
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-0.5 accent-[#FF5A00] h-4 w-4 rounded border-slate-700 bg-[#0B132B]"
                />
                <span className="text-[10px] text-slate-400 leading-normal">
                  I authorize locking funds into the escrow vault and agree to the inspection terms.
                </span>
              </label>

              <button
                type="button"
                disabled={!agreedToTerms || isProcessing}
                onClick={handlePaymentExecution}
                className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all border-none ${
                  agreedToTerms && !isProcessing
                    ? 'bg-[#FF5A00] text-white hover:bg-[#e04f00] shadow-lg shadow-[#FF5A00]/20 cursor-pointer active:scale-95' 
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                {isProcessing ? 'Processing Payment...' : `Pay ₦${totalPayout.toLocaleString()}`}
              </button>
            </div>

          </div>
        </aside>

      </div>
    </div>
  );
}