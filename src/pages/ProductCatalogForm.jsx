import React, { useState, useEffect, useCallback } from 'react';

// Marketplace Category Taxonomy Definition
const CATEGORY_DATA = {
  phones: {
    label: '📱 Phones & Gadgets',
    subcategories: ['Smartphones', 'Tablets', 'Feature Phones', 'Smartwatches', 'Phone Accessories & Cases']
  },
  electronics: {
    label: '💻 Electricals & Electronics',
    subcategories: ['Laptops & Computers', 'Home Appliances', 'TV & Audio Systems', 'Generators & Solar', 'Camera & Optics']
  },
  realestate: {
    label: '🏢 Real Estate & Property',
    subcategories: ['Apartments for Rent', 'Lands for Sale', 'Commercial Property', 'Shortlet Apartments', 'Warehouses']
  },
  automobiles: {
    label: '🚗 Automobiles & Vehicles',
    subcategories: ['Cars', 'Motorcycles & Tricycles', 'Buses & Trucks', 'Auto Spare Parts', 'Vehicle Rentals']
  },
  craftwork: {
    label: '🛠️ Craft Work & Artisans',
    subcategories: ['Electrical Services', 'Mechanical Repair', 'Plumbing & Fitting', 'Carpentry & Woodwork', 'Painting & Interior']
  },
  fashion: {
    label: '👕 Fashion & Wearables',
    subcategories: ["Men's Wear", "Women's Wear", 'Footwear & Shoes', 'Jewelry & Watches', 'Tailoring & Custom Designs']
  },
  ebooks: {
    label: '📚 eBooks & Digital Downloads',
    subcategories: ['Business & Finance', 'Tech & Software Guides', 'Self-Help & Personal Growth', 'Academic & Textbooks', 'Fiction & Literature']
  },
  tutorials: {
    label: '🎓 Online Tutorials & Courses',
    subcategories: ['Programming & Tech', 'Digital Marketing', 'Graphics & Video Editing', 'Language Lessons', 'Exam Prep & Coaching']
  },
  medications: {
    label: '💊 Health & Medications',
    subcategories: ['Over-the-Counter Drugs', 'Vitamins & Supplements', 'First Aid Supplies', 'Medical Devices', 'Personal Care']
  },
  ticketing: {
    label: '🎟️ Fare Ticketing & Travel',
    subcategories: ['Airline Tickets', 'Inter-state Bus Tickets', 'Event & Concert Passes', 'Train Tickets', 'Boat & Ferry Bookings']
  }
};

const MAX_IMAGE_SIZE_MB = 5;
const MAX_VIDEO_SIZE_MB = 50;
const MAX_PDF_SIZE_MB = 10;

// Cloudinary Configuration Credentials
const CLOUD_NAME = "rylkihnc";
const UPLOAD_PRESET = "Bold_ng_page";

// Safe Image Optimizer Pipeline
const compressImage = (file) => {
  return new Promise((resolve) => {
    if (!file || !file.type.startsWith('image/')) {
      return resolve(file);
    }

    const reader = new FileReader();
    const timeoutTimer = setTimeout(() => resolve(file), 3000);

    reader.onerror = () => {
      clearTimeout(timeoutTimer);
      resolve(file);
    };

    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => {
        clearTimeout(timeoutTimer);
        resolve(file);
      };

      img.src = event.target.result;
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const MAX_DIMENSION = 1200;

          let { width, height } = img;
          if (width > height && width > MAX_DIMENSION) {
            height = Math.round((height * MAX_DIMENSION) / width);
            width = MAX_DIMENSION;
          } else if (height > MAX_DIMENSION) {
            width = Math.round((width * MAX_DIMENSION) / height);
            height = MAX_DIMENSION;
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              clearTimeout(timeoutTimer);
              if (!blob) return resolve(file);
              resolve(new File([blob], file.name, { type: 'image/jpeg', lastModified: Date.now() }));
            },
            'image/jpeg',
            0.80
          );
        } catch (err) {
          clearTimeout(timeoutTimer);
          resolve(file);
        }
      };
    };

    reader.readAsDataURL(file);
  });
};

