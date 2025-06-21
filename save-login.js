// save-login.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// ✅ Replace with your actual config
const firebaseConfig = {
  apiKey: "AIzaSyAfSrEl8htKuV5HzTK0MpL8p5SqaRMX1hU",
  authDomain: "conquerorauth.firebaseapp.com",
  projectId: "conquerorauth",
  storageBucket: "conquerorauth.firebasestorage.app",
  messagingSenderId: "679847369965",
  appId: "1:679847369965:web:68662e04e57c4b40d380e4",
  measurementId: "G-D05994C1CP"
};

// 🚀 Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// 👉 Call this to trigger Google login
export function loginWithGoogle() {
  return signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      console.log("✅ Logged in:", user.displayName);
      return user;
    })
    .catch((err) => {
      console.error("Login failed", err);
    });
}

// 👉 Call to log out
export function logout() {
  return signOut(auth);
}

// Returns user info
export function getCurrentUser() {
  return auth.currentUser;
}

export function getUserID() {
  return auth.currentUser?.uid || null;
}

// 👀 Run logic on login state changes
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log(`🔐 Signed in as ${user.displayName}`);
    // You could fetch their tickets/stats here
  } else {
    console.log("🚪 Not signed in.");
  }
});
