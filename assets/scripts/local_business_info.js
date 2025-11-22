// Local Business Info Page
// Fetches and displays single business details on local_business_info.html

const API_BASE_URL = 'https://acc.comparehubprices.site/business/business/public';

class BusinessInfoManager {
    constructor() {
        this.businessId = null;
        this.businessData = null;
        this.galleryData = {};
        
        this.init();
    }

    async init() {
        // Get business ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        this.businessId = urlParams.get('id') || urlParams.get('businessId');
        
        if (!this.businessId) {
            this.showError('No business ID provided');
            return;
        }

        await this.loadBusiness();
    }

    async loadBusiness() {
        try {
            const response = await fetch(`${API_BASE_URL}/${this.businessId}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success && data.business) {
                this.businessData = data.business;
                this.renderBusiness();
            } else {
                throw new Error(data.message || 'Business not found');
            }
        } catch (error) {
            console.error('Error loading business:', error);
            this.showError('Failed to load business information. Please try again.');
        }
    }

    renderBusiness() {
        if (!this.businessData) return;

        this.renderHero();
        this.renderDescription();
        this.renderServicesAndGallery();
        this.renderMap();
        this.renderSocialButtons();
        this.renderReviews();
        
        // Set gallery data for modal
        if (this.businessData.serviceGalleries) {
            if (typeof setGalleryData === 'function') {
                setGalleryData(this.businessData.serviceGalleries);
            }
        }
    }

    renderHero() {
        const business = this.businessData;
        const logo = business.logo || business.businessLogoUrl || 'assets/logo .png';
        const name = business.businessName || business.name || 'Business';
        const description = business.description || business.moreInformation || '';
        const category = business.category || 'General';
        const address = business.address || '';
        const averageRating = this.getAverageRating();
        const totalRatings = this.getTotalRatings();

        // Hero image
        const heroImage = document.getElementById('businessHeroImage');
        if (heroImage) {
            heroImage.src = logo;
            heroImage.alt = name;
        }

        // Category badge
        const categoryBadge = document.getElementById('businessCategoryBadge');
        if (categoryBadge) {
            categoryBadge.textContent = category;
        }

        // Title
        const title = document.getElementById('businessTitle');
        if (title) {
            title.textContent = name;
        }

        // Subtitle
        const subtitle = document.getElementById('businessSubtitle');
        if (subtitle) {
            subtitle.textContent = description.substring(0, 100) + (description.length > 100 ? '...' : '');
        }

        // Rating
        const ratingStars = document.getElementById('businessRatingStars');
        const ratingText = document.getElementById('businessRatingText');
        if (ratingStars) {
            ratingStars.innerHTML = this.renderStarsHTML(averageRating);
        }
        if (ratingText) {
            ratingText.textContent = averageRating > 0 
                ? `${averageRating.toFixed(1)} (${totalRatings} ${totalRatings === 1 ? 'review' : 'reviews'})`
                : '0.0 (0 reviews)';
        }

        // Location
        const locationText = document.getElementById('businessLocationText');
        if (locationText) {
            locationText.textContent = address || 'Address not available';
        }
    }

    renderDescription() {
        const business = this.businessData;
        const description = business.moreInformation || business.description || '';
        const services = business.ourServices || '';

        const descriptionEl = document.getElementById('businessDescription');
        if (!descriptionEl) return;

        let html = '';
        
        if (description) {
            // Split by paragraphs if it contains newlines
            const paragraphs = description.split('\n').filter(p => p.trim());
            paragraphs.forEach(p => {
                html += `<p>${this.escapeHtml(p.trim())}</p>`;
            });
        }

        if (services) {
            html += `<h3>Our Services</h3>`;
            const serviceParagraphs = services.split('\n').filter(p => p.trim());
            serviceParagraphs.forEach(p => {
                html += `<p>${this.escapeHtml(p.trim())}</p>`;
            });
        }

        if (!html) {
            html = '<p>No description available for this business.</p>';
        }

        descriptionEl.innerHTML = html;
    }

    renderServicesAndGallery() {
        const business = this.businessData;
        const servicesGrid = document.getElementById('servicesGrid');
        if (!servicesGrid) return;

        if (!business.serviceGalleries || Object.keys(business.serviceGalleries).length === 0) {
            servicesGrid.innerHTML = '<p class="text-muted">No services or gallery items available.</p>';
            return;
        }

        let servicesHTML = '';
        this.galleryData = {};

        Object.keys(business.serviceGalleries).forEach(serviceName => {
            const images = business.serviceGalleries[serviceName];
            
            // Ensure images is an array
            let imageArray = [];
            if (Array.isArray(images)) {
                imageArray = images;
            } else if (images && typeof images === 'object') {
                // If it's an object, try to convert to array
                if (images.images && Array.isArray(images.images)) {
                    imageArray = images.images;
                } else if (images.items && Array.isArray(images.items)) {
                    imageArray = images.items;
                } else {
                    // Try to get values if it's an object with numeric keys
                    imageArray = Object.values(images).filter(item => item !== null && item !== undefined);
                }
            } else if (typeof images === 'string') {
                // Single image as string
                imageArray = [images];
            }
            
            if (imageArray.length > 0) {
                // Store gallery data for modal
                this.galleryData[serviceName] = imageArray.map(img => {
                    if (typeof img === 'string') {
                        return img;
                    } else if (img && typeof img === 'object') {
                        return img.image || img.url || img.src || '';
                    }
                    return '';
                }).filter(url => url !== '');

                if (this.galleryData[serviceName].length === 0) {
                    return; // Skip if no valid images
                }

                // Show first 4 images, then "+X more" card
                const visibleImages = this.galleryData[serviceName].slice(0, 4);
                const remainingCount = this.galleryData[serviceName].length - 4;

                servicesHTML += `
                    <div class="service-card">
                        <h4>${this.escapeHtml(serviceName)}</h4>
                        <div class="service-gallery">
                            ${visibleImages.map((imageUrl, index) => {
                                return `
                                    <div class="gallery-item" onclick="openGalleryModal('${this.escapeHtml(serviceName)}', ${index})">
                                        <div class="gallery-item-image-wrapper">
                                            <img src="${imageUrl}" alt="${this.escapeHtml(serviceName)}" loading="lazy" onerror="this.src='assets/logo .png'">
                                        </div>
                                    </div>
                                `;
                            }).join('')}
                            ${remainingCount > 0 ? `
                                <div class="gallery-more" onclick="openGalleryModal('${this.escapeHtml(serviceName)}', 4)">
                                    <span>+${remainingCount} more</span>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                `;
            }
        });

        servicesGrid.innerHTML = servicesHTML || '<p class="text-muted">No services or gallery items available.</p>';
    }

