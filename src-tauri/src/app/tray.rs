use tauri::{self, Manager};
use tauri_plugin_positioner::{on_tray_event, Position, WindowExt};

pub fn install_tray(app: &tauri::App) -> tauri::Result<()> {
    let show_item = tauri::menu::MenuItem::with_id(app, "show", "Show", true, None::<&str>)?;
    let quit_item = tauri::menu::MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
    let tray_menu = tauri::menu::Menu::with_items(app, &[&show_item, &quit_item])?;

    let mut tray_builder = tauri::tray::TrayIconBuilder::new();
    if let Some(icon) = app.default_window_icon().cloned() {
        tray_builder = tray_builder.icon(icon);
    }
    tray_builder
        .tooltip("Passy")
        .show_menu_on_left_click(false)
        .menu(&tray_menu)
        .on_tray_icon_event(|tray, event| {
            // Forward tray events to the positioner plugin so it knows the tray location
            on_tray_event(&tray.app_handle(), &event);

            if let tauri::tray::TrayIconEvent::Click { button, .. } = event {
                if button == tauri::tray::MouseButton::Left {
                    let app = tray.app_handle();
                    if let Some(window) = app.get_webview_window("tray") {
                        let _ = window.move_window_constrained(Position::TrayBottomLeft);
                        let _ = window.show();
                        let _ = window.unminimize();
                        let _ = window.set_focus();
                    }
                }
            }
        })
        .on_menu_event(|app, event| match event.id().as_ref() {
            "show" => {
                if let Some(window) = app.get_webview_window("main") {
                    let _ = window.show();
                    let _ = window.unminimize();
                    let _ = window.set_focus();
                }
            }
            "quit" => {
                app.exit(0);
            }
            _ => {}
        })
        .build(app)?;

    // Ensure a single hidden tray window exists (we'll just show/hide it)
    if app.get_webview_window("tray").is_none() {
        if let Ok(win) = tauri::WebviewWindowBuilder::new(
            app,
            "tray",
            tauri::WebviewUrl::App("/index.html#/tray".into()),
        )
        .title("Tray")
        .decorations(false)
        .skip_taskbar(true)
        .always_on_top(true)
        .resizable(true)
        .visible(false)
        // .initialization_script(crate::app::scripts::CONTEXT_MENU_BLOCK_JS)
        .build()
        {
            let win_clone = win.clone();
            win.on_window_event(move |e| match e {
                tauri::WindowEvent::Focused(false) => {
                    let _ = win_clone.hide();
                }
                _ => {}
            });
        }
    }

    Ok(())
}
