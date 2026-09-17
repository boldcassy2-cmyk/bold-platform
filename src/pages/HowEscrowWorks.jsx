import React from 'react';

export default function HowEscrowWorks({ onNavigate }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-white space-y-8">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <span className="text-[10px] font-black tracking-widest text-[#FF5A00] uppercase">Protocol Architecture</span>
          <h1 className="text-3xl font-black mt-1">How Escrow Vault Works</h1>
        </div>
        <button onClick={() => onNavigate('marketplace')} className="text-xs bg-slate-800 px-4 py-2 rounded-xl text-slate-300 hover:text-white">
          ← Back to Marketplace
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#16223F] p-6 rounded-3xl border border-slate-800 space-y-3">
          <span className="text-2xl">1️⃣</span>
          <h3 className="font-bold text-lg">Fund Deposit</h3>
          <p className="text-xs text-slate-300 leading-relaxed">Buyer initiates checkout and funds are securely locked in the bold.ng Escrow Vault via Paystack.</p>
        </div>
        <div className="bg-[#16223F] p-6 rounded-3xl border border-slate-800 space-y-3">
          <span className="text-2xl">2️⃣</span>
          <h3 className="font-bold text-lg">Hub Inspection</h3>
          <p className="text-xs text-slate-300 leading-relaxed">Merchant prepares items for dispatch through verified fulfillment hubs in Lagos with quality checks.</p>
        </div>
        <div className="bg-[#16223F] p-6 rounded-3xl border border-slate-800 space-y-3">
          <span className="text-2xl">3️⃣</span>
          <h3 className="font-bold text-lg">Secure Release</h3>
          <p className="text-xs text-slate-300 leading-relaxed">Upon successful delivery confirmation, escrow funds are automatically released to the merchant.</p>
        </div>
      </div>
    </div>
  );
}