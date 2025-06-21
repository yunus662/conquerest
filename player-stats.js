// player-stats.js

import { loadPlayerStats } from "./credit-tickets.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const auth = getAuth();

// 📦 Create or update the UI display
function renderStats(stats) {
  const container = document.getElementById("player-stats");
  if (!container) return;

  container.innerHTML = `
    <h3>🎮 Your Stats</h3>
    <p>Level: ${stats.level}</p>
    <p>EXP: ${stats.exp} / ${xpNeeded(stats.level)}</p>
    <div style="background:#555; height:10px; width:100%; border-radius:5px; overflow:hidden;">
      <div style="height:10px; width:${(stats.exp / xpNeeded(stats.level)) * 100}%; background:#0f0;"></div>
    </div>
    <p>Wins: ${stats.wins}</p>
    <p>🎟️ Tickets: ${stats.tickets}</p>
  `;
}

// 🔺 EXP curve
function xpNeeded(level) {
  return Math.floor(100 + level ** 2 * 1.5);
}

// 📡 Auto-load when signed in
onAuthStateChanged(auth, async (user) => {
  if (user) {
    const stats = await loadPlayerStats();
    renderStats(stats);
  }
});
