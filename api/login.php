<?php
/* Login: primește parola prin POST, verifică hash-ul, pornește sesiunea. */
require __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $password = $_POST['password'] ?? '';

    if (password_verify($password, ADMIN_PASSWORD_HASH)) {
        session_regenerate_id(true);
        $_SESSION['ml_admin'] = true;
        header('Location: ../admin/');
        exit;
    }

    header('Location: ../admin/?error=1');
    exit;
}

// GET sau orice altceva -> înapoi la admin
header('Location: ../admin/');
exit;
