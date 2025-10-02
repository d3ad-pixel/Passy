import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/app/App";
import { ThemeProvider } from "@/providers/theme";
import "@/styles/globals.css";
import { Toaster } from "react-hot-toast";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement,
);
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <Toaster />
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);
