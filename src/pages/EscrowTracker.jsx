import React, { useState } from 'react';

export default function EscrowTracker() {
  // Mock data representing current buyer transaction lifecycle states
  const [orders, setOrders] = useState([
    {
      id: "ORD-9942",
      itemName: "Heavyweight Boxy Hoodie (Midnight Blue)",
      vendor: "Cassydon Garms Hub",
      amount: "₦32,000",
      date: "June 02, 2026",
      status: "In Vault",
      description: "Payment locked. Awaiting package transit confirmation from merchant location."
    },
    {
      id: "ORD-8819",
      itemName: "Vintage Oversized Washed Tee",
      vendor: "Retro Threads NG",
      amount: "₦18,500",
      date: "May 28, 2026",
      status: "Delivered (Inspecting)",
      description: "Package arrived at buyer location. 24-hour verification window is active."
    }
  ]);

  const [disputeReason, setDisputeReason] = useState('');
  const [activeDisputeId, setActiveDisputeId] = useState(null);

  // Release payment directly to seller wallet
  const handleReleaseFunds = (orderId, itemName) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: "Released", description: "Funds successfully moved to vendor vault. Transaction complete." } : order
    ));
    alert(`✅ Funds Released!\n\nYou have confirmed physical inspection of "${itemName}". Payment is now processing into the vendor's available balance.`);
  };

  // Turn on structural dispute input layout
  const initiateDisputeState = (orderId) => {
    setActiveDisputeId(orderId);
  };

  // Finalize freezing the transaction payment pool
  const handleSubmitDispute = (e, orderId, itemName) => {
    e.preventDefault();
    if (!disputeReason.trim()) {
      alert("⚠️ Please specify the inspection failure reason before filing.");
      return;
    }

    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: "Disputed", description: `Frozen: Under Bold review due to: "${disputeReason}"` } : order
    ));
    
    setActiveDisputeId(null);
    setDisputeReason('');
    alert(`🚨 TRANSACTION FROZEN:\n\nAn official dispute has been filed for "${itemName}". Bold Support Agents will contact both parties to verify physical item accuracy.`);
  };

  return (
    <main className="max-w-4xl mx-auto my-10 px-4 space-y-8">
      
      {/* SECTION PANEL BANNER */}
      <div className="bg-[#1E293B] border border-slate-800 rounded-3xl p-8 shadow-xl">
        <span className="text-[10px] bg-emerald-500 text-[#0B132B] font-black tracking-widest uppercase px-2.5 py-1 rounded">
          Secure Core Verified
        </span>
        <h1 className="text-2xl font-black text-white mt-2">Bold Vault Escrow Protection</h1>
        <p className="text-slate-400 text-xs mt-0.5">
          Your cash stays fully locked until you receive, inspect, and confirm the precise quality of your clothing items.
        </p>
      </div>

      {/* TRACKING LIST GRID */}
      <div className="space-y-4">
        <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Active Secure Escrow Holds</h3>

        {orders.map((order) => (
          <div key={order.id} className="bg-white text-slate-900 rounded-2xl p-6 shadow-md border border-slate-200 space-y-4">
            
            {/* Top row details */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                  {order.id}
                </span>
                <h4 className="text-sm font-black text-[#0B132B] mt-1">{order.itemName}</h4>
                <p className="text-xs text-slate-500 font-semibold">Merchant Store: <span className="underline">{order.vendor}</span></p>
              </div>

              <div className="text-left sm:text-right">
                <p className="text-xs text-slate-400 font-bold uppercase">Escrow Value</p>
                <p className="text-base font-black font-mono text-[#0B132B]">{order.amount}</p>
                <p className="text-[10px] font-medium text-slate-400">Initiated: {order.date}</p>
              </div>
            </div>

            {/* Current status info text */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="space-y-0.5">
                <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                  order.status === 'Released' ? 'bg-emerald-100 text-emerald-800' :
                  order.status === 'Disputed' ? 'bg-red-100 text-red-800 animate-pulse' : 'bg-orange-100 text-orange-800'
                }`}>
                  • Status: {order.status}
                </span>
                <p className="text-xs text-slate-600 font-medium leading-relaxed">{order.description}</p>
              </div>

              {/* Action layout controls */}
              {order.status !== 'Released' && order.status !== 'Disputed' && (
                <div className="flex gap-2 w-full sm:w-auto">
                  <button 
                    onClick={() => handleReleaseFunds(order.id, order.itemName)}
                    className="flex-1 sm:flex-none bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-emerald-700 transition border-none cursor-pointer whitespace-nowrap shadow"
                  >
                    Confirm & Release
                  </button>
                  <button 
                    onClick={() => initiateDisputeState(order.id)}
                    className="flex-1 sm:flex-none bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider hover:bg-red-50 hover:text-red-600 transition border-none cursor-pointer whitespace-nowrap"
                  >
                    File Issue
                  </button>
                </div>
              )}
            </div>

            {/* EXPANDABLE INLINE CONTEXT: FILE DISPUTE ENGINE */}
            {activeDisputeId === order.id && (
              <form onSubmit={(e) => handleSubmitDispute(e, order.id, order.itemName)} className="bg-red-50/50 border border-red-200 p-4 rounded-xl space-y-3 animate-fadeIn">
                <div>
                  <label className="block text-[11px] font-black text-red-900 uppercase mb-1">State Inspection Defect Detail</label>
                  <textarea 
                    rows="2"
                    value={disputeReason}
                    onChange={(e) => setDisputeReason(e.target.value)}
                    placeholder="E.g., Vendor shipped XL size instead of Medium, or the print logo arrived flawed/stained..."
                    className="w-full px-3 py-2 rounded-xl border border-red-300 text-xs font-semibold focus:outline-none focus:border-red-500 bg-white"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button 
                    type="button" 
                    onClick={() => setActiveDisputeId(null)}
                    className="bg-transparent text-slate-500 text-xs font-bold px-3 py-1.5 cursor-pointer border-none"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="bg-red-600 text-white text-[11px] font-black uppercase tracking-wider px-4 py-1.5 rounded-lg border-none cursor-pointer shadow hover:bg-red-700 transition"
                  >
                    Lock Payment Balance Now
                  </button>
                </div>
              </form>
            )}

          </div>
        ))}
      </div>

    </main>
  );
}