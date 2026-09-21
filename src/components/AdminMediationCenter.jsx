import React, { useState } from 'react';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';

export default function AdminMediationCenter({ transactions = [], setTransactions }) {
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [resolutionNote, setResolutionNote] = useState('');
  const [message, setMessage] = useState('');

  // Filter transactions flagged for dispute or escrow vault intervention
  const disputes = transactions.filter(t => t.status === 'Disputed' || t.status === 'In Escrow Vault');

  const handleResolve = async (txId, decision) => {
    const updatedStatus = decision === 'release' ? 'Completed' : 'REFUNDED';
    const actionText = decision === 'release' ? 'release funds to the merchant' : 'refund the buyer';

    if (!window.confirm(`Are you sure you want to ${actionText}? This decision is final.`)) {
      return;
    }

    try {
      if (db) {
        const transactionRef = doc(db, 'escrowTransactions', txId);
        await updateDoc(transactionRef, {
          status: updatedStatus,
          resolutionNote,
          'disputeDetails.resolved': true,
          'disputeDetails.resolvedAt': new Date().toISOString(),
          'disputeDetails.resolutionDecision': decision.toUpperCase()
        });
      }

      // Update parent state
      if (setTransactions) {
        setTransactions(prev =>
          prev.map(t => (t.id === txId ? { ...t, status: updatedStatus, resolutionNote } : t))
        );
      }

      setMessage(`Dispute successfully resolved as: ${updatedStatus}`);
      setSelectedDispute(null);
      setResolutionNote('');
    } catch (error) {
      console.warn('Firestore update failed, updating local state only:', error);
      if (setTransactions) {
        setTransactions(prev =>
          prev.map(t => (t.id === txId ? { ...t, status: updatedStatus, resolutionNote } : t))
        );
      }
      setMessage(`Dispute resolved locally: ${updatedStatus}`);
      setSelectedDispute(null);
      setResolutionNote('');
    }
  };

  return (
    <div className="bg-[#16223F] border border-slate-800 rounded-2xl p-6 text-white space-y-6 max-w-5xl mx-auto my-8 shadow-2xl">
      <div className="flex justify-between items-center border-b border-slate-700 pb-4">
        <div>
          <h2 className="text-xl font-black uppercase tracking-tight">⚖️ Executive Mediation Center</h2>
          <p className="text-xs text-slate-400 font-mono">Review and arbitrate frozen escrow transactions</p>
        </div>
        <span className="bg-amber-500/20 text-amber-400 text-xs font-mono px-3 py-1.5 rounded-full border border-amber-500/30">
          {disputes.length} Active Dispute(s)
        </span>
      </div>

      {message && (
        <div className="p-3 bg-blue-950/40 border border-blue-500/50 rounded-xl text-blue-400 text-xs font-semibold">
          ℹ️ {message}
        </div>
      )}

      {disputes.length === 0 ? (
        <div className="text-center py-12 text-slate-400 text-sm font-mono">
          ✅ No active vault disputes requiring executive intervention. All escrows are running smoothly!
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Dispute List */}
          <div className="space-y-3">
            {disputes.map((tx) => (
              <div
                key={tx.id}
                onClick={() => setSelectedDispute(tx)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedDispute?.id === tx.id
                    ? 'border-[#FF5A00] bg-[#0B132B] shadow-[0_0_15px_rgba(255,90,0,0.2)]'
                    : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-mono text-xs text-[#FF5A00] font-bold">{tx.id}</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {tx.status}
                  </span>
                </div>
                <p className="font-bold text-sm">{tx.title || tx.productName}</p>
                <p className="text-xs text-slate-400 mt-1 font-mono">
                  Amount: ₦{Number(tx.amount || 0).toLocaleString()} | Vendor: {tx.vendorName || 'Bold Partner'}
                </p>
              </div>
            ))}
          </div>

          {/* Selected Dispute Case Inspector */}
          {selectedDispute ? (
            <div className="bg-[#0B132B] border border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-bold text-xs text-amber-400 font-mono">Case File: {selectedDispute.id}</h3>
                <span className="text-[10px] text-slate-400 font-mono">Raised: {selectedDispute.disputeDetails?.raisedAt || 'Recent'}</span>
              </div>
              <p className="text-sm font-semibold">{selectedDispute.title || selectedDispute.productName}</p>
              
              {/* Dispute Reason Box */}
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 space-y-1">
                <span className="inline-block bg-red-950/60 text-red-400 text-[10px] font-semibold px-2 py-0.5 rounded border border-red-500/30">
                  Reason: {selectedDispute.disputeDetails?.reason || 'Defective / Item Mismatch'}
                </span>
                <p className="text-xs text-slate-300 italic">
                  "{selectedDispute.disputeDetails?.description || 'Buyer reported issue with item condition upon arrival.'}"
                </p>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Executive Ruling Note</label>
                <textarea
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  placeholder="Document inspection findings or arbitration reason..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs text-white focus:outline-none focus:border-[#FF5A00]"
                  rows="3"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleResolve(selectedDispute.id, 'release')}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black py-3 rounded-xl cursor-pointer transition-colors shadow-sm"
                >
                  Release to Vendor
                </button>
                <button
                  type="button"
                  onClick={() => handleResolve(selectedDispute.id, 'refund')}
                  className="flex-1 bg-red-600 hover:bg-red-500 text-white text-xs font-black py-3 rounded-xl cursor-pointer transition-colors shadow-sm"
                >
                  Refund Buyer
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-[#0B132B]/50 border border-dashed border-slate-800 rounded-xl flex items-center justify-center p-8 text-center text-xs text-slate-500 font-mono">
              Select a transaction case from the left to inspect and issue a ruling.
            </div>
          )}
        </div>
      )}
    </div>
  );
}