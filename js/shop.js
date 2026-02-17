/* ============================================
   CART SYSTEM — REDESIGN COMPLET
   2-step checkout: Coș → Detalii → Confirmare
============================================ */

// ─── STATE ───────────────────────────────────
let cart = [];
let cartCount = 0;
let currentStep = 'items'; // 'items' | 'details' | 'confirm'

// ─── DOM ─────────────────────────────────────
const cartOverlay      = document.getElementById('cartOverlay');
const cartDrawer       = document.getElementById('cartDrawer');
const cartClose        = document.getElementById('cartClose');
const cartButton       = document.getElementById('cartButton');
const cartCountElement = document.getElementById('cartCount');

// ─── OPEN / CLOSE ─────────────────────────────
function openCart() {
    cartOverlay.classList.add('active');
    cartDrawer.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    cartOverlay.classList.remove('active');
    cartDrawer.classList.remove('active');
    document.body.style.overflow = 'auto';
}

if (cartButton)  cartButton.addEventListener('click', openCart);
if (cartClose)   cartClose.addEventListener('click', closeCart);
if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

// ─── STEP NAVIGATION ─────────────────────────
function goToStep(step) {
    const steps = document.querySelectorAll('.cart-step');

    // Exit current panel to left
    const current = document.querySelector('.cart-panel.panel-active');
    if (current) {
        current.classList.remove('panel-active');
        current.classList.add('panel-exit-left');
        setTimeout(() => current.classList.remove('panel-exit-left'), 450);
    }

    // Enter new panel
    setTimeout(() => {
        const next = document.querySelector(`.cart-panel[data-panel="${step}"]`);
        if (next) next.classList.add('panel-active');
    }, 10);

    // Update step indicators
    const stepOrder = ['items', 'details', 'confirm'];
    const targetIdx = stepOrder.indexOf(step);

    steps.forEach((el, i) => {
        el.classList.remove('active', 'done');
        if (i === targetIdx) el.classList.add('active');
        else if (i < targetIdx) el.classList.add('done');
    });

    currentStep = step;
}

// ─── ADD TO CART ──────────────────────────────
function addToCart(product) {
    const item = {
        id: `${product.id}-${Date.now()}`,
        name: product.name,
        price: product.basePrice,
        options: product.selectedOption
    };
    cart.push(item);
    cartCount = cart.length;
    updateCartBadge();
    renderStep1();
    openCart();
    goToStep('items');
    console.log('✅ Produs adăugat:', item);
}

// ─── REMOVE FROM CART ─────────────────────────
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    cartCount = cart.length;
    updateCartBadge();
    renderStep1();
}

// ─── CART BADGE ───────────────────────────────
function updateCartBadge() {
    if (!cartCountElement) return;
    if (cartCount > 0) {
        cartCountElement.textContent = cartCount;
        cartCountElement.style.display = 'flex';
    } else {
        cartCountElement.style.display = 'none';
    }
}

// ─── STEP 1 — ITEMS ───────────────────────────
function renderStep1() {
    const panel = document.querySelector('.cart-panel[data-panel="items"]');
    if (!panel) return;
    const total = cart.reduce((s, i) => s + i.price, 0);

    panel.innerHTML = `
        <div class="cart-items-list" id="cartItemsList">
            ${cart.length === 0 ? `
                <div class="cart-empty">
                    <div class="cart-empty-icon">🛒</div>
                    <p class="cart-empty-text">Coșul e gol...</p>
                    <p class="cart-empty-subtext">Adaugă ceva fain!</p>
                </div>
            ` : cart.map(item => `
                <div class="cart-item">
                    <div class="cart-item-top">
                        <h4>${item.name}</h4>
                        <button class="cart-item-remove" onclick="removeFromCart('${item.id}')">×</button>
                    </div>
                    <p>${item.options}</p>
                    <div class="cart-item-price">${item.price} LEI</div>
                </div>
            `).join('')}
        </div>

        <div class="cart-items-footer">
            <div class="cart-total-row">
                <span class="cart-total-label">Total estimat</span>
                <span class="cart-total-amount">${total}<span>LEI</span></span>
            </div>
            <button class="btn-proceed" id="btnProceed" ${cart.length === 0 ? 'disabled' : ''}>
                CONTINUĂ COMANDA
            </button>
        </div>
    `;

    document.getElementById('btnProceed')?.addEventListener('click', () => {
        renderStep2();
        goToStep('details');
    });
}

