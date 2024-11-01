// news.js

document.addEventListener('DOMContentLoaded', () => {
    loadNews();
});

async function loadNews() {
    try {
        const news = await window.electronAPI.getNews();
        displayNews(news);
    } catch (error) {
        window.nexusApp.showNotification('Kunne ikke indlæse nyheder', 'error');
    }
}

function displayNews(newsItems) {
    const newsGrid = document.querySelector('.news-grid');
    if (!newsGrid) return;

    newsGrid.innerHTML = ''; // Ryd eksisterende nyheder

    newsItems.forEach(item => {
        const newsCard = createNewsCard(item);
        newsGrid.appendChild(newsCard);
    });
}

function createNewsCard(newsItem) {
    const card = document.createElement('div');
    card.className = 'news-card';
    
    card.innerHTML = `
        <img src="${newsItem.image}" alt="${newsItem.title}" class="news-image">
        <div class="news-content">
            <div class="news-date">${formatDate(newsItem.date)}</div>
            <h3 class="news-title">${newsItem.title}</h3>
            <p class="news-excerpt">${newsItem.excerpt}</p>
            <button class="read-more-btn" data-id="${newsItem.id}">Læs mere</button>
        </div>
    `;

    // Tilføj event listener til "Læs mere" knappen
    const readMoreBtn = card.querySelector('.read-more-btn');
    readMoreBtn.addEventListener('click', () => showFullArticle(newsItem));

    return card;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('da-DK', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
}

function showFullArticle(article) {
    // Opret modal med fuld artikel
    const modal = document.createElement('div');
    modal.className = 'news-modal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <button class="close-modal">✕</button>
            <img src="${article.image}" alt="${article.title}" class="modal-image">
            <h2>${article.title}</h2>
            <div class="article-date">${formatDate(article.date)}</div>
            <div class="article-content">${article.content}</div>
        </div>
    `;

    // Tilføj event listener til luk knap
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.addEventListener('click', () => modal.remove());

    // Tilføj modal til DOM
    document.body.appendChild(modal);
}
