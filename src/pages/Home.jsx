import React, { useState, useEffect } from 'react';

export default function Home({ setCurrentPage, allListings = [] }) {
  const [displayItems, setDisplayItems] = useState({ promoted: [], trending: [] });

  // SMART ROTATION ENGINE: Ensures every merchant gets their fair share of visibility
  useEffect(() => {
    const safeListings = Array.isArray(allListings) ? allListings : [];

    // 1. Filter items with active ad placements or premium boosts
    const paidAds = safeListings.filter(item => item.promotionSettings?.adPlacement || item.isPromoted);
    
    // 2. Shuffle array so different paid products appear on every refresh / visit
    const shuffledAds = [...paidAds].sort(() => 0.5 - Math.random());
    const shuffledTrending = [...safeListings].sort(() => 0.5 - Math.random());

    setDisplayItems({
      promoted: shuffledAds.slice(0, 3), // Grab 3 random promoted items
      trending: shuffledTrending.slice(0, 6) // Grab 6 random trending items
    });
  }, [allListings]);

  const trustMetrics = [
    { label: 'Escrow Vault Status', value: '100% Locked', icon: '🛡️' },
    { label: 'CAC Verified Sellers', value: 'Instant Inspection', icon: '🏛️' },
    { label: 'Zero-Scam Guarantee', value: 'Encrypted Routing', icon: '⚡' }
  ];

  const hqHighlights = [
    {
      title: 'Central Operations & Logistics Command',
      desc: 'Our Lagos headquarters coordinates real-time multi-vendor routing, instant merchant verification, and automated escrow settlement across Nigeria.',
      img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
      badge: 'Control Center'
    },
    {
      title: 'Merchant & Artisan Support Desk',
      desc: 'Dedicated teams working round the clock to onboard verified suppliers, inspect product listings, and maintain absolute transparency for buyers.',
      img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
      badge: 'Staff & Community'
    },
    {
      title: 'Secure Hub Dispatch & Inspection',
      desc: 'Every item passing through our system undergoes physical or digital quality authentication before funds are released from the secure escrow vault.',
      img: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
      badge: 'Logistics Hub'
    }
  ];

  return (
    <main className="relative min-h-[calc(100vh-80px)] max-w-7xl mx-auto pt-8 pb-20 px-4 sm:px-6 lg:px-8 font-sans text-left space-y-20 overflow-hidden">
      
      {/* Background HQ Architectural Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-20 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80")` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B132B]/80 via-[#0B132B]/60 to-[#0B132B]/95"></div>
      </div>

      <div className="relative z-10 space-y-20">
        
        {/* Headquarters Banner */}
        <div className="pt-2 flex justify-center">
          <div className="inline-flex items-center gap-3 bg-[#16223F]/90 backdrop-blur-md px-6 py-2.5 rounded-2xl border border-[#FF5A00]/40 shadow-[0_0_30px_rgba(255,90,0,0.25)]">
            <span className="text-xl">🏢</span>
            <div className="text-left">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#FF5A00]">Official Headquarters</p>
              <p className="text-xs sm:text-sm font-black text-white">Bold.ng Central Command & Infrastructure — Lagos, Nigeria</p>
            </div>
          </div>
        </div>

        {/* Primary Hero Section */}
        <section className="flex flex-col items-center text-center max-w-4xl mx-auto pt-4 pb-6">
          <div className="mb-6">
            <span className="inline-flex items-center gap-2 text-xs font-black px-5 py-2.5 rounded-full border border-[#FF5A00]/40 uppercase tracking-widest bg-[#FF5A00]/15 text-[#FF5A00] shadow-[0_0_25px_rgba(255,90,0,0.2)]">
              <span>🛡️</span> Certified Counter-Fraud Trade Ecosystem
            </span>
          </div>

          <h1 className="text-4xl sm:text-7xl font-black text-white leading-[1.08] tracking-tight">
            High-Trust E-Commerce <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Engineered Without Compromise.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl leading-relaxed font-normal">
            Welcome to <strong className="text-white font-bold">Bold</strong>
            <span className="text-[#FF5A00] font-black">.ng</span> Marketplace. Building verified retail ecosystems to eliminate scams, secure merchant escrow payments, and enforce authenticity across Nigeria.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setCurrentPage('marketplace')}
              className="w-full sm:w-auto bg-[#FF5A00] hover:bg-[#e04f00] text-white font-black px-9 py-4 rounded-xl cursor-pointer transition-all shadow-xl shadow-orange-600/30"
            >
              Browse Marketplace →
            </button>
            <button
              type="button"
              onClick={() => setCurrentPage('signup')}
              className="w-full sm:w-auto text-white bg-slate-900/90 hover:bg-slate-800 font-bold px-9 py-4 rounded-xl cursor-pointer border border-slate-700"
            >
              Open Store As Seller
            </button>
          </div>
        </section>

        {/* Trust Metrics */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {trustMetrics.map((metric, idx) => (
            <div key={idx} className="bg-[#16223F]/90 backdrop-blur-md rounded-2xl p-6 border border-slate-700/80 flex items-center gap-4 shadow-xl">
              <div className="w-14 h-14 bg-[#0B132B] rounded-2xl flex items-center justify-center text-2xl border border-slate-800">{metric.icon}</div>
              <div>
                <p className="text-[11px] font-black text-slate-400 uppercase tracking-wider">{metric.label}</p>
                <p className="text-base font-black text-white mt-0.5 font-mono">{metric.value}</p>
              </div>
            </div>
          ))}
        </section>

        {/* DYNAMIC ROTATING MERCHANT SHOWCASE */}
        <section className="space-y-10 pt-4 border-t border-slate-800">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-[#FF5A00] bg-[#FF5A00]/15 px-3 py-1 rounded-full border border-[#FF5A00]/30">
                Rotational Merchant Spotlight
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                Promoted & Trending Customer Items 🔥
              </h2>
              <p className="text-slate-300 text-sm max-w-xl">
                Our rotational algorithm ensures every active merchant gets fair visibility. Check out what's moving fast right now!
              </p>
            </div>

            <button
              type="button"
              onClick={() => setCurrentPage('marketplace')}
              className="text-xs font-black uppercase tracking-wider text-[#FF5A00] hover:text-white bg-[#FF5A00]/10 hover:bg-[#FF5A00] px-5 py-3 rounded-xl border border-[#FF5A00]/30 transition cursor-pointer shrink-0"
            >
              View Full Catalog →
            </button>
          </div>

          {displayItems.trending.length === 0 ? (
            <div className="text-center py-12 bg-[#16223F]/50 rounded-3xl border border-slate-800">
              <p className="text-slate-400 text-sm">No listings found in the database yet. Be the first merchant to list or promote your products!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayItems.trending.map((item, idx) => (
                <div key={item.id || idx} className="bg-[#16223F] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl group hover:border-[#FF5A00]/40 transition duration-300 flex flex-col justify-between">
                  <div className="relative h-56 w-full bg-slate-900 overflow-hidden">
                    <span className="absolute top-3 left-3 z-10 bg-[#0B132B]/90 backdrop-blur border border-slate-700 text-[#FF5A00] text-[10px] font-black uppercase px-3 py-1 rounded-lg">
                      {item.promotionSettings?.adPlacement ? '⚡ Promoted Ad' : '⭐ Verified Listing'}
                    </span>
                    {item.img && item.img.startsWith('http') ? (
                      <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">🛍️</div>
                    )}
                  </div>
                  <div className="p-6 space-y-3">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">{item.category || 'General Store'}</span>
                    <h3 className="text-base font-bold text-white group-hover:text-[#FF5A00] transition truncate">{item.title}</h3>
                    <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                      <span className="text-lg font-black font-mono text-[#FF5A00]">₦{Number(item.price || 0).toLocaleString()}</span>
                      <button 
                        onClick={() => setCurrentPage('marketplace')}
                        className="bg-[#0B132B] hover:bg-[#FF5A00] text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer border border-slate-700"
                      >
                        View Product
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Headquarters Operations Showcase */}
        <section className="space-y-12 pt-6 border-t border-slate-800">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#FF5A00] bg-[#FF5A00]/15 px-3 py-1 rounded-full border border-[#FF5A00]/30">Inside The Hub</span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">Bold.ng Headquarters & Operations</h2>
            <p className="text-slate-300 text-sm">A glimpse into our daily engineering, merchant support, and physical logistics infrastructure powering secure retail across Nigeria.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {hqHighlights.map((item, index) => (
              <div key={index} className="bg-[#16223F]/95 backdrop-blur-md rounded-3xl border border-slate-700/80 overflow-hidden shadow-2xl flex flex-col justify-between group hover:border-[#FF5A00]/50 transition">
                <div className="relative h-52 sm:h-60 w-full overflow-hidden bg-[#0B132B]">
                  <div className="absolute top-3 left-3 z-10">
                    <span className="bg-[#0B132B]/90 backdrop-blur-md border border-slate-700 text-[#FF5A00] font-black text-[10px] uppercase tracking-wider px-3 py-1 rounded-lg">{item.badge}</span>
                  </div>
                  <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-95" />
                </div>
                <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-white group-hover:text-[#FF5A00] transition leading-snug">{item.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">{item.desc}</p>
                  </div>
                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-[11px] font-bold text-slate-400">
                    <span>📍 Lagos Command Center</span>
                    <span className="text-emerald-400 font-mono">● Active 24/7</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}