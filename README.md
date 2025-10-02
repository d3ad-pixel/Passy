# Passy

Passy is a lightweight, cross‑platform desktop password generator built with Tauri (Rust) and React. It focuses on fast, offline password creation with a clear strength indicator and a convenient system tray experience.

## Key Features

- Strong password generation with customizable options:
  - **Length** control
  - Include **letters**, **numbers**, and **symbols**
  - Option to **avoid ambiguous characters** (e.g., 0/O, 1/l)
- Real‑time strength meter based on estimated entropy
- One‑click copy workflow (from the main window)
- Tray integration for quick access; opens a compact tray window near the system tray
- Cross‑platform builds for Windows, macOS, and Linux

## How It Works

- Passwords are generated using a native Rust command exposed via Tauri. The UI triggers the command and receives the generated value.
- The strength meter estimates entropy from selected character pools and length, classifying results as Weak, Fair, Good, or Strong.
- On Linux, required WebKit/GTK dependencies are installed at build time; macOS and Windows binaries are produced via the CI release workflow.

## Usage

1. Launch the app to open the main window.
2. Adjust length and toggle character sets and the “avoid ambiguous” option.
3. Generate and copy the password.
4. Use the tray icon to quickly reveal the compact generator near your system tray.

## Development

- Frontend: React + TypeScript
- Backend: Rust (Tauri commands)
- Package manager: pnpm

### Scripts

```bash
pnpm install
pnpm dev       # start the dev server and Tauri
pnpm build     # build frontend assets
```

## Releases

Releases are created by pushing a tag like `v1.2.3`. A GitHub Action builds platform installers and uploads them to the release page. Pre‑releases are detected if the tag contains `-rc`, `-beta`, or `-alpha`.

## License

MIT
