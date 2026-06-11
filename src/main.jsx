import React from "react";
import { createRoot } from "react-dom/client";
import Call from "./call.jsx";
import "./styles.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Call />
  </React.StrictMode>
);
