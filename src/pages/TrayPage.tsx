import { useMemo, useState, useEffect } from "react";
import { calculatePasswordStrengthFromPassword, generatePassword, type PasswordStrength } from "@/features/password/services/password";
import SelectableOption from "@/components/ui/SelectableOption";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { LogicalSize } from "@tauri-apps/api/dpi";

export default function TrayPage() {
  const [useAlpha, setUseAlpha] = useState<boolean>(true);
  const [useNumeric, setUseNumeric] = useState<boolean>(true);
  const [useSymbols, setUseSymbols] = useState<boolean>(true);
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const setup = async () => {
      const win = getCurrentWindow();
      const width = 400;
      const height = 200;
      try {
        // Size first
        await win.setSize(new LogicalSize(width, height));
        try {
          await win.show();
          await win.setFocus();
        } catch {}
      } catch (e) {
        console.error("Failed to initialize tray size/position", e);
      }
    };

    setTimeout(setup, 10);
    onGenerate();
  }, []);

  async function onGenerate() {
    setError("");
    try {
      const result = await generatePassword({
        length: 16,
        use_alpha: useAlpha,
        use_numeric: useNumeric,
        use_symbols: useSymbols,
        avoid_ambiguous: true,
      });
      setPassword(result);
    } catch (e) {
      setError("Failed to generate password");
    }
  }

  const [strength, setStrength] = useState<PasswordStrength>({ label: "Weak", color: "bg-red-500", pct: 0 });

  useEffect(() => {
    let aborted = false;
    const run = async () => {
      try {
        const s = await calculatePasswordStrengthFromPassword(password);
        if (!aborted) setStrength(s);
      } catch {}
    };
    run();
    return () => { aborted = true; };
  }, [password]);

  const strengthTextColor = useMemo(() => {
    const c = strength.color;
    if (!c) return "text-gray-800";
    // Map bg-* to a slightly darker text-* shade per level
    const mapping: Record<string, string> = {
      "bg-red-500": "text-red-700",
      "bg-orange-500": "text-orange-700",
      "bg-yellow-500": "text-yellow-700",
      "bg-green-600": "text-green-800",
    };
    if (mapping[c]) return mapping[c];
    if (c.startsWith("bg-")) return c.replace("bg-", "text-");
    return "text-gray-800";
  }, [strength.color]);

  return (
    <div
      className="w-full bg-white dark:bg-gray-900 flex flex-col h-screen gap-4"
      data-tauri-drag-region
    >
      <div
        className={`w-full flex flex-col justify-between p-4 text-lg ${strength.color} gap-4`}
      >
        <p className="dark:text-gray-100 text-gray-800 text-3xl font-bold">{password}</p>
        <div className="flex items-center justify-between dark:text-gray-100">
          <span className={`${strengthTextColor} font-semibold px-4 py-1 rounded-md bg-white/40`}>{strength.label}</span>
          <div className="flex items-center gap-2">
          <button onClick={onGenerate} className="p-1 rounded-lg transition-all duration-200 hover:bg-white/50 dark:hover:bg-white/20 hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
            >
              <path
                d="M4.06189 13C4.02104 12.6724 4 12.3387 4 12C4 7.58172 7.58172 4 12 4C14.5006 4 16.7332 5.14727 18.2002 6.94416M19.9381 11C19.979 11.3276 20 11.6613 20 12C20 16.4183 16.4183 20 12 20C9.61061 20 7.46589 18.9525 6 17.2916M9 17H6V17.2916M18.2002 4V6.94416M18.2002 6.94416V6.99993L15.2002 7M6 20V17.2916"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
            </svg>
          </button>
          <button
            onClick={async () => {
              await navigator.clipboard.writeText(password);
              const webview = getCurrentWebviewWindow();
              try {
                await webview.hide();
              } catch {}
            }}
            className="p-1 rounded-lg transition-all duration-200 hover:bg-white/50 dark:hover:bg-white/20 hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
            >
              <path
                d="M17.5 14H19C20.1046 14 21 13.1046 21 12V5C21 3.89543 20.1046 3 19 3H12C10.8954 3 10 3.89543 10 5V6.5M5 10H12C13.1046 10 14 10.8954 14 12V19C14 20.1046 13.1046 21 12 21H5C3.89543 21 3 20.1046 3 19V12C3 10.8954 3.89543 10 5 10Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className="w-full flex flex-col gap-2 px-4">
        <div className=" w-full flex flex-wrap items-center gap-2">
          <SelectableOption
            selected={useAlpha}
            onChange={setUseAlpha}
            className="flex-1 min-w-0"
          >
            A–Z
          </SelectableOption>
          <SelectableOption
            selected={useNumeric}
            onChange={setUseNumeric}
            className="flex-1 min-w-0"
          >
            0–9
          </SelectableOption>
          <SelectableOption
            selected={useSymbols}
            onChange={setUseSymbols}
            className="flex-1 min-w-0"
          >
            !@#$
          </SelectableOption>
        </div>
        {error && (
          <p className="text-red-400 dark:text-red-500 text-xs mt-1">{error}</p>
        )}
      </div>
    </div>
  );
}


