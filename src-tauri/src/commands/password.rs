use rand::distributions::{Alphanumeric, DistString, Distribution, Uniform};
use rand::thread_rng;
use serde::Serialize;

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
    let length = options.length.clamp(1, 1024);

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

#[derive(Serialize)]
pub struct PasswordStrength {
    pub label: String,
    pub color: String,
    pub pct: f32,
}

#[tauri::command]
pub fn calculate_password_strength_from_password(password: String) -> PasswordStrength {
    let length = password.chars().count();
    if length == 0 {
        return PasswordStrength {
            label: "Weak".to_string(),
            color: "bg-red-500".to_string(),
            pct: 0.0,
        };
    }

    let has_lower = password.chars().any(|c| c.is_ascii_lowercase());
    let has_upper = password.chars().any(|c| c.is_ascii_uppercase());
    let has_numeric = password.chars().any(|c| c.is_ascii_digit());
    let has_symbols = password.chars().any(|c| !c.is_ascii_alphanumeric());

    let mut pool: f64 = 0.0;
    if has_lower {
        pool += 26.0;
    }
    if has_upper {
        pool += 26.0;
    }
    if has_numeric {
        pool += 10.0;
    }
    if has_symbols {
        pool += 32.0; // approximate symbol set size
    }
    if pool == 0.0 {
        pool = 1.0;
    }

    let entropy = pool.log2() * (length as f64);

    if entropy < 35.0 {
        return PasswordStrength {
            label: "Weak".to_string(),
            color: "bg-red-500".to_string(),
            pct: 0.33,
        };
    }
    if entropy < 60.0 {
        return PasswordStrength {
            label: "Fair".to_string(),
            color: "bg-orange-500".to_string(),
            pct: 0.5,
        };
    }
    if entropy < 80.0 {
        return PasswordStrength {
            label: "Good".to_string(),
            color: "bg-yellow-500".to_string(),
            pct: 0.75,
        };
    }
    PasswordStrength {
        label: "Strong".to_string(),
        color: "bg-green-600".to_string(),
        pct: 1.0,
    }
}
