import React, { useState } from 'react';

export default function DirectVendorListing({ onAddListing, onNavigate }) {
  const [formData, setFormData] = useState({
    title: '',
    category: 'electronics',
    price: '',
    location: 'Lagos',
    phone: '',
    whatsapp: '',
    email: '',
    description: '',
    img: '📱'
  });

  // Media attachment state for images, videos, or PDFs
  const [productMediaUrl, setProductMediaUrl] = useState('');
  const [mediaUploadType, setMediaUploadType] = useState('image'); // 'image' | 'video' | 'pdf'
  const [uploadedFileName, setUploadedFileName] = useState('');

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle local file upload selection and preview conversion
  const handleLocalFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadedFileName(file.name);
    const fileReader = new FileReader();

    fileReader.onload = (uploadEvent) => {
      setProductMediaUrl(uploadEvent.target.result);
    };

    if (file.type.includes('image')) {
      setMediaUploadType('image');
      fileReader.readAsDataURL(file);
    } else if (file.type.includes('video')) {
      setMediaUploadType('video');
      fileReader.readAsDataURL(file);
    } else {
      setMediaUploadType('pdf');
      setProductMediaUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newListing = {
      ...formData,
      id: `direct-${Date.now()}`,
      docId: `direct-${Date.now()}`,
      dateAdded: new Date().toISOString(),
      isDirectContact: true, // Flag for direct Jiji-style listings
      promotionSettings: { adPlacement: 'trending' },
      mediaUrl: productMediaUrl,
      mediaType: mediaUploadType,
      mediaFileName: uploadedFileName
    };

    if (onAddListing) {
      onAddListing(newListing);
    }
    setSubmitted(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 text-white">
      <div className="bg-[#16223F] border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl">
        <div className="flex justify-between items-center mb-6 border-b border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl font-black">Post Direct Vendor Listing</h1>
            <p className="text-slate-400 text-xs sm:text-sm">
              List items for direct buyer contact via WhatsApp, phone call, or email (Jiji Model).
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('marketplace')}
            className="text-xs bg-slate-900 border border-slate-700 px-3 py-2 rounded-xl text-slate-300 hover:bg-slate-800 cursor-pointer"
          >
            ← Marketplace
          </button>
        </div>

        {submitted ? (
          <div className="bg-emerald-950/40 border border-emerald-900 rounded-2xl p-8 text-center space-y-4">
            <div className="w-12 h-12 bg-emerald-500 text-slate-950 rounded-full flex items-center justify-center mx-auto font-black text-xl">
              ✓
            </div>
            <h2 className="text-xl font-bold text-emerald-400">Listing Published Successfully!</h2>
            <p className="text-sm text-slate-300">
              Your direct contact info and attached media are now live. Buyers can reach you instantly.
            </p>
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                onNavigate('marketplace');
              }}
              className="px-6 py-2.5 bg-[#FF5A00] text-white font-black text-xs rounded-xl shadow-lg cursor-pointer"
            >
              View in Marketplace
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Item Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g., iPhone 13 Pro Max (UK Used)"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:border-[#FF5A00] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:border-[#FF5A00] focus:outline-none cursor-pointer"
                >
                  <option value="electronics">Electronics & Phones</option>
                  <option value="fashion">Fashion & Streetwear</option>
                  <option value="automotive">Automotive & Vehicles</option>
                  <option value="realestate">Real Estate</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Price (₦)</label>
                <input
                  type="number"
                  name="price"
                  required
                  placeholder="150000"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:border-[#FF5A00] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Location / Hub</label>
                <input
                  type="text"
                  name="location"
                  required
                  placeholder="Lagos, Ikeja"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:border-[#FF5A00] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Emoji / Icon</label>
                <input
                  type="text"
                  name="img"
                  value={formData.img}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:border-[#FF5A00] focus:outline-none"
                />
              </div>
            </div>

            {/* Product Media Upload & Link Section */}
            <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-300">Product Media & Specs Proof</h3>
                  <p className="text-[11px] text-slate-400">Attach an image, video, or document specification link.</p>
                </div>
                <select
                  value={mediaUploadType}
                  onChange={(e) => setMediaUploadType(e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-xs text-white rounded-xl px-3 py-1.5 outline-none cursor-pointer"
                >
                  <option value="image">📷 Image</option>
                  <option value="video">🎥 Video</option>
                  <option value="pdf">📄 PDF Document</option>
                </select>
              </div>

              {/* File Picker */}
              <div className="flex items-center gap-3">
                <label className="flex-1 flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 border border-dashed border-slate-600 hover:border-[#FF5A00] rounded-xl px-4 py-2.5 text-xs text-slate-300 cursor-pointer transition">
                  <span>📁 {uploadedFileName ? `Selected: ${uploadedFileName}` : `Upload ${mediaUploadType} from device...`}</span>
                  <input 
                    type="file" 
                    accept={mediaUploadType === 'image' ? 'image/*' : mediaUploadType === 'video' ? 'video/*' : '.pdf,.doc,.docx'} 
                    onChange={handleLocalFileChange} 
                    className="hidden" 
                  />
                </label>
                {uploadedFileName && (
                  <button
                    type="button"
                    onClick={() => { setUploadedFileName(''); setProductMediaUrl(''); }}
                    className="bg-red-950/50 hover:bg-red-900 border border-red-800 text-red-300 text-xs px-3 py-2.5 rounded-xl cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* URL Input Alternative */}
              <input
                type="url"
                value={uploadedFileName ? '' : productMediaUrl}
                disabled={!!uploadedFileName}
                onChange={(e) => setProductMediaUrl(e.target.value)}
                placeholder={`Or paste external ${mediaUploadType} URL here...`}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white focus:border-[#FF5A00] focus:outline-none disabled:opacity-50"
              />

              {productMediaUrl && (
                <div className="flex items-center gap-3 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                  {mediaUploadType === 'image' ? (
                    <img src={productMediaUrl} alt="Preview" className="w-10 h-10 object-cover rounded-lg border border-slate-700" onError={(e)=>{e.target.style.display='none';}} />
                  ) : (
                    <div className="w-10 h-10 bg-slate-900 flex items-center justify-center rounded-lg border border-slate-700 text-base">📁</div>
                  )}
                  <div className="text-xs text-slate-300 truncate">
                    <span className="font-bold text-emerald-400">Attached:</span> {uploadedFileName || productMediaUrl}
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-slate-800 pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  placeholder="08030000000"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:border-[#FF5A00] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">WhatsApp Number</label>
                <input
                  type="tel"
                  name="whatsapp"
                  required
                  placeholder="2348030000000"
                  value={formData.whatsapp}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:border-[#FF5A00] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="vendor@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:border-[#FF5A00] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-slate-400 mb-1">Item Description / Meeting Instructions</label>
              <textarea
                name="description"
                rows="3"
                placeholder="Mention condition, meetup spots, or negotiate terms..."
                value={formData.description}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:border-[#FF5A00] focus:outline-none"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#FF5A00] hover:bg-[#e05000] text-white font-black text-sm rounded-xl shadow-lg cursor-pointer transition-colors"
            >
              🚀 Publish Direct Listing
            </button>
          </form>
        )}
      </div>
    </div>
  );
}