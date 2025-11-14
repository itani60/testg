/* =================================================================
   COMPARE HUB PRICES PRESENTATION - INTERACTIVE EFFECTS
   Particles | Scroll Progress | Cursor Effects | Animations
   ================================================================= */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initPresentationEffects();
});

function initPresentationEffects() {
    // Only run on presentation page
    if (!document.body.hasAttribute('data-presentation')) return;
    
    // Initialize all effects
    createFloatingParticles();
    initScrollProgress();
    initCursorGlow();
    initIntersectionObserver();
    initStaggerAnimation();
    addRippleEffect();
    init3DCardEffect();
    initCountingAnimation();
}

/* =================================================================
   FLOATING PARTICLES BACKGROUND
   ================================================================= */
function createFloatingParticles() {
    // Create particles container
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    document.body.appendChild(particlesContainer);
    
    // Create multiple particles
    const particleCount = 30;
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random positioning and animation delay
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        
        // Random size
        const size = Math.random() * 4 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        particlesContainer.appendChild(particle);
    }
}

/* =================================================================
   SCROLL PROGRESS BAR
   ================================================================= */
function initScrollProgress() {
    // Create progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);
    
    // Update on scroll
    window.addEventListener('scroll', function() {
        const windowHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolled = (window.scrollY / windowHeight) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

/* =================================================================
   CURSOR GLOW EFFECT
   ================================================================= */
function initCursorGlow() {
    const cursorGlow = document.createElement('div');
    cursorGlow.className = 'cursor-glow';
    document.body.appendChild(cursorGlow);
    
    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;
    
    document.addEventListener('mousemove', function(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    // Smooth follow animation
    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.1;
        cursorY += (mouseY - cursorY) * 0.1;
        
        cursorGlow.style.left = cursorX + 'px';
        cursorGlow.style.top = cursorY + 'px';
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
}

/* =================================================================
   INTERSECTION OBSERVER FOR FADE-IN ANIMATIONS
   ================================================================= */
function initIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-text-reveal');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe section headers
    document.querySelectorAll('.section-header h2').forEach(header => {
        observer.observe(header);
    });
    
    // Observe cards
    document.querySelectorAll('.summary-card, .service-card, .segment').forEach(card => {
        observer.observe(card);
    });
}

/* =================================================================
   STAGGERED ANIMATION FOR LISTS
   ================================================================= */
function initStaggerAnimation() {
    const observerOptions = {
        threshold: 0.2,
        rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const items = entry.target.querySelectorAll('li, .summary-card, .service-card, .value-item');
                items.forEach((item, index) => {
                    item.classList.add('stagger-item');
                });
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe sections with lists
    document.querySelectorAll('.summary-grid, .services-grid, .values-grid').forEach(section => {
        observer.observe(section);
    });
}

/* =================================================================
   RIPPLE EFFECT ON CLICK
   ================================================================= */
function addRippleEffect() {
    const elements = document.querySelectorAll('.toc-item, .btn, button');
    
    elements.forEach(element => {
        element.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple-effect');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

/* =================================================================
   3D CARD TILT EFFECT
   ================================================================= */
function init3DCardEffect() {
    const cards = document.querySelectorAll('.toc-item, .summary-card, .service-card, .plan-comparison');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px) scale(1.02)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}

/* =================================================================
   COUNTING ANIMATION FOR STATS
   ================================================================= */
function initCountingAnimation() {
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateValue(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.stat-number').forEach(stat => {
        observer.observe(stat);
    });
}

function animateValue(element) {
    const text = element.textContent;
    const number = parseInt(text.replace(/\D/g, ''));
    
    if (isNaN(number)) return;
    
    const duration = 2000; // 2 seconds
    const steps = 60;
    const increment = number / steps;
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= number) {
            element.textContent = text;
            clearInterval(timer);
        } else {
            element.textContent = text.replace(number, Math.floor(current));
        }
    }, duration / steps);
}

/* =================================================================
   PARALLAX SCROLLING EFFECT
   ================================================================= */
function initParallaxEffect() {
    const parallaxElements = document.querySelectorAll('.section-number');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    });
}

/* =================================================================
   MAGNETIC BUTTON EFFECT
   ================================================================= */
function initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn, button');
    
    buttons.forEach(button => {
        button.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            this.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}

/* =================================================================
   GRADIENT TEXT ANIMATION
   ================================================================= */
function initGradientTextAnimation() {
    const titles = document.querySelectorAll('.hero-title, .section-title');
    
    titles.forEach(title => {
        title.style.backgroundSize = '200% 200%';
        
        let position = 0;
        setInterval(() => {
            position += 1;
            title.style.backgroundPosition = `${position}% 50%`;
        }, 50);
    });
}

/* =================================================================
   SMOOTH SCROLL TO SECTIONS
   ================================================================= */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/* =================================================================
   LOADING ANIMATION
   ================================================================= */
function initLoadingAnimation() {
    // Fade in body content
    document.body.style.opacity = '0';
    
    window.addEventListener('load', function() {
        setTimeout(() => {
            document.body.style.transition = 'opacity 1s ease';
            document.body.style.opacity = '1';
        }, 100);
    });
}

/* =================================================================
   INITIALIZE ALL ENHANCED EFFECTS
   ================================================================= */
initSmoothScroll();
initLoadingAnimation();
initMagneticButtons();
initGradientTextAnimation();

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    .ripple-effect {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

/* =================================================================
   PERFORMANCE MONITORING
   ================================================================= */
if (window.performance) {
    window.addEventListener('load', function() {
        setTimeout(() => {
            const perfData = window.performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            console.log('Presentation loaded in: ' + pageLoadTime + 'ms');
        }, 0);
    });
}