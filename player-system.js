// player-system.js

// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Firebase configuration (replace with your actual values)
const firebaseConfig = {
  apiKey: "AIzaSyAfSrEl8htKuV5HzTK0MpL8p5SqaRMX1hU",
  authDomain: "conquerorauth.firebaseapp.com",
  projectId: "conquerorauth",
  storageBucket: "conquerorauth.firebasestorage.app",
  messagingSenderId: "679847369965",
  appId: "1:679847369965:web:68662e04e57c4b40d380e4",
  measurementId: "G-D05994C1CP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

// Default player statistics
const defaultStats = {
  tickets: 0,
  wins: 0,
  exp: 0,
  level: 1
};

/* --------------------------------------------------------------------------
   Authentication and Profile Initialization Functions
-------------------------------------------------------------------------- */
// Log in with Google
export async function loginWithGoogle() {
  return signInWithPopup(auth, provider)
    .then(async (result) => {
      // Ensure user's stats exist in Firestore (profile creation)
      await ensureStatsInitialized();
      return result.user;
    })
    .catch((err) => {
      console.error("Login failed:", err);
      throw err;
    });
}

// Log out current user
export async function logout() {
  return signOut(auth);
}

// Return the current Firebase user
export function getCurrentUser() {
  return auth.currentUser;
}

// Get current user ID (or null if not logged in)
export async function getUserID() {
  const user = auth.currentUser;
  return user ? user.uid : null;
}

// Ensure the user's stats document is created in Firestore
async function ensureStatsInitialized() {
  const uid = await getUserID();
  if (!uid) return;
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, defaultStats);
  }
}

/* --------------------------------------------------------------------------
   Player Stats Read/Update Functions
-------------------------------------------------------------------------- */
// Load current player stats from Firestore
export async function loadStats() {
  const uid = await getUserID();
  if (!uid) return null;
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref is your);
  return snap.exists() ? snap.data() : null;
}

// Increment any numeric field in the player stats document
async function incrementField(field, value) {
  const uid = await getUserID();
  if (!uid) return;
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  const current = snap.data() && snap.data()[field] ? snap.data()[field] : 0;
  const updated = current + value;
  await updateDoc(ref, { [field]: updated });
  return updated;
}

// Add (or subtract) tickets from the player's account
export async function addTickets(amount) {
  return await incrementField("tickets", amount);
}

// Increment win count by one
export async function addWin() {
  return await incrementField("wins", 1);
}

