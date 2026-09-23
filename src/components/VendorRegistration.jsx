import React, { useState } from 'react';
import { db, auth } from '../firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function VendorRegistration({ onComplete }) {
  const [step, setStep] = useState(1);
  const [storeTrack] = useState('escrow'); // Locked permanently to 'escrow' (Bold Managed) for platform trust & safety
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    businessName: '',
    phone: '',
    whatsapp: '',
    category: 'Fashion & Apparel',
    description: '',
    address: '',
    state: 'Lagos',
    accountName: '',
    accountNumber: '',
    bankName: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = auth.currentUser;
      const vendorId = user ? user.uid : `vendor_${Date.now()}`;

      const storePayload = {
        vendorId,
        storeTrack, // 'escrow'
        businessName: formData.businessName,
        phone: formData.phone,
        whatsapp: formData.whatsapp || formData.phone,
        category: formData.category,
        description: formData.description,
        address: formData.address,
        state: formData.state,
        payoutDetails: {
          accountName: formData.accountName,
          accountNumber: formData.accountNumber,
          bankName: formData.bankName
        },
        status: 'active',
        createdAt: serverTimestamp()
      };

      // Save to Firestore under 'vendors' collection
      await setDoc(doc(db, 'vendors', vendorId), storePayload);

      setLoading(false);
      if (onComplete) onComplete(storePayload);
    } catch (err) {
      console.error('Error registering vendor:', err);
      setError('Failed to create store. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-[#0B132B] text-white rounded-2xl shadow-2xl border border-slate-800 my-8">
      <div className="text-center mb-6">
        <span className="text-[9px] bg-[#FF5A00] text-white font-black tracking-widest uppercase px-2.5 py-1 rounded">
          🔒 BOLD MANAGED ESCROW ENGINE
        </span>
        <h2 className="text-3xl font-black mt-2 text-white">Register Your Store on Bold.ng</h2>
        <p className="text-slate-400 text-xs mt-1">Setup your professional merchant storefront backed by automated escrow and secure courier pickups.</p>
      </div>

      {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-xl mb-6 text-xs font-semibold">{error}</div>}

      {/* Step 1: Managed Platform Feature Overview */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="bg-[#16223F] p-5 rounded-2xl border border-orange-500/40 space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-black text-base text-orange-400 uppercase tracking-tight">Bold Managed Merchant Standard</span>
              <span className="text-[10px] bg-orange-500 text-white font-bold px-2 py-0.5 rounded-full">Active Track</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              To guarantee total buyer trust and smooth nationwide sales, all stores on <strong className="text-white">bold.ng</strong> operate on our secure managed escrow architecture. We handle payments, dispute resolutions, and dispatch logistics so you can focus entirely on growing your business.
            </p>
            <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside font-medium pt-2 border-t border-slate-800">
              <li>100% Secure Payment Escrow Protection</li>
              <li>Dedicated Bold Customer Support Assistance</li>
              <li>Automated Courier Pickup from Your Store Location</li>
            </ul>
          </div>

          <button
            type="button"
            onClick={() => setStep(2)}
            className="w-full py-4 bg-[#FF5A00] hover:bg-orange-600 text-white font-bold rounded-2xl shadow-lg shadow-orange-600/30 transition cursor-pointer uppercase text-xs tracking-wider font-mono flex items-center justify-center gap-2"
          >
            <span>Continue to Store Information &rarr;</span>
          </button>
        </div>
      )}

      {/* Step 2: Store Information Form */}
      {step === 2 && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-between items-center mb-4 border-b border-slate-800 pb-3">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-300">2. Business Profile & Payout Setup</h3>
            <button 
              type="button" 
              onClick={() => setStep(1)} 
              className="text-xs text-orange-400 hover:underline font-semibold"
            >
              &larr; Back to Overview
            </button>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-300 uppercase tracking-wider mb-1">Business Name *</label>
            <input
              type="text"
              name="businessName"
              required
              value={formData.businessName}
              onChange={handleChange}
              className="w-full bg-[#16223F] border border-slate-800 text-white text-xs rounded-xl p-3 focus:border-[#FF5A00] outline-none"
              placeholder="e.g. Bold Dot Apparel Hub"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-slate-300 uppercase tracking-wider mb-1">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-[#16223F] border border-slate-800 text-white text-xs rounded-xl p-3 focus:border-[#FF5A00] outline-none"
                placeholder="08012345678"
              />
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-300 uppercase tracking-wider mb-1">WhatsApp Notification Line *</label>
              <input
                type="tel"
                name="whatsapp"
                required
                value={formData.whatsapp}
                onChange={handleChange}
                className="w-full bg-[#16223F] border border-slate-800 text-white text-xs rounded-xl p-3 focus:border-[#FF5A00] outline-none"
                placeholder="08012345678"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-black text-slate-300 uppercase tracking-wider mb-1">Primary Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-[#16223F] border border-slate-800 text-white text-xs rounded-xl p-3 focus:border-[#FF5A00] outline-none"
              >
                <option value="Fashion & Apparel">Fashion & Apparel</option>
                <option value="Phones & Electronics">Phones & Electronics</option>
                <option value="Computing & Tech">Computing & Tech</option>
                <option value="Beauty & Personal Care">Beauty & Personal Care</option>
                <option value="Foodstuffs & Provisions">Foodstuffs & Provisions</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-300 uppercase tracking-wider mb-1">Store Address / Location</label>
              <input
                type="text"
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                className="w-full bg-[#16223F] border border-slate-800 text-white text-xs rounded-xl p-3 focus:border-[#FF5A00] outline-none"
                placeholder="Shop 12, Computer Village, Ikeja"
              />
            </div>
          </div>

          {/* Bank Details for Escrow Payouts */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-orange-400">Escrow Settlement Bank Account</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                name="bankName"
                required
                placeholder="Bank Name (e.g. UBA)"
                value={formData.bankName}
                onChange={handleChange}
                className="bg-[#16223F] border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-[#FF5A00] outline-none"
              />
              <input
                type="text"
                name="accountNumber"
                required
                placeholder="Account Number"
                value={formData.accountNumber}
                onChange={handleChange}
                className="bg-[#16223F] border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-[#FF5A00] outline-none"
              />
              <input
                type="text"
                name="accountName"
                required
                placeholder="Account Name"
                value={formData.accountName}
                onChange={handleChange}
                className="bg-[#16223F] border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-[#FF5A00] outline-none"
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-1/3 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-colors cursor-pointer"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-2/3 py-3.5 bg-[#FF5A00] hover:bg-orange-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors disabled:opacity-50 cursor-pointer shadow-lg shadow-orange-600/20"
            >
              {loading ? 'Registering Store...' : 'Complete Store Registration'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}