import React, { useState } from "react";
import IPFS from "ipfs";
import OrbitDB from "orbit-db";

import "./style.css";

function App() {
  const [joinInput, setJoinInput] = useState("");
  const [gameID, setGameID] = useState(null);
  const [gameCreated, setGameCreated] = useState(false);

  const [log, setLog] = useState([]);
  const [db, setDb] = useState(null);

  function join() {
    setJoinInput("");

    const initIPFSInstance = async () => {
      return await IPFS.create({
        repo: "./tic-tac-toe-looping-donuts" + Date.now(),
        EXPERIMENTAL: {
          pubsub: true,
        },
        config: {
          Addresses: {
            Swarm: [
              "/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star/",
            ],
          },
        },
      });
    };

    initIPFSInstance().then(async (ipfs) => {
      const orbitdb = await OrbitDB.createInstance(ipfs);
      const db = await orbitdb.open(joinInput);

      setDb(db);
      setGameID(db.address.toString());

      db.add({
        type: "joined",
        data: "peer",
      });

      db.events.on("replicated", () => {
        const result = db
          .iterator({ limit: -1 })
          .collect()
          .map((e) => e.payload.value);
        setLog(result);
      });

      db.events.on("write", (address, entry, heads) => {
        setLog((log) => [...log, entry.payload.value]);
      });
    });
  }

  function create() {
    setGameCreated(true);

    const initIPFSInstance = async () => {
      return await IPFS.create({
        repo: "./tic-tac-toe-looping-donuts" + Date.now(),
        EXPERIMENTAL: {
          pubsub: true,
        },
        config: {
          Addresses: {
            Swarm: [
              "/dns4/wrtc-star1.par.dwebops.pub/tcp/443/wss/p2p-webrtc-star/",
            ],
          },
        },
      });
    };

    initIPFSInstance().then(async (ipfs) => {
      const orbitdb = await OrbitDB.createInstance(ipfs);
      const db = await orbitdb.create("first-database", "eventlog", {
        accessController: {
          write: ["*"],
        },
        overwrite: true,
        replicate: true,
      });

      setDb(db);
      setGameID(db.address.toString());

      db.add({
        type: "joined",
        data: "host",
      });

      db.events.on("replicated", () => {
        const result = db
          .iterator({ limit: -1 })
          .collect()
          .map((e) => e.payload.value);
        setLog(result);
      });

      db.events.on("write", (address, entry, heads) => {
        setLog((log) => [...log, entry.payload.value]);
      });
    });
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Tic tac toe</h1>
        {gameID == null && !gameCreated ? (
          <React.Fragment>
            <p>
              Generate a code to start a game{" "}
              <button onClick={() => create()}>Generate code</button>
            </p>
            <p>
              Or join a game{" "}
              <input
                placeholder="Enter code"
                onChange={(e) => setJoinInput(e.target.value)}
                value={joinInput}
              />
              {joinInput != "" && (
                <button onClick={() => joinInput != "" && join()}>
                  Join game
                </button>
              )}
            </p>
          </React.Fragment>
        ) : (
          <React.Fragment>
            {gameCreated ? (
              <React.Fragment>
                <p>Copy to friend:</p>
                <p>{gameID}</p>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <p>Game id:</p>
                <p>{gameID}</p>
              </React.Fragment>
            )}
          </React.Fragment>
        )}

        {db && (
          <React.Fragment>
            <h2>Send message</h2>
            <button onClick={() => db.add({ type: "ping", data: null })}>
              Ping
            </button>
            <button onClick={() => db.add({ type: "pong", data: null })}>
              Pong
            </button>

            <h2>Log</h2>
            {log.map((item) => (
              <p>{JSON.stringify(item)}</p>
            ))}
          </React.Fragment>
        )}
      </header>
    </div>
  );
}

export default App;
