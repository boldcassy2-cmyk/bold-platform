import React from 'react';

export default function Store({ merchantStore, items = [], setCurrentPage }) {
  // Filter items to simulate what this specific merchant owns (or show all currently active live items)
  const vendorItems = items; 
  
  // Dynamic Ledger Calculations Matrix
  const activeCount = vendorItems.length;
  const totalEscrowVolume = vendorItems.reduce((acc, item) => acc + item.price, 0);
  
  // Calculate average asset valuation node smoothly
  const averageValuation = activeCount > 0 ? Math.round(totalEscrowVolume / activeCount) : 0;

  return (
    <main className="max-w-6xl mx-auto my-6 px-4 space-y-6 animate-fadeIn text-white">
      
      {/* HUB MASTER BRAND BANNER */}
      <div className="bg-[#16223F] border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF5A00]/5 rounded-full transform translate-x-10 -translate-y-10" />
        
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[9px] bg-[#FF5A00] text-white font-black tracking-widest uppercase px-2 py-0.5 rounded">
              Merchant Node Active
            </span>
            <span className="text-[9px] bg-emerald-500 text-slate-950 font-black tracking-widest uppercase px-2 py-0.5 rounded flex items-center gap-1">
              ✓ Verified Escrow Trusted
            </span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tight">{merchantStore.name || 'Bold Merchant Account'}</h1>
          <p className="text-slate-400 text-xs font-medium">
            Core Segment Focus: <span className="text-white font-bold">{merchantStore.niche || "Men's Streetwear & Commerce"}</span> | Operational Base: <span className="text-white font-bold">{merchantStore.location || "Lagos, NG"}</span>
          </p>
        </div>

        {/* INTERACTION ACTION ROUTERS */}
        <div className="flex flex-wrap gap-2 shrink-0 w-full md:w-auto">
          <button 
            onClick={() => setCurrentPage('addproduct')}
            className="flex-1 md:flex-none bg-[#FF5A00] text-white font-black text-xs uppercase tracking-wider px-5 py-3 rounded-xl border-none cursor-pointer shadow-lg hover:brightness-110 transition"
          >
            ➕ Onboard Asset
          </button>
          <button 
            onClick={() => {
              const message = encodeURIComponent(`Hello Bold.ng Support, I am the manager of ${merchantStore.name || 'Bold Merchant'}. I want to request an escrow payout verification check.`);
              window.open(`https://wa.me/${merchantStore.whatsapp || '2348000000000'}?text=${message}`, '_blank');
            }}
            className="flex-1 md:flex-none bg-emerald-600 text-white font-black text-xs uppercase tracking-wider px-5 py-3 rounded-xl border-none cursor-pointer shadow-lg hover:bg-emerald-700 transition flex items-center justify-center gap-1"
          >
            💬 Support Link Node
          </button>
        </div>
      </div>

      {/* METRICS ANALYTICS PANEL ROW */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* CARD 1: ACTIVE PIPELINES */}
        <div className="bg-[#16223F] p-5 rounded-2xl border border-slate-800 space-y-1 shadow-md">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Active Catalog Entities</p>
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-3xl font-mono font-black text-white">{activeCount}</span>
            <span className="text-xs font-bold text-slate-500 uppercase">Live Listings</span>
          </div>
          <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-800/60 font-medium">Indexed within global search directory matrix.</p>
        </div>

        {/* CARD 2: TOTAL VALUATION VOLUME */}
        <div className="bg-[#16223F] p-5 rounded-2xl border border-slate-800 space-y-1 shadow-md">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Gross Pipeline Vault Valuation</p>
          <div className="flex items-baseline gap-1 pt-1">
            <span className="text-2xl font-mono font-black text-[#FF5A00]">₦{totalEscrowVolume.toLocaleString()}</span>
          </div>
          <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-800/60 font-medium">Total commitment liability currently queryable.</p>
        </div>

        {/* CARD 3: AVERAGE METRIC BOUND */}
        <div className="bg-[#16223F] p-5 rounded-2xl border border-slate-800 space-y-1 shadow-md">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Mean Entity Asset Value</p>
          <div className="flex items-baseline gap-1 pt-1">
            <span className="text-2xl font-mono font-black text-white">₦{averageValuation.toLocaleString()}</span>
          </div>
          <p className="text-[10px] text-slate-400 pt-1 border-t border-slate-800/60 font-medium">Average cost ratio per assigned listing item.</p>
        </div>

      </div>

      {/* LOWER CONTENT PANEL GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COMPONENT: VENDOR LIVE LISTING FEED MANIFEST */}
        <div className="lg:col-span-8 bg-[#16223F] p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="text-xs font-black text-[#FF5A00] uppercase tracking-wider">
              📦 Associated Store Inventory Ingestion
            </h3>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest bg-[#0B132B] px-2.5 py-1 rounded border border-slate-800">
              {activeCount} Items Tracked
            </span>
          </div>

          {vendorItems.length > 0 ? (
            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {vendorItems.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-[#0B132B] p-4 rounded-2xl border border-slate-900 hover:border-slate-800 transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto overflow-hidden">
                    <span className="text-3xl bg-[#16223F] border border-slate-800 p-2.5 rounded-xl shrink-0">
                      {item.img}
                    </span>
                    <div className="overflow-hidden">
                      <span className="text-[8px] bg-slate-800 text-slate-300 font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
                        {item.category}
                      </span>
                      <h4 className="text-xs font-black text-white truncate mt-1 leading-tight">{item.title}</h4>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5 font-medium">📍 {item.location} | {item.meta}</p>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center w-full sm:w-auto shrink-0 border-t sm:border-none border-slate-900 pt-2 sm:pt-0">
                    <span className="text-[9px] text-slate-400 uppercase font-black tracking-wider block sm:hidden">Valuation</span>
                    <span className="text-xs font-black text-[#FF5A00] font-mono">₦{item.price.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-[#0B132B] rounded-2xl border border-slate-900 space-y-2">
              <span className="text-2xl block">📭</span>
              <h4 className="text-xs font-black text-white uppercase tracking-wider">Inventory Array Vault Empty</h4>
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto">You haven't added any products to the marketplace directory yet using this deployment session.</p>
            </div>
          )}
        </div>

        {/* RIGHT COMPONENT: ESCROW COMPLIANCE COMPLIANCE MATRIX */}
        <div className="lg:col-span-4 bg-[#16223F] p-5 rounded-3xl border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-xs font-black text-[#FF5A00] uppercase tracking-wider border-b border-slate-800 pb-2">
            🛡️ Escrow Payout Audit Node
          </h3>

          <div className="space-y-3 text-xs font-medium">
            <div className="bg-[#0B132B] p-3 rounded-xl border border-slate-900 space-y-1">
              <span className="block text-[8px] text-slate-400 font-black uppercase">Fulfillment Compliance Rate</span>
              <span className="text-sm font-mono font-black text-emerald-400">100% Elite Tier</span>
            </div>
            
            <div className="bg-[#0B132B] p-3 rounded-xl border border-slate-900 space-y-1">
              <span className="block text-[8px] text-slate-400 font-black uppercase">Pending Holding Capital Vaults</span>
              <span className="text-sm font-mono font-black text-amber-400">₦0.00 Ledger Balance</span>
            </div>

            <div className="p-3 bg-[#0B132B]/50 rounded-xl border border-slate-900 text-[10px] text-slate-400 leading-relaxed font-medium">
              💡 <span className="text-white font-bold">Payout Regulation:</span> Payout vectors automatically disburse immediately into your designated corporate settlement node once the buyer executes the inspection verification sign-off logic clearance payload.
            </div>
          </div>
        </div>

      </div>

    </main>
  );
}