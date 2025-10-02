import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Theme = "light" | "dark" | "system";

type ThemeContextValue = {
  resolvedTheme: "light" | "dark";
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

function getSystemTheme(): "light" | "dark" {
  if (typeof window === "undefined" || typeof window.matchMedia === "undefined") {
    return "light";
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyDocumentClass(next: "light" | "dark") {
  const root = document.documentElement;
  if (!root) return;
  root.classList.toggle("dark", next === "dark");
  // Hint to form controls
  try {
    (document.body as any).style.colorScheme = next;
  } catch {}
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [system, setSystem] = useState<"light" | "dark">(() => getSystemTheme());

  const resolvedTheme = useMemo<"light" | "dark">(() => system, [system]);

  useEffect(() => {
    applyDocumentClass(resolvedTheme);
  }, [resolvedTheme]);

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia === "undefined") return;
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => setSystem(getSystemTheme());
    try {
      mql.addEventListener("change", handler);
    } catch {
      // Safari
      // @ts-ignore
      mql.addListener(handler);
    }
    return () => {
      try {
        mql.removeEventListener("change", handler);
      } catch {
        // @ts-ignore
        mql.removeListener(handler);
      }
    };
  }, []);

  const value = useMemo(() => ({ resolvedTheme }), [resolvedTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}


