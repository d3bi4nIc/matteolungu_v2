<?php
/* Upload imagine (doar autentificat). Returnează URL-ul relativ. */
require __DIR__ . '/config.php';
require_auth();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_out(['error' => 'Metodă invalidă'], 405);
}

if (empty($_FILES['image'])) {
    json_out(['error' => 'Niciun fișier primit'], 400);
}

$f = $_FILES['image'];

if ($f['error'] !== UPLOAD_ERR_OK) {
    json_out(['error' => 'Eroare la upload (cod ' . $f['error'] . ')'], 400);
}

if ($f['size'] > MAX_UPLOAD_BYTES) {
    json_out(['error' => 'Fișier prea mare (max 5MB)'], 400);
}

// Validare: trebuie să fie o imagine reală (getimagesize e în nucleu, fără extensii)
$info = getimagesize($f['tmp_name']);
if ($info === false || empty($info['mime'])) {
    json_out(['error' => 'Fișierul nu este o imagine validă'], 400);
}
$mime = $info['mime'];

$allowed = [
    'image/jpeg' => 'jpg',
    'image/png'  => 'png',
    'image/webp' => 'webp',
    'image/gif'  => 'gif',
];

if (!isset($allowed[$mime])) {
    json_out(['error' => 'Doar imagini permise (jpg, png, webp, gif)'], 400);
}

if (!is_dir(UPLOAD_DIR)) {
    @mkdir(UPLOAD_DIR, 0755, true);
}

$ext  = $allowed[$mime];
$name = 'img_' . date('Ymd_His') . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
$dest = UPLOAD_DIR . '/' . $name;

if (!move_uploaded_file($f['tmp_name'], $dest)) {
    json_out(['error' => 'Nu pot salva fișierul pe server'], 500);
}

json_out(['ok' => true, 'url' => UPLOAD_URL . '/' . $name]);
