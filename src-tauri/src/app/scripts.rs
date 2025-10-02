// JavaScript snippets injected into webviews

// Script for all pages: disable context menu and block reload shortcuts
pub const PAGE_INIT_JS: &str = r#"
document.addEventListener('contextmenu', (e) => e.preventDefault());
window.addEventListener('keydown', (e) => {
  const key = (e.key || '').toLowerCase();
  if (e.key === 'F5' || ((e.ctrlKey || e.metaKey) && key === 'r')) {
    e.preventDefault();
    e.stopImmediatePropagation();
    return false;
  }
}, { capture: true });
"#;

// Minimal script used for lightweight/tray windows
pub const CONTEXT_MENU_BLOCK_JS: &str =
    r#"document.addEventListener('contextmenu', (e) => e.preventDefault());"#;
