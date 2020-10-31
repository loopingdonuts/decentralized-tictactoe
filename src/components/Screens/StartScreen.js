import React, { useState } from "react";

export default function StartScreen({ onCreate, onJoin }) {
  const [gameID, setGameID] = useState("");
  const [name, setName] = useState(
    Math.random()
      .toString(36)
      .replace(/[^a-z]+/g, "")
      .substr(0, 5)
  );

  return (
    <div>
      <div>
        <b>Your name</b>
        <input placeholder="Enter name" value={name} onChange={e => setName(e.target.value)} />
      </div>
      <br />
      <div>
        <strong>Create game</strong>
        <button onClick={() => onCreate(name)}>Generate game-code</button>
      </div>
      <br />
      <div>
        <strong>Join a game</strong>
        <input placeholder="Enter code" value={gameID} onChange={e => setGameID(e.target.value)} />
        <button onClick={() => onJoin(name, gameID)}>Join</button>
      </div>
    </div>
  );
}