export default function ProductCatalogForm({ onAddProductComplete, setCurrentPage }) {
  const [formData, setFormData] = useState({
    title: '',
    price: '',
    stockQuantity: '1',
    category: 'phones',
    subcategory: CATEGORY_DATA.phones.subcategories[0],
    location: 'Lagos',
    meta: ''
  });

  const [media, setMedia] = useState({
    image: null,
    video: null,
    pdf: null
  });

  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    const defaultSub = CATEGORY_DATA[selectedCategory]?.subcategories[0] || '';
    setFormData((prev) => ({
      ...prev,
      category: selectedCategory,
      subcategory: defaultSub
    }));
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleImageSelect = (file) => {
    setErrorMessage('');
    if (!file) {
      setMedia((prev) => ({ ...prev, image: null }));
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
      setImagePreviewUrl(null);
      return;
    }

    if (file.size / (1024 * 1024) > MAX_IMAGE_SIZE_MB) {
      setErrorMessage(`Image file exceeds maximum size limit of ${MAX_IMAGE_SIZE_MB}MB.`);
      return;
    }

    setMedia((prev) => ({ ...prev, image: file }));

    if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    const objectUrl = URL.createObjectURL(file);
    setImagePreviewUrl(objectUrl);
  };

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl);
    };
  }, [imagePreviewUrl]);

  const handleFileChange = (key, file, maxMbAllowed) => {
    setErrorMessage('');
    if (!file) {
      setMedia((prev) => ({ ...prev, [key]: null }));
      return;
    }

    if (file.size / (1024 * 1024) > maxMbAllowed) {
      setErrorMessage(`File "${file.name}" exceeds maximum size limit of ${maxMbAllowed}MB.`);
      return;
    }

    setMedia((prev) => ({ ...prev, [key]: file }));
  };

  // Direct Cloudinary Upload Function
  const uploadToCloudinary = useCallback(async (file, resourceType = 'auto', label) => {
    if (!file) return '';

    setStatusText(`Uploading ${label} to Cloudinary...`);
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", UPLOAD_PRESET);
    data.append("folder", "bold_store");

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`,
        {
          method: "POST",
          body: data,
        }
      );

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error?.message || `Failed to upload ${label}`);
      }

      return result.secure_url;
    } catch (err) {
      console.error(`Cloudinary error on ${label}:`, err);
      throw new Error(`Upload failed for ${label}: ${err.message}`);
    }
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.title.trim() || !formData.price || Number(formData.price) <= 0) {
      setErrorMessage('Please enter a valid product title and price.');
      return;
    }

    if (!media.image) {
      setErrorMessage('Please select and confirm a primary product image before submitting.');
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(15);
      setStatusText('Optimizing image compression...');

      const compressedImage = await compressImage(media.image);
      
      setUploadProgress(35);
      const imageUrl = await uploadToCloudinary(compressedImage, 'image', 'Product Image');

      let videoUrl = '';
      if (media.video) {
        setUploadProgress(65);
        videoUrl = await uploadToCloudinary(media.video, 'video', 'Product Video');
      }

      let pdfUrl = '';
      if (media.pdf) {
        setUploadProgress(85);
        pdfUrl = await uploadToCloudinary(media.pdf, 'raw', 'Verification Document');
      }

      setStatusText('Saving catalog entry to database...');
      setUploadProgress(95);

      const payload = {
        id: Date.now(),
        title: formData.title.trim(),
        price: Number(formData.price),
        stockQuantity: Number(formData.stockQuantity),
        category: formData.category,
        subcategory: formData.subcategory,
        location: formData.location,
        meta: formData.meta.trim(),
        img: imageUrl,
        media: {
          imageUrl,
          videoUrl,
          pdfUrl
        },
        dateAdded: new Date().toISOString().split('T')[0]
      };

      if (typeof onAddProductComplete === 'function') {
        await onAddProductComplete(payload);
      }
      
      setUploadProgress(100);
      setStatusText('Upload Successful!');
      
      setTimeout(() => {
        if (typeof setCurrentPage === 'function') {
          setCurrentPage('marketplace');
        }
      }, 500);

    } catch (err) {
      console.error('Submission failed:', err);
      setErrorMessage(`Upload failed: ${err.message || 'Please check network and try again.'}`);
      setUploading(false);
      setUploadProgress(0);
      setStatusText('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-6 px-4 text-white text-left selection:bg-[#FF5A00]">
      <div className="bg-[#16223F] border border-slate-800 rounded-3xl p-6 md:p-10 shadow-2xl relative overflow-hidden">
        <div className="mb-8 border-b border-slate-800 pb-5 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-[#FF5A00] bg-[#FF5A00]/10 px-3 py-1 rounded-full border border-[#FF5A00]/20">
              Seller Portal (Cloudinary Powered)
            </span>
            <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white mt-2">
              Add New Product or Service Listing
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              List items across retail categories, ticket bookings, digital media, or artisan services.
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-950/40 border border-red-900/50 rounded-2xl flex items-center gap-3 text-xs text-red-400 font-bold">
            <span className="text-base">⚠️</span>
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleFormSubmit} className="space-y-8">
          {/* 1. Image Upload Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-black text-[#FF5A00] uppercase tracking-widest flex items-center gap-2">
              <span>🖼️</span> 1. Primary Product Image (Required)
            </h3>
            
            <div className="bg-[#0B132B] border border-slate-800 rounded-2xl p-4 md:p-6">
              {!imagePreviewUrl ? (
                <div className="border-2 border-dashed border-slate-700 hover:border-[#FF5A00] rounded-xl p-8 text-center transition-all cursor-pointer relative bg-slate-900/30">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageSelect(e.target.files?.[0] || null)}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                  <div className="space-y-2">
                    <span className="text-4xl block">📷</span>
                    <p className="text-sm font-bold text-slate-200">
                      Click to choose image or drag & drop here
                    </p>
                    <p className="text-xs text-slate-400">
                      Supports PNG, JPG, WEBP (Max {MAX_IMAGE_SIZE_MB}MB)
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row items-center gap-6 bg-slate-900/60 p-4 rounded-xl border border-slate-700">
                    <div className="relative group w-44 h-44 bg-slate-950 rounded-lg overflow-hidden border border-slate-800 flex items-center justify-center shrink-0 shadow-lg">
                      <img
                        src={imagePreviewUrl}
                        alt="Product Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="space-y-2 text-center sm:text-left flex-1">
                      <span className="text-[10px] font-black tracking-widest uppercase bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full border border-emerald-500/20 inline-block">
                        ✓ Image Selected & Verified
                      </span>
                      <h4 className="text-sm font-bold text-white truncate max-w-xs">
                        {media.image?.name}
                      </h4>
                      <p className="text-xs text-slate-400">
                        Size: {(media.image?.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                      <p className="text-xs text-slate-300 italic pt-1">
                        Confirm this is the exact product photo you wish buyers to see.
                      </p>
                      
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => handleImageSelect(null)}
                          className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer"
                        >
                          ✕ Remove / Change Image
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 2. Basic Info Section */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-[#FF5A00] uppercase tracking-widest flex items-center gap-2">
              <span>📝</span> 2. Basic Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5 md:col-span-2">
                <label htmlFor="title" className="text-xs font-black text-slate-300 uppercase tracking-wider">
                  Product / Service Title <span className="text-[#FF5A00]">*</span>
                </label>
                <input
                  id="title"
                  type="text"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., iPhone 15 Pro Max 256GB or Lagos-Abuja Flight Pass"
                  required
                  className="bg-[#0B132B] border border-slate-800 focus:border-[#FF5A00] outline-none rounded-xl px-4 py-3 text-sm text-white font-medium"
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <label htmlFor="category" className="text-xs font-black text-slate-300 uppercase tracking-wider">
                  Main Category <span className="text-[#FF5A00]">*</span>
                </label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={handleCategoryChange}
                  className="bg-[#0B132B] border border-slate-800 focus:border-[#FF5A00] outline-none rounded-xl px-4 py-3 text-sm text-white cursor-pointer font-medium"
                >
                  {Object.entries(CATEGORY_DATA).map(([key, data]) => (
                    <option key={key} value={key}>
                      {data.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col space-y-1.5">
                <label htmlFor="subcategory" className="text-xs font-black text-slate-300 uppercase tracking-wider">
                  Subcategory <span className="text-[#FF5A00]">*</span>
                </label>
                <select
                  id="subcategory"
                  value={formData.subcategory}
                  onChange={handleInputChange}
                  className="bg-[#0B132B] border border-slate-800 focus:border-[#FF5A00] outline-none rounded-xl px-4 py-3 text-sm text-white cursor-pointer font-medium"
                >
                  {CATEGORY_DATA[formData.category]?.subcategories.map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* 3. Pricing & Logistics */}
          <div className="space-y-4">
            <h3 className="text-xs font-black text-[#FF5A00] uppercase tracking-widest flex items-center gap-2">
              <span>💰</span> 3. Pricing & Logistics
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex flex-col space-y-1.5">
                <label htmlFor="price" className="text-xs font-black text-slate-300 uppercase tracking-wider">
                  Price Amount (₦) <span className="text-[#FF5A00]">*</span>
                </label>
                <input
                  id="price"
                  type="number"
                  min="1"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  required
                  className="bg-[#0B132B] border border-slate-800 focus:border-[#FF5A00] outline-none rounded-xl px-4 py-3 text-sm text-white font-medium"
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <label htmlFor="stockQuantity" className="text-xs font-black text-slate-300 uppercase tracking-wider">
                  Quantity Available
                </label>
                <input
                  id="stockQuantity"
                  type="number"
                  min="1"
                  value={formData.stockQuantity}
                  onChange={handleInputChange}
                  className="bg-[#0B132B] border border-slate-800 focus:border-[#FF5A00] outline-none rounded-xl px-4 py-3 text-sm text-white font-medium"
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <label htmlFor="location" className="text-xs font-black text-slate-300 uppercase tracking-wider">
                  Fulfillment Region
                </label>
                <select
                  id="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="bg-[#0B132B] border border-slate-800 focus:border-[#FF5A00] outline-none rounded-xl px-4 py-3 text-sm text-white cursor-pointer font-medium"
                >
                  <option value="Lagos">Lagos State</option>
                  <option value="Abuja">Abuja FCT</option>
                  <option value="Port Harcourt">Port Harcourt / Rivers</option>
                  <option value="Kano">Kano State</option>
                  <option value="Enugu">Enugu State</option>
                  <option value="Digital">Digital / Nationwide Delivery</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col space-y-1.5">
              <label htmlFor="meta" className="text-xs font-black text-slate-300 uppercase tracking-wider">
                Full Description & Specifications <span className="text-[#FF5A00]">*</span>
              </label>
              <textarea
                id="meta"
                value={formData.meta}
                onChange={handleInputChange}
                rows={4}
                placeholder="Provide detailed information regarding item condition, ticket terms, course syllabus, or warranty..."
                className="bg-[#0B132B] border border-slate-800 focus:border-[#FF5A00] outline-none rounded-xl p-4 text-sm text-white font-medium resize-none"
                required
              />
            </div>
          </div>

          {/* 4. Verification Files */}
          <div className="space-y-4 border-t border-slate-800/80 pt-6">
            <h3 className="text-xs font-black text-[#FF5A00] uppercase tracking-widest flex items-center gap-2">
              <span>📎</span> 4. Additional Verification & Media (Optional)
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FileUploadField
                label="Product Video Walkthrough"
                accept="video/*"
                maxMb={MAX_VIDEO_SIZE_MB}
                file={media.video}
                onSelect={(file) => handleFileChange('video', file, MAX_VIDEO_SIZE_MB)}
              />
              <FileUploadField
                label="Verification PDF / Certificate"
                accept="application/pdf"
                maxMb={MAX_PDF_SIZE_MB}
                file={media.pdf}
                onSelect={(file) => handleFileChange('pdf', file, MAX_PDF_SIZE_MB)}
              />
            </div>
          </div>

          {/* Progress Bar Display */}
          {uploading && (
            <div className="bg-[#0B132B] border border-slate-800 p-4 rounded-2xl space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300 animate-pulse">{statusText || 'Processing pipeline...'}</span>
                <span className="text-[#FF5A00] font-black">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#FF5A00] h-full transition-all duration-300 ease-out"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setCurrentPage && setCurrentPage('marketplace')}
              disabled={uploading}
              className="bg-transparent text-slate-400 hover:text-white font-bold text-xs uppercase tracking-wider px-5 py-3.5 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="bg-[#FF5A00] hover:bg-[#e04f00] text-white font-black text-xs uppercase tracking-widest px-8 py-3.5 rounded-xl transition-all shadow-lg hover:shadow-[#FF5A00]/20 disabled:opacity-40 cursor-pointer border-none flex items-center gap-2"
            >
              {uploading ? (
                <>
                  <span className="animate-spin text-sm">⏳</span>
                  <span>{statusText || 'Publishing Product...'}</span>
                </>
              ) : (
                <span>🚀 Submit & Publish Listing</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function FileUploadField({ label, accept, maxMb, file, onSelect }) {
  return (
    <div className="bg-[#0B132B] border border-slate-800 p-4 rounded-xl flex flex-col justify-between space-y-2">
      <div>
        <label className="text-xs font-bold text-slate-300 block">{label}</label>
        <span className="text-[10px] text-slate-500">Max size: {maxMb}MB</span>
      </div>
      <input
        type="file"
        accept={accept}
        onChange={(e) => onSelect(e.target.files?.[0] || null)}
        className="text-xs text-slate-400 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-slate-800 file:text-slate-200 hover:file:bg-[#FF5A00] hover:file:text-white cursor-pointer"
      />
      {file && (
        <span className="text-[11px] text-emerald-400 font-medium truncate block">
          ✓ {file.name}
        </span>
      )}
    </div>
  );
}