// ─── STEP 2 — DETALII ─────────────────────────
function renderStep2() {
    const panel = document.querySelector('.cart-panel[data-panel="details"]');
    if (!panel) return;
    const total = cart.reduce((s, i) => s + i.price, 0);

    panel.innerHTML = `
        <div class="details-header">
            <h3>Detalii comandă</h3>
            <p>Completează datele tale ca Matteo să te poată contacta</p>
        </div>

        <div class="order-summary-mini">
            <h4>Sumar</h4>
            ${cart.map(item => `
                <div class="summary-item">
                    <div>
                        <div class="summary-item-name">${item.name}</div>
                        <div class="summary-item-detail">${item.options}</div>
                    </div>
                    <span class="summary-item-price">${item.price} LEI</span>
                </div>
            `).join('')}
            <div class="summary-total">
                <span class="summary-total-label">TOTAL</span>
                <span class="summary-total-price">${total} LEI</span>
            </div>
        </div>

        <div class="client-fields">
            <div class="input-row">
                <div class="input-field">
                    <label>Numele tău <span class="required">*</span></label>
                    <input type="text" id="clientName" placeholder="Ex: Alex Popescu" autocomplete="name">
                </div>
                <div class="input-field">
                    <label>Telefon <span class="required">*</span></label>
                    <input type="tel" id="clientPhone" placeholder="07xx xxx xxx" autocomplete="tel">
                </div>
            </div>
            <div class="note-field">
                <label>Notă pentru artist <span class="optional">(opțional)</span></label>
                <textarea id="orderNote" placeholder="Ex: vreau ceva urban, referințe la..."></textarea>
            </div>
        </div>

        <span class="send-label">Trimite comanda via:</span>
        <div class="send-buttons">
            <button class="btn-whatsapp" id="btnWhatsApp">
                <span class="btn-send-icon">💬</span>
                WhatsApp
                <span class="btn-send-sub">mesaj direct</span>
            </button>
            <button class="btn-email" id="btnEmail">
                <span class="btn-send-icon">✉️</span>
                Email
                <span class="btn-send-sub">hello@matteolungu.art</span>
            </button>
        </div>

        <button class="btn-back-step" id="btnBackStep">← înaopoi la coș</button>

        <p class="cart-disclaimer">
            Plata și detaliile finale vor fi stabilite direct cu artistul.<br>
            Prețurile afișate sunt orientative.
        </p>
    `;

    document.getElementById('btnBackStep')?.addEventListener('click', () => goToStep('items'));

    document.getElementById('btnWhatsApp')?.addEventListener('click', () => {
        const name  = document.getElementById('clientName')?.value.trim() || '';
        const phone = document.getElementById('clientPhone')?.value.trim() || '';
        const note  = document.getElementById('orderNote')?.value.trim() || '';
        if (!validateFields(name, phone)) return;
        sendOrder('whatsapp', { name, phone, note });
    });

    document.getElementById('btnEmail')?.addEventListener('click', () => {
        const name  = document.getElementById('clientName')?.value.trim() || '';
        const phone = document.getElementById('clientPhone')?.value.trim() || '';
        const note  = document.getElementById('orderNote')?.value.trim() || '';
        if (!validateFields(name, phone)) return;
        sendOrder('email', { name, phone, note });
    });
}

// Validate required fields
function validateFields(name, phone) {
    const nameInput  = document.getElementById('clientName');
    const phoneInput = document.getElementById('clientPhone');
    let valid = true;
    if (!name) { nameInput.classList.add('input-error'); valid = false; }
    else { nameInput.classList.remove('input-error'); }
    if (!phone) { phoneInput.classList.add('input-error'); valid = false; }
    else { phoneInput.classList.remove('input-error'); }
    return valid;
}


