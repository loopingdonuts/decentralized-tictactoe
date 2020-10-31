import React, { useState } from "react";
import styled from "styled-components";

import Input from "../Input";
import Button from "../Button";

export default function StartScreen({ onCreate, onJoin }) {
  const [gameID, setGameID] = useState("");
  const [name, setName] = useState("");

  return (
    <StyledStartScreen>
      <h2>Start a game</h2>
      <InputGroup>
        Write your name
        <Input placeholder="Enter name" value={name} onChange={e => setName(e.target.value)} />
      </InputGroup>

      {name !== "" && (
        <Options>
          <p>Great! Now choose to either option</p>

          <div>
            <Option>
              <h3>Create game</h3>
              <Button onClick={() => onCreate(name)}>Generate game-code</Button>
            </Option>

            <Option>
              <h3>Join a game</h3>
              <Input
                placeholder="Enter code"
                value={gameID}
                onChange={e => setGameID(e.target.value)}
              />
              <Button onClick={() => onJoin(name, gameID)}>Join</Button>
            </Option>
          </div>
        </Options>
      )}
    </StyledStartScreen>
  );
}

const StyledStartScreen = styled.div`
  & h2 {
    margin-bottom: 24px;
    font-size: 1.5rem;
  }
`;

const InputGroup = styled.label`
  display: flex;
  flex-direction: column;
`;

const Options = styled.div`
  margin-top: 64px;

  & > p {
    margin-bottom: 16px;
  }

  & > div {
    display: flex;
    flex-direction: row;
    margin: -32px;
  }
`;

const Option = styled.div`
  background: #d6d6d6;
  border-radius: 8px;
  width: 50%;
  margin: 32px;
  padding: 32px 24px;

  display: flex;
  flex-direction: column;

  & h3 {
    font-size: 1.3rem;
    margin-bottom: 16px;
  }
`;
