// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
mod app;
mod commands;
use tauri::{Manager};
use tauri_plugin_dialog::{DialogExt, MessageDialogKind};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_positioner::init())
        .plugin(tauri_plugin_single_instance::init(|app, _, _| {
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.show();
                let _ = window.unminimize();
                let _ = window.set_focus();
            }
            let _ = app
                .dialog()
                .message("An instance of this app is already running.")
                .title("Passy")
                .kind(MessageDialogKind::Error)
                .blocking_show();
        }))
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_opener::init())
        .on_page_load(|window, _| {
            // let _ = window.eval(crate::app::scripts::PAGE_INIT_JS);
        })
        .on_window_event(|window, event| {
            crate::app::events::handle_window_event(window, &event);
        })
        .setup(|app| {
            crate::app::tray::install_tray(app)?;
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::password::generate_password
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
