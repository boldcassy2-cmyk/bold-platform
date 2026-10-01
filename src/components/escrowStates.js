// src/constants/escrowStates.js

export const ESCROW_STATUSES = {
  PENDING_PAYMENT: "pending_payment",
  ESCROW_FUNDED: "escrow_funded",
  SHIPPED_OR_READY: "shipped_or_ready",
  DELIVERED_INSPECTED: "delivered_inspected",
  COMPLETED: "completed",
  DISPUTED: "disputed",
  CANCELLED: "cancelled"
};

export const STATUS_LABELS = {
  [ESCROW_STATUSES.PENDING_PAYMENT]: "Pending Payment",
  [ESCROW_STATUSES.ESCROW_FUNDED]: "Escrow Funded (Secure)",
  [ESCROW_STATUSES.SHIPPED_OR_READY]: "Shipped / Ready for Pickup",
  [ESCROW_STATUSES.DELIVERED_INSPECTED]: "Delivered & Inspected",
  [ESCROW_STATUSES.COMPLETED]: "Completed & Released",
  [ESCROW_STATUSES.DISPUTED]: "Under Dispute",
  [ESCROW_STATUSES.CANCELLED]: "Cancelled"
};