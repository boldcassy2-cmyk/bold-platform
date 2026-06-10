import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth"; // 🔐 Added Authentication Core




const firebaseConfig = {
  apiKey: "AIzaSyCsnngd0Z1b3TY6EGjjNbiPkM_2cFBj5RU",
  authDomain: "bold-ng-platform.firebaseapp.com",
  projectId: "bold-ng-platform",
  storageBucket: "bold-ng-platform.firebasestorage.app",
  messagingSenderId: "648684583976",
  appId: "1:648684583976:web:ad48791e2088c35656c91d"
};
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app); // 🔐 Exported for your custom forms

export default app;