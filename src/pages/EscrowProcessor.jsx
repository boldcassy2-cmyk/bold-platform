import React, { useState } from 'react';

export default function EscrowProcessor({ activeTx, onCancelTx, onCompleteTx }) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  if (!activeTx) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-[#16223F] border border-slate-800 rounded-3xl text-center text-white">
        <p className="text-slate-400">No active escrow asset selected.</p>
        <button onClick={onCancelTx} className="mt-4 text-xs font-black text-[#FF5A00] uppercase tracking-wider">
          Return to Market
        </button>
      </div>
    );
  }

  // PLATFORM FINANCIAL CONVENANT PRICING ARCHITECTURE
  const basePrice = activeTx.price || 0;
  const inspectionHubFee = 5000; // Standard baseline physical verification logistics fee
  
  // Premium scale calculation for large assets over 1M Naira
  const isPremiumAsset = basePrice >= 1000000;
  const vaultFeeRate = isPremiumAsset ? 0.01 : 0.015; 
  const securityVaultFee = Math.round(basePrice * vaultFeeRate);
  
  const totalEscrowCommitment = basePrice + inspectionHubFee + securityVaultFee;

  const handlePaymentExecution = () => {
    setIsProcessing(true);

    // Simulate standard pipeline response time for transaction verification
    setTimeout(() => {
      const generatedTxReceipt = {
        id: `TX-${Math.floor(1000 + Math.random() * 9000)}`,
        title: activeTx.title,
        amount: totalEscrowCommitment,
        status: 'In Escrow Vault',
        date: new Date().toISOString().split('T')[0]
      };
      
      setIsProcessing(false);
      onCompleteTx(generatedTxReceipt);
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto my-6 px-4 text-white">
      {/* TRANSACTION NAVIGATION HEADER */}
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={onCancelTx} 
          disabled={isProcessing}
          className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors cursor-pointer disabled:opacity-40"
        >
          ← Cancel Transaction
        </button>
        <span className="text-[10px] bg-emerald-500/20 text-emerald-400 font-bold px-3 py-1 rounded-full border border-emerald-500/30 uppercase tracking-wider">
          🔒 Secure Vault Lock Activated
        </span>
      </div>

      <div className="bg-[#16223F] border border-slate-800/80 rounded-3xl p-6 md:p-8 shadow-2xl space-y-8">
        <div>
          <h2 className="text-2xl font-black tracking-tight">Escrow Agreement Invoice</h2>
          <p className="text-xs text-slate-400 mt-1">Review the asset metrics and platform holding distribution metrics below.</p>
        </div>

        {/* ASSET SUMMARY CARD */}
        <div className="bg-[#0B132B] rounded-2xl p-4 flex items-center gap-4 border border-slate-800">
          <div className="w-14 h-14 bg-[#16223F] rounded-xl flex items-center justify-center text-3xl select-none">
            {activeTx.img || '📦'}
          </div>
          <div className="text-left">
            <h4 className="font-black text-sm text-white line-clamp-1">{activeTx.title}</h4>
            <p className="text-[11px] text-slate-400 mt-0.5">{activeTx.meta || 'Verified Hub Vendor'}</p>
            <p className="text-[10px] text-[#FF5A00] font-black uppercase tracking-wider mt-0.5">📍 {activeTx.location || 'Lagos'}</p>
          </div>
        </div>

        {/* BALANCE ACCOUNTING LEDGER */}
        <div className="space-y-3">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 text-left">Financial Allocation</h3>
          <div className="bg-[#0B132B] font-mono text-sm rounded-2xl p-5 space-y-4 border border-slate-800/60">
            <div className="flex justify-between items-center text-slate-400">
              <span>Asset Base Value:</span>
              <span className="text-white font-bold">₦{basePrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span>Hub Inspection Logistics:</span>
              <span className="text-white font-bold">₦{inspectionHubFee.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-slate-400">
              <span className="flex items-center gap-1.5">
                Vault Security Shield ({isPremiumAsset ? '1.0%' : '1.5%'}):
                {isPremiumAsset && <span className="text-[9px] bg-purple-600/20 text-purple-400 px-1.5 py-0.5 rounded font-sans font-black uppercase">Tier Discount</span>}
              </span>
              <span className="text-white font-bold">₦{securityVaultFee.toLocaleString()}</span>
            </div>
            <div className="border-t border-slate-800/80 pt-4 flex justify-between items-center text-base">
              <span className="font-sans font-black text-xs uppercase tracking-widest text-[#FF5A00]">Total Safe Lock Value</span>
              <span className="text-xl font-black text-white">₦{totalEscrowCommitment.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* REGULATORY LEGAL COVENANT DEPLOYMENT */}
        <div className="space-y-4">
          <label className="flex items-start gap-3 cursor-pointer group text-left">
            <input 
              type="checkbox" 
              checked={agreedToTerms} 
              disabled={isProcessing}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1 accent-[#FF5A00] h-4 w-4 rounded border-slate-700 bg-[#0B132B] disabled:opacity-40" 
            />
            <span className="text-[11px] text-slate-400 group-hover:text-slate-300 leading-relaxed transition-colors select-none">
              I authorize the containment of this payment inside the Bold.ng Escrow pool. Funds will remain untouchable until items are received at our centralized Lagos Hub and undergo visual verification.
            </span>
          </label>

          <button 
            disabled={!agreedToTerms || isProcessing}
            onClick={handlePaymentExecution}
            className={`w-full py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl flex items-center justify-center ${
              agreedToTerms && !isProcessing
                ? 'bg-[#FF5A00] text-white hover:brightness-110 active:scale-[0.99] cursor-pointer' 
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            {isProcessing ? (
              <span className="flex items-center gap-2 animate-pulse tracking-wide font-medium normal-case text-slate-300">
                Securing Vault allocations...
              </span>
            ) : (
              'Confirm & Lock Funds In Escrow'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}