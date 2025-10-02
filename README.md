# Tauri + React + Typescript

This template should help get you started developing with Tauri, React and Typescript in Vite.

## CI/CD (GitHub Actions)

Two workflows are included in `.github/workflows/`:

- `ci.yml`: Runs on pushes and PRs to `main`/`master`. It installs deps, builds the frontend (`pnpm build`), and runs Rust checks (`cargo check`, `clippy`, `fmt`).
- `release.yml`: Runs on tag pushes like `v1.2.3` across macOS, Linux, and Windows using the official Tauri action. It builds installers and uploads them to a GitHub Release.

### How to trigger a release

1. Ensure your version in `src-tauri/tauri.conf.json` is what you want to ship (optional but recommended).
2. Create and push a tag:

   ```bash
   git tag v1.1.0
   git push origin v1.1.0
   ```

3. The Release workflow will build per-OS artifacts and attach them to the GitHub Release created for that tag.

### Optional code signing and notarization

If you want signed/notarized builds, add these repository secrets:

- TAURI_SIGNING_PRIVATE_KEY
- TAURI_SIGNING_PRIVATE_KEY_PASSWORD

macOS (optional notarization):

- APPLE_ID
- APPLE_PASSWORD (app-specific password)
- APPLE_TEAM_ID

Windows (optional signing):

- WINDOWS_CERTIFICATE (base64 PFX)
- WINDOWS_CERTIFICATE_PASSWORD

GitHub → `Settings` → `Secrets and variables` → `Actions` → `New repository secret`.

On Linux, no extra secrets are required. The workflow installs the necessary system packages for WebKit/GTK builds.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
