/* ============================================
   GALLERY OVERLAY SYSTEM - JavaScript
   Add this to a new file: js/gallery.js
============================================ */

// Gallery State
let allPhotos = [];
let currentCategory = 'toate';
let currentPhotoIndex = 0;
let filteredPhotos = [];
let slideshowInterval = null;
let isSlideshow = false;

// DOM Elements
const galleryPage = document.getElementById('galleryPage');
const galleryPageGrid = document.getElementById('galleryPageGrid');
const btnBackFromGallery = document.getElementById('btnBackFromGallery');
const galleryTabs = document.querySelectorAll('.gallery-tab');
const btnViewGallery = document.querySelector('.btn-view-gallery');

const lightbox = document.getElementById('lightbox');
const lightboxOverlay = document.getElementById('lightboxOverlay');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxImage = document.getElementById('lightboxImage');
const lightboxTitle = document.getElementById('lightboxTitle');
const lightboxDescription = document.getElementById('lightboxDescription');
const lightboxCategory = document.getElementById('lightboxCategory');
const lightboxCounter = document.getElementById('lightboxCounter');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
const btnSlideshow = document.getElementById('btnSlideshow');
const slideshowIcon = document.getElementById('slideshowIcon');

// ============================================
// LOAD PHOTOS FROM HTML DATA
// ============================================

function loadGalleryData() {
    const dataContainer = document.getElementById('galleryData');
    if (!dataContainer) return;

    const photoElements = dataContainer.querySelectorAll('.photo-data');
    allPhotos = Array.from(photoElements).map(el => ({
        id: el.dataset.id,
        category: el.dataset.category,
        title: el.dataset.title,
        description: el.dataset.description,
        image: el.dataset.image
    }));

    console.log('✅ Loaded', allPhotos.length, 'photos');
}

// ============================================
// OPEN GALLERY OVERLAY
// ============================================

function openGalleryPage() {
    console.log('🖼️ Opening gallery...');
    galleryPage.classList.add('active');
    
    // Hide main sections
    const mainSections = document.querySelectorAll('.hero, .shop-section, .gallery-section, .contact-section, .event-packages-section, .footer');
    mainSections.forEach(section => section.style.display = 'none');
    
    // Hide header
    const header = document.getElementById('header');
    if (header) header.style.display = 'none';
    
    document.body.style.overflow = 'hidden';
    window.scrollTo(0, 0);
    
    // Render photos
    renderGalleryGrid();
}

// ============================================
// CLOSE GALLERY OVERLAY
// ============================================

function closeGalleryPage() {
    console.log('🏠 Closing gallery...');
    galleryPage.classList.remove('active');
    
    // Show main sections
    const mainSections = document.querySelectorAll('.hero, .shop-section, .gallery-section, .contact-section, .event-packages-section, .footer');
    mainSections.forEach(section => section.style.display = '');
    
    // Show header
    const header = document.getElementById('header');
    if (header) header.style.display = '';
    
    document.body.style.overflow = 'auto';
    window.scrollTo(0, 0);
    
    // Stop slideshow if active
    stopSlideshow();
}

// ============================================
// RENDER GALLERY GRID
// ============================================

function renderGalleryGrid() {
    // Filter photos by category
    filteredPhotos = currentCategory === 'toate' 
        ? allPhotos 
        : allPhotos.filter(p => p.category === currentCategory);
    
    if (filteredPhotos.length === 0) {
        galleryPageGrid.innerHTML = '<p style="color: white; text-align: center; padding: 40px;">No photos in this category.</p>';
        return;
    }
    
    galleryPageGrid.innerHTML = filteredPhotos.map((photo, index) => `
        <div class="gallery-item" onclick="openLightbox(${index})">
            <div class="gallery-item-image">
                <img src="${photo.image}" alt="${photo.title}">
                <div class="gallery-item-category">${photo.category.toUpperCase()}</div>
            </div>
            <p class="gallery-item-title">${photo.title}</p>
        </div>
    `).join('');
}

// ============================================
// CATEGORY TABS
// ============================================

function switchCategory(category) {
    currentCategory = category;
    
    // Update active tab
    galleryTabs.forEach(tab => {
        if (tab.dataset.category === category) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    
    renderGalleryGrid();
}

// ============================================
// LIGHTBOX - FULLSCREEN VIEW
// ============================================

function openLightbox(index) {
    currentPhotoIndex = index;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
    updateLightbox();
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'hidden'; // Keep hidden because gallery is still open
    stopSlideshow();
}

function updateLightbox() {
    const photo = filteredPhotos[currentPhotoIndex];
    
    lightboxImage.src = photo.image;
    lightboxImage.alt = photo.title;
    lightboxTitle.textContent = photo.title;
    lightboxDescription.textContent = photo.description;
    lightboxCategory.textContent = photo.category.toUpperCase();
    lightboxCounter.textContent = `${currentPhotoIndex + 1} / ${filteredPhotos.length}`;
}

function nextPhoto() {
    currentPhotoIndex = (currentPhotoIndex + 1) % filteredPhotos.length;
    updateLightbox();
}

function prevPhoto() {
    currentPhotoIndex = (currentPhotoIndex - 1 + filteredPhotos.length) % filteredPhotos.length;
    updateLightbox();
}

// ============================================
// SLIDESHOW
// ============================================

function toggleSlideshow() {
    if (isSlideshow) {
        stopSlideshow();
    } else {
        startSlideshow();
    }
}

function startSlideshow() {
    isSlideshow = true;
    slideshowIcon.textContent = '⏸';
    btnSlideshow.textContent = '⏸ PAUZĂ';
    
    slideshowInterval = setInterval(() => {
        nextPhoto();
    }, 3000); // Change photo every 3 seconds
}

function stopSlideshow() {
    isSlideshow = false;
    slideshowIcon.textContent = '▶';
    btnSlideshow.innerHTML = '<span id="slideshowIcon">▶</span> SLIDESHOW';
    
    if (slideshowInterval) {
        clearInterval(slideshowInterval);
        slideshowInterval = null;
    }
}

// ============================================
// EVENT LISTENERS
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Load gallery data
    loadGalleryData();
    
    // Open gallery button (from homepage)
    if (btnViewGallery) {
        btnViewGallery.addEventListener('click', (e) => {
            e.preventDefault();
            openGalleryPage();
        });
    }
    
    // Close gallery button
    if (btnBackFromGallery) {
        btnBackFromGallery.addEventListener('click', closeGalleryPage);
    }
    
    // Category tabs
    galleryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            switchCategory(tab.dataset.category);
        });
    });
    
    // Lightbox close
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    
    if (lightboxOverlay) {
        lightboxOverlay.addEventListener('click', closeLightbox);
    }
    
    // Lightbox navigation
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', prevPhoto);
    }
    
    if (lightboxNext) {
        lightboxNext.addEventListener('click', nextPhoto);
    }
    
    // Slideshow button
    if (btnSlideshow) {
        btnSlideshow.addEventListener('click', toggleSlideshow);
    }
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'ArrowLeft') {
            prevPhoto();
        } else if (e.key === 'ArrowRight') {
            nextPhoto();
        } else if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === ' ') {
            e.preventDefault();
            toggleSlideshow();
        }
    });
});

console.log('🎨 Gallery system loaded!');