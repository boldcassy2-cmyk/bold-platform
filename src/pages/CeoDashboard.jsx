import React, { useState } from 'react';

/**
 * BOLD.NG CENTRAL COMMAND EXECUTIVE DASHBOARD
 * Exclusive administrator panel providing systemic control of platform clearances,
 * clearing-house reserves, and immediate vault overrides.
 */
export default function CeoDashboard({ transactions, setTransactions }) {
  const liveLedger = transactions || [];
  const [auditLog, setAuditLog] = useState([
    { time: '10:14', action: 'System integrity routine executed successfully.' }
  ]);

  // LIVE TELEMETRY CALCULATIONS
  const globalVolume = liveLedger.reduce((sum, tx) => sum + tx.amount, 0);
  const frozenVaultsCount = liveLedger.filter(tx => tx.status === 'In Escrow Vault' || tx.status === 'Hub Dispatched').length;
  
  // LOGISTICS DISPATCH DISTRIBUTION MATRIX
  const hubMetrics = {
    lagos: liveLedger.filter(tx => tx.hub?.includes('Lagos')).length,
    abuja: liveLedger.filter(tx => tx.hub?.includes('Abuja')).length,
    ph: liveLedger.filter(tx => tx.hub?.includes('Port Harcourt')).length
  };

  // SYSTEM INTERVENTION HOOK: AUTHORIZE IMMEDIATE PAYOUT DISBURSEMENT
  const handleImmediateDisbursement = (targetTxId) => {
    setTransactions(prevTx => 
      prevTx.map(tx => tx.id === targetTxId ? { ...tx, status: 'Completed' } : tx)
    );
    
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAuditLog(prev => [
      { time: timestamp, action: `CEO Override: Forced immediate payout clearance on ${targetTxId}` },
      ...prev
    ]);
  };

  // SYSTEM INTERVENTION HOOK: HALT & ISOLATE HIGH RISK ASSETS
  const handleSystemicHalt = (targetTxId) => {
    setTransactions(prevTx => 
      prevTx.map(tx => tx.id === targetTxId ? { ...tx, status: 'Halted by Admin' } : tx)
    );
    
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setAuditLog(prev => [
      { time: timestamp, action: `🚨 RISK INTERVENTION: Transaction ${targetTxId} frozen under audit` },
      ...prev
    ]);
  };

  return (
    <div className="max-w-6xl mx-auto my-6 px-4 space-y-8 text-white selection:bg-[#FF5A00]">
      
      {/* EXECUTIVE IDENTITY BANNER */}
      <div className="bg-[#16223F] border border-slate-800 rounded-3xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="text-left relative z-10">
          <span className="text-[9px] bg-amber-500 text-slate-950 font-black tracking-widest px-2.5 py-0.5 rounded uppercase">
            Root Administrator
          </span>
          <h2 className="text-3xl font-black tracking-tight mt-1">Ecosystem Central Command</h2>
          <p className="text-xs text-slate-400 mt-0.5">Global ledger administration matrix and risk mediation grid.</p>
        </div>
        <div className="bg-[#0B132B] px-4 py-2 rounded-2xl border border-slate-800 text-right font-mono text-xs">
          <span className="text-slate-500">System Status:</span> <span className="text-emerald-400 font-bold">GRID ONLINE</span>
        </div>
      </div>

      {/* CORE FINANCIAL OVERVIEW TELEMETRY */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-[#16223F] p-6 rounded-3xl border border-slate-800 text-left">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total Ecosystem Gross Volume</span>
          <h3 className="text-3xl font-mono font-black text-white mt-2">₦{globalVolume.toLocaleString()}</h3>
          <p className="text-[11px] text-slate-500 mt-1">Aggregated platform escrow transactions</p>
        </div>

        <div className="bg-[#16223F] p-6 rounded-3xl border border-slate-800 text-left">
          <span className="text-[10px] font-black text-amber-400 uppercase tracking-wider">Active Isolated Vaults</span>
          <h3 className="text-3xl font-mono font-black text-amber-400 mt-2">{frozenVaultsCount} Nodes</h3>
          <p className="text-[11px] text-slate-500 mt-1">Funds currently resting in escrow safety cells</p>
        </div>

        <div className="bg-[#16223F] p-6 rounded-3xl border border-slate-800 text-left">
          <span className="text-[10px] font-black text-blue-400 uppercase tracking-wider">Logistics Hub Pipeline Load</span>
          <div className="grid grid-cols-3 gap-2 mt-4 font-mono text-center text-xs">
            <div className="bg-[#0B132B] p-2 rounded-xl border border-slate-800">
              <span className="text-[9px] text-slate-500 block uppercase font-sans font-bold">LOS</span>
              <span className="text-white font-black">{hubMetrics.lagos}</span>
            </div>
            <div className="bg-[#0B132B] p-2 rounded-xl border border-slate-800">
              <span className="text-[9px] text-slate-500 block uppercase font-sans font-bold">ABV</span>
              <span className="text-white font-black">{hubMetrics.abuja}</span>
            </div>
            <div className="bg-[#0B132B] p-2 rounded-xl border border-slate-800">
              <span className="text-[9px] text-slate-500 block uppercase font-sans font-bold">PHC</span>
              <span className="text-white font-black">{hubMetrics.ph}</span>
            </div>
          </div>
        </div>
      </div>

      {/* LOWER SPLIT ARCHITECTURE: COMMAND SWITCH GRID & AUDIT RUNWAY */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* INTERACTIVE CENTRAL INTERVENTION GRID */}
        <div className="lg:col-span-2 bg-[#16223F] border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="p-5 border-b border-slate-800/60 bg-[#0B132B]/20 text-left">
            <h4 className="font-black text-xs uppercase tracking-widest text-slate-300">Platform Transaction Matrix Override</h4>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0B132B]/60 text-[9px] font-black tracking-widest text-slate-400 uppercase border-b border-slate-800">
                  <th className="py-3 px-4">Transaction Details</th>
                  <th className="py-3 px-4">Settlement Value</th>
                  <th className="py-3 px-4">Status Flag</th>
                  <th className="py-3 px-4 text-right">Administrative Intervention</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 text-xs font-medium">
                {liveLedger.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-12 text-center text-slate-500">No telemetry streams captured on the network.</td>
                  </tr>
                ) : (
                  liveLedger.map((tx) => {
                    const isClosed = tx.status === 'Completed';
                    const isHalted = tx.status === 'Halted by Admin';

                    return (
                      <tr key={tx.id} className="hover:bg-[#0B132B]/20 transition-colors">
                        <td className="py-4 px-4 text-left">
                          <span className="font-mono font-black text-[#FF5A00] block">{tx.id}</span>
                          <span className="font-bold text-white block line-clamp-1 mt-0.5">{tx.title}</span>
                        </td>
                        <td className="py-4 px-4 font-mono font-bold text-white">₦{tx.amount.toLocaleString()}</td>
                        <td className="py-4 px-4">
                          <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                            isClosed ? 'bg-emerald-500/10 text-emerald-400' : isHalted ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-400 animate-pulse'
                          }`}>
                            {tx.status}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          {!isClosed && !isHalted ? (
                            <div className="flex justify-end gap-2">
                              <button 
                                onClick={() => handleImmediateDisbursement(tx.id)}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                              >
                                Payout
                              </button>
                              <button 
                                onClick={() => handleSystemicHalt(tx.id)}
                                className="bg-red-950/40 hover:bg-red-950/80 text-red-400 border border-red-900/50 text-[10px] font-black uppercase tracking-wider px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                              >
                                Freeze
                              </button>
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-500 font-mono italic">Override Locked</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ADMINISTRATIVE SYSTEM AUDIT TRACK RUNWAY */}
        <div className="lg:col-span-1 bg-[#16223F] border border-slate-800 rounded-3xl p-6 space-y-4">
          <div className="border-b border-slate-800/60 pb-3 text-left">
            <h4 className="font-black text-xs uppercase tracking-widest text-slate-300">CEO Systemic Security Audit</h4>
            <p className="text-[10px] text-slate-500">Live sequential capture of administrative interventions</p>
          </div>

          <div className="space-y-4 max-h-[320px] overflow-y-auto pr-1 text-left font-mono text-[11px]">
            {auditLog.map((log, index) => (
              <div key={index} className="bg-[#0B132B] p-3 rounded-xl border border-slate-800/80 leading-relaxed text-slate-300">
                <span className="text-[#FF5A00] font-bold block mb-1">⏰ [{log.time}]</span>
                {log.action}
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}