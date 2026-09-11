import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, getFirestore } from 'firebase/firestore';
import DisputeForm from './DisputeForm';
import TransactionChat from './TransactionChat'; // 1. IMPORT IT HERE AT THE TOP

export default function EscrowTracker({ transactionId }) {
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [message, setMessage] = useState('');

  const db = getFirestore();

  useEffect(() => {
    const fetchTransaction = async () => {
      if (!transactionId) {
        setLoading(false);
        return;
      }
      try {
        const docRef = doc(db, 'escrowTransactions', transactionId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setTransaction({ id: docSnap.id, ...docSnap.data() });
        } else {
          setMessage('Transaction not found.');
        }
      } catch (error) {
        setMessage(`Error loading transaction: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [transactionId]);

  const handleConfirmDelivery = async () => {
    if (!window.confirm('Are you sure you want to release the escrow funds to the vendor? This action cannot be undone.')) {
      return;
    }

    try {
      const docRef = doc(db, 'escrowTransactions', transactionId);
      await updateDoc(docRef, {
        status: 'COMPLETED',
        releasedAt: new Date().toISOString()
      });
      setTransaction(prev => ({ ...prev, status: 'COMPLETED' }));
      setMessage('Funds successfully released to the vendor. Thank you!');
    } catch (error) {
      setMessage(`Error releasing funds: ${error.message}`);
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading escrow tracker...</div>;
  }

  const mockTransaction = transaction || {
    id: 'sample-tx-12345',
    productName: 'iPhone 13 Pro (Verified Device)',
    amount: '450,000 NGN',
    status: 'SHIPPED',
    vendorName: 'Bold Gadgets Store',
    createdAt: '2026-09-10'
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md border border-gray-100 my-8">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Escrow Tracker</h2>
          <p className="text-xs text-gray-400">ID: {mockTransaction.id}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
          mockTransaction.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
          mockTransaction.status === 'DISPUTED' ? 'bg-red-100 text-red-800' :
          'bg-orange-100 text-orange-800'
        }`}>
          {mockTransaction.status}
        </span>
      </div>

      {message && (
        <div className="mb-4 p-3 bg-blue-50 text-blue-800 text-sm rounded-lg font-medium">
          {message}
        </div>
      )}

      {/* Product Summary */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="font-semibold text-gray-800">{mockTransaction.productName}</h3>
        <p className="text-sm text-gray-600 mt-1">Vendor: {mockTransaction.vendorName}</p>
        <p className="text-lg font-bold text-slate-900 mt-2">{mockTransaction.amount}</p>
      </div>

      {/* Status Timeline / Steps */}
      <div className="space-y-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center text-xs">✓</div>
          <div>
            <p className="text-sm font-medium text-gray-800">Funds Secured in Escrow</p>
            <p className="text-xs text-gray-400">Money is held safely until you inspect the item.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
            ['SHIPPED', 'DELIVERED', 'COMPLETED'].includes(mockTransaction.status) ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
          }`}>✓</div>
          <div>
            <p className="text-sm font-medium text-gray-800">Item Dispatched / In Transit</p>
            <p className="text-xs text-gray-400">Vendor has shipped your order.</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
            ['COMPLETED'].includes(mockTransaction.status) ? 'bg-green-500 text-white' : 'bg-orange-500 text-white animate-pulse'
          }`}>●</div>
          <div>
            <p className="text-sm font-medium text-gray-800">Inspection & Release Window</p>
            <p className="text-xs text-gray-400">Inspect your item upon arrival. Confirm delivery or raise a dispute if there's an issue.</p>
          </div>
        </div>
      </div>

      {/* 2. DROP THE CHAT COMPONENT RIGHT HERE */}
      <TransactionChat transactionId={transactionId || 'sample-tx-12345'} />

      {/* Action Buttons */}
      {mockTransaction.status !== 'COMPLETED' && mockTransaction.status !== 'DISPUTED' && (
        <div className="flex gap-3 pt-4 border-t border-gray-100">
          <button 
            onClick={() => setShowDisputeModal(true)}
            className="flex-1 bg-red-50 text-red-600 border border-red-200 py-2.5 rounded-lg text-sm font-medium hover:bg-red-100 transition"
          >
            Report an Issue
          </button>
          <button 
            onClick={handleConfirmDelivery}
            className="flex-1 bg-green-600 text-white py-2.5 rounded-lg text-sm font-medium hover:bg-green-700 transition"
          >
            Confirm & Release Funds
          </button>
        </div>
      )}

      {mockTransaction.status === 'DISPUTED' && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-center text-sm text-red-700 font-medium">
          This transaction is currently under review by the mediation team. Funds are frozen.
        </div>
      )}

      {/* Dispute Modal */}
      {showDisputeModal && (
        <DisputeForm 
          transactionId={transactionId || 'sample-tx-12345'} 
          onClose={() => setShowDisputeModal(false)} 
        />
      )}
    </div>
  );
}