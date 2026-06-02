<?php
/* ============================================
   CONFIG + AUTH HELPERS
   Inclus de toate endpoint-urile din /api.
============================================ */

// ── PAROLA DE ADMIN ─────────────────────────────────────
// Parola default este: matteo2026  (SCHIMB-O!)
//
// Ca să pui o parolă nouă, generează un hash și înlocuiește
// valoarea de mai jos. Variante:
//   PHP:    php -r "echo password_hash('PAROLA_NOUA', PASSWORD_DEFAULT);"
//   Python: python -c "import bcrypt;print(bcrypt.hashpw(b'PAROLA_NOUA', bcrypt.gensalt()).decode())"
//   Online: caută "bcrypt generator" (folosește cu grijă)
define('ADMIN_PASSWORD_HASH', '$2b$12$bEOgVf.QthbZlP2U2ENsUOFhxTvevC9D7RicCArFpRSWGPLWO4jlG');

// ── CĂI ─────────────────────────────────────────────────
define('DATA_FILE',  __DIR__ . '/../data.json');
define('UPLOAD_DIR', __DIR__ . '/../uploads');
define('UPLOAD_URL', 'uploads'); // prefix URL relativ la rădăcina site-ului
define('MAX_UPLOAD_BYTES', 5 * 1024 * 1024); // 5 MB

// ── SESIUNE ─────────────────────────────────────────────
session_set_cookie_params([
    'httponly' => true,
    'samesite' => 'Lax',
    'secure'   => (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off'),
]);
session_start();

// ── HELPERS ─────────────────────────────────────────────
function is_authed() {
    return !empty($_SESSION['ml_admin']);
}

function require_auth() {
    if (!is_authed()) {
        json_out(['error' => 'Neautentificat'], 401);
    }
}

function json_out($data, $code = 200) {
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}
