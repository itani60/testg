// Article details page: reads id from query and renders full article
document.addEventListener('DOMContentLoaded', () => {
    try {
        const params = new URLSearchParams(window.location.search);
        const id = params.get('id');
        if (!id) return;

        const data = typeof getArticlesData === 'function' ? getArticlesData() : [];
        const article = data.find(a => a.id === id);
        if (!article) return;

        const titleEl = document.getElementById('articleTitle');
        const metaEl = document.getElementById('articleMeta');
        const bcEl = document.getElementById('breadcrumbArticle');
        const contentEl = document.getElementById('articleContent');
        const imgEl = document.getElementById('articleImage');

        if (titleEl) titleEl.textContent = article.title;
        if (metaEl) metaEl.textContent = `${new Date(article.date).toLocaleDateString()} · ${article.type} · ${article.category}`;
        if (bcEl) {
            // Use shorter breadcrumb text for long article titles
            const shortTitle = article.title.length > 30 ? 
                article.title.substring(0, 30) + '...' : 
                article.title;
            bcEl.textContent = shortTitle;
        }
        if (contentEl) contentEl.innerHTML = article.fullContent;
        if (imgEl && article.image) { imgEl.src = article.image; imgEl.alt = article.title; }
    } catch (e) {
        // no-op
    }
});


