import React, { useState, useEffect, useTransition } from 'react';
import { db, auth } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

export default function AddProduct({ setCurrentPage, onAddProduct }) {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('fashion');
  const [location, setLocation] = useState('Lagos');
  const [vendorName, setVendorName] = useState('');
  const [specification, setSpecification] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [user, setUser] = useState(auth.currentUser);
  const [isPending, startTransition] = useTransition();

  // Listen for Firebase auth state to ensure user is fully loaded
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

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

  // Bulletproof Cloudinary Direct Upload Handler with 12s Timeout Protection
  const uploadToCloudinary = async (file) => {
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'Bold_ng_page';

    if (!cloudName || cloudName === "your_actual_cloud_name") {
      throw new Error("Missing or placeholder Cloud Name! Update VITE_CLOUDINARY_CLOUD_NAME in your .env file and restart Vite.");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    try {
      setUploadStatus('Connecting to Cloudinary CDN...');
      const response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      setUploadStatus('Processing secure asset...');

      const data = await response.json();
      if (data.secure_url) {
        return data.secure_url;
      } else {
        throw new Error(data.error?.message || "Cloudinary rejected the upload.");
      }
    } catch (netError) {
      clearTimeout(timeoutId);
      if (netError.name === 'AbortError') {
        throw new Error("Upload timed out after 12s. Check your adblocker or firewall settings.");
      }
      throw new Error(`Image upload failed: ${netError.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const activeUser = user || auth.currentUser;
    if (!activeUser) {
      alert("Security Error: Authentication session not detected. Please refresh or log in again.");
      return;
    }

    const parsedPrice = parseFloat(price);
    if (!title || isNaN(parsedPrice) || parsedPrice <= 0 || !vendorName) {
      alert("Please fill out all primary business fields with valid values.");
      return;
    }

    setIsSubmitting(true);

    // Create optimistic mock ID and payload for immediate render
    const tempId = 'item-' + Date.now();
    const fallbackImage = imageUrl.trim() || getCategoryEmoji(category);

    const productPayload = {
      title: title.trim(),
      price: parsedPrice,
      category,
      location,
      vendorName: vendorName.trim(),
      merchantId: activeUser.uid,
      meta: `Vendor: ${vendorName.trim()} • ${specification.trim() || 'Verified Genuine Escrow Stock'}`,
      img: fallbackImage,
      status: 'AVAILABLE',
      createdAt: serverTimestamp(),
    };

    const optimisticProduct = {
      id: tempId,
      ...productPayload,
      createdAt: new Date().toISOString(),
    };

    // 1. INSTANT UI UPDATE (Optimistic execution)
    startTransition(() => {
      if (typeof onAddProduct === 'function') {
        onAddProduct(optimisticProduct);
      }
      if (typeof setCurrentPage === 'function') {
        setCurrentPage('marketplace');
      }
    });

    // 2. Execute Cloudinary upload & Firestore write in background without freezing UI
    (async () => {
      try {
        let finalImageUrl = fallbackImage;

        if (imageFile) {
          setUploadStatus('Uploading image to Cloudinary...');
          finalImageUrl = await uploadToCloudinary(imageFile);
        }

        setUploadStatus('Syncing with Firestore...');
        
        // Update payload with real cloudinary image if uploaded
        const finalPayload = {
          ...productPayload,
          img: finalImageUrl
        };

        await addDoc(collection(db, 'inventory'), finalPayload);
        console.log("⚡ [Background Sync] Product successfully written to database.");
      } catch (error) {
        console.error("Background Sync Error:", error);
      } finally {
        setIsSubmitting(false);
        setUploadStatus('');
      }
    })();
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

        {/* IMAGE UPLOAD SECTION */}
        <div className="space-y-2">
          <label className="block text-[10px] font-black text-slate-400 uppercase">Product Image File (Cloudinary)</label>
          <input 
            type="file" 
            accept="image/*" 
            onChange={(e) => setImageFile(e.target.files[0])} 
            className="w-full text-xs text-slate-300 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-black file:bg-[#FF5A00] file:text-white hover:file:brightness-110 cursor-pointer bg-[#0B132B] border border-slate-700 rounded-xl"
          />
          <input 
            type="url" 
            value={imageUrl} 
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="Or paste direct image URL here..." 
            className="w-full px-4 py-2.5 rounded-xl border border-slate-700 text-xs font-semibold bg-[#0B132B] text-white focus:outline-none focus:border-[#FF5A00]"
          />
          {imageFile && (
            <p className="text-[10px] text-emerald-400 font-bold">Selected file: {imageFile.name}</p>
          )}
        </div>

        <div className="pt-2">
          <button 
            type="submit"
            disabled={isSubmitting && isPending}
            className="w-full text-white font-black text-xs uppercase tracking-wider py-4 rounded-xl border-none transition cursor-pointer shadow-lg bg-[#FF5A00] hover:brightness-110"
          >
            {isSubmitting ? `⚡ ${uploadStatus || 'Publishing Asset...'}` : '🚀 Publish Secure Escrow Asset'}
          </button>
        </div>

      </form>
    </main>
  );
}