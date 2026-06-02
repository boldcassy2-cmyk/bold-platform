import React, { useState, useEffect } from 'react';

export default function EscrowProcessor({ activeTx, onCancelTx, onCompleteTx }) {
  const [paymentStep, setPaymentStep] = useState(1);
  const [secondsLeft, setSecondsLeft] = useState(600);

  const tx = activeTx || {
    title: "Heavyweight Boxy Hoodie (Vintage Black)",
    price: 28000,
    category: "fashion",
    location: "Lagos Hub",
    meta: "Size: XL | Premium Cotton"
  };

  const boldFee = tx.price * 0.015;
  const totalPayout = tx.price + boldFee;

  useEffect(() => {
    if (paymentStep !== 1) return;
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [paymentStep]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <main className="max-w-5xl mx-auto my-6 px-4 space-y-6 animate-fadeIn text-white">
      
      {/* HEADER ESCROW STATUS */}
      <div className="bg-[#16223F] border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[9px] bg-emerald-500 text-slate-950 font-black tracking-widest uppercase px-2 py-0.5 rounded">
            🔒 SECURE TRANSFER MATRIX PIPELINE
          </span>
          <h1 className="text-2xl font-black text-white mt-1">Escrow Checkout Processor</h1>
        </div>
        <button 
          onClick={onCancelTx}
          className="text-xs font-bold text-slate-300 hover:text-white bg-[#0B132B] border border-slate-800 px-4 py-2 rounded-xl transition cursor-pointer"
        >
          ← Abort Transaction
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* TRANS TRANSACTION DETAIL CONTROLS */}
        <div className="lg:col-span-7 bg-[#16223F] p-6 rounded-3xl shadow-xl border border-slate-800 space-y-6">
          
          {paymentStep === 1 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-amber-950/40 border border-amber-900/60 p-4 rounded-xl">
                <div>
                  <h4 className="text-xs font-black text-amber-400 uppercase">Awaiting Bank Transfer Allocation</h4>
                  <p className="text-[10px] text-slate-300 mt-0.5">Deploy exact total payable to the vault anchor routing terminal details.</p>
                </div>
                <span className="font-mono text-xs font-black text-amber-400 bg-amber-950 px-2.5 py-1 rounded border border-amber-900/60">
                  ⏱️ {formatTime(secondsLeft)}
                </span>
              </div>

              {/* BANK DETAILS OVERHAUL */}
              <div className="bg-[#0B132B] border border-slate-800 p-5 rounded-2xl space-y-3">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Dynamic Escrow Holding Bank Target</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="block text-[9px] font-bold text-slate-400 uppercase">Settlement Bank</span>
                    <span className="text-xs font-black text-white">Bold Partner Node / Wema</span>
                  </div>
                  <div>
                    <span className="block text-[9px] font-bold text-slate-400 uppercase">Vault Routing Number</span>
                    <span className="text-xs font-black text-[#FF5A00] font-mono tracking-wider">9024018274</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex justify-between items-center">
                  <div>
                    <span className="block text-[9px] font-bold text-slate-400 uppercase">Exact Net Liability Amount</span>
                    <span className="text-base font-black text-[#FF5A00] font-mono">₦{totalPayout.toLocaleString()}</span>
                  </div>
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest border border-slate-800 px-2 py-1 rounded bg-[#16223F]">
                    Ref: BOLD-9921
                  </span>
                </div>
              </div>

              <button 
                onClick={() => { setPaymentStep(2); setTimeout(() => setPaymentStep(3), 2000); }}
                className="w-full bg-[#FF5A00] text-white font-black text-xs uppercase tracking-wider py-3.5 rounded-xl border-none hover:brightness-110 transition cursor-pointer shadow-md"
              >
                ✔️ I Have Processed This Transfer Payment
              </button>
            </div>
          )}

          {paymentStep === 2 && (
            <div className="p-12 text-center space-y-3 bg-[#0B132B] rounded-2xl border border-slate-800">
              <div className="w-8 h-8 border-4 border-[#FF5A00] border-t-transparent rounded-full animate-spin mx-auto" />
              <h4 className="text-xs font-black uppercase text-slate-300 tracking-wider pt-2">Verifying Ledger Deposit Blocks...</h4>
            </div>
          )}

          {paymentStep === 3 && (
            <div className="p-8 text-center bg-emerald-950/20 border border-emerald-800/80 rounded-2xl space-y-4">
              <span className="text-3xl">🔒</span>
              <div>
                <h4 className="text-sm font-black text-emerald-400 uppercase tracking-wider">Funds Secured In Safe Vault Escrow Array</h4>
                <p className="text-xs text-slate-300 mt-1">Vendor has been pinged to deploy fulfillment actions. Your investment capital is safe.</p>
              </div>
              <button 
                onClick={onCompleteTx}
                className="bg-emerald-600 text-white font-black text-xs uppercase tracking-wider px-6 py-2.5 rounded-xl border-none hover:bg-emerald-700 transition cursor-pointer"
              >
                Return to Live Feed
              </button>
            </div>
          )}

          {/* ESCROW TRACKER STAGES */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <h4 className="text-xs font-black text-[#FF5A00] uppercase tracking-wider">Escrow Life Cycle Milestones</h4>
            <div className="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-2 before:top-1.5 before:bottom-1.5 before:w-0.5 before:bg-slate-800">
              <div>
                <div className="absolute -left-5 w-2.5 h-2.5 rounded-full bg-[#FF5A00]" />
                <p className="text-[11px] font-black text-white">Stage 1: Ingestion & Billing Assignment</p>
              </div>
              <div>
                <div className={`absolute -left-5 w-2.5 h-2.5 rounded-full ${paymentStep === 3 ? 'bg-emerald-500' : 'bg-slate-800'}`} />
                <p className="text-[11px] font-black text-slate-300">Stage 2: Vault Interception & Lockdown Lock</p>
              </div>
              <div>
                <div className="absolute -left-5 w-2.5 h-2.5 rounded-full bg-slate-800" />
                <p className="text-[11px] font-black text-slate-500">Stage 3: Buyer Clearance Clearance Authorization</p>
              </div>
            </div>
          </div>

        </div>

        {/* INVOICE SIDE MANIFEST */}
        <div className="lg:col-span-5 bg-[#16223F] text-white p-5 rounded-3xl shadow-xl border border-slate-800 space-y-4">
          <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider border-b border-slate-800 pb-2">
            🧾 Ledger Commitment Bill
          </h3>

          <div className="flex items-center gap-3 bg-[#0B132B] p-3 rounded-xl border border-slate-900">
            <span className="text-xl">💼</span>
            <div className="overflow-hidden">
              <span className="text-[8px] bg-[#FF5A00] text-white font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
                {tx.category}
              </span>
              <h4 className="text-xs font-black text-white truncate mt-1">{tx.title}</h4>
              <p className="text-[9px] text-slate-400 truncate font-semibold">{tx.meta}</p>
            </div>
          </div>

          <div className="space-y-2 text-xs font-medium pt-1">
            <div className="flex justify-between text-slate-400">
              <span>Base Cost Evaluation</span>
              <span className="font-mono text-white">₦{tx.price.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span>Bold Protection Fee (1.5%)</span>
              <span className="font-mono text-white">₦{boldFee.toLocaleString()}</span>
            </div>
            <div className="border-t border-slate-800 pt-3 flex justify-between items-center text-sm font-black">
              <span className="text-slate-300">Total Capital commitment</span>
              <span className="font-mono text-[#FF5A00]">₦{totalPayout.toLocaleString()}</span>
            </div>
          </div>
        </div>

      </div>

    </main>
  );
}