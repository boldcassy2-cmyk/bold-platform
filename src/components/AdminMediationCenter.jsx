import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc, getFirestore } from 'firebase/firestore';

export default function AdminMediationCenter() {
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  
  const db = getFirestore();

  // Fetch all transactions that are currently DISPUTED
  const fetchDisputes = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, 'escrowTransactions'), where('status', '==', 'DISPUTED'));
      const querySnapshot = await getDocs(q);
      const disputeList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDisputes(disputeList);
    } catch (error) {
      setMessage(`Error loading disputes: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisputes();
  }, []);

  // Admin resolution action: Refund Buyer or Release to Vendor
  const handleResolveDispute = async (transactionId, decision) => {
    const actionText = decision === 'REFUND' ? 'refund the buyer' : 'release funds to the vendor';
    if (!window.confirm(`Are you sure you want to ${actionText}? This decision is final.`)) {
      return;
    }

    try {
      const transactionRef = doc(db, 'escrowTransactions', transactionId);
      
      const newStatus = decision === 'REFUND' ? 'REFUNDED' : 'COMPLETED';
      
      await updateDoc(transactionRef, {
        status: newStatus,
        'disputeDetails.resolved': true,
        'disputeDetails.resolvedAt': new Date().toISOString(),
        'disputeDetails.resolutionDecision': decision
      });

      setMessage(`Dispute successfully resolved as: ${newStatus}`);
      // Refresh the list
      fetchDisputes();
    } catch (error) {
      setMessage(`Error resolving dispute: ${error.message}`);
    }
  };

  if (loading) {
    return <div className="p-6 text-center text-gray-500">Loading active disputes...</div>;
  }

  // Mock dispute data for UI testing if database is empty
  const activeDisputes = disputes.length > 0 ? disputes : [
    {
      id: 'tx-sample-987',
      productName: 'HP Core i7 Laptop (Refurbished)',
      amount: '280,000 NGN',
      vendorName: 'Lagos Tech Hub',
      buyerEmail: 'buyer@example.com',
      disputeDetails: {
        reason: 'Damaged or defective',
        description: 'The screen has a visible crack on arrival and won’t charge past 10%.',
        raisedAt: '2026-09-10'
      }
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md border border-gray-100 my-8">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Admin Mediation Center</h2>
          <p className="text-xs text-gray-400">Review and arbitrate frozen escrow transactions</p>
        </div>
        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-semibold">
          {activeDisputes.length} Active Dispute(s)
        </span>
      </div>

      {message && (
        <div className="mb-4 p-3 bg-blue-50 text-blue-800 text-sm rounded-lg font-medium">
          {message}
        </div>
      )}

      {activeDisputes.length === 0 ? (
        <div className="text-center py-12 text-gray-400 text-sm">
          No active disputes require mediation right now. All escrows are running smoothly!
        </div>
      ) : (
        <div className="space-y-6">
          {activeDisputes.map((item) => (
            <div key={item.id} className="border border-red-100 bg-red-50/30 rounded-xl p-5 shadow-sm">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-3 pb-3 border-b border-gray-200">
                <div>
                  <h3 className="font-bold text-gray-900">{item.productName}</h3>
                  <p className="text-xs text-gray-500">Transaction ID: {item.id} | Amount: <span className="font-semibold text-slate-900">{item.amount}</span></p>
                </div>
                <div className="text-xs bg-white px-2.5 py-1 rounded border border-gray-200 text-gray-600">
                  Vendor: {item.vendorName || 'N/A'}
                </div>
              </div>

              {/* Dispute Details Box */}
              <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4 space-y-2">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Raised by: {item.buyerEmail || 'Buyer'}</span>
                  <span>Date: {item.disputeDetails?.raisedAt || 'Recent'}</span>
                </div>
                <div>
                  <span className="inline-block bg-red-100 text-red-700 text-xs font-semibold px-2 py-0.5 rounded mb-1">
                    Reason: {item.disputeDetails?.reason}
                  </span>
                  <p className="text-sm text-gray-700 mt-1 bg-gray-50 p-3 rounded border border-gray-100">
                    "{item.disputeDetails?.description}"
                  </p>
                </div>
              </div>

              {/* Action Buttons for CEO / Admin */}
              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <button 
                  onClick={() => handleResolveDispute(item.id, 'REFUND')}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
                >
                  Refund Buyer
                </button>
                <button 
                  onClick={() => handleResolveDispute(item.id, 'RELEASE')}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition shadow-sm"
                >
                  Release to Vendor
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}