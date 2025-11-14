// Logo Navigation Script
// Handles logo clicks to navigate to index.html

class LogoNavigation {
    constructor() {
        this.init();
    }

    init() {
        this.attachLogoClickHandlers();
    }

    attachLogoClickHandlers() {
        // Handle desktop logo clicks
        const desktopLogos = document.querySelectorAll('.logo, .logo-img');
        desktopLogos.forEach(logo => {
            logo.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateToHome();
            });
            
            // Make logo clickable with cursor pointer
            logo.style.cursor = 'pointer';
        });

        // Handle mobile logo clicks
        const mobileLogos = document.querySelectorAll('.mobile-logo, .mobile-logo-img');
        mobileLogos.forEach(logo => {
            logo.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateToHome();
            });
            
            // Make logo clickable with cursor pointer
            logo.style.cursor = 'pointer';
        });

        // Handle sidebar logo clicks
        const sidebarLogos = document.querySelectorAll('.sidebar-logo-img');
        sidebarLogos.forEach(logo => {
            logo.addEventListener('click', (e) => {
                e.preventDefault();
                this.navigateToHome();
            });
            
            // Make logo clickable with cursor pointer
            logo.style.cursor = 'pointer';
        });
    }

    navigateToHome() {
        // Check if we're already on the home page
        const currentPage = window.location.pathname;
        const isHomePage = currentPage === '/' || 
                          currentPage === '/index.html' || 
                          currentPage.endsWith('/index.html') ||
                          currentPage === '' ||
                          currentPage.endsWith('/');

        if (isHomePage) {
            // If already on home page, scroll to top
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } else {
            // Navigate to home page
            window.location.href = 'index.html';
        }
    }

    // Method to add logo click handlers to dynamically added logos
    addLogoHandlers() {
        this.attachLogoClickHandlers();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.logoNavigation = new LogoNavigation();
});

// Re-initialize if new content is loaded dynamically
document.addEventListener('DOMContentLoaded', function() {
    // Observer for dynamically added content
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                // Check if any new logos were added
                const hasNewLogos = Array.from(mutation.addedNodes).some(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        return node.querySelector && (
                            node.querySelector('.logo') ||
                            node.querySelector('.logo-img') ||
                            node.querySelector('.mobile-logo') ||
                            node.querySelector('.mobile-logo-img') ||
                            node.querySelector('.sidebar-logo-img')
                        );
                    }
                    return false;
                });

                if (hasNewLogos && window.logoNavigation) {
                    window.logoNavigation.addLogoHandlers();
                }
            }
        });
    });

    // Start observing
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LogoNavigation;
}
