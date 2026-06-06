import React, { useState } from 'react';

/**
 * BOLD.NG SECURE ESCROW CHECKOUT PANEL
 * Handles calculation of trust processing layers, downpayments, and logistics validation.
 */
export default function EscrowCheckout({ item, onCancel, onConfirmPayment }) {
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  // If someone forces navigation without selecting an item, show an emergency fallback
  if (!item) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-[#16223F] border border-slate-800 rounded-3xl text-center text-white">
        <p className="text-slate-400">No transaction pipeline initialized.</p>
        <button onClick={onCancel} className="mt-4 text-xs font-black text-[#FF5A00] uppercase tracking-wider">
          Return to Marketplace
        </button>
      </div>
    );
  }

  // FINANCIAL ARCHITECTURE CALCULATION MATRIX
  const itemPrice = item.price || 0;
  
  // 1. Fixed Inspection Hub fee for asset verification (e.g., ₦5,000 flat)
  const inspectionFee = 5000; 
  
  // 2. Dynamic Escrow Fee: 1.5% for standard items, capped or discounted for premium tier
  const isPremium = itemPrice >= 1000000;
  const escrowFeeRate = isPremium ? 0.01 : 0.015; // 1% for Premium, 1.5% for standard
  const escrowProcessingFee = Math.round(itemPrice * escrowFeeRate);
  
  // 3. Absolute aggregate total
  const totalPayout = itemPrice + inspectionFee + escrowProcessingFee;

  return (
    <div className="max-w-2xl mx-auto my-6 px-4 text-white selection:bg-[#FF5A00]">
      
      {/* HEADER ESCROW NAVIGATION STATUS BAR */}
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={onCancel}
          className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
        >
          ← Abort Transaction
        </button>
        <span className="text-[10px] bg-emerald-600/20 text-emerald-400 font-bold px-3 py-1 rounded-full border border-emerald-500/30 uppercase tracking-wider">
          🔒 End-to-End Escrow Active
        </span>
      </div>

      <div className="bg-[#16223F] border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-8">
        
        {/* PIPELINE IDENTITY DESCRIPTION */}
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white">Initialize Escrow Secure Vault</h2>
          <p className="text-xs text-slate-400 mt-1">
            Review your transaction terms. Funds remain securely locked in the Bold.ng Escrow System until inspection criteria are satisfied.
          </p>
        </div>

        {/* ASSET METADATA SUMMARY */}
        <div className="bg-[#0B132B] rounded-2xl p-4 flex items-center gap-4 border border-slate-800/80">
          <div className="w-16 h-16 bg-[#16223F] rounded-xl flex items-center justify-center text-3xl select-none">
            {item.img || '📦'}
          </div>
          <div className="text-left">
            <h4 className="font-black text-sm text-white line-clamp-1">{item.title}</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">{item.meta || 'Verified Merchant'}</p>
            <p className="text-[10px] text-[#FF5A00] font-bold uppercase mt-0.5">📍 {item.location || 'Lagos'}</p>
          </div>
        </div>

        {/* FINANCIAL BILLING ACCOUNT BREAKDOWN */}
        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Financial Summary Ledger</h3>
          
          <div className="bg-[#0B132B] rounded-2xl p-5 space-y-4 font-mono text-sm border border-slate-800/60">
            <div className="flex justify-between items-center text-slate-400">
              <span>Item Net Value:</span>
              <span className="text-white font-bold">₦{itemPrice.toLocaleString()}</span>
            </div>

            <div className="flex justify-between items-center text-slate-400">
              <span className="flex items-center gap-1">
                Inspection Hub Fee:
                <span className="text-[9px] bg-blue-600/20 text-blue-400 px-1.5 py-0.5 rounded uppercase font-sans font-bold">FIXED</span>
              </span>
              <span className="text-white font-bold">₦{inspectionFee.toLocaleString()}</span>
            </div>

            <div className="flex justify-between items-center text-slate-400">
              <span className="flex items-center gap-1">
                Escrow Shield Fee ({isPremium ? '1.0%' : '1.5%'}):
                {isPremium && <span className="text-[9px] bg-purple-600/20 text-purple-400 px-1.5 py-0.5 rounded uppercase font-sans font-bold">PREMIUM DISCOUNT</span>}
              </span>
              <span className="text-white font-bold">₦{escrowProcessingFee.toLocaleString()}</span>
            </div>

            <div className="border-t border-slate-800/80 my-2 pt-4 flex justify-between items-center text-base">
              <span className="font-sans font-black text-xs uppercase tracking-widest text-[#FF5A00]">Total Vault Lock Allocation</span>
              <span className="text-xl font-black text-white">₦{totalPayout.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* SECURITY ASSURANCE & DISCLOSURE */}
        <div className="bg-[#FF5A00]/5 border border-[#FF5A00]/20 rounded-2xl p-4 flex gap-3 text-left">
          <span className="text-lg mt-0.5">🛡️</span>
          <p className="text-xs text-slate-300 leading-relaxed">
            <strong>The Bold Shield Rule:</strong> Money deposited here does not go directly to the merchant. The payment remains locked in the vault. The merchant only receives payout when you receive the product at our collection center and verify its condition.
          </p>
        </div>

        {/* AGREEMENT VERIFICATION CONTROLS */}
        <div className="space-y-4 pt-2">
          <label className="flex items-start gap-3 cursor-pointer group text-left">
            <input 
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1 accent-[#FF5A00] h-4 w-4 rounded border-slate-700 bg-[#0B132B]"
            />
            <span className="text-[11px] text-slate-400 group-hover:text-slate-300 leading-normal transition-colors">
              I authorize the locking of funds into the secure custody framework and agree to the Bold.ng verification, hub inspection routing, and refund execution covenants.
            </span>
          </label>

          <button
            disabled={!agreedToTerms}
            onClick={() => onConfirmPayment({ item, totalPayout })}
            className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl ${
              agreedToTerms 
                ? 'bg-[#FF5A00] text-white hover:brightness-110 active:scale-[0.99] cursor-pointer shadow-[#FF5A00]/10' 
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            Authorize Vault Payment
          </button>
        </div>

      </div>
    </div>
  );
}