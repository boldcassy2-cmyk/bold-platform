import React, { useState } from 'react';

export default function CeoDashboard() {
  // Global Platform Metrics Node
  const [platformStats, setPlatformStats] = useState({
    totalEscrowVolume: 24850000,
    activeMerchants: 142,
    disputedClaims: 2,
    disbursedPayouts: 18900000
  });

  // Pending Verifications Queue Mock Data
  const [pendingMerchants, setPendingMerchants] = useState([
    { id: 'M-9921', name: 'Alaba Gadget Logistics', niche: 'Premium Gadgetry & Electronics', date: '2026-06-02' },
    { id: 'M-9924', name: 'Gidi Streetwear Collective', niche: "Men's Streetwear & Apparel", date: '2026-06-02' }
  ]);

  const approveMerchant = (id, name) => {
    setPendingMerchants(prev => prev.filter(m => m.id !== id));
    setPlatformStats(prev => ({ ...prev, activeMerchants: prev.activeMerchants + 1 }));
    alert(`Administrative Command Executed: ${name} verified and deployed to main marketplace index router.`);
  };

  return (
    <main className="max-w-6xl mx-auto my-6 px-4 space-y-6 animate-fadeIn text-white">
      
      {/* CEO BANNER BRANDING MATRIX */}
      <div className="bg-[#16223F] border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF5A00]/5 rounded-full transform translate-x-24 -translate-y-24" />
        <div className="relative z-10">
          <span className="text-[9px] bg-[#FF5A00] text-white font-black tracking-widest uppercase px-2 py-0.5 rounded">
            👑 ROBUST ROOT AUTHORITY ACCESS
          </span>
          <h1 className="text-2xl font-black text-white mt-1">CEO Master Command Center</h1>
          <p className="text-slate-400 text-xs mt-0.5 font-medium">Global infrastructure analytics, escrow vault clearing, and merchant node vetting registries.</p>
        </div>
        <div className="bg-[#0B132B] border border-slate-800 px-4 py-2.5 rounded-2xl text-xs font-bold shrink-0">
          <span className="text-slate-400">Operator Identity:</span> <span className="text-[#FF5A00]">Dedon Cassidy (CEO)</span>
        </div>
      </div>

      {/* METRIC SCORECARD ARRAYS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* STAT 1 */}
        <div className="bg-[#16223F] p-5 rounded-2xl border border-slate-800 shadow-lg">
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Total Vault Capital Lock</p>
          <h3 className="text-xl font-black text-white font-mono mt-1">₦{platformStats.totalEscrowVolume.toLocaleString()}</h3>
          <span className="text-[9px] text-emerald-400 font-bold block mt-1">🔒 100% Escrow Insurance Ratio</span>
        </div>

        {/* STAT 2 */}
        <div className="bg-[#16223F] p-5 rounded-2xl border border-slate-800 shadow-lg">
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Disbursed Vendor Capital</p>
          <h3 className="text-xl font-black text-emerald-400 font-mono mt-1">₦{platformStats.disbursedPayouts.toLocaleString()}</h3>
          <span className="text-[9px] text-slate-400 font-semibold block mt-1">⚡ Instant Settlement Clearance Loops</span>
        </div>

        {/* STAT 3 */}
        <div className="bg-[#16223F] p-5 rounded-2xl border border-slate-800 shadow-lg">
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Active Verified Channels</p>
          <h3 className="text-xl font-black text-white font-mono mt-1">{platformStats.activeMerchants}</h3>
          <span className="text-[9px] text-amber-500 font-bold block mt-1">🔥 Escalating Network Density</span>
        </div>

        {/* STAT 4 */}
        <div className="bg-[#16223F] p-5 rounded-2xl border border-slate-800 shadow-lg">
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-wider">Active System Escalations</p>
          <h3 className={`text-xl font-black font-mono mt-1 ${platformStats.disputedClaims > 0 ? 'text-rose-400 animate-pulse' : 'text-slate-400'}`}>
            {platformStats.disputedClaims}
          </h3>
          <span className="text-[9px] text-slate-400 font-semibold block mt-1">⚖️ Neutral Arbitrage Matrix Hold</span>
        </div>

      </div>

      {/* LOWER SECTION: APPROVAL PIPELINE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* MERCHANT VETTING CONTAINER */}
        <div className="lg:col-span-2 bg-[#16223F] p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-sm font-black uppercase tracking-wider border-b border-slate-800 pb-3 flex items-center justify-between">
            <span>📋 Incoming Merchant Nodes Vetting Queue</span>
            <span className="text-xs bg-[#0B132B] px-2.5 py-0.5 rounded-full font-mono font-bold text-slate-400">{pendingMerchants.length} Pending</span>
          </h3>

          {pendingMerchants.length > 0 ? (
            <div className="space-y-3">
              {pendingMerchants.map((merchant) => (
                <div key={merchant.id} className="bg-[#0B132B] p-4 rounded-xl border border-slate-900 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 transition hover:border-slate-800">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-black text-white">{merchant.name}</h4>
                      <span className="text-[9px] font-mono text-slate-500 font-bold bg-slate-950 px-1.5 py-0.2 rounded">{merchant.id}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium">Niche: {merchant.niche}</p>
                    <p className="text-[9px] text-slate-500 font-mono">Registry Submission: {merchant.date}</p>
                  </div>
                  
                  <button
                    onClick={() => approveMerchant(merchant.id, merchant.name)}
                    className="bg-[#FF5A00] text-white font-black text-[10px] uppercase tracking-wider px-4 py-2.5 rounded-lg border-none cursor-pointer hover:brightness-110 transition shrink-0 w-full sm:w-auto"
                  >
                    ⚡ Authorize Store Node
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-[#0B132B] rounded-2xl border border-dashed border-slate-800">
              <p className="text-2xl">🎉</p>
              <p className="text-xs font-bold text-slate-400 uppercase mt-1">Vetting Queue Clear</p>
              <p className="text-[10px] text-slate-500 mt-0.5">All global application instances successfully routed to the production registry array.</p>
            </div>
          )}
        </div>

        {/* SECURITY & RISK PARAMS OVERRIDE CARD */}
        <div className="bg-[#16223F] p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
          <h3 className="text-sm font-black uppercase tracking-wider border-b border-slate-800 pb-3 text-white">
            🛠️ Operational System Control Toggles
          </h3>

          <div className="space-y-2.5 text-xs font-semibold">
            <button 
              onClick={() => alert("Platform-wide listing updates securely frozen. Marketplace running on historical static nodes.")}
              className="w-full bg-[#0B132B] text-slate-300 border border-slate-800 hover:border-amber-600 rounded-xl py-3 px-4 text-left flex items-center justify-between transition group"
            >
              <span>⏸️ Freeze Marketplace Registry</span>
              <span className="text-[9px] bg-amber-950 text-amber-400 px-1.5 py-0.2 rounded uppercase font-black tracking-wide">Maintenance</span>
            </button>

            <button 
              onClick={() => alert("Global Escrow Core Ledger snapshotted and encrypted successfully.")}
              className="w-full bg-[#0B132B] text-slate-300 border border-slate-800 hover:border-emerald-600 rounded-xl py-3 px-4 text-left flex items-center justify-between transition"
            >
              <span>💾 Snapshot Escrow Ledger Core</span>
              <span className="text-[9px] bg-emerald-950 text-emerald-400 px-1.5 py-0.2 rounded uppercase font-black tracking-wide">Backup</span>
            </button>

            <button 
              onClick={() => {
                const multi = prompt("Input updated global transaction buffer factor (e.g., 1.5):", "1.0");
                if (multi) alert(`Global transactional pipeline buffer re-indexed to factor level: ${multi}`);
              }}
              className="w-full bg-[#0B132B] text-slate-300 border border-slate-800 hover:border-[#FF5A00] rounded-xl py-3 px-4 text-left flex items-center justify-between transition"
            >
              <span>⚙️ Tune Pipeline Performance Factor</span>
              <span className="text-[9px] bg-slate-950 text-slate-400 px-1.5 py-0.2 rounded uppercase font-black tracking-wide font-mono">v2.0</span>
            </button>
          </div>
        </div>

      </div>

    </main>
  );
}