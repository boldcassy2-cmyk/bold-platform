import React, { useState } from 'react';

export default function EscrowTracker() {
  const [searchTxId, setSearchTxId] = useState('');
  const [trackedTx, setTrackedTx] = useState(null);
  const [searched, setSearched] = useState(false);

  // Mock Global Database of Secure Escrow Transactions
  const mockEscrowDatabase = {
    "TX-8839-LG": {
      id: "TX-8839-LG",
      item: "Heavyweight Boxy Hoodie (Vintage Black)",
      amount: 28000,
      buyer: "Deji A.",
      seller: "Bold Enterprise",
      status: "inspection", // milestone status node
      dateInitiated: "2026-06-01",
      estRelease: "Within 24 Hours"
    },
    "TX-4491-ABJ": {
      id: "TX-4491-ABJ",
      item: "MacBook Pro M2 (16GB/512GB)",
      amount: 1850000,
      buyer: "Chidi O.",
      seller: "Tech Vault NG",
      status: "completed",
      dateInitiated: "2026-05-28",
      estRelease: "Funds Disbursed"
    },
    "TX-1029-LKK": {
      id: "TX-1029-LKK",
      item: "Toyota Camry 2018 SE",
      amount: 14500000,
      buyer: "Alhaji Musa",
      seller: "Bold Enterprise",
      status: "holding",
      dateInitiated: "2026-06-02",
      estRelease: "Awaiting Shipment Courier"
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearched(true);
    const cleanId = searchTxId.trim().toUpperCase();
    if (mockEscrowDatabase[cleanId]) {
      setTrackedTx(mockEscrowDatabase[cleanId]);
    } else {
      setTrackedTx(null);
    }
  };

  return (
    <main className="max-w-4xl mx-auto my-6 px-4 space-y-6 animate-fadeIn text-white">
      
      {/* HEADER PROTOCOL CARD */}
      <div className="bg-[#16223F] border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[9px] bg-[#FF5A00] text-white font-black tracking-widest uppercase px-2 py-0.5 rounded">
            🛡️ BOLD SECURE VAULT ARRAYS
          </span>
          <h1 className="text-2xl font-black text-white mt-1">Escrow Ledger Audit Stream</h1>
          <p className="text-slate-400 text-xs mt-0.5 font-medium">Verify the security status of capital commitments across public operational nodes in real time.</p>
        </div>
      </div>

      {/* SEARCH CONTROL DECK */}
      <div className="bg-[#16223F] p-6 rounded-3xl shadow-xl border border-slate-800">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-1.5 tracking-wider">
              Input Escrow Reference Hash / Transaction ID
            </label>
            <input 
              type="text"
              value={searchTxId}
              onChange={(e) => setSearchTxId(e.target.value)}
              placeholder="e.g., TX-8839-LG, TX-4491-ABJ, TX-1029-LKK"
              className="w-full px-4 py-3 rounded-xl border border-slate-700 text-xs font-mono font-bold bg-[#0B132B] text-white focus:outline-none focus:border-[#FF5A00] tracking-widest uppercase"
            />
          </div>
          <button
            type="submit"
            className="sm:mt-5 bg-[#FF5A00] text-white font-black text-xs uppercase tracking-wider px-6 py-3 sm:py-0 rounded-xl border-none cursor-pointer hover:brightness-110 transition h-11 shrink-0 self-end w-full sm:w-auto"
          >
            🔍 Audit Pipeline
          </button>
        </form>
      </div>

      {/* TRACKING DISPATCH VIEW SCREEN */}
      {searched && trackedTx ? (
        <div className="bg-[#16223F] p-6 rounded-3xl shadow-xl border border-slate-800 space-y-6 animate-fadeIn">
          
          {/* META METRIC BAR */}
          <div className="flex flex-wrap justify-between items-center border-b border-slate-800 pb-4 gap-2">
            <div>
              <span className="text-[10px] font-mono text-slate-400 font-bold">MUTABLE RECORD NODE:</span>
              <h3 className="text-base font-black text-white font-mono">{trackedTx.id}</h3>
            </div>
            <div className="text-right">
              <span className="text-[9px] text-slate-400 font-black block uppercase">Escrow Valuation</span>
              <span className="text-lg font-black text-[#FF5A00] font-mono">₦{trackedTx.amount.toLocaleString()}</span>
            </div>
          </div>

          {/* ASSET SPECIFICATION GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#0B132B] p-4 rounded-2xl border border-slate-900 text-xs">
            <div className="space-y-1">
              <p className="text-slate-400 font-medium">📦 Protected Asset Entity:</p>
              <p className="text-white font-black">{trackedTx.item}</p>
            </div>
            <div className="space-y-1">
              <p className="text-slate-400 font-medium">🗓️ Initialized Timestamp:</p>
              <p className="text-white font-mono font-bold">{trackedTx.dateInitiated}</p>
            </div>
            <div className="space-y-1 pt-2 sm:pt-0 border-t sm:border-none border-slate-800">
              <p className="text-slate-400 font-medium">👤 Authenticated Buyer Node:</p>
              <p className="text-white font-bold">{trackedTx.buyer}</p>
            </div>
            <div className="space-y-1 pt-2 sm:pt-0 border-t sm:border-none border-slate-800">
              <p className="text-slate-400 font-medium">🏬 Target Merchant Node:</p>
              <p className="text-white font-bold">{trackedTx.seller}</p>
            </div>
          </div>

          {/* VISUAL PIPELINE MILESTONE TRACKER STEPS */}
          <div className="space-y-3">
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">
              Milestone Security Progress Matrix
            </label>
            
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-center text-[10px] font-black uppercase tracking-wider">
              
              {/* STEP 1 */}
              <div className={`p-3 rounded-xl border ${
                trackedTx.status !== 'failed' ? 'bg-emerald-950/30 text-emerald-400 border-emerald-900/60' : 'bg-[#0B132B] text-slate-500 border-slate-900'
              }`}>
                💰 1. Secured Vault
              </div>

              {/* STEP 2 */}
              <div className={`p-3 rounded-xl border ${
                trackedTx.status === 'inspection' || trackedTx.status === 'completed' 
                  ? 'bg-emerald-950/30 text-emerald-400 border-emerald-900/60' 
                  : trackedTx.status === 'holding' ? 'bg-amber-950/30 text-amber-400 border-amber-900/60 animate-pulse' : 'bg-[#0B132B] text-slate-500 border-slate-900'
              }`}>
                🚚 2. Dispatched
              </div>

              {/* STEP 3 */}
              <div className={`p-3 rounded-xl border ${
                trackedTx.status === 'completed' 
                  ? 'bg-emerald-950/30 text-emerald-400 border-emerald-900/60' 
                  : trackedTx.status === 'inspection' ? 'bg-amber-950/30 text-amber-400 border-amber-900/60 animate-pulse' : 'bg-[#0B132B] text-slate-500 border-slate-900'
              }`}>
                🔍 3. In Inspection
              </div>

              {/* STEP 4 */}
              <div className={`p-3 rounded-xl border ${
                trackedTx.status === 'completed' ? 'bg-emerald-500 text-slate-950 border-emerald-500' : 'bg-[#0B132B] text-slate-500 border-slate-900'
              }`}>
                🏁 4. Released
              </div>

            </div>
          </div>

          {/* DYNAMIC SETTILEMENT MESSAGE FOOTER */}
          <div className="p-3.5 bg-[#0B132B] border border-slate-900 rounded-xl flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-400">Next Clearance Vector:</span>
            <span className={`font-bold ${trackedTx.status === 'completed' ? 'text-emerald-400' : 'text-amber-400'}`}>
              ⏳ {trackedTx.estRelease}
            </span>
          </div>

        </div>
      ) : searched ? (
        /* ACCOUNT MISMATCH SCREEN */
        <div className="bg-[#16223F] rounded-3xl p-12 text-center border border-slate-800 max-w-md mx-auto animate-fadeIn">
          <p className="text-3xl">📭</p>
          <h4 className="text-sm font-black text-white uppercase mt-2">Transaction Identifier Not Found</h4>
          <p className="text-xs text-slate-400 mt-1 leading-relaxed">
            That hash parameter is missing from the public ledger matrix. Double check the character string capitalization or confirm execution paths with the vendor.
          </p>
        </div>
      ) : (
        /* INITIAL BLANK HUD GUIDE */
        <div className="bg-[#16223F]/60 rounded-3xl p-8 text-center border border-slate-800/60 max-w-md mx-auto text-xs text-slate-400 font-medium">
          💡 Try using one of our pre-seeded test keys above to evaluate the visual milestones framework!
        </div>
      )}

    </main>
  );
}