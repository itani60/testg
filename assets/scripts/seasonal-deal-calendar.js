// Seasonal Deal Calendar Data
// This file contains all the seasonal deals and events data

// Seasonal deals data
const seasonalDeals = [
    {
        id: 'fathers-day',
        month: 'Jun',
        day: '16',
        title: "Father's Day Deals",
        description: "Gaming, tools, and gadgets perfect for dads",
        categories: ['Gaming', 'Tools', 'Gadgets'],
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&crop=center',
        color: '#2c3e50',
        gradient: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)'
    },
    {
        id: 'back-to-school',
        month: 'Jan',
        day: '3',
        title: "Back to School",
        description: "Laptops, tablets, and accessories for students",
        categories: ['Laptops', 'Tablets', 'Accessories'],
        image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop&crop=center',
        color: '#007bff',
        gradient: 'linear-gradient(135deg, #007bff 0%, #0056b3 100%)'
    },
    {
        id: 'black-friday',
        month: 'Nov',
        day: '24',
        title: "Black Friday",
        description: "The biggest shopping day of the year - incredible deals everywhere",
        categories: ['All Categories'],
        image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=400&h=300&fit=crop&crop=center',
        color: '#dc3545',
        gradient: 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)'
    },
    {
        id: 'valentines-day',
        month: 'Feb',
        day: '14',
        title: "Valentine's Day Specials",
        description: "Gift deals on audio, wearables, and smart home devices",
        categories: ['Audio', 'Wearables', 'Smart Home'],
        image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop&crop=center',
        color: '#e83e8c',
        gradient: 'linear-gradient(135deg, #e83e8c 0%, #d63384 100%)'
    },
    {
        id: 'mothers-day',
        month: 'May',
        day: '1',
        title: "Mother's Day Tech Gifts",
        description: "Perfect tech gifts for moms - tablets, smartwatches, and more",
        categories: ['Tablets', 'Wearables', 'Smart Home'],
        image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop&crop=center',
        color: '#6f42c1',
        gradient: 'linear-gradient(135deg, #6f42c1 0%, #5a32a3 100%)'
    }
];

// Function to get all seasonal deals
function getAllSeasonalDeals() {
    return seasonalDeals;
}

// Function to get seasonal deals by month
function getSeasonalDealsByMonth(month) {
    return seasonalDeals.filter(deal => deal.month.toLowerCase() === month.toLowerCase());
}

// Function to get upcoming deals (next 3 months)
function getUpcomingDeals() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // JavaScript months are 0-indexed
    
    // Map month names to numbers
    const monthMap = {
        'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6,
        'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12
    };
    
    return seasonalDeals.filter(deal => {
        const dealMonth = monthMap[deal.month];
        return dealMonth >= currentMonth && dealMonth <= currentMonth + 3;
    });
}

// Function to get current seasonal deal
function getCurrentSeasonalDeal() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentDay = currentDate.getDate();
    
    const monthMap = {
        'Jan': 1, 'Feb': 2, 'Mar': 3, 'Apr': 4, 'May': 5, 'Jun': 6,
        'Jul': 7, 'Aug': 8, 'Sep': 9, 'Oct': 10, 'Nov': 11, 'Dec': 12
    };
    
    return seasonalDeals.find(deal => {
        const dealMonth = monthMap[deal.month];
        const dealDay = parseInt(deal.day);
        
        // Check if it's the current month and within 7 days of the deal
        if (dealMonth === currentMonth) {
            return Math.abs(dealDay - currentDay) <= 7;
        }
        
        return false;
    });
}

// Function to render seasonal deal cards
function renderSeasonalDealCards(containerId, deals = null) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const dealsToShow = deals || getAllSeasonalDeals();
    
    container.innerHTML = dealsToShow.map(deal => `
        <div class="seasonal-deal-card" data-deal-id="${deal.id}">
            <div class="deal-date">
                <div class="deal-month">${deal.month}</div>
                <div class="deal-day">${deal.day}</div>
            </div>
            <div class="deal-content">
                <div class="deal-image-container">
                    <img src="${deal.image}" 
                         alt="${deal.title}" 
                         class="deal-image" 
                         loading="lazy">
                    <div class="deal-overlay" style="background: ${deal.gradient}"></div>
                </div>
                <div class="deal-info">
                    <h3 class="deal-title">${deal.title}</h3>
                    <p class="deal-description">${deal.description}</p>
                    <div class="deal-categories">
                        ${deal.categories.map(category => `
                            <span class="deal-category" style="background: ${deal.color}">${category}</span>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Function to render seasonal deal cards for homepage (simplified version)
function renderHomepageSeasonalDeals(containerId, count = 4) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const dealsToShow = getAllSeasonalDeals().slice(0, count);
    
    container.innerHTML = dealsToShow.map(deal => `
        <div class="seasonal-deal-item">
            <div class="deal-date-badge" style="background: ${deal.gradient}">
                <div class="deal-month">${deal.month}</div>
                <div class="deal-day">${deal.day}</div>
            </div>
            <div class="deal-details">
                <h4 class="deal-title">${deal.title}</h4>
                <p class="deal-description">${deal.description}</p>
                <div class="deal-categories">
                    ${deal.categories.map(category => `
                        <span class="deal-category-tag">${category}</span>
                    `).join('')}
                </div>
            </div>
        </div>
    `).join('');
}

// Function to get deal by ID
function getSeasonalDealById(id) {
    return seasonalDeals.find(deal => deal.id === id);
}

// Function to search deals by category
function searchSeasonalDealsByCategory(category) {
    return seasonalDeals.filter(deal => 
        deal.categories.some(cat => 
            cat.toLowerCase().includes(category.toLowerCase())
        )
    );
}

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getAllSeasonalDeals,
        getSeasonalDealsByMonth,
        getUpcomingDeals,
        getCurrentSeasonalDeal,
        renderSeasonalDealCards,
        renderHomepageSeasonalDeals,
        getSeasonalDealById,
        searchSeasonalDealsByCategory
    };
}
