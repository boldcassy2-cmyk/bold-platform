// src/services/escrowService.js
import { collection, addDoc, doc, updateDoc, getDoc, serverTimestamp } from "firebase/firestore";
// import { db } from "../firebaseConfig";
import { ESCROW_STATUSES } from "../constants/escrowStates";

/**
 * Creates a new escrow order when a buyer initiates a purchase
 */
export async function createEscrowOrder(orderData) {
  try {
    /* Uncomment when connected to Firestore:
    const docRef = await addDoc(collection(db, "orders"), {
      buyerId: orderData.buyerId,
      sellerId: orderData.sellerId,
      productId: orderData.productId,
      productTitle: orderData.productTitle,
      amount: orderData.amount,
      sellerType: orderData.sellerType, // 'merchant' or 'solo_seller'
      status: ESCROW_STATUSES.PENDING_PAYMENT,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { success: true, orderId: docRef.id };
    */
    console.log("Mock Order Created:", orderData);
    return { success: true, orderId: "mock_order_123" };
  } catch (error) {
    console.error("Error creating escrow order:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Updates the escrow order status (e.g., funding, shipping, confirming delivery)
 */
export async function updateOrderStatus(orderId, newStatus) {
  try {
    /* Uncomment when connected to Firestore:
    const orderRef = doc(db, "orders", orderId);
    await updateDoc(orderRef, {
      status: newStatus,
      updatedAt: serverTimestamp()
    });
    return { success: true };
    */
    console.log(`Order ${orderId} updated to status: ${newStatus}`);
    return { success: true };
  } catch (error) {
    console.error("Error updating order status:", error);
    return { success: false, error: error.message };
  }
}