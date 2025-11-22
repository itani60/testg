// Local Business Listing Page
// Fetches and displays businesses on local-business.html

const API_BASE_URL = 'https://acc.comparehubprices.site/business/business/public';

class LocalBusinessManager {
    constructor() {
        this.businesses = [];
        this.currentFilters = {
            search: '',
            category: '',
            province: '',
            sort: 'newest'
        };
        this.isLoading = false;
        this.lastKey = null;
        this.hasMore = true;
        
        this.init();
    }

    async init() {
        await this.loadBusinesses();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Search input
        const searchInput = document.getElementById('businessSearchInput');
        const searchBtn = document.getElementById('businessSearchBtn');
        
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleSearch();
                }
            });
        }
        
        if (searchBtn) {
            searchBtn.addEventListener('click', () => this.handleSearch());
        }

        // Filters
        const categoryFilter = document.getElementById('categoryFilter');
        const provinceFilter = document.getElementById('provinceFilter');
        const sortFilter = document.getElementById('sortFilter');

        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.currentFilters.category = e.target.value;
                this.loadBusinesses(true);
            });
        }

        if (provinceFilter) {
            provinceFilter.addEventListener('change', (e) => {
                this.currentFilters.province = e.target.value;
                this.loadBusinesses(true);
            });
        }

        if (sortFilter) {
            sortFilter.addEventListener('change', (e) => {
                this.currentFilters.sort = e.target.value;
                this.sortBusinesses();
            });
        }
    }

    handleSearch() {
        const searchInput = document.getElementById('businessSearchInput');
        if (searchInput) {
            this.currentFilters.search = searchInput.value.trim();
            this.loadBusinesses(true);
        }
    }

    async loadBusinesses(reset = false) {
        if (this.isLoading) return;
        
        if (reset) {
            this.businesses = [];
            this.lastKey = null;
            this.hasMore = true;
        }

        if (!this.hasMore && !reset) return;

        this.isLoading = true;
        this.showLoading();

        try {
            const params = new URLSearchParams({
                limit: '50'
            });

            if (this.currentFilters.search) {
                params.append('search', this.currentFilters.search);
            }
            if (this.currentFilters.category) {
                params.append('category', this.currentFilters.category);
            }
            if (this.currentFilters.province) {
                params.append('province', this.currentFilters.province);
            }
            if (this.lastKey && !reset) {
                params.append('lastKey', encodeURIComponent(JSON.stringify(this.lastKey)));
            }

            const response = await fetch(`${API_BASE_URL}/list?${params.toString()}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success && data.businesses) {
                if (reset) {
                    this.businesses = data.businesses;
                } else {
                    this.businesses = [...this.businesses, ...data.businesses];
                }
                
                this.lastKey = data.lastKey;
                this.hasMore = !!data.lastKey;

                this.renderBusinesses();
            } else {
                throw new Error(data.message || 'Failed to load businesses');
            }
        } catch (error) {
            console.error('Error loading businesses:', error);
            this.showError('Failed to load businesses. Please try again.');
        } finally {
            this.isLoading = false;
            this.hideLoading();
        }
    }

    sortBusinesses() {
        const sortBy = this.currentFilters.sort;
        
        switch (sortBy) {
            case 'newest':
                this.businesses.sort((a, b) => {
                    const dateA = new Date(a.publishedAt || a.createdAt || 0);
                    const dateB = new Date(b.publishedAt || b.createdAt || 0);
                    return dateB - dateA;
                });
                break;
            case 'oldest':
                this.businesses.sort((a, b) => {
                    const dateA = new Date(a.publishedAt || a.createdAt || 0);
                    const dateB = new Date(b.publishedAt || b.createdAt || 0);
                    return dateA - dateB;
                });
                break;
            case 'name':
                this.businesses.sort((a, b) => {
                    const nameA = (a.businessName || a.name || '').toLowerCase();
                    const nameB = (b.businessName || b.name || '').toLowerCase();
                    return nameA.localeCompare(nameB);
                });
                break;
            case 'rating':
                this.businesses.sort((a, b) => {
                    const ratingA = this.getAverageRating(a.businessId || a.id) || 0;
                    const ratingB = this.getAverageRating(b.businessId || b.id) || 0;
                    return ratingB - ratingA;
                });
                break;
        }

        this.renderBusinesses();
    }

    getAverageRating(businessId) {
        // Get rating from localStorage
        const ratings = JSON.parse(localStorage.getItem('businessRatings') || '{}');
        const businessRatings = ratings[businessId] || [];
        if (businessRatings.length === 0) return 0;
        
        const sum = businessRatings.reduce((acc, r) => acc + r.rating, 0);
        return sum / businessRatings.length;
    }

    renderBusinesses() {
        const grid = document.getElementById('businessGrid');
        if (!grid) return;

        if (this.businesses.length === 0) {
            grid.innerHTML = `
                <div class="col-12">
                    <div class="text-center py-5">
                        <i class="fas fa-store fa-3x text-muted mb-3"></i>
                        <h4>No businesses found</h4>
                        <p class="text-muted">Try adjusting your filters or search terms.</p>
                    </div>
                </div>
            `;
            return;
        }

        grid.innerHTML = this.businesses.map(business => this.renderBusinessCard(business)).join('');
    }

    renderBusinessCard(business) {
        const businessId = business.businessId || business.id;
        const businessName = business.businessName || business.name || 'Business';
        const description = business.description || business.moreInformation || '';
        const category = business.category || 'General';
        const address = business.address || '';
        const logo = business.logo || business.businessLogoUrl || '';
        const averageRating = this.getAverageRating(businessId);
        const totalRatings = this.getTotalRatings(businessId);

        // Get first service gallery image as cover
        let coverImage = logo;
        if (business.serviceGalleries && Object.keys(business.serviceGalleries).length > 0) {
            const firstService = Object.values(business.serviceGalleries)[0];
            if (firstService && firstService.length > 0) {
                const firstImage = firstService[0];
                coverImage = typeof firstImage === 'string' ? firstImage : (firstImage.image || firstImage.url || logo);
            }
        }

        return `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="business-card">
                    <div class="business-card-image">
                        <img src="${coverImage || 'assets/logo .png'}" alt="${businessName}" loading="lazy" onerror="this.src='assets/logo .png'">
                        <div class="business-category-badge">${category}</div>
                    </div>
                    <div class="business-card-body">
                        <h3 class="business-card-title">${this.escapeHtml(businessName)}</h3>
                        <p class="business-card-description">${this.escapeHtml(description.substring(0, 120))}${description.length > 120 ? '...' : ''}</p>
                        <div class="business-card-meta">
                            ${address ? `<div class="business-location"><i class="fas fa-map-marker-alt"></i> <span>${this.escapeHtml(address)}</span></div>` : ''}
                            ${averageRating > 0 ? `
                                <div class="business-rating">
                                    <div class="rating-stars">
                                        ${this.renderStarsHTML(averageRating)}
                                    </div>
                                    <span class="rating-text">${averageRating.toFixed(1)} (${totalRatings} ${totalRatings === 1 ? 'review' : 'reviews'})</span>
                                </div>
                            ` : '<div class="business-rating"><span class="text-muted">No ratings yet</span></div>'}
                        </div>
                        <div class="business-card-actions">
                            <a href="local_business_info.html?id=${businessId}" class="btn btn-primary btn-view">
                                <i class="fas fa-eye"></i> View Business
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderStarsHTML(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        let starsHTML = '';
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<i class="fas fa-star"></i>';
        }
        if (hasHalfStar) {
            starsHTML += '<i class="fas fa-star-half-alt"></i>';
        }
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '<i class="far fa-star"></i>';
        }
        return starsHTML;
    }

    getTotalRatings(businessId) {
        const ratings = JSON.parse(localStorage.getItem('businessRatings') || '{}');
        const businessRatings = ratings[businessId] || [];
        return businessRatings.length;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showLoading() {
        const grid = document.getElementById('businessGrid');
        if (grid && this.businesses.length === 0) {
            grid.innerHTML = `
                <div class="col-12">
                    <div class="text-center py-5">
                        <div class="spinner-border text-danger" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                        <p class="mt-3">Loading businesses...</p>
                    </div>
                </div>
            `;
        }
    }

    hideLoading() {
        // Loading is handled in renderBusinesses
    }

    showError(message) {
        const grid = document.getElementById('businessGrid');
        if (grid) {
            grid.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-danger" role="alert">
                        <i class="fas fa-exclamation-circle"></i> ${this.escapeHtml(message)}
                    </div>
                </div>
            `;
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.localBusinessManager = new LocalBusinessManager();
});

