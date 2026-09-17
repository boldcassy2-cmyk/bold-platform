import React from 'react';

export default function StreetwearNode({ onNavigate, onAddToCart }) {
  const streetwearItems = [
    { id: 'sw-1', title: 'Lagos Heavyweight Oversized Tee', price: '25,000', img: '👕', location: 'Lagos Hub' },
    { id: 'sw-2', title: 'Midnight Blue Utility Cargo Pants', price: '45,000', img: '👖', location: 'Lagos Hub' },
    { id: 'sw-3', title: 'Bold.ng Signature Snapback Cap', price: '15,000', img: '🧢', location: 'Lagos Hub' }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 text-white space-y-8">
      <div className="flex justify-between items-center border-b border-slate-800 pb-4">
        <div>
          <span className="text-[10px] font-black tracking-widest text-[#FF5A00] uppercase">Sector Node</span>
          <h1 className="text-3xl font-black mt-1">Streetwear & Casual Fashion</h1>
        </div>
        <button onClick={() => onNavigate('marketplace')} className="text-xs bg-slate-800 px-4 py-2 rounded-xl text-slate-300 hover:text-white">
          ← Back to Marketplace
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {streetwearItems.map((item) => (
          <div key={item.id} className="bg-[#16223F] p-6 rounded-3xl border border-slate-800 space-y-4 shadow-xl">
            <div className="text-4xl bg-[#0B132B] p-4 rounded-2xl w-16 h-16 flex items-center justify-center">{item.img}</div>
            <h3 className="font-bold text-lg">{item.title}</h3>
            <p className="text-xs text-slate-400">Hub Location: {item.location}</p>
            <div className="flex justify-between items-center pt-2">
              <span className="font-mono font-black text-[#FF5A00] text-lg">₦{item.price}</span>
              <button 
                onClick={() => onAddToCart(item)}
                className="bg-[#FF5A00] hover:bg-[#e05000] px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}