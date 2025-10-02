import PasswordGenerator from "@/features/password/components/PasswordGenerator";
import TrayPage from "@/pages/TrayPage";
import { useEffect, useState } from "react";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";

export default function App() {
  const computeIsTray = () => {
    const hash = window.location.hash || "#";
    const isTrayRoute = hash.startsWith("#/tray");
    let isTrayByLabel = false;
    try {
      const current = getCurrentWebviewWindow();
      isTrayByLabel = current.label === "tray";
    } catch {}
    return isTrayByLabel || isTrayRoute;
  };

  const [isTray, setIsTray] = useState<boolean>(computeIsTray());

  useEffect(() => {
    const onHashChange = () => setIsTray(computeIsTray());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return isTray ? <TrayPage /> : <PasswordGenerator />;
}


