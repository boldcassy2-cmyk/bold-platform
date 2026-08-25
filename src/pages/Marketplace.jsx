import React, { useState } from 'react';

export default function Marketplace({ 
  items = [], 
  onTriggerCheckout, 
  onAddToCart, 
  cartItems = [], 
  onViewCart 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'electronics', label: '📱 Electronics' },
    { id: 'fashion', label: '👕 Fashion' },
    { id: 'automotive', label: '🚗 Automotive' },
  ];

  // Filter products by search term and selected category
  const filteredItems = items.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.meta?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Calculate live multi-item totals
  const totalCartCount = cartItems.reduce((acc, item) => acc + (Number(item.quantity) || 1), 0);
  const totalCartPrice = cartItems.reduce(
    (acc, item) => acc + (Number(item.price) || 0) * (Number(item.quantity) || 1),
    0
  );

  return (
    <div className="max-w-[1440px] mx-auto px-3 sm:px-6 py-4 space-y-6 pb-32 font-sans">
      
      {/* FILTER & SEARCH CONTROL BAR */}
      <div className="bg-[#16223F] p-4 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row gap-3 justify-between items-center">
          
          {/* Search Bar */}
          <div className="relative w-full md:w-1/2">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
              🔍
            </span>
            <input
              type="text"
              placeholder="Search products, brands, or tech specs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0B132B] text-white pl-10 pr-4 py-3 rounded-xl border border-slate-700/80 focus:outline-none focus:border-[#FF5A00] text-sm placeholder:text-slate-500 transition-all"
            />
          </div>

          {/* Categories Pill Bar */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-xs font-bold px-4 py-2.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#FF5A00] text-white shadow-[0_0_12px_rgba(255,90,0,0.35)]'
                    : 'bg-[#0B132B] text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* PRODUCT GRID SECTION */}
      {filteredItems.length === 0 ? (
        <div className="text-center py-24 bg-[#16223F] rounded-2xl border border-slate-800 shadow-inner">
          <div className="text-4xl mb-3">🔍</div>
          <h4 className="text-white font-bold text-base">No Matching Products</h4>
          <p className="text-slate-400 text-xs mt-1">Try adjusting your filters or search keywords.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {filteredItems.map((product) => {
            const placement = product.promotionSettings?.adPlacement;
            const originalPrice = product.oldPrice || (product.price ? product.price * 1.15 : null);

            return (
              <div
                key={product.id || product.docId}
                className="bg-[#16223F] rounded-2xl border border-slate-800/80 hover:border-[#FF5A00]/60 transition-all duration-300 flex flex-col justify-between group shadow-lg hover:shadow-2xl hover:-translate-y-1 relative overflow-hidden"
              >
                {/* Image Container with Badges */}
                <div className="relative w-full aspect-square bg-[#0B132B] overflow-hidden rounded-t-2xl">
                  
                  {/* Promotion / Ad Badge */}
                  {placement && (
                    <div className="absolute top-2 left-2 z-10">
                      <span
                        className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md tracking-wider ${
                          placement === 'broadcast'
                            ? 'bg-amber-500 text-slate-950 shadow-md'
                            : placement === 'trending'
                            ? 'bg-[#FF5A00] text-white'
                            : 'bg-indigo-600 text-white'
                        }`}
                      >
                        {placement}
                      </span>
                    </div>
                  )}

                  {/* Location Badge */}
                  <div className="absolute top-2 right-2 z-10">
                    <span className="bg-[#0B132B]/80 backdrop-blur-md border border-slate-700 text-slate-300 text-[9px] font-bold px-2 py-0.5 rounded-md">
                      📍 {product.location || 'Nigeria'}
                    </span>
                  </div>

                  {/* Image Render Block */}
                  {product.img && product.img.startsWith('http') ? (
                    <img
                      src={product.img}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        if (e.target.nextSibling) e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}

                  {/* Fallback Image View */}
                  <div
                    className={`w-full h-full flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-300 ${
                      product.img && product.img.startsWith('http') ? 'hidden' : 'flex'
                    }`}
                  >
                    {product.img && !product.img.startsWith('http') ? product.img : '📦'}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    {/* Category / Meta Tag */}
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide line-clamp-1">
                      {product.category || 'General Marketplace'}
                    </p>

                    {/* Product Title */}
                    <h3 className="text-xs sm:text-sm font-bold text-white mt-1 line-clamp-2 leading-snug group-hover:text-[#FF5A00] transition-colors min-h-[2.5rem]">
                      {product.title}
                    </h3>

                    {/* Social Proof / Rating placeholder */}
                    <div className="flex items-center gap-1 mt-1.5 text-[10px] text-amber-400">
                      <span>★ ★ ★ ★ ☆</span>
                      <span className="text-slate-500 font-mono">(4.5)</span>
                    </div>
                  </div>

                  {/* Pricing Block */}
                  <div className="pt-2 border-t border-slate-800/60">
                    <div className="flex items-baseline gap-1.5 flex-wrap">
                      <span className="text-base sm:text-lg font-black text-white font-mono tracking-tight">
                        ₦{Number(product.price).toLocaleString()}
                      </span>
                      {originalPrice && (
                        <span className="text-[10px] text-slate-500 line-through font-mono">
                          ₦{Math.round(originalPrice).toLocaleString()}
                        </span>
                      )}
                    </div>

                    {/* Quick Action Buttons */}
                    <div className="grid grid-cols-4 gap-1.5 mt-3">
                      <button
                        type="button"
                        title="Add to Basket"
                        onClick={() => onAddToCart(product)}
                        className="col-span-1 bg-[#0B132B] hover:bg-slate-800 text-white text-sm font-bold py-2 rounded-xl border border-slate-700/80 flex items-center justify-center transition-all cursor-pointer active:scale-95"
                      >
                        🛒
                      </button>
                      <button
                        type="button"
                        onClick={() => onTriggerCheckout(product)}
                        className="col-span-3 bg-[#FF5A00] hover:bg-[#e04f00] text-white text-xs font-bold py-2 rounded-xl border-none transition-all cursor-pointer shadow-[0_2px_10px_rgba(255,90,0,0.25)] active:scale-95 tracking-wide"
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* FLOATING MULTI-ITEM CART BAR */}
      {cartItems.length > 0 && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 w-[92%] max-w-3xl bg-[#16223F]/90 backdrop-blur-xl border border-[#FF5A00]/50 p-3.5 sm:p-4 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-50 flex items-center justify-between gap-4 transition-all animate-in fade-in slide-in-from-bottom-5">
          <div className="flex items-center gap-3">
            <div className="relative">
              <span className="w-10 h-10 rounded-xl bg-[#FF5A00] text-white font-black flex items-center justify-center text-sm shadow-md">
                🛒
              </span>
              <span className="absolute -top-1.5 -right-1.5 bg-white text-slate-950 font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#16223F]">
                {totalCartCount}
              </span>
            </div>
            <div className="text-left">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Cart Total ({cartItems.length} {cartItems.length === 1 ? 'Item' : 'Items'})
              </p>
              <p className="text-base sm:text-lg font-black text-white font-mono leading-tight">
                ₦{totalCartPrice.toLocaleString()}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onViewCart}
            className="bg-[#FF5A00] hover:bg-[#e04f00] text-white text-xs font-black uppercase tracking-wider px-5 py-3 rounded-xl transition-all shadow-lg shadow-[#FF5A00]/30 cursor-pointer border-none flex items-center gap-2 active:scale-95"
          >
            <span>Checkout</span>
            <span>→</span>
          </button>
        </div>
      )}
    </div>
  );
}