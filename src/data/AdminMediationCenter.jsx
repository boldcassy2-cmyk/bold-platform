import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, updateDoc, doc } from 'firebase/firestore';

export default function AdminMediationCenter({ transactions = [], setTransactions }) {
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [resolutionNote, setResolutionNote] = useState('');

  // Filter or mock disputes from transactions flagged for escrow/mediation
  const disputes = transactions.filter(t => t.status === 'Disputed' || t.status === 'In Escrow Vault');

  const handleResolve = async (txId, decision) => {
    try {
      const updatedStatus = decision === 'release' ? 'Released to Merchant' : 'Refunded to Buyer';
      if (db) {
        await updateDoc(doc(db, 'transactions', txId), { status: updatedStatus, resolutionNote });
      }
      setTransactions(prev =>
        prev.map(t => (t.id === txId ? { ...t, status: updatedStatus, resolutionNote } : t))
      );
      setSelectedDispute(null);
      setResolutionNote('');
    } catch (error) {
      console.warn('Firestore update failed, updating local state only:', error);
      setTransactions(prev =>
        prev.map(t => (t.id === txId ? { ...t, status: decision === 'release' ? 'Released to Merchant' : 'Refunded to Buyer', resolutionNote } : t))
      );
      setSelectedDispute(null);
      setResolutionNote('');
    }
  };

  return (
    <div className="bg-[#16223F] border border-slate-800 rounded-2xl p-6 text-white space-y-6">
      <div className="flex justify-between items-center border-b border-slate-700 pb-4">
        <div>
          <h2 className="text-xl font-black uppercase tracking-tight">⚖️ Executive Mediation Center</h2>
          <p className="text-xs text-slate-400 font-mono">Resolve disputed escrow releases & inspection logs</p>
        </div>
        <span className="bg-amber-500/20 text-amber-400 text-xs font-mono px-3 py-1.5 rounded-full border border-amber-500/30">
          {disputes.length} Active Queue
        </span>
      </div>

      {disputes.length === 0 ? (
        <div className="text-center py-12 text-slate-400 text-sm font-mono">
          ✅ No active vault disputes requiring executive intervention.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            {disputes.map((tx) => (
              <div
                key={tx.id}
                onClick={() => setSelectedDispute(tx)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedDispute?.id === tx.id
                    ? 'border-[#FF5A00] bg-[#0B132B]'
                    : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-mono text-xs text-[#FF5A00] font-bold">{tx.id}</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {tx.status}
                  </span>
                </div>
                <p className="font-bold text-sm">{tx.title}</p>
                <p className="text-xs text-slate-400 mt-1 font-mono">Amount: ₦{Number(tx.amount || 0).toLocaleString()}</p>
              </div>
            ))}
          </div>

          {selectedDispute ? (
            <div className="bg-[#0B132B] border border-slate-800 rounded-xl p-5 space-y-4">
              <h3 className="font-bold text-sm text-amber-400 font-mono">Case File: {selectedDispute.id}</h3>
              <p className="text-sm font-semibold">{selectedDispute.title}</p>
              
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
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black py-2.5 rounded-xl cursor-pointer transition-colors"
                >
                  Release Funds to Merchant
                </button>
                <button
                  type="button"
                  onClick={() => handleResolve(selectedDispute.id, 'refund')}
                  className="flex-1 bg-red-600 hover:bg-red-500 text-white text-xs font-black py-2.5 rounded-xl cursor-pointer transition-colors"
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