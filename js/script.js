/* ============================================
   MATTEO LUNGU - INTERACTIVE PORTFOLIO
   JavaScript for navigation, gallery, and animations
============================================ */

// ============================================
// MOBILE MENU TOGGLE
// ============================================

const mobileToggle = document.getElementById('mobileToggle');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');

// Toggle mobile menu
mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
    document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : 'auto';
});

// Close mobile menu when clicking a link
mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
    });
});

// ============================================
// SMOOTH SCROLL FOR ALL LINKS
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// HEADER SCROLL EFFECT
// ============================================

const header = document.getElementById('header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add shadow on scroll
    if (currentScroll > 50) {
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.5)';
    } else {
        header.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// ============================================
// GALLERY FILTER FUNCTIONALITY
// ============================================

const filterButtons = document.querySelectorAll('.filter-btn');
const polaroids = document.querySelectorAll('.polaroid');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        button.classList.add('active');
        
        // Get filter value
        const filterValue = button.getAttribute('data-filter');
        
        // Filter polaroids
        polaroids.forEach(polaroid => {
            const category = polaroid.getAttribute('data-category');
            
            if (filterValue === 'toate' || category === filterValue) {
                polaroid.classList.remove('hidden');
                // Animate in
                polaroid.style.animation = 'fadeInScale 0.5s ease forwards';
            } else {
                polaroid.classList.add('hidden');
            }
        });
    });
});

// ============================================
// SCROLL TO TOP BUTTON
// ============================================

const scrollTopBtn = document.getElementById('scrollTop');

if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ============================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ============================================

// Fade in elements on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const fadeElements = document.querySelectorAll('.shop-card, .polaroid, .contact-card, .cta-card');

const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '0';
            entry.target.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                entry.target.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }, 100);
            
            fadeObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

fadeElements.forEach(element => {
    fadeObserver.observe(element);
});

// ============================================
// POLAROID ROTATION RANDOMIZER
// ============================================

polaroids.forEach(polaroid => {
    const randomRotation = Math.random() * 6 - 3; // Random between -3 and 3
    polaroid.style.setProperty('--rotation', `${randomRotation}deg`);
});

// ============================================
// STICKER FLOATING ANIMATION RANDOMIZER
// ============================================

const stickers = document.querySelectorAll('.sticker');

stickers.forEach((sticker, index) => {
    const randomDelay = Math.random() * 2;
    const randomDuration = 3 + Math.random() * 2;
    
    sticker.style.animationDelay = `${randomDelay}s`;
    sticker.style.animationDuration = `${randomDuration}s`;
});

// ============================================
// SHOP CARD TILT EFFECT
// ============================================

const shopCards = document.querySelectorAll('.shop-card');

shopCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        const randomTilt = Math.random() * 4 - 2; // Random between -2 and 2
        this.style.transform = `translateY(-10px) rotate(${randomTilt}deg)`;
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) rotate(0deg)';
    });
});

// ============================================
// CURSOR TRAIL EFFECT (Optional - playful touch)
// ============================================

const cursorTrail = [];
const trailLength = 10;

document.addEventListener('mousemove', (e) => {
    cursorTrail.push({ x: e.clientX, y: e.clientY });
    
    if (cursorTrail.length > trailLength) {
        cursorTrail.shift();
    }
});

// ============================================
// SCROLL SPY - ACTIVE LINK BASED ON SCROLL POSITION
// ============================================

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveLink() {
    let currentSection = '';
    const scrollPos  = window.pageYOffset + 160;
    const atBottom   = (window.pageYOffset + window.innerHeight) >= (document.documentElement.scrollHeight - 60);

    if (atBottom) {
        // At page bottom — find last section that has a matching nav link
        const navIds = Array.from(navLinks).map(l => l.getAttribute('data-section'));
        const all    = Array.from(sections).map(s => s.getAttribute('id'));
        for (let i = all.length - 1; i >= 0; i--) {
            if (navIds.includes(all[i])) { currentSection = all[i]; break; }
        }
    } else {
        sections.forEach(section => {
            const top = section.offsetTop;
            const h   = section.clientHeight;
            if (scrollPos >= top && scrollPos < top + h) {
                currentSection = section.getAttribute('id');
            }
        });
    }

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === currentSection) {
            link.classList.add('active');
        }
    });
}

// Run on scroll
window.addEventListener('scroll', debounce(updateActiveLink, 10));

// Run on page load
window.addEventListener('load', updateActiveLink);

