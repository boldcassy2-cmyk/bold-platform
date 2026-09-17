import React from 'react';

export default function EscrowGuidelines({ onNavigate }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-white space-y-8">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <span className="text-[10px] font-black tracking-widest text-[#FF5A00] uppercase">Compliance Protocol</span>
          <h1 className="text-3xl font-black mt-1">Escrow Guidelines & Safety</h1>
        </div>
        <button onClick={() => onNavigate('marketplace')} className="text-xs bg-slate-800 px-4 py-2 rounded-xl text-slate-300 hover:text-white cursor-pointer">
          ← Back to Marketplace
        </button>
      </div>

      <div className="bg-[#16223F] p-8 rounded-3xl border border-slate-800 space-y-6 text-slate-300 text-sm leading-relaxed">
        <h3 className="text-white font-bold text-lg">1. Vault Protection Guarantee</h3>
        <p>All funds deposited on bold.ng are held securely via Paystack in our dedicated escrow vault accounts until the buyer confirms inspection and delivery from our regional Lagos hubs.</p>
        
        <h3 className="text-white font-bold text-lg">2. Dispute Resolution Window</h3>
        <p>Buyers have a 48-hour window post-delivery to report any discrepancies. If items do not match catalog specs, our inspection team coordinates a secure return and full vault refund.</p>

        <h3 className="text-white font-bold text-lg">3. Merchant Payout Terms</h3>
        <p>Funds are released to verified merchants automatically upon successful delivery verification, ensuring absolute trust for both parties.</p>
      </div>
    </div>
  );
}