// Send order via WhatsApp or Email
function sendOrder(method, clientData) {
    const { name, phone, note } = clientData;

    if (method === 'whatsapp') {
        const text = generateWhatsAppText(name, phone, note);
        const phoneNum = '40760118315';
        window.open(`https://wa.me/${phoneNum}?text=${encodeURIComponent(text)}`, '_blank');
    } else {
        const subject = encodeURIComponent('Comanda Noua \u2014 Matteo Lungu Art');
        const plainBody = generateEmailPlainText(name, phone, note);
        window.location.href = `mailto:hello@matteolungu.art?subject=${subject}&body=${encodeURIComponent(plainBody)}`;
    }

    renderStep3(method, clientData);
    goToStep('confirm');
}

// WhatsApp - styled receipt
function generateWhatsAppText(name, phone, note) {
    const total = cart.reduce((s, i) => s + i.price, 0);
    const now = new Date();
    const dateStr = now.toLocaleDateString('ro-RO', { day: '2-digit', month: '2-digit', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' });
    const itemLines = cart.map((item, idx) =>
        `  ${idx + 1}. *${item.name}*\n     \u2192 ${item.options} \u2014 *${item.price} LEI*`
    ).join('\n');
    const noteSection = note ? `\n\n\ud83d\udcdd *Nota:* ${note}` : '';

    return `\ud83c\udfa8 *COMANDA NOUA \u2014 MATTEO LUNGU ART*\n` +
        `\ud83d\udcc5 ${dateStr} la ${timeStr}\n` +
        `\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\n\n` +
        `\ud83d\udc64 *CLIENT:* ${name}\n` +
        `\ud83d\udcf1 *TELEFON:* ${phone}\n\n` +
        `\ud83d\uded2 *PRODUSE COMANDATE:*\n${itemLines}` +
        `${noteSection}\n\n` +
        `\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\n` +
        `\ud83d\udcb0 *TOTAL ESTIMAT: ${total} LEI*\n` +
        `\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\u2015\n\n` +
        `Astept sa discutam detaliile! \ud83e\udd1d`;
}

// Email plain text (mailto body)
function generateEmailPlainText(name, phone, note) {
    const total = cart.reduce((s, i) => s + i.price, 0);
    const orderNum = 'ML-' + Date.now().toString().slice(-6);
    const itemLines = cart.map((item, idx) =>
        `${idx + 1}. ${item.name} (${item.options}) - ${item.price} LEI`
    ).join('\n');
    const noteSection = note ? `\n\nNota: ${note}` : '';
    return `COMANDA NOUA #${orderNum}\nMATTEO LUNGU ART\n${'='.repeat(30)}\n\nCLIENT: ${name}\nTELEFON: ${phone}\n\nPRODUSE:\n${itemLines}${noteSection}\n\n${'='.repeat(30)}\nTOTAL ESTIMAT: ${total} LEI\n${'='.repeat(30)}\n\nMultumesc! Astept sa discutam.`;
}


// ─── STEP 3 — CONFIRMARE ──────────────────────
function renderStep3(method, clientData = {}) {
    const panel = document.querySelector('.cart-panel[data-panel="confirm"]');
    if (!panel) return;
    const viaLabel = method === 'whatsapp' ? 'WhatsApp' : 'Email';
    const viaIcon  = method === 'whatsapp' ? '💬' : '✉️';

    panel.innerHTML = `
        <div class="confirm-panel">
            <div class="confirm-icon">🎨</div>
            <h2 class="confirm-title">TRIMIS!</h2>
            <p class="confirm-sub">
                Comanda ta a fost trimisă.<br>Matteo te va contacta în curând.
            </p>

            <div class="confirm-via">
                <span class="confirm-via-label">Via</span>
                <span class="confirm-via-value">${viaIcon} ${viaLabel}</span>
            </div>

            <div class="confirm-steps-list">
                <div class="confirm-step-item">
                    <div class="confirm-step-num">1</div>
                    <p class="confirm-step-text">Matteo verifică comanda și te contactează în max 24h</p>
                </div>
                <div class="confirm-step-item">
                    <div class="confirm-step-num">2</div>
                    <p class="confirm-step-text">Discutați detaliile, referințele și timeline-ul</p>
                </div>
                <div class="confirm-step-item">
                    <div class="confirm-step-num">3</div>
                    <p class="confirm-step-text">Plata și livrarea se stabilesc direct cu artistul</p>
                </div>
            </div>

            <button class="btn-new-order" id="btnNewOrder">+ Comandă altceva</button>
        </div>
    `;

    document.getElementById('btnNewOrder')?.addEventListener('click', () => {
        cart = [];
        cartCount = 0;
        updateCartBadge();
        renderStep1();
        goToStep('items');
    });
}

// ─── INIT ─────────────────────────────────────
function initCart() {
    renderStep1();
    goToStep('items');
}

document.addEventListener('DOMContentLoaded', initCart);

/* ============================================
   LOAD PRODUCTS FROM HTML - Easy to Edit!
============================================ */

function loadCustomServices() {
    const servicesContainer = document.getElementById('customServicesData');
    if (!servicesContainer) {
        console.warn('⚠️ customServicesData not found in HTML!');
        return [];
    }

    const serviceElements = servicesContainer.querySelectorAll('.service-data');
    const services = [];

    serviceElements.forEach(el => {
        const options = Array.from(el.querySelectorAll('.option')).map(opt => opt.textContent.trim());
        services.push({
            id: el.dataset.id,
            name: el.dataset.name,
            basePrice: parseInt(el.dataset.price),
            image: el.dataset.image,
            color: el.dataset.color,
            description: el.dataset.description,
            options: options
        });
    });

    console.log('✅ Loaded', services.length, 'custom services from HTML');
    return services;
}

function loadReadyProducts() {
    const productsContainer = document.getElementById('readyProductsData');
    if (!productsContainer) return [];

    const productElements = productsContainer.querySelectorAll('.product-data');
    const products = [];

    productElements.forEach(el => {
        products.push({
            id: el.dataset.id,
            name: el.dataset.name,
            price: parseInt(el.dataset.price),
            image: el.dataset.image,
            cat: el.dataset.category,
            holo: el.dataset.holo === 'true'
        });
    });

    return products;
}

let customServices = [];
let readyProducts = [];

document.addEventListener('DOMContentLoaded', () => {
    customServices = loadCustomServices();
    readyProducts = loadReadyProducts();
});

/* ============================================
   SHOP PAGE - Product Configurator with TABS
============================================ */

let currentShopTab = 'ready';

const shopPage = document.getElementById('shopPage');
const btnBackToMain = document.getElementById('btnBackToMain');
const shopProductsGrid = document.getElementById('shopProductsGrid');
const mainSections = document.querySelectorAll('.hero, .shop-section, .gallery-section, .contact-section, .event-packages-section, .footer');

function openShopPage(tab = 'ready') {
    shopPage.classList.add('active');
    mainSections.forEach(section => section.style.display = 'none');

    const header = document.getElementById('header');
    if (header) header.style.display = 'none';

    window.scrollTo(0, 0);
    switchShopTab(tab);
}

function closeShopPage() {
    shopPage.classList.remove('active');
    mainSections.forEach(section => section.style.display = '');

    const header = document.getElementById('header');
    if (header) header.style.display = '';

    window.scrollTo(0, 0);
}

if (btnBackToMain) {
    btnBackToMain.addEventListener('click', closeShopPage);
}

document.addEventListener('DOMContentLoaded', () => {
    const orderButtons = document.querySelectorAll('.btn-order');
    orderButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openShopPage();
        });
    });

    const heroBtnShop   = document.querySelector('.hero .btn-primary');
    const heroBtnCustom = document.querySelector('.hero .btn-secondary');

    if (heroBtnShop) {
        heroBtnShop.addEventListener('click', (e) => {
            e.preventDefault();
            openShopPage('ready');
        });
    }

    if (heroBtnCustom) {
        heroBtnCustom.addEventListener('click', (e) => {
            e.preventDefault();
            openShopPage('custom');
        });
    }

    setTimeout(() => {
        const shopCards = document.querySelectorAll('.shop-card, .btn-card');
        shopCards.forEach(card => {
            if (card.classList.contains('btn-murals') || card.closest('.shop-card[data-border="green"]')) {
                return;
            }
            card.addEventListener('click', (e) => {
                e.preventDefault();
                openShopPage();
            });
        });

        const muralButtons = document.querySelectorAll('.btn-murals');
        muralButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
            });
        });
    }, 500);

    const shopTabReady  = document.getElementById('shopTabReady');
    const shopTabCustom = document.getElementById('shopTabCustom');

    if (shopTabReady)  shopTabReady.addEventListener('click',  () => switchShopTab('ready'));
    if (shopTabCustom) shopTabCustom.addEventListener('click', () => switchShopTab('custom'));
});

