import React, { useState } from 'react';

export default function ApplyAsVendor({ onNavigate }) {
  const [formData, setFormData] = useState({
    businessName: '',
    cacNumber: '',
    category: 'Streetwear & Casual Fashion',
    phone: '',
    email: '',
    hubLocation: 'Lagos Hub'
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.businessName || !formData.cacNumber) {
      alert('Please fill in your Business Name and CAC registration details.');
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 text-white">
      <div className="bg-[#16223F] p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-4">
          <div>
            <span className="text-[10px] font-black tracking-widest text-[#FF5A00] uppercase">Vendor Onboarding</span>
            <h2 className="text-2xl font-black mt-1">Apply as Official Vendor</h2>
          </div>
          <button 
            type="button"
            onClick={() => onNavigate('marketplace')}
            className="text-xs font-bold text-slate-400 hover:text-white bg-slate-900/60 px-3 py-1.5 rounded-xl border border-slate-700 cursor-pointer"
          >
            ✕ Cancel
          </button>
        </div>

        {submitted ? (
          <div className="bg-[#0B132B] p-8 rounded-2xl border border-slate-800 text-center space-y-4">
            <span className="text-4xl">🎉</span>
            <h3 className="text-xl font-black">Application Received!</h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-md mx-auto">
              Your vendor application for <strong className="text-white">{formData.businessName}</strong> has been logged into the compliance matrix. Our team will verify your CAC registration details and contact you shortly.
            </p>
            <button
              onClick={() => onNavigate('matrix')}
              className="bg-[#FF5A00] hover:bg-[#e05000] text-white font-black px-6 py-3 rounded-xl text-xs uppercase tracking-wider cursor-pointer"
            >
              View Merchant Matrix →
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-1">Business Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Bold Apparel & Spares Ltd"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className="w-full bg-[#0B132B] border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF5A00]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-1">CAC Registration Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. RC-1234567 or BN-..."
                  value={formData.cacNumber}
                  onChange={(e) => setFormData({ ...formData, cacNumber: e.target.value })}
                  className="w-full bg-[#0B132B] border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF5A00]"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-1">Inventory Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-[#0B132B] border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF5A00]"
                >
                  <option value="Streetwear & Casual Fashion">Streetwear & Casual Fashion</option>
                  <option value="Automotive & Spares">Automotive & Spares</option>
                  <option value="Digital Gift Cards & Top-Ups">Digital Gift Cards & Top-Ups</option>
                  <option value="General Merchandise">General Merchandise</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-1">Business Email</label>
                <input
                  type="email"
                  required
                  placeholder="vendor@bold.ng"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-[#0B132B] border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF5A00]"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-slate-400 mb-1">Fulfillment Hub</label>
                <select
                  value={formData.hubLocation}
                  onChange={(e) => setFormData({ ...formData, hubLocation: e.target.value })}
                  className="w-full bg-[#0B132B] border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#FF5A00]"
                >
                  <option value="Lagos Hub">Lagos Hub (Main Operations)</option>
                  <option value="Abuja Hub">Abuja Hub</option>
                  <option value="Port Harcourt Hub">Port Harcourt Hub</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#FF5A00] hover:bg-[#e05000] text-white font-black py-4 rounded-2xl transition-all shadow-[0_4px_20px_rgba(255,90,0,0.4)] cursor-pointer uppercase tracking-wider text-sm mt-4"
            >
              Submit Vendor Application
            </button>
          </form>
        )}

      </div>
    </div>
  );
}