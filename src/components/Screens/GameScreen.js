import React from "react";
import Tile from "../Tile";

export default function GameScreen({ log, db, isHost }) {
  const perRow = 3;

  const hasWon = () => {
    const hasNotPlacedTile = log.filter(item => item.type === "place").length < 5;
    if (hasNotPlacedTile) return null;

    const winningPositions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    let winingPlayer = null;

    winningPositions.forEach(element => {
      const foundWinningPos = element.every(pos => {
        return log.find(
          item =>
            item.type === "place" &&
            item.data.index === pos &&
            item.data.turnMarker === getLatestPlaced()
        );
      });
      if (foundWinningPos) winingPlayer = getLatestPlaced();
    });
    return winingPlayer;
  };

  const getLatestPlaced = () => {
    return log
      .slice()
      .reverse()
      .find(item => item.type === "place").data.turnMarker;
  };

  const canPlaceTile = index => {
    const hasNotPlacedTile = log.filter(item => item.type === "place").length === 0;

    if (hasNotPlacedTile) return isHost;

    const lastPlaced = getLatestPlaced();

    const isYourTurn = isHost ? lastPlaced === "O" : lastPlaced === "X";

    const isEmpty = !log.find(item => item.type === "place" && item.data.index === index);

    return isYourTurn && isEmpty && hasWon() === null;
  };

  const placeTile = index => {
    if (canPlaceTile(index)) {
      db.add({
        type: "place",
        data: {
          index: index,
          turnMarker: isHost ? "X" : "O",
        },
      });
    }
  };

  const getTile = index => {
    const tileLogItem = log.find(item => item.type === "place" && item.data.index === index);
    return tileLogItem ? tileLogItem.data.turnMarker : "";
  };

  return (
    <div>
      <strong>Send message</strong>
      <button onClick={() => db.add({ type: "ping", data: null })}>Ping</button>
      <button onClick={() => db.add({ type: "pong", data: null })}>Pong</button>

      <br />

      <strong>Board</strong>
      {hasWon() != null && <h1>Player {hasWon()} won the game</h1>}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${perRow}, 1fr)`,
          gridTemplateRows: `repeat(${perRow}, 1fr)`,
        }}
      >
        {[...Array(perRow * perRow).keys()].map(index => (
          <Tile text={getTile(index)} onClick={() => placeTile(index)} />
        ))}
      </div>

      <br />

      <strong>Log</strong>
      {log
        .slice()
        .reverse()
        .map(item => (
          <p>{JSON.stringify(item)}</p>
        ))}
    </div>
  );
}
