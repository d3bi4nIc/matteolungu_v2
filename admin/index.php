<?php require __DIR__ . '/../api/config.php'; ?>
<!DOCTYPE html>
<html lang="ro">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="noindex, nofollow">
    <title>Admin · Matteo Lungu</title>
    <link href="https://fonts.googleapis.com/css2?family=Bangers&family=Permanent+Marker&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../css/admin.css">
</head>

<body>

<?php if (!is_authed()): ?>

    <!-- ===== LOGIN ===== -->
    <div class="login-wrap">
        <form class="login-card" method="POST" action="../api/login.php">
            <h1>MATTEO <span>ADMIN</span></h1>
            <p class="login-sub">Autentifică-te ca să editezi site-ul</p>

            <?php if (isset($_GET['error'])): ?>
                <div class="login-error">Parolă greșită. Încearcă din nou.</div>
            <?php endif; ?>

            <input type="password" name="password" placeholder="Parolă" autofocus required>
            <button type="submit">INTRĂ</button>
        </form>
    </div>

<?php else: ?>

    <!-- ===== ADMIN APP ===== -->
    <header class="admin-header">
        <div class="admin-brand">
            <span class="admin-logo">ML</span>
            <div>
                <h1>PANOU ADMIN</h1>
                <p>Editează shop, galerie și pachete</p>
            </div>
        </div>
        <div class="admin-actions">
            <span id="saveStatus" class="save-status"></span>
            <a href="../index.html" target="_blank" class="btn-ghost">Vezi site-ul ↗</a>
            <button id="btnSave" class="btn-save">SALVEAZĂ TOT</button>
            <a href="../api/logout.php" class="btn-ghost">Logout</a>
        </div>
    </header>

    <nav class="admin-tabs">
        <button class="admin-tab active" data-tab="shop">SHOP</button>
        <button class="admin-tab" data-tab="gallery">GALERIE</button>
        <button class="admin-tab" data-tab="packages">PACHETE</button>
    </nav>

    <main class="admin-main">

        <!-- SHOP -->
        <section class="tab-panel active" data-panel="shop">
            <div class="subtabs">
                <button class="subtab active" data-sub="ready">Originals (produse gata)</button>
                <button class="subtab" data-sub="custom">Custom (servicii)</button>
            </div>

            <div class="sub-panel active" data-subpanel="ready">
                <div class="list" id="readyList"></div>
                <button class="btn-add" data-add="ready">+ Adaugă produs</button>
            </div>

            <div class="sub-panel" data-subpanel="custom">
                <div class="list" id="customList"></div>
                <button class="btn-add" data-add="custom">+ Adaugă serviciu</button>
            </div>
        </section>

        <!-- GALLERY -->
        <section class="tab-panel" data-panel="gallery">
            <div class="list" id="galleryList"></div>
            <button class="btn-add" data-add="gallery">+ Adaugă poză</button>
        </section>

        <!-- PACKAGES -->
        <section class="tab-panel" data-panel="packages">
            <div class="list" id="packagesList"></div>
            <button class="btn-add" data-add="packages">+ Adaugă pachet</button>
        </section>

    </main>

    <script src="../js/admin.js"></script>

<?php endif; ?>

</body>

</html>
