import React, { useState } from 'react';

export default function Promotions() {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedTier, setSelectedTier] = useState('Standard');
  const [campaignDays, setCampaignDays] = useState(3);
  const [isProcessing, setIsProcessing] = useState(false);

  // Hardcoded pricing models for visibility tiers
  const tierPricing = {
    Standard: 1500, // ₦1,500 per day for category bump
    Premium: 3500,  // ₦3,500 per day for home page hero grid banner
    Elite: 6000     // ₦6,000 per day for push notifications + search page takeover
  };

  const totalCost = tierPricing[selectedTier] * campaignDays;

  const handleLaunchCampaign = (e) => {
    e.preventDefault();
    if (!selectedProduct) {
      alert("⚠️ Selection Error: Choose an active catalog product to assign the promotion payload.");
      return;
    }

    setIsProcessing(true);

    // Simulate link generation to the local payment checkout engine
    setTimeout(() => {
      setIsProcessing(false);
      alert(`🚀 Campaign Queue Initialized!\n\nYour invoice of ₦${totalCost.toLocaleString()} for the "${selectedTier}" boost tier has been verified. Once payment clears, the item will immediately pin to priority buyer grids.`);
    }, 2000);
  };

  return (
    <main className="max-w-4xl mx-auto my-10 px-4 space-y-8">
      
      {/* HEADER PANELS */}
      <div className="bg-[#1E293B] border border-slate-800 rounded-3xl p-8 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[10px] bg-[#FF5A00] text-white font-black tracking-widest uppercase px-2.5 py-1 rounded">
            Revenue Velocity Engine
          </span>
          <h1 className="text-2xl font-black text-white mt-1">Bold Premium Ad Accelerator</h1>
          <p className="text-slate-400 text-xs mt-0.5">Scale your conversions by pushing listings to the top of consumer search streams.</p>
        </div>
        <div className="bg-[#0B132B] border border-slate-800 px-4 py-2.5 rounded-xl text-center">
          <p className="text-[10px] text-slate-400 font-bold uppercase">Current Campaign ROI</p>
          <p className="text-lg font-black text-emerald-400">4.8x Avg.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
        
        {/* COMPONENT 1: COMPRESSION BUILDER FORM */}
        <div className="md:col-span-3 bg-white text-slate-900 p-6 rounded-2xl shadow-xl space-y-6">
          <h3 className="text-sm font-black text-[#0B132B] uppercase tracking-wide border-b border-slate-100 pb-2">
            ⚙️ Configure Promotion Campaign
          </h3>

          <form onSubmit={handleLaunchCampaign} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1.5">Select Targeted Inventory</label>
              <select 
                value={selectedProduct} 
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-none focus:border-[#FF5A00] bg-slate-50"
              >
                <option value="">-- Click to choose your item --</option>
                <option value="hoodie">Heavyweight Boxy Hoodie (Midnight Blue)</option>
                <option value="tee">Vintage Oversized Washed Tee</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1.5">Select Visibility Tier</label>
              <div className="grid grid-cols-1 gap-2">
                <label className={`p-3 border rounded-xl flex items-center justify-between cursor-pointer transition ${selectedTier === 'Standard' ? 'border-[#FF5A00] bg-orange-50/40' : 'border-slate-200'}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="tier" checked={selectedTier === 'Standard'} onChange={() => setSelectedTier('Standard')} className="accent-[#FF5A00]" />
                    <div>
                      <p className="text-xs font-black text-[#0B132B]">Category Stream Bump</p>
                      <p className="text-[10px] text-slate-500 font-medium">Prioritized position in related collections</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-black text-[#0B132B]">₦1,500/day</span>
                </label>

                <label className={`p-3 border rounded-xl flex items-center justify-between cursor-pointer transition ${selectedTier === 'Premium' ? 'border-[#FF5A00] bg-orange-50/40' : 'border-slate-200'}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="tier" checked={selectedTier === 'Premium'} onChange={() => setSelectedTier('Premium')} className="accent-[#FF5A00]" />
                    <div>
                      <p className="text-xs font-black text-[#0B132B]">👑 Marketplace Front Page Grid</p>
                      <p className="text-[10px] text-slate-500 font-medium">Bannered exposure directly on general landing dashboards</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-black text-[#0B132B]">₦3,500/day</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1.5">Campaign Duration</label>
              <div className="flex items-center gap-4">
                <input 
                  type="range" min={1} max={14} value={campaignDays} onChange={(e) => setCampaignDays(parseInt(e.target.value))}
                  className="w-full accent-[#0B132B]" 
                />
                <span className="text-sm font-black font-mono text-[#0B132B] whitespace-nowrap bg-slate-100 px-3 py-1 rounded-lg border border-slate-200">
                  {campaignDays} Days
                </span>
              </div>
            </div>

            <button type="submit" disabled={isProcessing} className="w-full bg-[#FF5A00] text-white py-3 rounded-xl font-black text-xs uppercase tracking-wider hover:brightness-110 transition border-none shadow-md cursor-pointer disabled:bg-slate-400">
              {isProcessing ? "Connecting Payment Node..." : `Generate Ad Invoice: ₦${totalCost.toLocaleString()}`}
            </button>
          </form>
        </div>

        {/* COMPONENT 2: INTERACTIVE FEED POSITION PREVIEW */}
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">
            Live Feed Display Placement Preview
          </h3>

          <div className="bg-[#1E293B] border border-slate-800 rounded-2xl p-4 shadow-lg space-y-3 relative overflow-hidden">
            <span className="text-[8px] bg-[#FF5A00] text-white px-2 py-0.5 rounded font-black tracking-widest uppercase absolute top-4 right-4">
              Live Preview
            </span>
            <p className="text-[10px] font-mono text-slate-500 font-bold uppercase tracking-wider">Search Stream Interface</p>
            
            {/* Simulated Grid Card Item */}
            <div className="bg-white text-slate-900 rounded-xl overflow-hidden border-2 border-[#FF5A00] shadow-md scale-[0.98]">
              <div className="h-32 bg-slate-200 relative">
                <div className="absolute top-2 left-2 bg-[#FF5A00] text-white text-[8px] font-black uppercase px-1.5 py-0.5 rounded">
                  🔥 {selectedTier === 'Premium' ? 'HOME HIGHLIGHT' : 'BOOSTED'}
                </div>
                <div className="w-full h-full bg-slate-300 animate-pulse flex items-center justify-center text-slate-400 text-xs font-bold">
                  Product Matrix Rendered
                </div>
              </div>
              <div className="p-3 space-y-1">
                <h4 className="text-xs font-black text-[#0B132B] truncate">
                  {selectedProduct === 'hoodie' ? 'Heavyweight Boxy Hoodie' : selectedProduct === 'tee' ? 'Vintage Oversized Washed Tee' : 'Your Selected Ad Item'}
                </h4>
                <p className="text-[10px] font-black text-[#FF5A00] font-mono">₦XX,XXX</p>
              </div>
            </div>

            <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-400 font-medium leading-relaxed">
              💡 <span className="text-white font-bold">Marketplace Strategy Note:</span> Premium promoted spots get visibility rank above all self-managed vendor locations automatically.
            </div>
          </div>
        </div>

      </div>

    </main>
  );
}