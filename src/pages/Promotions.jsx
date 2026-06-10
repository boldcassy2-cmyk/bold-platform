import React, { useState } from 'react';

export default function Promotions({ uploadedItems = [] }) {
  // Asset Management States
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Budget Matrix States
  const [dailyBudget, setDailyBudget] = useState(5000); // Default N5,000 per day
  const [campaignDays, setCampaignDays] = useState(7);   // Default 7-day duration
  const [adPlacement, setAdPlacement] = useState('trending'); // Placement node tier
  
  // Real-time Traffic Multiplier Matrix
  const placementMultipliers = {
    sidebar: { name: 'Contextual Sidebar Placement', multiplier: 12, conversions: 0.02 },
    trending: { name: 'Main Marketplace Trending Ribbon', multiplier: 25, conversions: 0.05 },
    broadcast: { name: 'Direct Push Notification Broadcast', multiplier: 45, conversions: 0.08 }
  };

  // Mock fallback array to protect frontend layout rendering if props are initially empty
  const defaultItemsList = uploadedItems.length > 0 ? uploadedItems : [
    { id: 'p1', title: 'Premium Core i7 Developer Laptop', type: 'product', price: 650000, category: 'electronics' },
    { id: 'p2', title: 'Escrow Architectural Consultation API', type: 'service', price: 120000, category: 'education' },
    { id: 'p3', title: 'Branded Merchant Corporate Apparel', type: 'product', price: 15000, category: 'fashion' }
  ];

  // Filter items based on user search string
  const filteredItems = defaultItemsList.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Track currently active chosen asset configuration
  const selectedAsset = defaultItemsList.find(item => item.id === selectedItemId);

  // Math Formulations
  const activePlacement = placementMultipliers[adPlacement];
  const totalInvestment = dailyBudget * campaignDays;
  const estimatedImpressions = dailyBudget * activePlacement.multiplier * campaignDays;
  const estimatedClicks = Math.floor(estimatedImpressions * activePlacement.conversions);

  const handleLaunchCampaign = () => {
    if (!selectedItemId) return;
    alert(`Campaign initiated securely for "${selectedAsset.title}"! Total billing matrix of ₦${totalInvestment.toLocaleString()} allocated to escrow verification.`);
  };

  return (
    <main className="max-w-5xl mx-auto my-6 px-4 space-y-6 animate-fadeIn text-white text-left">
      
      {/* HEADER PLATFORM CARD */}
      <div className="bg-[#16223F] border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[9px] bg-[#FF5A00] text-white font-black tracking-widest uppercase px-2 py-0.5 rounded">
            📈 BOLD ACCELERATION ENGINE
          </span>
          <h1 className="text-2xl font-black text-white mt-1">Merchant Promotions Hub</h1>
          <p className="text-slate-400 text-xs mt-0.5 font-medium">Scale your product visibility node across the entire marketplace stream instantly.</p>
        </div>
      </div>

      {/* STEP 1: INTERACTIVE ASSET PICKER INTERFACE */}
      <div className="bg-[#16223F] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-black tracking-tight">🎯 Step 1: Select Asset to Promote</h3>
            <p className="text-xs text-slate-400">Choose the specific uploaded product or service for this marketing campaign node.</p>
          </div>
          
          {/* SEARCH FIELD BAR */}
          <input 
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#0B132B] border border-slate-800 text-white placeholder-slate-500 text-xs rounded-xl px-3 py-2 w-full sm:w-64 focus:outline-none focus:border-[#FF5A00]"
          />
        </div>

        {/* INTERACTIVE ITEM STREAM GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 max-h-60 overflow-y-auto pr-1">
          {filteredItems.map((item) => {
            const isSelected = selectedItemId === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedItemId(item.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                  isSelected 
                    ? 'bg-[#FF5A00]/10 border-[#FF5A00] shadow-md' 
                    : 'bg-[#0B132B] border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* FLOATING TYPE BADGE */}
                <span className={`absolute top-2 right-2 text-[8px] font-black tracking-wider uppercase px-1.5 py-0.5 rounded ${
                  item.type === 'service' ? 'bg-purple-600 text-white' : 'bg-blue-600 text-white'
                }`}>
                  {item.type}
                </span>

                <div className="pr-12">
                  <h4 className="text-xs font-bold line-clamp-2 text-slate-100 group-hover:text-white">
                    {item.title}
                  </h4>
                  <p className="text-[#FF5A00] font-mono text-xs font-bold mt-2">
                    ₦{Number(item.price).toLocaleString()}
                  </p>
                </div>

                {/* VISUAL SELECTION STATUS NOTIFIER */}
                <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400 font-semibold">
                  <span className="capitalize text-[9px] text-slate-500">Hub: {item.category || 'General'}</span>
                  {isSelected ? (
                    <span className="text-[#FF5A00] font-black flex items-center gap-1">
                      ● Active Target
                    </span>
                  ) : (
                    <span className="text-slate-600">Select Item</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* STEP 2 & DETAILS DISPLAY MATRIX CONTAINER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT COLUMN: INTERACTIVE CONTROLS */}
        <div className="lg:col-span-7 bg-[#16223F] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-black tracking-tight border-b border-slate-800 pb-3">
            ⚙️ Step 2: Campaign Parameter Configuration
          </h3>

          {/* SLIDER 1: DAILY BUDGET */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <label className="text-slate-300 uppercase tracking-wide text-[10px]">Daily Capital Allocation</label>
              <span className="text-[#FF5A00] font-mono text-sm">₦{dailyBudget.toLocaleString()} / day</span>
            </div>
            <input 
              type="range" 
              min="1000" 
              max="50000" 
              step="1000"
              value={dailyBudget}
              onChange={(e) => setDailyBudget(Number(e.target.value))}
              className="w-full accent-[#FF5A00] bg-[#0B132B] h-2 rounded-lg cursor-pointer appearance-none"
            />
            <div className="flex justify-between text-[9px] text-slate-500 font-semibold font-mono">
              <span>₦1,000</span>
              <span>₦25,000</span>
              <span>₦50,000</span>
            </div>
          </div>

          {/* SLIDER 2: DURATION */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <label className="text-slate-300 uppercase tracking-wide text-[10px]">Campaign Timeline Run</label>
              <span className="text-[#FF5A00] font-mono text-sm">{campaignDays} Days</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="30" 
              step="1"
              value={campaignDays}
              onChange={(e) => setCampaignDays(Number(e.target.value))}
              className="w-full accent-[#FF5A00] bg-[#0B132B] h-2 rounded-lg cursor-pointer appearance-none"
            />
            <div className="flex justify-between text-[9px] text-slate-500 font-semibold font-mono">
              <span>1 Day</span>
              <span>15 Days</span>
              <span>30 Days</span>
            </div>
          </div>

          {/* SELECT PLACEMENT TIER */}
          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-300 uppercase tracking-wider">
              Premium Placement Optimization Node
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              
              {/* TIER 1 */}
              <div 
                onClick={() => setAdPlacement('sidebar')}
                className={`p-4 rounded-xl border text-center cursor-pointer transition select-none ${
                  adPlacement === 'sidebar' ? 'bg-[#FF5A00]/10 border-[#FF5A00]' : 'bg-[#0B132B] border-slate-800 hover:border-slate-700'
                }`}
              >
                <p className="text-base">📋</p>
                <p className="text-[11px] font-black uppercase mt-1">Sidebar Feed</p>
                <p className="text-[9px] text-slate-400 font-medium mt-0.5">Standard Traffic</p>
              </div>

              {/* TIER 2 */}
              <div 
                onClick={() => setAdPlacement('trending')}
                className={`p-4 rounded-xl border text-center cursor-pointer transition select-none ${
                  adPlacement === 'trending' ? 'bg-[#FF5A00]/10 border-[#FF5A00]' : 'bg-[#0B132B] border-slate-800 hover:border-slate-700'
                }`}
              >
                <p className="text-base">🔥</p>
                <p className="text-[11px] font-black uppercase mt-1">Trending Ribbon</p>
                <p className="text-[9px] text-slate-400 font-medium mt-0.5">High Exposure</p>
              </div>

              {/* TIER 3 */}
              <div 
                onClick={() => setAdPlacement('broadcast')}
                className={`p-4 rounded-xl border text-center cursor-pointer transition select-none ${
                  adPlacement === 'broadcast' ? 'bg-[#FF5A00]/10 border-[#FF5A00]' : 'bg-[#0B132B] border-slate-800 hover:border-slate-700'
                }`}
              >
                <p className="text-base">⚡</p>
                <p className="text-[11px] font-black uppercase mt-1">Direct Push</p>
                <p className="text-[9px] text-slate-400 font-medium mt-0.5">Max Conversion</p>
              </div>

            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: LIVE ESTIMATE FEEDBACK */}
        <div className="lg:col-span-5 bg-[#16223F] border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-6">
          <div>
            <h3 className="text-base font-black tracking-tight border-b border-slate-800 pb-3">
              📊 Predictive Yield Metrics
            </h3>
            
            <div className="mt-4 space-y-4">
              {/* SELECTED TARGET NODE CONFIRMATION TILE */}
              <div className="bg-[#0B132B] p-3 rounded-xl border border-dashed border-slate-800">
                <span className="text-[9px] text-slate-400 font-black uppercase block mb-1">Target Engine Lock</span>
                {selectedAsset ? (
                  <div>
                    <span className="text-xs font-bold text-white line-clamp-1">{selectedAsset.title}</span>
                    <span className="text-[10px] font-mono text-[#FF5A00] block mt-0.5">₦{Number(selectedAsset.price).toLocaleString()}</span>
                  </div>
                ) : (
                  <span className="text-xs font-medium text-amber-500 flex items-center gap-1.5 animate-pulse">
                    ⚠️ No asset selected yet
                  </span>
                )}
              </div>

              {/* INSIGHT 1: IMPRESSIONS */}
              <div className="bg-[#0B132B] p-3.5 rounded-xl border border-slate-900 flex justify-between items-center">
                <div>
                  <span className="text-[9px] text-slate-400 font-black uppercase block">Estimated Views</span>
                  <span className="text-xs font-semibold text-slate-300 font-mono">{activePlacement.name}</span>
                </div>
                <span className="text-xl font-black text-white font-mono">
                  {estimatedImpressions.toLocaleString()}+
                </span>
              </div>

              {/* INSIGHT 2: CLICKS */}
              <div className="bg-[#0B132B] p-3.5 rounded-xl border border-slate-900 flex justify-between items-center">
                <div>
                  <span className="text-[9px] text-slate-400 font-black uppercase block">Target Clicks</span>
                  <span className="text-xs font-semibold text-slate-300 font-mono">Based on conversion index</span>
                </div>
                <span className="text-xl font-black text-emerald-400 font-mono">
                  ≈ {estimatedClicks.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* TOTAL INVOICE AND DEPLOYMENT */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <div className="flex justify-between items-baseline">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total Investment:</span>
              <span className="text-2xl font-black text-[#FF5A00] font-mono">
                ₦{totalInvestment.toLocaleString()}
              </span>
            </div>
            
            <button 
              type="button"
              disabled={!selectedItemId}
              onClick={handleLaunchCampaign}
              className={`w-full font-black text-xs uppercase tracking-widest py-3.5 rounded-xl border-none shadow-lg transition duration-200 ${
                selectedItemId 
                  ? 'bg-[#FF5A00] text-white cursor-pointer hover:brightness-110' 
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-60'
              }`}
            >
              {selectedItemId ? '🚀 Launch Advertising Campaign' : '❌ Select an asset to unlock'}
            </button>
            <span className="text-[9px] text-slate-500 font-medium block text-center">
              Campaign ad matrices update across live nodes within 60 seconds of processing confirmation.
            </span>
          </div>

        </div>

      </div>

    </main>
  );
}