import React, { useState } from "react";
import styled from "styled-components";
import useOrbit from "../hooks/useOrbit";
import GameScreen from "./Screens/GameScreen";
import LoadingScreen from "./Screens/LoadingScreen";
import ShareCodeScreen from "./Screens/ShareCodeScreen";

import StartScreen from "./Screens/StartScreen";

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
        .catch(e => {
          setGameIsFull(true);
        });
    }
  };

  const onCreate = name => {
    if (!db && name.length > 0) {
      setIsHost(true);
      setGamePastLobby(true);
      create(name).then(() => setGameHasStarted(true));
    }
  };

  return (
    <StyledApp>
      <Container>
        <Header>
          <h1>Decentralized Tic-tac-toe</h1>
          <p>
            To play Tic-tac-toe online you'd typically need a server running a backend that is
            hosting the game. Not for this game.
          </p>

          <p>
            This game uses a database called <a href="https://orbitdb.org/">OrbitDB</a> that is
            built on <a href="https://ipfs.org">IPFS</a>. IFPS a "A peer-to-peer hypermedia
            protocol". It allows this game to communicate direcly to another computer instead of
            using a server as backend.
          </p>

          <p>
            We use the{" "}
            <a href="https://github.com/orbitdb/orbit-db/blob/master/API.md#orbitdblognameaddress">
              Log
            </a>{" "}
            api from OrbitDB to make this event-based game.
          </p>
        </Header>

        <Divider />

        <Main>
          {!gamePastLobby && !gameHasStarted && <StartScreen onCreate={onCreate} onJoin={onJoin} />}
          {gamePastLobby && !isHost && !gameHasStarted && !gameIsFull && (
            <LoadingScreen message="Loading..." />
          )}
          {isHost && !gameHasStarted && <ShareCodeScreen code={db && db.address.toString()} />}

          {gameIsFull ? (
            <p>Game is full</p>
          ) : (
            gameHasStarted && <GameScreen log={log} db={db} isHost={isHost} />
          )}
        </Main>
      </Container>
    </StyledApp>
  );
}

const StyledApp = styled.div`
  background: #ededed;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
`;

const Container = styled.div`
  margin: 128px 32px;
  width: 60%;
`;

const Header = styled.header`
  & h1 {
    font-size: 2rem;
    margin-bottom: 32px;
  }

  & p + p {
    margin-top: 16px;
  }

  & a {
    color: purple;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const Divider = styled.div`
  display: block;
  height: 1px;
  width: 100%;
  background: grey;
  margin: 64px 0;
`;

const Main = styled.main``;

export default App;
