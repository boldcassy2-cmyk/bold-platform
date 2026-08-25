import React, { useState } from 'react';

/**
 * BOLD.NG ENTERPRISE MERCHANT DASHBOARD
 * Advanced architectural console tracking asset yields, ledger clearances, and processing corridors.
 */
export default function Store({ merchantStore, items, transactions, setCurrentPage }) {
  const activeInventory = items || [];
  const activeTransactions = transactions || [];
  const [filterCategory, setFilterCategory] = useState('all');

  // CORE FINANCIAL METRICS CALCULATIONS
  const totalGmv = activeTransactions.reduce((sum, tx) => sum + tx.amount, 0);
  
  const processingEscrow = activeTransactions
    .filter(tx => tx.status !== 'Completed')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const clearedPayouts = activeTransactions
    .filter(tx => tx.status === 'Completed')
    .reduce((sum, tx) => sum + tx.amount, 0);

  // Filter evaluation logic
  const filteredInventory = filterCategory === 'all' 
    ? activeInventory 
    : activeInventory.filter(item => item.category?.toLowerCase() === filterCategory.toLowerCase());

  return (
    <div className="max-w-6xl mx-auto my-6 px-4 space-y-8 text-white selection:bg-[#FF5A00]">
      
      {/* VENDOR EXECUTIVE TELEMETRY BAR */}
      <div className="bg-[#16223F] border border-slate-800 rounded-3xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#FF5A00]/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="text-left relative z-10">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-black tracking-tight">{merchantStore.name || 'Bold Enterprise'}</h2>
            <span className="text-[9px] bg-[#FF5A00]/10 text-[#FF5A00] font-black tracking-widest px-2.5 py-0.5 rounded border border-[#FF5A00]/20 uppercase">
              {merchantStore.status || 'PRO MERCHANT'}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Sector Matrix: <span className="text-slate-300 font-medium">{merchantStore.niche}</span> | Base Node: <span className="text-slate-300 font-medium">{merchantStore.location}</span>
          </p>
        </div>
        <button 
          onClick={() => setCurrentPage('addproduct')}
          className="bg-[#FF5A00] text-white text-xs font-black uppercase tracking-widest px-6 py-3.5 rounded-xl hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-[#FF5A00]/10 whitespace-nowrap"
        >
          ➕ Dispatch New Inventory
        </button>
      </div>

      {/* METRIC ACCOUNTING BLOCKS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-[#16223F] p-6 rounded-3xl border border-slate-800/80 text-left">
          <span className="text-[9px] text-slate-400 font-black tracking-widest uppercase">GROSS TRANSACTION VALUE (GTV)</span>
          <h3 className="text-2xl font-mono font-black text-white mt-2">₦{totalGmv.toLocaleString()}</h3>
          <div className="w-full bg-slate-800 h-1 rounded-full mt-4 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-[#FF5A00] h-full w-[72%]"></div>
          </div>
        </div>

        <div className="bg-[#16223F] p-6 rounded-3xl border border-slate-800/80 text-left">
          <span className="text-[9px] text-amber-400 font-black tracking-widest uppercase">⚠️ SECURED VAULT CONTAINMENT</span>
          <h3 className="text-2xl font-mono font-black text-amber-400 mt-2">₦{processingEscrow.toLocaleString()}</h3>
          <p className="text-[10px] text-slate-500 mt-2 font-medium">Locked inside escrow processing pipelines</p>
        </div>

        <div className="bg-[#16223F] p-6 rounded-3xl border border-slate-800/80 text-left">
          <span className="text-[9px] text-emerald-400 font-black tracking-widest uppercase">✅ TOTAL DISBURSED RESERVES</span>
          <h3 className="text-2xl font-mono font-black text-emerald-400 mt-2">₦{clearedPayouts.toLocaleString()}</h3>
          <p className="text-[10px] text-slate-500 mt-2 font-medium">Cleared directly to First Bank settlement node</p>
        </div>
      </div>

      {/* LOWER ARCHITECTURE: TRACKING RUNWAY & INVENTORY TOGGLES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* LOGISTICS ROUTING TIMELINE RUNWAY */}
        <div className="lg:col-span-1 bg-[#16223F] border border-slate-800/80 rounded-3xl p-6 space-y-6">
          <div className="border-b border-slate-800/60 pb-3 text-left">
            <h4 className="font-black text-xs uppercase tracking-widest text-slate-300">Hub Routing Status</h4>
            <p className="text-[11px] text-slate-500">Live oversight of product transit verification corridors</p>
          </div>
          
          <div className="space-y-6 relative text-left before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-800">
            {activeTransactions.slice(0, 3).map((tx, idx) => (
              <div key={tx.id || idx} className="relative pl-8 group">
                <div className={`absolute left-1.5 top-1 w-3 h-3 rounded-full border-2 ${tx.status === 'Completed' ? 'bg-emerald-500 border-emerald-900' : 'bg-amber-400 border-amber-900 animate-pulse'}`}></div>
                <span className="text-[10px] font-mono font-bold text-[#FF5A00] block">{tx.id}</span>
                <p className="text-xs font-black text-white line-clamp-1 mt-0.5">{tx.title}</p>
                <div className="flex gap-2 items-center mt-1">
                  <span className="text-[9px] bg-[#0B132B] px-2 py-0.5 rounded border border-slate-800 font-semibold text-slate-400">🏢 {tx.hub || 'Lagos Hub'}</span>
                  <span className="text-[9px] text-slate-400 font-bold uppercase font-mono">₦{tx.amount.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ACTIVE PRODUCT MANAGEMENT INVENTORY GRID */}
        <div className="lg:col-span-2 bg-[#16223F] border border-slate-800/80 rounded-3xl p-6 space-y-6">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800/60 pb-4">
            <div className="text-left">
              <h4 className="font-black text-xs uppercase tracking-widest text-slate-300">Managed Inventory Catalog</h4>
              <p className="text-[11px] text-slate-500">Modify live asset tracking weights or modify product metadata fields</p>
            </div>
            
            {/* SEGMENTATION FILTERS */}
            <select 
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-[#0B132B] border border-slate-700 text-xs font-bold rounded-xl px-3 py-2 text-white outline-none focus:border-[#FF5A00]"
            >
              <option value="all">All Sectors</option>
              <option value="fashion">Streetwear / Fashion</option>
              <option value="electronics">Electronics / Gadgets</option>
              <option value="automotive">Automotive</option>
              <option value="realestate">Properties / Real Estate</option>
            </select>
          </div>

          {/* CATALOG TABLE ARCHITECTURE */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#0B132B]/60 text-[9px] font-black tracking-widest text-slate-400 uppercase border-b border-slate-800">
                  <th className="py-3 px-4">Asset</th>
                  <th className="py-3 px-4">Sector</th>
                  <th className="py-3 px-4">Price Matrix</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 text-xs font-medium text-slate-200">
                {filteredInventory.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-slate-500 text-xs">No active inventory matches this category partition.</td>
                  </tr>
                ) : (
                  filteredInventory.map((item) => (
                    <tr key={item.id} className="hover:bg-[#0B132B]/30 transition-colors">
                      <td className="py-3.5 px-4 flex items-center gap-3">
                        <span className="text-xl bg-[#0B132B] w-8 h-8 rounded-lg flex items-center justify-center border border-slate-800">{item.img || '📦'}</span>
                        <div className="text-left">
                          <span className="font-black text-white block line-clamp-1">{item.title}</span>
                          <span className="text-[10px] text-slate-400 font-mono">📍 {item.location || 'Lagos'}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 uppercase text-[10px] font-black tracking-wider font-mono text-slate-400">{item.category}</td>
                      <td className="py-3.5 px-4 font-mono font-black text-white">₦{item.price?.toLocaleString()}</td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded">
                          Live On-Grid
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>

    </div>
  );
}