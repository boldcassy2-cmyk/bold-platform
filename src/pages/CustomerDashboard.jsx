import React from 'react';

export default function CustomerDashboard({ user, orders, setCurrentPage }) {
  // Gracefully handle user display name (Prefers full name, falls back to email handle)
  const displayName = user?.name || user?.fullName || (user?.email ? user.email.split('@')[0] : 'Valued Customer');
  const displayEmail = user?.email || 'member@bold.ng';

  // Ensure orders defaults to an empty array for fresh registrations
  const userOrders = Array.isArray(orders) ? orders : [];
  const activeOrdersCount = userOrders.filter(o => o.status !== 'Completed').length;
  const completedVaultsCount = userOrders.filter(o => o.status === 'Completed').length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-white">
      
      {/* Account Hub Header */}
      <div className="bg-[#16223F] border border-slate-800 rounded-2xl p-6 shadow-xl mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] font-mono text-[#FF5A00] uppercase tracking-widest font-bold">
            Customer Account Hub
          </span>
          <h1 className="text-2xl font-black mt-1 text-white">Welcome back, {displayName}!</h1>
          <p className="text-slate-400 text-xs mt-0.5 font-mono">
            {displayEmail}
          </p>
        </div>
        <div className="bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-800 text-xs font-mono text-slate-300">
          Node Status: <span className="text-emerald-400 font-bold">Active</span>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#16223F] p-6 rounded-xl border border-slate-800">
          <h3 className="text-xs font-mono uppercase text-slate-400 mb-1">Active Orders</h3>
          <p className="text-2xl font-black text-[#FF5A00]">
            {activeOrdersCount}
          </p>
        </div>
        
        <div className="bg-[#16223F] p-6 rounded-xl border border-slate-800">
          <h3 className="text-xs font-mono uppercase text-slate-400 mb-1">Completed Vaults</h3>
          <p className="text-2xl font-black text-emerald-400">
            {completedVaultsCount}
          </p>
        </div>
        
        <div className="bg-[#16223F] p-6 rounded-xl border border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-xs font-mono uppercase text-slate-400 mb-1">Quick Action</h3>
            <p className="text-sm font-bold text-white">Explore Marketplace</p>
          </div>
          <button
            type="button"
            onClick={() => setCurrentPage('marketplace')}
            className="px-4 py-2 bg-[#FF5A00] hover:bg-orange-600 text-white text-xs font-black rounded-lg cursor-pointer transition-all shadow-md"
          >
            Browse
          </button>
        </div>
      </div>

      {/* Transactions Section */}
      <div className="bg-[#16223F] rounded-2xl p-6 border border-slate-800">
        <h2 className="text-lg font-black mb-4 tracking-tight">Your Recent Transactions</h2>
        
        {userOrders.length === 0 ? (
          <div className="text-center py-10 bg-slate-900/40 rounded-xl border border-slate-800/80">
            <p className="text-slate-400 text-xs italic">
              🛡️ No escrow transaction history found for this account. When you make a purchase in the marketplace, your tracking details will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {userOrders.map((order) => (
              <div key={order.id} className="flex justify-between items-center bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                <div>
                  <p className="font-bold text-sm text-white">{order.title}</p>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">ID: {order.id} • {order.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-sm text-[#FF5A00]">₦{Number(order.amount).toLocaleString()}</p>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full inline-block mt-1 ${order.status === 'Completed' ? 'bg-emerald-950 text-emerald-400 border border-emerald-900' : 'bg-amber-950 text-amber-400 border border-amber-900'}`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}