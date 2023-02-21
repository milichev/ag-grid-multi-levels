import React from "react";
import ReactDOM from "react-dom";

import { GridAppPerf as App } from "./components/GridApp";
import "./styles.scss";

const origConsoleError = console.error.bind(console);
console.error = (...args: any[]) => {
  const { stack } = new Error();
  if (
    (stack && /outputMissingLicenseKey/.test(stack)) ||
    args.some(
      (a) =>
        typeof a === "string" && a.includes("Warning: Invalid aria prop %s")
    )
  ) {
    return;
  }
  origConsoleError(...args);
};

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
