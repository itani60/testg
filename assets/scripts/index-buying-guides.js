// Home page: render 3 random buying guides from buying-guides.js dataset
(function(){
  function shuffle(arr){
    const a = [...arr];
    for(let i=a.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [a[i],a[j]] = [a[j],a[i]];
    }
    return a;
  }

  function cardHTML(guide){
    // Match home.css buying guide card structure/classes exactly
    return `
      <div class="buying-guide-card">
        <div class="guide-card-image-container">
          <img src="${guide.image}" alt="${guide.title}" class="guide-card-image" loading="lazy">
        </div>
        <div class="guide-card-content">
          <div class="guide-category">${guide.category}</div>
          <h3 class="guide-name">${guide.title}</h3>
          <p class="guide-description">${guide.excerpt}</p>
          <div class="guide-meta">
            <div class="guide-difficulty"><i class="fas fa-signal"></i>${guide.difficulty || 'Beginner'}</div>
            <div class="guide-date"><i class="fas fa-calendar"></i>${new Date(guide.date).toLocaleDateString()}</div>
          </div>
          <button class="btn btn-primary btn-read-guide" onclick="location.href='buying-guides-info.html?id=${guide.id}'">
            Read Guide
          </button>
        </div>
      </div>
    `;
  }

  document.addEventListener('DOMContentLoaded', () => {
    // Check if BuyingGuidesManager is available
    if (typeof BuyingGuidesManager === 'undefined') return;
    
    try {
      const manager = new BuyingGuidesManager();
      const allGuides = manager.allGuides || [];
      const showcase = document.querySelector('.product-buying-guides-showcase');
      
      if (!showcase || !allGuides.length) return;
      
      // Get 3 random guides
      const randomThree = shuffle(allGuides).slice(0, 3);
      
      // Container already styled as grid in home.css; inject cards directly
      showcase.innerHTML = randomThree.map(cardHTML).join('');
    } catch (error) {
      console.log('Buying guides not loaded yet, will retry...');
      // Retry after a short delay if BuyingGuidesManager isn't ready
      setTimeout(() => {
        try {
          const manager = new BuyingGuidesManager();
          const allGuides = manager.allGuides || [];
          const showcase = document.querySelector('.product-buying-guides-showcase');
          
          if (!showcase || !allGuides.length) return;
          
          const randomThree = shuffle(allGuides).slice(0, 3);
          showcase.innerHTML = randomThree.map(cardHTML).join('');
        } catch (retryError) {
          console.log('Buying guides still not available');
        }
      }, 500);
    }
  });
})();

















































































