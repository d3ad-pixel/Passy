use rand::distributions::{Alphanumeric, DistString, Distribution, Uniform};
use rand::thread_rng;

#[derive(serde::Deserialize)]
pub struct PasswordOptions {
    pub length: usize,
    pub use_alpha: bool,
    pub use_numeric: bool,
    pub use_symbols: bool,
    /// When true, exclude look‑alike characters such as 0/O and 1/l/I
    #[serde(default)]
    pub avoid_ambiguous: bool,
}

fn build_charset(options: &PasswordOptions) -> Vec<char> {
    let mut charset: Vec<char> = Vec::new();

    if options.use_alpha {
        charset.extend('a'..='z');
        charset.extend('A'..='Z');
    }
    if options.use_numeric {
        charset.extend('0'..='9');
    }
    if options.use_symbols {
        // Common symbol set
        let symbols = r#"!@#$%^&*()-_=+[]{};:'",.<>/?\|`~"#;
        charset.extend(symbols.chars());
    }

    if options.avoid_ambiguous {
        // Remove characters that are commonly confused
        // This set mirrors many password generators: ilLI|1 oO0
        let ambiguous: [char; 12] = ['i', 'l', 'I', 'L', '|', '1', 'o', 'O', '0', 'S', '5', '2'];
        charset.retain(|c| !ambiguous.contains(c));
    }

    if charset.is_empty() {
        // Default to alphanumeric if user unchecks everything
        charset.extend('a'..='z');
        charset.extend('A'..='Z');
        charset.extend('0'..='9');
    }

    charset
}

#[tauri::command]
pub fn generate_password(options: PasswordOptions) -> String {
    let mut rng = thread_rng();
    let length = options.length.max(1).min(1024);

    // Fast path using the built-in Alphanumeric distribution when applicable
    if options.use_alpha && options.use_numeric && !options.use_symbols {
        return Alphanumeric.sample_string(&mut rng, length);
    }

    // Otherwise, build a custom charset and sample indices using a Uniform distribution
    let charset = build_charset(&options);
    let index_dist = Uniform::from(0..charset.len());

    (0..length)
        .map(|_| {
            let idx = index_dist.sample(&mut rng);
            charset[idx]
        })
        .collect()
}
