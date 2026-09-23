import React from 'react';

export default function EscrowGuidelines({ setCurrentPage }) {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 text-white font-sans">
      <div className="bg-[#16223F] border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-[#FF5A00] bg-[#FF5A00]/10 px-3 py-1 rounded-full border border-[#FF5A00]/20 font-mono">
            Standard Operating Procedures
          </span>
          <h1 className="text-3xl font-black uppercase tracking-tight text-white">
            Escrow Inspection & Dispute Guidelines
          </h1>
          <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Ensuring absolute transparency, fair dispute resolution, and secure payouts across Bold.ng Marketplace.
          </p>
        </div>

        {/* Content Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
          <div className="bg-[#0B132B] p-6 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="text-base font-bold text-[#FF5A00] uppercase">1. Buyer Inspection Window</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Buyers are granted a mandatory inspection period upon receiving physical goods or digital services. During this window, verify specifications against the vendor's listing description.
            </p>
          </div>

          <div className="bg-[#0B132B] p-6 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="text-base font-bold text-[#FF5A00] uppercase">2. Milestone & Service Release</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              For professional services, home repairs, or digital orders, milestone approvals permit fractional escrow releases upon verified completion of agreed targets.
            </p>
          </div>

          <div className="bg-[#0B132B] p-6 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="text-base font-bold text-[#FF5A00] uppercase">3. Dispute Mediation Protocol</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              If an item is defective or doesn't match descriptions, raise a dispute before confirming delivery. Platform administrators will review telemetry logs to mediate.
            </p>
          </div>

          <div className="bg-[#0B132B] p-6 rounded-2xl border border-slate-800 space-y-3">
            <h3 className="text-base font-bold text-[#FF5A00] uppercase">4. Automatic Payout Finality</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              If no dispute is lodged within the stipulated timeframe after confirmed courier drop-off, escrow automatically clears the transaction for vendor settlement.
            </p>
          </div>
        </div>

        {/* Footer Action */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400">
            Governed under the operational terms of Bold.ng Marketplace.
          </p>
          {typeof setCurrentPage === 'function' && (
            <button
              type="button"
              onClick={() => setCurrentPage('marketplace')}
              className="bg-[#FF5A00] hover:bg-[#e04f00] text-white font-black text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition cursor-pointer border-none shadow-lg shadow-orange-600/20"
            >
              Return to Marketplace
            </button>
          )}
        </div>

      </div>
    </div>
  );
}