use tauri::{Window, WindowEvent};

pub fn handle_window_event(window: &Window, event: &WindowEvent) {
    match event {
        WindowEvent::Focused(false) => {
            // if window.is_minimized().unwrap_or(false) {
            //     let _ = window.hide();
            // }
        }
        WindowEvent::ScaleFactorChanged { .. } => {}
        WindowEvent::ThemeChanged(_) => {}
        WindowEvent::CloseRequested { api, .. } => {
            let _ = window.hide();
            api.prevent_close();
        }
        _ => {}
    }
}
