// Home page: render 3 random articles from articles2.js dataset
(function(){
  function shuffle(arr){
    const a = [...arr];
    for(let i=a.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [a[i],a[j]] = [a[j],a[i]];
    }
    return a;
  }

  function cardHTML(a){
    // Match home.css card structure/classes exactly
    return `
      <div class="article-card">
        <div class="article-card-image-container">
          <img src="${a.image}" alt="${a.title}" class="article-card-image" loading="lazy">
        </div>
        <div class="article-card-content">
          <div class="article-category">${a.category}</div>
          <h3 class="article-name">${a.title}</h3>
          <p class="article-description">${a.excerpt}</p>
          <div class="article-meta">
            <div class="article-date"><i class="fas fa-calendar"></i>${new Date(a.date).toLocaleDateString()}</div>
            <div class="article-type"><i class="fas fa-tag"></i>${a.type}</div>
          </div>
          <button class="btn btn-primary btn-read-article" onclick="location.href='articles-info.html?id=${a.id}'">
            Read
          </button>
        </div>
      </div>
    `;
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (typeof getArticlesData !== 'function') return;
    const list = getArticlesData();
    const showcase = document.querySelector('.latest-tech-news-reviews-showcase');
    if (!showcase || !list?.length) return;
    const randomThree = shuffle(list).slice(0,3);
    // Container already styled as grid in home.css; inject cards directly
    showcase.innerHTML = randomThree.map(cardHTML).join('');
  });
})();


