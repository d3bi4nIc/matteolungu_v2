<?php
/* Salvează data.json (doar autentificat). Face backup în data.json.bak. */
require __DIR__ . '/config.php';
require_auth();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_out(['error' => 'Metodă invalidă'], 405);
}

$raw  = file_get_contents('php://input');
$data = json_decode($raw, true);

if (!is_array($data)) {
    json_out(['error' => 'JSON invalid'], 400);
}

// Verificare minimă de structură
if (!isset($data['shop']) || !isset($data['shop']['ready']) || !isset($data['shop']['custom'])
    || !isset($data['gallery']) || !isset($data['packages'])) {
    json_out(['error' => 'Structură de date incompletă'], 400);
}

if (!is_array($data['shop']['ready']) || !is_array($data['shop']['custom'])
    || !is_array($data['gallery']) || !is_array($data['packages'])) {
    json_out(['error' => 'Tipuri de date invalide'], 400);
}

// Backup înainte de scriere
if (file_exists(DATA_FILE)) {
    @copy(DATA_FILE, DATA_FILE . '.bak');
}

$json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
if ($json === false) {
    json_out(['error' => 'Nu pot serializa datele'], 500);
}

if (file_put_contents(DATA_FILE, $json, LOCK_EX) === false) {
    json_out(['error' => 'Nu pot scrie data.json. Verifică permisiunile fișierului (664/644).'], 500);
}

json_out(['ok' => true]);
