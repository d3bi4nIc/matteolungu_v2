/* ============================================
   CART SYSTEM - Shopping Cart Management
============================================ */

// Cart State
let cart = [];
let cartCount = 0;

// DOM Elements
const cartOverlay = document.getElementById('cartOverlay');
const cartDrawer = document.getElementById('cartDrawer');
const cartClose = document.getElementById('cartClose');
const cartButton = document.getElementById('cartButton');
const cartCountElement = document.getElementById('cartCount');
const cartEmpty = document.getElementById('cartEmpty');
const cartItemsList = document.getElementById('cartItemsList');
const cartTotalAmount = document.getElementById('cartTotalAmount');
const btnWhatsApp = document.getElementById('btnWhatsApp');
const btnEmail = document.getElementById('btnEmail');

// Open Cart
function openCart() {
    cartOverlay.classList.add('active');
    cartDrawer.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close Cart
function closeCart() {
    cartOverlay.classList.remove('active');
    cartDrawer.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Event Listeners for Cart
if (cartButton) {
    cartButton.addEventListener('click', openCart);
}

if (cartClose) {
    cartClose.addEventListener('click', closeCart);
}

if (cartOverlay) {
    cartOverlay.addEventListener('click', closeCart);
}

// Add to Cart
function addToCart(product) {
    const item = {
        id: `${product.id}-${Date.now()}`,
        name: product.name,
        price: product.basePrice,
        options: product.selectedOption
    };

    cart.push(item);
    cartCount = cart.length;
    updateCart();
    openCart();

    console.log('✅ Produs adăugat:', item);
}

// Remove from Cart
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    cartCount = cart.length;
    updateCart();
}

// Update Cart UI
function updateCart() {
    if (cartCountElement) {
        if (cartCount > 0) {
            cartCountElement.textContent = cartCount;
            cartCountElement.style.display = 'flex';
        } else {
            cartCountElement.style.display = 'none';
        }
    }

    if (cart.length === 0) {
        cartEmpty.style.display = 'flex';
        cartItemsList.innerHTML = '';
        cartTotalAmount.textContent = '0 LEI';
        btnWhatsApp.disabled = true;
        btnEmail.disabled = true;
    } else {
        cartEmpty.style.display = 'none';
        renderCartItems();
        updateTotal();
        btnWhatsApp.disabled = false;
        btnEmail.disabled = false;
    }
}

// Render Cart Items
function renderCartItems() {
    cartItemsList.innerHTML = cart.map(item => `
        <div class="cart-item">
            <button class="cart-item-remove" onclick="removeFromCart('${item.id}')">×</button>
            <h4>${item.name}</h4>
            <p>${item.options}</p>
            <div class="cart-item-price">${item.price} LEI</div>
        </div>
    `).join('');
}

// Update Total
function updateTotal() {
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    cartTotalAmount.textContent = `${total} LEI`;
}

// Generate Order Text
function generateOrderText() {
    const list = cart.map((item, idx) =>
        `${idx + 1}. ${item.name} (${item.options}) - ${item.price} LEI`
    ).join('\n');

    const total = cart.reduce((sum, item) => sum + item.price, 0);

    return `Salut Matteo! Vreau să comand:\n\n${list}\n\nTOTAL: ${total} LEI\n\nMultumesc!`;
}

// WhatsApp Order
if (btnWhatsApp) {
    btnWhatsApp.addEventListener('click', () => {
        const text = encodeURIComponent(generateOrderText());
        const phone = '40760118315';
        window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
    });
}

// Email Order
if (btnEmail) {
    btnEmail.addEventListener('click', () => {
        const subject = encodeURIComponent('Comandă Nouă Matteo Lungu Art');
        const body = encodeURIComponent(generateOrderText());
        window.location.href = `mailto:hello@matteolungu.art?subject=${subject}&body=${body}`;
    });
}

/* ============================================
   LOAD PRODUCTS FROM HTML - Easy to Edit!
============================================ */

// Load Custom Services from HTML
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

// Load Ready Products from HTML
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
            holo: el.dataset.holo === 'true' // ADD THIS
        });
    });

    return products;
}

// Load products when page loads
let customServices = [];
let readyProducts = [];

document.addEventListener('DOMContentLoaded', () => {
    customServices = loadCustomServices();
    readyProducts = loadReadyProducts();
});

/* ============================================
   SHOP PAGE - Product Configurator with TABS
============================================ */