function switchShopTab(tab) {
    currentShopTab = tab;

    const shopTabReady  = document.getElementById('shopTabReady');
    const shopTabCustom = document.getElementById('shopTabCustom');

    if (shopTabReady && shopTabCustom) {
        if (tab === 'ready') {
            shopTabReady.classList.add('active');
            shopTabCustom.classList.remove('active');
        } else {
            shopTabCustom.classList.add('active');
            shopTabReady.classList.remove('active');
        }
    }

    renderShopProducts();
}

function renderShopProducts() {
    if (!shopProductsGrid) return;
    if (currentShopTab === 'custom') {
        renderCustomServices();
    } else {
        renderReadyProducts();
    }
}

function renderCustomServices() {
    if (customServices.length === 0) {
        shopProductsGrid.innerHTML = '<p style="color:white;text-align:center;padding:40px;">No custom services available.</p>';
        return;
    }

    shopProductsGrid.innerHTML = `
        <div class="configurator-grid">
            ${customServices.map(service => `
                <div class="configurator-item" data-service-id="${service.id}">

                    <div class="configurator-image">
                        <img src="${service.image}" alt="${service.name}">
                        <div class="configurator-price-tag" style="background: ${service.color};">
                            ${service.basePrice} LEI
                        </div>
                    </div>

                    <div class="configurator-content">
                        <div class="configurator-header">
                            <h3>${service.name}</h3>
                            <span class="custom-badge">CUSTOM</span>
                        </div>
                        <p class="configurator-description">${service.description}</p>

                        <div class="configurator-options-wrapper">
                            <p class="configurator-label">Alege configuratia:</p>
                            <div class="configurator-options">
                                ${service.options.map((opt, idx) => `
                                    <button class="config-option-btn ${idx === 0 ? 'active' : ''}"
                                            data-option="${opt}">
                                        ${opt}
                                    </button>
                                `).join('')}
                            </div>
                        </div>

                        <button class="btn-add-to-cart-config" data-service-id="${service.id}">
                            + ADAUGA IN COS
                        </button>
                    </div>

                </div>
            `).join('')}
        </div>
    `;

    attachConfiguratorListeners();
}

