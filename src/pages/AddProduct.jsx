import React, { useState } from 'react';

export default function AddProduct({ setCurrentPage, onAddProduct }) {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('fashion');
  const [location, setLocation] = useState('Lagos');
  const [vendorName, setVendorName] = useState('');
  const [specification, setSpecification] = useState('');

  // Auto-assign emoji avatars based on selected category matrix
  const getCategoryEmoji = (cat) => {
    switch (cat) {
      case 'fashion': return '👕';
      case 'electronics': return '💻';
      case 'automotive': return '🚗';
      case 'realestate': return '🏢';
      case 'travel': return '✈️';
      default: return '📦';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title || !price || !vendorName) {
      alert("Please fill out all primary business vectors.");
      return;
    }

    const newProduct = {
      id: `PROD-${Math.floor(100000 + Math.random() * 900000)}`,
      title: title.trim(),
      price: parseFloat(price),
      category,
      location,
      meta: `Vendor: ${vendorName.trim()} • ${specification.trim() || 'Verified Genuine Escrow Stock'}`,
      img: getCategoryEmoji(category)
    };

    // Push product to parent state pool
    if (onAddProduct) {
      onAddProduct(newProduct);
    }

    // Bounce vendor straight back to live feed to review listing
    setCurrentPage('marketplace');
  };

  return (
    <main className="max-w-2xl mx-auto my-6 px-4 space-y-6 animate-fadeIn text-white">
      
      {/* HEADER MATRIX CONTROLLER */}
      <div className="bg-[#16223F] border border-slate-800 rounded-3xl p-6 shadow-xl flex justify-between items-center">
        <div>
          <span className="text-[9px] bg-[#FF5A00] text-white font-black tracking-widest uppercase px-2 py-0.5 rounded">
            💼 MERCANTILE ONBOARDING PIPELINE
          </span>
          <h1 className="text-2xl font-black text-white mt-1">Onboard New Product Vector</h1>
        </div>
        <button 
          type="button"
          onClick={() => setCurrentPage('marketplace')}
          className="text-xs font-bold text-slate-300 hover:text-white bg-[#0B132B] border border-slate-800 px-4 py-2 rounded-xl transition cursor-pointer"
        >
          Cancel
        </button>
      </div>

      {/* CORE INPUT BOARD */}
      <form onSubmit={handleSubmit} className="bg-[#16223F] p-6 rounded-3xl shadow-xl border border-slate-800 space-y-5">
        
        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Merchant / Vendor Identity</label>
          <input 
            type="text" value={vendorName} onChange={(e) => setVendorName(e.target.value)}
            placeholder="e.g., Cassydon Streetwear Hub" 
            className="w-full px-4 py-2.5 rounded-xl border border-slate-700 text-xs font-semibold bg-[#0B132B] text-white focus:outline-none focus:border-[#FF5A00]"
          />
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Product Title</label>
          <input 
            type="text" value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Vintage Acid Wash Cargo Pants" 
            className="w-full px-4 py-2.5 rounded-xl border border-slate-700 text-xs font-semibold bg-[#0B132B] text-white focus:outline-none focus:border-[#FF5A00]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Base Price Evaluation (₦)</label>
            <input 
              type="number" value={price} onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g., 35000" 
              className="w-full px-4 py-2.5 rounded-xl border border-slate-700 text-xs font-semibold bg-[#0B132B] text-white focus:outline-none focus:border-[#FF5A00]"
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Fulfillment Node Location</label>
            <select 
              value={location} onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-700 text-xs font-semibold bg-[#0B132B] text-white focus:outline-none focus:border-[#FF5A00] cursor-pointer"
            >
              <option value="Lagos">Lagos State</option>
              <option value="Abuja">Abuja FCT</option>
              <option value="Lekki">Lekki Subzone</option>
              <option value="Port Harcourt">Port Harcourt</option>
              <option value="Remote">Remote Operations</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Segment Matrix Category</label>
            <select 
              value={category} onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-700 text-xs font-semibold bg-[#0B132B] text-white focus:outline-none focus:border-[#FF5A00] cursor-pointer"
            >
              <option value="fashion">👕 Apparel & Streetwear</option>
              <option value="electronics">💻 Tech Gadgets & Hardware</option>
              <option value="automotive">🚗 Cars & Mechanics</option>
              <option value="realestate">🏢 Real Estate Properties</option>
              <option value="travel">✈️ Air Tickets & Booking</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Brief Specifications / Meta</label>
            <input 
              type="text" value={specification} onChange={(e) => setSpecification(e.target.value)}
              placeholder="e.g., 100% heavy fleece, brand new box condition" 
              className="w-full px-4 py-2.5 rounded-xl border border-slate-700 text-xs font-semibold bg-[#0B132B] text-white focus:outline-none focus:border-[#FF5A00]"
            />
          </div>
        </div>

        <div className="pt-2">
          <button 
            type="submit"
            className="w-full bg-[#FF5A00] text-white font-black text-xs uppercase tracking-wider py-4 rounded-xl border-none hover:brightness-110 transition cursor-pointer shadow-lg"
          >
            🚀 Publish Secure Escrow Asset
          </button>
        </div>

      </form>

    </main>
  );
}