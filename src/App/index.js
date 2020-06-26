import React, { useState, useEffect } from "react";
import useOrbit from "./useOrbit";

import "./style.css";

function App() {
  const [db, log, create, join] = useOrbit();

  const [isHost, setIsHost] = useState(null);

  const [gameIsFull, setGameIsFull] = useState(false);
  const [gameHasStarted, setGameHasStarted] = useState(false);
  const [gamePastLobby, setGamePastLobby] = useState(false);

  const onJoin = (name, id) => {
    if (!db && name.length > 0) {
      setGamePastLobby(true);
      join(name, id)
        .then(() => setGameHasStarted(true))
        .catch((e) => {
          setGameIsFull(true);
        });
    }
  };

  const onCreate = (name) => {
    if (!db && name.length > 0) {
      setIsHost(true);
      setGamePastLobby(true);
      create(name).then(() => setGameHasStarted(true));
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Tic tac toe</h1>

        {!gamePastLobby && !gameHasStarted && (
          <StartScreen onCreate={onCreate} onJoin={onJoin} />
        )}
        {gamePastLobby && !isHost && !gameHasStarted && !gameIsFull && (
          <LoadingScreen message="Loading..." />
        )}
        {isHost && !gameHasStarted && (
          <ShareCodeScreen code={db && db.address.toString()} />
        )}

        {gameIsFull ? (
          <p>Game is full</p>
        ) : (
          gameHasStarted && <GameScreen log={log} db={db} />
        )}
      </header>
    </div>
  );
}

function LoadingScreen({ message }) {
  return <p>{message}</p>;
}

function StartScreen({ onCreate, onJoin }) {
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
        <input
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <br />
      <div>
        <strong>Create game</strong>
        <button onClick={() => onCreate(name)}>Generate game-code</button>
      </div>
      <br />
      <div>
        <strong>Join a game</strong>
        <input
          placeholder="Enter code"
          value={gameID}
          onChange={(e) => setGameID(e.target.value)}
        />
        <button onClick={() => onJoin(name, gameID)}>Join</button>
      </div>
    </div>
  );
}

function ShareCodeScreen({ code }) {
  return (
    <div>
      {code ? (
        <React.Fragment>
          <strong>Share this code</strong>
          <p>{code}</p>
        </React.Fragment>
      ) : (
        <LoadingScreen message="Generating code..." />
      )}
    </div>
  );
}

function GameScreen({ log, db }) {
  return (
    <div>
      <strong>Send message</strong>
      <button onClick={() => db.add({ type: "ping", data: null })}>Ping</button>
      <button onClick={() => db.add({ type: "pong", data: null })}>Pong</button>

      <br />

      <strong>Log</strong>
      {log
        .slice()
        .reverse()
        .map((item) => (
          <p>{JSON.stringify(item)}</p>
        ))}
    </div>
  );
}

export default App;
