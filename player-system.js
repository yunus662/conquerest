// player-system.js

// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Firebase configuration (update these values as needed)
const firebaseConfig = {
  apiKey: "AIzaSyAfSrEl8htKuV5HzTK0MpL8p5SqaRMX1hU",
  authDomain: "conquerorauth.firebaseapp.com",
  projectId: "conquerorauth",
  storageBucket: "conquerorauth.firebasestorage.app",
  messagingSenderId: "679847369965",
  appId: "1:679847369965:web:68662e04e57c4b40d380e4",
  measurementId: "G-D05994C1CP",
};

// Initialize Firebase app and services
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

// Default Player Statistics
const defaultStats = {
  tickets: 0,
  wins: 0,
  exp: 0,
  level: 1,
};

// --------------------------------------------------------------------------
// Authentication and Profile Initialization
// --------------------------------------------------------------------------

/**
 * Logs in a user using Google authentication.
 * After a successful login, ensures that the user's stats document is initialized.
 */
export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, provider);
    await ensureStatsInitialized();
    return result.user;
  } catch (error) {
    console.error("loginWithGoogle error:", error);
    throw error;
  }
}

/**
 * Logs out the current user.
 */
export async function logout() {
  return signOut(auth);
}

/**
 * Returns the current Firebase user.
 */
export function getCurrentUser() {
  return auth.currentUser;
}

/**
 * Returns the UID of the current user, or null if not logged in.
 */
export async function getUserID() {
  const user = auth.currentUser;
  return user ? user.uid : null;
}

/**
 * Ensures that a Firestore document for the user exists; if not, creates one with default stats.
 */
async function ensureStatsInitialized() {
  const uid = await getUserID();
  if (!uid) return;
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) {
    await setDoc(ref, defaultStats);
  }
}

// --------------------------------------------------------------------------
// Player Stats Operations
// --------------------------------------------------------------------------

/**
 * Loads the current player's stats from Firestore.
 * @returns {Object|null} The user's stats if available.
 */
export async function loadStats() {
  const uid = await getUserID();
  if (!uid) return null;
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

/**
 * Helper function to increment a numeric field in the user's stats document.
 */
async function incrementField(field, value) {
  const uid = await getUserID();
  if (!uid) return;
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  const current = snap.data()?.[field] || 0;
  const updated = current + value;
  await updateDoc(ref, { [field]: updated });
  return updated;
}

/**
 * Adds (or subtracts) a given ticket amount.
 */
export async function addTickets(amount) {
  return await incrementField("tickets", amount);
}

/**
 * Increments the win count by one.
 */
export async function addWin() {
  return await incrementField("wins", 1);
}

/**
 * Adds EXP to the user and handles level-up logic.
 * On level-up, the EXP is reduced by the required threshold.
 */
export async function addExp(amount) {
  const uid = await getUserID();
  if (!uid) return;
  const ref = doc(db, "users", uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  let { exp, level } = snap.data();
  exp += amount;

  // Experience required for next level (basic formula)
  const xpNeeded = Math.floor(100 + Math.pow(level, 2) * 1.5);

  if (exp >= xpNeeded) {
    level += 1;
    exp = exp - xpNeeded;
  }
  
  await updateDoc(ref, { exp, level });
  return { exp, level };
}

/**
 * Renders the player's statistics into an HTML element with the given ID.
 */
export async function renderPlayerStats(elementId) {
  const stats = await loadStats();
  if (!stats) return;
  const xpNeeded = Math.floor(100 + Math.pow(stats.level, 2) * 1.5);
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

// --------------------------------------------------------------------------
// Auto Update on Authentication Change
// --------------------------------------------------------------------------

onAuthStateChanged(auth, async (user) => {
  if (user) {
    await ensureStatsInitialized();
    const statsContainer = document.getElementById("player-stats");
    if (statsContainer) {
      renderPlayerStats("player-stats");
    }
  }
});
