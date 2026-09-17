import React from 'react';

export default function MerchantMatrix({ onNavigate }) {
  const metrics = [
    { title: 'Total Gross Volume', value: '₦4,850,000', change: '+18.4%', status: 'positive' },
    { title: 'Active Escrow Vaults', value: '14 Orders', change: 'Secured', status: 'neutral' },
    { title: 'Fulfillment Success Rate', value: '98.2%', change: '+1.1%', status: 'positive' },
    { title: 'Vendor Tier Status', value: 'Verified Enterprise', change: 'Tier 1', status: 'accent' }
  ];

  const recentTransactions = [
    { id: 'TX-9482', title: 'Heavyweight Oversized Tees (x5)', amount: '125,000', status: 'In Escrow Vault', date: '2026-09-17' },
    { id: 'TX-9481', title: 'Synthetic Engine Oil 5W-30 (x2)', amount: '76,000', status: 'Completed', date: '2026-09-16' },
    { id: 'TX-9480', title: 'Bold.ng Signature Snapback (x10)', amount: '150,000', status: 'Completed', date: '2026-09-15' }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-white space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <span className="text-[10px] font-black tracking-widest text-[#FF5A00] uppercase">Analytics & Telemetry</span>
          <h1 className="text-3xl font-black mt-1">Merchant Matrix</h1>
        </div>
        <button 
          onClick={() => onNavigate('marketplace')} 
          className="text-xs bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-xl text-slate-300 hover:text-white transition-all cursor-pointer"
        >
          ← Back to Marketplace
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {metrics.map((metric, idx) => (
          <div key={idx} className="bg-[#16223F] p-6 rounded-3xl border border-slate-800 space-y-2 shadow-xl">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{metric.title}</p>
            <p className="text-2xl font-mono font-black">{metric.value}</p>
            <span className="inline-block text-[11px] font-bold text-emerald-400 bg-emerald-950/50 px-2.5 py-0.5 rounded-full border border-emerald-900">
              {metric.change}
            </span>
          </div>
        ))}
      </div>

      {/* Fulfillment Volume Log */}
      <div className="bg-[#16223F] p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
        <h3 className="text-sm font-black uppercase tracking-wider text-slate-300">Hub Fulfillment Volume Log</h3>
        <div className="space-y-3">
          {recentTransactions.map((tx, idx) => (
            <div key={idx} className="flex justify-between items-center bg-[#0B132B] p-4 rounded-2xl border border-slate-800/80">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold text-[#FF5A00]">{tx.id}</span>
                  <span className="text-xs text-slate-400">• {tx.date}</span>
                </div>
                <h4 className="font-bold text-sm text-white">{tx.title}</h4>
              </div>
              <div className="text-right">
                <span className="font-mono font-black text-white text-sm">₦{tx.amount}</span>
                <p className="text-[10px] text-slate-400 mt-0.5">{tx.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}