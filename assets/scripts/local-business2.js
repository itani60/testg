// Local Business Data for local-business.html
// This file handles API integration for business marketplace

// API Configuration
const BASE_URL = 'https://acc.comparehubprices.site';

// API Service for Business Marketplace
class BusinessMarketplaceAPI {
    static async getBusiness(businessId) {
        try {
            const response = await fetch(`${BASE_URL}/business/business/public/${businessId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            const data = await response.json();
            
            if (!response.ok || !data.success || !data.business) {
                throw new Error(data.message || 'Business not found');
            }
            
            return this.transformBusinessData(data.business);
        } catch (error) {
            console.error('Error fetching business:', error);
            throw error;
        }
    }
    
    static async listBusinesses(filters = {}) {
        // NOTE: This requires a /business/public/list endpoint to be created in Lambda
        // Expected endpoint: GET /business/public/list?category=...&province=...&search=...&limit=...&lastKey=...
        // Expected response: { success: true, businesses: [...], count: number, lastKey: string | null }
        // For now, falls back to hardcoded data if API fails
        try {
            const queryParams = new URLSearchParams();
            if (filters.category) queryParams.append('category', filters.category);
            if (filters.province) queryParams.append('province', filters.province);
            if (filters.search) queryParams.append('search', filters.search);
            if (filters.limit) queryParams.append('limit', filters.limit);
            if (filters.lastKey) queryParams.append('lastKey', filters.lastKey);
            
            const url = `${BASE_URL}/business/business/public/list${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
            
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            
            const data = await response.json();
            
            if (!response.ok || !data.success) {
                throw new Error(data.message || 'Failed to fetch businesses');
            }
            
            // Transform API response
            console.log('📊 Raw API data.businesses:', data.businesses);
            const businesses = (data.businesses || []).map(b => {
                console.log('📊 Transforming business:', b);
                const transformed = this.transformBusinessData(b);
                console.log('📊 Transformed result:', transformed);
                return transformed;
            });
            
            console.log('📊 Final businesses array:', businesses);
            
            return {
                businesses: businesses,
                count: data.count || businesses.length,
                lastKey: data.lastKey || null
            };
        } catch (error) {
            console.error('Error fetching businesses list:', error);
            // Fallback to hardcoded data if API fails
            console.warn('Falling back to hardcoded data');
            return {
                businesses: getRegularBusinesses(),
                count: getRegularBusinesses().length,
                lastKey: null
            };
        }
    }
    
    // Helper function to strip HTML tags and get plain text
    static stripHTML(html) {
        if (!html) return '';
        // Create a temporary div element
        const tmp = document.createElement('DIV');
        tmp.innerHTML = html;
        const text = tmp.textContent || tmp.innerText || '';
        // Trim and limit length for card display
        return text.trim().substring(0, 200);
    }
    
    static transformBusinessData(apiBusiness) {
        const serviceGalleries = {};
        
        // Transform serviceGalleries from API format
        if (apiBusiness.serviceGalleries) {
            Object.keys(apiBusiness.serviceGalleries).forEach(serviceName => {
                const images = apiBusiness.serviceGalleries[serviceName];
                if (Array.isArray(images)) {
                    serviceGalleries[serviceName] = images.map(img => ({
                        image: typeof img === 'string' ? img : (img.image || img.url || ''),
                        title: typeof img === 'object' ? (img.title || img.name || '') : ''
                    }));
                }
            });
        }
        
        // Extract location from address
        const location = apiBusiness.businessAddress || '';
        const province = this.extractProvince(location);
        
        // Get description - prefer fullContent, strip HTML for card display
        const rawDescription = apiBusiness.fullContent || apiBusiness.businessDescription || '';
        const plainDescription = this.stripHTML(rawDescription);
        
        return {
            id: apiBusiness.businessId || '',
            name: apiBusiness.businessName || '',
            description: plainDescription || 'No description available.',
            category: apiBusiness.businessCategory || apiBusiness.businessType || 'Service',
            province: province,
            location: location,
            phone: apiBusiness.businessNumber || '',
            hours: apiBusiness.businessHours || 'Hours not specified',
            whatsapp: apiBusiness.socialMedia?.whatsapp || '',
            instagram: apiBusiness.socialMedia?.instagram || '',
            tiktok: apiBusiness.socialMedia?.tiktok || '',
            facebook: apiBusiness.socialMedia?.facebook || '',
            linkedin: apiBusiness.socialMedia?.linkedin || '',
            twitter: apiBusiness.socialMedia?.twitter || '',
            image: apiBusiness.businessLogoUrl || 'https://via.placeholder.com/400x300?text=No+Image',
            serviceGalleries: serviceGalleries,
            fullContent: apiBusiness.fullContent || apiBusiness.businessDescription || '',
            rating: 0, // Will be calculated from reviews if available
            distance: 0,
            status: apiBusiness.status,
            verified: apiBusiness.verified
        };
    }
    
    static extractProvince(address) {
        const provinces = ['Gauteng', 'Western Cape', 'KwaZulu-Natal', 'Eastern Cape', 'Free State', 'Limpopo', 'Mpumalanga', 'North West', 'Northern Cape'];
        for (const province of provinces) {
            if (address.toLowerCase().includes(province.toLowerCase())) {
                return province;
            }
        }
        return '';
    }
}

// Function to get randomized business cards for index.html
async function getRandomizedBusinessCards(count = 3) {
    try {
        const result = await BusinessMarketplaceAPI.listBusinesses({ limit: 50 });
        const allBusinesses = result.businesses;
    
    // Remove duplicates by filtering unique IDs
    const uniqueBusinesses = [];
    const seenIds = new Set();
    
    allBusinesses.forEach(business => {
        if (!seenIds.has(business.id)) {
            seenIds.add(business.id);
            uniqueBusinesses.push(business);
        }
    });
    
    // Shuffle the array using Fisher-Yates algorithm
    const shuffled = [...uniqueBusinesses];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    // Return the requested number of businesses
    return shuffled.slice(0, count);
    } catch (error) {
        console.error('Error fetching businesses for cards:', error);
        // Fallback to hardcoded data
        const allBusinesses = getRegularBusinesses();
        const shuffled = [...allBusinesses];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled.slice(0, count);
    }
}

// Function to render business cards for index.html
function renderBusinessCards(containerId, count = 3) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const businesses = getRandomizedBusinessCards(count);
    
    container.innerHTML = businesses.map(business => `
        <div class="col-12 col-md-4">
            <a href="local-business.html?business=${business.id}&openModal=true" class="text-decoration-none">
                <div class="card h-100 border-0 shadow-sm">
                    <div class="card-img-top" style="height: 200px; overflow: hidden;">
                        <img src="${business.image}" 
                             alt="${business.name}" 
                             class="img-fluid w-100 h-100" 
                             style="object-fit: cover;"
                             loading="lazy">
                    </div>
                    <div class="card-body">
                        <h5 class="card-title">${business.name}</h5>
                        <p class="card-text text-muted small">${business.description}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="badge bg-primary">${business.category}</span>
                            <small class="text-muted">${business.province ? business.province + ', ' : ''}${business.location.split(',')[0]}</small>
                        </div>
                    </div>
                </div>
            </a>
        </div>
    `).join('');
}

// Regular Businesses Data
// NOTE: Hardcoded data removed - now using API only for testing
function getRegularBusinesses() {
    return [];
}

// Function to get businesses by category
function getBusinessesByCategory(category) {
    const allBusinesses = getRegularBusinesses();
    return allBusinesses.filter(business => business.category === category);
}

// Function to get businesses by location
function getBusinessesByLocation(location) {
    const allBusinesses = getRegularBusinesses();
    return allBusinesses.filter(business => business.location === location);
}

// Function to search businesses
function searchBusinesses(searchTerm) {
    const allBusinesses = getRegularBusinesses();
    const term = searchTerm.toLowerCase();
    
    return allBusinesses.filter(business => 
        business.name.toLowerCase().includes(term) ||
        business.description.toLowerCase().includes(term) ||
        business.category.toLowerCase().includes(term) ||
        business.location.toLowerCase().includes(term)
    );
}

// Rating System Functions
let userRatings = JSON.parse(localStorage.getItem('businessRatings')) || {};

// Dynamic reviews system - no hardcoded data
// This will be populated from user ratings and can be extended with API calls
let businessReviews = JSON.parse(localStorage.getItem('businessReviews')) || {};

// Function to save ratings to localStorage
function saveRatings() {
    localStorage.setItem('businessRatings', JSON.stringify(userRatings));
}

// Function to save reviews to localStorage
function saveReviews() {
    localStorage.setItem('businessReviews', JSON.stringify(businessReviews));
}

// Function to get user rating for a business
function getUserRating(businessId) {
    return userRatings[businessId] || null;
}

// Function to submit a user rating
function submitRating(businessId, rating, review = '') {
    if (rating < 1 || rating > 5) {
        alert('Please select a rating between 1 and 5 stars.');
        return false;
    }
    
    const userId = generateUserId();
    const ratingData = {
        rating: rating,
        review: review,
        date: new Date().toISOString(),
        userId: userId
    };
    
    userRatings[businessId] = ratingData;
    saveRatings();
    
    // If there's a review text, also save it to the reviews system
    if (review && review.trim()) {
        addReviewToBusiness(businessId, {
            id: `user_review_${businessId}_${Date.now()}`,
            userId: userId,
            userName: 'You',
            rating: rating,
            review: review.trim(),
            date: ratingData.date,
            helpful: 0,
            isUserReview: true
        });
    }
    
    return true;
}

// Function to add a review to a business
function addReviewToBusiness(businessId, reviewData) {
    if (!businessReviews[businessId]) {
        businessReviews[businessId] = [];
    }
    
    // Check if user already has a review for this business
    const existingReviewIndex = businessReviews[businessId].findIndex(
        review => review.isUserReview && review.userId === reviewData.userId
    );
    
    if (existingReviewIndex >= 0) {
        // Update existing review
        businessReviews[businessId][existingReviewIndex] = reviewData;
    } else {
        // Add new review
        businessReviews[businessId].push(reviewData);
    }
    
    saveReviews();
}

// Function to generate a simple user ID
function generateUserId() {
    return 'user_' + Math.random().toString(36).substr(2, 9);
}

// Function to get average rating for a business (including user ratings)
function getAverageRating(businessId) {
    const business = getRegularBusinesses().find(b => b.id === businessId);
    if (!business) return 0;
    
    const reviews = getReviewsForBusiness(businessId);
    const baseRating = business.rating || 0;
    
    if (reviews.length === 0) {
        return baseRating;
    }
    
    // Calculate average from reviews
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const reviewAverage = totalRating / reviews.length;
    
    // If there are reviews, use review average; otherwise use base rating
    return reviews.length > 0 ? reviewAverage : baseRating;
}

// Function to get total number of ratings for a business
function getTotalRatings(businessId) {
    const reviews = getReviewsForBusiness(businessId);
    return reviews.length;
}

// Function to render star rating display
function renderStarRating(rating, containerId, interactive = false, businessId = null) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let starsHTML = '';
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
        starsHTML += `<i class="fas fa-star star-rating ${interactive ? 'interactive' : ''}" 
                        data-rating="${i + 1}" 
                        ${interactive && businessId ? `onclick="setRating(${businessId}, ${i + 1})"` : ''}></i>`;
    }
    
    // Half star
    if (hasHalfStar) {
        starsHTML += `<i class="fas fa-star-half-alt star-rating ${interactive ? 'interactive' : ''}" 
                        data-rating="${fullStars + 1}" 
                        ${interactive && businessId ? `onclick="setRating(${businessId}, ${fullStars + 1})"` : ''}></i>`;
    }
    
    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += `<i class="far fa-star star-rating ${interactive ? 'interactive' : ''}" 
                        data-rating="${fullStars + (hasHalfStar ? 1 : 0) + i + 1}" 
                        ${interactive && businessId ? `onclick="setRating(${businessId}, ${fullStars + (hasHalfStar ? 1 : 0) + i + 1})"` : ''}></i>`;
    }
    
    container.innerHTML = starsHTML;
}

