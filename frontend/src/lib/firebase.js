// src/lib/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB_qrpQrJ3qeycNSPv9deBNBdQMmB3HGQ4",
  authDomain: "job-portal-992.firebaseapp.com",
  projectId: "job-portal-992",
  storageBucket: "job-portal-992.firebasestorage.app",
  messagingSenderId: "813709301039",
  appId: "1:813709301039:web:fbd1f9ddf6bbcd3f66bdda",
  measurementId: "G-KYHHTYN335"
};

export const app = initializeApp(firebaseConfig);

// Optional: Only use analytics if the browser supports it
try {
  getAnalytics(app);
} catch (e) {
  console.log("Analytics not supported in this environment");
}
