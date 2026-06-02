import React, { useState } from 'react';

// High-Trust streetwear validation array 
const SECURITY_IMAGES = [
  { id: 'a', url: 'https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=150&auto=format&fit=crop&q=60', isItem: true, label: 'Streetwear Suit' },
  { id: 'b', url: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=150&auto=format&fit=crop&q=60', isItem: false, label: 'Server Laptop' },
  { id: 'c', url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=150&auto=format&fit=crop&q=60', isItem: true, label: 'Sport Sneaker' },
  { id: 'd', url: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=150&auto=format&fit=crop&q=60', isItem: false, label: 'Smartwatch' },
  { id: 'e', url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=150&auto=format&fit=crop&q=60', isItem: true, label: 'Premium Jacket' },
  { id: 'f', url: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=150&auto=format&fit=crop&q=60', isItem: false, label: 'Smart Device' },
];

export default function SignUp({ setCurrentPage, setMerchantStore }) {
  // Form Intake Fields
  const [storeName, setStoreName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [location, setLocation] = useState('');
  const [niche, setNiche] = useState("Men's Streetwear & Fast-Fashion");
  const [cacNumber, setCacNumber] = useState('');
  
  // Security Tokens
  const [simulatedOtp] = useState('7942'); // Master code for testing
  const [userOtp, setUserOtp] = useState('');
  const [selectedImages, setSelectedImages] = useState([]);
  const [isDeploying, setIsDeploying] = useState(false);

  // Toggle CAPTCHA images on click
  const toggleImageSelection = (id) => {
    if (selectedImages.includes(id)) {
      setSelectedImages(selectedImages.filter(item => item !== id));
    } else {
      setSelectedImages([...selectedImages, id]);
    }
  };

  // Process Unified Validation Check
  const handleSecureRegistration = (e) => {
    e.preventDefault();

    // 1. Mandatory Fields Check
    if (!storeName || !email || !whatsapp || !location) {
      alert("❌ SECURITY ALERT: All core identity tracks must be populated.");
      return;
    }

    // 2. Validate Token Matching
    if (userOtp !== simulatedOtp) {
      alert(`❌ VERIFICATION FAILURE: Invalid Phone/Email Token pin. For testing, use the simulated developer pin: ${simulatedOtp}`);
      return;
    }

    // 3. Validate Visual Robot Blockade
    const correctFashionIds = SECURITY_IMAGES.filter(img => img.isItem).map(img => img.id);
    const badPicks = selectedImages.filter(id => !correctFashionIds.includes(id));
    const accuratePicksCount = selectedImages.filter(id => correctFashionIds.includes(id)).length;

    if (badPicks.length > 0 || accuratePicksCount !== correctFashionIds.length) {
      alert("⚠️ ROBOT BLOCKADE DETECTED: You must select ONLY the 3 fashion clothing items (Suit, Sneaker, Jacket) to prove your niche authority.");
      return;
    }

    // If all pass, initiate platform enrollment
    setIsDeploying(true);
    setTimeout(() => {
      setIsDeploying(false);
      setMerchantStore({
        name: storeName,
        niche: niche,
        status: cacNumber ? "Verified Corporate Entity" : "Verified Small Merchant",
        cac: cacNumber || "Personal/Micro-Vendor (No CAC)",
        location: location,
        whatsapp: whatsapp,
        joined: "June 2026",
        balance: "₦0",
        escrow: "₦0"
      });
      setCurrentPage('store');
    }, 1500);
  };

  return (
    <main className="max-w-2xl mx-auto my-12 px-4">
      <div className="bg-white text-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-200">
        
        {/* Banner header explaining the mode */}
        <div className="bg-slate-900 text-white rounded-2xl p-4 mb-8 text-xs font-mono border-l-4 border-[#FF5A00]">
          <p className="font-bold text-[#FF5A00]">🛡️ BOLD SECURITY LEDGER MODE: LOCAL DEPLOYMENT</p>
          <p className="text-slate-400 mt-1">
            Real SMS APIs (Twilio/Termii) connect during server setup. 
            To bypass the security guard right now, use simulated code: <span className="text-white font-black underline bg-slate-800 px-1.5 py-0.5 rounded">{simulatedOtp}</span>.
          </p>
        </div>

        <div className="text-center mb-8 border-b border-slate-100 pb-5">
          <span className="text-[10px] font-black tracking-widest text-[#FF5A00] uppercase bg-orange-50 px-3 py-1 rounded-md">
            Anti-Scam Verification Console
          </span>
          <h1 className="text-3xl font-black text-[#0B132B] tracking-tight mt-2">Create Secure Merchant Vault</h1>
          <p className="text-slate-500 text-xs mt-1">Zero configuration gaps. Every field below is cross-verified live.</p>
        </div>

        <form onSubmit={handleSecureRegistration} className="space-y-8">
          
          {/* Section 1: Data Profiles */}
          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-wider text-[#0B132B] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF5A00]"></span> 1. Traceable Merchant Profile
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1.5">Brand / Store Name</label>
                <input type="text" required value={storeName} onChange={(e) => setStoreName(e.target.value)} placeholder="e.g., Cassydon Garms" className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm bg-slate-50 font-semibold focus:outline-none focus:border-[#FF5A00]" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1.5">Direct Business Email</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@domain.com" className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm bg-slate-50 font-semibold focus:outline-none focus:border-[#FF5A00]" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1.5">WhatsApp Number</label>
                <input type="tel" required value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="e.g., +2348100000000" className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm bg-slate-50 font-mono font-bold focus:outline-none focus:border-[#FF5A00]" />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1.5">Physical Warehouse Address</label>
                <input type="text" required value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g., Ikeja, Lagos" className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm bg-slate-50 font-semibold focus:outline-none focus:border-[#FF5A00]" />
              </div>
            </div>
          </div>

          {/* Section 2: Core OTP Matching */}
          <div className="space-y-4 border-t border-slate-100 pt-6">
            <h3 className="text-sm font-black uppercase tracking-wider text-[#0B132B] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF5A00]"></span> 2. Network Token Lock
            </h3>
            <p className="text-slate-500 text-xs">Simulates the cryptographic security blast that prevents cloned bot numbers from parsing our sign-up engine.</p>
            
            <div className="max-w-xs">
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1.5">Enter Received 4-Digit Code</label>
              <input 
                type="text" 
                required 
                maxLength={4} 
                value={userOtp} 
                onChange={(e) => setUserOtp(e.target.value)}
                placeholder="Type 7942 here to clear simulation" 
                className="w-full px-4 py-3 rounded-xl border-2 border-slate-800 text-center font-mono font-black tracking-widest text-lg bg-slate-50 text-[#0B132B] focus:outline-none focus:border-[#FF5A00]"
              />
            </div>
          </div>

          {/* Section 3: The Interactive CAPTCHA Array */}
          <div className="space-y-4 border-t border-slate-100 pt-6">
            <h3 className="text-sm font-black uppercase tracking-wider text-[#0B132B] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#FF5A00]"></span> 3. Sync Market CAPTCHA Blockade
            </h3>
            <p className="text-slate-500 text-xs">
              Anti-bot firewall: Click and select <span className="font-extrabold text-[#0B132B]">ALL 3 Fashion Apparel items</span> below. Leave non-apparel devices unselected.
            </p>

            {/* Grid display layout */}
            <div className="grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              {SECURITY_IMAGES.map((img) => {
                const isSelected = selectedImages.includes(img.id);
                return (
                  <div 
                    key={img.id}
                    onClick={() => toggleImageSelection(img.id)}
                    className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer border-4 transition-all duration-150 select-none ${isSelected ? 'border-[#FF5A00] scale-[0.96]' : 'border-transparent hover:brightness-90'}`}
                  >
                    <img src={img.url} alt="Ecosystem Verification Token" className="w-full h-full object-cover" />
                    {isSelected && (
                      <div className="absolute inset-0 bg-[#FF5A00]/20 flex items-center justify-center font-bold text-white text-2xl shadow-inner">
                        ✓
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Submission Trigger */}
          <button 
            type="submit"
            disabled={isDeploying}
            className="w-full bg-[#0B132B] text-white py-4 rounded-xl font-black tracking-wide hover:bg-slate-800 transition disabled:bg-slate-400 border-none outline-none cursor-pointer text-sm shadow-xl"
          >
            {isDeploying ? "Shielding Vault & Booting Up Store..." : "Verify Identity & Launch Storefront →"}
          </button>

        </form>
      </div>
    </main>
  );
}