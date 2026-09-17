import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';

export default function FinanceDashboard() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch orders/transactions from Firestore
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'escrow_transactions'));
        const txs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setTransactions(txs);
      } catch (error) {
        console.error("Error fetching escrow vault:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const handleVerifyPayment = async (txId) => {
    try {
      const txRef = doc(db, 'escrow_transactions', txId);
      await updateDoc(txRef, { status: 'Escrow Locked & Verified' });
      setTransactions(prev => prev.map(tx => tx.id === txId ? { ...tx, status: 'Escrow Locked & Verified' } : tx));
      alert(`Transaction ${txId} verified and locked in vault successfully.`);
    } catch (error) {
      alert("Failed to update status. Check permissions.");
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-400">Loading Finance Vault...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="bg-[#16223F] p-6 rounded-2xl border border-slate-800 shadow-xl flex justify-between items-center">
        <div>
          <h1 className="text-xl font-black text-white">💰 Finance & Escrow Vault</h1>
          <p className="text-xs text-slate-400 mt-1">Manage direct bank transfers, verify deposits, and oversee safe vendor settlements.</p>
        </div>
        <div className="bg-[#FF5A00] text-white text-xs font-bold px-4 py-2 rounded-xl">
          Authorized Desk: Finance
        </div>
      </div>

      <div className="bg-[#16223F] rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 font-bold text-sm text-slate-200">
          Pending & Active Escrow Ledgers
        </div>
        {transactions.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">No active escrow transactions found in the vault.</div>
        ) : (
          <div className="divide-y divide-slate-800">
            {transactions.map((tx) => (
              <div key={tx.id} className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-slate-900/40 transition-colors">
                <div>
                  <div className="text-xs font-mono text-[#FF5A00] font-bold">{tx.id}</div>
                  <div className="text-sm font-bold text-white mt-0.5">{tx.title || 'Escrow Item'}</div>
                  <div className="text-xs text-slate-400 mt-1">Amount: <span className="text-white font-bold">₦{(tx.amount || 0).toLocaleString()}</span> | Status: <span className="text-amber-400">{tx.status || 'Pending'}</span></div>
                </div>
                <div>
                  {tx.status !== 'Escrow Locked & Verified' && (
                    <button 
                      type="button"
                      onClick={() => handleVerifyPayment(tx.id)}
                      className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-4 py-2 rounded-xl transition-colors cursor-pointer"
                    >
                      ✓ Verify & Lock in Vault
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}