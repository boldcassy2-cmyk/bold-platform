// src/components/SettlementDetail.jsx
import React from 'react';

export default function SettlementDetail({ transaction, onBack, onResolveIssue }) {
  if (!transaction) return null;

  return (
    <div className="bg-white border rounded-lg p-6 shadow-md max-w-xl mx-auto">
      <button onClick={onBack} className="text-sm text-gray-500 hover:underline mb-4">
        ← Back to Transactions
      </button>
      
      <h2 className="text-xl font-bold text-gray-900 mb-2">Settlement Details: {transaction.id}</h2>
      <p className="text-lg font-medium text-gray-800 mb-4">{transaction.item}</p>
      
      <div className="space-y-2 mb-6 border-t border-b py-4">
        <p><span className="font-semibold">Merchant:</span> {transaction.merchant}</p>
        <p><span className="font-semibold">Purchaser:</span> {transaction.purchaser}</p>
        <p><span className="font-semibold">Amount:</span> {transaction.amount}</p>
        <p><span className="font-semibold">Current Status:</span> <span className="uppercase text-orange-600 font-bold">{transaction.status}</span></p>
      </div>

      <div className="flex gap-4">
        {transaction.status === 'DISPUTED' ? (
          <button 
            onClick={() => onResolveIssue(transaction.id, 'escalate')}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
          >
            Escalate to Support Team
          </button>
        ) : (
          <button 
            onClick={() => onResolveIssue(transaction.id, 'release')}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
          >
            Release Funds to Merchant
          </button>
        )}
      </div>
    </div>
  );
}