// Function to set rating (for interactive stars)
function setRating(businessId, rating) {
    const currentUserRating = getUserRating(businessId);
    if (currentUserRating) {
        if (confirm('You have already rated this business. Do you want to update your rating?')) {
            submitRating(businessId, rating);
            updateRatingDisplay(businessId);
            showRatingSuccess();
        }
    } else {
        submitRating(businessId, rating);
        updateRatingDisplay(businessId);
        showRatingSuccess();
    }
}

// Function to update rating display after rating submission
function updateRatingDisplay(businessId) {
    const averageRating = getAverageRating(businessId);
    const totalRatings = getTotalRatings(businessId);
    
    // Update rating in business cards
    const businessCards = document.querySelectorAll(`[data-business-id="${businessId}"]`);
    businessCards.forEach(card => {
        const ratingElement = card.querySelector('.business-rating');
        if (ratingElement) {
            ratingElement.innerHTML = `
                <div class="rating-stars">
                    ${renderStarsHTML(averageRating)}
                </div>
                <span class="rating-text">${averageRating.toFixed(1)} (${totalRatings} ${totalRatings === 1 ? 'rating' : 'ratings'})</span>
            `;
        }
    });
    
    // Update rating in modal
    const modalRatingElement = document.getElementById('modalRating');
    if (modalRatingElement) {
        modalRatingElement.innerHTML = `
            <div class="rating-stars">
                ${renderStarsHTML(averageRating)}
            </div>
            <span class="rating-text">${averageRating.toFixed(1)} (${totalRatings} ${totalRatings === 1 ? 'rating' : 'ratings'})</span>
        `;
    }
}

