import React, { useState } from 'react';

export default function Store({ merchantStore }) {
  // Store default listings array
  const [products, setProducts] = useState([
    { id: 1, name: "Vintage Oversized Washed Tee", price: "₦18,500", stock: 12, plan: "Self-Managed", promoted: false, image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=400&auto=format&fit=crop&q=60" },
    { id: 2, name: "Heavyweight Boxy Hoodie (Midnight Blue)", price: "₦32,000", stock: 8, plan: "Promoted", promoted: true, image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=400&auto=format&fit=crop&q=60" },
  ]);

  // Inventory Input Fields
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [selectedPlan, setSelectedPlan] = useState('Self-Managed');

  // Trigger Promotion Action on an existing product
  const triggerPromotion = (productId) => {
    setProducts(products.map(p => {
      if (p.id === productId) {
        alert(`🚀 Promotion Request Sent!\n"${p.name}" is being reviewed for the Bold Premium Search Grid banner.`);
        return { ...p, plan: "Promoted", promoted: true };
      }
      return p;
    }));
  };

  // Convert an asset to Bold Fulfillment
  const transferToFulfillment = (productId) => {
    setProducts(products.map(p => {
      if (p.id === productId) {
        alert(`📦 Fulfillment Handover Initialized!\nGenerate waybill to ship units of "${p.name}" to the closest Bold Hub for storage and delivery management.`);
        return { ...p, plan: "Bold-Managed" };
      }
      return p;
    }));
  };

  // Process standard form creation
  const handleAddProduct = (e) => {
    e.preventDefault();
    if (!name || !price || !stock) return;

    const newProduct = {
      id: Date.now(),
      name,
      price: `₦${Number(price).toLocaleString()}`,
      stock: parseInt(stock),
      plan: selectedPlan,
      promoted: selectedPlan === 'Promoted',
      image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&auto=format&fit=crop&q=60"
    };

    setProducts([newProduct, ...products]);
    setName('');
    setPrice('');
    setStock('');
    alert(`📦 Success: Item added under the [${selectedPlan}] track.`);
  };

  return (
    <main className="max-w-6xl mx-auto my-10 px-4 space-y-8">
      
      {/* VENDOR PROFILE HUD */}
      <div className="bg-[#0B132B] text-white rounded-3xl p-8 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b-4 border-[#FF5A00]">
        <div>
          <span className="text-[10px] bg-[#FF5A00] px-2.5 py-1 rounded font-black tracking-widest uppercase">
            {merchantStore.location ? "Independent Hub" : "Self-Managed Retailer"}
          </span>
          <h1 className="text-3xl font-black tracking-tight mt-1 text-white">
            {merchantStore.name || "Cassydon Garms Hub"}
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            📍 Operating Location: <span className="text-white font-semibold">{merchantStore.location || "Lagos, NG"}</span> | Standard Self-Fulfillment
          </p>
        </div>
        <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700 font-mono text-xs text-slate-300">
          <p>🏢 Management Mode: <span className="text-[#FF5A00] font-bold">Independent (Jiji-Style)</span></p>
          <p className="mt-1">🔒 Registered WhatsApp: {merchantStore.whatsapp || "No Link"}</p>
        </div>
      </div>

      {/* THREE INTERACTIVE SERVICE SEGMENTS EXPLAINER */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm">
          <div className="text-lg mb-1">🏠</div>
          <h4 className="text-sm font-black text-[#0B132B] uppercase tracking-wide">1. Self-Managed</h4>
          <p className="text-slate-500 text-xs mt-1 font-medium">Free by default. Run operations from your house or boutique shop. Pack and arrange your dispatch lines independently.</p>
        </div>
        <div className="bg-orange-50/50 border border-orange-200 p-5 rounded-2xl shadow-sm">
          <div className="text-lg mb-1">🚀</div>
          <h4 className="text-sm font-black text-[#FF5A00] uppercase tracking-wide">2. Premium Boost</h4>
          <p className="text-slate-600 text-xs mt-1 font-medium">Want fast sales? Purchase premium ad banners and search priority. Bump listings directly to front-page feeds.</p>
        </div>
        <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-sm">
          <div className="text-lg mb-1">📦</div>
          <h4 className="text-sm font-black text-[#FF5A00] uppercase tracking-wide">3. Bold-Managed</h4>
          <p className="text-slate-400 text-xs mt-1">Let us hold stock for you. Drop items at our dedicated hub; we verify physical quality, box, and handle consumer escrow.</p>
        </div>
      </div>

      {/* STRATEGIC CONTROL SPLIT SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LISTING INTAKE BOARD */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-200 h-fit">
          <h3 className="text-sm font-black uppercase tracking-wider text-[#0B132B] mb-4 border-b border-slate-100 pb-2">
            🛒 Create New Listing
          </h3>
          
          <form onSubmit={handleAddProduct} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Apparel Name / Service Title</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g., Slim-Fit Tech Cargoes" className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-semibold focus:outline-none focus:border-[#FF5A00]" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Price (₦ Value)</label>
                <input type="number" required value={price} onChange={(e) => setPrice(e.target.value)} placeholder="22000" className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-mono font-bold focus:outline-none focus:border-[#FF5A00]" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Available Units</label>
                <input type="number" required value={stock} onChange={(e) => setStock(e.target.value)} placeholder="5" className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-mono font-bold focus:outline-none focus:border-[#FF5A00]" />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase mb-1">Ecosystem Operational Track</label>
              <select value={selectedPlan} onChange={(e) => setSelectedPlan(e.target.value)} className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm bg-slate-50 font-bold focus:outline-none focus:border-[#FF5A00]">
                <option value="Self-Managed">Self-Managed (Ship from my Location)</option>
                <option value="Promoted">Premium Promotion (Fast-Track Ad Feed)</option>
                <option value="Bold-Managed">Bold Fulfillment (Incur Warehouse Storage)</option>
              </select>
            </div>

            <button type="submit" className="w-full bg-[#0B132B] text-white py-3 rounded-xl font-black text-xs uppercase tracking-wider hover:bg-slate-800 border-none cursor-pointer transition">
              Publish Operational Listing
            </button>
          </form>
        </div>

        {/* ACTIVE LIVE GRID SHOWROOM DISPLAY */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-black uppercase tracking-wider text-[#0B132B]">
            Your Inventory Fleet ({products.length} Items Listed)
          </h3>

          <div className="space-y-3">
            {products.map((item) => (
              <div key={item.id} className={`bg-white border rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition shadow-sm ${item.promoted ? 'border-l-4 border-l-[#FF5A00] bg-orange-50/20' : 'border-slate-200'}`}>
                
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                    <img src={item.image} alt="Showcase layout" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-[#0B132B]">{item.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-mono font-black text-[#FF5A00]">{item.price}</span>
                      <span className="text-slate-300 text-xs">•</span>
                      <span className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded font-bold text-slate-500">Stock: {item.stock}</span>
                      <span className="text-slate-300 text-xs">•</span>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                        item.plan === 'Promoted' ? 'bg-orange-100 text-[#FF5A00]' : 
                        item.plan === 'Bold-Managed' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>{item.plan}</span>
                    </div>
                  </div>
                </div>

                {/* MANAGEMENT CONSOLE ACTION HUB TRIGGERS */}
                <div className="flex gap-2 w-full sm:w-auto border-t sm:border-t-0 pt-3 sm:pt-0">
                  {!item.promoted && (
                    <button onClick={() => triggerPromotion(item.id)} className="flex-1 sm:flex-none text-[11px] font-black uppercase tracking-wider border border-[#FF5A00] text-[#FF5A00] px-3 py-2 rounded-xl bg-transparent hover:bg-[#FF5A00] hover:text-white transition cursor-pointer">
                      🚀 Boost Ad
                    </button>
                  )}
                  {item.plan !== 'Bold-Managed' && (
                    <button onClick={() => transferToFulfillment(item.id)} className="flex-1 sm:flex-none text-[11px] font-black uppercase tracking-wider bg-slate-100 text-slate-800 hover:bg-slate-900 hover:text-white px-3 py-2 rounded-xl border-none cursor-pointer transition">
                      📦 Handover to Bold
                    </button>
                  )}
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>

    </main>
  );
}