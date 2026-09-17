import React from 'react';

export default function TermsOfProtocol({ onNavigate }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 text-white space-y-8">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <span className="text-[10px] font-black tracking-widest text-[#FF5A00] uppercase">Legal & Compliance</span>
          <h1 className="text-3xl font-black mt-1">Terms of Protocol</h1>
        </div>
        <button onClick={() => onNavigate('marketplace')} className="text-xs bg-slate-800 px-4 py-2 rounded-xl text-slate-300 hover:text-white cursor-pointer">
          ← Back to Marketplace
        </button>
      </div>

      <div className="bg-[#16223F] p-8 rounded-3xl border border-slate-800 space-y-6 text-slate-300 text-sm leading-relaxed">
        <h3 className="text-white font-bold text-lg">1. Corporate Compliance</h3>
        <p>bold.ng operates under the laws of the Federal Republic of Nigeria and complies with Corporate Affairs Commission (CAC) regulations for computer programming, multi-vendor electronic commerce, and escrow consultancy.</p>

        <h3 className="text-white font-bold text-lg">2. User Conduct</h3>
        <p>By accessing our marketplace nodes, vendors and buyers agree to provide accurate registration information, maintain professional conduct, and utilize our escrow vault for all transaction settlements.</p>
      </div>
    </div>
  );
}