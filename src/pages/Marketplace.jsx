import React, { useState } from 'react';

/**
 * BOLD.NG TRUST ARCHITECTURE
 * Centralized logic placed directly here to prevent file path errors.
 */
const getTrustBadge = (item) => {
  // 1. Safety check: If item is missing or doesn't have a price, return fallback safely
  if (!item || typeof item.price !== 'number') {
    return { text: "🤝 ESCROW ELIGIBLE", color: "bg-emerald-600" };
  }

  // 2. High-value milestone assessment (Over 1 Million Naira)
  if (item.price >= 1000000) {
    return { 
      text: "🛡️ PREMIUM ESCROW", 
      color: "bg-purple-600" 
    };
  }

  // 3. Category inspection vetting rules
  const itemCategory = item.category?.toLowerCase();
  if (itemCategory === "electronics" || itemCategory === "automotive" || itemCategory === "realestate") {
    return { 
      text: "✅ VERIFIED ASSET", 
      color: "bg-blue-600" 
    };
  }

  // 4. Default fallback protection for everything else
  return { 
    text: "🤝 ESCROW ELIGIBLE", 
    color: "bg-emerald-600" 
  };
};

export default function Marketplace({ setCurrentPage, items, onTriggerCheckout }) {
  const [searchTerm, setSearchTerm] = useState('');

  // Safeguard against empty or uninitialized inventory streams
  const activeInventory = items || [];

  const filteredItems = activeInventory.filter((item) =>
    item.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="max-w-6xl mx-auto my-6 px-4 space-y-8 text-white">
      
      {/* HERO BANNER SECTION */}
      <div className="bg-[#16223F] border border-slate-800 rounded-3xl p-8 shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-left">
            <span className="text-[10px] bg-[#FF5A00] text-white font-black tracking-widest uppercase px-2.5 py-1 rounded">
              🛡️ SECURE ESCROW SHIELDED PLATFORM
            </span>
            <h1 className="text-4xl font-black text-white mt-3">Bold.ng Marketplace</h1>
            <p className="text-slate-400 text-sm mt-2">
              Query across every inventory batch in Nigeria instantly.
            </p>
          </div>
        </div>
      </div>

      {/* RE-INDEXED FILTER SEARCH ARCHITECTURE */}
      <div className="bg-[#16223F] p-6 rounded-3xl border border-slate-800">
        <input 
          type="text" 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)} 
          placeholder="Search items by keyword..." 
          className="w-full px-4 py-4 rounded-xl bg-[#0B132B] border border-slate-700 text-white focus:outline-none focus:border-[#FF5A00] transition-colors" 
        />
      </div>

      {/* DYNAMIC PRODUCT LISTING GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => {
          
          // Trigger node runs safely right here inside the same file
          const badge = getTrustBadge(item);

          return (
            <div key={item.id || item.title} className="bg-[#16223F] rounded-3xl border border-slate-800 p-5 flex flex-col justify-between hover:border-[#FF5A00] transition-all group">
              <div>
                {/* VISUAL ASSET CONTAINER */}
                <div className="h-44 bg-[#0B132B] rounded-2xl flex items-center justify-center text-5xl relative overflow-hidden mb-4">
                  
                  {/* INJECTED DYNAMIC TRUST MARKER BADGE */}
                  <span className={`absolute top-3 left-3 text-[9px] font-black tracking-wider text-white px-2.5 py-1 rounded-md uppercase shadow-md ${badge.color}`}>
                    {badge.text}
                  </span>
                  
                  <span className="group-hover:scale-110 transition-transform duration-300">{item.img || '📦'}</span>
                </div>

                <h4 className="font-black text-white text-base tracking-tight line-clamp-2">{item.title}</h4>
                <p className="text-[11px] text-slate-400 mt-1">{item.meta || 'Verified Hub Merchant'}</p>
                <p className="text-[10px] text-[#FF5A00] font-bold uppercase mt-0.5">📍 {item.location || 'Lagos'}</p>
              </div>

              {/* ACTION TRANSACTION CONTROL REGISTRY */}
              <div className="mt-6 pt-4 border-t border-slate-800/60 flex justify-between items-center">
                <span className="font-mono text-lg font-black text-white">₦{item.price?.toLocaleString()}</span>
                <button 
                  onClick={() => onTriggerCheckout(item)} 
                  className="bg-[#FF5A00] text-white text-xs font-black uppercase tracking-wider px-5 py-2.5 rounded-xl hover:brightness-110 active:scale-95 transition-all shadow-md"
                >
                  Lock Deal
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}