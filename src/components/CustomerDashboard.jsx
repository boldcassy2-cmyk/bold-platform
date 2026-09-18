import React, { useState } from 'react';

export default function CustomerDashboard({ 
  user, 
  orders = [], 
  onApplyForVendor, 
  setCurrentPage 
}) {
  const [activeTab, setActiveTab] = useState('orders');
  const [applicationStatus, setApplicationStatus] = useState(null);

  const handleVendorApplication = () => {
    setApplicationStatus('Application submitted successfully! Our executive team is reviewing your vendor request.');
    if (typeof onApplyForVendor === 'function') {
      onApplyForVendor();
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6 text-white text-left font-sans">
      
      {/* Customer Welcome Header */}
      <div className="bg-gradient-to-r from-[#16223F] via-[#0B132B] to-[#16223F] p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="bg-[#FF5A00] text-white text-[9px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full font-bold">
            👤 Customer Account Hub
          </span>
          <h1 className="text-2xl font-black text-white mt-2 tracking-tight">
            Welcome back, {user?.displayName || user?.email || 'Valued Customer'}
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage your secure escrow purchases, tracking waybills, and wishlist nodes.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setCurrentPage && setCurrentPage('marketplace')}
          className="bg-[#FF5A00] hover:bg-[#e05000] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg cursor-pointer"
        >
          Explore Marketplace 🛒
        </button>
      </div>

      {/* Customer Hub Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        {[
          { id: 'orders', label: '📦 My Escrow Orders' },
          { id: 'addresses', label: '📍 Saved Addresses & Wishlist' },
          { id: 'history', label: '🧾 Transaction History' },
          { id: 'merchant', label: '🚀 Become a Merchant' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`text-xs font-black px-4 py-2.5 rounded-xl border-none cursor-pointer transition-all ${
              activeTab === tab.id
                ? 'bg-[#FF5A00] text-white shadow-[0_0_12px_rgba(255,90,0,0.4)]'
                : 'bg-[#16223F] hover:bg-slate-800 text-slate-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="space-y-6">
        
        {/* Tab 1: Orders */}
        {activeTab === 'orders' && (
          <div className="bg-[#16223F] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <h2 className="text-base font-black text-white">Active Escrow Orders</h2>
            <p className="text-xs text-slate-400">Track items held securely in the escrow vault until delivery confirmation.</p>
            
            {orders.length === 0 ? (
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-8 text-center space-y-3">
                <p className="text-xs text-slate-400 font-mono">No active escrow orders detected in your session.</p>
                <button
                  type="button"
                  onClick={() => setCurrentPage && setCurrentPage('marketplace')}
                  className="text-xs font-bold text-[#FF5A00] hover:underline bg-transparent border-none cursor-pointer"
                >
                  Start shopping now →
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((order, idx) => (
                  <div key={idx} className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                    <div>
                      <span className="font-bold text-white">{order.title}</span>
                      <span className="block text-[10px] text-slate-400 font-mono mt-0.5">ID: {order.id}</span>
                    </div>
                    <span className="font-mono font-bold text-amber-400 bg-amber-950/60 px-2.5 py-1 rounded border border-amber-800">
                      {order.status || 'In Escrow Vault'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Addresses & Wishlist */}
        {activeTab === 'addresses' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#16223F] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
              <h2 className="text-base font-black text-white">📍 Saved Delivery Nodes</h2>
              <p className="text-xs text-slate-400">Primary fulfillment hubs across Nigeria.</p>
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-1">
                <span className="text-xs font-bold text-emerald-400">● Default Address (Lagos Node)</span>
                <p className="text-xs text-slate-300">Victoria Island / Lekki Subzone, Lagos State</p>
              </div>
            </div>

            <div className="bg-[#16223F] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
              <h2 className="text-base font-black text-white">❤️ Saved Wishlist</h2>
              <p className="text-xs text-slate-400">Items you have bookmarked for future acquisition.</p>
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-center">
                <p className="text-xs text-slate-400">Your wishlist is currently empty.</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Transaction History */}
        {activeTab === 'history' && (
          <div className="bg-[#16223F] border border-slate-800 rounded-2xl p-6 space-y-4 shadow-xl">
            <h2 className="text-base font-black text-white">🧾 Complete Purchase Receipts</h2>
            <p className="text-xs text-slate-400">Review past settled escrow payments and top-ups.</p>
            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 text-center text-xs text-slate-400">
              No historical payment logs found. Completed transactions will appear here automatically.
            </div>
          </div>
        )}

        {/* Tab 4: Become a Merchant */}
        {activeTab === 'merchant' && (
          <div className="bg-[#16223F] border border-slate-800 rounded-2xl p-6 space-y-5 shadow-xl max-w-2xl mx-auto text-center">
            <span className="text-2xl">🚀</span>
            <div>
              <h2 className="text-lg font-black text-white">Upgrade to Merchant Status</h2>
              <p className="text-xs text-slate-400 mt-1">
                Want to start selling streetwear, tech gadgets, or gift cards on bold.ng? Apply for merchant clearance to unlock the product onboarding dashboard.
              </p>
            </div>

            {applicationStatus && (
              <div className="bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs px-4 py-3 rounded-xl font-mono">
                {applicationStatus}
              </div>
            )}

            <button
              type="button"
              onClick={handleVendorApplication}
              className="w-full bg-[#FF5A00] hover:bg-[#e05000] text-white text-xs font-black uppercase tracking-wider py-3.5 rounded-xl transition-all shadow-lg cursor-pointer"
            >
              Apply For Merchant Status ✨
            </button>
          </div>
        )}

      </div>
    </div>
  );
}