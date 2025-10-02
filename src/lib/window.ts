import { LogicalSize } from "@tauri-apps/api/dpi";
import { getCurrentWindow } from "@tauri-apps/api/window";

export function setWindowSize(width: number, height: number) {
    const window = getCurrentWindow();
    window.setSize(new LogicalSize(width, height));
}

