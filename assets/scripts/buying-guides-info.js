// Buying guide details page: reads id from query and renders full guide
document.addEventListener('DOMContentLoaded', () => {
    try {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');
        if (!id) return;

        // Get guides data from the main buying guides script
        let guidesData = [];
        let featuredGuide = null;
        
        if (typeof BuyingGuidesManager !== 'undefined') {
            const manager = new BuyingGuidesManager();
            guidesData = manager.allGuides || [];
            featuredGuide = manager.featuredGuide;
        }

        // Check if it's the featured guide first
        let guide = null;
        if (featuredGuide && featuredGuide.id === id) {
            guide = featuredGuide;
        } else {
            guide = guidesData.find(g => g.id === id);
        }

        if (!guide) return;

        const titleEl = document.getElementById('breadcrumbTitle');
        const contentEl = document.getElementById('guideContent');
        const imgEl = document.getElementById('guideImage');

        if (titleEl) {
            // Use shorter breadcrumb text for long guide titles
            const shortTitle = guide.title.length > 30 ? 
                guide.title.substring(0, 30) + '...' : 
                guide.title;
            titleEl.textContent = shortTitle;
        }
        if (contentEl) contentEl.innerHTML = guide.fullContent;
        if (imgEl && guide.image) { 
            imgEl.src = guide.image; 
            imgEl.alt = guide.title; 
        }
    } catch (e) {
        // no-op
    }
});