    renderMap() {
        const business = this.businessData;
        const address = business.address || business.businessAddress || '';
        
        if (address && typeof renderBusinessMap === 'function') {
            renderBusinessMap(address);
        }
    }

    renderSocialButtons() {
        const business = this.businessData;
        const socialButtons = document.getElementById('socialButtons');
        if (!socialButtons) return;

        const social = business.socialMedia || {};
        const phone = business.phone || business.businessNumber || '';

        let buttonsHTML = '';

        // Phone
        if (phone) {
            buttonsHTML += `
                <a href="tel:${phone}" class="social-btn phone">
                    <i class="fas fa-phone"></i>
                    <span>Call Us</span>
                </a>
            `;
        }

        // WhatsApp
        if (social.whatsapp) {
            buttonsHTML += `
                <a href="${social.whatsapp}" target="_blank" class="social-btn whatsapp">
                    <i class="fab fa-whatsapp"></i>
                    <span>WhatsApp</span>
                </a>
            `;
        }

        // Instagram
        if (social.instagram) {
            buttonsHTML += `
                <a href="${social.instagram}" target="_blank" class="social-btn instagram">
                    <i class="fab fa-instagram"></i>
                    <span>Instagram</span>
                </a>
            `;
        }

        // TikTok
        if (social.tiktok) {
            buttonsHTML += `
                <a href="${social.tiktok}" target="_blank" class="social-btn tiktok">
                    <i class="fab fa-tiktok"></i>
                    <span>TikTok</span>
                </a>
            `;
        }

        // Twitter/X
        if (social.twitter) {
            buttonsHTML += `
                <a href="${social.twitter}" target="_blank" class="social-btn twitter">
                    <i class="fa-brands fa-x-twitter"></i>
                    <span>Twitter</span>
                </a>
            `;
        }

        // Facebook
        if (social.facebook) {
            buttonsHTML += `
                <a href="${social.facebook}" target="_blank" class="social-btn facebook">
                    <i class="fab fa-facebook"></i>
                    <span>Facebook</span>
                </a>
            `;
        }

        socialButtons.innerHTML = buttonsHTML || '<p class="text-muted">No social media links available.</p>';
    }

