import React from 'react';

export default function Explore({ products }) {
  return (
    <main className="max-w-7xl mx-auto py-12 px-6">
      <header className="border-b border-slate-800 pb-6 mb-10">
        <h1 className="text-4xl font-black text-white">Verified Product Feed</h1>
        <p className="text-slate-400 mt-2 text-lg">Every item listed below has undergone physical inspection before catalog placement.</p>
      </header>

      {/* Premium Promoted Channel Core Component */}
      <section className="mb-14">
        <div className="bg-[#1E293B] border border-[#FF5A00] rounded-2xl p-6 flex justify-between items-center shadow-2xl shadow-orange-600/5">
          <div>
            <span className="bg-[#FF5A00] text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-wider">
              🔥 Premium Channel
            </span>
            <h2 className="text-xl font-bold mt-2 text-white">Top Promoted Drops This Week</h2>
            <p className="text-sm text-slate-400 mt-1">Verified elite sellers pushing high-demand inventory right now.</p>
          </div>
          <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">Sponsored Allocation</span>
        </div>
      </section>

      {/* Dynamic Grid Mapping Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((item) => (
          <div key={item.id} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-2xl flex flex-col justify-between">
            
            {/* 🛡️ Secure System Graphic Holder (No file input required) */}
            <div className="h-44 bg-[#0B132B] p-6 flex flex-col justify-between items-start border-b border-slate-800 relative overflow-hidden">
              <div className="absolute right-[-20px] bottom-[-25px] text-slate-800/20 font-black text-7xl select-none uppercase tracking-tighter">
                Bold
              </div>
              <span className="bg-[#FF5A00] text-white text-[9px] font-black px-2 py-1 rounded-md uppercase tracking-widest">
                {item.niche || "Verified Asset"}
              </span>
              <div className="text-slate-400 text-xs font-bold tracking-wide">
                Secure Escrow Code: <span className="text-white/60 font-mono">B-NG-{item.id.toString().slice(-4)}</span>
              </div>
            </div>

            {/* Product Body Content */}
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <span className={`inline-block text-xs font-extrabold px-2.5 py-1 rounded-md mb-3 border ${item.stock === 0 ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                  {item.stock === 0 ? '✕ Out of Stock' : '✓ Certified Authentic'}
                </span>
                <h3 className="text-[#0B132B] text-xl font-black leading-tight tracking-tight">{item.name}</h3>
                <p className="text-slate-500 text-xs mt-1.5 font-medium uppercase tracking-wider">Distributed via Lagos Escrow Hub</p>
              </div>
              
              <div className="flex justify-between items-center border-t border-slate-100 pt-4 mt-6">
                <span className="text-[#0B132B] text-2xl font-black">₦{item.price}</span>
                <button 
                  disabled={item.stock === 0}
                  className={`border-none px-5 py-2.5 rounded-lg font-bold cursor-pointer transition duration-200 outline-none text-white ${item.stock === 0 ? 'bg-slate-300 cursor-not-allowed' : 'bg-[#FF5A00] hover:brightness-110 shadow-md'}`}
                >
                  {item.stock === 0 ? 'Sold Out' : 'Buy Now'}
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>
    </main>
  );
}