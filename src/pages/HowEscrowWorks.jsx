import React from 'react';

export default function HowEscrowWorks({ onNavigate }) {
  return (
    <div className="bg-[#0B132B] min-h-[70vh] text-white p-6 md:p-10 rounded-2xl border border-slate-800 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-[#FF5A00] rounded-xl flex items-center justify-center text-2xl font-bold shadow-lg shadow-[#FF5A00]/20">
          🛡️
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tight">How Bold.ng Escrow Works</h1>
          <p className="text-xs text-slate-400 font-mono">Secure Multi-Vendor Transaction Protocol</p>
        </div>
      </div>

      <div className="space-y-6 text-slate-300 text-sm leading-relaxed">
        <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-800">
          <h3 className="text-white font-bold text-base mb-2 flex items-center gap-2">
            <span className="text-[#FF5A00]">01.</span> Buyer Funds Secure Vault
          </h3>
          <p>When you place an order on Bold.ng, your payment is held securely in our protected escrow vault. The vendor is notified to ship the item, but they cannot access your money yet.</p>
        </div>

        <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-800">
          <h3 className="text-white font-bold text-base mb-2 flex items-center gap-2">
            <span className="text-[#FF5A00]">02.</span> Inspection & Delivery
          </h3>
          <p>The merchant fulfills and ships your package. Once delivered, you have a designated inspection window to verify that the item matches the product description and quality standards.</p>
        </div>

        <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-800">
          <h3 className="text-white font-bold text-base mb-2 flex items-center gap-2">
            <span className="text-[#FF5A00]">03.</span> Funds Release
          </h3>
          <p>Once you confirm satisfaction, or after the automated inspection timer elapses without dispute, funds are released directly to the merchant's verified settlement account.</p>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-slate-800 flex justify-between items-center">
        <button
          type="button"
          onClick={() => onNavigate('marketplace')}
          className="bg-[#FF5A00] text-white font-black text-xs uppercase px-6 py-3 rounded-xl hover:bg-[#e04f00] transition-colors cursor-pointer shadow-lg shadow-[#FF5A00]/20"
        >
          Explore Marketplace Now
        </button>
      </div>
    </div>
  );
}