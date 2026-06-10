import React, { useState } from 'react';

export default function Marketplace({ items, onTriggerCheckout, onAddToCart, getRelatedItems }) {
  const [selectedProduct, setSelectedProduct] = useState(null);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8 animate-fadeIn">
      
      {/* HEADER BILLBOARD BRANDING */}
      <div className="bg-gradient-to-r from-[#16223F] via-[#1a2b54] to-[#16223F] rounded-3xl p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF5A00]/10 rounded-full blur-3xl pointer-events-none"></div>
        <span className="bg-[#FF5A00]/20 text-[#FF5A00] border border-[#FF5A00]/30 text-[10px] uppercase tracking-widest font-black px-3 py-1 rounded-full">
          Bold Certified Escrow Protection Engaged
        </span>
        <h1 className="text-3xl md:text-4xl font-black tracking-tight mt-3 text-white">
          Explore the Decentralized <span className="text-[#FF5A00]">Marketplace</span>
        </h1>
        <p className="text-slate-400 text-xs max-w-xl mt-2 leading-relaxed">
          Verify grading, run secure balance allocations, and source electronics with 100% money-back escrow insurance tracking layers built natively.
        </p>
      </div>

      {/* TWO-COLUMN EXPLORER MATRIX */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN: GLOBAL FEED CARDS */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-black uppercase text-slate-400 tracking-wider">Available Verified Inventory</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {items.map((item) => (
              <div 
                key={item.id || item.docId}
                onClick={() => setSelectedProduct(item)}
                className={`bg-[#16223F] rounded-2xl p-5 border cursor-pointer transition-all flex flex-col justify-between hover:shadow-xl ${selectedProduct?.id === item.id ? 'border-[#FF5A00] bg-[#1a2b54]' : 'border-slate-800/80 hover:border-slate-700'}`}
              >
                <div>
                  <div className="flex justify-between items-start">
                    <span className="text-3xl">{item.img || '📦'}</span>
                    {item.promotionSettings?.adPlacement && (
                      <span className="bg-[#FF5A00] text-white text-[9px] font-black uppercase px-2 py-0.5 rounded shadow">
                        PROMOTED
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-white mt-3 line-clamp-2">{item.title}</h3>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">📍 {item.location} • {item.meta}</p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-base font-black text-[#FF5A00]">₦{Number(item.price).toLocaleString()}</span>
                  <span className="text-[10px] font-bold text-slate-400 bg-[#0B132B] px-2.5 py-1 rounded-md border border-slate-800">
                    Inspect Detail →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: INSPECTOR DRAWER + LAYER 1 RECOMMENDATION SLIDER */}
        <div className="lg:col-span-1">
          <div className="sticky top-28 space-y-4">
            <h2 className="text-sm font-black uppercase text-slate-400 tracking-wider">Product Verification Hub</h2>

            {selectedProduct ? (
              <div className="space-y-4">
                {/* Core Inspection Details */}
                <div className="bg-[#16223F] rounded-2xl p-6 border border-slate-800 shadow-2xl space-y-5">
                  <div className="flex items-center gap-4">
                    <span className="text-5xl bg-[#0B132B] p-3 rounded-2xl border border-slate-800">{selectedProduct.img || '📦'}</span>
                    <div>
                      <span className="bg-[#FF5A00]/10 text-[#FF5A00] text-[10px] font-black uppercase px-2 py-0.5 rounded border border-[#FF5A00]/20">
                        {selectedProduct.category}
                      </span>
                      <h3 className="text-base font-black text-white mt-1">{selectedProduct.title}</h3>
                    </div>
                  </div>

                  <div className="bg-[#0B132B] rounded-xl p-4 border border-slate-800 space-y-2">
                    <div className="flex justify-between text-xs"><span className="text-slate-400">Condition Status:</span><span className="text-emerald-400 font-bold">Bold Certified Premium</span></div>
                    <div className="flex justify-between text-xs"><span className="text-slate-400">Platform Location:</span><span className="text-white font-medium">{selectedProduct.location}</span></div>
                    <div className="flex justify-between text-xs"><span className="text-slate-400">Hardware Metrics:</span><span className="text-slate-300 font-mono text-[11px]">{selectedProduct.meta}</span></div>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <div className="text-xs text-slate-400">Escrow Value Protection Listing Price:</div>
                    <div className="text-2xl font-black text-[#FF5A00]">₦{Number(selectedProduct.price).toLocaleString()}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => onAddToCart(selectedProduct)}
                      className="bg-slate-900 hover:bg-slate-800 text-white font-black text-xs py-3 rounded-xl border border-slate-800 cursor-pointer transition-all active:scale-95"
                    >
                      🛒 Add To Basket
                    </button>
                    <button
                      type="button"
                      onClick={() => onTriggerCheckout(selectedProduct)}
                      className="bg-[#FF5A00] hover:bg-[#e04f00] text-white font-black text-xs py-3 rounded-xl border-none cursor-pointer transition-all shadow-[0_4px_15px_rgba(255,90,0,0.3)] active:scale-95"
                    >
                      🛡️ Secure Buy
                    </button>
                  </div>
                </div>

                {/* LAYER 1: THE INLINE MARKETPLACE RECOMMENDER SLIDER */}
                {getRelatedItems(selectedProduct).length > 0 && (
                  <div className="bg-[#16223F] rounded-2xl p-5 border border-slate-800 shadow-xl space-y-3">
                    <h3 className="text-xs font-black text-slate-300 tracking-wider uppercase flex items-center gap-2">
                      🔄 Alternative Models & Pricing:
                    </h3>
                    
                    <div className="space-y-3">
                      {getRelatedItems(selectedProduct).map((rel) => (
                        <div 
                          key={rel.id || rel.docId}
                          onClick={() => setSelectedProduct(rel)} // Swap directly on selection click
                          className="bg-[#0B132B] p-3 rounded-xl border border-slate-800/80 hover:border-[#FF5A00]/50 transition-all cursor-pointer flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="text-xl flex-shrink-0">{rel.img || '📱'}</span>
                            <div className="min-w-0">
                              <h4 className="text-[11px] font-bold text-white truncate">{rel.title}</h4>
                              <p className="text-[10px] text-slate-400 truncate">{rel.meta}</p>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <span className="text-xs font-black text-[#FF5A00] block">₦{Number(rel.price).toLocaleString()}</span>
                            <span className="text-[9px] text-slate-400 bg-slate-900 px-1 py-0.5 rounded font-mono">View</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-[#16223F]/40 rounded-2xl p-8 border border-dashed border-slate-800 text-center">
                <span className="text-4xl block mb-2">🔍</span>
                <p className="text-xs font-medium text-slate-400">Click on any product card from the feed grid to load its active verification log and alternative stock variables.</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}