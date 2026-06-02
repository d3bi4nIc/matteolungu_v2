# Matteo Lungu — CMS / Panou de Admin

Site static + un mic CMS (PHP) prin care artistul editează **Shop**, **Galerie** și **Pachete**, fără cod. Datele stau în `data.json`, scris de panoul de admin. „Salvează = live instant".

---

## Structura

```
index.html            # site-ul public (citește data.json)
data.json             # sursa de date (shop, galerie, pachete)
css/                  # style.css, shop.css, admin.css
js/                   # data.js (loader), script.js, shop.js, gallery.js, admin.js
admin/index.php       # panoul de admin (login + editor)
api/                  # backend PHP: config, login, logout, save, upload
uploads/              # imaginile încărcate din admin (+ .htaccess de protecție)
```

---

## ⚠️ Important: rulează prin HTTP, nu `file://`

Site-ul citește acum `data.json` cu `fetch()`. Dacă deschizi `index.html` direct de pe disc
(`file://`), browserul **blochează** fetch-ul și shop-ul/galeria/pachetele apar goale.

- **Test local (doar frontend):** în folderul proiectului rulează
  `python -m http.server 8000` și deschide `http://localhost:8000`.
- **Admin / tot CMS-ul:** are nevoie de PHP. Testezi cel mai simplu direct pe Hostico,
  sau local dacă ai PHP: `php -S localhost:8000` (apoi `http://localhost:8000/admin/`).

---

## Deploy pe Hostico (cPanel)

1. Urcă tot conținutul proiectului în `public_html` (sau folderul domeniului).
2. Asigură-te că **PHP** e activ (cPanel → „Select PHP Version", recomandat 8.x).
3. Activează **SSL gratuit** (cPanel → „SSL/TLS Status" → AutoSSL / Let's Encrypt).
   Necesar ca parola să nu circule în clar.
4. Permisiuni:
   - `data.json` → **644** (sau 664 dacă serverul cere). PHP trebuie să-l poată **scrie**.
   - folderul `uploads/` → **755** și să poată fi scris de PHP.
5. **Schimbă parola de admin** (vezi mai jos). Default-ul e public în acest repo!

Accesezi panoul la: `https://domeniul-tau.ro/admin/`

---

## Schimbarea parolei de admin

Parola default este **`matteo2026`** — schimb-o obligatoriu.

1. Generează un hash nou:
   - PHP: `php -r "echo password_hash('PAROLA_NOUA', PASSWORD_DEFAULT);"`
   - Python: `python -c "import bcrypt;print(bcrypt.hashpw(b'PAROLA_NOUA', bcrypt.gensalt()).decode())"`
2. În `api/config.php`, înlocuiește valoarea din `define('ADMIN_PASSWORD_HASH', '...')`.

---

## Cum folosește artistul panoul

1. Intră pe `/admin/`, se loghează.
2. Alege tab-ul: **Shop** (Originals / Custom), **Galerie** sau **Pachete**.
3. Editează câmpurile, adaugă/șterge/reordonează elemente (↑ ↓ ✕).
4. Imagini: lipește un **URL** sau apasă **⬆ Upload** ca să încarce o poză de pe calculator.
5. Apasă **SALVEAZĂ TOT**. Modificările apar imediat pe site.

La fiecare salvare se face automat un backup în `data.json.bak`.

---

## Securitate (rezumat)

- Login cu parolă (bcrypt) + sesiune PHP; endpoint-urile de scriere verifică sesiunea.
- Upload-ul acceptă doar imagini (jpg/png/webp/gif), max 5MB, nume randomizat.
- `uploads/.htaccess` blochează execuția de scripturi în folderul de uploads.
- `.htaccess` (rădăcină) blochează accesul la fișierele `.bak`.
- Folosește HTTPS.
