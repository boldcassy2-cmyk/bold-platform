import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCsnngd0Z1b3TY6EGjjNbiPkM_2cFBj5RU",
  authDomain: "bold-ng-platform.firebaseapp.com",
  projectId: "bold-ng-platform",
  storageBucket: "bold-ng-platform.firebasestorage.app",
  messagingSenderId: "648684583976",
  appId: "1:648684583976:web:ad48791e2088c35656c91d"
};

// Initialize Firebase App instance
const app = initializeApp(firebaseConfig);

// Export Authentication and Firestore database services
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;