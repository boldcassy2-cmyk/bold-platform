import React, { useState } from 'react';
import { db, auth } from '../firebase'; // Ensure auth is exported from firebase.js
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function AddProduct({ setCurrentPage, onAddProduct }) {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('fashion');
  const [location, setLocation] = useState('Lagos');
  const [vendorName, setVendorName] = useState('');
  const [specification, setSpecification] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const currentUser = auth.currentUser;

    // 1. Check if user is logged in
    if (!currentUser) {
      alert("Security Error: You must be logged in to publish inventory assets.");
      return;
    }

    const parsedPrice = parseFloat(price);
    if (!title || isNaN(parsedPrice) || parsedPrice <= 0 || !vendorName) {
      alert("Please fill out all primary business fields with valid values.");
      return;
    }

    setIsSubmitting(true);

    // Payload structured specifically for Firestore write
    const productPayload = {
      title: title.trim(),
      price: parsedPrice,
      category,
      location,
      vendorName: vendorName.trim(),
      merchantId: currentUser.uid,
      meta: `Vendor: ${vendorName.trim()} • ${specification.trim() || 'Verified Genuine Escrow Stock'}`,
      img: imageUrl.trim() || getCategoryEmoji(category),
      status: 'AVAILABLE',
      createdAt: serverTimestamp(),
    };

    try {
      // 2. Add document to Firestore inventory collection
      const docRef = await addDoc(collection(db, 'inventory'), productPayload);

      // Client-side payload formatted cleanly (avoid passing raw serverTimestamp to local state)
      const publishedProduct = {
        id: docRef.id,
        ...productPayload,
        createdAt: new Date().toISOString(),
      };

      if (typeof onAddProduct === 'function') {
        onAddProduct(publishedProduct);
      }

      // Navigate back to marketplace smoothly
      if (typeof setCurrentPage === 'function') {
        setCurrentPage('marketplace');
      }
    } catch (error) {
      console.error("Firestore Upload Error:", error);
      alert(`Upload blocked: ${error.message || 'Unknown network error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto my-6 px-4 space-y-6 animate-fadeIn text-white text-left selection:bg-[#FF5A00]">
      
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
          onClick={() => setCurrentPage && setCurrentPage('marketplace')}
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
            type="text" 
            value={vendorName} 
            onChange={(e) => setVendorName(e.target.value)}
            placeholder="e.g., Cassydon Streetwear Hub" 
            className="w-full px-4 py-2.5 rounded-xl border border-slate-700 text-xs font-semibold bg-[#0B132B] text-white focus:outline-none focus:border-[#FF5A00]"
            required
          />
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Product Title</label>
          <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Vintage Acid Wash Cargo Pants" 
            className="w-full px-4 py-2.5 rounded-xl border border-slate-700 text-xs font-semibold bg-[#0B132B] text-white focus:outline-none focus:border-[#FF5A00]"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Base Price Evaluation (₦)</label>
            <input 
              type="number" 
              value={price} 
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g., 35000" 
              className="w-full px-4 py-2.5 rounded-xl border border-slate-700 text-xs font-semibold bg-[#0B132B] text-white focus:outline-none focus:border-[#FF5A00]"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Fulfillment Node Location</label>
            <select 
              value={location} 
              onChange={(e) => setLocation(e.target.value)}
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
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
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
              type="text" 
              value={specification} 
              onChange={(e) => setSpecification(e.target.value)}
              placeholder="e.g., 100% heavy fleece, brand new box condition" 
              className="w-full px-4 py-2.5 rounded-xl border border-slate-700 text-xs font-semibold bg-[#0B132B] text-white focus:outline-none focus:border-[#FF5A00]"
            />
          </div>
        </div>

        <div>
          <label className="block text-[10px] font-black text-slate-400 uppercase mb-1">Image URL (Optional)</label>
          <input 
            type="url" 
            value={imageUrl} 
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://... (Leave empty to default to category icon)" 
            className="w-full px-4 py-2.5 rounded-xl border border-slate-700 text-xs font-semibold bg-[#0B132B] text-white focus:outline-none focus:border-[#FF5A00]"
          />
        </div>

        <div className="pt-2">
          <button 
            type="submit"
            disabled={isSubmitting}
            className={`w-full text-white font-black text-xs uppercase tracking-wider py-4 rounded-xl border-none transition cursor-pointer shadow-lg ${
              isSubmitting 
                ? 'bg-slate-700 cursor-not-allowed animate-pulse' 
                : 'bg-[#FF5A00] hover:brightness-110'
            }`}
          >
            {isSubmitting ? '⚡ Publishing Asset...' : '🚀 Publish Secure Escrow Asset'}
          </button>
        </div>

      </form>
    </main>
  );
}