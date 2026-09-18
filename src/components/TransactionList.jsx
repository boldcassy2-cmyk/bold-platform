// src/components/TransactionList.jsx
import React from 'react';

export default function TransactionList({ transactions, onSelectTransaction }) {
  return (
    <div className="space-y-4">
      {transactions.map((tx) => (
        <div key={tx.id} className="border p-4 rounded-lg shadow-sm bg-white flex justify-between items-center">
          <div>
            <p className="font-semibold text-gray-800">{tx.item}</p>
            <p className="text-sm text-gray-500">Merchant: {tx.merchant}</p>
            <p className="text-sm font-medium text-gray-700">Amount: {tx.amount}</p>
            <span className={`inline-block px-2 py-1 text-xs rounded mt-1 ${
              tx.status === 'FUNDED' ? 'bg-blue-100 text-blue-800' :
              tx.status === 'RELEASED' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {tx.status}
            </span>
          </div>
          <button 
            onClick={() => onSelectTransaction(tx)}
            className="text-orange-600 hover:text-orange-800 font-medium text-sm border border-orange-600 px-3 py-1.5 rounded-md hover:bg-orange-50 transition"
          >
            Manage Settlement →
          </button>
        </div>
      ))}
    </div>
  );
}