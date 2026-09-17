import React, { useState, useEffect } from 'react';

export default function Promotions({ uploadedItems = [], onTriggerCheckout, setCurrentPage, setActiveTxPayload }) {
  // Mock fallback array
  const defaultItemsList = uploadedItems.length > 0 ? uploadedItems : [
    { id: 'p1', title: 'Premium Core i7 Developer Laptop', type: 'product', price: 650000, category: 'electronics' },
    { id: 'p2', title: 'Escrow Architectural Consultation API', type: 'service', price: 120000, category: 'education' },
    { id: 'p3', title: 'Branded Merchant Corporate Apparel', type: 'product', price: 15000, category: 'fashion' }
  ];

  // Asset Management States
  const [selectedItemId, setSelectedItemId] = useState(defaultItemsList[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState('');

  // Budget Matrix States
  const [dailyBudget, setDailyBudget] = useState(5000); 
  const [campaignDays, setCampaignDays] = useState(7);   
  const [adPlacement, setAdPlacement] = useState('trending'); 
  
  // Real-time Traffic Multiplier Matrix
  const placementMultipliers = {
    sidebar: { name: 'Contextual Sidebar Placement', multiplier: 12, conversions: 0.02 },
    trending: { name: 'Main Marketplace Trending Ribbon', multiplier: 25, conversions: 0.05 },
    broadcast: { name: 'Direct Push Notification Broadcast', multiplier: 45, conversions: 0.08 }
  };

  // Load Paystack script dynamically if not present
  useEffect(() => {
    if (!document.getElementById('paystack-script')) {
      const script = document.createElement('script');
      script.id = 'paystack-script';
      script.src = 'https://js.paystack.co/v1/inline.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Filter items based on user search string
  const filteredItems = defaultItemsList.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedAsset = defaultItemsList.find(item => item.id === selectedItemId) || defaultItemsList[0];

  // Math Formulations
  const activePlacement = placementMultipliers[adPlacement];
  const totalInvestment = dailyBudget * campaignDays;
  const estimatedImpressions = dailyBudget * activePlacement.multiplier * campaignDays;
  const estimatedClicks = Math.floor(estimatedImpressions * activePlacement.conversions);

  // Paystack Payment Gate Integration
  const handleLaunchCampaign = () => {
    const currentAssetTitle = selectedAsset ? selectedAsset.title : 'Selected Item';
    const computedTotal = dailyBudget * campaignDays;
    
    // Check if Paystack script is loaded in window
    if (typeof window.PaystackPop === 'undefined') {
      alert('Paystack gateway is still initializing. Please check your network connection and try again.');
      return;
    }

    // Initialize Paystack Popup Transaction with your live key
    const handler = window.PaystackPop.setup({
      key: 'pk_live_0c84f6825e054064023e208a41e1f3ad34cf0f2d', 
      email: 'merchant@bold.ng', 
      amount: computedTotal * 100, // Paystack expects amount in kobo (Naira * 100)
      currency: 'NGN',
      ref: 'PROMO-' + Math.floor(100000 + Math.random() * 900000),
      metadata: {
        custom_fields: [
          {
            display_name: "Target Asset",
            variable_name: "target_asset",
            value: currentAssetTitle
          },
          {
            display_name: "Ad Placement",
            variable_name: "ad_placement",
            value: activePlacement.name
          }
        ]
      },
      callback: function(response) {
        // Payment successful callback handler
        const campaignPayload = {
          id: response.reference,
          title: `Campaign Initiated for "${currentAssetTitle}"! Total billing matrix of ₦${computedTotal.toLocaleString()} verified via Paystack escrow`,
          amount: computedTotal,
          price: computedTotal,
          category: 'Promotion',
          quantity: 1,
          status: 'In Escrow Vault',
          date: new Date().toISOString().split('T')[0],
          paystackRef: response.reference,
          promotionSettings: {
            targetAsset: currentAssetTitle,
            adPlacement: activePlacement.name,
            dailyBudget,
            campaignDays
          }
        };

        console.log(`[Paystack Success] Reference: ${response.reference}`);

        if (typeof onTriggerCheckout === 'function') {
          onTriggerCheckout(campaignPayload);
        } else if (typeof setActiveTxPayload === 'function' && typeof setCurrentPage === 'function') {
          setActiveTxPayload(campaignPayload);
          setCurrentPage('escrow-checkout');
        } else {
          alert(`Payment verified successfully! Campaign for "${currentAssetTitle}" active with reference: ${response.reference}`);
        }
      },
      onClose: function() {
        console.log('[Paystack] Payment window closed by user.');
      }
    });

    handler.openIframe();
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
          <p className="text-slate-400 text-xs mt-0.5 font-medium">Scale your product visibility node across the entire marketplace stream instantly via secure escrow.</p>
        </div>
      </div>

      {/* STEP 1: INTERACTIVE ASSET PICKER INTERFACE */}
      <div className="bg-[#16223F] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-black tracking-tight">🎯 Step 1: Select Asset to Promote</h3>
            <p className="text-xs text-slate-400">Choose the specific uploaded product or service for this marketing campaign node.</p>
          </div>
          
          <input 
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-[#0B132B] border border-slate-800 text-white placeholder-slate-500 text-xs rounded-xl px-3 py-2 w-full sm:w-64 focus:outline-none focus:border-[#FF5A00]"
          />
        </div>

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
                <span className={`absolute top-2 right-2 text-[8px] font-black tracking-wider uppercase px-1.5 py-0.5 rounded ${
                  item.type === 'service' ? 'bg-purple-600 text-white' : 'bg-blue-600 text-white'
                }`}>
                  {item.type}
                </span>

                <div className="pr-12">
                  <h4 className="text-xs font-bold line-clamp-2 text-slate-100">
                    {item.title}
                  </h4>
                  <p className="text-[#FF5A00] font-mono text-xs font-bold mt-2">
                    ₦{Number(item.price).toLocaleString()}
                  </p>
                </div>

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
        
        {/* LEFT COLUMN: CONTROLS */}
        <div className="lg:col-span-7 bg-[#16223F] border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
          <h3 className="text-base font-black tracking-tight border-b border-slate-800 pb-3">
            ⚙️ Step 2: Campaign Parameter Configuration
          </h3>

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
          </div>

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
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] font-black text-slate-300 uppercase tracking-wider">
              Premium Placement Optimization Node
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div 
                onClick={() => setAdPlacement('sidebar')}
                className={`p-4 rounded-xl border text-center cursor-pointer transition select-none ${
                  adPlacement === 'sidebar' ? 'bg-[#FF5A00]/10 border-[#FF5A00]' : 'bg-[#0B132B] border-slate-800'
                }`}
              >
                <p className="text-base">📋</p>
                <p className="text-[11px] font-black uppercase mt-1">Sidebar Feed</p>
              </div>

              <div 
                onClick={() => setAdPlacement('trending')}
                className={`p-4 rounded-xl border text-center cursor-pointer transition select-none ${
                  adPlacement === 'trending' ? 'bg-[#FF5A00]/10 border-[#FF5A00]' : 'bg-[#0B132B] border-slate-800'
                }`}
              >
                <p className="text-base">🔥</p>
                <p className="text-[11px] font-black uppercase mt-1">Trending Ribbon</p>
              </div>

              <div 
                onClick={() => setAdPlacement('broadcast')}
                className={`p-4 rounded-xl border text-center cursor-pointer transition select-none ${
                  adPlacement === 'broadcast' ? 'bg-[#FF5A00]/10 border-[#FF5A00]' : 'bg-[#0B132B] border-slate-800'
                }`}
              >
                <p className="text-base">⚡</p>
                <p className="text-[11px] font-black uppercase mt-1">Direct Push</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: METRICS & LAUNCH BUTTON */}
        <div className="lg:col-span-5 bg-[#16223F] border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-6">
          <div>
            <h3 className="text-base font-black tracking-tight border-b border-slate-800 pb-3">
              📊 Predictive Yield Metrics
            </h3>
            
            <div className="mt-4 space-y-4">
              <div className="bg-[#0B132B] p-3 rounded-xl border border-dashed border-slate-800">
                <span className="text-[9px] text-slate-400 font-black uppercase block mb-1">Target Engine Lock</span>
                <span className="text-xs font-bold text-white line-clamp-1">{selectedAsset?.title}</span>
              </div>

              <div className="bg-[#0B132B] p-3.5 rounded-xl border border-slate-900 flex justify-between items-center">
                <div>
                  <span className="text-[9px] text-slate-400 font-black uppercase block">Estimated Views</span>
                  <span className="text-xs font-semibold text-slate-300 font-mono">{activePlacement.name}</span>
                </div>
                <span className="text-xl font-black text-white font-mono">{estimatedImpressions.toLocaleString()}+</span>
              </div>

              <div className="bg-[#0B132B] p-3.5 rounded-xl border border-slate-900 flex justify-between items-center">
                <div>
                  <span className="text-[9px] text-slate-400 font-black uppercase block">Target Clicks</span>
                  <span className="text-xs font-semibold text-slate-300 font-mono">Conversion index</span>
                </div>
                <span className="text-xl font-black text-emerald-400 font-mono">≈ {estimatedClicks.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-3">
            <div className="flex justify-between items-baseline">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total Investment:</span>
              <span className="text-2xl font-black text-[#FF5A00] font-mono">₦{totalInvestment.toLocaleString()}</span>
            </div>
            
            <button 
              type="button"
              onClick={handleLaunchCampaign}
              className="w-full bg-[#FF5A00] hover:brightness-110 text-white font-black text-xs uppercase tracking-widest py-3.5 rounded-xl border-none shadow-lg cursor-pointer transition duration-200"
            >
              🚀 Pay & Launch Campaign (Paystack)
            </button>
            <span className="text-[9px] text-slate-500 font-medium block text-center">
              Secured by Paystack Escrow Gateway. Funds lock safely until milestone fulfillment.
            </span>
          </div>

        </div>

      </div>
    </main>
  );
}