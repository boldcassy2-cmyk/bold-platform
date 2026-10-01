import React, { useState } from 'react';

export default function SoloSellerDashboard({ currentUser, products = [], setCurrentPage, onLogout }) {
  const [activeTab, setActiveTab] = useState('listings');
  const userListings = products.filter(p => p.vendorEmail === currentUser?.email || p.ownerUid === currentUser?.uid);

  return (
    <div className="min-h-screen bg-[#f2f4f5] text-[#2d2d2d] font-sans pb-12 selection:bg-[#20b2aa]">
      
      {/* Jiji Style Green Header */}
      <header className="bg-[#20b2aa] text-white shadow-md sticky top-0 z-50">
        <div className="px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div onClick={() => setCurrentPage('marketplace')} className="cursor-pointer flex items-baseline tracking-tighter">
              <span className="text-xl font-black text-white">bold</span>
              <span className="text-xl font-black text-[#111]">.ng</span>
            </div>
            <span className="bg-black/20 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded tracking-widest">
              Solo Classified
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage('add-product')}
              className="bg-[#ff4500] hover:bg-[#e03d00] text-white font-black px-3.5 py-1.5 rounded-full text-xs transition-colors shadow"
            >
              + Sell Free
            </button>
            <button
              onClick={onLogout}
              className="bg-teal-800 hover:bg-teal-900 text-white text-xs font-bold px-2.5 py-1.5 rounded"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Jiji Style Greeting & Rating Bar */}
        <div className="bg-[#1b9a93] px-4 py-2 text-xs flex justify-between items-center text-teal-100">
          <span>Welcome back, <strong className="text-white">{currentUser?.displayName || currentUser?.email?.split('@')[0]}</strong></span>
          <span className="bg-white/20 px-2 py-0.5 rounded">Free Tier Seller</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto px-3 sm:px-4 py-6 space-y-6">
        
        {/* Jiji Promoted Ad Banner */}
        <div className="bg-gradient-to-r from-[#ff4500] to-[#ff6a33] text-white p-5 rounded-2xl shadow-md flex items-center justify-between">
          <div className="space-y-1">
            <span className="bg-white text-[#ff4500] text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded">
              🔥 Promote Ad
            </span>
            <h4 className="text-base font-black">Sell 10x faster with Top Ad & VIP Boost</h4>
            <p className="text-xs text-teal-50">Get your items pinned to the top of category searches.</p>
          </div>
          <button className="bg-white text-[#ff4500] text-xs font-black px-4 py-2.5 rounded-xl shadow whitespace-nowrap">
            Boost Now
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-300 gap-6 text-sm font-bold bg-white px-4 pt-3 rounded-t-xl">
          <button 
            onClick={() => setActiveTab('listings')}
            className={`pb-3 border-b-2 transition-colors cursor-pointer ${activeTab === 'listings' ? 'border-[#20b2aa] text-[#20b2aa]' : 'border-transparent text-slate-500'}`}
          >
            My Adverts ({userListings.length})
          </button>
          <button 
            onClick={() => setActiveTab('chats')}
            className={`pb-3 border-b-2 transition-colors cursor-pointer ${activeTab === 'chats' ? 'border-[#20b2aa] text-[#20b2aa]' : 'border-transparent text-slate-500'}`}
          >
            Buyer Chats (0)
          </button>
        </div>

        {/* Listings Feed */}
        {activeTab === 'listings' && (
          <div className="space-y-3">
            {userListings.length === 0 ? (
              <div className="bg-white rounded-b-xl rounded-r-xl p-10 text-center space-y-3 border border-slate-200">
                <span className="text-4xl">📢</span>
                <h4 className="font-bold text-slate-800 text-base">You have no active adverts</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">Post your used items, gadgets, or personal services for free in seconds.</p>
                <button 
                  onClick={() => setCurrentPage('add-product')}
                  className="bg-[#20b2aa] text-white font-black text-xs px-5 py-2.5 rounded-full shadow"
                >
                  Post Free Advert
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {userListings.map(item => (
                  <div key={item.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                      <img src={item.img || item.media?.imageUrl} alt={item.title} className="w-16 h-16 object-cover rounded-lg bg-slate-100 shrink-0" />
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-bold bg-teal-50 text-[#20b2aa] px-2 py-0.5 rounded">{item.category}</span>
                        <h5 className="font-bold text-xs text-[#2d2d2d]">{item.title}</h5>
                        <p className="text-xs font-black text-[#ff4500]">₦{Number(item.price).toLocaleString()}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">Active</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'chats' && (
          <div className="bg-white p-8 rounded-b-xl rounded-r-xl border border-slate-200 text-center space-y-2">
            <span className="text-3xl">💬</span>
            <h4 className="font-bold text-sm text-slate-800">No messages yet</h4>
            <p className="text-xs text-slate-500">When buyers message you regarding your classified listings, they will appear here.</p>
          </div>
        )}

        {/* Trending & Promotion Partners Section (Jiji classified style) */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 space-y-3">
          <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Trending Promotion Partners</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs font-bold text-slate-700">
              🚀 Bold Academy Boost
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs font-bold text-slate-700">
              💳 Escrow Trust Pay
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs font-bold text-slate-700">
              📍 Nationwide Logistics
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs font-bold text-slate-700">
              🛡️ Verified Seller Badge
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}