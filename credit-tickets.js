// credit-tickets.js

import { getFirestore, doc, getDoc, setDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const db = getFirestore();
const auth = getAuth();

// 🔧 Default player stats
const defaultStats = {
  tickets: 0,
  wins: 0,
  exp: 0,
  level: 1
};

// 📌 Load or create user profile
export async function loadPlayerStats() {
  const user = auth.currentUser;
  if (!user) return null;

  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    return snap.data();
  } else {
    await setDoc(ref, defaultStats);
    return defaultStats;
  }
}

// 🎟️ Award tickets (after payment or victory)
export async function awardTickets(amount = 1) {
  const user = auth.currentUser;
  if (!user) return;

  const ref = doc(db, "users", user.uid);
  await updateDoc(ref, {
    tickets: incrementField("tickets", amount)
  });
}

// 🧠 Award EXP and auto-level up
export async function gainExp(amount = 50) {
  const user = auth.currentUser;
  if (!user) return;

  const ref = doc(db, "users", user.uid);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;

  let { exp, level } = snap.data();
  exp += amount;

  let nextLevel = level;
  const needed = xpNeeded(level);
  if (exp >= needed) {
    exp -= needed;
    nextLevel += 1;
  }

  await updateDoc(ref, { exp, level: nextLevel });
}

// 🪖 Track wins
export async function incrementWins() {
  const user = auth.currentUser;
  if (!user) return;
  const ref = doc(db, "users", user.uid);
  await updateDoc(ref, {
    wins: incrementField("wins", 1)
  });
}

// Internal helper: safely increment fields
async function incrementField(field, value) {
  const ref = doc(db, "users", auth.currentUser.uid);
  const snap = await getDoc(ref);
  const current = snap.data()?.[field] || 0;
  const updated = current + value;
  await updateDoc(ref, { [field]: updated });
  return updated;
}

// 🔺 XP scaling
function xpNeeded(level) {
  return Math.floor(100 + level ** 2 * 1.5); // progressive scaling
}
