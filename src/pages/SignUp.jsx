import React, { useState } from 'react';

export default function SignUp({ setCurrentPage, setMerchantStore }) {
  // Local Form States
  const [formData, setFormData] = useState({
    name: '',
    niche: "Men's Streetwear & Apparel",
    location: 'Lagos, NG',
    whatsapp: '',
    agreedToTerms: false
  });

  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Validations Core Check
    if (!formData.name.trim()) {
      setErrorMsg('Please supply a valid corporate registration or brand name.');
      return;
    }
    if (!formData.whatsapp.trim()) {
      setErrorMsg('A valid WhatsApp communication line node is required.');
      return;
    }
    if (!formData.agreedToTerms) {
      setErrorMsg('You must authorize the Escrow Operational Protocol guidelines.');
      return;
    }

    // Format phone number string safely for WhatsApp direct router links
    let cleanPhone = formData.whatsapp.replace(/\D/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '234' + cleanPhone.substring(1);
    } else if (!cleanPhone.startsWith('234') && cleanPhone.length === 10) {
      cleanPhone = '234' + cleanPhone;
    }

    // Inject state configuration into global system context
    setMerchantStore({
      name: formData.name,
      niche: formData.niche,
      status: 'Verified',
      location: formData.location,
      whatsapp: cleanPhone
    });

    // Advance viewport straight to merchant dashboard stream
    setCurrentPage('store');
  };

  return (
    <div className="max-w-5xl mx-auto my-8 px-4 grid grid-cols-1 md:grid-cols-12 gap-8 items-stretch animate-fadeIn text-white">
      
      {/* LEFT ASPECT COLUMN: BRAND POSITIONING AND VALUE PROP */}
      <div className="md:col-span-5 bg-[#16223F] border border-slate-800 rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-40 h-40 bg-[#FF5A00]/5 rounded-full transform translate-x-12 -translate-y-12" />
        
        <div className="space-y-6 relative z-10">
          <div className="inline-block bg-[#FF5A00] text-white text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded">
            Merchant Protocol v2.0
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-black tracking-tight leading-tight">
              Unlock Fear-Free <span className="text-[#FF5A00]">E-Commerce</span> Infrastructure.
            </h2>
            <p className="text-slate-400 text-xs leading-relaxed font-medium">
              Deploy your catalog node inside the Bold network. Instantly secure decentralized trust matrices, absolute inspection milestones, and escrow payout protection layers.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800/80 space-y-3 text-[11px] font-semibold text-slate-300">
          <div className="flex items-center gap-2.5">
            <span className="text-base text-[#FF5A00]">🛡️</span>
            <span>100% Payout Settlement Vault Protection</span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-base text-emerald-500">🤝</span>
            <span>Direct Consumer WhatsApp Link Protocols</span>
          </div>
          <div className="flex items-center gap-2.5">
            <span className="text-base text-amber-500">⚡</span>
            <span>Instant Deployment Parameters No Code Required</span>
          </div>
        </div>
      </div>

      {/* RIGHT ASPECT COLUMN: INTERACTIVE INPUT FORM NODE */}
      <div className="md:col-span-7 bg-[#16223F] border border-slate-800 rounded-3xl p-8 shadow-xl flex flex-col justify-center">
        <div className="mb-6">
          <h3 className="text-xl font-black tracking-tight">Onboard Merchant Node</h3>
          <p className="text-slate-400 text-xs font-medium mt-1">Configure your profile fields below to activate your vendor dashboard.</p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-950/40 border border-red-900/50 text-red-400 rounded-xl text-xs font-bold tracking-wide flex items-center gap-2">
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* FIELD: BRAND IDENTIFIER */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-black text-slate-300 uppercase tracking-wider">
              Store / Business Brand Name
            </label>
            <input 
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Cassydon Streetwear Hub"
              className="w-full bg-[#0B132B] border border-slate-800 focus:border-[#FF5A00] rounded-xl px-4 py-3 text-sm text-white font-medium outline-none transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* FIELD: INDUSTRY SECTOR */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-slate-300 uppercase tracking-wider">
                Commerce Core Niche
              </label>
              <select
                name="niche"
                value={formData.niche}
                onChange={handleChange}
                className="w-full bg-[#0B132B] border border-slate-800 focus:border-[#FF5A00] rounded-xl px-3 py-3 text-sm text-white font-medium outline-none transition cursor-pointer appearance-none"
              >
                <option value="Men's Streetwear & Apparel">👕 Men's Streetwear & Apparel</option>
                <option value="Automotive Sourcing">🚗 Automotive Sourcing</option>
                <option value="Premium Gadgetry & Electronics">💻 Premium Electronics</option>
                <option value="Real Estate Development">🏢 Real Estate Properties</option>
                <option value="Educational Mentorship">📚 Mentorship & Services</option>
              </select>
            </div>

            {/* FIELD: HUB LOCATION */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black text-slate-300 uppercase tracking-wider">
                Operational Logistics Base
              </label>
              <select
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full bg-[#0B132B] border border-slate-800 focus:border-[#FF5A00] rounded-xl px-3 py-3 text-sm text-white font-medium outline-none transition cursor-pointer appearance-none"
              >
                <option value="Lagos, NG">Lagos, Nigeria</option>
                <option value="Abuja, NG">Abuja, Nigeria</option>
                <option value="Port Harcourt, NG">Port Harcourt, Nigeria</option>
                <option value="Remote Operations">Global / Remote</option>
              </select>
            </div>
          </div>

          {/* FIELD: WHATSAPP WHATSAPP PIPELINE */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-black text-slate-300 uppercase tracking-wider">
              WhatsApp Communication Routing Line
            </label>
            <input 
              type="text"
              name="whatsapp"
              value={formData.whatsapp}
              onChange={handleChange}
              placeholder="e.g., 08031234567 or 2348031234567"
              className="w-full bg-[#0B132B] border border-slate-800 focus:border-[#FF5A00] rounded-xl px-4 py-3 text-sm text-white font-mono font-medium outline-none transition"
            />
            <span className="text-[10px] text-slate-500 block font-medium">Used for direct buyer escrow negotiation routing pipes.</span>
          </div>

          {/* PROTOCOL AGREEMENT CHECKBOX */}
          <label className="flex items-start gap-3 pt-2 group cursor-pointer select-none">
            <input 
              type="checkbox"
              name="agreedToTerms"
              checked={formData.agreedToTerms}
              onChange={handleChange}
              className="mt-0.5 accent-[#FF5A00] w-4 h-4 rounded border-slate-800 cursor-pointer"
            />
            <span className="text-[11px] text-slate-400 group-hover:text-slate-300 transition leading-relaxed font-medium">
              I authorize the <span className="text-white font-bold">Bold.ng Escrow Matrix</span> to hold transaction capital liabilities securely until buyer clearance verification confirmation vectors match.
            </span>
          </label>

          {/* SUBMIT EXECUTION BUTTON */}
          <button
            type="submit"
            className="w-full mt-4 bg-[#FF5A00] text-white font-black text-xs uppercase tracking-widest py-4 rounded-xl border-none cursor-pointer shadow-lg hover:brightness-110 transition duration-200"
          >
            🚀 Deploy Brand Node
          </button>

        </form>
      </div>

    </div>
  );
}