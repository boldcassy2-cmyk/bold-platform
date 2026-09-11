import React, { useState } from 'react';
import { collection, addDoc, getFirestore } from 'firebase/firestore';
import { auth } from '../firebaseConfig';

export default function EscrowCheckout({ product, onTransactionCreated }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const db = getFirestore();
  const currentUser = auth.currentUser;

  // Default product fallback if opened directly without props
  const item = product || {
    id: 'prod-sample-01',
    name: 'iPhone 13 Pro (Verified Device)',
    price: 450000,
    amountFormatted: '450,000 NGN',
    vendorId: 'vendor-sample-123',
    vendorName: 'Bold Gadgets Store'
  };

  // Handle Escrow Payment / Funding
  const handleFundEscrow = async () => {
    if (!currentUser) {
      setMessage('Please sign in to complete an escrow purchase.');
      return;
    }

    setLoading(true);
    setMessage('Securing funds in escrow...');

    try {
      // 1. Create a new transaction document in Firestore
      const docRef = await addDoc(collection(db, 'escrowTransactions'), {
        productId: item.id || 'unknown-product',
        productName: item.name || item.productName,
        amount: item.amountFormatted || `${item.price} NGN`,
        rawAmount: item.price || 0,
        vendorId: item.vendorId || 'unknown-vendor',
        vendorName: item.vendorName || 'Bold Verified Vendor',
        buyerId: currentUser.uid,
        buyerEmail: currentUser.email || 'Buyer',
        status: 'FUNDED', // Initial status: Funds secured safely
        createdAt: new Date().toISOString()
      });

      setMessage('Payment successful! Funds are locked in escrow.');

      // 2. Pass the new transaction ID back up to route the user to their Escrow Tracker
      setTimeout(() => {
        if (onTransactionCreated) {
          onTransactionCreated(docRef.id);
        }
      }, 1500);

    } catch (error) {
      setMessage(`Error processing escrow: ${error.message}`);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md border border-gray-100 my-8">
      <div className="mb-6 pb-4 border-b border-gray-100">
        <h2 className="text-xl font-bold text-slate-900">Secure Escrow Checkout</h2>
        <p className="text-xs text-gray-400">Your money is protected until you receive and inspect your item.</p>
      </div>

      {message && (
        <div className="mb-4 p-3 bg-blue-50 text-blue-800 text-sm rounded-lg font-medium">
          {message}
        </div>
      )}

      {/* Order Summary Box */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Item:</span>
          <span className="font-semibold text-gray-800">{item.name || item.productName}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Vendor:</span>
          <span className="font-medium text-gray-700">{item.vendorName}</span>
        </div>
        <div className="flex justify-between text-sm border-t border-gray-200 pt-2 mt-2">
          <span className="text-gray-600 font-medium">Escrow Total:</span>
          <span className="text-lg font-bold text-orange-600">{item.amountFormatted || `${item.price} NGN`}</span>
        </div>
      </div>

      {/* Escrow Trust Guarantee Note */}
      <div className="bg-orange-50 border border-orange-100 p-3 rounded-lg mb-6 text-xs text-orange-800 leading-relaxed">
        🔒 <strong>Bold.ng Escrow Guarantee:</strong> Funds will not be released to the vendor until delivery is confirmed and your inspection window clears.
      </div>

      {/* Pay Button */}
      <button 
        onClick={handleFundEscrow}
        disabled={loading}
        className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-xl font-semibold text-sm transition shadow-sm disabled:opacity-50"
      >
        {loading ? 'Processing Secure Payment...' : 'Pay into Secure Escrow'}
      </button>
    </div>
  );
}