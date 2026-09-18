// src/pages/SettlementsPage.jsx
import React, { useState } from 'react';
import TransactionList from '../components/TransactionList';
import SettlementDetail from '../components/SettlementDetail';

export default function SettlementsPage() {
  const [selectedTx, setSelectedTx] = useState(null);

  const mockTransactions = [
    { id: 'TX-908231', item: 'MacBook Pro M3 Max', merchant: 'Kano Tech Hub', purchaser: 'Dedon Cassidy', amount: '₦2,500,000', status: 'FUNDED' },
    { id: 'TX-908232', item: 'Sony FX3 Cinema Camera', merchant: 'Lagos Lens Co', purchaser: 'Dedon Cassidy', amount: '₦1,850,000', status: 'RELEASED' },
    { id: 'TX-908233', item: 'DJI Mavic 3 Pro', merchant: 'Abuja Drones Store', purchaser: 'Dedon Cassidy', amount: '₦1,200,000', status: 'DISPUTED' },
  ];

  const handleResolveIssue = (txId, action) => {
    alert(`Action '${action}' triggered for transaction ${txId}. Routed to dispute/support handling workflow.`);
    setSelectedTx(null);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Escrow & Settlement Management</h1>
      {!selectedTx ? (
        <TransactionList 
          transactions={mockTransactions} 
          onSelectTransaction={(tx) => setSelectedTx(tx)} 
        />
      ) : (
        <SettlementDetail 
          transaction={selectedTx} 
          onBack={() => setSelectedTx(null)} 
          onResolveIssue={handleResolveIssue}
        />
      )}
    </div>
  );
}