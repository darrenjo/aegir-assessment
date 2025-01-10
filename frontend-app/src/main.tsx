import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
// import "/index.css"; // Jika kamu menggunakan CSS global
// import "/styles/UserTable.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
