/* ============================================
   ADMIN PANEL LOGIC — Matteo Lungu CMS
   Editează data.json (shop / galerie / pachete).
============================================ */

let state = { shop: { ready: [], custom: [] }, gallery: [], packages: [] };
let dirty = false;

const GALLERY_CATEGORIES = ['caricaturi', 'portrete', 'murale', 'collectibles'];
const PACKAGE_COLORS = ['white', 'green', 'yellow'];

// ─── HELPERS ─────────────────────────────────
function esc(s) {
    return String(s == null ? '' : s)
        .replace(/&/g, '&amp;').replace(/"/g, '&quot;')
        .replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function resolveImg(url) {
    if (!url) return '';
    if (/^https?:\/\//i.test(url) || url.startsWith('/') || url.startsWith('data:')) return url;
    return '../' + url; // uploads/.. sunt relative la rădăcina site-ului
}

function arr(section) {
    if (section === 'ready') return state.shop.ready;
    if (section === 'custom') return state.shop.custom;
    return state[section];
}

function selectOptions(values, current) {
    const list = values.includes(current) || !current ? values : [current, ...values];
    return list.map(v => `<option value="${esc(v)}" ${v === current ? 'selected' : ''}>${esc(v)}</option>`).join('');
}

// ─── ITEM CONTROLS (right column) ────────────
function itemControls(section, i) {
    return `
        <div class="item-controls">
            <button class="ctrl-btn" data-move="up"   data-section="${section}" data-index="${i}" title="Sus">↑</button>
            <button class="ctrl-btn" data-move="down" data-section="${section}" data-index="${i}" title="Jos">↓</button>
            <button class="ctrl-btn ctrl-del" data-del data-section="${section}" data-index="${i}" title="Șterge">✕</button>
        </div>`;
}

function imageField(section, i, image) {
    return `
        <div class="field img-field">
            <label>Imagine (URL sau upload)</label>
            <div class="img-controls">
                <input data-section="${section}" data-index="${i}" data-field="image"
                       value="${esc(image)}" placeholder="https://... sau uploads/...">
                <button type="button" class="btn-upload" data-upload data-section="${section}" data-index="${i}">⬆ Upload</button>
            </div>
        </div>`;
}

// ─── CARD TEMPLATES ──────────────────────────
function readyCard(p, i) {
    return `
    <div class="item-card">
        <img class="item-thumb" src="${resolveImg(p.image)}" alt="" onerror="this.style.opacity=0.2">
        <div class="item-fields">
            <div class="field-row">
                <div class="field"><label>Nume</label>
                    <input data-section="ready" data-index="${i}" data-field="name" value="${esc(p.name)}"></div>
                <div class="field"><label>Preț (LEI)</label>
                    <input type="number" data-section="ready" data-index="${i}" data-field="price" data-type="number" value="${esc(p.price)}"></div>
            </div>
            <div class="field-row">
                <div class="field"><label>Categorie</label>
                    <input data-section="ready" data-index="${i}" data-field="cat" value="${esc(p.cat)}" placeholder="Collectibles / Paintings / Merch"></div>
                <div class="field field-check">
                    <input type="checkbox" id="holo-${i}" data-section="ready" data-index="${i}" data-field="holo" data-type="bool" ${p.holo ? 'checked' : ''}>
                    <label for="holo-${i}">Efect holografic</label>
                </div>
            </div>
            ${imageField('ready', i, p.image)}
        </div>
        ${itemControls('ready', i)}
    </div>`;
}

function customCard(s, i) {
    return `
    <div class="item-card">
        <img class="item-thumb" src="${resolveImg(s.image)}" alt="" onerror="this.style.opacity=0.2">
        <div class="item-fields">
            <div class="field-row">
                <div class="field"><label>Nume</label>
                    <input data-section="custom" data-index="${i}" data-field="name" value="${esc(s.name)}"></div>
                <div class="field"><label>Preț de la (LEI)</label>
                    <input type="number" data-section="custom" data-index="${i}" data-field="basePrice" data-type="number" value="${esc(s.basePrice)}"></div>
                <div class="field"><label>Culoare tag</label>
                    <input type="color" data-section="custom" data-index="${i}" data-field="color" value="${esc(s.color || '#859F3D')}"></div>
            </div>
            <div class="field"><label>Descriere</label>
                <textarea data-section="custom" data-index="${i}" data-field="description">${esc(s.description)}</textarea></div>
            <div class="field"><label>Opțiuni (una pe linie)</label>
                <textarea data-section="custom" data-index="${i}" data-field="options" data-type="list">${esc((s.options || []).join('\n'))}</textarea></div>
            ${imageField('custom', i, s.image)}
        </div>
        ${itemControls('custom', i)}
    </div>`;
}

function galleryCard(p, i) {
    return `
    <div class="item-card">
        <img class="item-thumb" src="${resolveImg(p.image)}" alt="" onerror="this.style.opacity=0.2">
        <div class="item-fields">
            <div class="field-row">
                <div class="field"><label>Titlu</label>
                    <input data-section="gallery" data-index="${i}" data-field="title" value="${esc(p.title)}"></div>
                <div class="field"><label>Categorie</label>
                    <select data-section="gallery" data-index="${i}" data-field="category">
                        ${selectOptions(GALLERY_CATEGORIES, p.category)}
                    </select></div>
            </div>
            <div class="field"><label>Descriere</label>
                <textarea data-section="gallery" data-index="${i}" data-field="description">${esc(p.description)}</textarea></div>
            ${imageField('gallery', i, p.image)}
        </div>
        ${itemControls('gallery', i)}
    </div>`;
}

function packageCard(p, i) {
    return `
    <div class="item-card">
        <div class="item-fields" style="grid-column: 1 / -1;">
            <div class="field-row">
                <div class="field"><label>Nume pachet</label>
                    <input data-section="packages" data-index="${i}" data-field="name" value="${esc(p.name)}"></div>
                <div class="field"><label>Durată</label>
                    <input data-section="packages" data-index="${i}" data-field="duration" value="${esc(p.duration)}" placeholder="2 ORE / FULL EVENT"></div>
            </div>
            <div class="field-row">
                <div class="field"><label>Preț (text)</label>
                    <input data-section="packages" data-index="${i}" data-field="price" value="${esc(p.price)}" placeholder="500 LEI / CONTACT"></div>
                <div class="field"><label>Culoare card</label>
                    <select data-section="packages" data-index="${i}" data-field="color">
                        ${selectOptions(PACKAGE_COLORS, p.color)}
                    </select></div>
                <div class="field field-check">
                    <input type="checkbox" id="pop-${i}" data-section="packages" data-index="${i}" data-field="popular" data-type="bool" ${p.popular ? 'checked' : ''}>
                    <label for="pop-${i}">Badge POPULAR</label>
                </div>
            </div>
            <div class="field"><label>Descriere</label>
                <textarea data-section="packages" data-index="${i}" data-field="description">${esc(p.description)}</textarea></div>
            <div class="field"><label>Feature-uri (una pe linie)</label>
                <textarea data-section="packages" data-index="${i}" data-field="features" data-type="list">${esc((p.features || []).join('\n'))}</textarea></div>
        </div>
        ${itemControls('packages', i)}
    </div>`;
}

// ─── RENDER ──────────────────────────────────
const RENDERERS = {
    ready:    { id: 'readyList',    tpl: readyCard,    empty: 'Niciun produs. Adaugă unul mai jos.' },
    custom:   { id: 'customList',   tpl: customCard,   empty: 'Niciun serviciu custom.' },
    gallery:  { id: 'galleryList',  tpl: galleryCard,  empty: 'Nicio poză în galerie.' },
    packages: { id: 'packagesList', tpl: packageCard,  empty: 'Niciun pachet.' },
};

function renderSection(section) {
    const cfg = RENDERERS[section];
    const container = document.getElementById(cfg.id);
    if (!container) return;
    const list = arr(section);
    container.innerHTML = list.length
        ? list.map((item, i) => cfg.tpl(item, i)).join('')
        : `<p class="empty-note">${cfg.empty}</p>`;
}

function renderAll() {
    Object.keys(RENDERERS).forEach(renderSection);
}

// ─── STATE UPDATES ───────────────────────────
function onFieldChange(e) {
    const el = e.target.closest('[data-field]');
    if (!el) return;
    const section = el.dataset.section;
    const index = parseInt(el.dataset.index, 10);
    const field = el.dataset.field;
    const type = el.dataset.type;
    const list = arr(section);
    if (!list || !list[index]) return;

    let val;
    if (type === 'bool') val = el.checked;
    else if (type === 'number') val = parseInt(el.value, 10) || 0;
    else if (type === 'list') val = el.value.split('\n').map(s => s.trim()).filter(Boolean);
    else val = el.value;

    list[index][field] = val;
    markDirty();
}

function blankItem(section) {
    const id = section.slice(0, 4) + '-' + Date.now();
    if (section === 'ready')    return { id, name: 'Produs nou', price: 0, image: '', cat: '', holo: false };
    if (section === 'custom')   return { id, name: 'Serviciu nou', basePrice: 0, image: '', color: '#859F3D', description: '', options: [] };
    if (section === 'gallery')  return { id, category: 'caricaturi', title: 'Poză nouă', description: '', image: '' };
    if (section === 'packages') return { id, color: 'white', name: 'PACHET NOU', duration: '', description: '', features: [], price: '', popular: false };
}

// ─── CLICK ACTIONS ───────────────────────────
let uploadTarget = null;
const fileInput = document.createElement('input');
fileInput.type = 'file';
fileInput.accept = 'image/*';
fileInput.style.display = 'none';
document.body.appendChild(fileInput);

fileInput.addEventListener('change', async () => {
    const file = fileInput.files[0];
    if (!file || !uploadTarget) return;
    const { section, index } = uploadTarget;

    const fd = new FormData();
    fd.append('image', file);
    setStatus('Se încarcă imaginea...', 'saving');

    try {
        const res = await fetch('../api/upload.php', { method: 'POST', body: fd });
        const j = await res.json();
        if (j.ok) {
            arr(section)[index].image = j.url;
            renderSection(section);
            markDirty();
            setStatus('Imagine încărcată ✓', 'ok');
            toast('Imagine încărcată ✓');
        } else {
            toast(j.error || 'Eroare la upload', true);
            setStatus('Eroare upload', 'err');
        }
    } catch (err) {
        toast('Eroare de rețea la upload', true);
        setStatus('Eroare upload', 'err');
    }

    fileInput.value = '';
    uploadTarget = null;
});

document.addEventListener('click', (e) => {
    // ── ADD ──
    const add = e.target.closest('[data-add]');
    if (add) {
        const section = add.dataset.add;
        arr(section).push(blankItem(section));
        renderSection(section);
        markDirty();
        return;
    }

    // ── DELETE ──
    const del = e.target.closest('[data-del]');
    if (del) {
        const section = del.dataset.section;
        const i = parseInt(del.dataset.index, 10);
        if (confirm('Sigur ștergi acest element?')) {
            arr(section).splice(i, 1);
            renderSection(section);
            markDirty();
        }
        return;
    }

    // ── MOVE ──
    const move = e.target.closest('[data-move]');
    if (move) {
        const section = move.dataset.section;
        const i = parseInt(move.dataset.index, 10);
        const dir = move.dataset.move === 'up' ? -1 : 1;
        const list = arr(section);
        const j = i + dir;
        if (j >= 0 && j < list.length) {
            [list[i], list[j]] = [list[j], list[i]];
            renderSection(section);
            markDirty();
        }
        return;
    }

    // ── UPLOAD ──
    const up = e.target.closest('[data-upload]');
    if (up) {
        uploadTarget = { section: up.dataset.section, index: parseInt(up.dataset.index, 10) };
        fileInput.click();
        return;
    }

    // ── TABS ──
    const tab = e.target.closest('.admin-tab');
    if (tab) {
        document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        document.querySelector(`.tab-panel[data-panel="${tab.dataset.tab}"]`)?.classList.add('active');
        return;
    }

    // ── SUBTABS ──
    const sub = e.target.closest('.subtab');
    if (sub) {
        const parent = sub.closest('.tab-panel');
        parent.querySelectorAll('.subtab').forEach(s => s.classList.remove('active'));
        parent.querySelectorAll('.sub-panel').forEach(p => p.classList.remove('active'));
        sub.classList.add('active');
        parent.querySelector(`.sub-panel[data-subpanel="${sub.dataset.sub}"]`)?.classList.add('active');
        return;
    }

    // ── SAVE ──
    if (e.target.closest('#btnSave')) {
        save();
    }
});

document.addEventListener('input', onFieldChange);
document.addEventListener('change', onFieldChange);

// ─── SAVE ────────────────────────────────────
async function save() {
    const btn = document.getElementById('btnSave');
    setStatus('Se salvează...', 'saving');
    btn.disabled = true;

    try {
        const res = await fetch('../api/save.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(state)
        });
        const j = await res.json();
        if (j.ok) {
            dirty = false;
            setStatus('Salvat ✓', 'ok');
            toast('Salvat cu succes ✓ Site-ul e actualizat.');
        } else {
            setStatus('Eroare', 'err');
            toast(j.error || 'Eroare la salvare', true);
        }
    } catch (err) {
        setStatus('Eroare', 'err');
        toast('Eroare de rețea la salvare', true);
    }

    btn.disabled = false;
}

// ─── STATUS + TOAST ──────────────────────────
function setStatus(text, cls) {
    const el = document.getElementById('saveStatus');
    if (!el) return;
    el.textContent = text;
    el.className = 'save-status ' + (cls || '');
}

function markDirty() {
    dirty = true;
    setStatus('Modificări nesalvate', 'saving');
}

let toastTimer = null;
function toast(msg, isError) {
    let el = document.querySelector('.toast');
    if (!el) {
        el = document.createElement('div');
        el.className = 'toast';
        document.body.appendChild(el);
    }
    el.textContent = msg;
    el.classList.toggle('err', !!isError);
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 3000);
}

window.addEventListener('beforeunload', (e) => {
    if (dirty) { e.preventDefault(); e.returnValue = ''; }
});

// ─── INIT ────────────────────────────────────
async function init() {
    try {
        const res = await fetch('../data.json', { cache: 'no-store' });
        const data = await res.json();
        state = {
            shop: {
                ready: (data.shop && data.shop.ready) || [],
                custom: (data.shop && data.shop.custom) || []
            },
            gallery: data.gallery || [],
            packages: data.packages || []
        };
    } catch (err) {
        toast('Nu am putut încărca data.json', true);
    }
    renderAll();
    setStatus('Gata de editare', 'ok');
}

init();
