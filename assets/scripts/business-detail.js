// Business Detail Page Manager
// Handles loading and displaying business information on local_business_info.html

class BusinessDetailManager {
    constructor() {
        this.businessId = null;
        this.businessData = null;
        this.mapInstance = null;
        this.mapInitialized = false;
        this.init();
    }

    async init() {
        // Show loader
        this.showLoader();
        
        // Get business ID from URL
        this.businessId = this.getBusinessIdFromUrl();
        
        if (!this.businessId) {
            this.hideLoader();
            this.showError('Business ID not found in URL');
            return;
        }

        // Load business data
        try {
            await this.loadBusinessData(this.businessId);
            this.renderBusinessData();
            this.initializeMap();
            this.hideLoader();
        } catch (error) {
            console.error('Error loading business:', error);
            this.hideLoader();
            this.showError('Failed to load business information. Please try again.');
        }
    }

    getBusinessIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id') || urlParams.get('businessId');
    }

    async loadBusinessData(businessId) {
        try {
            // Use the BusinessMarketplaceAPI from local-business2.js
            if (typeof BusinessMarketplaceAPI === 'undefined') {
                throw new Error('BusinessMarketplaceAPI not available');
            }

            const business = await BusinessMarketplaceAPI.getBusiness(businessId);
            this.businessData = business;
            console.log('Business data loaded:', business);
        } catch (error) {
            console.error('Error fetching business:', error);
            throw error;
        }
    }

    showLoader() {
        const loader = document.getElementById('pageLoadingOverlay');
        if (loader) {
            loader.classList.remove('hidden');
        }
    }

    hideLoader() {
        const loader = document.getElementById('pageLoadingOverlay');
        if (loader) {
            loader.classList.add('hidden');
        }
    }

    showError(message) {
        const mainContent = document.querySelector('.business-detail-container');
        if (mainContent) {
            mainContent.innerHTML = `
                <div class="container">
                    <div class="alert alert-danger" role="alert">
                        <h4 class="alert-heading">Error</h4>
                        <p>${message}</p>
                        <hr>
                        <p class="mb-0">
                            <a href="local-business2.html" class="btn btn-primary">Go Back to Business List</a>
                        </p>
                    </div>
                </div>
            `;
        }
    }

    renderBusinessData() {
        if (!this.businessData) return;

        const business = this.businessData;

        // Hero Section
        this.updateElement('businessHeroImage', 'src', business.image || 'https://via.placeholder.com/400x300?text=No+Image');
        this.updateElement('businessHeroImage', 'alt', business.name);
        this.updateElement('businessCategoryBadge', 'textContent', business.category || 'Business');
        this.updateElement('businessTitle', 'textContent', business.name || 'Business Name');
        this.updateElement('businessSubtitle', 'textContent', business.description || '');
        this.updateElement('businessLocationText', 'textContent', 
            `${business.province ? business.province + ', ' : ''}${business.location || 'Location not specified'}`);

        // Rating
        const averageRating = this.getAverageRating(business.id);
        const totalRatings = this.getTotalRatings(business.id);
        this.renderRatingStars('businessRatingStars', averageRating);
        this.updateElement('businessRatingText', 'textContent', 
            `${averageRating.toFixed(1)} (${totalRatings} ${totalRatings === 1 ? 'review' : 'reviews'})`);

        // Breadcrumb
        this.updateElement('breadcrumbBusinessName', 'textContent', business.name || 'Business Details');

        // Description
        const descriptionElement = document.getElementById('businessDescription');
        if (descriptionElement) {
            descriptionElement.innerHTML = business.fullContent || business.description || 'No description available.';
        }

        // Services & Gallery
        this.renderServicesAndGallery(business);

        // Contact Information
        this.renderContactInfo(business);

        // Business Hours
        this.renderBusinessHours(business);

        // Social Buttons
        this.renderSocialButtons(business);

        // Reviews
        this.renderReviews(business.id);
    }

    updateElement(id, property, value) {
        const element = document.getElementById(id);
        if (element) {
            if (property === 'textContent' || property === 'innerHTML') {
                element[property] = value;
            } else {
                element.setAttribute(property, value);
            }
        }
    }

    renderRatingStars(containerId, rating) {
        const container = document.getElementById(containerId);
        if (!container) return;

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

        container.innerHTML = starsHTML;
    }

    renderServicesAndGallery(business) {
        const servicesGrid = document.getElementById('servicesGrid');
        if (!servicesGrid) return;

        if (!business.serviceGalleries || Object.keys(business.serviceGalleries).length === 0) {
            servicesGrid.innerHTML = '<p class="text-muted">No services or gallery items available.</p>';
            return;
        }

        let servicesHTML = '';
        Object.keys(business.serviceGalleries).forEach(serviceName => {
            const images = business.serviceGalleries[serviceName];
            if (images && images.length > 0) {
                servicesHTML += `
                    <div class="service-item">
                        <h4>${serviceName}</h4>
                        <div class="service-gallery">
                            ${images.map((img, index) => `
                                <div class="gallery-item" onclick="openGalleryImage('${img.image}', '${serviceName}', ${index})">
                                    <img src="${img.image}" alt="${img.title || serviceName}" loading="lazy">
                                    ${img.title ? `<div class="gallery-item-title">${img.title}</div>` : ''}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }
        });

        servicesGrid.innerHTML = servicesHTML || '<p class="text-muted">No services or gallery items available.</p>';
    }

    renderContactInfo(business) {
        const contactHTML = `
            <div class="contact-item">
                <i class="fas fa-phone"></i>
                <div class="contact-info">
                    <strong>Phone</strong>
                    <a href="tel:${business.phone || ''}">${business.phone || 'Not available'}</a>
                </div>
            </div>
            <div class="contact-item">
                <i class="fas fa-map-marker-alt"></i>
                <div class="contact-info">
                    <strong>Address</strong>
                    <span>${business.location || 'Address not available'}</span>
                </div>
            </div>
            ${business.province ? `
                <div class="contact-item">
                    <i class="fas fa-building"></i>
                    <div class="contact-info">
                        <strong>Province</strong>
                        <span>${business.province}</span>
                    </div>
                </div>
            ` : ''}
        `;

        // Update both mobile and desktop contact sections
        const contactDetails = document.getElementById('contactDetails');
        const contactDetailsDesktop = document.getElementById('contactDetailsDesktop');
        if (contactDetails) contactDetails.innerHTML = contactHTML;
        if (contactDetailsDesktop) contactDetailsDesktop.innerHTML = contactHTML;
    }

    renderBusinessHours(business) {
        const hoursHTML = business.hours ? `
            <div class="hours-item">
                ${business.hours}
            </div>
        ` : `
            <div class="hours-item">
                <p class="text-muted">Business hours not specified</p>
            </div>
        `;

        const businessHours = document.getElementById('businessHours');
        const businessHoursDesktop = document.getElementById('businessHoursDesktop');
        if (businessHours) businessHours.innerHTML = hoursHTML;
        if (businessHoursDesktop) businessHoursDesktop.innerHTML = hoursHTML;
    }

    renderSocialButtons(business) {
        let socialHTML = '';

        if (business.whatsapp) {
            socialHTML += `
                <a href="https://wa.me/${business.whatsapp.replace(/[^0-9]/g, '')}" class="social-btn" target="_blank" rel="noopener">
                    <i class="fab fa-whatsapp"></i>
                    WhatsApp
                </a>
            `;
        }

        if (business.instagram) {
            const instagramHandle = business.instagram.replace('@', '').replace('https://instagram.com/', '').replace('https://www.instagram.com/', '');
            socialHTML += `
                <a href="https://instagram.com/${instagramHandle}" class="social-btn" target="_blank" rel="noopener">
                    <i class="fab fa-instagram"></i>
                    Instagram
                </a>
            `;
        }

        if (business.tiktok) {
            const tiktokHandle = business.tiktok.replace('@', '').replace('https://tiktok.com/@', '').replace('https://www.tiktok.com/@', '');
            socialHTML += `
                <a href="https://tiktok.com/@${tiktokHandle}" class="social-btn" target="_blank" rel="noopener">
                    <i class="fab fa-tiktok"></i>
                    TikTok
                </a>
            `;
        }

        if (business.facebook) {
            socialHTML += `
                <a href="${business.facebook.startsWith('http') ? business.facebook : 'https://facebook.com/' + business.facebook}" class="social-btn" target="_blank" rel="noopener">
                    <i class="fab fa-facebook"></i>
                    Facebook
                </a>
            `;
        }

        if (business.linkedin) {
            socialHTML += `
                <a href="${business.linkedin.startsWith('http') ? business.linkedin : 'https://linkedin.com/company/' + business.linkedin}" class="social-btn" target="_blank" rel="noopener">
                    <i class="fab fa-linkedin"></i>
                    LinkedIn
                </a>
            `;
        }

        if (business.twitter) {
            const twitterHandle = business.twitter.replace('@', '').replace('https://twitter.com/', '').replace('https://www.twitter.com/', '');
            socialHTML += `
                <a href="https://twitter.com/${twitterHandle}" class="social-btn" target="_blank" rel="noopener">
                    <i class="fab fa-twitter"></i>
                    Twitter
                </a>
            `;
        }

        if (!socialHTML) {
            socialHTML = '<p class="text-muted">No social media links available</p>';
        }

        // Update all social button containers
        const socialButtons = document.getElementById('socialButtons');
        const socialButtonsDesktop = document.getElementById('socialButtonsDesktop');
        if (socialButtons) socialButtons.innerHTML = socialHTML;
        if (socialButtonsDesktop) socialButtonsDesktop.innerHTML = socialHTML;
    }

    renderReviews(businessId) {
        const reviews = this.getReviewsForBusiness(businessId);
        const averageRating = this.getAverageRating(businessId);
        const totalRatings = reviews.length;

        // Update reviews summary
        const reviewsSummary = document.getElementById('reviewsSummary');
        if (reviewsSummary) {
            reviewsSummary.innerHTML = `
                <div class="rating-stats">
                    <div class="rating-score-large">${averageRating.toFixed(1)}</div>
                    <div class="rating-stars large">
                        ${this.renderStarsHTML(averageRating)}
                    </div>
                    <div class="rating-count">${totalRatings} ${totalRatings === 1 ? 'rating' : 'ratings'}</div>
                </div>
            `;
        }

        // Render reviews list
        this.renderReviewsList(reviews);
    }

    renderReviewsList(reviews) {
        const reviewsList = document.getElementById('reviewsList');
        if (!reviewsList) return;

        if (reviews.length === 0) {
            reviewsList.innerHTML = `
                <div class="no-reviews">
                    <i class="fas fa-comment-slash"></i>
                    <p>No reviews yet. Be the first to review this business!</p>
                </div>
            `;
            return;
        }

        const reviewsHTML = reviews.map(review => `
            <div class="review-card ${review.isUserReview ? 'user-review' : ''}">
                <div class="review-header">
                    <div class="reviewer-info">
                        <div class="reviewer-avatar">
                            ${review.userName.charAt(0).toUpperCase()}
                        </div>
                        <div class="reviewer-details">
                            <h4>${review.userName}</h4>
                            <div class="review-rating">
                                <div class="rating-stars">
                                    ${this.renderStarsHTML(review.rating)}
                                </div>
                                <span class="review-date">${this.formatReviewDate(review.date)}</span>
                            </div>
                        </div>
                    </div>
                    ${review.isUserReview ? '<span class="your-review-badge">Your Review</span>' : ''}
                </div>
                <div class="review-content">
                    <p>${review.review || 'No review text provided.'}</p>
                </div>
                <div class="review-actions">
                    <button class="helpful-btn" onclick="markReviewHelpfulDetail('${review.id}')">
                        <i class="fas fa-thumbs-up"></i>
                        Helpful (${review.helpfulCount || 0})
                    </button>
                </div>
            </div>
        `).join('');

        reviewsList.innerHTML = reviewsHTML;
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

    formatReviewDate(dateString) {
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

    getReviewsForBusiness(businessId) {
        const allReviews = JSON.parse(localStorage.getItem('businessReviews') || '{}');
        const reviews = allReviews[businessId] || [];
        return reviews.sort((a, b) => new Date(b.date) - new Date(a.date));
    }

    getAverageRating(businessId) {
        const reviews = this.getReviewsForBusiness(businessId);
        if (reviews.length === 0) return 0;
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
        return totalRating / reviews.length;
    }

    getTotalRatings(businessId) {
        return this.getReviewsForBusiness(businessId).length;
    }

    initializeMap() {
        // Only initialize ONE map based on device type
        // Hide duplicate maps
        const mapMain = document.getElementById('businessMapMain');
        const mapMobile = document.getElementById('businessMapMobile');
        const mapDesktop = document.getElementById('businessMapDesktop');

        // Determine which map to show based on device
        const isMobile = window.innerWidth <= 768;
        const isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;

        // Use main map as primary, fallback to sidebar maps if needed
        let targetMapElement = null;
        if (mapMain) {
            targetMapElement = mapMain;
        } else if (isMobile && mapMobile) {
            targetMapElement = mapMobile;
        } else if (mapDesktop) {
            targetMapElement = mapDesktop;
        }

        if (!targetMapElement || this.mapInitialized) return;

        // Get business address for geocoding
        const address = this.businessData?.location || '';
        if (!address) {
            targetMapElement.innerHTML = '<p class="text-muted">Location not available</p>';
            return;
        }

        // Initialize Google Maps
        this.initGoogleMap(targetMapElement, address);
        this.mapInitialized = true;
    }

    initGoogleMap(mapElement, address) {
        // Check if Google Maps is loaded
        if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
            // Load Google Maps script
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initBusinessMap`;
            script.async = true;
            script.defer = true;
            document.head.appendChild(script);

            // Set callback
            window.initBusinessMap = () => {
                this.createMap(mapElement, address);
            };

            // Fallback: show address if maps fail to load
            setTimeout(() => {
                if (!this.mapInstance) {
                    mapElement.innerHTML = `<p class="text-muted">Map unavailable. Address: ${address}</p>`;
                }
            }, 5000);
        } else {
            this.createMap(mapElement, address);
        }
    }

    createMap(mapElement, address) {
        // Use geocoding to get coordinates
        const geocoder = new google.maps.Geocoder();
        
        geocoder.geocode({ address: address }, (results, status) => {
            if (status === 'OK' && results[0]) {
                const location = results[0].geometry.location;
                
                const mapOptions = {
                    zoom: 15,
                    center: location,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    styles: [
                        {
                            featureType: 'poi',
                            elementType: 'labels',
                            stylers: [{ visibility: 'off' }]
                        }
                    ]
                };

                this.mapInstance = new google.maps.Map(mapElement, mapOptions);

                // Add marker
                new google.maps.Marker({
                    position: location,
                    map: this.mapInstance,
                    title: this.businessData?.name || 'Business Location'
                });
            } else {
                // Fallback: show address text
                mapElement.innerHTML = `<p class="text-muted">Map unavailable. Address: ${address}</p>`;
            }
        });
    }

    getCurrentBusinessId() {
        return this.businessId;
    }
}

// Global functions for HTML onclick events
// Note: openRatingModal is defined in local-business2.js and will be available
// This function is overridden here to use the current business ID
function openRatingModalDetail() {
    if (window.businessDetailManager && window.businessDetailManager.businessData) {
        const businessId = window.businessDetailManager.getCurrentBusinessId();
        // Use the openRatingModal function from local-business2.js if available
        if (typeof openRatingModal === 'function') {
            openRatingModal(businessId);
        } else {
            alert('Rating functionality will be available soon.');
        }
    }
}

function shareBusiness() {
    if (window.businessDetailManager && window.businessDetailManager.businessData) {
        const business = window.businessDetailManager.businessData;
        const businessId = window.businessDetailManager.getCurrentBusinessId();
        
        const shareData = {
            title: business.name,
            text: business.description,
            url: window.location.href
        };

        if (navigator.share) {
            navigator.share(shareData)
                .then(() => console.log('Business shared successfully'))
                .catch((error) => console.log('Error sharing business:', error));
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(shareData.url).then(() => {
                alert('Business link copied to clipboard!');
            }).catch(() => {
                const textArea = document.createElement('textarea');
                textArea.value = shareData.url;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                alert('Business link copied to clipboard!');
            });
        }
    }
}

function openGalleryImage(imageUrl, serviceName, index) {
    // Open image in modal or new tab
    const modal = document.getElementById('galleryModal');
    if (modal) {
        const modalImage = document.getElementById('galleryModalImage');
        const modalTitle = document.getElementById('galleryModalTitle');
        if (modalImage) modalImage.src = imageUrl;
        if (modalTitle) modalTitle.textContent = serviceName;
        
        const bootstrapModal = new bootstrap.Modal(modal);
        bootstrapModal.show();
    } else {
        window.open(imageUrl, '_blank');
    }
}

function markReviewHelpfulDetail(reviewId) {
    if (window.businessDetailManager) {
        const businessId = window.businessDetailManager.getCurrentBusinessId();
        const allReviews = JSON.parse(localStorage.getItem('businessReviews') || '{}');
        const businessReviews = allReviews[businessId] || [];
        
        const reviewIndex = businessReviews.findIndex(review => review.id === reviewId);
        if (reviewIndex !== -1) {
            businessReviews[reviewIndex].helpfulCount = (businessReviews[reviewIndex].helpfulCount || 0) + 1;
            allReviews[businessId] = businessReviews;
            localStorage.setItem('businessReviews', JSON.stringify(allReviews));
            
            // Refresh reviews display
            window.businessDetailManager.renderReviews(businessId);
        }
    }
}

function sortReviews() {
    if (window.businessDetailManager) {
        const businessId = window.businessDetailManager.getCurrentBusinessId();
        const sortBy = document.getElementById('reviewSort')?.value || 'newest';
        const reviews = window.businessDetailManager.getReviewsForBusiness(businessId);
        
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
            case 'helpful':
                sortedReviews.sort((a, b) => (b.helpfulCount || 0) - (a.helpfulCount || 0));
                break;
        }
        
        window.businessDetailManager.renderReviewsList(sortedReviews);
    }
}

function filterReviews() {
    if (window.businessDetailManager) {
        const businessId = window.businessDetailManager.getCurrentBusinessId();
        const filterBy = document.getElementById('reviewFilter')?.value || 'all';
        let reviews = window.businessDetailManager.getReviewsForBusiness(businessId);
        
        if (filterBy !== 'all') {
            reviews = reviews.filter(review => review.rating === parseInt(filterBy));
        }
        
        window.businessDetailManager.renderReviewsList(reviews);
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Only initialize on the business detail page
    if (document.getElementById('businessHero')) {
        window.businessDetailManager = new BusinessDetailManager();
    }
});

