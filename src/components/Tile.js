import React from "react";

export default function Tile({ text, onClick }) {
  return (
    <button style={{ height: "100px" }} onClick={onClick}>
      {text}
    </button>
  );
}
