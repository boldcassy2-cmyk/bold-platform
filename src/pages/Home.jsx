import React, { useState, useEffect, useRef } from 'react';

export default function Home({ setCurrentPage, allListings = [], currentUser = null }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [displayItems, setDisplayItems] = useState({ promoted: [], trending: [], highPaid: [], electronics: [], fashion: [] });
  
  const searchRef = useRef(null);

  // SMART ROTATION & PROMOTION FILTER ENGINE + CATEGORY SEGREGATION
  useEffect(() => {
    const safeListings = Array.isArray(allListings) ? allListings : [];

    const paidAds = safeListings.filter(item => item.promotionSettings?.adPlacement || item.isPromoted);
    const shuffledAds = [...paidAds].sort(() => 0.5 - Math.random());
    const shuffledTrending = [...safeListings].sort(() => 0.5 - Math.random());
    
    const electronics = safeListings.filter(item => (item.category || '').toLowerCase().includes('electronic') || (item.category || '').toLowerCase().includes('phone') || (item.category || '').toLowerCase().includes('gadget'));
    const fashion = safeListings.filter(item => (item.category || '').toLowerCase().includes('fashion') || (item.category || '').toLowerCase().includes('cloth') || (item.category || '').toLowerCase().includes('wear'));

    setDisplayItems({
      highPaid: shuffledAds.slice(0, 2),
      promoted: shuffledAds.slice(2, 5),
      trending: shuffledTrending.slice(0, 8),
      electronics: electronics.length > 0 ? electronics.slice(0, 4) : shuffledTrending.slice(0, 4),
      fashion: fashion.length > 0 ? fashion.slice(0, 4) : shuffledTrending.slice(4, 8)
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
      setFilteredSuggestions(matches.slice(0, 5));
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

  const amazonCategories = [
    { name: 'All Departments', icon: '☰', target: 'marketplace' },
    { name: 'Phones & Tech', icon: '📱', target: 'marketplace' },
    { name: 'Fashion & Wear', icon: '👕', target: 'marketplace' },
    { name: 'Computing', icon: '💻', target: 'marketplace' },
    { name: 'Escrow Protected', icon: '🛡️️', target: 'marketplace' },
    { name: 'CAC Verified Stores', icon: '⭐', target: 'signup' },
  ];

  return (
    <main className="relative min-h-[calc(100vh-80px)] max-w-7xl mx-auto pb-20 font-sans text-left space-y-6 overflow-hidden">
      
      {/* BACKGROUND OVERLAY */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-10 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80")` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#0B132B]/95 via-[#0B132B]/90 to-[#0B132B]/98"></div>
      </div>

      <div className="relative z-10 space-y-6">
        
        {/* AMAZON-STYLE SUB NAVIGATION BAR (DEPARTMENTS) */}
        <div className="bg-[#131A22] border-b border-slate-800 px-4 sm:px-6 py-2.5 flex items-center gap-6 overflow-x-auto whitespace-nowrap scrollbar-none shadow-md">
          {amazonCategories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentPage(cat.target)}
              className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-[#FF5A00] transition cursor-pointer"
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* TOP SEARCH & HEADER BAR */}
        <div className="px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-[#16223F]/95 backdrop-blur-md p-3.5 rounded-2xl border border-slate-700/80 shadow-xl relative z-30">
            
            {/* Live Search Input & Autocomplete Dropdown */}
            <div ref={searchRef} className="flex-1 w-full relative">
              <form onSubmit={handleSearchSubmit} className="flex items-center bg-[#0B132B] border border-slate-700 rounded-xl px-3 py-2 focus-within:border-[#FF5A00] transition">
                <span className="text-sm mr-2.5">🔍</span>
                <input 
                  type="text"
                  placeholder="Search Bold.ng for millions of products, verified vendors..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => { if (searchQuery.trim()) setShowDropdown(true); }}
                  className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-slate-400 outline-none font-sans"
                />
                <button type="submit" className="bg-[#FF5A00] hover:bg-orange-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ml-2">
                  Search
                </button>
              </form>

              {/* Autocomplete Results */}
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

            {/* Account & Profile Link */}
            <div className="flex items-center gap-3 shrink-0">
              <button 
                onClick={handleProfileClick}
                className="flex items-center gap-2.5 bg-[#0B132B] hover:bg-slate-800 border border-slate-700 px-3.5 py-2 rounded-xl transition cursor-pointer group shadow"
              >
                <div className="w-7 h-7 rounded-full bg-[#FF5A00] flex items-center justify-center font-black text-white text-xs shadow group-hover:scale-105 transition">
                  {currentUser && currentUser.displayName ? currentUser.displayName[0].toUpperCase() : '👤'}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-[11px] font-bold text-white">{currentUser ? (currentUser.displayName || 'Account & Lists') : 'Hello, Sign in'}</p>
                  <p className="text-[9px] text-slate-400 font-mono">{currentUser ? 'Active Session' : 'Account & Orders'}</p>
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* AMAZON HERO BANNER & QUICK STAT CARDS SECTION */}
        <div className="px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            
            {/* Main Hero Slider/Banner Area (Takes 3 columns) */}
            <div className="lg:col-span-3 bg-gradient-to-r from-[#16223F] via-[#1a2c56] to-[#16223F] border border-slate-700/80 rounded-3xl p-6 sm:p-10 shadow-2xl flex flex-col justify-between relative overflow-hidden">
              <div className="absolute -right-10 -bottom-10 opacity-10 text-9xl pointer-events-none">
                🛒
              </div>
              <div className="space-y-4 max-w-2xl relative z-10">
                <span className="inline-flex items-center gap-2 text-[10px] font-black px-3.5 py-1 rounded-full border border-[#FF5A00]/40 uppercase tracking-widest bg-[#FF5A00]/15 text-[#FF5A00]">
                  <span>⚡</span> Nigeria's High-Trust Multi-Vendor Marketplace
                </span>
                <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
                  Shop securely with <span className="text-[#FF5A00]">Escrow Protection</span> & CAC-verified vendors.
                </h1>
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  Experience zero-scam online shopping, instant merchant storefront creation, and lightning-fast delivery across Nigeria.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-6 relative z-10">
                <button
                  onClick={() => setCurrentPage('marketplace')}
                  className="bg-[#FF5A00] hover:bg-orange-600 text-white font-black px-6 py-3 rounded-xl cursor-pointer transition shadow-xl text-xs uppercase tracking-wider"
                >
                  🛒 Shop Marketplace
                </button>
                <button
                  onClick={() => setCurrentPage('signup')}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3 rounded-xl cursor-pointer border border-slate-700 transition text-xs uppercase tracking-wider"
                >
                  🚀 Become a Merchant
                </button>
              </div>
            </div>

            {/* Right Side Quick Widget (Sign in / Sign up Box like Amazon) */}
            <div className="bg-[#16223F] border border-slate-700/80 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <h3 className="text-base font-black text-white">Sign in for the best experience</h3>
                <p className="text-xs text-slate-300">Access personalized orders, track escrow payments, and manage your merchant store.</p>
              </div>
              <div className="space-y-3">
                <button 
                  onClick={() => setCurrentPage('signup')}
                  className="w-full bg-[#FF5A00] hover:bg-orange-600 text-white py-2.5 rounded-xl text-xs font-black transition cursor-pointer shadow-lg"
                >
                  Sign In / Register Securely
                </button>
                <div className="text-center">
                  <span className="text-[10px] font-mono text-slate-400">Protected by Bold.ng Trust Protocol</span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* AMAZON 4-COLUMN CATEGORY CARDS GRID */}
        <div className="px-4 sm:px-6 pt-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Card 1: Electronics & Gadgets */}
            <div className="bg-[#16223F] border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col justify-between space-y-4 hover:border-[#FF5A00]/40 transition">
              <div className="space-y-2">
                <h3 className="text-sm font-black text-white">Top Electronics & Gadgets</h3>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  {displayItems.electronics.slice(0, 2).map((item, idx) => (
                    <div key={idx} onClick={() => setCurrentPage('marketplace')} className="cursor-pointer group">
                      <img src={item.image || item.img} alt={item.name} className="w-full h-24 object-cover rounded-xl bg-slate-900 group-hover:opacity-90 transition" />
                      <p className="text-[10px] text-slate-300 mt-1 truncate">{item.name || item.title}</p>
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={() => setCurrentPage('marketplace')} className="text-xs text-[#FF5A00] hover:text-white font-bold cursor-pointer text-left">
                See more electronics →
              </button>
            </div>

            {/* Card 2: Fashion & Streetwear */}
            <div className="bg-[#16223F] border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col justify-between space-y-4 hover:border-[#FF5A00]/40 transition">
              <div className="space-y-2">
                <h3 className="text-sm font-black text-white">Fashion & Trendy Wear</h3>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  {displayItems.fashion.slice(0, 2).map((item, idx) => (
                    <div key={idx} onClick={() => setCurrentPage('marketplace')} className="cursor-pointer group">
                      <img src={item.image || item.img} alt={item.name} className="w-full h-24 object-cover rounded-xl bg-slate-900 group-hover:opacity-90 transition" />
                      <p className="text-[10px] text-slate-300 mt-1 truncate">{item.name || item.title}</p>
                    </div>
                  ))}
                </div>
              </div>
              <button onClick={() => setCurrentPage('marketplace')} className="text-xs text-[#FF5A00] hover:text-white font-bold cursor-pointer text-left">
                Discover fashion trends →
              </button>
            </div>

            {/* Card 3: How Bold.ng Works */}
            <div className="bg-[#16223F] border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col justify-between space-y-4 hover:border-[#FF5A00]/40 transition">
              <div className="space-y-2">
                <h3 className="text-sm font-black text-white">Escrow Buyer Protection</h3>
                <p className="text-xs text-slate-300 leading-relaxed pt-1">
                  Your funds are securely held in escrow until you receive and inspect your item. Zero risk of online scams.
                </p>
                <div className="p-3 bg-[#0B132B] rounded-2xl border border-slate-800 text-center">
                  <span className="text-xs text-[#FF5A00] font-bold">🛡️ 100% Money-Back Guarantee</span>
                </div>
              </div>
              <button onClick={() => setCurrentPage('marketplace')} className="text-xs text-[#FF5A00] hover:text-white font-bold cursor-pointer text-left">
                Learn about Escrow →
              </button>
            </div>

            {/* Card 4: Sell on Bold.ng */}
            <div className="bg-[#16223F] border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col justify-between space-y-4 hover:border-[#FF5A00]/40 transition">
              <div className="space-y-2">
                <h3 className="text-sm font-black text-white">Start Your Store Today</h3>
                <p className="text-xs text-slate-300 leading-relaxed pt-1">
                  Register your business name or merchant profile with CAC verification badge to build instant buyer trust.
                </p>
                <div className="p-3 bg-[#0B132B] rounded-2xl border border-slate-800 text-center">
                  <span className="text-xs text-white font-bold">🚀 Instant Setup</span>
                </div>
              </div>
              <button onClick={() => setCurrentPage('signup')} className="text-xs text-[#FF5A00] hover:text-white font-bold cursor-pointer text-left">
                Open your store now →
              </button>
            </div>

          </div>
        </div>

        {/* HIGH-PAID SPONSORED ADS ROW */}
        {displayItems.highPaid.length > 0 && (
          <div className="px-4 sm:px-6">
            <div className="bg-gradient-to-r from-[#16223F] via-[#1a294f] to-[#16223F] p-6 sm:p-8 rounded-3xl border border-[#FF5A00]/40 shadow-2xl space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#FF5A00] bg-[#FF5A00]/15 px-3 py-1 rounded-full border border-[#FF5A00]/30">
                    🔥 Featured Premium Sponsored Spotlight
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-white mt-1">High-Demand Promoted Items</h2>
                </div>
                <button onClick={() => setCurrentPage('marketplace')} className="text-xs text-[#FF5A00] hover:text-white font-mono cursor-pointer">
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
                        <button onClick={() => setCurrentPage('marketplace')} className="bg-[#FF5A00] hover:bg-orange-600 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer">
                          Buy Now 🛒
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* GENERAL TRENDING PRODUCTS GRID (AMAZON STYLE CAROUSEL GRID) */}
        <div className="px-4 sm:px-6 pt-4">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-[#FF5A00] bg-[#FF5A00]/15 px-3 py-1 rounded-full border border-[#FF5A00]/30">
                  Standard Marketplace Catalog
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-white mt-1">Trending Products Across All Vendors 🛍️️</h2>
              </div>
              <button onClick={() => setCurrentPage('marketplace')} className="bg-[#FF5A00]/10 hover:bg-[#FF5A00] text-[#FF5A00] hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition border border-[#FF5A00]/30 cursor-pointer">
                Browse Full Catalog →
              </button>
            </div>

            {displayItems.trending.length === 0 ? (
              <div className="text-center py-12 bg-[#16223F]/50 rounded-3xl border border-slate-800">
                <p className="text-slate-400 text-xs sm:text-sm font-mono">No products listed in marketplace yet. Be the first vendor to upload!</p>
                <button onClick={() => setCurrentPage('signup')} className="mt-4 bg-[#FF5A00] text-white px-6 py-2.5 rounded-xl text-xs font-bold cursor-pointer">
                  Create Merchant Account 🚀
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
                        <button onClick={() => setCurrentPage('marketplace')} className="bg-[#0B132B] hover:bg-[#FF5A00] text-white text-xs font-bold px-3.5 py-2 rounded-xl transition cursor-pointer border border-slate-700">
                          View Product
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}