function renderReadyProducts() {
    if (readyProducts.length === 0) {
        shopProductsGrid.innerHTML = '<p style="color: white; text-align: center; padding: 40px;">No products available.</p>';
        return;
    }

    shopProductsGrid.innerHTML = `
        <div class="ready-products-grid">
            ${readyProducts.map(product => `
                <div class="ready-product-card ${product.holo ? 'holo-card' : ''}">
                    <div class="ready-product-image">
                        <img src="${product.image}" alt="${product.name}">
                        <div class="ready-product-price">${product.price} LEI</div>
                    </div>
                    <div class="ready-product-content">
                        <span class="ready-product-cat">${product.cat}</span>
                        <h3>${product.name}</h3>
                        <button class="btn-buy-ready" data-product-id="${product.id}">
                            CUMPĂRĂ!
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;

    attachReadyProductListeners();
    attachHoloEffect();
}

function attachHoloEffect() {
    const holoCards = document.querySelectorAll('.ready-product-card.holo-card');

    holoCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect    = card.getBoundingClientRect();
            const x       = e.clientX - rect.left;
            const y       = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    });
}

function attachConfiguratorListeners() {
    document.querySelectorAll('.config-option-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            this.parentElement.querySelectorAll('.config-option-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });

    document.querySelectorAll('.btn-add-to-cart-config').forEach(btn => {
        btn.addEventListener('click', function () {
            const serviceId     = this.getAttribute('data-service-id');
            const service       = customServices.find(s => s.id === serviceId);
            const card          = this.closest('.configurator-item');
            const selectedOption = card.querySelector('.config-option-btn.active').getAttribute('data-option');

            addToCart({
                id: service.id,
                name: service.name,
                basePrice: service.basePrice,
                selectedOption: selectedOption
            });
        });
    });
}

