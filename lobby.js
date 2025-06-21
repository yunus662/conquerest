// lobbies.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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

// Initialize Firebase and Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * Fetches the list of lobbies from Firestore.
 * Each lobby document is expected to have:
 *   - lobbyName (string)
 *   - startTime (Firestore timestamp)
 *   - inGameYear (string or number)
 *   - playersCount (number)
 *
 * @returns {Promise<Array>} An array of lobby objects.
 */
export async function fetchLobbies() {
  const lobbies = [];
  try {
    const querySnapshot = await getDocs(collection(db, "lobbies"));
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      lobbies.push({
        id: doc.id,
        lobbyName: data.lobbyName || "Lobby",
        startTime: data.startTime
          ? new Date(data.startTime.seconds * 1000).toLocaleString()
          : "TBD",
        inGameYear: data.inGameYear || "Unknown",
        playersCount: data.playersCount || 0,
      });
    });
  } catch (error) {
    console.error("Error fetching lobbies:", error);
  }
  return lobbies;
}

/**
 * Redirects the user to the game page for the selected lobby.
 * 
 * @param {string} lobbyId - The Firestore document ID for the lobby.
 */
export function joinLobby(lobbyId) {
  window.location.href = "game.html?lobby=" + encodeURIComponent(lobbyId);
}
