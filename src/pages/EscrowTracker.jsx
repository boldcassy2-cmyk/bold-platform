import React, { useState } from 'react';
import { auth } from '../firebase';

export default function EscrowCheckout({ cartItems = [], onCancel, onConfirmPayment, onNavigate }) {
  const currentUser = auth?.currentUser;
  const [loading, setLoading] = useState(false);

  // Helper to safely parse numbers, strings with commas, and currency symbols
  const parsePrice = (val) => {
    if (typeof val === 'number') return val;
    if (!val) return 0;
    const cleaned = String(val).replace(/[^0-9.-]+/g, "");
    return Number(cleaned) || 0;
  };

  const totalAmountInNaira = cartItems.reduce((sum, item) => {
    const unitPrice = parsePrice(item.price);
    const quantity = Number(item.quantity || 1);
    return sum + (unitPrice * quantity);
  }, 0);

  const handlePaystackPayment = () => {
    if (cartItems.length === 0) {
      alert("Your cart or checkout payload is empty.");
      return;
    }

    const publicKey = "pk_live_0c84f6825e054064023e208a41e1f3ad34cf0f2d";
    const amountInKobo = Math.round(totalAmountInNaira * 100);

    if (!window.PaystackPop) {
      alert("Paystack SDK failed to load. Please check your internet connection or ad blocker.");
      return;
    }

    setLoading(true);

    const handler = window.PaystackPop.setup({
      key: publicKey,
      email: currentUser?.email || "buyer@bold.ng",
      amount: amountInKobo,
      currency: 'NGN',
      ref: 'BOLD-ESCROW-' + Date.now(),
      metadata: {
        custom_fields: [
          {
            display_name: "Platform",
            variable_name: "platform",
            value: "bold.ng Escrow Vault"
          }
        ]
      },
      callback: function(response) {
        setLoading(false);
        console.log("Payment complete! Reference: ", response.reference);
        
        const itemSummary = cartItems.length === 1 
          ? `${cartItems[0].title} (x${cartItems[0].quantity || 1})`
          : `${cartItems.length} items bundle (${cartItems[0]?.title || 'Multi-item'})`;

        onConfirmPayment({
          id: response.reference || ('TX-' + Math.floor(1000 + Math.random() * 9000)),
          title: itemSummary,
          amount: totalAmountInNaira,
          status: 'In Escrow Vault',
          date: new Date().toISOString().split('T')[0],
          hub: 'Lagos Hub',
          items: cartItems
        });
      },
      onClose: function() {
        setLoading(false);
        alert('Payment window closed. Your escrow deposit was not completed.');
      }
    });

    handler.openIframe();
  };

  return (
    <div className="max-w-3xl mx-auto my-8 px-4 text-white">
      <div className="bg-[#16223F] p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <div>
            <span className="text-[10px] font-black tracking-widest text-[#FF5A00] uppercase">Secure Gateway</span>
            <h2 className="text-2xl font-black mt-1">Escrow Deposit Checkout</h2>
          </div>
          <button 
            type="button"
            onClick={onCancel}
            className="text-xs font-bold text-slate-400 hover:text-white bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-700 cursor-pointer"
          >
            ✕ Cancel
          </button>
        </div>

        {/* Order Summary List */}
        <div className="space-y-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">Checkout Items</h3>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
            {cartItems.map((item, idx) => {
              const unitPrice = parsePrice(item.price);
              const qty = Number(item.quantity || 1);
              const lineTotal = unitPrice * qty;

              return (
                <div key={idx} className="flex justify-between items-center bg-[#0B132B] p-4 rounded-2xl border border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{item.img || '📦'}</span>
                    <div>
                      <h4 className="font-bold text-sm text-white">{item.title}</h4>
                      <p className="text-[11px] text-slate-400">Qty: {qty} | {item.location || 'Lagos Hub'}</p>
                    </div>
                  </div>
                  <span className="font-mono font-black text-[#FF5A00]">
                    ₦{lineTotal.toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Total Calculation */}
        <div className="bg-[#0B132B] p-5 rounded-2xl border border-slate-800 flex justify-between items-center">
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase">Total Escrow Allocation</p>
            <p className="text-[10px] text-emerald-400 mt-0.5">🔒 Secured until delivery inspection</p>
          </div>
          <span className="text-2xl font-mono font-black text-white">
            ₦{totalAmountInNaira.toLocaleString()}
          </span>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={handlePaystackPayment}
          disabled={loading || cartItems.length === 0 || totalAmountInNaira === 0}
          className="w-full bg-[#FF5A00] hover:bg-[#e05000] text-white font-black py-4 rounded-2xl transition-all shadow-[0_4px_20px_rgba(255,90,0,0.4)] disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Initializing Paystack Gateway...
            </>
          ) : (
            <>💳 Authorize Escrow Deposit (₦{totalAmountInNaira.toLocaleString()})</>
          )}
        </button>
      </div>
    </div>
  );
}