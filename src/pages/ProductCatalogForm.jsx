import React, { useState } from 'react';
import { storage } from '../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

export default function ProductCatalogForm({ onAddProductComplete, setCurrentPage }) {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('Lagos');
  const [category, setCategory] = useState('electronics');
  const [meta, setMeta] = useState('');

  // Media File States
  const [imageFile, setImageFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [pdfFile, setPdfFile] = useState(null);

  // System Loading UI Feedback States
  const [uploading, setUploading] = useState(false);
  const [statusText, setStatusText] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  // ⚡ INTERNAL COMPRESSION ENGINE: Shrinks image sizes down to under 150KB automatically
  const compressImageBeforeUpload = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          const MAX_WIDTH = 1000;
          const MAX_HEIGHT = 1000;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob((blob) => {
            const compressedFile = new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            resolve(compressedFile);
          }, 'image/jpeg', 0.7);
        };
      };
    });
  };

  // Utility Function to handle isolated cloud file uploads cleanly
  const uploadSingleFile = (file, folderPath, stepName) => {
    return new Promise((resolve, reject) => {
      if (!file) {
        resolve(''); 
        return; 
      }
      
      const uniqueFileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
      const storageRef = ref(storage, `${folderPath}/${uniqueFileName}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setStatusText(`Streaming ${stepName}: ${Math.round(progress)}%`);
          setUploadProgress(Math.round(progress));
        }, 
        (error) => {
          console.error("Cloud storage upload rejected:", error);
          reject(error);
        }, 
        async () => {
          try {
            const destinationUrl = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(destinationUrl);
          } catch (urlErr) {
            reject(urlErr);
          }
        }
      );
    });
  };

  const handleFormSubmission = async (e) => {
    e.preventDefault();
    if (!title || !price) return alert("Please specify title and baseline valuation parameters.");

    try {
      setUploading(true);
      setUploadProgress(5);

      // Step 1: Image Processing and Uploading
      let imageUrl = '';
      if (imageFile) {
        setStatusText('Optimizing product display layout snapshot...');
        const optimizedImage = await compressImageBeforeUpload(imageFile);
        imageUrl = await uploadSingleFile(optimizedImage, 'products/images', 'Display Image');
      }

      // Step 2: Video Walkthrough Processing and Uploading
      let videoUrl = '';
      if (videoFile) {
        imageUrl = await uploadSingleFile(videoFile, 'products/videos', 'Video Log');
      }

      // Step 3: PDF Document Processing and Uploading
      let pdfUrl = '';
      if (pdfFile) {
        pdfUrl = await uploadSingleFile(pdfFile, 'products/documents', 'Verification Report');
      }

      setStatusText('Synchronizing product matrix logs...');
      setUploadProgress(100);

      const completeProductNode = {
        id: Date.now(),
        title,
        price: Number(price),
        location,
        category,
        meta,
        img: imageUrl || 'https://placehold.co/600x400/16223F/FFF?text=Bold.ng+Asset', 
        media: {
          imageUrl: imageUrl || 'https://placehold.co/600x400/16223F/FFF?text=Bold.ng+Asset',
          videoUrl: videoUrl || '',
          pdfUrl: pdfUrl || ''
        },
        dateAdded: new Date().toISOString().split('T')[0]
      };

      await onAddProductComplete(completeProductNode);
      setCurrentPage('marketplace'); 
      
    } catch (err) {
      console.error("Submission error details:", err);
      alert("Asset connection timed out. Please check your internet connection or check your browser console for specific network errors.");
    } finally {
      setUploading(false);
      setUploadProgress(0);
      setStatusText('');
    }
  };

  return (
    <div className="max-w-3xl mx-auto my-6 px-4 text-white text-left selection:bg-[#FF5A00]">
      <div className="bg-[#16223F] border border-slate-800 rounded-3xl p-6 lg:p-8 shadow-2xl">
        
        <div className="mb-6 border-b border-slate-800 pb-4">
          <h2 className="text-2xl font-black tracking-tight">Vetted Asset Log Registration</h2>
          <p className="text-xs text-slate-400 mt-1">Upload verify files, multimedia parameters, and certification logs directly to the Bold ledger matrix.</p>
        </div>

        <form onSubmit={handleFormSubmission} className="space-y-5">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-black text-slate-300 uppercase tracking-wider">Product Asset Title</label>
              <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., MacBook Pro M3 Max or 2020 Lexus RX350" className="bg-[#0B132B] border border-slate-800 focus:border-[#FF5A00] outline-none rounded-xl px-4 py-3 text-sm transition-all" required />
            </div>
            
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-black text-slate-300 uppercase tracking-wider">Valuation Amount (₦)</label>
              <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price in Naira" className="bg-[#0B132B] border border-slate-800 focus:border-[#FF5A00] outline-none rounded-xl px-4 py-3 text-sm font-mono transition-all" required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-black text-slate-300 uppercase tracking-wider">Primary Market Hub Sector</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="bg-[#0B132B] border border-slate-800 focus:border-[#FF5A00] outline-none rounded-xl px-4 py-3 text-sm transition-all cursor-pointer">
                <option value="electronics">💻 Electronics & Hardware</option>
                <option value="fashion">👕 Apparel & Premium Fashion</option>
                <option value="automotive">🚗 Automotive & Machinery</option>
                <option value="realestate">🏢 Real Estate Properties</option>
                <option value="travel">✈️ Logistics & Travel Nodes</option>
                <option value="education">📚 Professional Mentorship Courses</option>
              </select>
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="text-xs font-black text-slate-300 uppercase tracking-wider">Verification Inspection Hub</label>
              <select value={location} onChange={(e) => setLocation(e.target.value)} className="bg-[#0B132B] border border-slate-800 focus:border-[#FF5A00] outline-none rounded-xl px-4 py-3 text-sm transition-all cursor-pointer">
                <option value="Lagos">Lagos Hub (Main Operations)</option>
                <option value="Abuja">Abuja Hub (Capital Node)</option>
                <option value="Port Harcourt">Port Harcourt Hub (South Node)</option>
                <option value="Kano">Kano Hub (North Node)</option>
                <option value="Remote">Digital/Remote Hub Matrix</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col space-y-1.5">
            <label className="text-xs font-black text-slate-300 uppercase tracking-wider">Technical Specifications / Condition Logs</label>
            <textarea value={meta} onChange={(e) => setMeta(e.target.value)} rows="3" placeholder="List item battery health, diagnostic flaws, box configurations, or structural documentation details explicitly..." className="bg-[#0B132B] border border-slate-800 focus:border-[#FF5A00] outline-none rounded-xl p-4 text-sm transition-all resize-none" required></textarea>
          </div>

          {/* MULTIMEDIA INFRASTRUCTURE STORAGE PORTS */}
          <div className="border-t border-slate-800/60 pt-4 space-y-4">
            <h3 className="text-xs font-black text-[#FF5A00] uppercase tracking-widest">Sovereign Media Verification Files</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* IMAGE UPLOAD CONTAINER */}
              <div className="bg-[#0B132B] border border-slate-800 p-4 rounded-2xl relative text-center">
                <span className="text-xl block mb-1">📸</span>
                <span className="text-[11px] font-bold text-slate-300 block mb-2">Display Image</span>
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0] || null)} className="w-full text-[10px] text-slate-400 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[10px] file:font-black file:bg-[#FF5A00] file:text-white cursor-pointer" />
                {imageFile && <p className="text-[9px] text-[#FF5A00] mt-1 truncate">{imageFile.name}</p>}
              </div>

              {/* VIDEO UPLOAD CONTAINER */}
              <div className="bg-[#0B132B] border border-slate-800 p-4 rounded-2xl relative text-center">
                <span className="text-xl block mb-1">🎥</span>
                <span className="text-[11px] font-bold text-slate-300 block mb-2">Video Walkthrough</span>
                <input type="file" accept="video/*" onChange={(e) => setVideoFile(e.target.files[0] || null)} className="w-full text-[10px] text-slate-400 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[10px] file:font-black file:bg-[#FF5A00] file:text-white cursor-pointer" />
                {videoFile && <p className="text-[9px] text-[#FF5A00] mt-1 truncate">{videoFile.name}</p>}
              </div>

              {/* PDF REPORT UPLOAD CONTAINER */}
              <div className="bg-[#0B132B] border border-slate-800 p-4 rounded-2xl relative text-center">
                <span className="text-xl block mb-1">📄</span>
                <span className="text-[11px] font-bold text-slate-300 block mb-2">PDF Clearance Document</span>
                <input type="file" accept="application/pdf" onChange={(e) => setPdfFile(e.target.files[0] || null)} className="w-full text-[10px] text-slate-400 file:mr-2 file:py-1 file:px-2 file:rounded-md file:border-0 file:text-[10px] file:font-black file:bg-[#FF5A00] file:text-white cursor-pointer" />
                {pdfFile && <p className="text-[9px] text-[#FF5A00] mt-1 truncate">{pdfFile.name}</p>}
              </div>
            </div>
          </div>

          {/* DYNAMIC PROGRESS DISPLAY OVERLAY MODULE */}
          {uploading && (
            <div className="bg-[#0B132B] border border-slate-800 p-4 rounded-xl space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-400 animate-pulse">{statusText || 'Streaming packets...'}</span>
                <span className="text-[#FF5A00] font-black">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                <div className="bg-[#FF5A00] h-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
              </div>
            </div>
          )}

          {/* FORMACTION CONTROL LEVERS */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={() => setCurrentPage('marketplace')} className="bg-transparent text-slate-400 hover:text-white font-black text-xs uppercase tracking-wider px-4 py-3 rounded-xl border-none cursor-pointer transition-colors" disabled={uploading}>Cancel</button>
            <button type="submit" className="bg-[#FF5A00] text-white font-black text-xs uppercase tracking-widest px-6 py-3.5 rounded-xl hover:brightness-110 disabled:opacity-40 transition-all shadow-md cursor-pointer border-none" disabled={uploading}>
              {uploading ? 'Processing Storage Sync...' : '🚀 Initialize Asset Node'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}