    renderReviews() {
        const reviewsSummary = document.getElementById('reviewsSummary');
        const reviewsList = document.getElementById('reviewsList');
        
        const averageRating = this.getAverageRating();
        const totalRatings = this.getTotalRatings();
        const reviews = this.getReviews();

        // Render summary
        if (reviewsSummary) {
            const stats = this.getReviewStatistics();
            
            reviewsSummary.innerHTML = `
                <div class="rating-stats">
                    <div class="rating-score-large">${averageRating > 0 ? averageRating.toFixed(1) : '0.0'}</div>
                    <div class="rating-stars large">
                        ${this.renderStarsHTML(averageRating)}
                    </div>
                    <div class="rating-count">${totalRatings} ${totalRatings === 1 ? 'review' : 'reviews'}</div>
                </div>
                <div class="rating-breakdown">
                    ${[5, 4, 3, 2, 1].map(star => {
                        const count = stats[star] || 0;
                        const percentage = totalRatings > 0 ? (count / totalRatings) * 100 : 0;
                        return `
                            <div class="rating-bar">
                                <span class="star-label">${star} ${star === 1 ? 'star' : 'stars'}</span>
                                <div class="progress-bar">
                                    <div class="progress-fill" style="width: ${percentage}%"></div>
                                </div>
                                <span class="count">${count}</span>
                            </div>
                        `;
                    }).join('')}
                </div>
            `;
        }

        // Render reviews list
        if (reviewsList) {
            if (reviews.length === 0) {
                reviewsList.innerHTML = `
                    <div class="text-center py-5">
                        <i class="fas fa-comments fa-3x text-muted mb-3"></i>
                        <h4>No reviews yet</h4>
                        <p class="text-muted">Be the first to review this business!</p>
                    </div>
                `;
            } else {
                reviewsList.innerHTML = reviews.map(review => this.renderReviewCard(review)).join('');
            }
        }
    }

    renderReviewCard(review) {
        const initials = this.getInitials(review.reviewerName || 'Anonymous');
        const date = this.formatReviewDate(review.date || review.timestamp);
        
        return `
            <div class="review-card ${review.isUserReview ? 'user-review' : ''}">
                <div class="review-header">
                    <div class="reviewer-info">
                        <div class="reviewer-avatar">${initials}</div>
                        <div class="reviewer-details">
                            <h4>${this.escapeHtml(review.reviewerName || 'Anonymous')}</h4>
                            <div class="review-rating">
                                <div class="rating-stars">
                                    ${this.renderStarsHTML(review.rating)}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="review-meta">
                        <div class="review-date">${date}</div>
                        ${review.isUserReview ? '<div class="your-review-badge">Your Review</div>' : ''}
                    </div>
                </div>
                <div class="review-content">
                    <p>${this.escapeHtml(review.comment || '')}</p>
                </div>
                ${!review.isUserReview ? `
                    <div class="review-actions">
                        <button class="helpful-btn" onclick="markReviewHelpful('${review.id}')">
                            <i class="fas fa-thumbs-up"></i>
                            Helpful (${review.helpfulCount || 0})
                        </button>
                        <button class="report-btn" onclick="reportReview('${review.id}')">
                            <i class="fas fa-flag"></i>
                            Report
                        </button>
                    </div>
                ` : ''}
            </div>
        `;
    }

