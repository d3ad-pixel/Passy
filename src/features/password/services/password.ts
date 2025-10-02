import { invoke } from "@tauri-apps/api/core";

export type PasswordOptions = {
  length: number;
  use_alpha: boolean;
  use_numeric: boolean;
  use_symbols: boolean;
  avoid_ambiguous?: boolean;
};

export async function generatePassword(options: PasswordOptions): Promise<string> {
  return await invoke<string>("generate_password", { options });
}

export type PasswordStrength = {
  label: string;
  color: string;
  pct: number;
};

export function calculatePasswordStrength(
  length: number,
  useAlpha: boolean,
  useNumeric: boolean,
  useSymbols: boolean,
  avoidAmbiguous: boolean = false
): PasswordStrength {
  let pool = 0;
  if (useAlpha) pool += 52;
  if (useNumeric) pool += 10;
  if (useSymbols) pool += 32; // rough
  if (avoidAmbiguous) {
    // subtract approximate ambiguous set if categories included
    let deduction = 0;
    if (useAlpha) deduction += 4; // i l I L
    if (useNumeric) deduction += 2; // 0 1
    if (useAlpha) deduction += 2; // O o (already in alpha)
    pool = Math.max(1, pool - deduction);
  }
  const entropy = Math.log2(pool) * length;
  // classify
  if (entropy < 35) return { label: "Weak", color: "bg-red-500", pct: 0.33 };
  if (entropy < 60)
    return { label: "Fair", color: "bg-orange-500", pct: 0.5 };
  if (entropy < 80)
    return { label: "Good", color: "bg-yellow-500", pct: 0.75 };
  return { label: "Strong", color: "bg-green-600", pct: 1 };
}

export function calculatePasswordStrengthFromPassword(password: string): PasswordStrength {
  const length = password.length;
  if (length === 0) return { label: "Weak", color: "bg-red-500", pct: 0 };

  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumeric = /[0-9]/.test(password);
  const hasSymbols = /[^A-Za-z0-9]/.test(password);

  let pool = 0;
  if (hasLower) pool += 26;
  if (hasUpper) pool += 26;
  if (hasNumeric) pool += 10;
  if (hasSymbols) pool += 32; // approximate symbol set size
  if (pool === 0) pool = 1;

  const entropy = Math.log2(pool) * length;

  if (entropy < 35) return { label: "Weak", color: "bg-red-500", pct: 0.33 };
  if (entropy < 60) return { label: "Fair", color: "bg-orange-500", pct: 0.5 };
  if (entropy < 80) return { label: "Good", color: "bg-yellow-500", pct: 0.75 };
  return { label: "Strong", color: "bg-green-600", pct: 1 };
}