// Current Tab State
let currentShopTab = 'ready';

// DOM Elements
const shopPage = document.getElementById('shopPage');
const btnBackToMain = document.getElementById('btnBackToMain');
const shopProductsGrid = document.getElementById('shopProductsGrid');
const mainSections = document.querySelectorAll('.hero, .shop-section, .gallery-section, .contact-section, .event-packages-section, .footer');

// Open Shop Page with specific tab
function openShopPage(tab = 'ready') {
    console.log('🛒 Opening shop page on tab:', tab);
    shopPage.classList.add('active');
    mainSections.forEach(section => section.style.display = 'none');

    const header = document.getElementById('header');
    if (header) header.style.display = 'none';

    window.scrollTo(0, 0);

    // Switch to specified tab
    switchShopTab(tab);
}

// Close Shop Page
function closeShopPage() {
    console.log('🏠 Closing shop page...');
    shopPage.classList.remove('active');
    mainSections.forEach(section => section.style.display = '');

    // SHOW HEADER AGAIN - ADD THIS
    const header = document.getElementById('header');
    if (header) header.style.display = '';

    window.scrollTo(0, 0);
}

// Event Listeners
if (btnBackToMain) {
    btnBackToMain.addEventListener('click', closeShopPage);
}

// Make ALL shop buttons work
document.addEventListener('DOMContentLoaded', () => {
    // ORDER buttons in header
    const orderButtons = document.querySelectorAll('.btn-order');
    orderButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openShopPage();
        });
    });

    // Hero buttons - SPECIFIC TABS
    const heroBtnShop = document.querySelector('.hero .btn-primary'); // SHOP NOW
    const heroBtnCustom = document.querySelector('.hero .btn-secondary'); // CUSTOM ART

    if (heroBtnShop) {
        heroBtnShop.addEventListener('click', (e) => {
            e.preventDefault();
            openShopPage('ready'); // Open MAGAZIN tab
        });
    }

    if (heroBtnCustom) {
        heroBtnCustom.addEventListener('click', (e) => {
            e.preventDefault();
            openShopPage('custom'); // Open CUSTOM tab
        });
    }

    // Shop cards from main page
    setTimeout(() => {
        const shopCards = document.querySelectorAll('.shop-card, .btn-card');
        shopCards.forEach(card => {
            // Skip murals card
            if (card.classList.contains('btn-murals') || card.closest('.shop-card[data-border="green"]')) {
                return; // Don't add shop listener
            }

            card.addEventListener('click', (e) => {
                e.preventDefault();
                openShopPage();
            });
        });

        // Murals button goes to contact
        const muralButtons = document.querySelectorAll('.btn-murals');
        muralButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
            });
        });
    }, 500);

    // Tab buttons
    const shopTabReady = document.getElementById('shopTabReady');
    const shopTabCustom = document.getElementById('shopTabCustom');

    if (shopTabReady) {
        shopTabReady.addEventListener('click', () => switchShopTab('ready'));
    }

    if (shopTabCustom) {
        shopTabCustom.addEventListener('click', () => switchShopTab('custom'));
    }
});

// Tab Switching
function switchShopTab(tab) {
    console.log('📑 Switching to tab:', tab);
    currentShopTab = tab;

    const shopTabReady = document.getElementById('shopTabReady');
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

// Render Shop Products based on current tab
function renderShopProducts() {
    if (!shopProductsGrid) {
        console.error('❌ shopProductsGrid not found!');
        return;
    }

    if (currentShopTab === 'custom') {
        renderCustomServices();
    } else {
        renderReadyProducts();
    }
}

// Render Custom Services
function renderCustomServices() {
    if (customServices.length === 0) {
        shopProductsGrid.innerHTML = '<p style="color: white; text-align: center; padding: 40px;">No custom services available. Add them in HTML!</p>';
        return;
    }

    shopProductsGrid.innerHTML = customServices.map(service => {
        return `
            <div class="configurator-item" data-service-id="${service.id}">
                <div class="configurator-image">
                    <img src="${service.image}" alt="${service.name}">
                    <div class="configurator-price-tag" style="background: ${service.color};">
                        ${service.basePrice} LEI
                    </div>
                </div>
                
                <div class="configurator-content">
                    <div class="configurator-header">
                        <div>
                            <h3>${service.name}</h3>
                            <p class="configurator-description">${service.description}</p>
                        </div>
                        <span class="custom-badge">CUSTOM REQUEST</span>
                    </div>
                    
                    <div class="configurator-options-wrapper">
                        <p class="configurator-label">Alege Configurația:</p>
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
                        ADAUGĂ ÎN COȘ!
                    </button>
                </div>
            </div>
        `;
    }).join('');

    attachConfiguratorListeners();
}

// Render Ready Products
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
    attachHoloEffect(); // CRITICAL - Must be here!
}

