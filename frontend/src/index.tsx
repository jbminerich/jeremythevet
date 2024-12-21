import React from "react";
import ReactDOM from "react-dom/client"; // Use the new API in React 18
import "./index.css";
import App from "./App";

const rootElement = document.getElementById("root");

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement); // New API
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
