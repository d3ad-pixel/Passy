import { useEffect, useState } from "react";
import SelectableOption from "@/components/ui/SelectableOption";
import { generatePassword, calculatePasswordStrengthFromPassword, type PasswordStrength } from "@/features/password/services/password";
import { setWindowSize } from "@/lib/window";
import Slider from "@/components/ui/Slider";
import toast from "react-hot-toast";

export default function PasswordGenerator() {
  const [length, setLength] = useState<number>(16);
  const [useAlpha, setUseAlpha] = useState<boolean>(true);
  const [useNumeric, setUseNumeric] = useState<boolean>(true);
  const [useSymbols, setUseSymbols] = useState<boolean>(true);
  const [avoidAmbiguous, setAvoidAmbiguous] = useState<boolean>(true);
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    setWindowSize(420, 430);
    onGenerate();
  }, []);

  async function onGenerate() {
    setError("");
    try {
      const result = await generatePassword({
        length,
        use_alpha: useAlpha,
        use_numeric: useNumeric,
        use_symbols: useSymbols,
        avoid_ambiguous: avoidAmbiguous,
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

  return (
    <div className="mx-auto w-full rounded-2xl p-6 bg-white dark:bg-gray-900">

      <div className="relative">
        <input
          type="text"
          value={password}
          readOnly
          placeholder="Click Generate Password"
          className="w-full h-12 rounded-lg border border-gray-300 dark:border-gray-700 pl-3 pr-20 font-mono font-semibold text-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder:text-gray-400"
        />
        <div className="absolute inset-y-0 right-2 flex items-center gap-2">
          <button
            type="button"
            onClick={onGenerate}
            className="p-1 rounded-lg transition-all duration-200 hover:bg-white/50 dark:hover:bg-white/20 hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            aria-label="Generate password"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
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
            type="button"
            onClick={async () => {
              if (!password) return;
              await navigator.clipboard.writeText(password);
              toast("Password copied to clipboard", {
                duration: 1000,
                style: {
                  borderRadius: "10px",
                  background: "#00c950",
                  color: "#ffffff",
                  fontWeight: "bold",
                },
              });
            }}
            className="p-1 bg-green rounded-lg transition-all duration-200 hover:bg-white/50 dark:hover:bg-white/20 hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            disabled={!password}
            aria-label="Copy password"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
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

      <div className="mt-4 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="h-2 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={"h-full " + strength.color}
            style={{ width: `${Math.round(strength.pct * 100)}%` }}
          />
        </div>
        <p className="mt-3 text-center font-semibold text-gray-700 dark:text-gray-300">
          {strength.label}
        </p>
      </div>

      <div className="mt-6">
        <div className="flex items-center justify-between gap-4">
          <span className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Characters
          </span>
          <input
            type="number"
            min={1}
            max={128}
            value={length}
            onChange={(e) =>
              setLength(
                Math.max(
                  1,
                  Math.min(128, parseInt(e.currentTarget.value || "1", 10))
                )
              )
            }
            className="w-20 h-12 text-center rounded border border-gray-300 dark:border-gray-700 px-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>
        <div className="mt-3">
          <Slider
            value={length}
            min={1}
            max={128}
            onChange={setLength}
            label={undefined}
            showValue={false}
          />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 sm:grid-cols-2 gap-3">
        <SelectableOption selected={useAlpha} onChange={setUseAlpha}>
          Letters (A–Z, a–z)
        </SelectableOption>
        <SelectableOption selected={useNumeric} onChange={setUseNumeric}>
          Numbers (0–9)
        </SelectableOption>
        <SelectableOption selected={useSymbols} onChange={setUseSymbols}>
          Symbols (!@#S...)
        </SelectableOption>
        <SelectableOption
          selected={avoidAmbiguous}
          onChange={setAvoidAmbiguous}
        >
          Avoid Ambiguous
        </SelectableOption>
      </div>

      {error && (
        <p className="text-red-400 dark:text-red-500 mt-3 text-center">
          {error}
        </p>
      )}
    </div>
  );
}