// Holographic effect for shop cards - WITH MOUSE TRACKING
// Add this AFTER renderReadyProducts() function
function attachHoloEffect() {
    console.log('🌟 Attaching holo effect...');
    
    const holoCards = document.querySelectorAll('.ready-product-card.holo-card');
    console.log('Found', holoCards.length, 'holo cards');
    
    holoCards.forEach((card, index) => {
        console.log('✅ Attached holo to card', index);
        
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
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

// Attach listeners for configurator items
function attachConfiguratorListeners() {
    document.querySelectorAll('.config-option-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            this.parentElement.querySelectorAll('.config-option-btn').forEach(b =>
                b.classList.remove('active')
            );
            this.classList.add('active');
        });
    });

    document.querySelectorAll('.btn-add-to-cart-config').forEach(btn => {
        btn.addEventListener('click', function () {
            const serviceId = this.getAttribute('data-service-id');
            const service = customServices.find(s => s.id === serviceId);
            const card = this.closest('.configurator-item');
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

// Attach listeners for ready products
function attachReadyProductListeners() {
    document.querySelectorAll('.btn-buy-ready').forEach(btn => {
        btn.addEventListener('click', function () {
            const productId = this.getAttribute('data-product-id');
            const product = readyProducts.find(p => p.id === productId);

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
   SCROLLING REVIEWS - Animated Testimonials
============================================ */

const REVIEW_DATA = [
    { text: "Cea mai tare caricatura primita vreodata! Liniile sunt superbe.", author: "ALEX M." },
    { text: "Live drawing la nunta a fost hit-ul serii! Toti invitatii au plecat cu amintiri.", author: "MARIA G." },
    { text: "Detaliile din portret sunt incredibile. Exact ce cautam.", author: "DAN S." },
    { text: "Stil unic, urban, diferit de tot ce am vazut pana acum.", author: "ELENA P." },
    { text: "Serviciu rapid si comunicare excelenta. Recomand!", author: "COSMIN T." },
    { text: "Am comandat un Multistarz rare card si arata fenomenal!", author: "IONUȚ R." }
];

const scrollingReviews = document.getElementById('scrollingReviews');
let lastScrollPos = 0;
const triggerDistance = 600;
let reviewCount = 0;

function createReview() {
    const data = REVIEW_DATA[reviewCount % REVIEW_DATA.length];
    const side = reviewCount % 2 === 0 ? 'left' : 'right';
    const top = 200 + (Math.random() * 300);
    const rotation = (Math.random() * 20) - 10;

    const colors = ['#859F3D', '#FFD700', '#ffffff'];
    const bgColor = colors[reviewCount % 3];

    const review = document.createElement('div');
    review.className = 'review-card';
    review.style.cssText = `
        top: ${top}px;
        ${side}: 20px;
        transform: rotate(${rotation}deg);
        background: ${bgColor};
        color: #000;
    `;

    review.innerHTML = `
        <div class="review-bubble-tail" style="
            ${side === 'left' ? 'left: 16px;' : 'right: 16px;'}
            background: ${bgColor};
        "></div>
        <p class="review-text">"${data.text}"</p>
        <div class="review-author-wrapper">
            <span class="review-divider"></span>
            <p class="review-author">${data.author}</p>
        </div>
        <div class="review-verified">CLIENT HAPPY</div>
    `;

    scrollingReviews.appendChild(review);
    reviewCount++;

    setTimeout(() => {
        review.classList.add('fade-out');
        setTimeout(() => review.remove(), 1000);
    }, 4000);
}

window.addEventListener('scroll', () => {
    if (shopPage && shopPage.classList.contains('active')) return;

    const currentScroll = window.scrollY;
    const diff = Math.abs(currentScroll - lastScrollPos);

    if (diff > triggerDistance) {
        lastScrollPos = currentScroll;
        createReview();
    }
});

/* ============================================
   INITIALIZATION
============================================ */

updateCart();

console.log('🎨 Shop system loaded successfully!');