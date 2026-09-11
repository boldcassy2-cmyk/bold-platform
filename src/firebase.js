import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCZTJ9K0c9CKshUoOXYRDAupR2w9yb8Lq4",
  authDomain: "bold-ng-platform-e77d1.firebaseapp.com",
  projectId: "bold-ng-platform-e77d1",
  storageBucket: "bold-ng-platform-e77d1.firebasestorage.app",
  messagingSenderId: "308013797746",
  appId: "1:308013797746:web:b0f88e394e047030eb0deb"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);