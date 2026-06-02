import React, { useState } from 'react';

export default function ProductCatalogForm({ onAddProductComplete, setCurrentPage }) {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('fashion');
  const [location, setLocation] = useState('Lagos');
  const [meta, setMeta] = useState('');

  // Category Icon Auto-Resolver Dictionary
  const iconMap = {
    fashion: '👕',
    automotive: '🚗',
    electronics: '💻',
    realestate: '🏢',
    travel: '✈️',
    education: '📚'
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !price) {
      alert('Please fill out critical value parameters.');
      return;
    }

    // Creating structured object map matching core marketplace data architecture
    const payload = {
      id: Date.now(), // Unique reference ID node
      title,
      price: parseFloat(price),
      category,
      location,
      meta: meta || 'Verified Asset Parameters',
      img: iconMap[category] || '📦'
    };

    // Feed payload into active global state hook tracking layer
    onAddProductComplete(payload);
  };

  return (
    <main className="max-w-2xl mx-auto my-6 px-4 space-y-6 animate-fadeIn text-white">
      
      {/* HEADER CONTROLS CARD */}
      <div className="bg-[#16223F] border border-slate-800 rounded-3xl p-6 shadow-xl flex justify-between items-center">
        <div>
          <span className="text-[9px] bg-[#FF5A00] text-white font-black tracking-widest uppercase px-2 py-0.5 rounded">
            ASSET INGESTION CONSOLE
          </span>
          <h1 className="text-2xl font-black text-white mt-1">Onboard New Enterprise Vector</h1>
        </div>
        <button 
          onClick={() => setCurrentPage('marketplace')}
          className="text-xs font-bold text-slate-300 hover:text-white bg-[#0B132B] border border-slate-800 px-4 py-2 rounded-xl transition cursor-pointer"
        >
          Cancel
        </button>
      </div>

      {/* INPUT FORM SCHEMATIC LAYOUT */}
      <form onSubmit={handleSubmit} className="bg-[#16223F] p-6 rounded-3xl shadow-xl border border-slate-800 space-y-4">
        
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Asset Reference Title</label>
          <input 
            type="text" value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Toyota Corolla 2015, Vintage Retro Tee, etc."
            className="w-full px-4 py-2.5 rounded-xl border border-slate-700 text-xs font-semibold bg-[#0B132B] text-white focus:outline-none focus:border-[#FF5A00]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Sector Segment Allocation</label>
            <select 
              value={category} onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-700 text-xs font-semibold bg-[#0B132B] text-white focus:outline-none focus:border-[#FF5A00] cursor-pointer"
            >
              <option value="fashion">👕 Apparel & Fast-Fashion</option>
              <option value="automotive">🚗 Cars & Mechanics</option>
              <option value="electronics">💻 Tech & Gadgets</option>
              <option value="realestate">🏢 Real Estate & Buildings</option>
              <option value="travel">✈️ Air Tickets</option>
              <option value="education">📚 Tutorials & Mentorship</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Operating Regional Node</label>
            <select 
              value={location} onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-700 text-xs font-semibold bg-[#0B132B] text-white focus:outline-none focus:border-[#FF5A00] cursor-pointer"
            >
              <option value="Lagos">Lagos State</option>
              <option value="Abuja">Abuja FCT</option>
              <option value="Lekki">Lekki Subzone</option>
              <option value="Port Harcourt">Port Harcourt</option>
              <option value="Remote">Remote Operations</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Valuation Price Point (₦)</label>
            <input 
              type="number" value={price} onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g., 45000"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-700 text-xs font-semibold bg-[#0B132B] text-white focus:outline-none focus:border-[#FF5A00]"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Metadata Attributes / Scope</label>
            <input 
              type="text" value={meta} onChange={(e) => setMeta(e.target.value)}
              placeholder="e.g., Size: L | UK Used | 6-Month Warranty"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-700 text-xs font-semibold bg-[#0B132B] text-white focus:outline-none focus:border-[#FF5A00]"
            />
          </div>
        </div>

        <button 
          type="submit"
          className="w-full bg-[#FF5A00] text-white font-black text-xs uppercase tracking-wider py-3.5 rounded-xl border-none hover:brightness-110 transition cursor-pointer shadow-xl mt-2"
        >
          🚀 Inject Into Live Marketplace Feed
        </button>

      </form>

    </main>
  );
}