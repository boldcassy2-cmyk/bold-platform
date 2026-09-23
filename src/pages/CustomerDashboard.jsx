import React, { useState } from 'react';

export default function CustomerDashboard({ 
  user, 
  orders = [], 
  userListings = [], 
  setCurrentPage, 
  onOpenProductUpload, 
  onDeleteListing 
}) {
  const displayName = user?.name || user?.fullName || (user?.email ? user.email.split('@')[0] : 'Valued Member');
  const displayEmail = user?.email || 'member@bold.ng';

  const userOrders = Array.isArray(orders) ? orders : [];
  const activeOrdersCount = userOrders.filter(o => o.status !== 'Completed').length;
  const completedVaultsCount = userOrders.filter(o => o.status === 'Completed').length;
  
  const myListings = Array.isArray(userListings) ? userListings : [];
  const totalListings = myListings.length;
  const totalPromoted = myListings.filter(item => item.promotionSettings?.adPlacement).length;

  // Safe handler to prevent clicks from failing if prop is undefined
  const handleOpenUpload = () => {
    if (typeof onOpenProductUpload === 'function') {
      onOpenProductUpload();
    } else {
      console.warn('onOpenProductUpload handler is not connected in parent component.');
      alert('Product upload modal trigger is loading or not connected yet.');
    }
  };

  // Handler for store upgrade / opening store portal
  const handleOpenStoreUpgrade = () => {
    if (typeof setCurrentPage === 'function') {
      setCurrentPage('addproduct'); // Routes buyer straight to store/product initialization
    } else {
      handleOpenUpload();
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 py-6 text-white space-y-8 pb-32">
      
      {/* 1. ACCOUNT HUB HEADER & QUICK SWITCH BAR */}
      <div className="bg-[#16223F] border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF5A00]/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="space-y-1.5 z-10">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-mono text-[#FF5A00] uppercase tracking-widest font-black bg-[#FF5A00]/10 px-3 py-1 rounded-full border border-[#FF5A00]/20">
              Bold.ng Verified Account Hub
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-900">
              ● Node Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Welcome back, {displayName}! 👋
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm font-mono">
            {displayEmail} • Manage your marketplace storefront, promotions, and escrow transactions.
          </p>
        </div>

        {/* Quick Action Navigation & Store Upgrade Buttons */}
        <div className="flex flex-wrap items-center gap-3 z-10 w-full lg:w-auto">
          {/* HIGH-VISIBILITY STORE UPGRADE BUTTON */}
          <button
            type="button"
            onClick={handleOpenStoreUpgrade}
            className="flex-1 sm:flex-none px-5 py-3.5 bg-gradient-to-r from-[#FF5A00] to-amber-600 hover:from-amber-600 hover:to-[#FF5A00] text-white text-xs font-black rounded-xl transition-all shadow-[0_0_20px_rgba(255,90,0,0.4)] cursor-pointer flex items-center justify-center gap-2 active:scale-95 border border-[#FF5A00]/40 animate-pulse"
          >
            <span className="text-base">🏪</span> 
            <div className="text-left">
              <div className="leading-tight">Open / Upgrade Store</div>
              <div className="text-[9px] font-mono font-normal opacity-90">Start selling instantly</div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setCurrentPage('marketplace')}
            className="px-4 py-3.5 bg-[#0B132B] hover:bg-slate-800 text-slate-200 text-xs font-bold rounded-xl border border-slate-700 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>🛍️</span> Marketplace
          </button>
          
          <button
            type="button"
            onClick={handleOpenUpload}
            className="px-5 py-3.5 bg-[#0B132B] hover:bg-slate-800 text-white text-xs font-black rounded-xl border border-slate-700 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>➕</span> Upload Ad
          </button>
        </div>
      </div>

      {/* 2. METRICS OVERVIEW GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        <div className="bg-[#16223F] p-5 rounded-2xl border border-slate-800 shadow-lg flex flex-col justify-between">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Your Active Listings</span>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-3xl font-black text-white font-mono">{totalListings}</span>
            <span className="text-[10px] text-[#FF5A00] font-bold bg-[#FF5A00]/10 px-2 py-0.5 rounded">Live on Hub</span>
          </div>
        </div>
        
        <div className="bg-[#16223F] p-5 rounded-2xl border border-slate-800 shadow-lg flex flex-col justify-between">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Promoted & Direct Ads</span>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-3xl font-black text-[#FF5A00] font-mono">{totalPromoted}</span>
            <span className="text-[10px] text-amber-400 font-bold bg-amber-950/80 px-2 py-0.5 rounded">Boosted</span>
          </div>
        </div>

        <div className="bg-[#16223F] p-5 rounded-2xl border border-slate-800 shadow-lg flex flex-col justify-between">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Active Escrow Orders</span>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-3xl font-black text-white font-mono">{activeOrdersCount}</span>
            <span className="text-[10px] text-blue-400 font-bold bg-blue-950/80 px-2 py-0.5 rounded">In Progress</span>
          </div>
        </div>

        <div className="bg-[#16223F] p-5 rounded-2xl border border-slate-800 shadow-lg flex flex-col justify-between">
          <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">Completed Vaults</span>
          <div className="flex items-baseline justify-between mt-3">
            <span className="text-3xl font-black text-emerald-400 font-mono">{completedVaultsCount}</span>
            <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded">Successful</span>
          </div>
        </div>

      </div>

      {/* 3. UPLOADED PRODUCTS & PROGRESS MONITOR */}
      <div className="bg-[#16223F] rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              <span>📦</span> Your Uploaded Products & Progress Monitor
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Track how your items appear across the marketplace, promotions tab, and direct ad slots.
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenUpload}
            className="bg-[#0B132B] hover:bg-slate-800 text-[#FF5A00] border border-[#FF5A00]/30 text-xs font-black uppercase tracking-wider px-4 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-2 shadow"
          >
            <span>+ Upload Item</span>
          </button>
        </div>

        {myListings.length === 0 ? (
          <div className="text-center py-16 bg-[#0B132B]/60 rounded-2xl border border-slate-800/80 space-y-3 px-4">
            <div className="text-5xl">🚀</div>
            <h3 className="text-white font-bold text-base">No Products Uploaded Yet</h3>
            <p className="text-slate-400 text-xs max-w-md mx-auto leading-relaxed">
              You haven't posted any products, services, or direct ads to bold.ng yet. Upload your first item now to see it live on the marketplace and promotional feeds!
            </p>
            <button
              type="button"
              onClick={handleOpenStoreUpgrade}
              className="mt-2 bg-[#FF5A00] hover:bg-[#e04f00] text-white text-xs font-black uppercase tracking-wider px-6 py-3 rounded-xl transition shadow-lg cursor-pointer inline-block"
            >
              Open Your Store & Start Selling
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myListings.map((item) => {
              const placement = item.promotionSettings?.adPlacement || 'Standard Marketplace Feed';
              return (
                <div 
                  key={item.id || item.docId} 
                  className="bg-[#0B132B] border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-4 hover:border-slate-700 transition"
                >
                  <div className="flex gap-3 items-start">
                    <div className="w-16 h-16 rounded-xl bg-slate-900 shrink-0 overflow-hidden border border-slate-800 flex items-center justify-center">
                      {item.img && item.img.startsWith('http') ? (
                        <img src={item.img} alt={item.title} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl">📦</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] font-black uppercase tracking-wider text-[#FF5A00] bg-[#FF5A00]/10 px-2 py-0.5 rounded border border-[#FF5A00]/20">
                        {item.category || 'General'}
                      </span>
                      <h4 className="text-sm font-bold text-white truncate mt-1">{item.title}</h4>
                      <p className="text-xs font-mono font-black text-white mt-0.5">₦{Number(item.price).toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Progress & Placement Status Bar */}
                  <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800/80 space-y-2 text-xs">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-400">Placement Feed:</span>
                      <span className="text-emerald-400 font-bold font-mono truncate max-w-[140px]">{placement}</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-400">Listing Status:</span>
                      <span className="text-white font-bold bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-900 text-[10px]">Active & Live</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    <span className="text-[10px] text-slate-500 font-mono">ID: {item.id?.substring(0, 8) || 'BOLD-NG'}</span>
                    {onDeleteListing && (
                      <button
                        type="button"
                        onClick={() => onDeleteListing(item.id || item.docId)}
                        className="text-xs text-red-400 hover:text-red-300 font-bold transition cursor-pointer"
                      >
                        Remove Listing
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 4. RECENT TRANSACTIONS / ESCROW VAULT ACTIVITY */}
      <div className="bg-[#16223F] rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl">
        <h2 className="text-lg sm:text-xl font-black mb-4 tracking-tight flex items-center gap-2">
          <span>🛡️</span> Escrow Vault & Transaction History
        </h2>
        
        {userOrders.length === 0 ? (
          <div className="text-center py-10 bg-slate-900/40 rounded-2xl border border-slate-800/80">
            <p className="text-slate-400 text-xs italic">
              No escrow transaction history found for this account. When you make or receive purchases in the marketplace, your secure tracking details will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {userOrders.map((order) => (
              <div key={order.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-900/60 p-4 sm:p-5 rounded-2xl border border-slate-800 gap-4">
                <div>
                  <p className="font-bold text-sm text-white">{order.title}</p>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">ID: {order.id} • {order.date}</p>
                </div>
                <div className="flex items-center justify-between w-full sm:w-auto gap-4">
                  <div className="text-right sm:text-right">
                    <p className="font-black text-sm sm:text-base text-[#FF5A00] font-mono">₦{Number(order.amount).toLocaleString()}</p>
                    <span className={`text-[10px] font-mono px-2.5 py-0.5 rounded-full inline-block mt-1 ${order.status === 'Completed' ? 'bg-emerald-950 text-emerald-400 border border-emerald-900' : 'bg-amber-950 text-amber-400 border border-amber-900'}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}