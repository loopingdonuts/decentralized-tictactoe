import React from "react";
import LoadingScreen from "./LoadingScreen";

export default function ShareCodeScreen({ code }) {
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