function attachReadyProductListeners() {
    document.querySelectorAll('.btn-buy-ready').forEach(btn => {
        btn.addEventListener('click', function () {
            const productId = this.getAttribute('data-product-id');
            const product   = readyProducts.find(p => p.id === productId);

            addToCart({
                id: product.id,
                name: product.name,
                basePrice: product.price,
                selectedOption: 'Gata Făcut'
            });
        });
    });
}

/* ============================================
   SCROLLING REVIEWS
============================================ */

const REVIEW_DATA = [
    { text: "Cea mai tare caricatura primita vreodata! Liniile sunt superbe.", author: "ALEX M." },
    { text: "Live drawing la nunta a fost hit-ul serii! Toti invitatii au plecat cu amintiri.", author: "MARIA G." },
    { text: "Detaliile din portret sunt incredibile. Exact ce cautam.", author: "DAN S." },
    { text: "Stil unic, urban, diferit de tot ce am vazut pana acum.", author: "ELENA P." },
    { text: "Serviciu rapid si comunicare excelenta. Recomand!", author: "COSMIN T." },
    { text: "Am comandat un Multistarz rare card si arata fenomenal!", author: "IONUT R." }
];

const scrollingReviews = document.getElementById('scrollingReviews');
let lastScrollPos = 0;
const TRIGGER_DISTANCE = 800;  // needs more scroll before next review
const MAX_VISIBLE = 1;         // only 1 review visible at a time
let reviewCount = 0;
let reviewVisible = false;     // cooldown flag

function createReview() {
    // Hard limit — never stack
    if (reviewVisible) return;
    if (document.querySelectorAll('.review-card').length >= MAX_VISIBLE) return;

    reviewVisible = true;

    const data     = REVIEW_DATA[reviewCount % REVIEW_DATA.length];
    const side     = reviewCount % 2 === 0 ? 'left' : 'right';
    const colors   = ['#859F3D', '#FFD700', '#ffffff'];
    const bgColor  = colors[reviewCount % 3];

    // Position: always visible in current viewport (not absolute page position)
    const vpHeight = window.innerHeight;
    const topPx    = Math.floor(vpHeight * 0.25 + Math.random() * vpHeight * 0.4);

    const rotation = (Math.random() * 10) - 5; // subtler rotation

    const review = document.createElement('div');
    review.className = 'review-card';
    review.style.cssText = `
        position: fixed;
        top: ${topPx}px;
        ${side}: 20px;
        transform: rotate(${rotation}deg);
        background: ${bgColor};
        color: #000;
    `;

    review.innerHTML = `
        <div class="review-bubble-tail" style="${side === 'left' ? 'left: 16px;' : 'right: 16px;'} background: ${bgColor};"></div>
        <p class="review-text">"${data.text}"</p>
        <div class="review-author-wrapper">
            <span class="review-divider"></span>
            <p class="review-author">${data.author}</p>
        </div>
        <div class="review-verified">CLIENT HAPPY</div>
    `;

    scrollingReviews.appendChild(review);
    reviewCount++;

    // Remove after 3.5s, then allow next one
    setTimeout(() => {
        review.classList.add('fade-out');
        setTimeout(() => {
            review.remove();
            reviewVisible = false;
        }, 800);
    }, 3500);
}

window.addEventListener('scroll', () => {
    if (shopPage && shopPage.classList.contains('active')) return;

    const currentScroll = window.scrollY;
    const diff = Math.abs(currentScroll - lastScrollPos);

    if (diff > TRIGGER_DISTANCE) {
        lastScrollPos = currentScroll;
        createReview();
    }
});

console.log('🎨 Shop system loaded successfully!');