// Function to render stars HTML
function renderStarsHTML(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    let starsHTML = '';
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    
    // Half star
    if (hasHalfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    
    // Empty stars
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }
    
    return starsHTML;
}

// Function to show rating success message
function showRatingSuccess() {
    const successMessage = document.createElement('div');
    successMessage.className = 'rating-success-message';
    successMessage.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>Thank you for your rating!</span>
    `;
    
    document.body.appendChild(successMessage);
    
    setTimeout(() => {
        successMessage.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        successMessage.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(successMessage);
        }, 300);
    }, 3000);
}

// Function to open rating modal
function openRatingModal(businessId) {
    const business = getRegularBusinesses().find(b => b.id === businessId);
    if (!business) return;
    
    const currentUserRating = getUserRating(businessId);
    const averageRating = getAverageRating(businessId);
    const totalRatings = getTotalRatings(businessId);
    
    const modal = document.getElementById('ratingModal');
    const modalContent = document.getElementById('ratingModalContent');
    
    modalContent.innerHTML = `
        <div class="rating-modal-header">
            <h3>Rate ${business.name}</h3>
            <button class="rating-modal-close" onclick="closeRatingModal()">&times;</button>
        </div>
        <div class="rating-modal-body">
            <div class="current-rating">
                <div class="rating-stars large">
                    ${renderStarsHTML(averageRating)}
                </div>
                <div class="rating-info">
                    <span class="rating-score">${averageRating.toFixed(1)}</span>
                    <span class="rating-count">${totalRatings} ${totalRatings === 1 ? 'rating' : 'ratings'}</span>
                </div>
            </div>
            
            <div class="user-rating-section">
                <h4>${currentUserRating ? 'Update Your Rating' : 'Rate This Business'}</h4>
                <div class="interactive-rating" id="interactiveRating">
                    ${renderInteractiveStars(businessId, currentUserRating?.rating || 0)}
                </div>
                <div class="rating-labels">
                    <span class="rating-label" data-rating="1">Poor</span>
                    <span class="rating-label" data-rating="2">Fair</span>
                    <span class="rating-label" data-rating="3">Good</span>
                    <span class="rating-label" data-rating="4">Very Good</span>
                    <span class="rating-label" data-rating="5">Excellent</span>
                </div>
            </div>
            
            <div class="review-section">
                <label for="ratingReview">Write a review (optional):</label>
                <textarea id="ratingReview" placeholder="Share your experience with this business..." rows="4">${currentUserRating?.review || ''}</textarea>
            </div>
            
            <div class="rating-actions">
                <button class="btn-secondary" onclick="closeRatingModal()">Cancel</button>
                <button class="btn-primary" onclick="submitRatingWithReview('${businessId}')">
                    ${currentUserRating ? 'Update Rating' : 'Submit Rating'}
                </button>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Add hover effects to rating labels
    addRatingLabelHoverEffects();
}

// Function to render interactive stars
function renderInteractiveStars(businessId, currentRating = 0) {
    let starsHTML = '';
    for (let i = 1; i <= 5; i++) {
        const starClass = i <= currentRating ? 'fas fa-star' : 'far fa-star';
        starsHTML += `<i class="${starClass} interactive-star" data-rating="${i}" onclick="selectRating('${businessId}', ${i})"></i>`;
    }
    return starsHTML;
}

// Function to select rating
function selectRating(businessId, rating) {
    const stars = document.querySelectorAll('.interactive-star');
    stars.forEach((star, index) => {
        if (index < rating) {
            star.className = 'fas fa-star interactive-star';
        } else {
            star.className = 'far fa-star interactive-star';
        }
    });
    
    // Update rating labels
    const labels = document.querySelectorAll('.rating-label');
    labels.forEach(label => {
        label.classList.remove('active');
        if (parseInt(label.dataset.rating) === rating) {
            label.classList.add('active');
        }
    });
    
    // Store selected rating
    window.selectedRating = rating;
}

// Function to add hover effects to rating labels
function addRatingLabelHoverEffects() {
    const stars = document.querySelectorAll('.interactive-star');
    const labels = document.querySelectorAll('.rating-label');
    
    stars.forEach((star, index) => {
        star.addEventListener('mouseenter', () => {
            labels.forEach((label, labelIndex) => {
                if (labelIndex <= index) {
                    label.classList.add('hover');
                } else {
                    label.classList.remove('hover');
                }
            });
        });
    });
    
    document.querySelector('.interactive-rating').addEventListener('mouseleave', () => {
        labels.forEach(label => label.classList.remove('hover'));
    });
}

// Function to submit rating with review
function submitRatingWithReview(businessId) {
    const rating = window.selectedRating || 0;
    const review = document.getElementById('ratingReview').value.trim();
    
    if (rating === 0) {
        alert('Please select a rating before submitting.');
        return;
    }
    
    if (submitRating(businessId, rating, review)) {
        closeRatingModal();
        updateRatingDisplay(businessId);
        showRatingSuccess();
        
        // Refresh reviews in business modal if it's open
        if (window.localBusinessManager) {
            window.localBusinessManager.loadBusinessReviews(businessId);
        }
    }
}

// Function to close rating modal
function closeRatingModal() {
    const modal = document.getElementById('ratingModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    window.selectedRating = 0;
}

// Function to mark a review as helpful
function markReviewHelpful(reviewId) {
    // Get current business ID
    const businessId = window.localBusinessManager?.getCurrentBusinessId();
    if (!businessId) return;
    
    // Get reviews for this business
    const allReviews = JSON.parse(localStorage.getItem('businessReviews') || '{}');
    const businessReviews = allReviews[businessId] || [];
    
    // Find and update the review
    const reviewIndex = businessReviews.findIndex(review => review.id === reviewId);
    if (reviewIndex !== -1) {
        businessReviews[reviewIndex].helpfulCount = (businessReviews[reviewIndex].helpfulCount || 0) + 1;
        
        // Save back to localStorage
        allReviews[businessId] = businessReviews;
        localStorage.setItem('businessReviews', JSON.stringify(allReviews));
        
        // Refresh the reviews display
        window.localBusinessManager?.loadBusinessReviews(businessId);
    }
}

// Function to report a review
function reportReview(reviewId) {
    if (confirm('Are you sure you want to report this review? This action cannot be undone.')) {
        // In a real application, this would send a report to the server
        alert('Review reported. Thank you for helping us maintain quality content.');
    }
}

// Reviews System Functions
function getReviewsForBusiness(businessId) {
    // Get reviews from the dynamic reviews system
    const reviews = businessReviews[businessId] || [];
    
    // Sort reviews by date (newest first) by default
    return reviews.sort((a, b) => new Date(b.date) - new Date(a.date));
}

// Function to format date for display
function formatReviewDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
        return 'Yesterday';
    } else if (diffDays < 7) {
        return `${diffDays} days ago`;
    } else if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7);
        return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else {
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    }
}