    getAverageRating() {
        const ratings = JSON.parse(localStorage.getItem('businessRatings') || '{}');
        const businessRatings = ratings[this.businessId] || [];
        if (businessRatings.length === 0) return 0;
        
        const sum = businessRatings.reduce((acc, r) => acc + r.rating, 0);
        return sum / businessRatings.length;
    }

    getTotalRatings() {
        const ratings = JSON.parse(localStorage.getItem('businessRatings') || '{}');
        const businessRatings = ratings[this.businessId] || [];
        return businessRatings.length;
    }

    getReviews() {
        const ratings = JSON.parse(localStorage.getItem('businessRatings') || '{}');
        const businessRatings = ratings[this.businessId] || [];
        
        return businessRatings
            .map(r => ({
                id: r.id || Date.now().toString(),
                reviewerName: r.reviewerName || 'Anonymous',
                rating: r.rating,
                comment: r.comment || '',
                date: r.date || new Date().toISOString(),
                helpfulCount: r.helpfulCount || 0,
                isUserReview: r.isUserReview || false
            }))
            .sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    getReviewStatistics() {
        const reviews = this.getReviews();
        const stats = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        
        reviews.forEach(review => {
            const rating = Math.round(review.rating);
            if (rating >= 1 && rating <= 5) {
                stats[rating]++;
            }
        });
        
        return stats;
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

    getInitials(name) {
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    }

    formatReviewDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
        return `${Math.floor(diffDays / 365)} years ago`;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showError(message) {
        const main = document.querySelector('main');
        if (main) {
            main.innerHTML = `
                <div class="container py-5">
                    <div class="alert alert-danger" role="alert">
                        <i class="fas fa-exclamation-circle"></i> ${this.escapeHtml(message)}
                    </div>
                </div>
            `;
        }
    }

    getCurrentBusinessId() {
        return this.businessId;
    }
}

// Gallery Modal Functions
let currentGallery = [];
let currentGalleryIndex = 0;
let currentServiceName = '';

function setGalleryData(serviceGalleries) {
    window.galleryData = {};
    if (serviceGalleries) {
        Object.keys(serviceGalleries).forEach(serviceName => {
            const images = serviceGalleries[serviceName];
            if (Array.isArray(images)) {
                window.galleryData[serviceName] = images.map(img => {
                    return typeof img === 'string' ? img : (img.image || img.url || '');
                });
            }
        });
    }
}

function openGalleryModal(serviceName, imageIndex = 0) {
    if (!window.galleryData || !window.galleryData[serviceName] || window.galleryData[serviceName].length === 0) return;
    
    currentGallery = window.galleryData[serviceName];
    currentGalleryIndex = imageIndex;
    currentServiceName = serviceName;
    
    const modal = document.getElementById('galleryModal');
    const modalTitle = document.getElementById('galleryModalTitle');
    
    if (modalTitle) {
        modalTitle.textContent = serviceName;
    }
    
    updateGalleryImage();
    
    if (modal) {
        const bootstrapModal = new bootstrap.Modal(modal);
        bootstrapModal.show();
    }
}

function updateGalleryImage() {
    if (!currentGallery || currentGalleryIndex === undefined) return;
    
    const modalImage = document.getElementById('galleryModalImage');
    const modalCounter = document.getElementById('galleryCounter');
    const prevBtn = document.getElementById('galleryPrevBtn');
    const nextBtn = document.getElementById('galleryNextBtn');
    
    const currentImage = currentGallery[currentGalleryIndex];
    
    if (modalImage) {
        modalImage.classList.remove('loaded');
        modalImage.classList.add('loading');
        modalImage.src = '';
        modalImage.src = currentImage;
        modalImage.alt = `${currentServiceName} - Image ${currentGalleryIndex + 1}`;
        
        modalImage.onload = () => {
            modalImage.classList.remove('loading');
            modalImage.classList.add('loaded');
        };
    }
    
    if (modalCounter) {
        modalCounter.textContent = `${currentGalleryIndex + 1} / ${currentGallery.length}`;
    }
    
    if (prevBtn) {
        prevBtn.disabled = currentGalleryIndex === 0;
        prevBtn.style.opacity = currentGalleryIndex === 0 ? '0.5' : '1';
    }
    
    if (nextBtn) {
        nextBtn.disabled = currentGalleryIndex === currentGallery.length - 1;
        nextBtn.style.opacity = currentGalleryIndex === currentGallery.length - 1 ? '0.5' : '1';
    }
}

function previousGalleryImage() {
    if (currentGalleryIndex > 0) {
        currentGalleryIndex--;
        updateGalleryImage();
    }
}

function nextGalleryImage() {
    if (currentGalleryIndex < currentGallery.length - 1) {
        currentGalleryIndex++;
        updateGalleryImage();
    }
}

// Make functions globally accessible
window.openGalleryModal = openGalleryModal;
window.previousGalleryImage = previousGalleryImage;
window.nextGalleryImage = nextGalleryImage;
window.setGalleryData = setGalleryData;

// Render Business Map
function renderBusinessMap(address) {
    if (!address) return;
    
    const encodedAddress = encodeURIComponent(address);
    
    const mapIframe = `
        <iframe
            title="Business location map"
            width="100%"
            height="260"
            style="border:0; border-radius: 12px;"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps?q=${encodedAddress}&output=embed">
        </iframe>
    `;
    
    const mainMap = document.getElementById('businessMapMain');
    if (mainMap) {
        mainMap.innerHTML = mapIframe;
    }
}

window.renderBusinessMap = renderBusinessMap;

// Rating Modal Functionality
let selectedRating = 0;

function openRatingModal() {
    selectedRating = 0;
    const modal = document.getElementById('ratingModal');
    if (modal) {
        // Update modal content with current business data
        updateRatingModalContent();
        
        const bootstrapModal = new bootstrap.Modal(modal);
        bootstrapModal.show();
        // Reset stars
        resetStars();
    }
}

function updateRatingModalContent() {
    if (!window.businessInfoManager || !window.businessInfoManager.businessData) return;
    
    const business = window.businessInfoManager.businessData;
    const businessId = window.businessInfoManager.businessId;
    const averageRating = window.businessInfoManager.getAverageRating();
    const totalRatings = window.businessInfoManager.getTotalRatings();
    
    // Update business name in modal
    const modalTitle = document.getElementById('ratingModalTitle');
    if (modalTitle) {
        modalTitle.textContent = `Rate ${business.businessName || business.name || 'This Business'}`;
    }
    
    // Update current rating display
    const ratingScore = document.getElementById('currentRatingScore');
    const ratingCount = document.getElementById('currentRatingCount');
    const ratingStars = document.getElementById('currentRatingStars');
    
    if (ratingScore) {
        ratingScore.textContent = averageRating > 0 ? averageRating.toFixed(1) : '0.0';
    }
    if (ratingCount) {
        ratingCount.textContent = `${totalRatings} ${totalRatings === 1 ? 'rating' : 'ratings'}`;
    }
    if (ratingStars) {
        ratingStars.innerHTML = window.businessInfoManager.renderStarsHTML(averageRating);
    }
}

function closeRatingModal() {
    const modal = document.getElementById('ratingModal');
    if (modal) {
        const bootstrapModal = bootstrap.Modal.getInstance(modal);
        if (bootstrapModal) {
            bootstrapModal.hide();
        }
    }
    document.body.style.overflow = 'auto';
}

function selectRating(rating) {
    selectedRating = rating;
    const stars = document.querySelectorAll('.interactive-star');
    const labels = document.querySelectorAll('.rating-label');
    
    stars.forEach((star, index) => {
        if (index < rating) {
            star.className = 'fas fa-star interactive-star';
        } else {
            star.className = 'far fa-star interactive-star';
        }
    });
    
    labels.forEach(label => {
        label.classList.remove('active');
        if (parseInt(label.dataset.rating) === rating) {
            label.classList.add('active');
        }
    });
}

function resetStars() {
    const stars = document.querySelectorAll('.interactive-star');
    const labels = document.querySelectorAll('.rating-label');
    
    stars.forEach(star => {
        star.className = 'far fa-star interactive-star';
    });
    
    labels.forEach(label => {
        label.classList.remove('active');
    });
}

function submitRating() {
    const reviewText = document.getElementById('ratingReview')?.value.trim() || '';
    
    if (selectedRating === 0) {
        alert('Please select a rating before submitting.');
        return;
    }
    
    if (!window.businessInfoManager || !window.businessInfoManager.businessId) {
        alert('Business information not available.');
        return;
    }
    
    const businessId = window.businessInfoManager.businessId;
    
    // Save rating to localStorage
    const ratings = JSON.parse(localStorage.getItem('businessRatings') || '{}');
    if (!ratings[businessId]) {
        ratings[businessId] = [];
    }
    
    const review = {
        id: Date.now().toString(),
        rating: selectedRating,
        comment: reviewText,
        date: new Date().toISOString(),
        reviewerName: 'You',
        isUserReview: true,
        helpfulCount: 0
    };
    
    ratings[businessId].push(review);
    localStorage.setItem('businessRatings', JSON.stringify(ratings));
    
    // Show success message
    showRatingSuccess();
    
    // Close modal
    closeRatingModal();
    
    // Reset form
    const reviewTextarea = document.getElementById('ratingReview');
    if (reviewTextarea) {
        reviewTextarea.value = '';
    }
    selectedRating = 0;
    resetStars();
    
    // Refresh reviews
    if (window.businessInfoManager) {
        window.businessInfoManager.renderReviews();
        window.businessInfoManager.renderHero();
    }
}

function showRatingSuccess() {
    const successMsg = document.createElement('div');
    successMsg.className = 'rating-success-message show';
    successMsg.innerHTML = `
        <i class="fas fa-check-circle"></i>
        <span>Thank you! Your rating has been submitted.</span>
    `;
    document.body.appendChild(successMsg);
    
    setTimeout(() => {
        successMsg.classList.remove('show');
        setTimeout(() => {
            if (document.body.contains(successMsg)) {
                document.body.removeChild(successMsg);
            }
        }, 300);
    }, 3000);
}

// Add hover effects to rating labels
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
    
    const interactiveRating = document.querySelector('.interactive-rating');
    if (interactiveRating) {
        interactiveRating.addEventListener('mouseleave', () => {
            labels.forEach(label => label.classList.remove('hover'));
        });
    }
}

// Make functions globally accessible
window.openRatingModal = openRatingModal;
window.closeRatingModal = closeRatingModal;
window.selectRating = selectRating;
window.submitRating = submitRating;

// Review helper functions
function markReviewHelpful(reviewId) {
    // TODO: Implement helpful functionality
    console.log('Mark review helpful:', reviewId);
}

function reportReview(reviewId) {
    // TODO: Implement report functionality
    console.log('Report review:', reviewId);
}

window.markReviewHelpful = markReviewHelpful;
window.reportReview = reportReview;

// Review sorting and filtering
function sortReviews() {
    const sortSelect = document.getElementById('reviewSort');
    if (!sortSelect || !window.businessInfoManager) return;
    
    const sortBy = sortSelect.value;
    const reviews = window.businessInfoManager.getReviews();
    
    let sortedReviews = [...reviews];
    
    switch (sortBy) {
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
        case 'helpful':
            sortedReviews.sort((a, b) => (b.helpfulCount || 0) - (a.helpfulCount || 0));
            break;
    }
    
    const reviewsList = document.getElementById('reviewsList');
    if (reviewsList) {
        reviewsList.innerHTML = sortedReviews.map(review => window.businessInfoManager.renderReviewCard(review)).join('');
    }
}

function filterReviews() {
    const filterSelect = document.getElementById('reviewFilter');
    if (!filterSelect || !window.businessInfoManager) return;
    
    const filterBy = filterSelect.value;
    const reviews = window.businessInfoManager.getReviews();
    
    let filteredReviews = reviews;
    
    if (filterBy !== 'all') {
        const rating = parseInt(filterBy);
        filteredReviews = reviews.filter(review => Math.round(review.rating) === rating);
    }
    
    const reviewsList = document.getElementById('reviewsList');
    if (reviewsList) {
        if (filteredReviews.length === 0) {
            reviewsList.innerHTML = `
                <div class="text-center py-5">
                    <i class="fas fa-comments fa-3x text-muted mb-3"></i>
                    <h4>No reviews found</h4>
                    <p class="text-muted">No reviews match the selected filter.</p>
                </div>
            `;
        } else {
            reviewsList.innerHTML = filteredReviews.map(review => window.businessInfoManager.renderReviewCard(review)).join('');
        }
    }
}

window.sortReviews = sortReviews;
window.filterReviews = filterReviews;

// Share business function
function shareBusiness() {
    if (!window.businessInfoManager || !window.businessInfoManager.businessId) {
        alert('Business information not available.');
        return;
    }
    
    const businessId = window.businessInfoManager.businessId;
    const businessName = window.businessInfoManager.businessData?.businessName || window.businessInfoManager.businessData?.name || 'Business';
    const url = `${window.location.origin}${window.location.pathname}?id=${businessId}`;
    
    if (navigator.share) {
        navigator.share({
            title: `Check out ${businessName} on CompareHubPrices`,
            text: `Check out ${businessName} on CompareHubPrices`,
            url: url
        }).catch(err => {
            console.log('Error sharing:', err);
            copyToClipboard(url);
        });
    } else {
        copyToClipboard(url);
    }
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Link copied to clipboard!');
    }).catch(err => {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            alert('Link copied to clipboard!');
        } catch (err) {
            alert('Failed to copy link. Please copy manually: ' + text);
        }
        document.body.removeChild(textarea);
    });
}

window.shareBusiness = shareBusiness;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.businessInfoManager = new BusinessInfoManager();
    addRatingLabelHoverEffects();
    
    // Keyboard navigation for gallery modal
    const galleryModal = document.getElementById('galleryModal');
    if (galleryModal) {
        galleryModal.addEventListener('shown.bs.modal', function() {
            document.addEventListener('keydown', handleGalleryKeyDown);
        });
        
        galleryModal.addEventListener('hidden.bs.modal', function() {
            document.removeEventListener('keydown', handleGalleryKeyDown);
        });
    }
});

function handleGalleryKeyDown(e) {
    if (e.key === 'ArrowLeft') {
        previousGalleryImage();
    } else if (e.key === 'ArrowRight') {
        nextGalleryImage();
    } else if (e.key === 'Escape') {
        const modal = document.getElementById('galleryModal');
        if (modal) {
            const bootstrapModal = bootstrap.Modal.getInstance(modal);
            if (bootstrapModal) {
                bootstrapModal.hide();
            }
        }
    }
}
