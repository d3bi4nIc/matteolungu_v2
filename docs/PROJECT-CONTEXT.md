# Project Context — matteolungu_v2

> Context pentru orice sesiune nouă de dezvoltare (inclusiv Claude Code pe alt
> calculator). Pentru pașii de rulare/deploy vezi `CMS-SETUP.md` din rădăcină.

## Ce este
Site de portofoliu static (HTML/CSS/JS vanilla) pentru artistul Matteo Lungu +
un **CMS custom, scris de noi** (nu plătit), prin care artistul editează singur
**Shop**, **Galerie** și **Pachete**, fără să umble în cod.

## Hosting
Țintă: **Hostico cPanel** (PHP + MySQL + SSL gratuit Let's Encrypt). Ales pentru
că e ieftin și suportă PHP — necesar pentru „save = live instant".

## Arhitectură
- **`data.json`** = sursa unică de adevăr: `shop.ready[]`, `shop.custom[]`,
  `gallery[]`, `packages[]`.
- **`js/data.js`** încarcă `data.json` cu `fetch` și expune `window.siteDataReady`
  (Promise) + `window.SITE_DATA`.
- **Frontend** (`shop.js`, `gallery.js`, `script.js`) randează din `data.json`:
  - shop.js → produse Originals + servicii Custom
  - gallery.js → overlay-ul galeriei + preview-ul de 6 poze de pe homepage
  - script.js → cardurile de pachete
- **`/admin/index.php`** = panou de admin (login + editor cu tab-uri Shop/Galerie/Pachete).
- **`js/admin.js`** + **`css/admin.css`** = UI editor: add/edit/delete/reorder,
  imagine prin URL sau upload, buton „SALVEAZĂ TOT".
- **`/api/`** (PHP):
  - `config.php` — auth bcrypt + helpers (parola default `matteo2026`, **de schimbat**)
  - `login.php` / `logout.php` — sesiune
  - `save.php` — scrie `data.json` (+ backup `data.json.bak`, validare structură)
  - `upload.php` — upload imagini (validare cu `getimagesize`, doar jpg/png/webp/gif, max 5MB)
- **`/uploads/`** — imaginile încărcate (gitignored, doar `.htaccess` în repo).

## Structura datelor (data.json)
- `shop.ready[]`: `{id, name, price(number), image, cat, holo(bool)}`
- `shop.custom[]`: `{id, name, basePrice(number), image, color(hex), description, options[]}`
- `gallery[]`: `{id, category, title, description, image}` (category: caricaturi|portrete|murale|collectibles)
- `packages[]`: `{id, color(white|green|yellow), name, duration, description, features[], price(text), popular(bool)}`

## Securitate
- Endpoint-urile de scriere verifică sesiunea (`require_auth`).
- `uploads/.htaccess` blochează execuția de scripturi; `.htaccess` (root) blochează `.bak`.
- A se folosi HTTPS în producție. Parola NU ar trebui ținută în repo pe termen lung
  (ok doar pentru dev local).

## Rulare locală (rezumat)
Necesită PHP. Windows: `start-local.bat`. macOS/Linux: `./start-local.command`
(sau `php -c php.dev.ini -S localhost:8000`). NU merge prin `file://` (fetch blocat).
macOS nu vine cu PHP → `brew install php`.

## Verificat (2026-06-02)
Backend PHP testat end-to-end: login corect/greșit, save (autentificat → scrie
data.json; neautentificat → 401), upload imagine. Frontend servit OK; randarea
în browser nu a fost testată headless.

## DE FĂCUT (în ordinea cerută de client)
1. **Texte NEeditabile încă** — hero/contact, linkuri social, email/WhatsApp NU sunt
   în CMS (amânat intenționat). Următorul candidat de extindere a CMS-ului.
2. **Cod mort `.hero-right`** în `css/style.css` (~150 linii sticker `display:none`,
   HTML comentat) — de șters.
3. **Placeholdere** — toate imaginile sunt `picsum.photos`; pachetul „STARTER EVENT"
   are feature-ul text „Încă ceva nu știu ce".

## Istoric decizii relevante
- Curățare CSS făcută: eliminat duplicate (`.cart-button`/`.cart-count`, blocuri
  `@media` hero repetate, `body.menu-open` dublu, prima `.badge-corner`,
  `.mobile-menu .btn-order` redundant) + scos `@import`-ul de fonturi redundant.
- Bug-uri reparate: atribute SVG camelCase → kebab-case, emoji mojibake (✨🎨🚀✅),
  email unificat la `hello@matteolungu.art`.
