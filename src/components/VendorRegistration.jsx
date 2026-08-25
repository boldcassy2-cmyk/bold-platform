import React, { useState } from 'react';
import { db, auth } from '../firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

export default function VendorRegistration({ onComplete }) {
  const [step, setStep] = useState(1);
  const [storeTrack, setStoreTrack] = useState('escrow'); // 'escrow' (Bold Managed) or 'direct' (Self-Managed)
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
        storeTrack, // 'escrow' or 'direct'
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

      // Save to Firestore
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
    <div className="max-w-2xl mx-auto p-6 bg-[#0B132B] text-white rounded-xl shadow-2xl border border-gray-800 my-8">
      <h2 className="text-3xl font-bold text-center mb-2 text-orange-500">Register Your Store on Bold.ng</h2>
      <p className="text-gray-400 text-center mb-8">Select how you want to manage your sales and setup your business profile.</p>

      {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-6 text-sm">{error}</div>}

      {/* Step 1: Select Management Track */}
      {step === 1 && (
        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-gray-200">1. Choose Your Business Model</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Option A: Bold.ng Managed */}
            <div 
              onClick={() => setStoreTrack('escrow')}
              className={`p-5 rounded-lg border-2 cursor-pointer transition-all ${
                storeTrack === 'escrow' 
                  ? 'border-orange-500 bg-orange-500/10' 
                  : 'border-gray-700 bg-gray-900/50 hover:border-gray-500'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-lg text-orange-400">Bold Managed</span>
                <span className="text-xs bg-orange-500/20 text-orange-300 px-2 py-1 rounded">Recommended</span>
              </div>
              <p className="text-sm text-gray-300 mb-3">Bold handles payment escrow, customer service, and dispatch logistics for you.</p>
              <ul className="text-xs text-gray-400 space-y-1 list-disc list-inside">
                <li>Secure Escrow Payments</li>
                <li>Bold Handles Customer Support</li>
                <li>Automated Courier Pickup</li>
              </ul>
            </div>

            {/* Option B: Self Managed */}
            <div 
              onClick={() => setStoreTrack('direct')}
              className={`p-5 rounded-lg border-2 cursor-pointer transition-all ${
                storeTrack === 'direct' 
                  ? 'border-orange-500 bg-orange-500/10' 
                  : 'border-gray-700 bg-gray-900/50 hover:border-gray-500'
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-lg text-blue-400">Self Managed</span>
                <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">Direct Contact</span>
              </div>
              <p className="text-sm text-gray-300 mb-3">Customers contact you directly via WhatsApp/Call to deal and arrange delivery.</p>
              <ul className="text-xs text-gray-400 space-y-1 list-disc list-inside">
                <li>Direct WhatsApp Inquiries</li>
                <li>Zero Escrow Processing</li>
                <li>You Handle Delivery & Deals</li>
              </ul>
            </div>
          </div>

          <button
            onClick={() => setStep(2)}
            className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-colors mt-6"
          >
            Continue to Store Details $\rightarrow$
          </button>
        </div>
      )}

      {/* Step 2: Store Information Form */}
      {step === 2 && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-200">2. Store Information</h3>
            <button 
              type="button" 
              onClick={() => setStep(1)} 
              className="text-xs text-orange-400 hover:underline"
            >
              $\leftarrow$ Change Business Model ({storeTrack === 'escrow' ? 'Bold Managed' : 'Self Managed'})
            </button>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Business Name *</label>
            <input
              type="text"
              name="businessName"
              required
              value={formData.businessName}
              onChange={handleChange}
              className="w-full bg-gray-900 border border-gray-700 rounded p-2.5 text-white focus:border-orange-500 outline-none"
              placeholder="e.g. Bold Dot Apparel"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Phone Number *</label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-gray-900 border border-gray-700 rounded p-2.5 text-white focus:border-orange-500 outline-none"
                placeholder="08012345678"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">WhatsApp Number {storeTrack === 'direct' && '*'}</label>
              <input
                type="tel"
                name="whatsapp"
                required={storeTrack === 'direct'}
                value={formData.whatsapp}
                onChange={handleChange}
                className="w-full bg-gray-900 border border-gray-700 rounded p-2.5 text-white focus:border-orange-500 outline-none"
                placeholder="08012345678"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full bg-gray-900 border border-gray-700 rounded p-2.5 text-white focus:border-orange-500 outline-none"
            >
              <option value="Fashion & Apparel">Fashion & Apparel</option>
              <option value="Phones & Electronics">Phones & Electronics</option>
              <option value="Computing & Tech">Computing & Tech</option>
              <option value="Beauty & Personal Care">Beauty & Personal Care</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-300 mb-1">Store Address / Location</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full bg-gray-900 border border-gray-700 rounded p-2.5 text-white focus:border-orange-500 outline-none"
              placeholder="Shop 12, Computer Village, Ikeja"
            />
          </div>

          {/* Bank Details for Escrow Payouts */}
          {storeTrack === 'escrow' && (
            <div className="pt-4 border-t border-gray-800">
              <h4 className="text-md font-medium text-orange-400 mb-3">Payout Bank Account (for Escrow Settlements)</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <input
                  type="text"
                  name="bankName"
                  placeholder="Bank Name (e.g. UBA)"
                  value={formData.bankName}
                  onChange={handleChange}
                  className="bg-gray-900 border border-gray-700 rounded p-2 text-sm text-white focus:border-orange-500 outline-none"
                />
                <input
                  type="text"
                  name="accountNumber"
                  placeholder="Account Number"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  className="bg-gray-900 border border-gray-700 rounded p-2 text-sm text-white focus:border-orange-500 outline-none"
                />
                <input
                  type="text"
                  name="accountName"
                  placeholder="Account Name"
                  value={formData.accountName}
                  onChange={handleChange}
                  className="bg-gray-900 border border-gray-700 rounded p-2 text-sm text-white focus:border-orange-500 outline-none"
                />
              </div>
            </div>
          )}

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-1/3 py-3 bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold rounded-lg transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-2/3 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating Store...' : 'Complete Registration'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}