// ============================================
// SMOOTH SCROLL ON CLICK + UPDATE ACTIVE
// ============================================

const allNavButtons = document.querySelectorAll('.nav-link, .mobile-link');  // REMOVE .btn-order

allNavButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        
        const section = this.getAttribute('data-section');
        const target = document.getElementById(section);
        
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            
            setTimeout(() => {
                updateActiveLink();
            }, 100);
        }
        
        // Close mobile menu if open
        if (mobileMenu && mobileMenu.classList.contains('active')) {
            mobileToggle.classList.remove('active');
            mobileMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
});

// ============================================
// PREVENT FLASH OF UNSTYLED CONTENT
// ============================================

window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// ============================================
// CONSOLE EASTER EGG
// ============================================

console.log('%cðŸŽ¨ MATTEO LUNGU', 'font-size: 24px; font-weight: bold; color: #859F3D;');
console.log('%cART WITH ATTITUDE ðŸš€', 'font-size: 16px; color: #FFD700;');
console.log('%cLooking for something? Hit me up: hello@matteo.art', 'font-size: 12px; color: #fff;');

// ============================================
// KEYBOARD SHORTCUTS (Easter Egg)
// ============================================

document.addEventListener('keydown', (e) => {
    // Press 'S' to scroll to shop
    if (e.key === 's' || e.key === 'S') {
        document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Press 'G' to scroll to gallery
    if (e.key === 'g' || e.key === 'G') {
        document.getElementById('galerie')?.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Press 'C' to scroll to contact
    if (e.key === 'c' || e.key === 'C') {
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    }
    
    // Press 'H' to scroll to home
    if (e.key === 'h' || e.key === 'H') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

// ============================================
// LAZY LOADING IMAGES
// ============================================

const images = document.querySelectorAll('img[data-src]');

const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            imageObserver.unobserve(img);
        }
    });
});

images.forEach(img => imageObserver.observe(img));

// ============================================
// PERFORMANCE OPTIMIZATION
// ============================================

// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debounce to scroll-heavy functions
const debouncedScroll = debounce(() => {
    // Your scroll logic here
}, 10);

window.addEventListener('scroll', debouncedScroll);


// Murals button goes to contact
document.addEventListener('DOMContentLoaded', () => {
    const muralButtons = document.querySelectorAll('.btn-murals');
    muralButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent opening shop
            document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
        });
    });
});

// Holographic effect for main page shop cards - ENHANCED GOLD
document.addEventListener('DOMContentLoaded', () => {
    const holoCards = document.querySelectorAll('.shop-card.holo-card');
    
    holoCards.forEach(card => {
        const glareDiv = card.querySelector('.holo-overlay');
        
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // 3D tilt - more dramatic
            const rotateX = (y - centerY) / 8; // Lower divisor = more tilt
            const rotateY = (centerX - x) / 8;
            
            card.style.transform = `
                perspective(1000px) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg)
                scale3d(1.02, 1.02, 1.02)
            `;
            
            // GOLD holographic glare - INTENSE
            if (glareDiv) {
                const glareX = (x / rect.width) * 100;
                const glareY = (y / rect.height) * 100;
                
                glareDiv.style.opacity = '0.85'; // MORE visible
                glareDiv.style.background = `
                    radial-gradient(circle at ${glareX}% ${glareY}%, 
                        rgba(255, 223, 0, 0.9) 0%,     /* Bright gold center */
                        rgba(255, 200, 50, 0.6) 20%,   /* Medium gold */
                        rgba(255, 165, 0, 0.4) 40%,    /* Orange gold */
                        transparent 70%
                    ),
                    linear-gradient(135deg, 
                        rgba(255, 215, 0, 0.3) 0%,     /* Gold */
                        rgba(255, 165, 0, 0.3) 25%,    /* Orange */
                        rgba(218, 165, 32, 0.3) 50%,   /* Goldenrod */
                        rgba(255, 215, 0, 0.3) 75%,    /* Gold again */
                        rgba(255, 165, 0, 0.3) 100%    /* Orange */
                    ),
                    radial-gradient(ellipse at ${glareX}% ${glareY}%,
                        rgba(255, 255, 255, 0.4) 0%,
                        transparent 50%
                    )
                `;
            }
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            if (glareDiv) {
                glareDiv.style.opacity = '0';
            }
        });
    });
});

// ============================================
// END OF SCRIPT
// ============================================

console.log('%câœ… Site loaded successfully!', 'color: #859F3D; font-weight: bold;');