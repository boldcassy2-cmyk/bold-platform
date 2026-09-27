import React, { useState, useEffect, useRef } from 'react';

export default function Home({ setCurrentPage, allListings = [], currentUser = null }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [displayItems, setDisplayItems] = useState({ promoted: [], trending: [], highPaid: [] });
  
  const searchRef = useRef(null);

  // SMART ROTATION & PROMOTION FILTER ENGINE
  useEffect(() => {
    const safeListings = Array.isArray(allListings) ? allListings : [];

    const paidAds = safeListings.filter(item => item.promotionSettings?.adPlacement || item.isPromoted);
    const shuffledAds = [...paidAds].sort(() => 0.5 - Math.random());
    const shuffledTrending = [...safeListings].sort(() => 0.5 - Math.random());

    setDisplayItems({
      highPaid: shuffledAds.slice(0, 2),
      promoted: shuffledAds.slice(2, 5),
      trending: shuffledTrending.slice(0, 6)
    });
  }, [allListings]);

  // LIVE SEARCH AUTOCOMPLETE FILTER AS USER TYPES
  useEffect(() => {
    const safeListings = Array.isArray(allListings) ? allListings : [];
    if (searchQuery.trim().length > 0) {
      const query = searchQuery.toLowerCase();
      const matches = safeListings.filter(item => {
        const title = (item.name || item.title || '').toLowerCase();
        const category = (item.category || '').toLowerCase();
        const desc = (item.description || '').toLowerCase();
        return title.includes(query) || category.includes(query) || desc.includes(query);
      });
      setFilteredSuggestions(matches.slice(0, 5)); // Show top 5 suggestions
      setShowDropdown(true);
    } else {
      setFilteredSuggestions([]);
      setShowDropdown(false);
    }
  }, [searchQuery, allListings]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setShowDropdown(false);
    if (searchQuery.trim()) {
      setCurrentPage('marketplace');
    }
  };

  const handleProfileClick = () => {
    if (currentUser) {
      setCurrentPage('dashboard');
    } else {
      setCurrentPage('signup');
    }
  };

  const marketplaceDirections = [
    {
      title: 'How to Sell in Bold.ng',
      desc: 'Register your merchant account, upload verified product photos, set your price, and boost your items instantly.',
      icon: '📦',
      actionText: 'Open Store Now',
      target: 'signup'
    },
    {
      title: 'How to Buy from Bold.ng',
      desc: 'Search millions of verified products, chat securely with CAC-verified vendors, and pay safely through escrow.',
      icon: '🛒',
      actionText: 'Browse Catalog',
      target: 'marketplace'
    },
    {
      title: 'How to Apply & Verify',
      desc: 'Submit your business credentials for instant inspection badge approval and unlock zero-scam trust ratings.',
      icon: '🛡️',
      actionText: 'Get Verified',
      target: 'signup'
    }
  ];

  return (
    <main className="relative min-h-[calc(100vh-80px)] max-w-7xl mx-auto pt-4 pb-20 px-4 sm:px-6 lg:px-8 font-sans text-left space-y-16 overflow-hidden">
      
      {/* Background Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-15 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80")` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B132B]/90 via-[#0B132B]/80 to-[#0B132B]/95"></div>
      </div>

      <div className="relative z-10 space-y-16">
        
        {/* TOP BAR: LIVE SEARCH BAR WITH AUTOCOMPLETE + ACTIVE PROFILE AVATAR LINK */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-[#16223F]/95 backdrop-blur-md p-4 rounded-3xl border border-slate-700/80 shadow-2xl relative z-30">
          
          {/* Live Search Input & Autocomplete Dropdown */}
          <div ref={searchRef} className="flex-1 w-full relative">
            <form onSubmit={handleSearchSubmit} className="flex items-center bg-[#0B132B] border border-slate-700 rounded-2xl px-4 py-2.5 focus-within:border-[#FF5A00] transition">
              <span className="text-lg mr-3">🔍</span>
              <input 
                type="text"
                placeholder="Search phones, fashion, electronics, multi-vendor items on Bold.ng..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => { if (searchQuery.trim()) setShowDropdown(true); }}
                className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-slate-400 outline-none font-sans"
              />
              <button type="submit" className="bg-[#FF5A00] hover:bg-orange-600 text-white px-4 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ml-2">
                Search
              </button>
            </form>

            {/* Live Autocomplete Results Dropdown */}
            {showDropdown && filteredSuggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#16223F] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50">
                <div className="p-2 text-[10px] font-mono text-slate-400 uppercase tracking-widest border-b border-slate-700/60 bg-[#0B132B]">
                  Matching Available Items ({filteredSuggestions.length})
                </div>
                <div className="divide-y divide-slate-800 max-h-64 overflow-y-auto">
                  {filteredSuggestions.map((item, idx) => (
                    <div 
                      key={item.id || idx}
                      onClick={() => {
                        setShowDropdown(false);
                        setSearchQuery('');
                        setCurrentPage('marketplace');
                      }}
                      className="p-3 hover:bg-[#0B132B] transition flex items-center gap-3 cursor-pointer"
                    >
                      <img src={item.image || item.img} alt={item.name || item.title} className="w-10 h-10 object-cover rounded-xl bg-slate-800" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white truncate">{item.name || item.title}</p>
                        <p className="text-[10px] font-mono text-[#FF5A00]">₦{Number(item.price || 0).toLocaleString()}</p>
                      </div>
                      <span className="text-xs text-slate-400">→</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Fully Functional Profile / Auth Button Link */}
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={handleProfileClick}
              className="flex items-center gap-2.5 bg-[#0B132B] hover:bg-slate-800 border border-slate-700 px-4 py-2.5 rounded-2xl transition cursor-pointer group shadow"
            >
              <div className="w-8 h-8 rounded-full bg-[#FF5A00] flex items-center justify-center font-black text-white text-xs shadow group-hover:scale-105 transition">
                {currentUser && currentUser.displayName ? currentUser.displayName[0].toUpperCase() : '👤'}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-white">{currentUser ? (currentUser.displayName || 'My Dashboard') : 'Sign Up / Login'}</p>
                <p className="text-[10px] text-slate-400 font-mono">{currentUser ? 'Active Session' : 'Access Account'}</p>
              </div>
            </button>
          </div>
        </div>

        {/* HERO ATTRACTION SECTION */}
        <section className="flex flex-col items-center text-center max-w-4xl mx-auto pt-2 pb-4 space-y-6">
          <div className="inline-flex items-center gap-2 text-xs font-black px-5 py-2 rounded-full border border-[#FF5A00]/40 uppercase tracking-widest bg-[#FF5A00]/15 text-[#FF5A00] shadow-[0_0_20px_rgba(255,90,0,0.2)]">
            <span>⚡</span> Nigeria's High-Trust Multi-Vendor Marketplace
          </div>

          <h1 className="text-3xl sm:text-6xl font-black text-white leading-tight tracking-tight">
            What would you like to <span className="text-[#FF5A00]">buy</span> or <span className="text-[#FF5A00]">sell</span> on Bold.ng today?
          </h1>

          <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
            Join thousands of verified merchants and smart shoppers. Experience escrow-secured transactions, instant storefront creation, and zero-scam retail guarantees.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <button
              onClick={() => setCurrentPage('marketplace')}
              className="bg-[#FF5A00] hover:bg-orange-600 text-white font-black px-8 py-3.5 rounded-xl cursor-pointer transition shadow-xl text-xs sm:text-sm uppercase tracking-wider"
            >
              🛒 Explore All Products
            </button>
            <button
              onClick={() => setCurrentPage('signup')}
              className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-8 py-3.5 rounded-xl cursor-pointer border border-slate-700 transition text-xs sm:text-sm uppercase tracking-wider"
            >
              🚀 Start Selling Free
            </button>
          </div>
        </section>

        {/* DIRECTIONS & GUIDES */}
        <section className="space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">How Bold.ng Works For You</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">Simple steps to get started as a buyer, merchant, or verified vendor.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {marketplaceDirections.map((guide, idx) => (
              <div key={idx} className="bg-[#16223F] border border-slate-700/80 rounded-3xl p-6 shadow-xl flex flex-col justify-between hover:border-[#FF5A00]/50 transition group">
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-[#0B132B] rounded-2xl flex items-center justify-center text-2xl border border-slate-800 shadow-inner">
                    {guide.icon}
                  </div>
                  <h3 className="text-base font-black text-white group-hover:text-[#FF5A00] transition">{guide.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{guide.desc}</p>
                </div>
                <button 
                  onClick={() => setCurrentPage(guide.target)}
                  className="mt-6 w-full bg-[#0B132B] hover:bg-[#FF5A00] text-white py-2.5 rounded-xl text-xs font-bold transition cursor-pointer border border-slate-700"
                >
                  {guide.actionText} →
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* HIGH-PAID TRENDING PROMOTED PRODUCTS */}
        {displayItems.highPaid.length > 0 && (
          <section className="space-y-6 bg-gradient-to-r from-[#16223F] via-[#1a294f] to-[#16223F] p-6 sm:p-8 rounded-3xl border border-[#FF5A00]/40 shadow-2xl">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#FF5A00] bg-[#FF5A00]/15 px-3 py-1 rounded-full border border-[#FF5A00]/30">
                  🔥 Featured Premium Ad Spotlight
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white mt-1">High-Demand Trending Promoted Items</h2>
              </div>
              <button 
                onClick={() => setCurrentPage('marketplace')}
                className="text-xs text-[#FF5A00] hover:text-white font-mono cursor-pointer"
              >
                View All →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {displayItems.highPaid.map((item, idx) => (
                <div key={item.id || idx} className="bg-[#0B132B] border border-slate-700 rounded-2xl overflow-hidden flex flex-col sm:flex-row shadow-lg group">
                  <img src={item.image || item.img} alt={item.name || item.title} className="w-full sm:w-48 h-48 object-cover bg-slate-800" />
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                    <div>
                      <span className="text-[10px] bg-[#FF5A00]/20 text-[#FF5A00] font-mono px-2 py-0.5 rounded-full uppercase">{item.category || 'Featured'}</span>
                      <h3 className="font-bold text-sm sm:text-base mt-1 group-hover:text-[#FF5A00] transition">{item.name || item.title}</h3>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1">{item.description || 'Verified merchant item with active top ad boost.'}</p>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                      <span className="text-sm font-mono font-bold text-[#FF5A00]">₦{Number(item.price || 0).toLocaleString()}</span>
                      <button 
                        onClick={() => setCurrentPage('marketplace')}
                        className="bg-[#FF5A00] hover:bg-orange-600 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer"
                      >
                        Buy Now 🛒
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* GENERAL TRENDING MARKETPLACE PRODUCTS */}
        <section className="space-y-6 pt-4 border-t border-slate-800">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-[#FF5A00] bg-[#FF5A00]/15 px-3 py-1 rounded-full border border-[#FF5A00]/30">
                Standard Marketplace Catalog
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1">Trending Products Across All Vendors 🛍️</h2>
            </div>
            <button 
              onClick={() => setCurrentPage('marketplace')}
              className="bg-[#FF5A00]/10 hover:bg-[#FF5A00] text-[#FF5A00] hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition border border-[#FF5A00]/30 cursor-pointer"
            >
              Browse Full Catalog →
            </button>
          </div>

          {displayItems.trending.length === 0 ? (
            <div className="text-center py-12 bg-[#16223F]/50 rounded-3xl border border-slate-800">
              <p className="text-slate-400 text-xs sm:text-sm font-mono">No products listed in marketplace yet. Be the first vendor to upload!</p>
              <button 
                onClick={() => setCurrentPage('signup')}
                className="mt-4 bg-[#FF5A00] text-white px-6 py-2.5 rounded-xl text-xs font-bold cursor-pointer"
              >
                Create Merchant Account 🚀
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayItems.trending.map((item, idx) => (
                <div key={item.id || idx} className="bg-[#16223F] border border-slate-800 rounded-3xl overflow-hidden shadow-xl group hover:border-[#FF5A00]/50 transition flex flex-col justify-between">
                  <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
                    <span className="absolute top-3 left-3 z-10 bg-[#0B132B]/90 backdrop-blur border border-slate-700 text-[#FF5A00] text-[10px] font-black uppercase px-3 py-1 rounded-lg">
                      {item.isPromoted ? '🔥 Promoted' : '⭐ Verified'}
                    </span>
                    <img src={item.image || item.img} alt={item.name || item.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  </div>
                  <div className="p-5 space-y-3">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">{item.category || 'General Goods'}</span>
                    <h3 className="text-sm font-bold text-white group-hover:text-[#FF5A00] transition truncate">{item.name || item.title}</h3>
                    <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                      <span className="text-base font-black font-mono text-[#FF5A00]">₦{Number(item.price || 0).toLocaleString()}</span>
                      <button 
                        onClick={() => setCurrentPage('marketplace')}
                        className="bg-[#0B132B] hover:bg-[#FF5A00] text-white text-xs font-bold px-3.5 py-2 rounded-xl transition cursor-pointer border border-slate-700"
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

      </div>
    </main>
  );
}