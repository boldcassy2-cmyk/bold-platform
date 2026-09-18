import React from 'react';

export default function CustomerDashboard({ user, orders, setCurrentPage }) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-white">
      <div className="bg-[#16223F] border border-slate-800 rounded-2xl p-6 shadow-xl mb-8">
        <h1 className="text-2xl font-black mb-2">Customer Account Hub</h1>
        <p className="text-slate-400 text-sm">
          Welcome back, <span className="text-white font-semibold">{user?.email || 'Valued Customer'}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#16223F] p-6 rounded-xl border border-slate-800">
          <h3 className="text-xs font-mono uppercase text-slate-400 mb-1">Active Orders</h3>
          <p className="text-2xl font-black text-[#FF5A00]">
            {orders?.filter(o => o.status !== 'Completed').length || 0}
          </p>
        </div>
        <div className="bg-[#16223F] p-6 rounded-xl border border-slate-800">
          <h3 className="text-xs font-mono uppercase text-slate-400 mb-1">Completed Vaults</h3>
          <p className="text-2xl font-black text-emerald-400">
            {orders?.filter(o => o.status === 'Completed').length || 0}
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
            className="px-4 py-2 bg-[#FF5A00] text-white text-xs font-black rounded-lg cursor-pointer"
          >
            Browse
          </button>
        </div>
      </div>

      <div className="bg-[#16223F] rounded-2xl p-6 border border-slate-800">
        <h2 className="text-lg font-black mb-4">Your Recent Transactions</h2>
        {(!orders || orders.length === 0) ? (
          <p className="text-slate-400 text-sm">No transaction history found.</p>
        ) : (
          <div className="space-y-3">
            {orders.map((order) => (
              <div key={order.id} className="flex justify-between items-center bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                <div>
                  <p className="font-bold text-sm">{order.title}</p>
                  <p className="text-xs text-slate-400">ID: {order.id} • {order.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-sm">₦{Number(order.amount).toLocaleString()}</p>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${order.status === 'Completed' ? 'bg-emerald-950 text-emerald-400 border border-emerald-900' : 'bg-amber-950 text-amber-400 border border-amber-900'}`}>
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