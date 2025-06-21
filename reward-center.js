// reward-center.js

import {
  getCurrentUser,
  loadStats,
  addTickets,
  addExp
} from "./player-system.js";

const achievements = [
  { id: "first_win", label: "First Victory", trigger: stats => stats.wins >= 1 },
  { id: "economic_rush", label: "1000 Gold Stockpile", trigger: stats => stats.tickets >= 10 },
  { id: "veteran", label: "Reach Level 5", trigger: stats => stats.level >= 5 },
  { id: "elite", label: "Reach Level 20", trigger: stats => stats.level >= 20 }
];

const medals = [
  { id: "iron_wall", label: "Defended 5 attacks", description: "Awarded for unmatched resilience." },
  { id: "blitzkrieg", label: "Won 3 battles in 10 minutes", description: "A symbol of decisive force." }
];

const shopItems = [
  { id: "elite_aircraft", name: "Stealth Bomber", cost: 8, unlock: stats => stats.level >= 10 },
  { id: "gold_boost", name: "Gold Surge", cost: 5, unlock: () => true },
  { id: "special_skin", name: "Titan Armor Skin", cost: 12, unlock: stats => stats.level >= 15 }
];

const unlocked = new Set(); // holds achievement/medal ids

export async function initRewardCenter() {
  const user = getCurrentUser();
  if (!user) return;

  const stats = await loadStats();
  renderShop(stats);
  checkAchievements(stats);
}

function checkAchievements(stats) {
  achievements.forEach(a => {
    if (a.trigger(stats) && !unlocked.has(a.id)) {
      unlocked.add(a.id);
      spawnPopup(`🎯 Achievement Unlocked: ${a.label}`);
    }
  });
}

export function unlockMedal(id) {
  const medal = medals.find(m => m.id === id);
  if (medal && !unlocked.has(medal.id)) {
    unlocked.add(medal.id);
    spawnPopup(`🏅 Medal Earned: ${medal.label}`);
  }
}

function renderShop(stats) {
  const container = document.getElementById("reward-shop");
  if (!container) return;

  container.innerHTML = `<h3>🎖️ Shop</h3>` + shopItems.map(item => {
    const locked = !item.unlock(stats);
    return `
      <div style="opacity:${locked ? 0.5 : 1}">
        ${item.name} — 🎟️ ${item.cost}
        <button ${locked ? "disabled" : ""} onclick="window.purchaseItem('${item.id}')">
          Buy
        </button>
      </div>
    `;
  }).join("");
}

window.purchaseItem = async function (itemId) {
  const stats = await loadStats();
  const item = shopItems.find(i => i.id === itemId);
  if (!item || !item.unlock(stats)) return;

  if (stats.tickets >= item.cost) {
    await addTickets(-item.cost);
    spawnPopup(`🛒 Purchased ${item.name}`);
    // Optional: Apply effect (e.g., boost, unit unlock)
  } else {
    spawnPopup("❌ Not enough tickets", "warning");
  }

  renderShop(await loadStats());
};

function spawnPopup(message, type = "success") {
  const popup = document.createElement("div");
  popup.innerText = message;
  popup.style = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${type === "warning" ? "#f33" : "#0f0"};
    color: black;
    padding: 10px;
    font-weight: bold;
    border-radius: 6px;
    z-index: 9999;
    animation: fadeOut 2s ease-in-out forwards;
  `;
  document.body.appendChild(popup);
  setTimeout(() => popup.remove(), 2000);
}