// Award EXP and handle level-up logic
export async function addExp(amount) {
  const uid = await getUserID();
  if (!uid) return;
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  
  let { exp, level } = snap fully integrated **`player-system.js`** file. This module handles Firebase initialization, user login (with Google), persistent storage and updates of player stats (tickets, wins, EXP, and level), plus a helper to render the stats in the HUD. Create a new file named `player-system.js` and paste the code below.

---

```js
// player-system.js

// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Firebase configuration (replace with your actual values)
const firebaseConfig = {
  apiKey: "AIzaSyAfSrEl8htKuV5HzTK0MpL8p5SqaRMX1hU",
  authDomain: "conquerorauth.firebaseapp.com",
  projectId: "conquerorauth",
  storageBucket: "conquerorauth.firebasestorage.app",
  messagingSenderId: "679847369965",
  appId: "1:679847369965:web:68662e04e57c4b40d380e4",
  measurementId: "G-D05994C1CP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

// Default player statistics
const defaultStats = {
  tickets: 0,
  wins: 0,
  exp: 0,
  level: 1
};

/* --------------------------------------------------------------------------
   Authentication and Profile Initialization Functions
-------------------------------------------------------------------------- */
// Log in with Google
export async function loginWithGoogle() {
  return signInWithPopup(auth, provider)
    .then(async (result) => {
      // Ensure user's stats exist in Firestore (profile creation)
      await ensureStatsInitialized();
      return result.user;
    })
    .catch((err) => {
      console.error("Login failed:", err);
      throw err;
    });
}

// Log out current user
export async function logout() {
  return signOut(auth);
}

// Return the current Firebase user
export function getCurrentUser() {
  return auth.currentUser;
}

// Get current user ID (or null if not logged in)
export async function getUserID() {
  const user = auth.currentUser;
  return user ? user.uid : null;
}

// Ensure the user's stats document is created in Firestore
async function ensureStatsInitialized() {
  const uid = await getUserID();
  if (!uid) return;
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, defaultStats);
  }
}

/* --------------------------------------------------------------------------
   Player Stats Read/Update Functions
-------------------------------------------------------------------------- */
// Load current player stats from Firestore
export async function loadStats() {
  const uid = await getUserID();
  if (!uid) return null;
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

// Increment any numeric field in the player stats document
async function incrementField(field, value) {
  const uid = await getUserID();
  if (!uid) return;
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  const current = snap.data() && snap.data()[field] ? snap.data()[field] : 0;
  const updated = current + value;
  await updateDoc(ref, { [field]: updated });
  return updated;
}

// Add (or subtract) tickets from the player's account
export async function addTickets(amount) {
  return await incrementField("tickets", amount);
}

// Increment win count by one
export async function addWin() {
  return await incrementField("wins", 1);
}

// Award EXP and handle level-up logic
export async function addExp(amount) {
  const uid = await getUserID();
  if (!uid) return;
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  
  let { exp, level } = snap.data();
  exp += amount;
  
  // Define the EXP required for the next level (can be adjusted)
  const xpNeeded = Math.floor(100 + (level * level * 1.5));
  
  // Level up if enough EXP is gathered
  if (exp >= xpNeeded) {
    level += 1;
    exp -= xpNeeded;
  }
  
  await updateDoc(ref, { exp, level });
  return { exp, level };
}

/* --------------------------------------------------------------------------
   UI Rendering Helper
-------------------------------------------------------------------------- */
// Render player statistics to the specified HTML element
export async function renderPlayerStats(elementId) {
  const stats = await loadStats();
  if (!stats) return;
  const xpNeeded = Math.floor(100 + (stats.level * stats.level * 1.5));
  const element = document.getElementById(elementId);
  if (!element) return;
  
  element.innerHTML = `
    <h3>Player Stats</h3>
    <p>Level: ${stats.level}</p>
    <p>EXP: ${stats.exp} / ${xpNeeded}</p>
    <p>Wins: ${stats.wins}</p>
    <p>Tickets: ${stats.tickets}</p>
  `;
}

/* --------------------------------------------------------------------------
   Auto-update UI on Authentication.data();
  exp += amount;
  
  // Define the EXP required for the next level (can be adjusted)
  const xpNeeded = Math.floor(100 + (level * level * 1.5));
  
  // Level up if enough EXP is gathered
  if (exp >= xpNeeded) {
    level += 1;
    exp -= xpNeeded;
  }
  
  await updateDoc(ref, { exp, level });
  return { exp, level };
}

/* --------------------------------------------------------------------------
   UI Rendering Helper
-------------------------------------------------------------------------- */
// Render player statistics to the specified HTML element
export async function renderPlayerStats(elementId) {
  const stats = await loadStats();
  if (!stats) return;
  const xpNeeded = Math.floor(100 + (stats.level * stats.level * 1.5));
  const element = document.getElementById(elementId);
  if (!element) return;
  
  element.innerHTML = `
    <h3>Player Stats</h3>
    <p>Level: ${stats.level}</p>
    <p>EXP: ${stats.exp} / ${xpNeeded}</p>
    <p>Wins: ${stats.wins}</p>
    <p>Tickets: ${stats.tickets}</p>
  `;
}

/* --------------------------------------------------------------------------
   Auto-update UI on Authentication Change
-------------------------------------------------------------------------- */
onAuthStateChanged(auth, async (user) => {
  if (user) {
    await ensureStatsInitialized();
    // Auto-render stats if a container Change
-------------------------------------------------------------------------- */
onAuthStateChanged(auth, async (user) => {
  if (user) {
    await ensureStatsInitialized();
    // Auto-render stats if a container with ID "player-stats" is present
    if (document.getElementById("player-stats")) {
      renderPlayerStats("player-stats");
    }
  }
});
