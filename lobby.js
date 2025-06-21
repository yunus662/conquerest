// lobby.js
export function spawnLobbies(activeUserCount = 1, usersPerLobby = 4) {
  const numLobbies = Math.max(1, Math.ceil(activeUserCount / usersPerLobby));
  const lobbies = [];

  for (let i = 0; i < numLobbies; i++) {
    const code = `ROOM-${i + 1}`;
    lobbies.push(code);
  }

  // Optionally save them locally for later use
  localStorage.setItem("availableLobbies", JSON.stringify(lobbies));
  return lobbies;
}
