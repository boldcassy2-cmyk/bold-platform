import React, { useState } from 'react';

export default function MarketplaceLayout({ 
  currentUser, 
  products = [], 
  onSelectProduct, 
  setCurrentPage, 
  onLogout 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const categories = [
    { id: 'all', label: '🔥 All Departments' },
    { id: 'automobiles', label: '🚗 Automobiles' },
    { id: 'phones_gadgets', label: '📱 Phones & Laptops' },
    { id: 'realestate', label: '🏢 Real Estate' },
    { id: 'building_materials', label: '🏗️ Building Materials' },
    { id: 'foodstuffs_agro', label: '🌾 Food & Agro' },
    { id: 'services', label: '⚙️ Services & Logistics' },
  ];

  const filteredProducts = products.filter(item => {
    const matchesSearch = item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.category?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#eaeded] text-[#0f1111] font-sans selection:bg-[#febd69]">
      
      {/* ========================================================= */}
      {/* 1. AMAZON-STYLE MOBILE HEADER                             */}
      {/* ========================================================= */}
      <header className="sticky top-0 z-50 bg-[#131921] text-white shadow-md">
        {/* Top Bar: Logo, Location / User State, Cart / Account */}
        <div className="px-3 py-2.5 flex items-center justify-between gap-3">
          {/* Logo & Menu Trigger */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setMobileMenuOpen(true)}
              className="text-white p-1 focus:outline-none cursor-pointer flex flex-col space-y-1"
              aria-label="Open Menu"
            >
              <div className="w-5 h-0.5 bg-white"></div>
              <div className="w-5 h-0.5 bg-white"></div>
              <div className="w-5 h-0.5 bg-white"></div>
            </button>
            <div 
              onClick={() => setCurrentPage('marketplace')}
              className="cursor-pointer flex items-baseline tracking-tighter"
            >
              <span className="text-xl font-black text-white">bold</span>
              <span className="text-xl font-black text-[#ff9900]">.ng</span>
            </div>
          </div>

          {/* User Quick Account / Sign In State */}
          <div className="flex items-center gap-3">
            {currentUser ? (
              <div className="flex items-center gap-2 text-xs">
                <span className="hidden sm:inline text-slate-300">Hello,</span>
                <span className="font-bold text-white truncate max-w-[90px]">
                  {currentUser.displayName || currentUser.email?.split('@')[0]}
                </span>
                <button
                  onClick={() => setCurrentPage('add-product')}
                  className="bg-[#febd69] text-[#111] font-bold px-2.5 py-1 rounded-md text-[11px] shadow-sm hover:bg-[#f3a847] transition-colors"
                >
                  + Sell
                </button>
              </div>
            ) : (
              <button
                onClick={() => setCurrentPage('login')}
                className="bg-[#febd69] text-[#111] font-bold px-3 py-1.5 rounded-md text-xs shadow-sm hover:bg-[#f3a847] transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        </div>

        {/* Search Bar Bar (Amazon Signature Search Input) */}
        <div className="px-3 pb-3">
          <div className="flex items-center bg-white rounded-lg overflow-hidden border-2 border-transparent focus-within:border-[#febd69] shadow-inner">
            <span className="pl-3 text-slate-400 text-base">🔍</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search bold.ng products, cars, services..."
              className="w-full py-2.5 px-3 text-sm text-[#0f1111] outline-none bg-transparent placeholder:text-slate-400"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="px-3 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Sub-Header Department Scroll (Horizontal Category Bar) */}
        <div className="bg-[#232f3e] px-2 py-2 overflow-x-auto no-scrollbar flex items-center gap-2 border-t border-slate-700/50 whitespace-nowrap">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-[#febd69] text-[#111] font-bold shadow'
                  : 'bg-slate-800/80 text-slate-200 hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </header>


      {/* ========================================================= */}
      {/* 2. BODY / MAIN CONTENT AREA                               */}
      {/* ========================================================= */}
      <main className="max-w-7xl mx-auto px-2 sm:px-4 py-4 space-y-4">
        
        {/* Amazon-Style Delivery Banner / Notice */}
        <div className="bg-[#232f3e] text-white p-3 rounded-lg flex items-center justify-between text-xs shadow-sm">
          <div className="flex items-center gap-2">
            <span>📍</span>
            <span>Delivering to Nigeria — Select your location for verified local deals</span>
          </div>
          <span className="text-[#febd69] font-bold cursor-pointer underline">Update</span>
        </div>

        {/* Results Header Info */}
        <div className="flex items-center justify-between px-1">
          <h2 className="text-sm font-bold text-slate-700">
            {filteredProducts.length} Results for <span className="text-[#007185]">"{selectedCategory === 'all' ? 'All Departments' : selectedCategory}"</span>
          </h2>
        </div>

        {/* Product Grid (Amazon Mobile Two-Column Grid Layout) */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center space-y-3 shadow-sm border border-slate-200 my-6">
            <span className="text-4xl block">📦</span>
            <h3 className="text-base font-bold text-slate-800">No listings found</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              We couldn't find any items matching your active filter or search query. Try searching for something else or post an item!
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="mt-2 bg-[#febd69] hover:bg-[#f3a847] text-[#111] text-xs font-bold px-4 py-2 rounded-lg shadow-sm transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => onSelectProduct && onSelectProduct(product)}
                className="bg-white rounded-lg p-3 border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between cursor-pointer group"
              >
                <div>
                  {/* Product Image Thumbnail */}
                  <div className="w-full h-36 sm:h-44 bg-slate-100 rounded-md overflow-hidden relative mb-2.5 flex items-center justify-center">
                    <img 
                      src={product.img || product.media?.imageUrl || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400'} 
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                    <span className="absolute top-1.5 left-1.5 bg-black/60 backdrop-blur-xs text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                      {product.location || 'Nigeria'}
                    </span>
                  </div>

                  {/* Product Title */}
                  <h3 className="text-xs sm:text-sm font-medium text-[#0f1111] line-clamp-2 leading-snug mb-1 group-hover:text-[#007185]">
                    {product.title}
                  </h3>

                  {/* Rating Simulation (Amazon Style) */}
                  <div className="flex items-center gap-1 mb-1.5">
                    <span className="text-[#de7921] text-[11px]">★★★★☆</span>
                    <span className="text-[10px] text-[#007185]">24</span>
                  </div>
                </div>

                {/* Price & Action */}
                <div className="pt-2 border-t border-slate-100 mt-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-[10px] font-bold text-slate-500">₦</span>
                    <span className="text-sm sm:text-base font-black text-[#0f1111]">
                      {Number(product.price || 0).toLocaleString()}
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">
                    ✓ Verified Vendor
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>


      {/* ========================================================= */}
      {/* 3. AMAZON-STYLE STRUCTURED FOOTER                         */}
      {/* ========================================================= */}
      <footer className="mt-12 bg-[#232f3e] text-white">
        {/* Back to Top Quick Action */}
        <div 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="bg-[#37475a] hover:bg-[#485769] py-3 text-center text-xs font-bold cursor-pointer transition-colors text-slate-200"
        >
          Back to top ↑
        </div>

        {/* Footer Navigation Columns */}
        <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-xs text-slate-300 border-b border-slate-700/60">
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-sm">Get to Know Us</h4>
            <ul className="space-y-2">
              <li className="hover:underline cursor-pointer">About Bold NG</li>
              <li className="hover:underline cursor-pointer">Careers & Academy</li>
              <li className="hover:underline cursor-pointer">Press Releases</li>
              <li className="hover:underline cursor-pointer">Policies & Trust</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-sm">Make Money with Us</h4>
            <ul className="space-y-2">
              <li onClick={() => setCurrentPage('add-product')} className="hover:underline cursor-pointer text-[#febd69]">Sell on Bold NG</li>
              <li className="hover:underline cursor-pointer">Protect & Build Your Brand</li>
              <li className="hover:underline cursor-pointer">Advertise Your Products</li>
              <li className="hover:underline cursor-pointer">Become an Affiliate</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-sm">Payment Products</h4>
            <ul className="space-y-2">
              <li className="hover:underline cursor-pointer">Bold Escrow Secure</li>
              <li className="hover:underline cursor-pointer">Business Cards & Credit</li>
              <li className="hover:underline cursor-pointer">Reload Your Account</li>
              <li className="hover:underline cursor-pointer">Currency Converter</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-sm">Let Us Help You</h4>
            <ul className="space-y-2">
              <li className="hover:underline cursor-pointer">Your Account & Orders</li>
              <li className="hover:underline cursor-pointer">Shipping Rates & Policies</li>
              <li className="hover:underline cursor-pointer">Returns & Replacements</li>
              <li className="hover:underline cursor-pointer">Help Center & Support</li>
            </ul>
          </div>
        </div>

        {/* Copyright & Branding Bottom Bar */}
        <div className="bg-[#131921] py-8 text-center space-y-3 text-[11px] text-slate-400">
          <div className="flex items-center justify-center gap-2">
            <span className="text-base font-black text-white">bold</span>
            <span className="text-base font-black text-[#ff9900]">.ng</span>
            <span>Marketplace NG</span>
          </div>
          <p>© {new Date().getFullYear()}, Bold Dot NG Marketplace. Built for speed, security, and professional trade.</p>
        </div>
      </footer>


      {/* ========================================================= */}
      {/* 4. MOBILE SLIDER SIDE MENU (Amazon Drawer Style)          */}
      {/* ========================================================= */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop overlay */}
          <div 
            onClick={() => setMobileMenuOpen(false)} 
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
          />

          {/* Drawer Body */}
          <div className="relative w-4/5 max-w-xs bg-white text-[#0f1111] h-full shadow-2xl flex flex-col z-10 overflow-y-auto">
            {/* Drawer Header */}
            <div className="bg-[#232f3e] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">👤</span>
                <span className="font-bold text-sm truncate">
                  {currentUser ? (currentUser.displayName || currentUser.email) : 'Hello, Sign In'}
                </span>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="text-white text-lg font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Drawer Navigation Links */}
            <div className="p-4 space-y-6 text-sm divide-y divide-slate-100">
              <div className="space-y-3">
                <h4 className="font-black text-xs text-slate-400 uppercase tracking-widest">Trending</h4>
                <p onClick={() => { setSelectedCategory('all'); setMobileMenuOpen(false); }} className="font-bold cursor-pointer hover:text-[#ff9900]">Best Sellers</p>
                <p onClick={() => { setSelectedCategory('automobiles'); setMobileMenuOpen(false); }} className="font-bold cursor-pointer hover:text-[#ff9900]">Automobiles & Cars</p>
                <p onClick={() => { setSelectedCategory('phones_gadgets'); setMobileMenuOpen(false); }} className="font-bold cursor-pointer hover:text-[#ff9900]">Phones & Laptops</p>
              </div>

              <div className="pt-4 space-y-3">
                <h4 className="font-black text-xs text-slate-400 uppercase tracking-widest">Shop By Department</h4>
                {categories.map(cat => (
                  <p 
                    key={cat.id} 
                    onClick={() => { setSelectedCategory(cat.id); setMobileMenuOpen(false); }}
                    className="font-medium text-slate-700 cursor-pointer hover:text-[#ff9900]"
                  >
                    {cat.label}
                  </p>
                ))}
              </div>

              <div className="pt-4 space-y-3">
                <h4 className="font-black text-xs text-slate-400 uppercase tracking-widest">Help & Settings</h4>
                {currentUser ? (
                  <>
                    <p onClick={() => { setCurrentPage('add-product'); setMobileMenuOpen(false); }} className="font-bold text-[#ff9900] cursor-pointer">Sell an Item</p>
                    <p onClick={() => { onLogout(); setMobileMenuOpen(false); }} className="font-bold text-red-600 cursor-pointer">Sign Out</p>
                  </>
                ) : (
                  <p onClick={() => { setCurrentPage('login'); setMobileMenuOpen(false); }} className="font-bold text-[#007185] cursor-pointer">Sign In / Register</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}