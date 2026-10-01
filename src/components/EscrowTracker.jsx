// src/components/EscrowTracker.jsx
import React from 'react';
import { STATUS_LABELS, ESCROW_STATUSES } from '../constants/escrowStates';

export default function EscrowTracker({ order, userRole, onUpdateStatus }) {
  const currentStatus = order?.status || ESCROW_STATUSES.PENDING_PAYMENT;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 my-4">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-bold text-gray-800 text-base">Escrow Transaction Status</h4>
        <span className="px-3 py-1 bg-blue-50 text-blue-700 font-semibold text-xs rounded-full">
          {STATUS_LABELS[currentStatus]}
        </span>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Item: <span className="font-semibold text-gray-800">{order?.productTitle}</span> | Amount: <span className="font-semibold text-blue-600">₦{Number(order?.amount || 0).toLocaleString()}</span>
      </p>

      {/* Action Buttons based on User Role & Status */}
      <div className="flex gap-3 flex-wrap border-t pt-4">
        {userRole === 'buyer' && currentStatus === ESCROW_STATUSES.PENDING_PAYMENT && (
          <button 
            onClick={() => onUpdateStatus(ESCROW_STATUSES.ESCROW_FUNDED)}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl transition"
          >
            Pay into Escrow (Secure)
          </button>
        )}

        {userRole === 'seller' && currentStatus === ESCROW_STATUSES.ESCROW_FUNDED && (
          <button 
            onClick={() => onUpdateStatus(ESCROW_STATUSES.SHIPPED_OR_READY)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition"
          >
            Mark as Shipped / Ready for Pickup
          </button>
        )}

        {userRole === 'buyer' && currentStatus === ESCROW_STATUSES.SHIPPED_OR_READY && (
          <button 
            onClick={() => onUpdateStatus(ESCROW_STATUSES.DELIVERED_INSPECTED)}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-xl transition"
          >
            Confirm Delivery & Inspect Item
          </button>
        )}

        {currentStatus === ESCROW_STATUSES.DELIVERED_INSPECTED && (
          <span className="text-xs text-green-600 font-medium">
            ✓ Inspection passed. Payout is being released to seller wallet.
          </span>
        )}
      </div>
    </div>
  );
}