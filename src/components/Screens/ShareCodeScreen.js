import React from "react";
import Tooltip from "react-tooltip-lite";
import copy from "copy-to-clipboard";
import Button from "../Button";
import CenterStatus from "../CenterStatus";

export default function ShareCodeScreen({ code }) {
  return (
    <div>
      {code ? (
        <CenterStatus>
          <strong>Share this code</strong>
          <p>{code}</p>
          <Tooltip content="Code copied!" direction="down" eventToggle="onClick">
            <Button onClick={() => copy(code)}>Copy to clipboard</Button>
          </Tooltip>
        </CenterStatus>
      ) : (
        <CenterStatus>
          <p>Generating code...</p>
        </CenterStatus>
      )}
    </div>
  );
}
