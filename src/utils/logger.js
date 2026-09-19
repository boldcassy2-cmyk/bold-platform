import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export const logAppActivity = async (user, actionType, details = {}) => {
  try {
    if (!db) return;
    await addDoc(collection(db, 'app_telemetry'), {
      userId: user?.uid || 'anonymous',
      email: user?.email || 'guest',
      action: actionType, // e.g., 'PAGE_VIEW', 'LOGIN', 'LOGOUT', 'CART_ABANDONMENT', 'CHECKOUT_FAIL'
      details: details,
      timestamp: serverTimestamp(),
      clientLocalDateTime: new Date().toISOString()
    });
  } catch (error) {
    console.error("Telemetry Logging Error:", error);
  }
};