// Function to render reviews section
function renderReviewsSection(businessId) {
    const reviews = getReviewsForBusiness(businessId);
    const stats = getReviewStatistics(businessId);
    const averageRating = getAverageRating(businessId);
    const totalRatings = stats.totalReviews;
    
    if (reviews.length === 0) {
        return `
            <div class="reviews-section">
                <div class="reviews-header">
                    <h3>Customer Reviews</h3>
                    <div class="reviews-summary">
                        <div class="rating-stars large">
                            ${renderStarsHTML(averageRating)}
                        </div>
                        <div class="rating-info">
                            <span class="rating-score">${averageRating.toFixed(1)}</span>
                            <span class="rating-count">${totalRatings} ${totalRatings === 1 ? 'rating' : 'ratings'}</span>
                        </div>
                    </div>
                </div>
                <div class="no-reviews">
                    <i class="fas fa-comment-slash"></i>
                    <p>No reviews yet. Be the first to share your experience!</p>
                </div>
            </div>
        `;
    }
    
    // Use rating distribution from statistics
    const ratingDistribution = stats.ratingDistribution;
    
    const reviewsHTML = reviews.map(review => `
        <div class="review-card ${review.isUserReview ? 'user-review' : ''}">
            <div class="review-header">
                <div class="reviewer-info">
                    <div class="reviewer-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="reviewer-details">
                        <h4 class="reviewer-name">${review.userName}</h4>
                        <div class="review-rating">
                            <div class="rating-stars">
                                ${renderStarsHTML(review.rating)}
                            </div>
                            <span class="review-date">${formatReviewDate(review.date)}</span>
                        </div>
                    </div>
                </div>
                ${review.isUserReview ? '<span class="your-review-badge">Your Review</span>' : ''}
            </div>
            <div class="review-content">
                <p>${review.review}</p>
            </div>
            <div class="review-actions">
                <button class="helpful-btn" onclick="markReviewHelpful('${review.id}')">
                    <i class="fas fa-thumbs-up"></i>
                    <span>Helpful (${review.helpful})</span>
                </button>
                ${!review.isUserReview ? `
                    <button class="report-btn" onclick="reportReview('${review.id}')">
                        <i class="fas fa-flag"></i>
                        <span>Report</span>
                    </button>
                ` : ''}
            </div>
        </div>
    `).join('');
    
    return `
        <div class="reviews-section">
            <div class="reviews-header">
                <h3>Customer Reviews</h3>
                <div class="reviews-summary">
                    <div class="rating-stats">
                        <div class="rating-score-large">${averageRating.toFixed(1)}</div>
                        <div class="rating-stars large">
                            ${renderStarsHTML(averageRating)}
                        </div>
                        <div class="rating-count">${totalRatings} ${totalRatings === 1 ? 'rating' : 'ratings'}</div>
                    </div>
                    <div class="rating-breakdown">
                        ${ratingDistribution.map((count, index) => {
                            const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                            const stars = 5 - index;
                            return `
                                <div class="rating-bar">
                                    <span class="star-label">${stars} star${stars > 1 ? 's' : ''}</span>
                                    <div class="progress-bar">
                                        <div class="progress-fill" style="width: ${percentage}%"></div>
                                    </div>
                                    <span class="count">${count}</span>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
            
            <div class="reviews-filters">
                <div class="filter-group">
                    <label>Sort by:</label>
                    <select id="reviewSort" onchange="sortReviews('${businessId}')">
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                        <option value="highest">Highest Rating</option>
                        <option value="lowest">Lowest Rating</option>
                        <option value="most_helpful">Most Helpful</option>
                    </select>
                </div>
                <div class="filter-group">
                    <label>Filter by rating:</label>
                    <select id="reviewFilter" onchange="filterReviews('${businessId}')">
                        <option value="all">All Ratings</option>
                        <option value="5">5 Stars</option>
                        <option value="4">4 Stars</option>
                        <option value="3">3 Stars</option>
                        <option value="2">2 Stars</option>
                        <option value="1">1 Star</option>
                    </select>
                </div>
            </div>
            
            <div class="reviews-list" id="reviewsList">
                ${reviewsHTML}
            </div>
        </div>
    `;
}

// Function to sort reviews
function sortReviews(businessId) {
    const sortBy = document.getElementById('reviewSort').value;
    const reviews = getReviewsForBusiness(businessId);
    
    let sortedReviews = [...reviews];
    
    switch(sortBy) {
        case 'newest':
            sortedReviews.sort((a, b) => new Date(b.date) - new Date(a.date));
            break;
        case 'oldest':
            sortedReviews.sort((a, b) => new Date(a.date) - new Date(b.date));
            break;
        case 'highest':
            sortedReviews.sort((a, b) => b.rating - a.rating);
            break;
        case 'lowest':
            sortedReviews.sort((a, b) => a.rating - b.rating);
            break;
        case 'most_helpful':
            sortedReviews.sort((a, b) => b.helpful - a.helpful);
            break;
    }
    
    renderReviewsList(sortedReviews);
}

// Function to filter reviews
function filterReviews(businessId) {
    const filterBy = document.getElementById('reviewFilter').value;
    const reviews = getReviewsForBusiness(businessId);
    
    let filteredReviews = reviews;
    if (filterBy !== 'all') {
        filteredReviews = reviews.filter(review => review.rating === parseInt(filterBy));
    }
    
    renderReviewsList(filteredReviews);
}

// Function to render reviews list
function renderReviewsList(reviews) {
    const reviewsList = document.getElementById('reviewsList');
    if (!reviewsList) return;
    
    if (reviews.length === 0) {
        reviewsList.innerHTML = `
            <div class="no-reviews-filtered">
                <i class="fas fa-search"></i>
                <p>No reviews match your current filter.</p>
            </div>
        `;
        return;
    }
    
    const reviewsHTML = reviews.map(review => `
        <div class="review-card ${review.isUserReview ? 'user-review' : ''}">
            <div class="review-header">
                <div class="reviewer-info">
                    <div class="reviewer-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="reviewer-details">
                        <h4 class="reviewer-name">${review.userName}</h4>
                        <div class="review-rating">
                            <div class="rating-stars">
                                ${renderStarsHTML(review.rating)}
                            </div>
                            <span class="review-date">${formatReviewDate(review.date)}</span>
                        </div>
                    </div>
                </div>
                ${review.isUserReview ? '<span class="your-review-badge">Your Review</span>' : ''}
            </div>
            <div class="review-content">
                <p>${review.review}</p>
            </div>
            <div class="review-actions">
                <button class="helpful-btn" onclick="markReviewHelpful('${review.id}')">
                    <i class="fas fa-thumbs-up"></i>
                    <span>Helpful (${review.helpful})</span>
                </button>
                ${!review.isUserReview ? `
                    <button class="report-btn" onclick="reportReview('${review.id}')">
                        <i class="fas fa-flag"></i>
                        <span>Report</span>
                    </button>
                ` : ''}
            </div>
        </div>
    `).join('');
    
    reviewsList.innerHTML = reviewsHTML;
}

// Function to mark review as helpful
function markReviewHelpful(reviewId) {
    // Find the review and increment helpful count
    for (const businessId in businessReviews) {
        const reviewIndex = businessReviews[businessId].findIndex(review => review.id === reviewId);
        if (reviewIndex >= 0) {
            businessReviews[businessId][reviewIndex].helpful = (businessReviews[businessId][reviewIndex].helpful || 0) + 1;
            saveReviews();
            showRatingSuccess();
            return;
        }
    }
    
    // If not found, show success message anyway
    showRatingSuccess();
}

// Function to report a review
function reportReview(reviewId) {
    if (confirm('Are you sure you want to report this review? It will be reviewed by our moderation team.')) {
        // In a real application, this would send a request to the server
        // For now, we'll just show a confirmation message
        alert('Thank you for reporting this review. Our team will review it shortly.');
    }
}

// Function to add a public review (for future API integration)
function addPublicReview(businessId, reviewData) {
    if (!businessReviews[businessId]) {
        businessReviews[businessId] = [];
    }
    
    const review = {
        id: `review_${businessId}_${Date.now()}`,
        userId: reviewData.userId || generateUserId(),
        userName: reviewData.userName || 'Anonymous',
        rating: reviewData.rating,
        review: reviewData.review,
        date: new Date().toISOString(),
        helpful: 0,
        isUserReview: false
    };
    
    businessReviews[businessId].push(review);
    saveReviews();
    
    return review;
}

// Function to get review statistics for a business
function getReviewStatistics(businessId) {
    const reviews = getReviewsForBusiness(businessId);
    const totalReviews = reviews.length;
    
    if (totalReviews === 0) {
        return {
            totalReviews: 0,
            averageRating: 0,
            ratingDistribution: [0, 0, 0, 0, 0]
        };
    }
    
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / totalReviews;
    
    const ratingDistribution = [0, 0, 0, 0, 0];
    reviews.forEach(review => {
        ratingDistribution[review.rating - 1]++;
    });
    
    return {
        totalReviews,
        averageRating,
        ratingDistribution
    };
}

// Main Local Business Page Functionality
class LocalBusinessManager {
    constructor() {
        this.currentPage = 1;
        this.itemsPerPage = 6;
        this.currentFilter = 'all';
        this.currentCategory = 'all';
        this.currentProvince = 'all';
        this.currentSort = 'name';
        this.currentSearch = '';
        this.businesses = [];
        this.filteredBusinesses = [];
        
        this.init();
    }
    
    async init() {
        await this.loadBusinesses();
        this.setupEventListeners();
        this.renderBusinesses();
        this.updatePagination();
        this.checkUrlParams();
    }
    
    async loadBusinesses() {
        try {
            // Show loading state if needed
            const businessGrid = document.getElementById('businessGrid');
            if (businessGrid) {
                businessGrid.innerHTML = '<div class="text-center p-5"><div class="spinner-border text-danger" role="status"><span class="visually-hidden">Loading businesses...</span></div><p class="mt-3">Loading businesses...</p></div>';
            }
            
            // Check if test mode is enabled (test-hardcoded.js is loaded)
            const testData = window.TEST_BUSINESS_DATA || (typeof TEST_BUSINESS_DATA !== 'undefined' ? TEST_BUSINESS_DATA : null);
            if (testData && window.USE_TEST_MODE) {
                console.log('🧪 TEST MODE: Using hardcoded test data', testData);
                // Transform test data to match expected format
                const testBusiness = BusinessMarketplaceAPI.transformBusinessData(testData);
                console.log('🧪 Transformed test business:', testBusiness);
                this.businesses = [testBusiness];
                this.applyFilters();
                return;
            } else {
                console.log('🧪 Test mode check:', {
                    hasTestData: !!testData,
                    useTestMode: window.USE_TEST_MODE,
                    testDataValue: testData
                });
            }
            
            // Fetch businesses from API
            const result = await BusinessMarketplaceAPI.listBusinesses({
                limit: 100 // Fetch more businesses for filtering
            });
            
            console.log('📊 API Response:', result);
            console.log('📊 Businesses array:', result.businesses);
            if (result.businesses && result.businesses.length > 0) {
                console.log('📊 First business raw:', result.businesses[0]);
                const transformed = BusinessMarketplaceAPI.transformBusinessData(result.businesses[0]);
                console.log('📊 First business transformed:', transformed);
            }
            
            this.businesses = result.businesses;
            this.applyFilters();
        } catch (error) {
            console.error('Error loading businesses:', error);
            // Fallback to hardcoded data
        this.businesses = getRegularBusinesses();
        this.applyFilters();
        }
    }
    
    setupEventListeners() {
        // Search functionality
        const searchInput = document.getElementById('businessSearchInput');
        const searchBtn = document.getElementById('businessSearchBtn');
        
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.currentSearch = e.target.value;
                this.currentPage = 1;
                this.applyFilters();
                this.renderBusinesses();
                this.updatePagination();
            });
        }
        
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.currentPage = 1;
                this.applyFilters();
                this.renderBusinesses();
                this.updatePagination();
            });
        }
        
        // Filter functionality
        const categoryFilter = document.getElementById('categoryFilter');
        const provinceFilter = document.getElementById('provinceFilter');
        const locationFilter = document.getElementById('locationFilter');
        const sortFilter = document.getElementById('sortFilter');
        
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.currentCategory = e.target.value;
                this.currentPage = 1;
                this.applyFilters();
                this.renderBusinesses();
                this.updatePagination();
            });
        }
        
        if (provinceFilter) {
            provinceFilter.addEventListener('change', (e) => {
                this.currentProvince = e.target.value;
                this.currentPage = 1;
                this.applyFilters();
                this.renderBusinesses();
                this.updatePagination();
            });
        }
        
        if (locationFilter) {
            locationFilter.addEventListener('change', (e) => {
                this.currentFilter = e.target.value;
                this.currentPage = 1;
                this.applyFilters();
                this.renderBusinesses();
                this.updatePagination();
            });
        }
        
        if (sortFilter) {
            sortFilter.addEventListener('change', (e) => {
                this.currentSort = e.target.value;
                this.currentPage = 1;
                this.applyFilters();
                this.renderBusinesses();
                this.updatePagination();
            });
        }
        
        
        // Pagination
        const prevBtn = document.getElementById('prevPage');
        const nextBtn = document.getElementById('nextPage');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                if (this.currentPage > 1) {
                    this.currentPage--;
                    this.renderBusinesses();
                    this.updatePagination();
                }
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                const totalPages = Math.ceil(this.filteredBusinesses.length / this.itemsPerPage);
                if (this.currentPage < totalPages) {
                    this.currentPage++;
                    this.renderBusinesses();
                    this.updatePagination();
                }
            });
        }
        
        // Modal functionality
        this.setupModalEventListeners();
    }
    
    setupModalEventListeners() {
        // Business modal
        const businessModal = document.getElementById('businessModal');
        const businessModalClose = document.getElementById('businessModalClose');
        
        if (businessModalClose) {
            businessModalClose.addEventListener('click', () => {
                this.closeBusinessModal();
            });
        }
        
        if (businessModal) {
            businessModal.addEventListener('click', (e) => {
                if (e.target === businessModal) {
                    this.closeBusinessModal();
                }
            });
        }
        
        // Gallery modal
        const galleryModal = document.getElementById('galleryModal');
        const galleryModalClose = document.getElementById('galleryModalClose');
        
        if (galleryModalClose) {
            galleryModalClose.addEventListener('click', () => {
                this.closeGalleryModal();
            });
        }
        
        if (galleryModal) {
            galleryModal.addEventListener('click', (e) => {
                if (e.target === galleryModal) {
                    this.closeGalleryModal();
                }
            });
        }
        
        // Rating modal
        const ratingModal = document.getElementById('ratingModal');
        
        if (ratingModal) {
            ratingModal.addEventListener('click', (e) => {
                if (e.target === ratingModal) {
                    this.closeRatingModal();
                }
            });
        }
    }
    
    applyFilters() {
        let filtered = [...this.businesses];
        
        // Search filter
        if (this.currentSearch) {
            const searchTerm = this.currentSearch.toLowerCase();
            filtered = filtered.filter(business => 
                business.name.toLowerCase().includes(searchTerm) ||
                business.description.toLowerCase().includes(searchTerm) ||
                business.category.toLowerCase().includes(searchTerm) ||
                business.location.toLowerCase().includes(searchTerm)
            );
        }
        
        // Category filter
        if (this.currentCategory !== 'all') {
            filtered = filtered.filter(business => 
                business.category.toLowerCase() === this.currentCategory
            );
        }
        
        // Province filter
        if (this.currentProvince !== 'all') {
            filtered = filtered.filter(business => 
                business.province === this.currentProvince
            );
        }
        
        // Location filter
        if (this.currentFilter !== 'all') {
            filtered = filtered.filter(business => 
                business.location.toLowerCase().includes(this.currentFilter.toLowerCase())
            );
        }
        
        // Sort
        filtered.sort((a, b) => {
            switch (this.currentSort) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'rating':
                    return b.rating - a.rating;
                case 'distance':
                    return a.distance - b.distance;
                default:
                    return 0;
            }
        });
        
        this.filteredBusinesses = filtered;
    }
    
    renderBusinesses() {
        const businessGrid = document.getElementById('businessGrid');
        if (!businessGrid) return;
        
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const businessesToShow = this.filteredBusinesses.slice(startIndex, endIndex);
        
        console.log('🎨 Rendering businesses:', {
            total: this.filteredBusinesses.length,
            showing: businessesToShow.length,
            businesses: businessesToShow
        });
        
        if (businessesToShow.length === 0) {
            businessGrid.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h3>No businesses found</h3>
                    <p>Try adjusting your search criteria or filters.</p>
                </div>
            `;
            return;
        }
        
        businessGrid.innerHTML = businessesToShow.map(business => {
            console.log('🎨 Rendering business card for:', business);
            // Ensure all fields have fallback values
            const businessName = business.name || 'Business Name';
            const businessDescription = business.description || 'No description available.';
            const businessCategory = business.category || 'Service';
            const businessLocation = business.location || 'Location not specified';
            const businessPhone = business.phone || 'Phone not available';
            const businessHours = business.hours || 'Hours not specified';
            const businessImage = business.image || 'https://via.placeholder.com/400x300?text=No+Image';
            const businessId = business.id || '';
            const businessRating = business.rating || 0;
            
            const cardHTML = `
            <div class="business-card" data-business-id="${businessId}" onclick="localBusinessManager.openBusinessModal('${businessId}')">
                <img src="${businessImage}" alt="${businessName}" class="business-card-image" loading="lazy" onerror="this.src='https://via.placeholder.com/400x300?text=No+Image'">
                <div class="business-card-content">
                    <div class="business-card-category">${businessCategory}</div>
                    <h3 class="business-card-title">${businessName}</h3>
                    <p class="business-card-description">${businessDescription}</p>
                    <div class="business-card-meta">
                        <div class="business-meta-item">
                            <i class="fas fa-map-marker-alt"></i>
                            <span>${businessLocation}</span>
                        </div>
                        <div class="business-meta-item">
                            <i class="fas fa-phone"></i>
                            <span>${businessPhone}</span>
                        </div>
                        <div class="business-meta-item">
                            <i class="fas fa-clock"></i>
                            <span>${businessHours}</span>
                        </div>
                    </div>
                    <div class="business-card-footer">
                        <div class="business-rating">
                            <div class="business-stars">
                                ${this.renderStarsHTML(businessRating)}
                            </div>
                            <span class="business-rating-text">${businessRating}</span>
                        </div>
                        <button class="business-view-btn" onclick="event.stopPropagation(); openBusinessFullPage('${businessId}')">
                            View Details
                        </button>
                    </div>
                </div>
            </div>
        `;
            console.log('🎨 Generated HTML for business:', businessName, cardHTML.substring(0, 200) + '...');
            return cardHTML;
        }).join('');
        
        console.log('🎨 Business cards rendered');
    }
    
    renderStarsHTML(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        let starsHTML = '';
        
        // Full stars
        for (let i = 0; i < fullStars; i++) {
            starsHTML += '<i class="fas fa-star"></i>';
        }
        
        // Half star
        if (hasHalfStar) {
            starsHTML += '<i class="fas fa-star-half-alt"></i>';
        }
        
        // Empty stars
        for (let i = 0; i < emptyStars; i++) {
            starsHTML += '<i class="far fa-star"></i>';
        }
        
        return starsHTML;
    }
    
    updatePagination() {
        const totalPages = Math.ceil(this.filteredBusinesses.length / this.itemsPerPage);
        const pagesContainer = document.getElementById('pages');
        const prevBtn = document.getElementById('prevPage');
        const nextBtn = document.getElementById('nextPage');
        const paginationInfo = document.getElementById('paginationInfo');
        
        if (pagesContainer) {
            let pagesHTML = '';
            const maxVisiblePages = 5;
            let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
            let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
            
            if (endPage - startPage + 1 < maxVisiblePages) {
                startPage = Math.max(1, endPage - maxVisiblePages + 1);
            }
            
            for (let i = startPage; i <= endPage; i++) {
                pagesHTML += `
                    <button class="page-number ${i === this.currentPage ? 'active' : ''}" 
                            onclick="localBusinessManager.goToPage(${i})">
                        ${i}
                    </button>
                `;
            }
            
            pagesContainer.innerHTML = pagesHTML;
        }
        
        if (prevBtn) {
            prevBtn.disabled = this.currentPage === 1;
        }
        
        if (nextBtn) {
            nextBtn.disabled = this.currentPage === totalPages;
        }
        
        if (paginationInfo) {
            const startItem = (this.currentPage - 1) * this.itemsPerPage + 1;
            const endItem = Math.min(this.currentPage * this.itemsPerPage, this.filteredBusinesses.length);
            paginationInfo.textContent = `Showing ${startItem}-${endItem} of ${this.filteredBusinesses.length} businesses`;
        }
    }
    
    goToPage(page) {
        this.currentPage = page;
        this.renderBusinesses();
        this.updatePagination();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    
    async openBusinessModal(businessId) {
        let business = this.businesses.find(b => b.id === businessId);
        
        // If business not found in current list, try fetching from API
        if (!business) {
            try {
                business = await BusinessMarketplaceAPI.getBusiness(businessId);
            } catch (error) {
                console.error('Error fetching business for modal:', error);
                alert('Business not found');
                return;
            }
        }
        
        if (!business) return;
        
        const modal = document.getElementById('businessModal');
        const modalCategory = document.getElementById('modalCategory');
        const modalTitle = document.getElementById('modalTitle');
        const modalLocation = document.getElementById('modalLocationText');
        const modalPhone = document.getElementById('modalPhoneText');
        const modalHours = document.getElementById('modalHoursText');
        const modalContent = document.getElementById('modalContent');
        const socialButtons = document.getElementById('socialButtons');
        
        if (modalCategory) modalCategory.textContent = business.category;
        if (modalTitle) modalTitle.textContent = business.name;
        if (modalLocation) modalLocation.textContent = `${business.province ? business.province + ', ' : ''}${business.location}`;
        if (modalPhone) modalPhone.textContent = business.phone;
        if (modalHours) modalHours.textContent = business.hours;
        if (modalContent) modalContent.innerHTML = business.fullContent || business.description;
        
        // Social buttons
        if (socialButtons) {
            let socialHTML = '';
            if (business.whatsapp) {
                socialHTML += `
                    <a href="https://wa.me/${business.whatsapp}" class="social-btn" target="_blank">
                        <i class="fab fa-whatsapp"></i>
                        WhatsApp
                    </a>
                `;
            }
            if (business.instagram) {
                socialHTML += `
                    <a href="https://instagram.com/${business.instagram.replace('@', '')}" class="social-btn" target="_blank">
                        <i class="fab fa-instagram"></i>
                        Instagram
                    </a>
                `;
            }
            if (business.tiktok) {
                socialHTML += `
                    <a href="https://tiktok.com/@${business.tiktok.replace('@', '')}" class="social-btn" target="_blank">
                        <i class="fab fa-tiktok"></i>
                        TikTok
                    </a>
                `;
            }
            // Add rating button
            socialHTML += `
                <button class="social-btn" onclick="openRatingModal('${business.id}')">
                    <i class="fas fa-star"></i>
                    Rate Business
                </button>
            `;
            socialButtons.innerHTML = socialHTML;
        }
        
        // Load and display reviews
        this.loadBusinessReviews(business.id);
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    closeBusinessModal() {
        const modal = document.getElementById('businessModal');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    openGalleryModal(galleryName) {
        const business = this.businesses.find(b => b.serviceGalleries && b.serviceGalleries[galleryName]);
        if (!business || !business.serviceGalleries[galleryName]) return;
        
        const modal = document.getElementById('galleryModal');
        const modalTitle = document.getElementById('galleryModalTitle');
        const modalImage = document.getElementById('galleryModalImage');
        const modalCounter = document.getElementById('galleryCounter');
        
        if (modalTitle) modalTitle.textContent = galleryName;
        
        const gallery = business.serviceGalleries[galleryName];
        this.currentGallery = gallery;
        this.currentGalleryIndex = 0;
        
        this.updateGalleryImage();
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    updateGalleryImage() {
        if (!this.currentGallery || this.currentGalleryIndex === undefined) return;
        
        const modalImage = document.getElementById('galleryModalImage');
        const modalCounter = document.getElementById('galleryCounter');
        const prevBtn = document.getElementById('galleryPrevBtn');
        const nextBtn = document.getElementById('galleryNextBtn');
        
        const currentImage = this.currentGallery[this.currentGalleryIndex];
        
        if (modalImage) {
            modalImage.src = currentImage.image;
            modalImage.alt = currentImage.title || '';
        }
        
        if (modalCounter) {
            modalCounter.textContent = `${this.currentGalleryIndex + 1} / ${this.currentGallery.length}`;
        }
        
        if (prevBtn) {
            prevBtn.disabled = this.currentGalleryIndex === 0;
        }
        
        if (nextBtn) {
            nextBtn.disabled = this.currentGalleryIndex === this.currentGallery.length - 1;
        }
    }
    
    previousGalleryImage() {
        if (this.currentGalleryIndex > 0) {
            this.currentGalleryIndex--;
            this.updateGalleryImage();
        }
    }
    
    nextGalleryImage() {
        if (this.currentGalleryIndex < this.currentGallery.length - 1) {
            this.currentGalleryIndex++;
            this.updateGalleryImage();
        }
    }
    
    closeGalleryModal() {
        const modal = document.getElementById('galleryModal');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    closeRatingModal() {
        const modal = document.getElementById('ratingModal');
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
    
    loadBusinessReviews(businessId) {
        const reviews = this.getBusinessReviews(businessId);
        const reviewsSection = document.getElementById('businessReviewsSection');
        const reviewsCount = document.getElementById('reviewsCount');
        const overallRating = document.getElementById('overallRating');
        const overallStars = document.getElementById('overallStars');
        const ratingBreakdown = document.getElementById('ratingBreakdown');
        const reviewsList = document.getElementById('reviewsList');
        
        if (!reviewsSection) return;
        
        // Update reviews count
        reviewsCount.textContent = `${reviews.length} review${reviews.length !== 1 ? 's' : ''}`;
        
        if (reviews.length === 0) {
            reviewsList.innerHTML = `
                <div class="no-reviews">
                    <i class="fas fa-comment-slash"></i>
                    <p>No reviews yet. Be the first to review this business!</p>
                </div>
            `;
            overallRating.textContent = '0.0';
            overallStars.innerHTML = '<i class="far fa-star"></i>'.repeat(5);
            ratingBreakdown.innerHTML = '';
            return;
        }
        
        // Calculate overall rating
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        const averageRating = (totalRating / reviews.length).toFixed(1);
        
        // Update overall rating display
        overallRating.textContent = averageRating;
        overallStars.innerHTML = renderStarsHTML(parseFloat(averageRating));
        
        // Generate rating breakdown
        const ratingCounts = {5: 0, 4: 0, 3: 0, 2: 0, 1: 0};
        reviews.forEach(review => ratingCounts[review.rating]++);
        
        ratingBreakdown.innerHTML = Object.keys(ratingCounts).reverse().map(rating => {
            const count = ratingCounts[rating];
            const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
            return `
                <div class="rating-bar">
                    <span class="star-label">${rating} star${rating !== '1' ? 's' : ''}</span>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${percentage}%"></div>
                    </div>
                    <span class="count">${count}</span>
                </div>
            `;
        }).join('');
        
        // Render reviews
        this.renderReviewsList(reviews);
    }
    
    getBusinessReviews(businessId) {
        const allReviews = JSON.parse(localStorage.getItem('businessReviews') || '{}');
        return allReviews[businessId] || [];
    }
    
    renderReviewsList(reviews) {
        const reviewsList = document.getElementById('reviewsList');
        if (!reviewsList) return;
        
        if (reviews.length === 0) {
            reviewsList.innerHTML = `
                <div class="no-reviews">
                    <i class="fas fa-comment-slash"></i>
                    <p>No reviews match your current filter.</p>
                </div>
            `;
            return;
        }
        
        reviewsList.innerHTML = reviews.map(review => `
            <div class="review-card ${review.isCurrentUser ? 'user-review' : ''}">
                <div class="review-header">
                    <div class="reviewer-info">
                        <div class="reviewer-avatar">${review.userName.charAt(0).toUpperCase()}</div>
                        <div class="reviewer-details">
                            <h4>${review.userName}</h4>
                            <div class="review-rating">
                                <div class="rating-stars">${renderStarsHTML(review.rating)}</div>
                            </div>
                        </div>
                    </div>
                    <div class="review-meta">
                        <div class="review-date">${formatReviewDate(review.date)}</div>
                        ${review.isCurrentUser ? '<div class="your-review-badge">Your Review</div>' : ''}
                    </div>
                </div>
                <div class="review-content">
                    <p>${review.review || 'No review text provided.'}</p>
                </div>
                <div class="review-actions">
                    <button class="helpful-btn" onclick="markReviewHelpful('${review.id}')">
                        <i class="fas fa-thumbs-up"></i>
                        Helpful (${review.helpfulCount || 0})
                    </button>
                    ${!review.isCurrentUser ? `
                        <button class="report-btn" onclick="reportReview('${review.id}')">
                            <i class="fas fa-flag"></i>
                            Report
                        </button>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }
    
    filterReviews() {
        const businessId = this.getCurrentBusinessId();
        if (!businessId) return;
        
        const reviews = this.getBusinessReviews(businessId);
        const sortBy = document.getElementById('reviewSort')?.value || 'newest';
        const filterBy = document.getElementById('reviewFilter')?.value || 'all';
        
        // Filter by rating
        let filteredReviews = reviews;
        if (filterBy !== 'all') {
            filteredReviews = reviews.filter(review => review.rating === parseInt(filterBy));
        }
        
        // Sort reviews
        filteredReviews.sort((a, b) => {
            switch (sortBy) {
                case 'newest':
                    return new Date(b.date) - new Date(a.date);
                case 'oldest':
                    return new Date(a.date) - new Date(b.date);
                case 'highest':
                    return b.rating - a.rating;
                case 'lowest':
                    return a.rating - b.rating;
                case 'helpful':
                    return (b.helpfulCount || 0) - (a.helpfulCount || 0);
                default:
                    return 0;
            }
        });
        
        this.renderReviewsList(filteredReviews);
    }
    
    getCurrentBusinessId() {
        // Get the current business ID from the modal
        const modal = document.getElementById('businessModal');
        if (modal && modal.style.display === 'block') {
            const businessName = document.getElementById('modalTitle')?.textContent;
            if (businessName) {
                const business = this.businesses.find(b => b.name === businessName);
                return business?.id;
            }
        }
        return null;
    }
    
    checkUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        const businessId = urlParams.get('business');
        const openModal = urlParams.get('openModal');
        
        if (businessId && openModal === 'true') {
            setTimeout(() => {
                this.openBusinessModal(businessId);
            }, 500);
        }
    }
}

// Global functions for HTML onclick events
function openGalleryModal(galleryName) {
    if (window.localBusinessManager) {
        window.localBusinessManager.openGalleryModal(galleryName);
    }
}

function previousGalleryImage() {
    if (window.localBusinessManager) {
        window.localBusinessManager.previousGalleryImage();
    }
}

function nextGalleryImage() {
    if (window.localBusinessManager) {
        window.localBusinessManager.nextGalleryImage();
    }
}

// Initialize the local business manager when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the local-business2.html page
    if (document.getElementById('businessGrid')) {
        window.localBusinessManager = new LocalBusinessManager();
    }
});

// Hybrid Approach Functions
function openBusinessFullPage(businessId = null) {
    const currentBusinessId = businessId || window.localBusinessManager?.getCurrentBusinessId();
    if (currentBusinessId) {
        // Navigate to dedicated business page
        window.location.href = `local-business-info.html?id=${currentBusinessId}`;
    }
}

function shareBusiness() {
    const currentBusinessId = window.localBusinessManager?.getCurrentBusinessId();
    if (!currentBusinessId) return;
    
    const business = getRegularBusinesses().find(b => b.id === currentBusinessId);
    if (!business) return;
    
    const shareData = {
        title: business.name,
        text: business.description,
        url: window.location.origin + `/business-detail.html?id=${currentBusinessId}`
    };
    
    if (navigator.share) {
        navigator.share(shareData)
            .then(() => console.log('Business shared successfully'))
            .catch((error) => console.log('Error sharing business:', error));
    } else {
        // Fallback for browsers that don't support Web Share API
        const shareUrl = shareData.url;
        navigator.clipboard.writeText(shareUrl).then(() => {
            alert('Business link copied to clipboard!');
        }).catch(() => {
            // Fallback if clipboard API is not available
            const textArea = document.createElement('textarea');
            textArea.value = shareUrl;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert('Business link copied to clipboard!');
        });
    }
}

// Functions are available globally for use in local-business.html
