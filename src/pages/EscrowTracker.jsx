import React from 'react';

/**
 * BOLD.NG ESCROW VAULT TRACKER
 * Visualized financial accounting panel tracking active holding contracts.
 */
export default function EscrowTracker({ transactions }) {
  // Defensive fallbacks in case parent array is uninitialized
  const liveLedger = transactions || [];

  // Compute metrics from the active stream
  const activeHoldingTotal = liveLedger
    .filter(tx => tx.status === 'In Escrow Vault')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const completedPayoutTotal = liveLedger
    .filter(tx => tx.status === 'Completed')
    .reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <div className="max-w-5xl mx-auto my-6 px-4 space-y-8 text-white selection:bg-[#FF5A00]">
      
      {/* ECOSYSTEM OVERVIEW BANNER */}
      <div>
        <h2 className="text-3xl font-black tracking-tight text-left">Ecosystem Escrow Vaults</h2>
        <p className="text-xs text-slate-400 mt-1 text-left">
          Real-time tracking of clearing-house allocations. Funds remain fully fortified inside isolation nodes.
        </p>
      </div>

      {/* METRIC SUMMATION PANELS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-[#16223F] p-6 rounded-3xl border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none"></div>
          <span className="text-[9px] font-black tracking-widest text-[#FF5A00] uppercase block text-left">
            🔒 SECURED CAPITAL IN ESCROW
          </span>
          <p className="text-3xl font-mono font-black mt-3 text-left">
            ₦{activeHoldingTotal.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-400 mt-1 text-left">Currently isolated pending delivery clearance</p>
        </div>

        <div className="bg-[#16223F] p-6 rounded-3xl border border-slate-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>
          <span className="text-[9px] font-black tracking-widest text-emerald-400 uppercase block text-left">
            ✅ TOTAL DISBURSED PAYOUTS
          </span>
          <p className="text-3xl font-mono font-black mt-3 text-left">
            ₦{completedPayoutTotal.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-400 mt-1 text-left">Successfully wired out to verified vendors</p>
        </div>
      </div>

      {/* DETAILED TRANSACTION REGISTER TABLE */}
      <div className="bg-[#16223F] rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-slate-800/60 flex justify-between items-center">
          <h3 className="font-black text-sm uppercase tracking-wider text-slate-300">Vault Settlement Registry</h3>
          <span className="text-[10px] font-bold bg-[#0B132B] px-3 py-1 rounded-full border border-slate-700 text-slate-400">
            {liveLedger.length} Active Records
          </span>
        </div>

        {liveLedger.length === 0 ? (
          <div className="py-16 text-center text-slate-500 text-sm">
            No escrow transactions found in this deployment sequence.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse font-sans">
              <thead>
                <tr className="bg-[#0B132B]/60 text-[10px] font-black tracking-widest text-slate-400 uppercase border-b border-slate-800">
                  <th className="py-4 px-6">Vault ID</th>
                  <th className="py-4 px-6">Asset Item</th>
                  <th className="py-4 px-6">Settlement Value</th>
                  <th className="py-4 px-6 text-center">Operational Status</th>
                  <th className="py-4 px-6 text-right">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 text-xs font-medium text-slate-200">
                {liveLedger.map((tx) => {
                  const isInEscrow = tx.status === 'In Escrow Vault';
                  
                  return (
                    <tr key={tx.id} className="hover:bg-[#0B132B]/30 transition-colors group">
                      <td className="py-4 px-6 font-mono font-bold text-[#FF5A00] tracking-tight">
                        {tx.id}
                      </td>
                      <td className="py-4 px-6 font-bold text-white group-hover:text-[#FF5A00] transition-colors">
                        {tx.title}
                      </td>
                      <td className="py-4 px-6 font-mono font-black text-white">
                        ₦{tx.amount.toLocaleString()}
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className={`inline-block text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md ${
                          isInEscrow 
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                            : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        }`}>
                          {isInEscrow ? '🔒 ' : '🔓 '} {tx.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right font-mono text-slate-400">
                        {tx.date}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}