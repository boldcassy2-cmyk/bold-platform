import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import EscrowProcessor from './EscrowProcessor';

export default function EscrowDashboard({ currentUser, setCurrentPage }) {
  const [transactions, setTransactions] = useState([]);
  const [selectedTx, setSelectedTx] = useState(null);
  const [activeTab, setActiveTab] = useState('ALL');
  const [loading, setLoading] = useState(true);

  // Mock initial dataset for testing UI before Firebase connection
  const mockTransactions = [
    {
      id: 'TX-908231',
      itemTitle: 'MacBook Pro M3 Max',
      amount: 2500000,
      seller: 'Kano Tech Hub',
      buyer: currentUser?.displayName || 'Dedon Cassidy',
      status: 'FUNDED',
      dateCreated: '2026-08-24',
      inspectionWindowDays: 3,
    },
    {
      id: 'TX-908232',
      itemTitle: 'Sony FX3 Cinema Camera',
      amount: 1850000,
      seller: 'Lagos Lens Co',
      buyer: currentUser?.displayName || 'Dedon Cassidy',
      status: 'RELEASED',
      dateCreated: '2026-08-21',
      inspectionWindowDays: 2,
    },
    {
      id: 'TX-908233',
      itemTitle: 'DJI Mavic 3 Pro',
      amount: 1200000,
      seller: 'Abuja Drones Store',
      buyer: currentUser?.displayName || 'Dedon Cassidy',
      status: 'DISPUTED',
      disputeReason: 'Item arrived with damaged gimbal motor.',
      dateCreated: '2026-08-19',
      inspectionWindowDays: 5,
    },
  ];

  // Real-time Firestore Listener
  useEffect(() => {
    if (!currentUser?.uid) {
      setTransactions(mockTransactions);
      setLoading(false);
      return;
    }

    // Query active escrow records where user is buyer
    const q = query(
      collection(db, 'escrow_transactions'),
      where('buyerId', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const txList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        // If user has no live transactions yet, gracefully fallback to mock dataset for development preview
        setTransactions(txList.length > 0 ? txList : mockTransactions);
        setLoading(false);
      },
      (error) => {
        console.error('Real-time listener error:', error);
        setTransactions(mockTransactions);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  // Handler to sync transaction state update locally
  const handleTransactionUpdated = (updatedTx) => {
    setTransactions((prev) =>
      prev.map((tx) => (tx.id === updatedTx.id ? updatedTx : tx))
    );
    setSelectedTx(updatedTx);
  };

  // Filter transactions based on active status tab
  const filteredTransactions = transactions.filter((tx) => {
    if (activeTab === 'ALL') return true;
    return tx.status === activeTab;
  });

  // Calculate high-level vault statistics safely
  const totalVaulted = transactions
    .filter((tx) => tx.status === 'FUNDED')
    .reduce((sum, tx) => sum + Number(tx.amount || tx.price || 0), 0);

  const totalSettled = transactions
    .filter((tx) => tx.status === 'RELEASED')
    .reduce((sum, tx) => sum + Number(tx.amount || tx.price || 0), 0);

  // If a specific transaction is selected, show the EscrowProcessor node
  if (selectedTx) {
    return (
      <EscrowProcessor
        transaction={selectedTx}
        onTransactionUpdated={handleTransactionUpdated}
        setCurrentPage={() => setSelectedTx(null)}
      />
    );
  }

  return (
    <div className="max-w-6xl mx-auto my-8 px-4 text-white text-left selection:bg-[#FF5A00]">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white">Escrow Control Dashboard</h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time telemetry and state manager for locked buyer and seller vaults.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCurrentPage && setCurrentPage('marketplace')}
          className="self-start md:self-auto text-xs font-bold uppercase tracking-wider bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-xl border border-slate-700 transition-all cursor-pointer border-none"
        >
          ← Marketplace
        </button>
      </div>

      {/* Analytics Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#16223F] border border-slate-800 rounded-2xl p-5 shadow-lg">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Locked in Escrow
          </span>
          <p className="text-2xl font-black text-[#FF5A00] font-mono mt-1">
            ₦{totalVaulted.toLocaleString()}
          </p>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Active inspection window</span>
        </div>

        <div className="bg-[#16223F] border border-slate-800 rounded-2xl p-5 shadow-lg">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Total Settled
          </span>
          <p className="text-2xl font-black text-emerald-400 font-mono mt-1">
            ₦{totalSettled.toLocaleString()}
          </p>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Completed transfers</span>
        </div>

        <div className="bg-[#16223F] border border-slate-800 rounded-2xl p-5 shadow-lg">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            Active Disputes
          </span>
          <p className="text-2xl font-black text-amber-400 font-mono mt-1">
            {transactions.filter((tx) => tx.status === 'DISPUTED').length}
          </p>
          <span className="text-[11px] text-slate-500 mt-0.5 block">Cases undergoing review</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 mb-6 overflow-x-auto">
        {['ALL', 'FUNDED', 'RELEASED', 'DISPUTED'].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`text-xs font-bold uppercase tracking-wider px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap border-none ${
              activeTab === tab
                ? 'bg-[#FF5A00] text-white shadow-md shadow-[#FF5A00]/20'
                : 'bg-[#16223F]/50 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {tab === 'ALL' ? 'All Orders' : tab}
          </button>
        ))}
      </div>

      {/* Real-time Order Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs text-slate-500 font-mono animate-pulse">
          Synchronizing active vault states...
        </div>
      ) : filteredTransactions.length === 0 ? (
        <div className="bg-[#16223F]/40 border border-slate-800/80 rounded-3xl p-12 text-center">
          <p className="text-sm font-bold text-slate-400">No transactions match this filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTransactions.map((tx) => (
            <div
              key={tx.id}
              onClick={() => setSelectedTx(tx)}
              className="bg-[#16223F] hover:bg-[#1c2b4e] border border-slate-800 rounded-2xl p-5 shadow-xl transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block">{tx.id}</span>
                  <h3 className="text-base font-bold text-white group-hover:text-[#FF5A00] transition-colors mt-0.5">
                    {tx.itemTitle || tx.title || 'Marketplace Asset'}
                  </h3>
                </div>
                <StatusBadge status={tx.status} />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs border-y border-slate-800/80 py-3 my-1">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Merchant</span>
                  <span className="text-slate-300 font-medium block truncate">{tx.seller || 'Verified Merchant'}</span>
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] uppercase font-bold block">Purchaser</span>
                  <span className="text-slate-300 font-medium block truncate">{tx.buyer || currentUser?.displayName || 'Dedon Cassidy'}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <div>
                  <span className="text-[10px] font-mono text-slate-500 block">Amount</span>
                  <span className="text-lg font-black text-white font-mono">
                    ₦{Number(tx.amount || tx.price || 0).toLocaleString()}
                  </span>
                </div>
                <span className="text-xs font-bold text-[#FF5A00] flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Manage Settlement →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Sub-component: Status Badges
const StatusBadge = ({ status }) => {
  const styles = {
    FUNDED: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    RELEASED: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    DISPUTED: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  };

  return (
    <span
      className={`text-[10px] font-mono border px-2.5 py-1 rounded-md font-bold uppercase tracking-wider ${
        styles[status] || 'bg-slate-800 text-slate-400 border-slate-700'
      }`}
    >
      {status || 'PENDING'}
    </span>
  );
};