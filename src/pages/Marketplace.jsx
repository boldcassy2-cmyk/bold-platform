import React, { useState } from 'react';

export default function Marketplace({ setCurrentPage, items, onTriggerCheckout }) {
  // Filter state values remain inside to manage immediate user search metrics locally
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [maxPrice, setMaxPrice] = useState('');

  // Process filters directly against the global array input stream
  const filteredItems = items.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.meta.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesLocation = selectedLocation === 'all' || item.location === selectedLocation;
    const matchesPrice = !maxPrice || item.price <= parseFloat(maxPrice);
    return matchesSearch && matchesCategory && matchesLocation && matchesPrice;
  });

  return (
    <main className="max-w-6xl mx-auto my-6 px-4 space-y-6 animate-fadeIn text-white">
      
      {/* OMNI-SEARCH MARKETPLACE BANNER HEADER */}
      <div className="bg-[#16223F] border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className="text-[10px] bg-[#FF5A00] text-white font-black tracking-widest uppercase px-2.5 py-1 rounded">
            🛡️ SECURE ESCROW SHIELDED PLATFORM
          </span>
          <h1 className="text-3xl font-black text-white mt-2 tracking-tight">The Everything Marketplace</h1>
          <p className="text-slate-400 text-xs mt-1 leading-relaxed max-w-xl">
            Query across every automotive, real estate, gadget, and streetwear inventory batch in Nigeria instantly.
          </p>
        </div>
        <button 
          onClick={() => setCurrentPage('addproduct')}
          className="bg-[#FF5A00] text-white font-black text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl border-none cursor-pointer shadow-lg hover:brightness-110 transition shrink-0"
        >
          ➕ Onboard Your Business
        </button>
      </div>

      {/* FILTER CONSOLE BOARD LAYER */}
      <div className="bg-[#16223F] p-6 rounded-3xl shadow-xl border border-slate-800 space-y-4">
        <h3 className="text-xs font-black text-[#FF5A00] uppercase tracking-wider">
          🔍 Search & Filter Control Board
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-5">
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Keyword Query</label>
            <input 
              type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for Toyota, Hoodies, Laptops, Properties..." 
              className="w-full px-4 py-2.5 rounded-xl border border-slate-700 text-xs font-semibold bg-[#0B132B] text-white focus:outline-none focus:border-[#FF5A00]"
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Location Node</label>
            <select 
              value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-700 text-xs font-semibold bg-[#0B132B] text-white focus:outline-none focus:border-[#FF5A00] cursor-pointer"
            >
              <option value="all">All States / Remote</option>
              <option value="Lagos">Lagos State</option>
              <option value="Abuja">Abuja FCT</option>
              <option value="Lekki">Lekki Subzone</option>
              <option value="Port Harcourt">Port Harcourt</option>
              <option value="Remote">Remote Operations</option>
            </select>
          </div>

          <div className="md:col-span-4">
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Max Budget Bounds (₦)</label>
            <input 
              type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="e.g., 2000000"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-700 text-xs font-semibold bg-[#0B132B] text-white focus:outline-none focus:border-[#FF5A00]"
            />
          </div>
        </div>

        {/* INDUSTRIAL SECTOR TABS */}
        <div className="pt-2">
          <label className="block text-[10px] font-black text-slate-400 uppercase mb-1.5">Segment Filter Matrix</label>
          <div className="flex flex-wrap gap-1.5">
            {[
              { id: 'all', label: '🌐 All Business' },
              { id: 'fashion', label: '👕 Apparel' },
              { id: 'automotive', label: '🚗 Cars & Mechanics' },
              { id: 'electronics', label: '💻 Tech Gadgets' },
              { id: 'realestate', label: '🏢 Real Estate' },
              { id: 'travel', label: '✈️ Air Tickets' },
              { id: 'education', label: '📚 Tutorials' }
            ].map((tab) => (
              <button
                key={tab.id} type="button" onClick={() => setActiveCategory(tab.id)}
                className={`px-3 py-2 rounded-xl font-black text-[10px] uppercase tracking-wide transition cursor-pointer border ${
                  activeCategory === tab.id 
                    ? 'bg-[#FF5A00] text-white border-[#FF5A00]' 
                    : 'bg-[#0B132B] text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RESULTS SELECTION VIEW COUNTER */}
      <p className="text-xs font-black text-slate-400 uppercase tracking-wider px-1">
        Found <span className="text-[#FF5A00] font-mono">{filteredItems.length} Verified Records</span>
      </p>

      {/* CARDS CONTAINER */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <div 
              key={item.id} 
              className="bg-[#16223F] rounded-3xl overflow-hidden shadow-lg border border-slate-800 hover:border-[#FF5A00] transition-all flex flex-col justify-between"
            >
              <div>
                <div className="h-40 bg-[#0B132B] flex items-center justify-center text-4xl relative">
                  <span className="absolute bottom-2.5 right-2.5 text-[8px] bg-[#FF5A00] text-white font-black px-2 py-0.5 rounded uppercase tracking-wider">
                    📍 {item.location}
                  </span>
                  {item.img}
                </div>

                <div className="p-4 space-y-1">
                  <span className="text-[8px] text-[#FF5A00] uppercase font-black tracking-widest">{item.category}</span>
                  <h4 className="text-sm font-black text-white leading-tight min-h-[40px] line-clamp-2">{item.title}</h4>
                  <p className="text-[10px] text-slate-400 font-medium truncate bg-[#0B132B] p-2 rounded-xl mt-2 border border-slate-900">
                    {item.meta}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0">
                <div className="border-t border-slate-800 pt-3 flex items-center justify-between gap-2">
                  <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase">Valuation</p>
                    <p className="text-sm font-black text-white font-mono">₦{item.price.toLocaleString()}</p>
                  </div>
                  
                  <button 
                    onClick={() => onTriggerCheckout(item)}
                    className="bg-[#FF5A00] text-white font-black text-[10px] uppercase tracking-wider px-4 py-2.5 rounded-xl border-none hover:brightness-110 transition cursor-pointer shadow-md"
                  >
                    Lock Deal
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="bg-[#16223F] rounded-3xl p-12 text-center border border-slate-800 max-w-md mx-auto">
          <p className="text-3xl">📭</p>
          <h4 className="text-sm font-black text-white uppercase mt-2">No Matching Business Vectors</h4>
          <p className="text-xs text-slate-400 mt-1">Try expanding your max budget bounds or search alternative parameters.</p>
        </div>
      )}

    </main>
  );
}